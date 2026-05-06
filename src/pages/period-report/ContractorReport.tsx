import classNames from "@/shared/lib/classNames";
import { Table } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

const safeAmount = (arr?: any[]) => arr?.[0]?.amount ?? 0;

const columns: ColumnDef<any>[] = [
    {
        header: "№",
        cell: ({ row }) => row.index + 1,
        meta: {
            headerClassName: "text-center w-12",
            bodyCellClassName: "text-center",
        },
    },
    {
        header: "Контрагент",
        meta: {
            headerClassName: "text-left pl-4 font-medium",
            bodyCellClassName: "text-left pl-4",
        },
        cell: ({ row }) => row?.original?.contractor?.name || "-",
    },

    {
        header: "Прибыль",
        meta: {
            headerClassName: "text-center min-w-[120px]",
            bodyCellClassName: "text-center",
        },
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(
                    row?.original?.contractor_period_report
                        ?.sales_profit_by_purchase_price,
                )}
                scale={2}
            />
        ),
    },

    {
        header: "Количество проданных товаров",
        meta: {
            headerClassName: "text-center min-w-[150px]",
            bodyCellClassName: "text-center",
        },
        cell: ({ row }) => {
            const items =
                row?.original?.contractor_period_report?.sales_items_summary ||
                [];

            const quantity = items.reduce(
                (acc: number, item: any) => acc + (item?.quantity || 0),
                0,
            );

            return <FormattedNumber value={quantity} scale={2} />;
        },
    },

    {
        header: "Сумма продаж",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(
                    row?.original?.contractor_period_report?.sales_net_price,
                )}
                scale={2}
            />
        ),
    },

    {
        header: "Сумма поступления",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(
                    row?.original?.contractor_period_report
                        ?.purchases_net_price,
                )}
                scale={2}
            />
        ),
    },

    {
        header: "Сумма возврата от клиента",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(
                    row?.original?.contractor_period_report?.refunds_net_price,
                )}
                scale={2}
            />
        ),
    },

    {
        header: "Сумма возврата поставщику",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(
                    row?.original?.contractor_period_report?.returns_net_price,
                )}
                scale={2}
            />
        ),
    },

    {
        header: "Сумма оплаты от клиента",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(
                    row?.original?.contractor_period_report?.payments_net_price,
                )}
                scale={2}
            />
        ),
    },

    {
        header: "Сумма оплаты поставщику",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(
                    row?.original?.contractor_period_report?.payouts_net_price,
                )}
                scale={2}
            />
        ),
    },

    {
        header: "Старый долг",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(row?.original?.contractor?.before_debts)}
                scale={2}
            />
        ),
    },

    {
        header: "Текущий долг",
        cell: ({ row }) => (
            <FormattedNumber
                value={safeAmount(row?.original?.contractor?.debts_net_price)}
                scale={2}
            />
        ),
    },
];

const ContractorReport = ({ data }: any) => {
    const table = useReactTable({
        data: useMemo(() => data?.contractors_period_report || [], [data]),
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[78vh]">
                <Table className="table-fixed w-full border-separate border-spacing-0">
                    <THead className="sticky top-0 bg-white z-20">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const isGroupHeader =
                                        header.column.columns?.length > 0;

                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={classNames(
                                                "border border-slate-300 text-sm font-semibold text-slate-800",
                                                header.column.columnDef.meta
                                                    ?.headerClassName,
                                                isGroupHeader &&
                                                    "text-center bg-slate-50",
                                            )}
                                        >
                                            <div className="px-2 py-3">
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                            </div>
                                        </Th>
                                    );
                                })}
                            </Tr>
                        ))}
                    </THead>

                    <TBody>
                        {table.getRowModel().rows.map((row, rowIndex) => {
                            const isEven = rowIndex % 2 === 0;
                            return (
                                <Tr
                                    key={row.id}
                                    className={classNames(
                                        isEven ? "bg-slate-50" : "bg-white",
                                        "hover:bg-slate-100 transition-colors",
                                    )}
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell, index) => (
                                            <Td
                                                key={cell.id}
                                                className={classNames(
                                                    "border border-slate-300 text-sm text-slate-700",
                                                    index === 0
                                                        ? "text-center"
                                                        : index === 1
                                                          ? "text-left"
                                                          : "text-right",
                                                    cell.column.columnDef.meta
                                                        ?.bodyCellClassName,
                                                )}
                                            >
                                                <div className="py-3 px-2">
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </div>
                                            </Td>
                                        ))}
                                </Tr>
                            );
                        })}
                    </TBody>
                </Table>
            </div>
        </div>
    );
};

export default ContractorReport;
