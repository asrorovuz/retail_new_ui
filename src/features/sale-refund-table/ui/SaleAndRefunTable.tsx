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
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import type { DraftRefundSchema } from "@/@types/refund";

type PropsType = {
  type: "sale" | "refund";
  draft: DraftSaleSchema[] | DraftRefundSchema[];
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
  draft,
  expendedId,
  setExpandedId,
  setExpandedRow,
  expandedRow,
  deleteDraftItem,
  updateDraftItemPrice,
  updateDraftItemTotalPrice,
  updateDraftItemQuantity,
}: PropsType) => {
  const [deleteDraftItemModal, setDeleteDraftItemModal] = useState(false);
  const [isEditing, setIsEditing] = useState({
    isOpen: false,
    type: "price",
  });
  const activeDraft: DraftSaleSchema =
    draft?.find((s) => s.isActive) ?? draft[0];
  const currentItem = activeDraft?.items?.[Number(expandedRow)] ?? null;

  const onDeleteDraftItem = () => {
    if (expandedRow) {
      deleteDraftItem(+expandedRow);
      setExpandedRow(null);
    }
  };

  const decrease = () => {
    const newVal = (currentItem?.quantity || 0) - 1;
    if (newVal > 0) {
      updateDraftItemQuantity(Number(expandedRow), newVal);
      updateDraftItemTotalPrice(
        Number(expandedRow),
        newVal * (currentItem?.priceAmount || 0)
      );
    }
  };

  const increase = () => {
    const newVal = (currentItem?.quantity || 0) + 1;
    updateDraftItemQuantity(Number(expandedRow), newVal);
    updateDraftItemTotalPrice(
      Number(expandedRow),
      newVal * (currentItem?.priceAmount || 0)
    );
  };

  const totalPrice = useMemo(() => {
    return (
      activeDraft?.items?.reduce(
        (sum, current) => sum + (current?.totalAmount || 0),
        0
      ) ?? 0
    );
  }, [activeDraft]);

  useEffect(() => {
    if (expendedId) {
      let itemId = table
        .getRowModel()
        .rows.find((item) => item.original?.productId === expendedId)?.id;
      setExpandedId(null);
      setExpandedRow(itemId!);
    }
  }, [expendedId]);

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

  return (
    <div className="bg-gray-50 rounded-2xl border overflow-auto border-gray-300 mb-3 h-[42vh]">
      <div className="flex flex-col justify-between h-full">
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
                        header.column.columnDef.meta?.headerClassName
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </THead>

          <TBody>
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
                      oddEven ? "bg-gray-50" : "bg-white",
                      expandedRow?.toString() === row.id && "text-primary"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={classNames(
                          cell.column.columnDef.meta?.bodyCellClassName,
                          "px-3 py-2 text-sm"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
                    <Empty textSize="text-lg" size={60} />
                  </div>
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>
        <div className="w-full sticky bottom-0 bg-white border-t border-gray-600">
          <div className="flex justify-between items-center px-2 py-2.5">
            <div className="text-sm font-medium text-gray-500">
              Итого к Оплату{" "}
            </div>{" "}
            <div className="text-primary text-base font-semibold">
              <FormattedNumber value={totalPrice} scale={2} /> сум{" "}
            </div>
          </div>
          <div
            className={classNames(
              expandedRow ? "flex items-center justify-between" : "hidden",
              `px-2 py-2.5 bg-gray-50 border-t border-gray-600`
            )}
          >
            <Button
              variant="plain"
              onClick={() => setDeleteDraftItemModal(true)}
              icon={<HiTrash />}
              className="bg-red-100 text-red-500 hover:text-red-400 active:scale-90 active:bg-red-200 transition-all duration-300"
            ></Button>

            {isEditing?.isOpen && isEditing?.type === "price" ? (
              <Input
                size="sm"
                type="number"
                autoFocus
                className="w-[200px]!"
                value={currentItem?.priceAmount}
                onChange={(val) => {
                  updateDraftItemPrice(
                    Number(expandedRow),
                    Number(val?.target?.value)
                  ),
                    updateDraftItemTotalPrice(
                      Number(expandedRow),
                      Number(val?.target?.value) * currentItem?.quantity
                    );
                  console.log(val);
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
              <div className="bg-white px-3 py-3 flex items-center justify-between gap-2 rounded-lg w-[200px]">
                <span className="text-base font-normal">Цена:</span>
                <div
                  onDoubleClick={() =>
                    setIsEditing({ isOpen: true, type: "price" })
                  }
                  className="text-base font-medium text-gray-800"
                >
                  <FormattedNumber value={currentItem?.priceAmount} />
                  <span className="ml-1">сум</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-x-2">
              {isEditing?.type !== "quantity" && (
                <Button
                  variant="solid"
                  className={classNames(
                    "w-12 h-12 p-3 flex items-center justify-center bg-white hover:bg-gray-50 rounded-lg active:bg-gray-400 text-gray-800"
                  )}
                  onClick={decrease}
                >
                  -
                </Button>
              )}

              {isEditing?.isOpen && isEditing?.type === "quantity" ? (
                <Input
                  size="md"
                  type="number"
                  autoFocus
                  value={currentItem?.quantity}
                  onChange={(val) => {
                    updateDraftItemQuantity(
                      Number(expandedRow),
                      Number(val?.target?.value)
                    ),
                      updateDraftItemTotalPrice(
                        Number(expandedRow),
                        Number(val?.target?.value) * currentItem?.priceAmount
                      );
                    console.log(val);
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
                  onDoubleClick={() =>
                    setIsEditing({ isOpen: true, type: "quantity" })
                  }
                  className="w-[100px] h-12 text-base font-medium text-gray-800 flex items-center justify-center bg-white rounded-lg"
                >
                  <FormattedNumber value={currentItem?.quantity} />
                </div>
              )}

              {isEditing?.type !== "quantity" && (
                <Button
                  variant="solid"
                  className={classNames(
                    "w-12 h-12 p-3 flex items-center justify-center bg-white hover:bg-gray-50 rounded-lg active:bg-gray-400 text-gray-800"
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
                className="w-[200px]!"
                value={currentItem?.totalAmount}
                onChange={(val) => {
                  const recalculatedQuantity = Number(val?.target?.value) / currentItem?.priceAmount;
                  updateDraftItemQuantity(
                    Number(expandedRow),
                    recalculatedQuantity
                  ),
                    updateDraftItemTotalPrice(
                      Number(expandedRow),
                      Number(val?.target?.value)
                    );
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
              <div className="bg-white px-3 py-3 flex items-center justify-between gap-2 rounded-lg w-[200px]">
                <span className="text-base font-normal">Сумма:</span>
                <div
                  onDoubleClick={() =>
                    setIsEditing({ isOpen: true, type: "totalPrice" })
                  }
                  className="text-base font-medium text-gray-800"
                >
                  <FormattedNumber value={currentItem?.totalAmount} />
                  <span className="ml-1">сум</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        type="danger"
        className={"w-[400px]"}
        title="Удалить кассу"
        isOpen={deleteDraftItemModal}
        confirmButtonProps={{
          onClick: () => {
            onDeleteDraftItem(), setDeleteDraftItemModal(false);
          },
        }}
        description="Вы хотите удалить кассу?"
        cancelText="Отмена"
        confirmText="Удалить"
        onClose={() => setDeleteDraftItemModal(false)}
        onCancel={() => setDeleteDraftItemModal(false)}
      ></ConfirmDialog>
    </div>
  );
};

export default SaleAndRefunTable;
