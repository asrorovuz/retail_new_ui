import type { ColumnDef } from "@tanstack/react-table";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { truncateText } from "@/shared/lib/truncateText";

// 🔹 Jadvaldagi qatorlar uchun type
export interface ProductRow {
  productName: string;
  priceAmount: number;
  quantity: number;
  totalAmount: number;
}

// 🔹 Ustunlarni qaytaruvchi funksiya
export const columns = (): ColumnDef<any>[] => {
  return [
    {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">НОМЕНКЛАТУРА</div>
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
      cell: ({ row }) => <FormattedNumber value={row.original.priceAmount} scale={2}/>,
    },
    {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">КОЛ-ВО</div>
      ),
      accessorKey: "quantity",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => <FormattedNumber value={row.original.quantity} scale={2}/>,
    },
    {
      header: () => (
        <div className="text-xs xl:text-sm font-medium text-gray-600">СУММА</div>
      ),
      accessorKey: "totalAmount",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => <FormattedNumber value={row.original.totalAmount} scale={2}/>,
    },
  ];
};
