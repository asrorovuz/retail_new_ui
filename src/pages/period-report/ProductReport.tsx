import classNames from "@/shared/lib/classNames";
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

const reduceSum = (items?: { amount: number }[]) =>
    items?.reduce((acc, item) => acc + (item?.amount || 0), 0) || 0;

const columns: ColumnDef<any>[] = [
    {
        header: "№",
        accessorFn: (_row: any, index: number) => index + 1,
        meta: {
            headerClassName: "text-center w-12",
            bodyCellClassName: "text-center",
        },
    },
    {
        header: "Наименование продукта",
        accessorKey: "mahsulot",
        meta: {
            headerClassName: "text-left pl-4 font-medium",
            bodyCellClassName: "text-left pl-4",
        },
        cell: ({ row }) => row?.original?.name,
    },
    {
        header: "Продажа",
        columns: [
            {
                header: "Количество",
                accessorKey: "soni",
                meta: {
                    headerClassName: "text-center min-w-[90px]",
                    bodyCellClassName: "text-center",
                },
                cell: ({ row }) => (
                    <FormattedNumber value={row?.original?.quantity} />
                ),
            },
            {
                header: "Цена",
                accessorKey: "narxi",
                meta: {
                    headerClassName: "text-right min-w-[110px]",
                    bodyCellClassName: "text-right pr-4",
                },
                cell: ({ row }) => (
                    <FormattedNumber value={row?.original?.net_price} />
                ),
            },
            {
                header: "Сумма",
                accessorKey: "summasi",
                meta: {
                    headerClassName: "text-right min-w-[140px]",
                    bodyCellClassName: "text-right pr-4 font-medium",
                },
                cell: ({ row }) => (
                    <FormattedNumber
                        value={reduceSum(row?.original?.net_price)}
                    />
                ),
            },
        ],
    },
    {
        header: "Поступление",
        columns: [
            {
                header: "Цена",
                accessorKey: "kirimNarxi",
                cell: ({ getValue }) =>
                    (getValue() as number)?.toLocaleString("ru-RU"),
                meta: {
                    headerClassName: "text-right min-w-[110px]",
                    bodyCellClassName: "text-right pr-4",
                },
            },
            {
                header: "Сумма",
                accessorKey: "kirimSummasi",
                cell: ({ getValue }) =>
                    (getValue() as number)?.toLocaleString("ru-RU"),
                meta: {
                    headerClassName: "text-right min-w-[140px]",
                    bodyCellClassName: "text-right pr-4 font-medium",
                },
            },
        ],
    },
    {
        header: "Прибыль",
        columns: [
            {
                header: "С единицы",
                accessorKey: "foydaBittadan",
                cell: ({ getValue }) =>
                    (getValue() as number)?.toLocaleString("ru-RU"),
                meta: {
                    headerClassName: "text-right min-w-[110px]",
                    bodyCellClassName: "text-right pr-4",
                },
            },
            {
                header: "Общая",
                accessorKey: "foydaUmumiy",
                cell: ({ getValue }) =>
                    (getValue() as number)?.toLocaleString("ru-RU"),
                meta: {
                    headerClassName: "text-right min-w-[140px]",
                    bodyCellClassName:
                        "text-right pr-4 font-medium text-green-700",
                },
            },
        ],
    },
    {
        header: "Остаток",
        accessorKey: "qoldiq",
        cell: ({ getValue }) => (getValue() as number)?.toLocaleString("ru-RU"),
        meta: {
            headerClassName: "text-center min-w-[100px]",
            bodyCellClassName: "text-center font-medium",
        },
    },
];

export default function ProductReport({ data }: any) {
    const table = useReactTable({
        data: data?.overall_period_report?.sales_items_summary || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto h-[78vh]">
                <Table className="table-fixed w-full border-separate border-spacing-0">
                    <THead className="sticky top-0 bg-white z-10 shadow-sm">
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

                    <TBody className="w-full h-[78vh]">
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
                                    {row.getVisibleCells().map((cell) => (
                                        <Td
                                            key={cell.id}
                                            className={classNames(
                                                "border-b border-slate-100 px-2 py-2.5 text-sm text-slate-700",
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
