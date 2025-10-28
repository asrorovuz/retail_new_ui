import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./table/columns";
import { Button, Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import classNames from "@/shared/lib/classNames";
import TBody from "@/shared/ui/kit/Table/TBody";
import type { DraftSaleSchema } from "@/@types/sale";
import Td from "@/shared/ui/kit/Table/Td";
import { useEffect, useMemo, useState } from "react";
import TFoot from "@/shared/ui/kit/Table/TFoot";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { HiTrash } from "react-icons/hi";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";

type PropsType = {
  type: "sale" | "refund";
  draftSales: DraftSaleSchema[];
  expandedRow: string | null;
  expendedId: number | null;
  setExpandedRow: React.Dispatch<React.SetStateAction<string | null>>;
  setExpandedId: React.Dispatch<React.SetStateAction<number | null>>;
  resetActiveDraft: () => void;
  deleteDraft: (val: number) => void;
  deleteDraftItem: (val: number) => void;
};

const SaleAndRefunTable = ({
  type,
  draftSales,
  expendedId,
  setExpandedId,
  setExpandedRow,
  expandedRow,
  resetActiveDraft,
  deleteDraft,
  deleteDraftItem,
}: PropsType) => {
  const [deleteDraftItemModal, setDeleteDraftItemModal] = useState(false);
  const activeDraft: DraftSaleSchema =
    draftSales.find((s) => s.isActive) ?? draftSales[0];

  const onDeleteDraftItem = () => {
    if (expandedRow) {
      deleteDraftItem(+expandedRow);
      setExpandedRow(null);
    }
  };

  const totalPrice = useMemo(() => {
    return (
      activeDraft?.items?.reduce(
        (sum, current) => sum + (current?.totalAmount || 0),
        0
      ) ?? 0
    );
  }, [activeDraft]);

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

  console.log(expendedId);

  useEffect(() => {
    if (expendedId) {
      let itemId = table
        .getRowModel()
        .rows.find((item) => item.original?.productId === expendedId)?.id;
      setExpandedId(null);
      setExpandedRow(itemId!);
    }
  }, [expendedId]);

  return (
    <div className="bg-gray-50 rounded-2xl border overflow-auto border-gray-300 mb-4 h-[40vh]">
      <div className="flex flex-col justify-between h-full">
        <Table overflow={false} compact={true}>
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
                    onClick={() => setExpandedRow(String(rowIndex))}
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
                    <Empty textSize="text-lg" size={100} />
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
            <div></div>
            <div></div>
            <div></div>
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
