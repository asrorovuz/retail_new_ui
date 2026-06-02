import {
    usePaymentAll,
    usePaymentCount,
} from "@/entities/contractor/repository";
import classNames from "@/shared/lib/classNames";
import { Button, DatePicker, Pagination, Table } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import TFoot from "@/shared/ui/kit/Table/TFoot";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { VscListFilter } from "react-icons/vsc";

const Tab4 = ({ id }: any) => {
    const [params, setParams] = useState({
        pageIndex: 1,
        pageSize: 20,
        // contractor_id: +id,
    });
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const { data, isPending: loading } = usePaymentAll(params);
    const { data: count } = usePaymentCount(params);

    const { control, watch } = useForm({
        defaultValues: {
            date_start: null,
            date_end: null,
            // contractor_id: +id,
        },
    });

    const dateStart = watch("date_start");
    const dateEnd = watch("date_end");

    const columns = useMemo(() => {
        return [
            {
                header: "№",
                accessorKey: "index",
                cell: ({ row }: any) => row.index + 1,
            },
            {
                header: "ТИП",
                accessorKey: "turi",
            },
            {
                header: "ОПЛАТА",
                accessorKey: "tolov",
            },
            {
                // Bu header avtomatik ravishda o'z sub-columnlari
                // kengligiga teng bo'ladi (9 ta sub-column)
                header: "ВИДЫ ОПЛАТЫ",
                columns: [
                    {
                        header: "НАЛИЧНЫЕ",
                        accessorKey: "naqd",
                    },
                    {
                        header: "UZCARD",
                        accessorKey: "uzcard",
                    },
                    {
                        header: "HUMO",
                        accessorKey: "humo",
                    },
                    {
                        header: "БАНКОВСКИЙ ПЕРЕВОД",
                        accessorKey: "bankOtkazmasi",
                    },
                    {
                        header: "CLICK",
                        accessorKey: "click",
                    },
                    {
                        header: "PAYME",
                        accessorKey: "payme",
                    },
                    {
                        header: "VISA",
                        accessorKey: "visa",
                    },
                    {
                        header: "UZUM",
                        accessorKey: "uzum",
                    },
                    {
                        header: "КЭШБЭК БОНУС",
                        accessorKey: "cashbackBonus",
                    },
                ],
            },
            {
                header: "ЗАКРЫТЫЙ ДОЛГ",
                accessorKey: "yopilganQarz",
            },
            {
                header: "ИСТОЧНИК ДОХОДА",
                accessorKey: "kirimManbasi",
            },
            {
                header: "ПОЛЬЗОВАТЕЛЬ",
                accessorKey: "foydalanuvchi",
            },
            {
                header: "КАССА",
                accessorKey: "kassa",
            },
            {
                header: "ИНФОРМАЦИЯ",
                accessorKey: "malumot",
            },
            {
                header: "ДАТА",
                accessorKey: "sana",
            },
        ];
    }, []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

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

    return (
        <div className="bg-white h-full flex-1 rounded-lg p-2 flex flex-col">
            <div className="flex justify-end mb-3">
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
                    {/* <Button
                        size="sm"
                        icon={<VscListFilter size={20} />}
                        onClick={() => setIsOpenFilter(!isOpenFilter)}
                    /> */}
                </div>
            </div>

            <div>
                <div
                    className={classNames(
                        "flex flex-col mb-3 h-[calc(100vh-252px)]",
                    )}
                >
                    <div className="h-full mb-3 border-slate-300 rounded-lg overflow-auto">
                        {data && data?.length > 0 && !loading ? (
                            <Table className="rounded-lg">
                                <THead className="sticky top-0">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <Tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <Th
                                                            className={classNames(
                                                                header.column
                                                                    .columnDef
                                                                    .meta
                                                                    ?.color,
                                                                "border bg-white",
                                                            )}
                                                            colSpan={
                                                                header.colSpan
                                                            } // ✅ shu qo'shildi
                                                            rowSpan={
                                                                // ✅ shu qo'shildi
                                                                header.isPlaceholder
                                                                    ? 1
                                                                    : !header
                                                                            .column
                                                                            .columns
                                                                            ?.length
                                                                      ? table.getHeaderGroups()
                                                                            .length -
                                                                        headerGroup.depth
                                                                      : 1
                                                            }
                                                            key={header.id}
                                                        >
                                                            {header.isPlaceholder ? null : ( // ✅ placeholder bo'lsa bo'sh
                                                                <div className="px-4 py-2 text-left font-medium text-xs xl:text-sm text-slate-800">
                                                                    {flexRender(
                                                                        header
                                                                            .column
                                                                            .columnDef
                                                                            .header,
                                                                        header.getContext(),
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Th>
                                                    ),
                                                )}
                                            </Tr>
                                        ))}
                                </THead>
                                <TBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <Tr
                                            key={row.id}
                                            className={`hover:bg-slate-100 transition`}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <Td
                                                        className={classNames(
                                                            cell.column
                                                                .columnDef.meta
                                                                ?.color ||
                                                                "#fff",
                                                            "border",
                                                        )}
                                                        key={cell.id}
                                                    >
                                                        <div
                                                            className={classNames(
                                                                cell.column
                                                                    .columnDef
                                                                    .meta
                                                                    ?.bodyCellClassName,
                                                                "text-xs xl:text-sm px-1",
                                                            )}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </div>
                                                    </Td>
                                                ))}
                                        </Tr>
                                    ))}
                                </TBody>
                                <TFoot>
                                    <Tr className="font-bold border">
                                        {/* № */}
                                        <Td>
                                            <div className="px-4 py-1">
                                                Итого
                                            </div>
                                        </Td>

                                        {/* Номер */}
                                        <Td />

                                        {/* Контрагент (agar pay bo‘lsa) */}
                                        <Td />

                                        {/* 🔹 ИТОГО */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <p className="flex justify-end text-nowrap whitespace-nowrap gap-1">
                                                    <FormattedNumber
                                                        value={
                                                            0
                                                            // summary?.totalsAmount
                                                        }
                                                    />
                                                    {/* <CurrencyName
                                                    currency={summary?.currency}
                                                /> */}
                                                </p>
                                            </div>
                                        </Td>

                                        <Td>
                                            <div className="px-4 text-end">
                                                <p className="flex justify-end text-nowrap h-full whitespace-nowrap gap-1">
                                                    <FormattedNumber
                                                        value={0}
                                                    />
                                                    {/* <CurrencyName
                                                            currency={
                                                                summary?.currency
                                                            }
                                                        /> */}
                                                </p>
                                            </div>
                                        </Td>

                                        {/* 🔹 ДОЛГ */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <p className="flex justify-end text-nowrap whitespace-nowrap gap-1">
                                                    <FormattedNumber
                                                        value={0}
                                                    />
                                                    {/* <CurrencyName
                                                            currency={
                                                                summary?.currency
                                                            }
                                                        /> */}
                                                </p>
                                            </div>
                                        </Td>

                                        {/* Касса */}
                                        <Td />

                                        {/* Employee */}
                                        <Td />

                                        {/* Status */}
                                        <Td />
                                    </Tr>
                                </TFoot>
                            </Table>
                        ) : (
                            <Empty size={150} textSize="32px" />
                        )}
                    </div>
                </div>
                <Pagination
                    displayTotal={false}
                    total={count || 0}
                    pageSize={params.pageSize}
                    pageSizeOptions={[10, 20, 50, 100, 1000]}
                    currentPage={params.pageIndex}
                    onChange={(page, size) =>
                        setParams((prev: any) => ({
                            ...prev,
                            pageIndex: page,
                            pageSize: size || params.pageSize,
                        }))
                    }
                />
            </div>
        </div>
    );
};

export default Tab4;
