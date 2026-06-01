import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { columns } from "./table/columns";
import { Button, Input, Select, Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import classNames from "@/shared/lib/classNames";
import TBody from "@/shared/ui/kit/Table/TBody";
import type { DraftSaleSchema } from "@/@types/sale";
import Td from "@/shared/ui/kit/Table/Td";
import { useEffect, useMemo, useRef, useState } from "react";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { HiTrash } from "react-icons/hi";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import type { DraftRefundSchema } from "@/@types/refund";
import { CommonDeleteDialog } from "@/widgets/ui/delete-dialog/CommonDeleteDialog";
import type { DraftPurchaseSchema } from "@/@types/purchase";
import { getActivePrice } from "@/shared/lib/getActivatePrice";
import { components } from "react-select";
import { BsChevronDown } from "react-icons/bs";

type PropsType = {
    type: "sale" | "refund" | "purchase";
    setMark: any;
    draft: DraftSaleSchema[] | DraftRefundSchema[] | DraftPurchaseSchema[];
    activeDraft: DraftSaleSchema | DraftRefundSchema | DraftPurchaseSchema;
    expandedRow: string | null;
    expendedId: number | null;
    setSelectedRows?: any;
    selectedRows?: any;
    setActiveTypeKeyboard: (type: "numeric" | "qwerty") => void;
    setExpandedRow: React.Dispatch<React.SetStateAction<string | null>>;
    setExpandedId: React.Dispatch<React.SetStateAction<number | null>>;
    deleteDraftItem: (val: number) => void;
    updateDraftItemPrice: (index: number, amount: number) => void;
    updateDraftItemPriceBulk?: (index: number, amount: number) => void;
    updateDraftItemTotalPrice: (ind: number, total: number) => void;
    updateDraftItemQuantity: (ind: number, quantity: number) => void;
};

const SaleAndRefunTable = ({
    type,
    setMark,
    activeDraft,
    expendedId,
    setExpandedId,
    setExpandedRow,
    setActiveTypeKeyboard,
    expandedRow,
    selectedRows,
    setSelectedRows,
    deleteDraftItem,
    updateDraftItemPrice,
    updateDraftItemPriceBulk,
    updateDraftItemTotalPrice,
    updateDraftItemQuantity,
}: PropsType) => {
    const [isEditing, setIsEditing] = useState({
        isOpen: false,
        type: "price",
    });
    const currentItem = activeDraft?.items?.[Number(expandedRow)] ?? null;
    const [localValue, setLocalValue] = useState<string>(
        String(getActivePrice(currentItem, type, selectedRows) ?? 0),
    );
    const [localQuantity, setLocalQuantity] = useState<string>(
        String(currentItem?.quantity ?? 0),
    );

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
            const price = getActivePrice(currentItem, type, selectedRows);
            updateDraftItemQuantity(Number(expandedRow), newVal);
            updateDraftItemTotalPrice(Number(expandedRow), newVal * price);
        }
    };

    const increase = () => {
        const newVal = (currentItem?.quantity || 0) + 1;
        updateDraftItemQuantity(Number(expandedRow), newVal);
        const price = getActivePrice(currentItem, type, selectedRows);

        updateDraftItemTotalPrice(Number(expandedRow), newVal * price);
    };

    const totalPrice = useMemo(() => {
        return (
            activeDraft?.items?.reduce(
                (sum, current) => sum + (current?.totalAmount || 0),
                0,
            ) ?? 0
        );
    }, [activeDraft]);

    useEffect(() => {
        setLocalQuantity(String(currentItem?.quantity ?? 0));
    }, [currentItem]);

    useEffect(() => {
        setLocalValue(
            String(getActivePrice(currentItem, type, selectedRows) ?? 0),
        );
    }, [currentItem, type, selectedRows]);

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!expandedRow) return;
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if (isEditing.isOpen) return;

            if (e.key === "ArrowRight") {
                e.preventDefault();
                increaseRef.current();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                decreaseRef.current();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [expandedRow, isEditing.isOpen]);

    const table = useReactTable({
        data: activeDraft?.items ?? [],
        columns: columns(setMark, type, selectedRows),
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            expanded: expandedRow ? { [expandedRow]: true } : {},
        },
    });

    const SmallDropdownIndicator = (props: any) => (
        <components.DropdownIndicator {...props}>
            <span className="text-slate-500">
                <BsChevronDown size={12} />
            </span>{" "}
            {/* icon o‘lchami 14px */}
        </components.DropdownIndicator>
    );

    return (
        <div className="overflow-hidden flex-1 rounded-lg">
            <div className="border-2 border-slate-200 overflow-y-auto rounded-lg h-full">
                <div className="h-full flex flex-col justify-between">
                    <Table
                        className="table-fixed"
                        tabIndex={Number(expandedRow)}
                        key={activeDraft?.id}
                        overflow={false}
                        compact={true}
                    >
                        <THead className={"sticky top-0 z-20 bg-white"}>
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
                                                    "border",
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
                                                    "bg-white text-black",
                                                    expandedRow?.toString() ===
                                                        row.id &&
                                                        (type === "sale"
                                                            ? "bg-blue-200"
                                                            : type === "refund"
                                                              ? "bg-red-200"
                                                              : "bg-slate-200"),
                                                    "!h-max cursor-pointer",
                                                )}
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell, index) => (
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
                                                            <div
                                                                className={
                                                                    !index
                                                                        ? "min-w-[220px]"
                                                                        : ""
                                                                }
                                                            >
                                                                {flexRender(
                                                                    cell.column
                                                                        .columnDef
                                                                        .cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </div>
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
                        <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                            <div className="text-2xl font-medium text-slate-700">
                                Итого:{" "}
                            </div>{" "}
                            <div
                                className={classNames(
                                    "font-semibold text-2xl",
                                    type === "sale"
                                        ? "text-primary"
                                        : type === "refund"
                                          ? "text-red-500"
                                          : "text-green-600",
                                )}
                            >
                                <FormattedNumber value={totalPrice} />
                            </div>
                        </div>

                        <div
                            className={classNames(
                                expandedRow && activeDraft?.items?.length
                                    ? "flex items-center justify-between gap-x-1"
                                    : "hidden",
                                `py-2 px-1 bg-slate-200 border-t border-slate-200`,
                            )}
                        >
                            <span className="w-1/4 text-xs font-normal">
                                <Select
                                    size="sm"
                                    className="h-8 text-xs"
                                    options={[
                                        {
                                            value: 1,
                                            label: "Розн. цена",
                                        },
                                        {
                                            value: 2,
                                            label: "Опт. цена",
                                        },
                                    ]}
                                    components={{
                                        DropdownIndicator:
                                            SmallDropdownIndicator,
                                    }}
                                    isSearchable={false}
                                    value={
                                        selectedRows?.[currentItem?.productId]
                                            ? {
                                                  value: 2,
                                                  label: "Опт. цена",
                                              }
                                            : {
                                                  value: 1,
                                                  label: "Розн. цена",
                                              }
                                    }
                                    onChange={(val: any) => {
                                        // Selectdan tanlash
                                        const activeIndex = Number(expandedRow);
                                        const product =
                                            activeDraft?.items?.[
                                                Number(expandedRow)
                                            ] ?? null;

                                        setSelectedRows((prev: any) => ({
                                            ...prev,
                                            [currentItem?.productId]:
                                                val.value === 2,
                                        }));

                                        if (updateDraftItemTotalPrice) {
                                            const price =
                                                val.value === 2 &&
                                                (product?.priceAmoutBulk ?? 0) >
                                                    0
                                                    ? (product?.priceAmoutBulk ??
                                                      0) // OPT
                                                    : (product?.priceAmount ??
                                                      0); // ODDIY

                                            const newTotal =
                                                currentItem.quantity * price;

                                            updateDraftItemTotalPrice(
                                                activeIndex,
                                                isNaN(newTotal) ? 0 : newTotal,
                                            );
                                        }
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
                            </span>
                            {isEditing?.isOpen &&
                            isEditing?.type === "price" ? (
                                <Input
                                    size="sm"
                                    type="number"
                                    space={false}
                                    autoFocus={true}
                                    numberMode={
                                        currentItem?.productPackageName === "шт"
                                            ? "int"
                                            : "float"
                                    }
                                    className="!w-1/4 h-8"
                                    value={localValue}
                                    onFocus={() =>
                                        setActiveTypeKeyboard("numeric")
                                    }
                                    onChange={(val) => {
                                        const raw = val?.target?.value;
                                        setLocalValue(raw);

                                        const newPrice = Number(raw);
                                        if (isNaN(newPrice)) return;
                                        // const price = getActivePrice(
                                        //     {
                                        //         ...currentItem,
                                        //         priceAmount: newPrice,
                                        //     },
                                        //     type,
                                        //     selectedRows,
                                        // );
                                        const isOptom =
                                            selectedRows?.[
                                                currentItem?.productId
                                            ];

                                        if (
                                            isOptom &&
                                            updateDraftItemPriceBulk
                                        ) {
                                            updateDraftItemPriceBulk(
                                                Number(expandedRow),
                                                newPrice,
                                            );
                                        } else {
                                            updateDraftItemPrice(
                                                Number(expandedRow),
                                                newPrice,
                                            );
                                        }
                                        updateDraftItemTotalPrice(
                                            Number(expandedRow),
                                            newPrice * currentItem.quantity,
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
                                <>
                                    <div
                                        onClick={() =>
                                            setIsEditing({
                                                isOpen: true,
                                                type: "price",
                                            })
                                        }
                                        className="bg-white h-8 w-1/4 p-2 flex items-center justify-between gap-2 rounded-lg"
                                    >
                                        <FormattedNumber
                                            value={
                                                getActivePrice(
                                                    currentItem,
                                                    type,
                                                    selectedRows,
                                                ) ?? 0
                                            }
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center gap-x-1 w-1/4">
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
                                        value={localQuantity}
                                        onFocus={() =>
                                            setActiveTypeKeyboard("numeric")
                                        }
                                        onChange={(val) => {
                                            const raw = val?.target?.value;
                                            setLocalQuantity(raw);
                                            {
                                                /* ← avval local state */
                                            }

                                            const qty = Number(raw);
                                            if (isNaN(qty)) return;
                                            const price = getActivePrice(
                                                currentItem,
                                                type,
                                                selectedRows,
                                            );

                                            updateDraftItemQuantity(
                                                Number(expandedRow),
                                                qty,
                                            );
                                            updateDraftItemTotalPrice(
                                                Number(expandedRow),
                                                qty * price,
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

                            {isEditing?.isOpen &&
                            isEditing?.type === "totalPrice" ? (
                                <Input
                                    size="sm"
                                    type="number"
                                    space={false}
                                    autoFocus
                                    className="!w-1/4 h-8"
                                    value={currentItem?.totalAmount}
                                    onFocus={() =>
                                        setActiveTypeKeyboard("numeric")
                                    }
                                    onChange={(val) => {
                                        const price = getActivePrice(
                                            currentItem,
                                            type,
                                            selectedRows,
                                        );
                                        const recalculatedQuantity =
                                            Number(val?.target?.value) / price;
                                        (updateDraftItemQuantity(
                                            Number(expandedRow),
                                            recalculatedQuantity,
                                        ),
                                            updateDraftItemTotalPrice(
                                                Number(expandedRow),
                                                Number(val?.target?.value),
                                            ));
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
                                    onClick={() => {
                                        if (
                                            currentItem?.productPackageName?.toLowerCase() !==
                                            "шт"
                                        )
                                            setIsEditing({
                                                isOpen: true,
                                                type: "totalPrice",
                                            });
                                    }}
                                    className="bg-white h-8 w-1/4 p-2 flex items-center justify-between gap-2 rounded-lg"
                                >
                                    <span className="text-xs font-normal">
                                        Сумма:
                                    </span>
                                    <div className="text-xs font-medium text-slate-800">
                                        <FormattedNumber
                                            value={currentItem?.totalAmount}
                                        />
                                    </div>
                                </div>
                            )}

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

export default SaleAndRefunTable;
