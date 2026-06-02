import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { columns } from "./table/columns";
import { Button, Input, Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import classNames from "@/shared/lib/classNames";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import { useEffect, useRef, useState } from "react";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { HiTrash } from "react-icons/hi";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import { CommonDeleteDialog } from "@/widgets/ui/delete-dialog/CommonDeleteDialog";
import { type RevisionDraft } from "@/app/store/useRevision";
// import { BsChevronDown } from "react-icons/bs";
// import { components } from "react-select";

type PropsType = {
    type: "revision" | "writeof";
    activeDraft: RevisionDraft;
    expandedRow: string | null;
    expendedId: number | null;
    keyType?: "numeric" | "qwerty" | "fullkey";
    setActiveTypeKeyboard: (type: "numeric" | "qwerty") => void;
    setExpandedRow: React.Dispatch<React.SetStateAction<string | null>>;
    setExpandedId: React.Dispatch<React.SetStateAction<number | null>>;
    deleteDraftItem: (val: number) => void;
    updateDraftItemQuantity: (ind: number, quantity: number) => void;
};

const RevisionTable = ({
    // type,
    activeDraft,
    expendedId,
    setExpandedId,
    setExpandedRow,
    setActiveTypeKeyboard,
    expandedRow,
    keyType,
    deleteDraftItem,
    updateDraftItemQuantity,
}: PropsType) => {
    const [isEditing, setIsEditing] = useState({
        isOpen: false,
        type: "price",
    });
    const currentItem = activeDraft?.items?.[Number(expandedRow)] ?? null;
    // const [priceStatus, setPriceStatus] = useState<{
    //     [key: number]: boolean;
    // }>({});

    const onDeleteDraftItem = () => {
        if (expandedRow) {
            deleteDraftItem(+expandedRow);
            setExpandedRow(null);
        }
    };

    const decrease = () => {
        const newVal = (currentItem?.quantity || 0) - 1;

        if (currentItem?.quantity === 1) {
            deleteDraftItem(Number(expandedRow));
            setExpandedRow(null);
            return;
        }

        if (newVal > 0) {
            updateDraftItemQuantity(Number(expandedRow), newVal);
        }
    };

    const increase = () => {
        const newVal = (currentItem?.quantity || 0) + 1;
        updateDraftItemQuantity(Number(expandedRow), newVal);
    };

    useEffect(() => {
        if (expendedId) {
            let itemId = table
                .getRowModel()
                .rows.find(
                    (item) => item?.original?.productId === expendedId,
                )?.id;
            setExpandedId(null);
            setExpandedRow(itemId!);
        }
    }, [expendedId]);

    const increaseRef = useRef(increase);
    increaseRef.current = increase;
    const decreaseRef = useRef(decrease);
    decreaseRef.current = decrease;

    const keyTypeRef = useRef(keyType);
    keyTypeRef.current = keyType;
    const expandedRowRef = useRef(expandedRow);
    expandedRowRef.current = expandedRow;
    const itemsRef = useRef(activeDraft?.items);
    itemsRef.current = activeDraft?.items;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if (isEditing.isOpen) return;

            const items = itemsRef.current;

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                if (keyTypeRef.current === "qwerty") return;
                if (!items?.length) return;
                e.preventDefault();
                const currentIndex =
                    expandedRowRef.current !== null
                        ? Number(expandedRowRef.current)
                        : -1;
                const next =
                    e.key === "ArrowDown"
                        ? Math.min(currentIndex + 1, items.length - 1)
                        : Math.max(currentIndex - 1, 0);
                setExpandedRow(String(next));
            } else if (e.key === "ArrowRight") {
                if (!expandedRowRef.current) return;
                e.preventDefault();
                increaseRef.current();
            } else if (e.key === "ArrowLeft") {
                if (!expandedRowRef.current) return;
                e.preventDefault();
                decreaseRef.current();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEditing.isOpen]);

    const table = useReactTable({
        data: activeDraft?.items ?? [],
        columns: columns(),
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            expanded: expandedRow ? { [expandedRow]: true } : {},
        },
    });

    // const SmallDropdownIndicator = (props: any) => (
    //     <components.DropdownIndicator {...props}>
    //         <span className="text-slate-500">
    //             <BsChevronDown size={12} />
    //         </span>{" "}
    //         {/* icon o‘lchami 14px */}
    //     </components.DropdownIndicator>
    // );

    return (
        <div className="overflow-hidden flex-1 rounded-lg">
            <div className="border-2 border-slate-200 overflow-y-auto rounded-lg  h-full">
                <div className="h-full flex flex-col justify-between">
                    <Table
                        className="table-fixed"
                        tabIndex={Number(expandedRow)}
                        key={activeDraft?.id}
                        overflow={false}
                        compact={true}
                    >
                        <THead className={"sticky top-0"}>
                            {table?.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, ind) => {
                                        return (
                                            <Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                style={{
                                                    width: header.column.getSize(),
                                                }}
                                                className={classNames(
                                                    header.column.columnDef.meta
                                                        ?.headerClassName,
                                                    ind
                                                        ? "text-right"
                                                        : "text-left",
                                                )}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                            </Th>
                                        );
                                    })}
                                </Tr>
                            ))}
                        </THead>

                        <TBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table
                                    .getRowModel()
                                    .rows.map((row, rowIndex) => {
                                        return (
                                            <Tr
                                                key={row.id}
                                                onClick={() => {
                                                    setExpandedRow(
                                                        String(rowIndex),
                                                    );
                                                }}
                                                className={classNames(
                                                    expandedRow?.toString() ===
                                                        row.id &&
                                                        "text-slate-900",
                                                    "!h-max cursor-pointer",
                                                )}
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <Td
                                                            key={cell.id}
                                                            style={{
                                                                width: cell.column.getSize(),
                                                            }}
                                                            className={classNames(
                                                                cell.column
                                                                    .columnDef
                                                                    .meta
                                                                    ?.bodyCellClassName,
                                                                "p-2 text-xs",
                                                            )}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </Td>
                                                    ))}
                                            </Tr>
                                        );
                                    })
                            ) : (
                                // 🟢 Bo‘sh holatda — Empty chiqadi
                                <Tr key="empty">
                                    <Td
                                        className="!py-20"
                                        colSpan={table.getAllColumns().length}
                                    >
                                        <Empty textSize="text-base" size={60} />
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                    <div className="w-full sticky bottom-0 bg-white border-t border-slate-200">
                        <div
                            className={classNames(
                                expandedRow && activeDraft?.items?.length
                                    ? "flex items-center justify-between gap-x-1"
                                    : "hidden",
                                `py-2 px-1 bg-slate-200 border-t border-slate-200`,
                            )}
                        >
                            {/* <span className="w-1/4 text-xs font-normal">
                                    <Select
                                        size="sm"
                                        className="h-8 text-xs"
                                        isDisabled={type === "writeof"}
                                        options={[
                                            {
                                                value: false,
                                                label: "Розн. цена",
                                            },
                                            { value: true, label: "Опт. цена" },
                                        ]}
                                        isSearchable={false}
                                        components={{
                                            DropdownIndicator:
                                                SmallDropdownIndicator,
                                        }}
                                        value={{
                                            value:
                                                priceStatus[
                                                    currentItem?.productId
                                                ] ?? false,
                                            label: priceStatus[
                                                currentItem?.productId
                                            ]
                                                ? "Опт. цена"
                                                : "Розн. цена",
                                        }}
                                        onChange={(val: any) => {
                                            setPriceStatus((prev) => ({
                                                ...prev,
                                                [currentItem?.productId]:
                                                    val.value, // true yoki false saqlanadi
                                            }));
                                        }}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                border: "none",
                                                minHeight: "32px",
                                                boxShadow: "none",
                                            }),

                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                        }}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                </span> */}
                            <div className="bg-white h-8 w-1/4 p-2 flex items-center justify-between gap-2 rounded-lg">
                                <FormattedNumber
                                    value={currentItem?.priceAmount ?? 0}
                                />
                            </div>

                            <div className="flex items-center gap-x-1 w-full flex-1">
                                {isEditing?.type !== "quantity" &&
                                    (() => {
                                        const showDeleteDialog = !(
                                            isEditing?.type !== "quantity" &&
                                            currentItem?.quantity > 1
                                        );

                                        const minusButton = (
                                            <Button
                                                variant="solid"
                                                className="w-10 h-8 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800"
                                                onClick={decrease}
                                            >
                                                -
                                            </Button>
                                        );

                                        return showDeleteDialog ? (
                                            <CommonDeleteDialog
                                                description={`Удалить товар "${currentItem?.productName}"? Действие нельзя будет отменить.`}
                                                onDelete={onDeleteDraftItem}
                                            >
                                                {minusButton}
                                            </CommonDeleteDialog>
                                        ) : (
                                            minusButton
                                        );
                                    })()}

                                {isEditing?.isOpen &&
                                isEditing?.type === "quantity" ? (
                                    <Input
                                        size="md"
                                        type="number"
                                        className="h-8"
                                        autoFocus={true}
                                        space={false}
                                        numberMode={
                                            currentItem?.productPackageName ===
                                            "шт"
                                                ? "int"
                                                : "float"
                                        }
                                        value={currentItem?.quantity}
                                        onFocus={() =>
                                            setActiveTypeKeyboard("numeric")
                                        }
                                        onChange={(val) => {
                                            const qty = Number(
                                                val?.target?.value,
                                            );

                                            updateDraftItemQuantity(
                                                Number(expandedRow),
                                                qty,
                                            );
                                        }}
                                        onBlur={() => {
                                            setIsEditing({
                                                isOpen: false,
                                                type: "",
                                            });
                                        }}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === "Escape"
                                            ) {
                                                (
                                                    e.target as HTMLInputElement
                                                ).blur();
                                            }
                                        }}
                                    />
                                ) : (
                                    <div
                                        onClick={() =>
                                            setIsEditing({
                                                isOpen: true,
                                                type: "quantity",
                                            })
                                        }
                                        className="w-full h-8 text-xs font-medium text-slate-800 flex items-center justify-center bg-white rounded-lg"
                                    >
                                        <FormattedNumber
                                            value={currentItem?.quantity}
                                            scale={3}
                                        />
                                    </div>
                                )}

                                {isEditing?.type !== "quantity" && (
                                    <Button
                                        variant="solid"
                                        className={classNames(
                                            "w-10 h-8 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800",
                                        )}
                                        onClick={increase}
                                    >
                                        +
                                    </Button>
                                )}
                            </div>

                            <div className="bg-white h-8 w-1/4 p-2 flex items-center justify-between gap-2 rounded-lg">
                                <span className="text-xs font-normal">
                                    Сумма:
                                </span>
                                <div className="text-xs font-medium text-slate-800">
                                    <FormattedNumber
                                        value={
                                            (currentItem?.priceAmount ?? 0) *
                                            currentItem?.quantity
                                        }
                                    />
                                </div>
                            </div>

                            <CommonDeleteDialog
                                description={`Удалить товар "${currentItem?.productName}"? Действие нельзя будет отменить.`}
                                onDelete={onDeleteDraftItem}
                            >
                                <Button
                                    variant="plain"
                                    size="sm"
                                    icon={<HiTrash size={20} />}
                                    className="bg-red-100 text-red-500 hover:text-red-400 active:scale-90 active:bg-red-200 transition-all duration-300 h-8 w-8"
                                />
                            </CommonDeleteDialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevisionTable;
