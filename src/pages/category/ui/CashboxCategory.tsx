import { messages } from "@/app/constants/message.request";
import {
    useCashboxCategoryApi,
    useCreateCashboxCategory,
    useDeleteCashboxCategory,
    useUpdateCashboxCategory,
} from "@/entities/categories/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, FormItem, Input, Table } from "@/shared/ui/kit";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import type { Category } from "@/shared/ui/kit-pro/type";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const columnHelper = createColumnHelper<Category>();

const CashboxCategory = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [id, setId] = useState<any>(null);
    const [value, setValue] = useState("");

    const { data = [] } = useCashboxCategoryApi();
    const { mutate: addMutate, isPending: addLoading } =
        useCreateCashboxCategory();
    const { mutate: editMutate, isPending: editLoading } =
        useUpdateCashboxCategory();
    const { mutate: deleteMutate, isPending: deleteLoading } =
        useDeleteCashboxCategory();

    const handleClose = () => {
        setIsOpenModal(false);
        setId(null);
        setValue("");
        setOpenDeleteModal(false);
    };

    const onOpen = (data: any, id: any) => {
        if (id) {
            setValue(data);
            setId(id);
        }
        setIsOpenModal(true);
    };

    const onDeleteProduct = () => {
        deleteMutate(id, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                handleClose();
            },
            onError(error) {
                showErrorMessage(error);
            },
        });
    };

    const onSubmit = () => {
        const payload = {
            name: value,
            parent_id: null,
        };
        if (id) {
            editMutate(
                { id, payload },
                {
                    onSuccess() {
                        showSuccessMessage(
                            messages.uz.SUCCESS_MESSAGE,
                            messages.ru.SUCCESS_MESSAGE,
                        );
                        handleClose();
                    },
                    onError(error) {
                        showErrorMessage(error);
                    },
                },
            );
        } else {
            addMutate(payload, {
                onSuccess() {
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );
                    handleClose();
                },
                onError(error) {
                    showErrorMessage(error);
                },
            });
        }
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "Название категории",
                cell: ({ getValue }) => {
                    return (
                        <div className="flex items-center gap-2">
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
                                onOpen(row?.original?.name, row?.original?.id)
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
                                setId(row?.original?.id);
                                setOpenDeleteModal(true);
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

    const table = useReactTable<any>({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="bg-white h-screen p-2 flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <NavigateButton content={"Категории кассовых операций"} />
                <Button
                    onClick={() => onOpen(null, null)}
                    size="sm"
                    variant="solid"
                >
                    + Добавить категорию
                </Button>
            </div>
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
                                return (
                                    <tr
                                        key={row.id}
                                        className={`group border-b border-slate-100 last:border-0 transition-colors hover:brightness-95`}
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

            <Dialog
                isOpen={isOpenModal}
                onClose={handleClose}
                onRequestClose={handleClose}
                title={!!id ? "Добавить категорию" : "Редактировать категорию"}
                width={"600px"}
            >
                <FormItem className="w-full" label="Название">
                    <Input
                        value={value}
                        size="sm"
                        onChange={(e) => setValue(e.target.value)}
                    />
                </FormItem>

                <div className="flex items-center justify-end gap-2 mb-5">
                    <Button type="button" size="sm" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={onSubmit}
                        disabled={addLoading || editLoading}
                    >
                        {addLoading || editLoading
                            ? "Сохранение..."
                            : "Сохранить"}
                    </Button>
                </div>

                <FullKeyboard setSearch={setValue} />
            </Dialog>

            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title="Вы уверены, что хотите удалить эту категорию?"
                isOpen={openDeleteModal}
                confirmButtonProps={{
                    loading: deleteLoading,
                    onClick: onDeleteProduct,
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={handleClose}
                onRequestClose={handleClose}
                onCancel={handleClose}
            >
                <p className="text-gray-600">
                    После удаления восстановить категорию будет невозможно.
                </p>
            </ConfirmDialog>
        </div>
    );
};

export default CashboxCategory;
