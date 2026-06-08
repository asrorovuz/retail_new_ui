import { messages } from "@/app/constants/message.request";
import { useAuthContext } from "@/app/providers/AuthProvider";
import {
    useDeletePayout,
    usePayoutAll,
    usePayoutCount,
} from "@/entities/contractor/repository";
import PaymentDebtsModal from "@/features/modals/ui/PaymentDebtsModal";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import {
    Button,
    DatePicker,
    Dropdown,
    Pagination,
    Table,
} from "@/shared/ui/kit";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import DropdownItem from "@/shared/ui/kit/Dropdown/DropdownItem";
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
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";

const Tab4 = ({ id }: any) => {
    const [params, setParams] = useState({
        pageIndex: 1,
        pageSize: 20,
        contractor_id: id,
        date_start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        date_end: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    });
    const [deleteId, setDeleteId] = useState<any>(null);
    const [dobtModal, setDebitModal] = useState(false);
    const [localAmount, setLocalAmount] = useState(0);
    const [debtsStatus, setDebtsStatus] = useState(2);
    const [payoutId, setPayoutId] = useState<any>(null);
    const [initialCashBoxStates, setInitialCashBoxStates] = useState<
        { amount: number; type: number }[] | null
    >(null);

    const { user } = useAuthContext();

    const { data, isPending: loading } = usePayoutAll(params);
    const { data: count } = usePayoutCount(params);
    const { mutate: deletePayout, isPending: deleteLoading } =
        useDeletePayout();

    const { control, watch } = useForm({
        defaultValues: {
            date_start: dayjs().startOf("day").toDate(),
            date_end: dayjs().endOf("day").toDate(),
            contractor_id: id,
        },
    });

    const dateStart = watch("date_start");
    const dateEnd = watch("date_end");

    const onDelete = (id: any) => {
        setDeleteId(id);
    };

    const onConfirmDelete = () => {
        deletePayout(deleteId, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                setDeleteId(null); // dialogni yopadi
            },
            onError(err) {
                showErrorMessage(err);
                setDeleteId(null);
            },
        });
    };

    const onCloseDelete = () => {
        setDeleteId(null);
    };

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
                cell: () => {
                    return (
                        <div className="bg-blue-100 text-blue-900 rounded-full p-1">
                            Поставщик
                        </div>
                    );
                },
            },
            {
                header: "ОПЛАТА",
                accessorKey: "tolov",
                cell: ({ row }: any) => {
                    return (
                        <div className="flex flex-col items-end w-full">
                            {row?.original?.cash_box_states?.map(
                                (item: any) => {
                                    return (
                                        <div className="flex gap-x-1 justify-end w-max text-right">
                                            <FormattedNumber
                                                value={item?.amount ?? 0}
                                            />
                                            <span>Сум</span>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    );
                },
            },
            {
                // Bu header avtomatik ravishda o'z sub-columnlari
                // kengligiga teng bo'ladi (9 ta sub-column)
                header: "ВИДЫ ОПЛАТЫ",
                columns: [
                    {
                        header: "НАЛИЧНЫЕ",
                        accessorKey: "naqd",
                        cell: ({ row }: any) => {
                            const pay = row.original?.cash_box_states?.find(
                                (item: any) => item?.type === 1,
                            );
                            return (
                                <div className="flex justify-end">
                                    <FormattedNumber value={pay?.amount ?? 0} />
                                </div>
                            );
                        },
                    },
                    {
                        header: "UZCARD",
                        accessorKey: "uzcard",
                        cell: ({ row }: any) => {
                            const pay = row.original?.cash_box_states?.find(
                                (item: any) => item?.type === 2,
                            );
                            return (
                                <div className="flex justify-end">
                                    <FormattedNumber value={pay?.amount ?? 0} />
                                </div>
                            );
                        },
                    },
                    {
                        header: "HUMO",
                        accessorKey: "humo",
                        cell: ({ row }: any) => {
                            const pay = row.original?.cash_box_states?.find(
                                (item: any) => item?.type === 3,
                            );
                            return (
                                <div className="flex justify-end">
                                    <FormattedNumber value={pay?.amount ?? 0} />
                                </div>
                            );
                        },
                    },
                    {
                        header: "БАНКОВСКИЙ ПЕРЕВОД",
                        accessorKey: "bankOtkazmasi",
                        cell: ({ row }: any) => {
                            const pay = row.original?.cash_box_states?.find(
                                (item: any) => item?.type === 4,
                            );
                            return (
                                <div className="flex justify-end">
                                    <FormattedNumber value={pay?.amount ?? 0} />
                                </div>
                            );
                        },
                    },
                    {
                        header: "CLICK",
                        accessorKey: "click",
                        cell: ({ row }: any) => {
                            const pay = row.original?.cash_box_states?.find(
                                (item: any) => item?.type === 5,
                            );
                            return (
                                <div className="flex justify-end">
                                    <FormattedNumber value={pay?.amount ?? 0} />
                                </div>
                            );
                        },
                    },
                    {
                        header: "PAYME",
                        accessorKey: "payme",
                        cell: ({ row }: any) => {
                            const pay = row.original?.cash_box_states?.find(
                                (item: any) => item?.type === 6,
                            );
                            return (
                                <div className="flex justify-end">
                                    <FormattedNumber value={pay?.amount ?? 0} />
                                </div>
                            );
                        },
                    },
                    {
                        header: "VISA",
                        accessorKey: "visa",
                        cell: ({ row }: any) => {
                            const pay = row.original?.cash_box_states?.find(
                                (item: any) => item?.type === 7,
                            );
                            return (
                                <div className="flex justify-end">
                                    <FormattedNumber value={pay?.amount ?? 0} />
                                </div>
                            );
                        },
                    },
                    // {
                    //     header: "UZUM",
                    //     accessorKey: "uzum",
                    //     cell: ({ row }: any) => {
                    //         const pay = row.original?.cash_box_states?.find(
                    //             (item: any) => item?.type === 1,
                    //         );
                    //         return (
                    //             <div className="flex justify-end">
                    //                 <FormattedNumber value={pay ?? 0} />
                    //             </div>
                    //         );
                    //     },
                    // },
                ],
            },
            {
                header: "ЗАКРЫТЫЙ ДОЛГ",
                accessorKey: "yopilganQarz",
                cell: ({ row }: any) => {
                    const total = row.original.debt_states?.reduce(
                        (sum: any, acc: any) => sum + acc.amount,
                        0,
                    );
                    return (
                        <div className="flex justify-end">
                            <FormattedNumber value={total ?? 0} />
                        </div>
                    );
                },
            },
            // {
            //     header: "ИСТОЧНИК ДОХОДА",
            //     accessorKey: "kirimManbasi",
            // },
            {
                header: "ПОЛЬЗОВАТЕЛЬ",
                accessorKey: "foydalanuvchi",
                cell: () => {
                    return (
                        <div className="flex justify-center">{user?.name}</div>
                    );
                },
            },
            {
                header: "КАССА",
                accessorKey: "kassa",
                cell: ({ row }: any) => {
                    return (
                        <div className="flex justify-center">
                            {row.original?.cash_box?.name}
                        </div>
                    );
                },
            },
            {
                header: "ИНФОРМАЦИЯ",
                accessorKey: "malumot",
                cell: ({ row }: any) => {
                    return (
                        <div className="flex justify-center">
                            {row.original?.notes}
                        </div>
                    );
                },
            },
            {
                header: "ДАТА",
                accessorKey: "sana",
                cell: ({ row }: any) => {
                    return (
                        <div className="flex justify-center w-max">
                            {row.original?.date}
                        </div>
                    );
                },
            },
            {
                header: "",
                accessorKey: "action",
                cell: ({ row }) => {
                    return (
                        <Dropdown
                            renderTitle={
                                <div className="w-full h-full flex justify-center text-2xl text-slate-600">
                                    <HiOutlineDotsHorizontal />
                                </div>
                            }
                        >
                            <DropdownItem
                                onClick={() => {
                                    setDebitModal(true);
                                    setDebtsStatus(2);
                                    setPayoutId(row.original?.id);
                                    setInitialCashBoxStates(
                                        row.original?.cash_box_states,
                                    );
                                }}
                                className="h-auto!"
                            >
                                <div className="w-full flex items-center gap-2 text-orange-500 py-3 px-5 rounded-lg">
                                    <FaRegEdit size={20} />
                                    Редактировать
                                </div>
                            </DropdownItem>

                            <DropdownItem
                                onClick={() => onDelete(row.original?.id)}
                                className="h-auto!"
                            >
                                <div className="w-full flex items-center gap-2 text-red-500 py-3 px-5 rounded-lg">
                                    <IoTrashOutline size={20} />
                                    Удалить
                                </div>
                            </DropdownItem>
                        </Dropdown>
                    );
                },
            },
        ];
    }, []);

    const summary = useMemo(() => {
        return data?.reduce(
            (acc: any, item: any) => {
                item?.cash_box_states?.forEach((pay: any) => {
                    acc.payments[pay.type] =
                        (acc.payments[pay.type] || 0) + (pay.amount || 0);
                });

                acc.debt +=
                    item?.debt_states?.reduce(
                        (sum: number, debt: any) => sum + (debt.amount || 0),
                        0,
                    ) || 0;

                return acc;
            },
            {
                payments: {},
                debt: 0,
            },
        );
    }, [data]);

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

                    <Button
                        onClick={() => {
                            setDebitModal(true);
                            setLocalAmount(0);
                            setDebtsStatus(2);
                            setInitialCashBoxStates(null);
                        }}
                        variant="solid"
                        size="sm"
                        icon={<FaPlus />}
                    >
                        Добавить
                    </Button>
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
                                            <div className="px-4 py-1">Итого</div>
                                        </Td>
                                        {/* ТИП */}
                                        <Td />
                                        {/* ОПЛАТА */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber
                                                    value={Object.values(summary?.payments ?? {}).reduce((s: number, v: any) => s + v, 0)}
                                                />
                                            </div>
                                        </Td>
                                        {/* НАЛИЧНЫЕ */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.payments?.[1] ?? 0} />
                                            </div>
                                        </Td>
                                        {/* UZCARD */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.payments?.[2] ?? 0} />
                                            </div>
                                        </Td>
                                        {/* HUMO */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.payments?.[3] ?? 0} />
                                            </div>
                                        </Td>
                                        {/* БАНКОВСКИЙ ПЕРЕВОД */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.payments?.[4] ?? 0} />
                                            </div>
                                        </Td>
                                        {/* CLICK */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.payments?.[5] ?? 0} />
                                            </div>
                                        </Td>
                                        {/* PAYME */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.payments?.[6] ?? 0} />
                                            </div>
                                        </Td>
                                        {/* VISA */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.payments?.[7] ?? 0} />
                                            </div>
                                        </Td>
                                        {/* ЗАКРЫТЫЙ ДОЛГ */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <FormattedNumber value={summary?.debt ?? 0} />
                                            </div>
                                        </Td>
                                        {/* ПОЛЬЗОВАТЕЛЬ */}
                                        <Td />
                                        {/* КАССА */}
                                        <Td />
                                        {/* ИНФОРМАЦИЯ */}
                                        <Td />
                                        {/* ДАТА */}
                                        <Td />
                                        {/* action */}
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

            <ConfirmDialog
                type="danger"
                className="w-[600px]"
                title="Вы уверены, что хотите продолжить?"
                isOpen={!!deleteId} // ✅ deleteId bo'lsa ochiq
                confirmButtonProps={{
                    loading: deleteLoading, // ✅ loading holati
                    onClick: onConfirmDelete, // ✅ tasdiqlash
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={onCloseDelete} // ✅ yopish
                onRequestClose={onCloseDelete}
                onCancel={onCloseDelete}
            >
                <p className="text-gray-600">
                    Удаление записи. Это действие нельзя отменить.
                </p>
            </ConfirmDialog>

            <PaymentDebtsModal
                type={payoutId ? "edit" : "add"}
                amount={localAmount}
                dobtModal={dobtModal}
                setDebitModal={setDebitModal}
                contractorId={Number(id) ?? null}
                setContragentId={() => {}}
                debtsStatus={debtsStatus}
                setDebtsStatus={setDebtsStatus}
                payoutId={payoutId}
                setPayoutId={setPayoutId}
                cashBoxStates={initialCashBoxStates ?? undefined}
            />
        </div>
    );
};

export default Tab4;
