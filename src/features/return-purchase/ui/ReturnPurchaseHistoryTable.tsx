import { messages } from "@/app/constants/message.request";
import { GetPaymentLabel, PaymentTypes } from "@/app/constants/payment.types";
import { useReturnPurchaseDraftStore } from "@/app/store/useReturnPurchaseDraftStore";
import { useDeleteTransactions } from "@/entities/history/repository";
import classNames from "@/shared/lib/classNames";
// import { usePermission } from "@/shared/lib/controlActionWithPermission";
import CurrencyName from "@/shared/lib/CurrencyName";
import payment from "@/shared/lib/payment";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
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
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { TbEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ReturnPurchaseHistoryTable = ({
    data,
    count,
    setParams,
    setViewModal,
    params,
    loading,
}: {
    data: any[];
    count: number;
    setParams: any;
    setViewModal: any;
    params: any;
    loading: boolean;
}) => {
    const { t } = useTranslation();
    const [id, setId] = useState(null);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const navigate = useNavigate();
    const { mutate: deleteMutation, isPending: deletePending } =
        useDeleteTransactions("return_purchase");

    const columnHelper = createColumnHelper<any>();

    const {
        addDraftReturnPurchase,
        draftReturnPurchases,
        activateDraftReturnPurchase,
        setReturnPurchaseContractorId,
    } = useReturnPurchaseDraftStore();

    const onCloseDeleteDialog = () => {
        setIsOpenDelete(false);
        setId(null);
    };

    // const { checkPermissionByAction } = usePermission();
    // const canUpdate = checkPermissionByAction("purchase", "update");
    // const canDelete = checkPermissionByAction("purchase", "delete");
    // const canView = checkPermissionByAction("purchase", "view");

    const onDeleteFunc = () => {
        if (!id) return;
        deleteMutation(id, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                onCloseDeleteDialog();
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    const onEdit = (data: any) => {
        const items = data?.items?.map((item: any) => ({
            id: item?.id,
            productId: item?.warehouse_operation_from?.product?.id,
            productName: item?.warehouse_operation_from?.product?.name,
            productPackageName:
                item?.warehouse_operation_from?.product?.package_name,
            priceAmount: item?.price_amount,
            priceTypeId: item?.price_type_id,
            quantity: item?.quantity,
            totalAmount: item?.quantity * item?.price_amount,
            marks: item?.marks,
            catalogCode: item?.warehouse_operation_from?.product?.catalog_code,
            catalogName: item?.warehouse_operation_from?.product?.catalog_name,
        }));

        const cashBoxStates = data?.payout?.cash_box_states || [];
        const paymentAmounts = PaymentTypes?.map((paymentType) => {
            const founded = cashBoxStates?.find(
                (state: any) => state?.type === paymentType?.type,
            );
            return {
                paymentType: paymentType.type,
                amount: founded ? founded.amount : 0,
            };
        });

        const payload = {
            id: data?.id,
            items,
            isActive: true,
            discountAmount: data?.exact_discounts?.[0]?.amount,
            contractor_id: data?.contractor_id ?? null,
            payment: { amounts: paymentAmounts },
        };

        if (!draftReturnPurchases?.some((item) => item.id === data?.id)) {
            addDraftReturnPurchase(payload);
        } else {
            const index = draftReturnPurchases?.findIndex(
                (item) => item?.id === data?.id,
            );
            activateDraftReturnPurchase(index ?? 0);
        }
        setReturnPurchaseContractorId(data?.contractor_id ?? null);
        navigate("/return-purchase");
    };

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "index",
                header: () => <div className="!w-10">№</div>,
                cell: (info) => (
                    <div className="!w-10">
                        {(params?.pageIndex - 1) * params?.pageSize +
                            (info.row.index + 1)}
                    </div>
                ),
            }),

            columnHelper.display({
                id: "number",
                header: "ID",
                cell: ({ row }) => (
                    <div
                        className="cursor-pointer font-bold hover:text-primary text-center"
                        onClick={() => onEdit(row.original)}
                    >
                        {row.original.number}
                    </div>
                ),
            }),

            columnHelper.accessor("contractor.name", {
                id: "contractor",
                enableSorting: false,
                enableHiding: false,
                meta: { bodyCellClassName: "font-bold truncate text-center" },
                header: () => t("counterparty.title"),
            }),

            columnHelper.accessor("totals", {
                id: "totals",
                enableSorting: false,
                enableHiding: false,
                meta: { bodyCellClassName: "text-end" },
                header: () => t("common.total"),
                cell: ({ row }) => {
                    const totals = row.original?.totals;
                    return (
                        <div className="whitespace-nowrap flex justify-end">
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
            }),

            columnHelper.accessor("payment", {
                id: "payment",
                enableSorting: false,
                enableHiding: false,
                meta: { bodyCellClassName: "text-end min-w-[175px]" },
                header: () => t("sale.payment"),
                cell: ({ row }) => {
                    const { cash_box_states } = row.original?.payment || {};
                    return (
                        <div className="whitespace-nowrap text-nowrap flex justify-end">
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
            }),

            columnHelper.accessor("debt", {
                id: "debt",
                enableSorting: false,
                enableHiding: false,
                meta: { bodyCellClassName: "text-end min-w-[175px]" },
                header: () => t("sale.debt"),
                cell: ({ row }) => {
                    const totalsSum = (row.original?.totals ?? []).reduce(
                        (acc: number, t: any) => acc + Number(t?.amount || 0),
                        0,
                    );
                    const cashBoxStates =
                        row.original?.payment?.cash_box_states ?? [];
                    const paidSum =
                        payment
                            .calculateToPay(cashBoxStates)
                            ?.reduce(
                                (acc: number, p: any) =>
                                    acc + Number(p?.amount || 0),
                                0,
                            ) ?? 0;
                    const debtAmount = totalsSum - paidSum;

                    return (
                        <div className="flex justify-end">
                            {debtAmount > 0 ? (
                                <p className="heading-text font-bold text-nowrap whitespace-nowrap flex gap-x-1">
                                    <FormattedNumber value={debtAmount} />
                                    <CurrencyName
                                        currency={
                                            row.original?.totals?.[0]?.currency
                                        }
                                    />
                                </p>
                            ) : (
                                <p className="heading-text font-bold">0</p>
                            )}
                        </div>
                    );
                },
                maxSize: 150,
                minSize: 150,
            }),

            columnHelper.accessor("account.name", {
                id: "account",
                enableSorting: false,
                enableHiding: false,
                meta: { bodyCellClassName: "font-bold truncate text-center" },
                header: () => t("common.employee"),
            }),

            columnHelper.accessor("date", {
                id: "date",
                enableSorting: false,
                enableHiding: false,
                meta: { bodyCellClassName: "font-bold truncate text-center" },
                header: () => t("common.date"),
                cell: ({ row }) => (
                    <div>{new Date(row.original?.date).toLocaleString()}</div>
                ),
            }),

            columnHelper.display({
                id: "action",
                meta: { bodyCellClassName: "text-center sticky right-0 z-999" },
                header: () => "",
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
                                {t("common.view")}
                            </div>
                        </DropdownItem>

                        <DropdownItem
                            onClick={() => onEdit(row.original)}
                            className="h-auto!"
                        >
                            <div className="w-full flex items-center gap-2 text-orange-500 py-3 px-5 rounded-lg">
                                <FaRegEdit size={20} />
                                {t("common.edit")}
                            </div>
                        </DropdownItem>

                        <DropdownItem
                            onClick={() => {
                                setId(row.original.id);
                                setIsOpenDelete(true);
                            }}
                            className="h-auto!"
                        >
                            <div className="w-full flex items-center gap-2 text-red-500 py-3 px-5 rounded-lg">
                                <IoTrashOutline size={20} />
                                {t("common.delete")}
                            </div>
                        </DropdownItem>
                    </Dropdown>
                ),
            }),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, params, t],
    );

    const summary = useMemo(() => {
        let totalsAmount = 0;
        let payAmount = 0;
        let currency: any = null;

        data?.forEach((row) => {
            row?.totals?.forEach((t: any) => {
                totalsAmount += Number(t.amount || 0);
                if (!currency && t.currency) currency = t.currency;
            });

            const payData = row?.payment?.cash_box_states;
            if (payData) {
                payment.calculateToPay(payData)?.forEach((p: any) => {
                    payAmount += Number(p.amount || 0);
                });
            }
        });

        const debtAmount = totalsAmount - payAmount;
        return {
            totalsAmount,
            payAmount,
            debtAmount: debtAmount > 0 ? debtAmount : 0,
            currency,
        };
    }, [data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading)
        return (
            <div className={classNames("p-4 space-y-3 mb-3 h-full")}>
                <Loading />
            </div>
        );

    return (
        <div className="bg-white p-2 flex flex-col h-screen">
            <div className="flex flex-col mb-3 h-[calc(100vh-136px)]">
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
                                                <div className="px-4 py-2 text-left font-medium text-xs xl:text-sm text-slate-800">
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
                                        className="hover:bg-slate-100 transition"
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
                                    <Td>
                                        <div className="px-4 py-1">{t("common.total")}</div>
                                    </Td>
                                    <Td />
                                    <Td />
                                    <Td>
                                        <div className="px-4 text-end">
                                            <p className="flex justify-end text-nowrap whitespace-nowrap gap-1">
                                                <FormattedNumber
                                                    value={summary.totalsAmount}
                                                />
                                                <CurrencyName
                                                    currency={summary.currency}
                                                />
                                            </p>
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="px-4 text-end">
                                            <p className="flex justify-end text-nowrap h-full whitespace-nowrap gap-1">
                                                <FormattedNumber
                                                    value={summary.payAmount}
                                                />
                                                <CurrencyName
                                                    currency={summary.currency}
                                                />
                                            </p>
                                        </div>
                                    </Td>
                                    <Td />
                                    <Td>
                                        <div className="px-4 text-end">
                                            <p className="flex justify-end text-nowrap whitespace-nowrap gap-1">
                                                <FormattedNumber
                                                    value={summary.debtAmount}
                                                />
                                                <CurrencyName
                                                    currency={summary.currency}
                                                />
                                            </p>
                                        </div>
                                    </Td>
                                    <Td />
                                    <Td />
                                    {/* <Td /> */}
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
                title={t("alert.confirmDelete")}
                isOpen={isOpenDelete}
                confirmButtonProps={{
                    loading: deletePending,
                    onClick: onDeleteFunc,
                }}
                cancelText={t("common.cancel")}
                confirmText={t("common.delete")}
                onClose={onCloseDeleteDialog}
                onRequestClose={onCloseDeleteDialog}
                onCancel={onCloseDeleteDialog}
            >
                <p className="text-gray-600">
                    {t("alert.cannotUndo")}
                </p>
            </ConfirmDialog>
        </div>
    );
};

export default ReturnPurchaseHistoryTable;
