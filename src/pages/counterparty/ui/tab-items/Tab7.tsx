import {
    useActReport,
    useActReportExcel,
} from "@/entities/contractor/repository";
import { exportToExcelApi } from "@/shared/lib/arrayToExcelConvert";
import { showErrorMessage } from "@/shared/lib/showMessage";
import classNames from "@/shared/lib/classNames";
import { Button, Card, DatePicker, Table } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
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
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";

const Tab7 = ({ contractorId }: any) => {
    const [params, setParams] = useState({
        date_start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        date_end: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        pageSize: 20,
        pageIndex: 0,
    });
    const [actReportData, setActReportData] = useState<any>([]);
    const { mutate: actReportMutate } = useActReport();
    const { mutate: excelMutate, isPending: excelPending } =
        useActReportExcel();

    const { control, watch } = useForm({
        defaultValues: {
            date_start: dayjs().startOf("day").toDate(),
            date_end: dayjs().endOf("day").toDate(),
        },
    });

    const calcDebts = (list: any[]) => {
        return list?.reduce(
            (sum: number, item: any) => sum + (item?.amount || 0),
            0,
        );
    };

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "index",
                header: "№",
                cell: ({ row }) => row.index + 1,
            },
            {
                id: "operation",
                header: "Операции",
                cell: ({ row }) => {
                    const type = row.original?.type;
                    const config: Record<
                        number,
                        { label: string; className: string }
                    > = {
                        1: {
                            label: "Оплата от клиента",
                            className: "bg-green-100 text-green-800",
                        },
                        2: {
                            label: "Выплата поставщику",
                            className: "bg-blue-100 text-blue-800",
                        },
                        3: {
                            label: "Продажа",
                            className: "bg-purple-100 text-purple-800",
                        },
                        4: {
                            label: "Приход",
                            className: "bg-orange-100 text-orange-800",
                        },
                        5: {
                            label: "Возврат средств",
                            className: "bg-yellow-100 text-yellow-800",
                        },
                        6: {
                            label: "Возврат поставщику",
                            className: "bg-red-100 text-red-800",
                        },
                    };
                    const item = config[type];
                    if (!item) return <span className="text-slate-400">—</span>;
                    return (
                        <div
                            className={classNames(
                                "px-2 py-1 m-1 w-max rounded-full text-xs font-medium whitespace-nowrap",
                                item.className,
                            )}
                        >
                            {item.label}
                        </div>
                    );
                },
            },
            {
                id: "before_debts",
                header: "Предыдущий долг",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={calcDebts(
                            row.original?.before_debt_states || [],
                        )}
                    />
                ),
            },
            {
                id: "increase",
                header: "Увеличение задолженности",
                cell: ({ row }) => {
                    const diff =
                        calcDebts(row.original?.after_debt_states || []) -
                        calcDebts(row.original?.before_debt_states || []);
                    return <FormattedNumber value={diff > 0 ? diff : 0} />;
                },
            },
            {
                id: "decrease",
                header: "Уменьшение задолженности",
                cell: ({ row }) => {
                    const diff =
                        calcDebts(row.original?.before_debt_states || []) -
                        calcDebts(row.original?.after_debt_states || []);
                    return <FormattedNumber value={diff > 0 ? diff : 0} />;
                },
            },
            {
                id: "after_debts",
                header: "Последующая задолженность",
                cell: ({ row }) => (
                    <FormattedNumber
                        value={calcDebts(row.original?.after_debt_states || [])}
                    />
                ),
            },
            {
                id: "user",
                header: "Пользователи",
                cell: ({ row }) => (
                    <div>{row.original?.cashbox?.user?.name ?? "—"}</div>
                ),
            },
            {
                id: "date",
                header: "Дата",
                cell: ({ row }) => (
                    <div className="w-max px-2">
                        {dayjs(row.original?.date).format("HH:mm YYYY-MM-DD")}
                    </div>
                ),
            },
        ],
        [],
    );

    useEffect(() => {
        const filterParams = Object.fromEntries(
            Object.entries(params ?? {}).filter(([_, value]) => Boolean(value)),
        );

        actReportMutate(
            {
                id: contractorId,
                params: filterParams,
            },
            {
                onSuccess(res) {
                    setActReportData(res);
                },
                onError(err) {
                    console.log(err);
                },
            },
        );
    }, [contractorId, params]);

    const dateStart = watch("date_start");
    const dateEnd = watch("date_end");

    useEffect(() => {
        setParams((prev: any) => ({
            ...prev,
            date_start: dateStart
                ? dayjs(dateStart).startOf("day").format("YYYY-MM-DD HH:mm:ss")
                : null,
            date_end: dateEnd
                ? dayjs(dateEnd).endOf("day").format("YYYY-MM-DD HH:mm:ss")
                : null,
        }));
    }, [dateStart, dateEnd]);

    const table = useReactTable({
        data: actReportData?.operations || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="py-2 h-full">
            <div className="flex flex-col gap-2">
                <div className="flex gap-x-2 justify-end">
                    <div className="flex gap-x-2">
                        <Controller
                            name="date_start"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <div className="relative">
                                        <DatePicker
                                            inputFormat="DD-MM-YYYY"
                                            size="sm"
                                            placeholder={"Дата начала"}
                                            closePickerOnChange={true}
                                            inputtable={true}
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </div>
                                );
                            }}
                        />

                        <Controller
                            name="date_end"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <div className="relative">
                                        <DatePicker
                                            inputFormat="DD-MM-YYYY"
                                            size="sm"
                                            placeholder={"Дата окончания"}
                                            closePickerOnChange={true}
                                            inputtable={true}
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </div>
                                );
                            }}
                        />

                        <Button
                            size="sm"
                            variant="solid"
                            loading={excelPending}
                            className="bg-green-700 hover:bg-green-600"
                            icon={<PiMicrosoftExcelLogoDuotone />}
                            onClick={() =>
                                excelMutate(
                                    { id: contractorId, params },
                                    {
                                        onSuccess(res) {
                                            exportToExcelApi(res, "act-sverka");
                                        },
                                        onError(err) {
                                            showErrorMessage(err);
                                        },
                                    },
                                )
                            }
                        >
                            Скачать в Excel
                        </Button>
                    </div>
                </div>

                <div className="flex-1 h-full border overflow-auto">
                    <Table className="rounded-lg overflow-auto w-max">
                        <THead className="sticky top-0 bg-white">
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
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </Th>
                                        );
                                    })}
                                </Tr>
                            ))}
                        </THead>

                        <TBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <Tr>
                                    <Td
                                        colSpan={columns.length}
                                        className="text-center py-10 text-slate-400"
                                    >
                                        <Empty />
                                    </Td>
                                </Tr>
                            ) : (
                                table
                                    .getRowModel()
                                    .rows.map((row, rowIndex) => {
                                        const isEven = rowIndex % 2 === 0;
                                        return (
                                            <Tr
                                                key={row.id}
                                                className={classNames(
                                                    isEven
                                                        ? "bg-slate-50"
                                                        : "bg-white",
                                                    "hover:bg-slate-100 transition-colors",
                                                )}
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell, index) => (
                                                        <Td
                                                            key={cell.id}
                                                            className={classNames(
                                                                "border border-slate-300 px-2 py-2.5 text-sm text-slate-700",
                                                                index === 0
                                                                    ? "text-center"
                                                                    : index ===
                                                                        1
                                                                      ? "text-left"
                                                                      : "text-right",
                                                                cell.column
                                                                    .columnDef
                                                                    .meta
                                                                    ?.bodyCellClassName,
                                                            )}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </Td>
                                                    ))}
                                            </Tr>
                                        );
                                    })
                            )}
                        </TBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
};

export default Tab7;
