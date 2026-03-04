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
  const cols: (ColumnDef<any> | null)[] = [
    {
      header: () => (
        <div className="text-xs font-medium text-slate-900">НОМЕНКЛАТУРА</div>
      ),
      accessorKey: "productName",
      cell: ({ row }) => {
        const name = row.original.productName;
        return <span>{truncateText(name, 20, 20)}</span>;
      },
      meta: {
        bodyCellClassName: "text-start",
        headerClassName: "text-xs font-medium text-slate-900",
      },
    },
    {
      header: () => (
        <div className="text-xs font-medium text-slate-900">ЦЕНА</div>
      ),
      accessorKey: "priceAmount",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => (
        <FormattedNumber value={row.original.priceAmount ?? 0} scale={2} />
      ),
    },
    {
      header: () => (
        <div className="text-xs font-medium text-slate-900">ОПТ. ЦЕНА</div>
      ),
      accessorKey: "totalAmount",
      meta: {
        bodyCellClassName: "text-right min-w-full max-w-full",
      },
      cell: ({ row }) => (
        <FormattedNumber
          value={row?.original?.priceAmountBulk ?? 0}
          scale={2}
        />
      ),
    },
    {
      header: () => (
        <div className="text-xs font-medium text-slate-900 text-nowrap">
          КОЛ-ВО
        </div>
      ),
      accessorKey: "quantity",
      meta: {
        bodyCellClassName: "text-right",
      },
      cell: ({ row }) => (
        <FormattedNumber value={row.original.quantity ?? 0} scale={2} />
      ),
    },
  ];

  return cols.filter((c): c is ColumnDef<any> => !!c);
};
