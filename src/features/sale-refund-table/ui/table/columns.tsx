import type { ColumnDef } from "@tanstack/react-table";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { truncateText } from "@/shared/lib/truncateText";
import { Button } from "@/shared/ui/kit";
import { BsQrCodeScan } from "react-icons/bs";

// 🔹 Jadvaldagi qatorlar uchun type
export interface ProductRow {
  productName: string;
  priceAmount: number;
  quantity: number;
  totalAmount: number;
}

// 🔹 Ustunlarni qaytaruvchi funksiya
export const columns = (
  setMark: (id: string) => void,
  activeDraft: any,
  type: "sale" | "refund" | "purchase",
  selectedRows: any,
  setSelectedRows: any,
  updateDraftItemTotalPrice?: (ind: number, total: number) => void,
): ColumnDef<any>[] => {
  const cols: (ColumnDef<any> | null)[] = [
    {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">
          НОМЕНКЛАТУРА
        </div>
      ),
      accessorKey: "productName",
      cell: ({ row }) => {
        const name = row.original.productName;
        return <span>{truncateText(name, 20, 20)}</span>;
      },
      meta: {
        bodyCellClassName: "text-start",
        headerClassName: "text-xs xl:text-xs font-medium text-gray-800",
      },
    },
    {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">ЦЕНА</div>
      ),
      accessorKey: "priceAmount",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => {
        return (
          <FormattedNumber value={row.original.priceAmount ?? 0} scale={2} />
        );
      },
    },
    type === "sale" ? {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">
          ОПТ. ЦЕНА
        </div>
      ),
      accessorKey: "priceAmountBulk",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => {
        return (
          <FormattedNumber value={row.original.priceAmoutBulk ?? 0} scale={2} />
        );
      },
    } : null,
    {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">
          КОЛ-ВО
        </div>
      ),
      accessorKey: "quantity",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => (
        <FormattedNumber value={row.original.quantity} scale={2} />
      ),
    },
    {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">
          СУММА
        </div>
      ),
      accessorKey: "totalAmount",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => (
        <FormattedNumber value={row.original.totalAmount ?? 0} scale={2} />
      ),
    },
    {
      header: () => "",
      accessorKey: "expander",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) =>
        row.original.marks?.length ? (
          <Button
            variant="solid"
            size="xs"
            className="bg-blue-700 hover:bg-blue-700 hover:opacity-85 text-white"
            onClick={() => setMark(row.original.productId)}
            icon={<BsQrCodeScan size={23} />}
          />
        ) : null,
    },
    type === "sale"
      ? {
          id: "select",
          header: () => {
            const allSelected = activeDraft?.items?.every(
              (item: any) => selectedRows[item.productId],
            );
            const someSelected =
              activeDraft?.items?.some(
                (item: any) => selectedRows[item.productId],
              ) && !allSelected;

            return (
              <input
                type="checkbox"
                checked={!!allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = !!someSelected;
                }}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const updated: Record<string, boolean> = {};

                  activeDraft?.items?.forEach((item: any, index: number) => {
                    // 1️⃣ checkbox state
                    updated[item.productId] = checked;

                    // 2️⃣ totalPrice ni qayta hisoblash
                    if (updateDraftItemTotalPrice) {
                      const price = checked && item.priceAmoutBulk > 0
                        ? item.priceAmoutBulk
                        : item.priceAmount;

                      const newTotal = item.quantity * price;

                      updateDraftItemTotalPrice(
                        index,
                        isNaN(newTotal) ? 0 : newTotal,
                      );
                    }
                  });

                  setSelectedRows(updated);
                }}
              />
            );
          },

          cell: ({ row }) => {
            const product = row.original;
            const index = row.index;

            return (
              <input
                type="checkbox"
                checked={!!selectedRows[row.original.productId]}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setSelectedRows((prev: any) => ({
                    ...prev,
                    [row.original.productId]: e.target.checked,
                  }));

                  if (updateDraftItemTotalPrice) {
                    const price = checked && product.priceAmoutBulk > 0
                      ? product.priceAmoutBulk // OPT
                      : product.priceAmount; // ODDIY

                    const newTotal = product.quantity * price;

                    updateDraftItemTotalPrice(
                      index,
                      isNaN(newTotal) ? 0 : newTotal,
                    );
                  }
                }}
              />
            );
          },
          meta: {
            bodyCellClassName: "text-right",
            headerClassName: "text-xs xl:text-xs font-medium text-gray-800",
          },
        }
      : null,
  ];

  return cols.filter((c): c is ColumnDef<any> => !!c);
};
