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
import type { DraftSaleSchema } from "@/@types/sale";
import Td from "@/shared/ui/kit/Table/Td";
import { useEffect, useMemo, useState } from "react";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { HiTrash } from "react-icons/hi";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import type { DraftRefundSchema } from "@/@types/refund";
import { CommonDeleteDialog } from "@/widgets/ui/delete-dialog/CommonDeleteDialog";
import type { DraftPurchaseSchema } from "@/@types/purchase";

type PropsType = {
  type: "sale" | "refund" | "purchase";
  setMark: any;
  draft: DraftSaleSchema[] | DraftRefundSchema[] | DraftPurchaseSchema[];
  activeDraft: DraftSaleSchema | DraftRefundSchema | DraftPurchaseSchema;
  expandedRow: string | null;
  expendedId: number | null;
  setExpandedRow: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedId: React.Dispatch<React.SetStateAction<number | null>>;
  deleteDraftItem: (val: number) => void;
  updateDraftItemPrice: (index: number, amount: number) => void;
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
  expandedRow,
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
      updateDraftItemTotalPrice(
        Number(expandedRow),
        newVal * (currentItem?.priceAmount || 0),
      );
    }
  };

  const increase = () => {
    const newVal = (currentItem?.quantity || 0) + 1;
    updateDraftItemQuantity(Number(expandedRow), newVal);

    updateDraftItemTotalPrice(
      Number(expandedRow),
      newVal * (currentItem?.priceAmount || 0),
    );
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
    if (expendedId) {
      let itemId = table
        .getRowModel()
        .rows.find((item) => item?.original?.productId === expendedId)?.id;
      setExpandedId(null);
      setExpandedRow(itemId!);
    }
  }, [expendedId]);

  const table = useReactTable({
    data: activeDraft?.items ?? [],
    columns: columns(setMark),
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      expanded: expandedRow ? { [expandedRow]: true } : {},
    },
  });

  return (
    <div className="overflow-hidden min-h-[48vh] xl:min-h-[44vh] mb-3 rounded-2xl">
      <div className="bg-gray-100 border-2 border-gray-100 overflow-y-auto rounded-2xl h-[48vh] xl:h-[44vh]">
        <div className="flex flex-col justify-between h-full bg-white">
          <Table
            tabIndex={Number(expandedRow)}
            key={activeDraft?.id}
            overflow={false}
            compact={true}
          >
            <THead className={"sticky top-0 bg-white"}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: header.column.getSize(),
                        }}
                        className={classNames(
                          header.column.columnDef.meta?.headerClassName,
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </THead>

            <TBody className="!bg-white">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, rowIndex) => {
                  const oddEven = rowIndex % 2 === 0;
                  return (
                    <Tr
                      key={row.id}
                      onClick={() => {
                        setExpandedRow(String(rowIndex));
                      }}
                      className={classNames(
                        oddEven ? "bg-gray-100" : "bg-white",
                        expandedRow?.toString() === row.id &&
                          (type === "sale"
                            ? "text-primary"
                            : type === "refund"
                              ? "text-red-500"
                              : "text-green-600"),
                        "cursor-pointer",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className={classNames(
                            cell.column.columnDef.meta?.bodyCellClassName,
                            "px-3 py-2 text-sm",
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      ))}
                    </Tr>
                  );
                })
              ) : (
                // 🟢 Bo‘sh holatda — Empty chiqadi
                <Tr>
                  <Td colSpan={table.getAllColumns().length}>
                    <div className="py-10 flex justify-center">
                      <Empty textSize="text-base" size={60} />
                    </div>
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
          <div className="w-full sticky bottom-0 bg-white border-t border-gray-300">
            <div className="flex items-center justify-end gap-x-2">
              <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                <div className="text-base font-medium text-gray-500">
                  Итого:{" "}
                </div>{" "}
                <div
                  className={classNames(
                    "text-base font-semibold",
                    type === "sale"
                      ? "text-primary"
                      : type === "refund"
                        ? "text-red-500"
                        : "text-green-600",
                  )}
                >
                  <FormattedNumber value={totalPrice} scale={2} /> сум{" "}
                </div>
              </div>

              {type === "sale" && activeDraft?.discountAmount ? (
                <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                  <div className="text-base font-medium text-gray-500">
                    Со скидкой:{" "}
                  </div>{" "}
                  <div
                    className={classNames(
                      "text-base font-semibold",
                      type === "sale"
                        ? "text-primary"
                        : type === "refund"
                          ? "text-red-500"
                          : "text-green-600",
                    )}
                  >
                    <FormattedNumber
                      value={totalPrice - (activeDraft?.discountAmount ?? 0)}
                      scale={2}
                    />{" "}
                    сум{" "}
                  </div>
                </div>
              ) : (
                ""
              )}

              {type === "sale" && activeDraft?.discountAmount ? (
                <div className="flex justify-end gap-x-2 items-center px-2 py-2.5">
                  <div className="text-base font-medium text-gray-500">
                    Скидка:{" "}
                  </div>{" "}
                  <div
                    className={classNames(
                      "text-base font-semibold",
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
                    сум{" "}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <div
              className={classNames(
                expandedRow && activeDraft?.items?.length
                  ? "flex items-center justify-between"
                  : "hidden",
                `px-2 py-2.5 bg-gray-100 border-t border-gray-200`,
              )}
            >
              <CommonDeleteDialog
                description={`Удалить товар "${currentItem?.productName}"? Действие нельзя будет отменить.`}
                onDelete={onDeleteDraftItem}
              >
                <Button
                  variant="plain"
                  icon={<HiTrash size={20} />}
                  className="bg-red-100 text-red-500 hover:text-red-400 active:scale-90 active:bg-red-200 transition-all duration-300"
                />
              </CommonDeleteDialog>

              {isEditing?.isOpen && isEditing?.type === "price" ? (
                <Input
                  size="sm"
                  type="number"
                  autoFocus={true}
                  className="!w-[155px] xl:!w-[220px]"
                  value={currentItem?.priceAmount ?? 0}
                  onChange={(val) => {
                    (updateDraftItemPrice(
                      Number(expandedRow),
                      Number(val?.target?.value),
                    ),
                      updateDraftItemTotalPrice(
                        Number(expandedRow),
                        Number(val?.target?.value) * currentItem?.quantity,
                      ));
                  }}
                  onBlur={() => {
                    setIsEditing({ isOpen: false, type: "" });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              ) : (
                <div
                  onClick={() => setIsEditing({ isOpen: true, type: "price" })}
                  className=" xl:w-[220px] bg-white px-3 py-3 flex items-center justify-between gap-2 rounded-lg"
                >
                  <span className="text-[14px] xl:text-base font-normal">
                    Цена:
                  </span>
                  <div className="text-[14px] xl:text-base font-medium text-gray-800">
                    <FormattedNumber value={currentItem?.priceAmount ?? 0} />
                    <span className="ml-1">сум</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-x-2 w-[154px] xl:w-auto">
                {isEditing?.type !== "quantity" &&
                  (() => {
                    const showDeleteDialog = !(
                      isEditing?.type !== "quantity" &&
                      currentItem?.quantity > 1
                    );

                    const minusButton = (
                      <Button
                        variant="solid"
                        className="w-12 h-12 p-3 flex items-center justify-center !bg-white hover:bg-gray-100 rounded-lg active:!bg-gray-200 text-gray-800"
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

                {isEditing?.isOpen && isEditing?.type === "quantity" ? (
                  <Input
                    size="md"
                    type="number"
                    className="!w-[154px] xl:!w-[100px]"
                    autoFocus={true}
                    value={currentItem?.quantity}
                    onChange={(val) => {
                      (updateDraftItemQuantity(
                        Number(expandedRow),
                        Number(val?.target?.value),
                      ),
                        updateDraftItemTotalPrice(
                          Number(expandedRow),
                          Number(val?.target?.value) * currentItem?.priceAmount,
                        ));
                    }}
                    onBlur={() => {
                      setIsEditing({ isOpen: false, type: "" });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  />
                ) : (
                  <div
                    onClick={() =>
                      setIsEditing({ isOpen: true, type: "quantity" })
                    }
                    className="w-[80px] xl:w-[100px] h-12 text-[14px] xl:text-base font-medium text-gray-800 flex items-center justify-center bg-white rounded-lg"
                  >
                    <FormattedNumber value={currentItem?.quantity} scale={2} />
                  </div>
                )}

                {isEditing?.type !== "quantity" && (
                  <Button
                    variant="solid"
                    className={classNames(
                      "w-12 h-12 p-3 flex items-center justify-center !bg-white hover:bg-gray-100 rounded-lg active:!bg-gray-200 text-gray-800",
                    )}
                    onClick={increase}
                  >
                    +
                  </Button>
                )}
              </div>

              {isEditing?.isOpen && isEditing?.type === "totalPrice" ? (
                <Input
                  size="sm"
                  type="number"
                  autoFocus
                  className="!w-[155px] xl:!w-[220px]"
                  value={currentItem?.totalAmount}
                  onChange={(val) => {
                    const recalculatedQuantity =
                      Number(val?.target?.value) / currentItem?.priceAmount;
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
                    setIsEditing({ isOpen: false, type: "" });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              ) : (
                <div
                  onClick={() =>
                    setIsEditing({ isOpen: true, type: "totalPrice" })
                  }
                  className=" xl:w-[220px] bg-white px-3 py-3 flex items-center justify-between gap-2 rounded-lg"
                >
                  <span className="text-[14px] xl:text-base font-normal">
                    Сумма:
                  </span>
                  <div className="text-[14px] xl:text-base font-medium text-gray-800">
                    <FormattedNumber
                      value={currentItem?.totalAmount}
                      scale={2}
                    />
                    <span className="ml-1">сум</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleAndRefunTable;
