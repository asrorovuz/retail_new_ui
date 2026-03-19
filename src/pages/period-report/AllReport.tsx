import classNames from "@/shared/lib/classNames";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import { useColumns } from "./table/table";

const AllReport = ({ data }: { data: any }) => {
    const reduceSum = (items?: { amount: number }[]) =>
        items?.reduce((acc, item) => acc + (item?.amount || 0), 0) || 0;

    const table1 = useReactTable({
        data: data?.overall_period_report?.sales_items_summary || [],
        columns: useColumns(1),
        getCoreRowModel: getCoreRowModel(),
    });

    const table2 = useReactTable({
        data: data?.overall_period_report?.sales_items_summary || [],
        columns: useColumns(2),
        getCoreRowModel: getCoreRowModel(),
    });

    const table3 = useReactTable({
        data: data?.contractors_report_response || [],
        columns: useColumns(3),
        getCoreRowModel: getCoreRowModel(),
    });

    const table4 = useReactTable({
        data: data?.contractors_report_response || [],
        columns: useColumns(4),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div
            className={classNames(
                "flex flex-col mb-3 h-[78vh] overflow-y-auto",
            )}
        >
            <div className="grid grid-cols-3 gap-x-3">
                <div className="flex flex-col gap-4 col-span-1">
                    <div className="border border-slate-200 rounded-xl p-4">
                        <h3 className="text-sm font-medium mb-3">
                            Отчёты по продажам
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">Прибыль</span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .sales_profit_by_purchase_price,
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">Долг</span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .sales_net_price,
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">Продажи</span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .debts_net_price,
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">Скидка</span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .overall_discounts,
                                        )}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <h3 className="text-sm font-medium mb-3">
                            Отчёты по приходу и возвратам
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">Приходы</span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .purchases_net_price,
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">
                                    Возврат от клиента
                                </span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .refunds_net_price,
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">
                                    Возвраты поставщику
                                </span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .return_purchases_net_price,
                                        )}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <h3 className="text-sm font-medium mb-3">
                            Отчёты по платежам
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">Оплата</span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .payments_net_price,
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">
                                    Расходный платеж
                                </span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.overall_period_report
                                                .payouts_net_price,
                                        )}
                                    />
                                </span>
                            </div>
                            <div className="p-4 bg-slate-200 rounded-md flex flex-col gap-y-0.5">
                                <span className="text-xs">Общие расходы</span>
                                <span className="text-base font-medium text-slate-800">
                                    <FormattedNumber
                                        value={reduceSum(
                                            data?.cash_box_expenses,
                                        )}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 col-span-2">
                    <div className="w-full">
                        <h3 className="text-sm font-medium mb-3">
                            Топ-10 самых прибыльных товаров
                        </h3>
                        <div className="border border-slate-200 rounded-xl">
                            <Table
                                className="table-fixed border-separate border-spacing-0"
                                overflow={false}
                                compact={true}
                            >
                                <THead className={"sticky top-0 bg-white"}>
                                    {table1
                                        ?.getHeaderGroups()
                                        .map((headerGroup) => (
                                            <Tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <Th
                                                                key={header.id}
                                                                colSpan={
                                                                    header.colSpan
                                                                }
                                                                style={{
                                                                    width: header.column.getSize(),
                                                                }}
                                                                className={classNames(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.headerClassName,
                                                                    // ind
                                                                    //     ? "text-right"
                                                                    //     : "text-left",
                                                                )}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext(),
                                                                )}
                                                            </Th>
                                                        );
                                                    },
                                                )}
                                            </Tr>
                                        ))}
                                </THead>

                                <TBody>
                                    {table1.getRowModel().rows.length > 0 ? (
                                        table1
                                            .getRowModel()
                                            .rows.map((row, rowIndex) => {
                                                const oddEven =
                                                    rowIndex % 2 === 0;
                                                return (
                                                    <Tr
                                                        key={row.id}
                                                        className={classNames(
                                                            oddEven
                                                                ? "bg-slate-200"
                                                                : "bg-white",
                                                            // expandedRow?.toString() ===
                                                            //     row.id &&
                                                            //     "text-slate-900",
                                                            // "!h-max cursor-pointer",
                                                        )}
                                                    >
                                                        {row
                                                            .getVisibleCells()
                                                            .map((cell) => (
                                                                <Td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    style={{
                                                                        width: cell.column.getSize(),
                                                                    }}
                                                                    className={classNames(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .meta
                                                                            ?.bodyCellClassName,
                                                                        "p-2 text-xs",
                                                                    )}
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </Td>
                                                            ))}
                                                    </Tr>
                                                );
                                            })
                                    ) : (
                                        <Tr key="empty">
                                            <Td
                                                className="!py-20"
                                                colSpan={
                                                    table1.getAllColumns().length
                                                }
                                            >
                                                <Empty
                                                    textSize="text-base"
                                                    size={60}
                                                />
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-full">
                        <h3 className="text-sm font-medium mb-3">
                            Топ-10 самых продаваемых товаров
                        </h3>
                        <div className="border border-slate-200 rounded-xl">
                            <Table
                                className="table-fixed border-separate border-spacing-0"
                                overflow={false}
                                compact={true}
                            >
                                <THead className={"sticky top-0 bg-white"}>
                                    {table2
                                        ?.getHeaderGroups()
                                        .map((headerGroup) => (
                                            <Tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <Th
                                                                key={header.id}
                                                                colSpan={
                                                                    header.colSpan
                                                                }
                                                                style={{
                                                                    width: header.column.getSize(),
                                                                }}
                                                                className={classNames(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.headerClassName,
                                                                    // ind
                                                                    //     ? "text-right"
                                                                    //     : "text-left",
                                                                )}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext(),
                                                                )}
                                                            </Th>
                                                        );
                                                    },
                                                )}
                                            </Tr>
                                        ))}
                                </THead>

                                <TBody>
                                    {table2.getRowModel().rows.length > 0 ? (
                                        table2
                                            .getRowModel()
                                            .rows.map((row, rowIndex) => {
                                                const oddEven =
                                                    rowIndex % 2 === 0;
                                                return (
                                                    <Tr
                                                        key={row.id}
                                                        className={classNames(
                                                            oddEven
                                                                ? "bg-slate-200"
                                                                : "bg-white",
                                                            // expandedRow?.toString() ===
                                                            //     row.id &&
                                                            //     "text-slate-900",
                                                            // "!h-max cursor-pointer",
                                                        )}
                                                    >
                                                        {row
                                                            .getVisibleCells()
                                                            .map((cell) => (
                                                                <Td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    style={{
                                                                        width: cell.column.getSize(),
                                                                    }}
                                                                    className={classNames(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .meta
                                                                            ?.bodyCellClassName,
                                                                        "p-2 text-xs",
                                                                    )}
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </Td>
                                                            ))}
                                                    </Tr>
                                                );
                                            })
                                    ) : (
                                        <Tr key="empty">
                                            <Td
                                                className="!py-20"
                                                colSpan={
                                                    table2.getAllColumns().length
                                                }
                                            >
                                                <Empty
                                                    textSize="text-base"
                                                    size={60}
                                                />
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-full">
                        <h3 className="text-sm font-medium mb-3">
                            Топ-10 самых прибыльных клиентов
                        </h3>
                        <div className="border border-slate-200 rounded-xl">
                            <Table
                                className="table-fixed border-separate border-spacing-0"
                                overflow={false}
                                compact={true}
                            >
                                <THead className={"sticky top-0 bg-white"}>
                                    {table3
                                        ?.getHeaderGroups()
                                        .map((headerGroup) => (
                                            <Tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <Th
                                                                key={header.id}
                                                                colSpan={
                                                                    header.colSpan
                                                                }
                                                                style={{
                                                                    width: header.column.getSize(),
                                                                }}
                                                                className={classNames(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.headerClassName,
                                                                    // ind
                                                                    //     ? "text-right"
                                                                    //     : "text-left",
                                                                )}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext(),
                                                                )}
                                                            </Th>
                                                        );
                                                    },
                                                )}
                                            </Tr>
                                        ))}
                                </THead>

                                <TBody>
                                    {table3.getRowModel().rows.length > 0 ? (
                                        table3
                                            .getRowModel()
                                            .rows.map((row, rowIndex) => {
                                                const oddEven =
                                                    rowIndex % 2 === 0;
                                                return (
                                                    <Tr
                                                        key={row.id}
                                                        className={classNames(
                                                            oddEven
                                                                ? "bg-slate-200"
                                                                : "bg-white",
                                                            // expandedRow?.toString() ===
                                                            //     row.id &&
                                                            //     "text-slate-900",
                                                            // "!h-max cursor-pointer",
                                                        )}
                                                    >
                                                        {row
                                                            .getVisibleCells()
                                                            .map((cell) => (
                                                                <Td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    style={{
                                                                        width: cell.column.getSize(),
                                                                    }}
                                                                    className={classNames(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .meta
                                                                            ?.bodyCellClassName,
                                                                        "p-2 text-xs",
                                                                    )}
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </Td>
                                                            ))}
                                                    </Tr>
                                                );
                                            })
                                    ) : (
                                        <Tr key="empty">
                                            <Td
                                                className="!py-20"
                                                colSpan={
                                                    table3.getAllColumns().length
                                                }
                                            >
                                                <Empty
                                                    textSize="text-base"
                                                    size={60}
                                                />
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-full">
                        <h3 className="text-sm font-medium mb-3">
                            Топ-10 клиентов с наибольшими продажами
                        </h3>
                        <div className="border border-slate-200 rounded-xl">
                            <Table
                                className="table-fixed border-separate border-spacing-0"
                                overflow={false}
                                compact={true}
                            >
                                <THead className={"sticky top-0 bg-white"}>
                                    {table4
                                        ?.getHeaderGroups()
                                        .map((headerGroup) => (
                                            <Tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <Th
                                                                key={header.id}
                                                                colSpan={
                                                                    header.colSpan
                                                                }
                                                                style={{
                                                                    width: header.column.getSize(),
                                                                }}
                                                                className={classNames(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.headerClassName,
                                                                    // ind
                                                                    //     ? "text-right"
                                                                    //     : "text-left",
                                                                )}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext(),
                                                                )}
                                                            </Th>
                                                        );
                                                    },
                                                )}
                                            </Tr>
                                        ))}
                                </THead>

                                <TBody>
                                    {table4.getRowModel().rows.length > 0 ? (
                                        table4
                                            .getRowModel()
                                            .rows.map((row, rowIndex) => {
                                                const oddEven =
                                                    rowIndex % 2 === 0;
                                                return (
                                                    <Tr
                                                        key={row.id}
                                                        className={classNames(
                                                            oddEven
                                                                ? "bg-slate-200"
                                                                : "bg-white",
                                                            // expandedRow?.toString() ===
                                                            //     row.id &&
                                                            //     "text-slate-900",
                                                            // "!h-max cursor-pointer",
                                                        )}
                                                    >
                                                        {row
                                                            .getVisibleCells()
                                                            .map((cell) => (
                                                                <Td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    style={{
                                                                        width: cell.column.getSize(),
                                                                    }}
                                                                    className={classNames(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .meta
                                                                            ?.bodyCellClassName,
                                                                        "p-2 text-xs",
                                                                    )}
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </Td>
                                                            ))}
                                                    </Tr>
                                                );
                                            })
                                    ) : (
                                        <Tr key="empty">
                                            <Td
                                                className="!py-20"
                                                colSpan={
                                                    table4.getAllColumns().length
                                                }
                                            >
                                                <Empty
                                                    textSize="text-base"
                                                    size={60}
                                                />
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllReport;
