import { messages } from "@/app/constants/message.request";
import { GetPaymentLabel, PaymentTypes } from "@/app/constants/payment.types";
import { useDraftPurchaseStore } from "@/app/store/usePurchaseDraftStore";
import { useDraftRefundStore } from "@/app/store/useRefundDraftStore";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useDeleteTransactions } from "@/entities/history/repository";
import classNames from "@/shared/lib/classNames";
import { usePermission } from "@/shared/lib/controlActionWithPermission";
import CurrencyName from "@/shared/lib/CurrencyName";
import { onChangePagination } from "@/shared/lib/onPaginationChange";
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
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";
import { TbEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const TableHistory = ({
    data,
    count,
    setParams,
    isOpenFilter,
    setViewModal,
    params,
    loading,
    pay,
    payKey,
    type,
}: {
    data: any[];
    count: number;
    setParams: any;
    setViewModal: any;
    isOpenFilter: boolean;
    params: any;
    loading: boolean;
    pay: boolean;
    payKey: string;
    type: "sale" | "refund" | "purchase";
}) => {
    const [id, setId] = useState(null);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const navigate = useNavigate();
    const { mutate: deleteMutation, isPending: deletePending } =
        useDeleteTransactions(type);
    const onPaginationChange = (updater: any) => {
        onChangePagination(updater, params, setParams);
    };

    const { addDraftSale, draftSales, activateDraftSale } = useDraftSaleStore();
    const { addDraftRefund, draftRefunds, activateDraftRefund } =
        useDraftRefundStore();
    const { addDraftPurchase, draftPurchases, activateDraftPurchase } =
        useDraftPurchaseStore();

    const onCloseDeleteProductDialog = () => {
        setIsOpenDelete(false);
        setId(null);
    };
    const { checkPermissionByAction } = usePermission();

    const canUpdate = checkPermissionByAction(type, "update");
    const canDelete = checkPermissionByAction(type, "delete");
    const canView = checkPermissionByAction(type, "view");

    const onDeleteFunc = () => {
        if (!id) return;
        deleteMutation(id, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                onCloseDeleteProductDialog();
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    const onSubmit = (data: any) => {
        const items = data?.items?.map((item: any) => {
            return {
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
                catalogCode:
                    item?.warehouse_operation_from?.product?.catalog_code,
                catalogName:
                    item?.warehouse_operation_from?.product?.catalog_name,
            };
        });

        const cashBoxStates =
            type === "sale"
                ? data?.payment?.cash_box_states || []
                : data?.payout?.cash_box_states || [];

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
            items: items,
            isActive: true,
            discountAmount: data?.exact_discounts?.[0]?.amount,
            [payKey]: {
                amounts: paymentAmounts,
            },
        };

        if (type === "sale") {
            if (!draftSales?.some((item) => item.id === data?.id)) {
                addDraftSale(payload);
            } else {
                const index = draftSales?.findIndex(
                    (item) => item?.id === data?.id,
                );
                activateDraftSale(index ?? 0);
            }
            navigate("/sales");
        }

        if (type === "refund") {
            if (!draftRefunds?.some((item) => item.id === data?.id)) {
                addDraftRefund(payload);
            } else {
                const index = draftRefunds?.findIndex(
                    (item) => item?.id === data?.id,
                );
                activateDraftRefund(index ?? 0);
            }
            navigate("/refund");
        }

        if (type === "purchase") {
            if (!draftPurchases?.some((item) => item.id === data?.id)) {
                addDraftPurchase(payload);
            } else {
                const index = draftPurchases?.findIndex(
                    (item) => item?.id === data?.id,
                );
                activateDraftPurchase(index ?? 0);
            }
            navigate("/purchase");
        }
    };

    const columns = useMemo<ColumnDef<any>[]>(() => {
        return [
            {
                id: "№",
                enableSorting: false,
                enableHiding: false,
                meta: {
                    cellClassName: "text-center !w-10",
                },
                header: () => {
                    return `№`;
                },
                cell: ({ row }) => {
                    return (
                        <span className="cursor-pointer font-bold !w-10">
                            {(params.skip || 0) + (row.index + 1)}
                        </span>
                    );
                },
            },
            {
                id: "number",
                enableSorting: false,
                enableHiding: false,
                meta: {
                    cellClassName: "text-center",
                },
                header: () => {
                    return "Номер";
                },
                cell: ({ row }) => {
                    const number = row?.original.number;
                    return (
                        <span
                            className="cursor-pointer font-bold hover:text-primary"
                            onClick={() => onSubmit(row.original)}
                        >
                            {number}
                        </span>
                    );
                },
            },
            ...(pay
                ? [
                      {
                          id: "contractor",
                          accessorKey: "contractor.name",
                          enableSorting: false,
                          enableHiding: false,
                          meta: {
                              cellClassName: "font-bold truncate text-center",
                          },
                          header: () => {
                              return "Контрагент";
                          },
                      },
                  ]
                : []),
            {
                id: "totals",
                accessorKey: "totals",
                enableSorting: false,
                enableHiding: false,
                meta: {
                    cellClassName: "text-end",
                },
                header: () => {
                    return "Итого";
                },
                cell: ({ row }) => {
                    const totals = row?.original?.totals;

                    return (
                        <div>
                            {totals ? (
                                totals?.map((item: any, index: number) => (
                                    <p
                                        key={index}
                                        className={
                                            "heading-text font-bold text-nowrap flex gap-x-1"
                                        }
                                    >
                                        <FormattedNumber value={item?.amount} />
                                        <CurrencyName
                                            currency={item?.currency}
                                        />
                                    </p>
                                ))
                            ) : (
                                <p className={"heading-text font-bold"}>0</p>
                            )}
                        </div>
                    );
                },
            },
            ...(pay
                ? [
                      {
                          id: "cashbox_state",
                          accessorKey: "cashbox_state",
                          enableSorting: false,
                          enableHiding: false,
                          meta: {
                              cellClassName: "text-end min-w-[175px]",
                          },
                          header: () => {
                              return "Оплата";
                          },
                          cell: ({ row }: { row: any }) => {
                              const { [payKey as string]: pay } =
                                  row?.original as any;

                              const { cash_box_states } = pay || {};

                              return (
                                  <div>
                                      {cash_box_states ? (
                                          payment
                                              ?.calculateToPay(cash_box_states)
                                              ?.map(
                                                  (
                                                      item: any,
                                                      index: number,
                                                  ) => (
                                                      <div className="flex gap-1 items-center">
                                                          <p
                                                              key={index}
                                                              className={
                                                                  "heading-text font-bold text-nowrap flex gap-x-1"
                                                              }
                                                          >
                                                              <FormattedNumber
                                                                  value={
                                                                      item?.amount
                                                                  }
                                                              />
                                                              <CurrencyName
                                                                  currency={
                                                                      item.currency
                                                                  }
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
                                                                                  key={
                                                                                      i
                                                                                  }
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
                                                                  <TbEye
                                                                      size={22}
                                                                  />
                                                              </span>
                                                          </Tooltip>
                                                      </div>
                                                  ),
                                              )
                                      ) : (
                                          <p
                                              className={
                                                  "heading-text font-bold"
                                              }
                                          >
                                              0
                                          </p>
                                      )}
                                  </div>
                              );
                          },
                      },
                      {
                          id: "debt",
                          accessorKey: "debt",
                          enableSorting: false,
                          enableHiding: false,
                          meta: {
                              cellClassName: "text-end min-w-[175px]",
                          },
                          header: () => {
                              return "Долг";
                          },
                          cell: ({ row }: { row: any }) => {
                              const debts = row?.original?.debts;
                              return (
                                  <div>
                                      {debts ? (
                                          payment
                                              .calculateToPay(debts)
                                              ?.map(
                                                  (
                                                      item: any,
                                                      index: number,
                                                  ) => (
                                                      <p
                                                          key={index}
                                                          className={
                                                              "heading-text font-bold text-nowrap flex gap-x-1"
                                                          }
                                                      >
                                                          <FormattedNumber
                                                              value={
                                                                  item?.amount
                                                              }
                                                          />
                                                          <CurrencyName
                                                              currency={
                                                                  item.currency
                                                              }
                                                          />
                                                      </p>
                                                  ),
                                              )
                                      ) : (
                                          <p
                                              className={
                                                  "heading-text font-bold"
                                              }
                                          >
                                              0
                                          </p>
                                      )}
                                  </div>
                              );
                          },
                      },
                      {
                          id: "cashbox",
                          accessorKey: "cash_box.name",
                          enableSorting: false,
                          enableHiding: false,
                          meta: {
                              cellClassName: "font-bold truncate text-center",
                          },
                          header: () => {
                              return "Касса";
                          },
                      },
                  ]
                : []),
            {
                id: "employee",
                accessorKey: "employees.name",
                enableSorting: false,
                enableHiding: false,
                meta: {
                    cellClassName: "font-bold truncate text-center",
                },
                header: () => {
                    return "Сотрудник";
                },
            },
            {
                id: "note",
                accessorKey: "note",
                enableSorting: false,
                enableHiding: false,
                meta: {
                    cellClassName: "font-bold truncate text-center",
                },
                header: () => {
                    return "Примечание";
                },
                cell: ({ row }) => {
                    return <div>{row?.original?.comment}</div>;
                },
            },
            {
                id: "date",
                accessorKey: "date",
                enableSorting: false,
                enableHiding: false,
                meta: {
                    cellClassName: "font-bold truncate text-center",
                },
                header: () => {
                    return "Дата";
                },
                cell: ({ row }) => {
                    const date = row?.original?.date;
                    return <div>{new Date(date).toLocaleString()}</div>;
                },
            },
            {
                id: "action",
                enableSorting: false,
                enableHiding: false,
                meta: {
                    cellClassName:
                        "text-center sticky right-0 z-999 !bg-white dark:!bg-slate-800 hover:!bg-white dark:hover:!bg-slate-800 shadow-[inset_0_1px_0_#e5e7eb] dark:shadow-[inset_0_1px_0_#374151]",
                    headerClassName:
                        "text-center sticky right-0 z-999 !bg-white dark:!bg-slate-800 hover:!bg-white dark:hover:!bg-slate-800 shadow-[inset_0_0_0_#e5e7eb] dark:shadow-[inset_0_0_0_#374151]",
                },
                header: () => {
                    return "Действие";
                },
                cell: ({ row }) => {
                    return (
                        <Dropdown
                            renderTitle={
                                <div className="flex justify-center text-2xl text-slate-600">
                                    <HiOutlineDotsHorizontal />
                                </div>
                            }
                        >
                            {canView && (
                                <DropdownItem
                                    onClick={() =>
                                        setViewModal({
                                            isOpen: true,
                                            id: row?.id,
                                        })
                                    }
                                    className="h-auto!"
                                >
                                    <div className="w-full flex items-center gap-2 text-slate-700 py-3 px-5 rounded-xl">
                                        <TbEye size={22} />
                                        Посмотреть
                                    </div>
                                </DropdownItem>
                            )}
                            {canUpdate && (
                                <DropdownItem
                                    onClick={() => onSubmit(row.original)}
                                    className="h-auto!"
                                >
                                    <div className="w-full flex items-center gap-2 text-orange-500 py-3 px-5 rounded-xl">
                                        <FaRegEdit size={20} />
                                        Редактировать
                                    </div>
                                </DropdownItem>
                            )}
                            {canDelete && (
                                <DropdownItem
                                    onClick={() => {
                                        setId(row.original.id);
                                        setIsOpenDelete(true);
                                    }}
                                    className="h-auto!"
                                >
                                    <div className="w-full flex items-center gap-2 text-red-500 py-3 px-5 rounded-xl">
                                        <IoTrashOutline size={20} />
                                        Удалить
                                    </div>
                                </DropdownItem>
                            )}
                        </Dropdown>
                    );
                },
            },
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, params]);

    const summary = useMemo(() => {
        let totalsAmount = 0;
        let payAmount = 0;
        let debtAmount = 0;

        let currency: any = null;

        data?.forEach((row) => {
            // 🔹 Итого
            row?.totals?.forEach((t: any) => {
                totalsAmount += Number(t.amount || 0);

                // 🔹 currency ni faqat bir marta olish
                if (!currency && t.currency) {
                    currency = t.currency;
                }
            });

            // 🔹 Оплата
            const payData = row?.[payKey]?.cash_box_states;
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
    }, [data, payKey]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row: any) => row.id,
        onPaginationChange: onPaginationChange,
        autoResetPageIndex: false,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        enableSorting: true,
        enableSortingRemoval: true,
        rowCount: count,
        state: {
            pagination: {
                pageIndex: params.skip / (params.limit || 1),
                pageSize: params.limit,
            },
        },
    });

    let customHeiht = isOpenFilter
        ? "h-[calc(100%-300px)]"
        : "h-[calc(100%-60px)]";

    return (
        <div className={`${customHeiht} flex flex-col`}>
            <div
                className={`flex-1 mb-3 border border-slate-200 rounded-3xl overflow-y-auto`}
            >
                {data && data?.length > 0 && !loading ? (
                    <Table className="w-full table-fixed">
                        <THead className="bg-white sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, ind) => (
                                        <Th key={header.id}>
                                            <div
                                                className={classNames(
                                                    !ind && "w-10",
                                                    "text-left font-medium text-xs xl:text-sm text-slate-800",
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
                            {table.getRowModel().rows.map((row, index) => (
                                <Tr
                                    key={row.id}
                                    className={`${
                                        index % 2 ? "bg-white" : "bg-slate-100"
                                    } hover:bg-slate-100 transition`}
                                >
                                    {row.getVisibleCells().map((cell, ind) => (
                                        <Td
                                            className={classNames(
                                                cell.column.columnDef.meta
                                                    ?.color || "#fff",
                                            )}
                                            key={cell.id}
                                        >
                                            <div
                                                className={classNames(
                                                    !ind && "w-10",
                                                    "py-1 px-3 text-xs xl:text-sm",
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
                        <TFoot className="sticky bottom-0 bg-white border-t">
                            <Tr className="font-bold bg-slate-50">
                                {/* № */}
                                <Td>
                                    <div className="px-4">Итого</div>
                                </Td>

                                {/* Номер */}
                                <Td />

                                {/* Контрагент (agar pay bo‘lsa) */}
                                {pay && <Td />}

                                {/* 🔹 ИТОГО */}
                                <Td>
                                    <div className="px-4 text-end">
                                        <p className="flex justify-end text-nowrap gap-1">
                                            <FormattedNumber
                                                value={summary?.totalsAmount}
                                            />
                                            <CurrencyName
                                                currency={summary?.currency}
                                            />
                                        </p>
                                    </div>
                                </Td>

                                {pay && (
                                    <>
                                        {/* 🔹 ОПЛАТА */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <p className="flex justify-end text-nowrap gap-1">
                                                    <FormattedNumber
                                                        value={
                                                            summary?.payAmount
                                                        }
                                                    />
                                                    <CurrencyName
                                                        currency={
                                                            summary?.currency
                                                        }
                                                    />
                                                </p>
                                            </div>
                                        </Td>

                                        {/* 🔹 ДОЛГ */}
                                        <Td>
                                            <div className="px-4 text-end">
                                                <p className="flex justify-end text-nowrap gap-1">
                                                    <FormattedNumber
                                                        value={
                                                            summary?.debtAmount
                                                        }
                                                    />
                                                    <CurrencyName
                                                        currency={
                                                            summary?.currency
                                                        }
                                                    />
                                                </p>
                                            </div>
                                        </Td>

                                        {/* Касса */}
                                        <Td />
                                    </>
                                )}

                                {/* Employee */}
                                <Td />

                                {/* Status */}
                                <Td />

                                {/* Note */}
                                <Td />

                                {/* Date */}
                                <Td />

                                {/* Action */}
                                <Td />
                            </Tr>
                        </TFoot>
                    </Table>
                ) : (
                    <Empty size={150} textSize="32px" />
                )}
            </div>

            <Pagination
                displayTotal={false}
                total={count}
                pageSize={params.limit}
                pageSizeOptions={[10, 20, 50, 100, 1000]}
                currentPage={
                    Math.floor((params.skip ?? 0) / (params.limit ?? 1)) + 1
                }
                onChange={(page, size) =>
                    setParams((prev: any) => ({
                        ...prev,
                        limit: size,
                        skip: (page - 1) * (size ?? 10),
                    }))
                }
            />

            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title="Вы уверены, что хотите продолжить?"
                isOpen={isOpenDelete}
                confirmButtonProps={{
                    loading: deletePending,
                    onClick: onDeleteFunc,
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={onCloseDeleteProductDialog}
                onRequestClose={onCloseDeleteProductDialog}
                onCancel={onCloseDeleteProductDialog}
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

export default TableHistory;
