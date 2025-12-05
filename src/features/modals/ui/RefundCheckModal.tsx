import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button, Dialog, Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import classNames from "@/shared/lib/classNames";

type RefundItem = {
  id: number;
  warehouse_operation_from?: {
    product?: { name?: string };
  };
  price_amount: number;
  quantity: number;
};

type RefundCheckModalProps = {
  isOpen: boolean;
  setRefundCheckModal: (state: { isOpen: boolean; ids: number[] }) => void;
  items: RefundItem[];
  handleRefundCheckInputItem: (selectedIds: number[]) => void;
};

const RefundCheckModal = ({
  isOpen,
  setRefundCheckModal,
  items,
  handleRefundCheckInputItem,
}: RefundCheckModalProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal ochilganda barcha itemlar avtomatik tanlanadi
  useEffect(() => {
    if (isOpen && items?.length) {
      setSelectedIds(items.map((i) => i.id));
    }
  }, [isOpen, items]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? items.map((i) => i.id) : []);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  // Tanstack table uchun ustunlar
  const columns = useMemo<ColumnDef<RefundItem>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={
              items?.length ? selectedIds.length === items.length : false
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={(e) => handleSelectRow(row.original.id, e.target.checked)}
            className="w-4 h-4"
          />
        ),
        size: 40,
      },
      {
        accessorKey: "productName",
        header: "Наименование",
        cell: ({ row }) =>
          row.original.warehouse_operation_from?.product?.name ?? "-",
      },
      {
        accessorKey: "price_amount",
        header: "Цена",
        cell: ({ row }) => row.original.price_amount.toLocaleString(),
      },
      {
        accessorKey: "quantity",
        header: "Кол-во",
        cell: ({ row }) => row.original.quantity,
      },
      {
        accessorKey: "totalAmount",
        header: "Сумма",
        cell: ({ row }) =>
          (row.original.price_amount * row.original.quantity).toLocaleString(),
      },
    ],
    [items, selectedIds]
  );

  const table = useReactTable({
    data: items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = () => {
    setRefundCheckModal({ isOpen: false, ids: selectedIds });
    handleRefundCheckInputItem(selectedIds);
    setSelectedIds([]);
  };

  return (
    <Dialog
      width={"80vw"}
      title={"Возвраты чек"}
      height={"84vh"}
      isOpen={isOpen}
      onClose={() => setRefundCheckModal({ isOpen: false, ids: [] })}
    >
      <div className="overflow-auto h-[56vh] border border-gray-200 rounded-2xl mb-6">
        <Table className="w-full border-collapse">
          <THead className="sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    className="p-2 text-left border-b border-gray-200"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <Tr
                  key={row.id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      className={classNames("p-2", index % 2 && "bg-gray-100")}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td
                  colSpan={columns.length}
                  className="text-center py-4 h-[49.6vh]"
                >
                  Нет данных для возврата
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2">
        <Button onClick={() => setRefundCheckModal({ isOpen: false, ids: [] })}>
          Отменить
        </Button>
        <Button variant="solid" onClick={handleSubmit}>
          Отправить
        </Button>
      </div>
    </Dialog>
  );
};

export default RefundCheckModal;
