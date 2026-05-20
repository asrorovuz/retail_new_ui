import { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
    createColumnHelper,
    type ExpandedState,
} from "@tanstack/react-table";
import {
    useCategoryApi,
    useCategoryTreeApi,
    useDeleteCategory,
} from "@/entities/categories/repository";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { Button, Table } from "@/shared/ui/kit";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import ModalCategory from "@/features/category/ModalCategory";
import {
    showErrorLocalMessage,
    showErrorMessage,
    showSuccessMessage,
} from "@/shared/lib/showMessage";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import { messages } from "@/app/constants/message.request";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    is_deleted: boolean;
    name: string;
    parent_id: number | null;
    parent: Category | null;
    children: Category[];
}

const columnHelper = createColumnHelper<Category>();

// ─── Component ────────────────────────────────────────────────────────────────

const CategoryPage = () => {
    const { data = [] } = useCategoryTreeApi();
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [modals, setModals] = useState<any[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [confirmProductId, setConfirmProductId] = useState<number | null>(
        null,
    );

    const { data: allCategory, refetch } = useCategoryApi();
    const { mutate: deleteCategory, isPending: productDeleteLoading } =
        useDeleteCategory();

    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "Наименование ",
                cell: ({ row, getValue }) => {
                    const depth = row.depth;
                    const hasChildren = row.original.children?.length > 0;

                    return (
                        <div
                            className="flex items-center gap-2"
                            style={{ paddingLeft: `${depth * 24}px` }}
                        >
                            {hasChildren ? (
                                <button
                                    onClick={row.getToggleExpandedHandler()}
                                    className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                                >
                                    {row.getIsExpanded() ? (
                                        <BiChevronDown size={15} />
                                    ) : (
                                        <BiChevronRight size={15} />
                                    )}
                                </button>
                            ) : (
                                <span className="w-5 h-5" />
                            )}

                            <span className="font-medium text-slate-800 text-sm">
                                {getValue()}
                            </span>
                        </div>
                    );
                },
            }),

            columnHelper.display({
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <div className="flex items-center gap-1 justify-end">
                        <Button
                            variant="plain"
                            size="sm"
                            className="!p-0 bg-transparent"
                            onClick={() =>
                                handleShowAdd({
                                    parent_id: row.original.parent_id, // ota kategoriya
                                    parentName:
                                        row.original.parent?.name ?? null,
                                    type: "edit", // modal edit rejimida ochiladi
                                    editId: row.original.id, // tahrirlash uchun id
                                    chainDepth: row.depth + 1, // qaysi darajada ekanligi
                                })
                            }
                            icon={
                                <FaEdit className="text-blue-500" size={22} />
                            }
                        ></Button>
                        <Button
                            variant="plain"
                            size="sm"
                            className="!p-0 bg-transparent"
                            onClick={() => {
                                setConfirmProductId(row.original.id);
                                setDeleteModalOpen(true);
                            }}
                            icon={
                                <MdDelete className="text-red-500" size={22} />
                            }
                        ></Button>
                    </div>
                ),
                size: 140,
            }),
        ],
        [],
    );

    const onCloseDeleteProductDialog = () => {
        setDeleteModalOpen(false);
        setConfirmProductId(null);
    };

    // 🧱 Mahsulot o‘chirish
    const onDeleteProduct = () => {
        if (!confirmProductId) return;
        deleteCategory(confirmProductId, {
            onSuccess: () => {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                setDeleteModalOpen(false);
                setConfirmProductId(null);
            },
            onError: (error: any) => {
                showErrorMessage(error);
                setDeleteModalOpen(false);
            },
        });
    };

    const handleShowAdd = (opts: {
        parent_id: number | null;
        parentName: string | null;
        defaultName?: string | null;
        type?: "add" | "edit" | "print";
        editId?: number | null;
        chainDepth?: number;
    }) => {
        const {
            parent_id,
            parentName,
            defaultName = null,
            type = "add",
            editId = null,
            chainDepth = 1,
        } = opts;

        if (chainDepth > 1 && parent_id) {
            showErrorLocalMessage("Подкатегория обязательна для выбора");
        }

        setModals((prev) => [
            ...prev,
            {
                id: Date.now(),
                type,
                parent_id,
                parentName,
                defaultName,
                editId,
                chainDepth,
            },
        ]);
    };

    const handleCloseModal = (id: number) => {
        setModals((prev) => prev.filter((m) => m.id !== id));
    };

    const table = useReactTable<Category>({
        data,
        columns,
        state: { expanded },
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.children,
    });

    return (
        <div className="bg-white h-screen p-2 flex flex-col gap-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <NavigateButton content={"КАТЕГОРИЯ ТОВАРОВ"} />
                <Button
                    onClick={() =>
                        handleShowAdd({
                            parent_id: null,
                            parentName: null,
                            type: "add",
                            chainDepth: 1,
                        })
                    }
                    size="sm"
                    variant="solid"
                >
                    + Добавить категорию
                </Button>
            </div>

            {/* Table */}
            <div className="flex-1 rounded-lg border border-slate-100 overflow-auto shadow-sm">
                <Table className="w-full border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-slate-200">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="text-left text-xs font-semibold text-slate-900 uppercase tracking-wide px-4 py-3"
                                        style={{ width: header.getSize() }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-12 text-sm"
                                >
                                    Категории не найдены
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                const depthColors = [
                                    "bg-white",
                                    "bg-slate-100",
                                    "bg-slate-50",
                                    "bg-white",
                                ];
                                const bg =
                                    depthColors[
                                        Math.min(
                                            row.depth,
                                            depthColors.length - 1,
                                        )
                                    ];
                                return (
                                    <tr
                                        key={row.id}
                                        className={`group border-b border-slate-100 last:border-0 transition-colors ${bg} hover:brightness-95`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-4 py-2.5"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            </div>
            {modals?.map((m) => (
                <ModalCategory
                    key={m.id}
                    id={m.id}
                    type={m.type}
                    parent_id={m.parent_id}
                    parentName={m.parentName}
                    defaultName={m.defaultName}
                    editId={m.editId}
                    chainDepth={m.chainDepth}
                    isOpen={true}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        refetch();
                        handleCloseModal(m.id);
                    }}
                    onAddSubCategory={(args) =>
                        handleShowAdd({ ...args, type: "edit" })
                    }
                    allCategory={allCategory ?? []}
                />
            ))}

            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title="Вы уверены, что хотите удалить эту категорию?"
                isOpen={deleteModalOpen}
                confirmButtonProps={{
                    loading: productDeleteLoading,
                    onClick: onDeleteProduct,
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={onCloseDeleteProductDialog}
                onRequestClose={onCloseDeleteProductDialog}
                onCancel={onCloseDeleteProductDialog}
            >
                <p className="text-gray-600">
                    После удаления восстановить категорию будет невозможно.
                </p>
            </ConfirmDialog>
        </div>
    );
};

export default CategoryPage;
