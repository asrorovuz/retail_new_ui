import { useActReport } from "@/entities/contractor/repository";
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
                header: "№",
                cell: ({ row }) => row.index + 1,
            },
            {
                header: "Операции",
                accessorKey: "operation",
                // cell: ({ row }) => <span></span>,
            },
            {
                header: "Предыдущий долг",
                accessorKey: "debts",
                cell: ({ row }) => (
                    <span>
                        <FormattedNumber
                            value={
                                calcDebts(row?.original?.before_debts || []) ||
                                0
                            }
                        />
                    </span>
                ),
            },
            {
                header: "Увеличение задолженности",
                accessorKey: "name",
                cell: ({ row }) => (
                    <span>
                        <FormattedNumber
                            value={
                                calcDebts(row?.original?.after_debts || []) || 0
                            }
                        />
                    </span>
                ),
            },
            {
                header: "Уменьшение задолженности",
                accessorKey: "name",
                // cell: ({ row }) => <span></span>,
            },
            {
                header: "Последующая задолженность",
                accessorKey: "after_debts",
                cell: ({ row }) => (
                    <span>
                        <FormattedNumber
                            value={
                                calcDebts(row?.original?.after_debts || []) || 0
                            }
                        />
                    </span>
                ),
            },
            {
                header: "Пользователи",
                accessorKey: "name",
                // cell: ({ row }) => <span></span>,
            },
            {
                header: "Дата",
                accessorKey: "name",
                cell: ({ row }) => (
                    <div className="w-max px-2">
                        {dayjs(row?.original?.date).format("HH:mm YYYY-MM-DD")}
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
                <div className="flex gap-x-2 justify-between">
                    <span>-</span>
                    <div className="flex gap-x-2">
                        <Button
                            size="sm"
                            variant="solid"
                            icon={
                                <>
                                    <PiMicrosoftExcelLogoDuotone />
                                </>
                            }
                        >
                            Скачать в Excel
                        </Button>
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
