import { GetPaymentLabel } from "@/app/constants/payment.types";
import classNames from "@/shared/lib/classNames";
import CurrencyName from "@/shared/lib/CurrencyName";
import payment from "@/shared/lib/payment";
import { Dropdown, Pagination, Table, Tooltip } from "@/shared/ui/kit";
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
import Loading from "@/shared/ui/loading";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { TbEye } from "react-icons/tb";

interface ReturnRow {
    id: number;
    number?: number;
    total: number;
    payment?: number;
    discount?: number;
    debt: number;
    employee?: string;
    created_at?: string;
}

interface Props {
    data: ReturnRow[];
    count?: number;
    loading?: boolean;
    setParams: (fn: (p: any) => any) => void;
    setViewModal: any;
    params: any;
    onEdit?: (data: any) => void;
}

const ReturnPurchaseTable = ({
    data,
    count,
    loading,
    setParams,
    setViewModal,
    params,
    onEdit,
}: Props) => {
    const columns = useMemo<ColumnDef<ReturnRow>[]>(
        () => [
            {
                id: "index",
                header: "№",
                cell: ({ row }) => (
                    <div className="text-gray-400 !w-12">{row.index + 1}</div>
                ),
                meta: {
                    bodyCellClassName: "!w-12",
                    headerClassName: "!w-12",
                },
                size: 48,
            },
            {
                accessorKey: "id",
                header: "ID",
                cell: ({ getValue }) => (
                    <span className="font-medium">{getValue<number>()}</span>
                ),
                size: 60,
            },
            {
                accessorKey: "total",
                header: "ИТОГО",
                cell: ({ row }: any) => {
                    const totals = row.original?.totals;
                    return (
                        <div className="whitespace-nowrap">
                            {totals ? (
                                totals.map((item: any, index: number) => (
                                    <p
                                        key={index}
                                        className="heading-text font-bold whitespace-nowrap flex gap-x-1"
                                    >
                                        <FormattedNumber value={item?.amount} />
                                        <CurrencyName
                                            currency={item?.currency}
                                        />
                                    </p>
                                ))
                            ) : (
                                <p className="heading-text font-bold">0</p>
                            )}
                        </div>
                    );
                },
                size: 140,
            },
            {
                accessorKey: "payment",
                header: "ОПЛАТА",
                meta: {
                    bodyCellClassName: "text-end",
                },
                cell: ({ row }) => {
                    const { ["payment" as string]: payData } =
                        row.original as any;
                    const { cash_box_states } = payData || {};

                    return (
                        <div className="whitespace-nowrap text-nowrap">
                            {cash_box_states ? (
                                payment
                                    ?.calculateToPay(cash_box_states)
                                    ?.map((item: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex gap-1 items-center"
                                        >
                                            <p className="heading-text font-bold whitespace-nowrap flex gap-x-1">
                                                <FormattedNumber
                                                    value={item?.amount}
                                                />
                                                <CurrencyName
                                                    currency={item.currency}
                                                />
                                            </p>
                                            <Tooltip
                                                title={
                                                    <div className="flex flex-col gap-y-2 min-w-[200px]">
                                                        {cash_box_states?.map(
                                                            (
                                                                item: any,
                                                                i: number,
                                                            ) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex justify-between text-sm"
                                                                >
                                                                    <span>
                                                                        {GetPaymentLabel(
                                                                            item?.type,
                                                                        )}
                                                                    </span>
                                                                    <span className="font-medium">
                                                                        <FormattedNumber
                                                                            value={
                                                                                item?.amount
                                                                            }
                                                                            scale={
                                                                                2
                                                                            }
                                                                        />
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                }
                                            >
                                                <span className="cursor-pointer p-2">
                                                    <TbEye size={22} />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    ))
                            ) : (
                                <p className="heading-text font-bold">0</p>
                            )}
                        </div>
                    );
                },
            },
            // {
            //     accessorKey: "discount",
            //     header: "СКИДКА",
            //     meta: {
            //         bodyCellClassName: "text-end",
            //     },
            //     cell: ({ row }: any) => {
            //         const totals = row.original?.exact_discounts;
            //         console.log(row.original);

            //         return (
            //             <div className="whitespace-nowrap">
            //                 {totals ? (
            //                     totals.map((item: any, index: number) => (
            //                         <p
            //                             key={index}
            //                             className="heading-text font-bold whitespace-nowrap flex gap-x-1"
            //                         >
            //                             <FormattedNumber value={item?.amount} />
            //                             <CurrencyName
            //                                 currency={item?.currency}
            //                             />
            //                         </p>
            //                     ))
            //                 ) : (
            //                     <p className="heading-text font-bold">0</p>
            //                 )}
            //             </div>
            //         );
            //     },
            // },
            {
                accessorKey: "account.name",
                header: "СОТРУДНИК",
            },
            {
                accessorKey: "created_at",
                header: "ДАТА",
                cell: ({ row }: any) => {
                    const date = row.original?.date;
                    return <div>{new Date(date).toLocaleString()}</div>;
                },
                size: 170,
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <Dropdown
                        renderTitle={
                            <div className="w-full h-full flex justify-center text-2xl text-slate-600">
                                <HiOutlineDotsHorizontal />
                            </div>
                        }
                    >
                        <DropdownItem
                            onClick={() =>
                                setViewModal({
                                    isOpen: true,
                                    id: row.original?.id,
                                })
                            }
                            className="h-auto!"
                        >
                            <div className="w-full flex items-center gap-2 text-slate-700 py-3 px-5 rounded-lg">
                                <TbEye size={22} />
                                Посмотреть
                            </div>
                        </DropdownItem>

                        <DropdownItem
                            onClick={() => onEdit?.(row.original)}
                            className="h-auto!"
                        >
                            <div className="w-full flex items-center gap-2 text-orange-500 py-3 px-5 rounded-lg">
                                <FaRegEdit size={20} />
                                Редактировать
                            </div>
                        </DropdownItem>

                        <DropdownItem
                            // onClick={() => {
                            //     setId(row.original.id);
                            //     setIsOpenDelete(true);
                            // }}
                            className="h-auto!"
                        >
                            <div className="w-full flex items-center gap-2 text-red-500 py-3 px-5 rounded-lg">
                                <IoTrashOutline size={20} />
                                Удалить
                            </div>
                        </DropdownItem>
                    </Dropdown>
                ),
                size: 40,
            },
        ],
        [data, setViewModal, onEdit],
    );

    const totals = useMemo(() => {
        let totalsAmount = 0;
        let payAmount = 0;
        let debtAmount = 0;

        let currency: any = null;

        data?.forEach((row: any) => {
            // 🔹 Итого
            row?.totals?.forEach((t: any) => {
                totalsAmount += Number(t.amount || 0);

                // 🔹 currency ni faqat bir marta olish
                if (!currency && t.currency) {
                    currency = t.currency;
                }
            });

            // 🔹 Оплата
            const payData = row?.payment?.cash_box_states;
            if (payData) {
                payment.calculateToPay(payData)?.forEach((p: any) => {
                    payAmount += Number(p.amount || 0);

                    // 🔹 currency ni faqat bir marta olish
                    if (!currency && p.currency) {
                        currency = p.currency;
                    }
                });
            }

            // 🔹 Долг
            row?.debts &&
                payment.calculateToPay(row.debts)?.forEach((d: any) => {
                    debtAmount += Number(d.amount || 0);

                    if (!currency && d.currency) {
                        currency = d.currency;
                    }
                });
        });

        return {
            totalsAmount,
            payAmount,
            debtAmount,
            currency,
        };
    }, [data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: count ? Math.ceil(count / (params?.pageSize ?? 20)) : -1,
        state: {
            pagination: {
                pageIndex: (params?.pageIndex ?? 1) - 1,
                pageSize: params?.pageSize ?? 20,
            },
        },
        onPaginationChange: (updater) => {
            setParams((prev: any) => {
                const old = {
                    pageIndex: (prev.pageIndex ?? 1) - 1,
                    pageSize: prev.pageSize ?? 20,
                };
                const next =
                    typeof updater === "function" ? updater(old) : updater;
                return {
                    ...prev,
                    pageIndex: next.pageIndex + 1,
                    pageSize: next.pageSize,
                };
            });
        },
    });

    if (loading) {
        return (
            <div className={classNames("p-4 space-y-3 mb-3 h-full")}>
                <Loading />
            </div>
        );
    }

    return (
        <div className={`bg-white p-2 flex flex-col`}>
            <div className={classNames("flex flex-col mb-3 h-[64vh]")}>
                <div className="h-full mb-3 border-slate-300 rounded-lg overflow-auto">
                    {data && data?.length > 0 && !loading ? (
                        <Table className="rounded-lg">
                            <THead className="sticky top-0">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <Th
                                                className={classNames(
                                                    header.column.columnDef.meta
                                                        ?.color,
                                                    "border bg-white",
                                                )}
                                                key={header.id}
                                            >
                                                <div
                                                    className={classNames(
                                                        "px-4 py-2 text-left font-medium text-xs xl:text-sm text-slate-800",
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
                                        className={`hover:bg-slate-100 transition`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <Td
                                                className={classNames(
                                                    cell.column.columnDef.meta
                                                        ?.color || "#fff",
                                                    "border",
                                                )}
                                                key={cell.id}
                                            >
                                                <div
                                                    className={classNames(
                                                        cell.column.columnDef
                                                            .meta
                                                            ?.bodyCellClassName,
                                                        "text-xs xl:text-sm px-1",
                                                    )}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
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

                                    {/* Контрагент (agar pay bo‘lsa) */}
                                    <Td />

                                    {/* 🔹 ИТОГО */}
                                    <Td>
                                        <div className="px-4 text-end">
                                            <p className="flex justify-end text-nowrap whitespace-nowrap gap-1">
                                                <FormattedNumber
                                                    value={
                                                        totals?.totalsAmount ??
                                                        0
                                                    }
                                                />
                                                <CurrencyName
                                                    currency={totals?.currency}
                                                />
                                            </p>
                                        </div>
                                    </Td>

                                    <>
                                        {/* 🔹 ОПЛАТА */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <p className="flex justify-end text-nowrap h-full whitespace-nowrap gap-1">
                                                    <FormattedNumber
                                                        value={
                                                            totals?.payAmount ??
                                                            0
                                                        }
                                                    />
                                                    <CurrencyName
                                                        currency={
                                                            totals?.currency
                                                        }
                                                    />
                                                </p>
                                            </div>
                                        </Td>

                                        {/* 🔹 ДОЛГ */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <p className="flex justify-end text-nowrap whitespace-nowrap gap-1">
                                                    <FormattedNumber
                                                        value={
                                                            totals?.debtAmount ??
                                                            0
                                                        }
                                                    />
                                                    <CurrencyName
                                                        currency={
                                                            totals?.currency
                                                        }
                                                    />
                                                </p>
                                            </div>
                                        </Td>

                                        {/* Касса */}
                                        {/* <Td /> */}
                                    </>

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
                total={count}
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

            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title="Вы уверены, что хотите продолжить?"
                isOpen={false}
                // isOpen={isOpenDelete}
                // confirmButtonProps={{
                //     loading: deletePending,
                //     onClick: onDeleteFunc,
                // }}
                cancelText="Отмена"
                confirmText="Удалить"
                // onClose={onCloseDeleteProductDialog}
                // onRequestClose={onCloseDeleteProductDialog}
                // onCancel={onCloseDeleteProductDialog}
            >
                <p className="text-gray-600">
                    Удаление записи. Это действие нельзя отменить.
                </p>
            </ConfirmDialog>

            {/* <Dialog
                closable={false}
                onClose={onClose}
                isOpen={paymeModal?.isOpen}
                onRequestClose={onClose}
                width={"280px"}
            >
                <div className="flex flex-col gap-y-2">
                    {paymeModal?.amount?.map((item: any) => {
                        return (
                            <div className="flex justify-between text-xl">
                                {GetPaymentLabel(item?.type)}
                                <span className="font-medium text-slate-800">
                                    <FormattedNumber
                                        value={item?.amount}
                                        scale={2}
                                    />
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Dialog> */}
        </div>
    );
};

export default ReturnPurchaseTable;
