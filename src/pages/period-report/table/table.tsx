import type { ColumnDef } from "@tanstack/react-table";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { truncateText } from "@/shared/lib/truncateText";
import { useMemo } from "react";

// columns funksiyasi, tashqaridan num qiymati qabul qiladi
export const useColumns = (num: number) => {
    const reduceSum = (original: any) =>
        original?.reduce(
            (acc: number, item: any) => acc + (item?.amount || 0),
            0,
        ) || 0;

    const columns = useMemo<ColumnDef<any>[]>(() => {
        const baseColumns: ColumnDef<any>[] = [
            {
                id: "index",
                header: () => (
                    <div className="text-xs font-medium text-slate-900 w-10">
                        №
                    </div>
                ),
                cell: ({ row }) => <div className="w-10">{row.index + 1}</div>,
            },
        ];

        if (num === 1) {
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Название продукта
                    </div>
                ),
                accessorKey: "productName",
                cell: ({ row }) => {
                    const name = row?.original?.name as string;
                    return <span>{truncateText(name, 20, 20)}</span>;
                },
            });
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Сумма
                    </div>
                ),
                accessorKey: "amount",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={reduceSum(row.original?.profit_by_purchase_price?.[0]?.amount)}
                        scale={2}
                    />
                ),
            });
        }

        if (num === 2) {
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Название продукта
                    </div>
                ),
                accessorKey: "productName",
                cell: ({ row }) => {
                    const name = row?.original?.name as string;
                    return <span>{truncateText(name, 20, 20)}</span>;
                },
            });
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Количество
                    </div>
                ),
                accessorKey: "amount",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={row?.original?.quantity}
                        scale={2}
                    />
                ),
            });
        }

        if (num === 3) {
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Название продукта
                    </div>
                ),
                accessorKey: "productName",
                cell: ({ row }) => {
                    const name = row?.original?.contractor?.name as string;
                    return <span>{truncateText(name, 20, 20)}</span>;
                },
            });
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Прибыль
                    </div>
                ),
                accessorKey: "amount",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={reduceSum(
                            row?.original?.contractor_period_report
                                ?.sales_profit_by_purchase_price,
                        )}
                        scale={2}
                    />
                ),
            });
        }

        if (num === 4) {
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Название продукта
                    </div>
                ),
                accessorKey: "productName",
                cell: ({ row }) => {
                    const name = row?.original?.contractor?.name as string;
                    return <span>{truncateText(name, 20, 20)}</span>;
                },
            });
            baseColumns.push({
                header: () => (
                    <div className="text-xs font-medium text-slate-900">
                        Общая сумма
                    </div>
                ),
                accessorKey: "amount",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={reduceSum(
                            row?.original?.contractor_period_report
                                ?.sales_net_price,
                        )}
                        scale={2}
                    />
                ),
            });
        }

        return baseColumns;
    }, [num]);

    return columns;
};
