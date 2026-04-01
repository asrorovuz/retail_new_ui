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

// const columns: ColumnDef<any>[] = [
//     {
//         accessorKey: "index",
//         header: () => (
//             <div className="text-xs text-left font-medium text-slate-900">
//                 №
//             </div>
//         ),
//         cell: ({ row }) => <div>{row.index + 1}</div>,
//     },
//     {
//         header: () => (
//             <div className="text-xs text-left font-medium text-slate-900">
//                 Название продукта
//             </div>
//         ),
//         accessorKey: "name",
//         cell: ({ row }) => (
//             <span>{truncateText(row.original.name, 20, 20)}</span>
//         ),
//     },
//     {
//         header: "Продажа",
//         columns: [
//             {
//                 header: () => (
//                     <div className="text-xs text-left font-medium text-slate-900">
//                         Количество
//                     </div>
//                 ),
//                 accessorKey: "quantity",
//                 cell: ({ row }) => (
//                     <FormattedNumber value={row?.original?.quantity} />
//                 ),
//             },
//             {
//                 header: () => (
//                     <div className="text-xs text-left font-medium text-slate-900">
//                         Цена
//                     </div>
//                 ),
//                 accessorKey: "price",
//                 cell: ({ row }) => (
//                     <FormattedNumber
//                         value={
//                             (row?.original?.net_price?.[0]?.amount || 0) /
//                             row?.original?.quantity
//                         }
//                     />
//                 ),
//             },
//             {
//                 header: "Сумма",
//                 accessorKey: "summasi",
//                 cell: ({ row }) => (
//                     <FormattedNumber
//                         value={row?.original?.net_price?.[0]?.amount || 0}
//                     />
//                 ),
//             },
//         ],
//     },
//     {
//         header: "Приход",
//         columns: [
//             {
//                 header: "Цена",
//                 accessorKey: "receiptSum",
//                 cell: ({ row }) => (
//                     <FormattedNumber
//                         value={
//                             (row?.original?.purchase_net_price?.[0]?.amount ||
//                                 0) / row?.original?.quantity
//                         }
//                     />
//                 ),
//             },
//             {
//                 header: "Сумма",
//                 accessorKey: "kirimSummasi",
//                 cell: ({ row }) => (
//                     <FormattedNumber
//                         value={
//                             row?.original?.purchase_net_price?.[0]?.amount || 0
//                         }
//                     />
//                 ),
//             },
//         ],
//     },
//     {
//         header: "Прибыль",
//         columns: [
//             {
//                 header: "С единицы",
//                 accessorKey: "foydaBittadan",
//                 cell: ({ row }) => (
//                     <FormattedNumber
//                         value={
//                             (row?.original?.profit_by_purchase_price?.[0]
//                                 ?.amount || 0) / row?.original?.quantity
//                         }
//                     />
//                 ),
//             },
//             {
//                 header: "Общая",
//                 accessorKey: "foydaUmumiy",
//                 cell: ({ row }) => (
//                     <FormattedNumber
//                         value={
//                             row?.original?.profit_by_purchase_price?.[0]
//                                 ?.amount || 0
//                         }
//                     />
//                 ),
//             },
//         ],
//     },
//     {
//         header: "Остаток",
//         accessorKey: "qoldiq",
//         cell: ({ row }) => (
//             <FormattedNumber
//                 value={row?.original?.purchase_net_price?.[0]?.amount || 0}
//             />
//         ),
//     },
// ];

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
                            />
                        ),
                    },
                    {
                        header: "Сумма",
                        cell: ({ row }) => (
                            <FormattedNumber
                                value={getAmount(row.original.net_price)}
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
                                                      header.column.columnDef
                                                          .header,
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
                                                index === 0 ? "text-center" : index === 1 ? "text-left" : "text-right",
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
            </div>
        </div>
    );
}
