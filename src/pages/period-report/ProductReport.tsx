import classNames from "@/shared/lib/classNames";
import { truncateText } from "@/shared/lib/truncateText";
import { Table } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

export default function ProductReport({ data }: any) {
    const salesItemsSummary = data?.overall_period_report?.sales_items_summary;

    const safeAmount = (v?: number) => v || 0;

    const safeDivide = (a?: number, b?: number) => (b ? (a || 0) / b : 0);

    const getAmount = (arr?: any[]) => arr?.[0]?.amount ?? 0;

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: "№",
                cell: ({ row }) => row.index + 1,
            },

            {
                header: "Название продукта",
                accessorKey: "name",
                cell: ({ row }) => (
                    <span>{truncateText(row.original.name, 20, 20)}</span>
                ),
            },

            // ---------------- SALES ----------------
            {
                header: "Продажа",
                columns: [
                    {
                        header: "Количество",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={safeAmount(row.original.quantity)}
                                scale={2}
                            />
                        ),
                    },
                    {
                        header: "Цена",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={safeDivide(
                                    getAmount(row.original.net_price),
                                    row.original.quantity,
                                )}
                                scale={2}
                            />
                        ),
                    },
                    {
                        header: "Сумма",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={getAmount(row.original.net_price)}
                                scale={2}
                            />
                        ),
                    },
                ],
            },

            // ---------------- PURCHASE ----------------
            {
                header: "Приход",
                columns: [
                    {
                        header: "Цена",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={safeDivide(
                                    getAmount(row.original.purchase_net_price),
                                    row.original.quantity,
                                )}
                                scale={2}
                            />
                        ),
                    },
                    {
                        header: "Сумма",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={getAmount(
                                    row.original.purchase_net_price,
                                )}
                                scale={2}
                            />
                        ),
                    },
                ],
            },

            // ---------------- PROFIT ----------------
            {
                header: "Прибыль",
                columns: [
                    {
                        header: "С единицы",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={safeDivide(
                                    getAmount(
                                        row.original.profit_by_purchase_price,
                                    ),
                                    row.original.quantity,
                                )}
                                scale={2}
                            />
                        ),
                    },
                    {
                        header: "Общая",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={getAmount(
                                    row.original.profit_by_purchase_price,
                                )}
                                scale={2}
                            />
                        ),
                    },
                ],
            },

            // ---------------- STOCK ----------------
            {
                header: "Остаток",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={getAmount(row.original.purchase_net_price)}
                        scale={2}
                    />
                ),
            },
        ],
        [],
    );

    const table = useReactTable({
        data: salesItemsSummary || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
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
                                        "border border-slate-300 px-2 py-3 text-sm font-semibold text-slate-800",
                                        header.column.columnDef.meta
                                            ?.headerClassName,
                                        isGroupHeader &&
                                            "text-center bg-slate-50",
                                    )}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
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
                            {row.getVisibleCells().map((cell, index) => (
                                <Td
                                    key={cell.id}
                                    className={classNames(
                                        "border border-slate-300 px-2 py-2.5 text-sm text-slate-700",
                                        index === 0
                                            ? "text-center"
                                            : index === 1
                                              ? "text-left"
                                              : "text-right",
                                        cell.column.columnDef.meta
                                            ?.bodyCellClassName,
                                    )}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    );
                })}
            </TBody>
        </Table>
    );
}
