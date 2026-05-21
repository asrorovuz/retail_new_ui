import { useContragentApi } from "@/entities/history/repository";
import { useSellTransferApi } from "@/entities/sale/repository";
import classNames from "@/shared/lib/classNames";
import { DatePicker, Select, Table } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Loading from "@/shared/ui/loading";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const ReportPage = () => {
    const [params, setParams] = useState({
        start_date: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
        end_date: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
        contractor_id: null,
    });

    const columnHelper = createColumnHelper<any>();

    const { data, isPending } = useSellTransferApi(params);
    const { data: contragentData } = useContragentApi(true);

    const contragentOption = useMemo(() => {
        return (
            contragentData?.map((item: any) => ({
                label: item?.name,
                value: item?.id,
            })) || []
        );
    }, [contragentData]);

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "index",
                header: "№",
                cell: (info) => (
                    <div className="w-[60px]">{info?.row?.index + 1}</div>
                ),
            }),
            columnHelper.accessor("name", {
                header: "НАЗВАНИЕ",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("quantity", {
                header: "Kол-во",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("totalPrice", {
                header: "Общая сумма",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("price", {
                header: "Роз.цена",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("bulkPrice", {
                header: "Опт.цена",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("ikpu", {
                header: "ИКПУ код",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("barcode", {
                header: "Штрих-код",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("code", {
                header: "Код",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
            columnHelper.accessor("artikul", {
                header: "Артикул",
                cell: (info) => (
                    <p className="w-[280px]">{info.getValue() || "-"}</p>
                ),
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: (data?.report as unknown as any[]) || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isPending)
        return (
            <div className={classNames("p-4 space-y-3 mb-3 h-full")}>
                <Loading />
            </div>
        );

    return (
        <div className="bg-white h-screen p-3">
            <NavigateButton content="Отчёты по продажам за период" />
            <div className="mb-3 grid grid-cols-4 gap-2 justify-between">
                <Select
                    size="sm"
                    placeholder="Контрагент"
                    options={contragentOption}
                    isClearable
                    value={contragentOption.find(
                        (opt: any) => opt.value === params.contractor_id,
                    )}
                    onChange={(val) =>
                        setParams((prev: any) => ({
                            ...prev,
                            contractor_id: val?.value ?? null,
                        }))
                    }
                />
                <div className="relative">
                    <DatePicker
                        inputFormat="YYYY-DD-MM"
                        size="sm"
                        placeholder={"Дата начала"}
                        closePickerOnChange={true}
                        clearable={false}
                        inputtable={true}
                        value={
                            params.start_date
                                ? new Date(params.start_date)
                                : null
                        }
                        onChange={(date) =>
                            setParams((prev: any) => ({
                                ...prev,
                                start_date: dayjs(date)
                                    .startOf("day")
                                    .format("YYYY-MM-DD HH:mm"),
                            }))
                        }
                    />
                </div>

                <div className="relative">
                    <DatePicker
                        inputFormat="YYYY-DD-MM"
                        size="sm"
                        placeholder={"Дата окончания"}
                        closePickerOnChange={true}
                        clearable={false}
                        inputtable={true}
                        value={
                            params.end_date ? new Date(params.end_date) : null
                        }
                        onChange={(date) =>
                            setParams((prev: any) => ({
                                ...prev,
                                end_date: dayjs(date)
                                    .endOf("day")
                                    .format("YYYY-MM-DD HH:mm"),
                            }))
                        }
                    />
                </div>
            </div>
            <div className={classNames("flex flex-col mb-3 h-full flex-1")}>
                {/* 🔹 Jadval */}
                <div className="h-full flex-1 mb-3 border border-slate-300 rounded-lg overflow-auto">
                    {data && data?.length > 0 && !isPending ? (
                        <Table className="min-w-full table-fixed border-separate border-spacing-0">
                            <THead className="sticky top-0">
                                {table.getHeaderGroups().map((headerGroup) => {
                                    return (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map(
                                                (header) => {
                                                    const isActionsColumn =
                                                        header.column.id ===
                                                        "actions";
                                                    return (
                                                        <Th
                                                            className={
                                                                isActionsColumn
                                                                    ? " bg-white"
                                                                    : ""
                                                            }
                                                            key={header.id}
                                                        >
                                                            <div
                                                                className={classNames(
                                                                    "px-4 text-left font-medium text-xs xl:text-sm text-slate-800",
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.headerClassName,
                                                                )}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext(),
                                                                )}
                                                            </div>
                                                        </Th>
                                                    );
                                                },
                                            )}
                                        </Tr>
                                    );
                                })}
                            </THead>
                            <TBody>
                                {table.getRowModel().rows.map((row, index) => (
                                    <Tr
                                        key={row.id}
                                        className={`${index % 2 ? "bg-white" : "bg-slate-100"} hover:bg-slate-100 transition`}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <Td
                                                    key={cell.id}
                                                    className={classNames(
                                                        cell.column.columnDef
                                                            .meta
                                                            ?.bodyCellClassName,
                                                    )}
                                                >
                                                    <div
                                                        className={classNames(
                                                            "py-3 text-xs xl:text-sm px-4",
                                                        )}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </div>
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    ) : (
                        <div>
                            <Empty />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
