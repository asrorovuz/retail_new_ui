import { useCashboxStore } from "@/app/store/useCashbox";
import {
    useCashExpenseApi,
    useCashExpenseCountApi,
    useCashInApi,
    useCashInCountApi,
    useCashOutApi,
    useCashOutCountApi,
    useDeleteCashExpense,
    useDeleteCashIn,
    useDeleteCashOut,
} from "@/entities/cashbox/repository";
import { useCashboxApi } from "@/entities/init/repository";
import CashboxFormModal from "@/features/cashbox-form";
import classNames from "@/shared/lib/classNames";
import { usePermission } from "@/shared/lib/controlActionWithPermission";
import CurrencyName from "@/shared/lib/CurrencyName";
import { Button, DatePicker, Pagination, Table } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Loading from "@/shared/ui/loading";
import { CommonDeleteDialog } from "@/widgets";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const defaultStart = dayjs().startOf("day");
const defaultEnd = dayjs().endOf("day");

const CashboxOperations = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [id, setId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(
        defaultStart.toDate(),
    );
    const [endDate, setEndDate] = useState<Date | null>(defaultStart.toDate());
    const { type, setType } = useCashboxStore((state) => state);

    const { data } = useCashboxApi();

    const { checkPermissionByAction } = usePermission();
    const typeCash =
        type === 1 ? "cashIn" : type === 2 ? "cashOut" : "cashExpense";
    const canCreate = checkPermissionByAction(typeCash, "create");
    const canUpdate = checkPermissionByAction(typeCash, "update");
    const canDelete = checkPermissionByAction(typeCash, "delete");

    const onCloseModal = () => {
        setIsOpen(false);
        setType(type);
        setId(null);
    };

    const [params, setParams] = useState<any>({
        skip: 0,
        limit: 20,
        cash_box_id: data?.[0]?.id,
        date_start: defaultStart.format("YYYY-MM-DD HH:mm:ss"),
        date_end: defaultEnd.format("YYYY-MM-DD HH:mm:ss"),
    });

    const { data: cashInData, isPending: cashInPending } = useCashInApi(
        params,
        type === 1,
    );
    const { data: cashOutData, isPending: cashOutPending } = useCashOutApi(
        params,
        type === 2,
    );
    const { data: cashExpenseData, isPending: cashExpensePending } =
        useCashExpenseApi(params, type === 3);
    const { data: cashInDataCount } = useCashInCountApi(
        {
            cash_box_id: data?.[0]?.id,
            date_start: params.date_start,
            date_end: params.date_end,
        },
        type === 1,
    );
    const { data: cashOutDataCount } = useCashOutCountApi(
        {
            cash_box_id: data?.[0]?.id,
            date_start: params.date_start,
            date_end: params.date_end,
        },
        type === 2,
    );
    const { data: cashExpenseDataCount } = useCashExpenseCountApi(
        {
            cash_box_id: data?.[0]?.id,
            date_start: params.date_start,
            date_end: params.date_end,
        },
        type === 3,
    );
    const { mutate: deleteCashIn } = useDeleteCashIn();
    const { mutate: deleteCashOut } = useDeleteCashOut();
    const { mutate: deleteCashExpense } = useDeleteCashExpense();

    const selectedData =
        type === 1 ? cashInData : type === 2 ? cashOutData : cashExpenseData;
    const isPending =
        type === 1
            ? cashInPending
            : type === 2
              ? cashOutPending
              : cashExpensePending;
    const totalCount =
        type === 1
            ? cashInDataCount
            : type === 2
              ? cashOutDataCount
              : cashExpenseDataCount;

    const updateParams = (newValues: Partial<typeof params>) => {
        setParams((prev: any) => ({
            ...prev,
            ...newValues,
        }));
    };

    const onDeleteItems = (id: number) => {
        if (type === 1) {
            deleteCashIn(id, {
                onSuccess: () => {
                    updateParams({});
                },
            });
        } else if (type === 2) {
            deleteCashOut(id, {
                onSuccess: () => {
                    updateParams({});
                },
            });
        } else if (type === 3) {
            deleteCashExpense(id, {
                onSuccess: () => {
                    updateParams({});
                },
            });
        }
    };

    const columns = useMemo(() => {
        const baseColumns = [
            {
                id: "index",
                header: "№",
                cell: (info: any) => info.row.index + 1,
            },
            {
                id: "cashbox",
                header: "Касса",
                cell: (info: any) => info.row.original.cash_box?.name || "-",
            },
            {
                id: "amount",
                header: "Сумма",
                cell: (info: any) => {
                    const amounts = info.row.original.amounts;
                    if (!amounts || amounts.length === 0) return "-";

                    return (
                        <span>
                            {amounts[0].amount.toLocaleString()}{" "}
                            <CurrencyName currency={amounts[0]?.currency} />
                        </span>
                    );
                },
            },
            {
                id: "type",
                header: "Тип",
                cell: (info: any) => info.row.original.type?.text || "-",
            },
            {
                id: "notes",
                header: "Примечание",
                cell: (info: any) => info.row.original.notes || "-",
            },
            {
                id: "date",
                header: "Дата",
                cell: (info: any) =>
                    dayjs(
                        info.row.original.date || info.row.original.created_at,
                    ).format("DD-MM-YYYY"),
            },
        ];

        if (canDelete || canUpdate) {
            baseColumns.push({
                id: "actions",
                header: "Действие",
                cell: (info: any) => (
                    <div className="flex items-center gap-2">
                        {canUpdate && (
                            <Button
                                variant="plain"
                                onClick={() => {
                                    setIsOpen(true);
                                    setModalType("edit");
                                    setId(info.row.original.id);
                                }}
                                className="bg-transparent text-blue-500 hover:text-blue-400"
                                icon={<FaRegEdit />}
                            />
                        )}

                        {canDelete && (
                            <CommonDeleteDialog
                                children={
                                    <span className="text-red-500">
                                        <IoTrashOutline size={18} />
                                    </span>
                                }
                                title="Удалить операцию с кассой"
                                description="Вы уверены, что хотите удалить эту операцию с кассой? Это действие нельзя будет отменить."
                                onDelete={() =>
                                    onDeleteItems(info.row.original.id)
                                }
                            />
                        )}
                    </div>
                ),
            });
        }

        return baseColumns;
    }, [canDelete, canUpdate, selectedData]);

    const handleStartDateChange = (date: Date | null) => {
        const start = dayjs(date).startOf("day");

        setStartDate(date);

        setParams((prev: any) => ({
            ...prev,
            skip: 0,
            date_start: start.format("YYYY-MM-DD HH:mm:ss"),
        }));
    };

    const handleEndDateChange = (date: Date | null) => {
        const end = dayjs(date).endOf("day");

        setEndDate(date);

        setParams((prev: any) => ({
            ...prev,
            skip: 0,
            date_end: end.format("YYYY-MM-DD HH:mm:ss"),
        }));
    };

    const table = useReactTable({
        data: (selectedData as unknown as any) || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isPending)
        return (
            <div className="p-4 space-y-3">
                <Loading />
            </div>
        );

    return (
        <div className="bg-white p-4 h-screen flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <Button
                    onClick={() => {
                        (setType(0), navigate(-1));
                    }}
                    variant="plain"
                    className="bg-transparent"
                    icon={<IoIosArrowRoundBack size={28} />}
                >
                    <h2 className="text-lg font-semibold text-slate-800 ">
                        {type === 1 && "Входящие"}
                        {type === 2 && "Исходящие"}
                        {type === 3 && "Расход"}
                    </h2>
                </Button>
                <div className="flex items-center gap-x-3">
                    <div className="relative">
                        <DatePicker
                            inputFormat="DD-MM-YYYY"
                            size="sm"
                            placeholder={"Выберите дату"}
                            closePickerOnChange={true}
                            inputtable={true}
                            onChange={handleStartDateChange}
                            defaultValue={startDate}
                            value={startDate}
                        />
                    </div>
                    <div className="relative">
                        <DatePicker
                            inputFormat="DD-MM-YYYY"
                            size="sm"
                            placeholder={"Выберите дату"}
                            closePickerOnChange={true}
                            inputtable={true}
                            onChange={handleEndDateChange}
                            defaultValue={endDate}
                            value={endDate}
                        />
                    </div>
                    {canCreate && (
                        <Button
                            onClick={() => {
                                setIsOpen(true);
                                setModalType("add");
                            }}
                            size="sm"
                            variant="solid"
                        >
                            + Добавить
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 mb-3 border border-slate-300 rounded-lg overflow-y-auto">
                {selectedData && selectedData.length > 0 && !isPending ? (
                    <Table className="w-full table-fixed">
                        <THead className="bg-white sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th key={header.id}>
                                            <div
                                                className={classNames(
                                                    "px-4 py-3 text-left font-medium text-xs xl:text-sm text-slate-800",
                                                    header.column.columnDef.meta
                                                        ?.headerClassName,
                                                )}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                            </div>
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </THead>
                        <TBody>
                            {table.getRowModel().rows.map((row) => (
                                <Tr
                                    key={row.id}
                                    className={` hover:bg-slate-200 transition`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Td
                                            className={classNames(
                                                cell.column.columnDef.meta
                                                    ?.color || "#fff",
                                            )}
                                            key={cell.id}
                                        >
                                            <div
                                                className={classNames(
                                                    "px-4 py-3 text-xs xl:text-sm",
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </div>
                                        </Td>
                                    ))}
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                ) : (
                    <Empty />
                )}
            </div>

            {/* 🔹 Pagination */}
            <Pagination
                displayTotal
                total={totalCount || 0}
                pageSize={params.limit}
                pageSizeOptions={[20, 50, 100, 1000]}
                currentPage={Math.floor(params.skip / params.limit) + 1}
                onChange={(page, size) => {
                    const newLimit = size || params.limit;
                    const newSkip = (page - 1) * newLimit;

                    updateParams({
                        skip: newSkip,
                        limit: newLimit,
                    });
                }}
            />

            <CashboxFormModal
                cashId={id}
                isOpen={isOpen}
                type={type}
                onCloseModal={onCloseModal}
                cashbox={data || []}
                modalType={modalType}
            />
        </div>
    );
};

export default CashboxOperations;
