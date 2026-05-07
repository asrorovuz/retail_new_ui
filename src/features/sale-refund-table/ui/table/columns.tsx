import type { ColumnDef } from "@tanstack/react-table";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
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
    type: "sale" | "refund" | "purchase",
    selectedRows: any,
): ColumnDef<any>[] => {
    const cols: (ColumnDef<any> | null)[] = [
        {
            header: () => (
                <div className="text-xs font-medium upper text-slate-900 w-full">
                    название
                </div>
            ),
            accessorKey: "productName",
            cell: ({ row }) => {
                const name = row.original.productName;
                return <div className="!w-full">{name}</div>;
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
            cell: ({ row }) => {
                let reallyPrice = row.original.priceAmount;
                if (type === "sale") {
                    if (
                        selectedRows[row.original.productId] &&
                        row.original.priceAmoutBulk
                    ) {
                        reallyPrice = row.original.priceAmoutBulk;
                    }
                }

                return <FormattedNumber value={reallyPrice ?? 0} scale={2} />;
            },
            maxSize: 90,
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
                <FormattedNumber value={row.original.quantity} scale={2} />
            ),
            maxSize: 80,
        },
        {
            header: () => (
                <div className="text-xs font-medium text-slate-900">СУММА</div>
            ),
            accessorKey: "totalAmount",
            meta: {
                bodyCellClassName: "text-right min-w-full max-w-full",
            },
            cell: ({ row }) => (
                <FormattedNumber
                    value={row.original.totalAmount ?? 0}
                    scale={2}
                />
            ),
            maxSize: 110,
        },
        {
            header: () => "",
            accessorKey: "expander",
            meta: {
                bodyCellClassName: "text-right",
            },
            cell: ({ row }) =>
                row.original.isMark || row.original?.marks?.length ? (
                    <div className="flex items-center gap-x-1">
                        <span className="text-lg">{row.original.marks?.length || 0}</span>
                        <Button
                            variant="solid"
                            size="xs"
                            className="bg-blue-700 hover:bg-blue-700 hover:opacity-85 text-white"
                            onClick={() => row.original.isMark ? setMark(row.original.productId) : null}
                            icon={<BsQrCodeScan size={23} />}
                        />
                    </div>
                ) : null,
            maxSize: 60,
        },
    ];

    return cols.filter((c): c is ColumnDef<any> => !!c);
};
