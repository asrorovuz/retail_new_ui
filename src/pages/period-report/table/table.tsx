import type { ColumnDef } from "@tanstack/react-table";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { truncateText } from "@/shared/lib/truncateText";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// columns funksiyasi, tashqaridan num qiymati qabul qiladi
export const useColumns = (num: number) => {
    const { t } = useTranslation();
    const columns = useMemo<ColumnDef<any>[]>(() => {
        const baseColumns: ColumnDef<any>[] = [
            {
                id: "index",
                size: 60, // 🔥 MUHIM
                minSize: 60,
                maxSize: 60,
                header: () => (
                    <div className="text-xs text-left font-medium text-slate-900">
                        №
                    </div>
                ),
                cell: ({ row }) => <div>{row.index + 1}</div>,
            },
        ];

        if (num === 1) {
            baseColumns.push({
                header: () => (
                    <div className="text-xs text-left font-medium text-slate-900">
                        {t("product.name")}
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
                    <div className="text-xs text-left font-medium text-slate-900">
                        {t("sale.profit")}
                    </div>
                ),
                accessorKey: "amount",
                cell: ({ row }) => {
                    return (
                        <FormattedNumber
                            value={
                                row?.original?.profit_by_purchase_price?.[0]
                                    ?.amount ?? 0
                            }
                            scale={2}
                        />
                    );
                },
            });
        }

        if (num === 2) {
            baseColumns.push({
                header: () => (
                    <div className="text-xs text-left font-medium text-slate-900">
                        {t("product.name")}
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
                    <div className="text-xs text-left font-medium text-slate-900">
                        {t("common.quantity")}
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
                    <div className="text-xs text-left font-medium text-slate-900">
                        {t("product.name")}
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
                        {t("sale.profit")}
                    </div>
                ),
                accessorKey: "amount",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={
                            row.original?.contractor_period_report
                                ?.sales_profit_by_purchase_price?.[0]?.amount ??
                            0
                        }
                        scale={2}
                    />
                ),
            });
        }

        if (num === 4) {
            baseColumns.push({
                header: () => (
                    <div className="text-xs text-left font-medium text-slate-900">
                        {t("counterparty.title")}
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
                    <div className="text-xs text-left font-medium text-slate-900">
                        {t("common.amount")}
                    </div>
                ),
                accessorKey: "amount",
                cell: ({ row }) => {

                    return (
                        <FormattedNumber
                            value={
                                row.original?.contractor_period_report
                                    ?.sales_net_price?.[0]?.amount ?? 0
                            }
                            scale={2}
                        />
                    );
                },
            });
        }

        return baseColumns;
    }, [num, t]);

    return columns;
};
