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
import { useEffect, useMemo, useState } from "react";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { HiTrash } from "react-icons/hi";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import type { DraftRefundSchema } from "@/@types/refund";
import { CommonDeleteDialog } from "@/widgets/ui/delete-dialog/CommonDeleteDialog";
import type { DraftPurchaseSchema } from "@/@types/purchase";
import { getActivePrice } from "@/shared/lib/getActivatePrice";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";

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
    updateDraftItemTotalPrice: (ind: number, total: number) => void;
    updateDraftItemQuantity: (ind: number, quantity: number) => void;
};

const PurchaseTable = ({
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
    updateDraftItemTotalPrice,
    updateDraftItemQuantity,
}: PropsType) => {
    const [isEditing, setIsEditing] = useState({
        isOpen: false,
        type: "price",
    });
    const currentItem = activeDraft?.items?.[Number(expandedRow)] ?? null;
    const { updatePrices, products } = useDraftPurchaseStore();

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

    const product = useMemo(() => {
        return products?.find(
            (p: any) => p.productId === currentItem?.productId,
        );
    }, [products, currentItem?.productId]);

    const retailPrice = useMemo(() => {
        return product?.prices?.find(
            (p: any) => p?.product_price_type?.is_primary,
        );
    }, [product]);

    const bulkPrice = useMemo(() => {
        return product?.prices?.find(
            (p: any) => !p?.product_price_type?.is_primary,
        );
    }, [product]);

    // qaysi price tanlangan
    const selectedType = selectedRows?.[currentItem?.productId] ? 2 : 1;

    // input value
    const selectedPrice =
        selectedType === 1
            ? Number(retailPrice?.amount)
            : Number(bulkPrice?.amount);

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

    return (
        <>
            <div className="overflow-hidden flex-1 rounded-lg">
                <div className="border-2 border-slate-200 overflow-y-auto rounded-t-lg h-full">
                    <div className="h-full flex flex-col justify-between">
                        <Table
                            className="table-fixed border-separate border-spacing-0"
                            tabIndex={Number(expandedRow)}
                            key={activeDraft?.id}
                            overflow={false}
                            compact={true}
                        >
                            <THead className={"sticky top-0 bg-white"}>
                                {table?.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map(
                                            (header, ind) => {
                                                return (
                                                    <Th
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        style={{
                                                            width: header.column.getSize(),
                                                        }}
                                                        className={classNames(
                                                            header.column
                                                                .columnDef.meta
                                                                ?.headerClassName,
                                                            ind
                                                                ? "text-right"
                                                                : "text-left",
                                                        )}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                    </Th>
                                                );
                                            },
                                        )}
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
                                                            "bg-green-200",
                                                        "!h-max cursor-pointer text-black",
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
                                            colSpan={
                                                table.getAllColumns().length
                                            }
                                        >
                                            <Empty
                                                textSize="text-base"
                                                size={60}
                                            />
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                        <div className="w-full sticky bottom-0 bg-white border-t border-slate-200">
                            <div className="flex items-center justify-between gap-x-2">
                                <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                                    <div className="text-sm font-medium text-slate-500">
                                        Итого:{" "}
                                    </div>{" "}
                                    <div
                                        className={classNames(
                                            "text-sm font-semibold text-green-600",
                                        )}
                                    >
                                        <FormattedNumber
                                            value={totalPrice}
                                            scale={2}
                                        />
                                    </div>
                                </div>

                                {/* {type === "sale" && activeDraft?.discountAmount ? (
                <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                  <div className="text-sm font-medium text-slate-500">
                    Скидка:{" "}
                  </div>{" "}
                  <div
                    className={classNames(
                      "text-sm font-semibold",
                      type === "sale"
                        ? "text-primary"
                        : type === "refund"
                          ? "text-red-500"
                          : "text-green-600",
                    )}
                  >
                    <FormattedNumber
                      value={activeDraft?.discountAmount ?? 0}
                      scale={2}
                    />{" "}
                  </div>
                </div>
              ) : (
                ""
              )} */}

                                {/* {type === "sale" && activeDraft?.discountAmount ? (
                <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                  <div className="text-sm font-medium text-slate-500">
                    Со скидкой:{" "}
                  </div>{" "}
                  <div
                    className={classNames(
                      "text-sm font-semibold",
                      type === "sale"
                        ? "text-primary"
                        : type === "refund"
                          ? "text-red-500"
                          : "text-green-600",
                    )}
                  >
                    <FormattedNumber
                      value={
                        totalPrice - Number(activeDraft?.discountAmount ?? 0)
                      }
                      scale={2}
                    />{" "}
                  </div>
                </div>
              ) : (
                ""
              )} */}
                            </div>

                            <div
                                className={classNames(
                                    expandedRow && activeDraft?.items?.length
                                        ? "flex items-center justify-between gap-x-2"
                                        : "hidden",
                                    `py-2 px-1 bg-slate-200 border-t border-slate-200`,
                                )}
                            >
                                {isEditing?.isOpen &&
                                isEditing?.type === "price" ? (
                                    <Input
                                        size="sm"
                                        type="number"
                                        space={false}
                                        autoFocus={true}
                                        numberMode={
                                            currentItem?.productPackageName ===
                                            "шт"
                                                ? "int"
                                                : "float"
                                        }
                                        className="!w-[145px] h-8"
                                        value={currentItem?.priceAmount ?? 0}
                                        onFocus={() =>
                                            setActiveTypeKeyboard("numeric")
                                        }
                                        onChange={(val) => {
                                            const newPrice = Number(
                                                val?.target?.value,
                                            );
                                            const price = getActivePrice(
                                                {
                                                    ...currentItem,
                                                    priceAmount: newPrice,
                                                },
                                                type,
                                                selectedRows,
                                            );

                                            updateDraftItemPrice(
                                                Number(expandedRow),
                                                newPrice,
                                            );
                                            updateDraftItemTotalPrice(
                                                Number(expandedRow),
                                                price * currentItem.quantity,
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
                                                type: "price",
                                            })
                                        }
                                        className="!w-[145px] h-8 bg-white p-2 flex items-center justify-between rounded-lg"
                                    >
                                        <span className="text-xs font-normal">
                                            Цена:
                                        </span>
                                        <div className="text-xs text-nowrap font-medium text-slate-800">
                                            <FormattedNumber
                                                value={
                                                    currentItem?.priceAmount ??
                                                    0
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-x-1 w-[125px]">
                                    {isEditing?.type !== "quantity" &&
                                        (() => {
                                            const showDeleteDialog = !(
                                                isEditing?.type !==
                                                    "quantity" &&
                                                currentItem?.quantity > 1
                                            );

                                            const minusButton = (
                                                <Button
                                                    variant="solid"
                                                    className="w-8 h-8 p-2 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800"
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
                                            className="!w-[125px] h-8"
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
                                            className="w-[53px] h-8 text-xs font-medium text-slate-800 flex items-center justify-center bg-white rounded-lg"
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
                                                "w-8 h-8 p-2 flex items-center justify-center !bg-white hover:bg-slate-100 rounded-lg active:!bg-slate-200 text-slate-800",
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
                                        className="!w-[145px] h-8"
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
                                                Number(val?.target?.value) /
                                                price;
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
                                        // onClick={() => {
                                        //   if (currentItem?.productPackageName?.toLowerCase() !== "шт")
                                        //     setIsEditing({ isOpen: true, type: "totalPrice" });
                                        // }}
                                        className="bg-white h-8 w-[145px] p-2 flex items-center justify-between gap-2 rounded-lg"
                                    >
                                        <span className="text-xs font-normal">
                                            Сумма:
                                        </span>
                                        <div className="text-xs font-medium text-slate-800">
                                            <FormattedNumber
                                                value={currentItem?.totalAmount}
                                                scale={2}
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
            <div className="bg-slate-200 p-2 h-[15.7vh]">
                <div className="grid grid-cols-3 gap-x-1 items-center mb-4">
                    {/* SELECT */}
                    <Select
                        size="sm"
                        options={[
                            { value: 1, label: "Розн. цена" },
                            { value: 2, label: "Опт. цена" },
                        ]}
                        className="text-xs"
                        value={
                            selectedRows?.[currentItem?.productId]
                                ? { value: 2, label: "Опт. цена" }
                                : { value: 1, label: "Розн. цена" }
                        }
                        onChange={(val: any) => {
                            setSelectedRows((prev: any) => ({
                                ...prev,
                                [currentItem?.productId]: val.value === 2,
                            }));
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                height: "30px",
                                minHeight: "30px",
                                borderRadius: "8px",
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                    />

                    {/* INPUT PRICE */}
                    <Input
                        size="sm"
                        type="number"
                        space={false}
                        className="!w-[135px] h-[30px] text-xs"
                        value={String(selectedPrice ?? 0) ?? 0}
                        onFocus={() => setActiveTypeKeyboard("numeric")}
                        onChange={(val) => {
                            const newAmount = Number(val.target.value);

                            const priceId =
                                selectedType === 1
                                    ? retailPrice?.id
                                    : bulkPrice?.id;

                            updatePrices(
                                {
                                    id: currentItem?.productId,
                                    price_id: priceId,
                                },
                                String(newAmount ?? 0),
                            );
                        }}
                    />

                    {/* INFO */}
                    <div className="flex flex-col text-xs font-normal text-slate-800">
                        <div className="flex justify-between gap-x-2">
                            <span className="text-slate-600">Розничная:</span>
                            <FormattedNumber value={retailPrice?.amount ?? 0} />
                        </div>

                        <div className="flex justify-between gap-x-2">
                            <span className="text-slate-600">Оптовая:</span>
                            <FormattedNumber value={bulkPrice?.amount ?? 0} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-x-1 items-center">
                    <Select
                        size="sm"
                        options={[
                            { value: 1, label: "Розн. цена" },
                            { value: 2, label: "Опт. цена" },
                        ]}
                        isDisabled
                        className="text-xs"
                        placeholder={"Скидка"}
                        // value={
                        //   selectedRows?.[currentItem?.productId]
                        //     ? { value: 2, label: "Опт. цена" }
                        //     : { value: 1, label: "Розн. цена" }
                        // }
                        onChange={(val: any) => {
                            setSelectedRows((prev: any) => ({
                                ...prev,
                                [currentItem?.productId]: val.value === 2,
                            }));
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                height: "30px",
                                minHeight: "30px",
                                borderRadius: "8px",
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                    />

                    {/* INPUT PRICE */}
                    <Input
                        size="sm"
                        type="number"
                        disabled
                        space={false}
                        className="!w-[135px] h-[30px] text-xs"
                        placeholder="Скидка"
                        // value={String(selectedPrice ?? 0) ?? 0}
                        onFocus={() => setActiveTypeKeyboard("numeric")}
                        onChange={(val) => {
                            const newAmount = Number(val.target.value);

                            const priceId =
                                selectedType === 1
                                    ? retailPrice?.id
                                    : bulkPrice?.id;

                            updatePrices(
                                {
                                    id: currentItem?.productId,
                                    price_id: priceId,
                                },
                                String(newAmount ?? 0),
                            );
                        }}
                    />

                    {/* INFO */}
                    <div className="flex flex-col text-xs font-normal text-slate-800">
                        <div className="flex justify-between gap-x-2">
                            <span className="text-slate-600">Скидка:</span>0
                        </div>

                        <div className="flex justify-between gap-x-2">
                            <span className="text-slate-600">Скидка:</span>0
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchaseTable;
