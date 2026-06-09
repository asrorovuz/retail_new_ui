import { messages } from "@/app/constants/message.request";
import { useRevisionStore } from "@/app/store/useRevision";
import {
    useDeleteWriteoff,
    useWriteoff,
    useWriteoffCount,
} from "@/entities/revision/repository";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import {
    Button,
    DatePicker,
    Pagination,
    Table,
} from "@/shared/ui/kit";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
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
import { FaEye, FaPlus } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WriteOffPage = () => {
    const { t } = useTranslation();
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 20,
    });
    const [params, setParams] = useState({});
    const [itemId, setItemId] = useState(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const navigate = useNavigate();

    const { mutate: deleteMutate, isPending: deletePending } =
        useDeleteWriteoff();

    const { clearDraftRevision } = useRevisionStore((s) => s);

    const { control, watch } = useForm({
        defaultValues: {
            date_start: null,
            date_end: null,
        },
    });

    const { data, isPending } = useWriteoff(
        pagination.pageSize,
        pagination.pageIndex,
        params,
    );
    const { data: count } = useWriteoffCount(
        pagination.pageSize,
        pagination.pageIndex,
        params,
    );

    const dateStart = watch("date_start");
    const dateEnd = watch("date_end");

    const onDeleteWriteoff = () => {
        deleteMutate(itemId, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                onCloseDeleteProductDialog();
            },
            onError(err) {
                showErrorMessage(err);
                onCloseDeleteProductDialog();
            },
        });
    };

    const onCloseDeleteProductDialog = () => {
        setItemId(null);
        setIsOpenDeleteModal(false);
    };
    // const onEdit = (data: any) => {
    //   const newItem = data?.items?.map((elem: any) => {
    //     const item = elem?.warehouse_operation_from;

    //     return {
    //       productId: item?.product?.id,
    //       quantity: elem?.quantity,
    //       warehouseId: item?.id,
    //       productName: item?.product?.name,
    //       priceAmount: item?.product?.prices?.[0]?.amount ?? 0,
    //       priceAmoutBulk: item?.product?.prices?.[1]?.amount ?? 0,
    //       productPackageName: showMeasurmentName(item?.product?.package_code),
    //     };
    //   }) ?? [];

    //   const updateItem = {
    //     id: data?.id,
    //     number: data?.number,
    //     items: newItem,
    //   }

    //   updateDraftRevision(updateItem);
    //   navigate("/revisiya/operation");
    // };

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "number",
                header: "№",
                meta: {
                    headerClassName: "w-[80px]",
                    bodyCellClassName: "w-[80px] font-semibold",
                },
            },
            {
                id: "account",
                accessorKey: "account.name",
                header: () => t("common.employee"),
                cell: ({ row }) => row.original.account?.name ?? "—",
            },

            {
                accessorKey: "date",
                header: () => t("common.date"),
                meta: {
                    headerClassName: "w-[150px]",
                    bodyCellClassName: "w-[150px]",
                },
                cell: ({ row }) =>
                    dayjs(row.original.date).format("DD-MM-YYYY HH:mm"),
            },
            {
                id: "actions",
                meta: {
                    headerClassName: "w-[80px]",
                    bodyCellClassName: "w-[80px] text-center",
                },
                cell: ({ row }) => (
                    <div className="flex gap-x-5 text-lg">
                        <div
                            onClick={() =>
                                navigate(`/revisiya/${row.original.id}`)
                            }
                            className="flex items-center gap-2 text-blue-500 py-3 cursor-pointer"
                        >
                            <FaEye />
                        </div>
                        <div
                            onClick={() => {
                                setItemId(row.original.id);
                                setIsOpenDeleteModal(true);
                            }}
                            className="flex items-center gap-2 text-red-500 py-3 cursor-pointer"
                        >
                            <IoTrashOutline />
                        </div>
                    </div>
                ),
            },
        ],
        [pagination, t],
    );

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
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-white h-screen p-3 flex flex-col">
            <div className="flex justify-between mb-4 items-center">
                <NavigateButton content={t("nav.writeOff")} />
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
                                        placeholder={t("report.startDate")}
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
                                        placeholder={t("report.endDate")}
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
                        icon={<FaPlus />}
                        variant="solid"
                        size="sm"
                        onClick={() => {
                            clearDraftRevision();
                            navigate("/writeoff/operation");
                        }}
                    >
                        {t("common.add")}
                    </Button>
                </div>
            </div>
            <div className="h-full mb-3 border-slate-300 rounded-lg overflow-auto">
                {data && data?.length > 0 && !isPending ? (
                    <Table className="rounded-lg">
                        <THead className="sticky top-0">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th
                                            className={classNames(
                                                "border border-slate-200 bg-slate-200 py-2",
                                                header.column.columnDef.meta
                                                    ?.headerClassName,
                                            )}
                                            key={header.id}
                                        >
                                            <div
                                                className={classNames(
                                                    "px-4 text-left font-medium text-xs xl:text-sm text-slate-800",
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
                                        <Td className="border" key={cell.id}>
                                            <div
                                                className={classNames(
                                                    "text-xs xl:text-sm px-1",
                                                    cell.column.columnDef.meta
                                                        ?.bodyCellClassName,
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
                    <div className="border border-slate-300 flex justify-center items-center h-full">
                        <Empty size={150} textSize="32px" />
                    </div>
                )}
            </div>

            <Pagination
                total={count ?? 0}
                pageSize={pagination.pageSize}
                pageSizeOptions={[20, 50, 100, 1000]}
                currentPage={pagination.pageIndex}
                onChange={(page, size) =>
                    setPagination({
                        pageIndex: page,
                        pageSize: size || pagination.pageSize,
                    })
                }
            />

            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title={t("alert.confirmDelete")}
                isOpen={isOpenDeleteModal}
                confirmButtonProps={{
                    loading: deletePending,
                    onClick: onDeleteWriteoff,
                }}
                cancelText={t("common.cancel")}
                confirmText={t("common.delete")}
                onClose={onCloseDeleteProductDialog}
                onRequestClose={onCloseDeleteProductDialog}
                onCancel={onCloseDeleteProductDialog}
            >
                <p className="text-gray-600">
                    {t("alert.cannotUndo")}
                </p>
            </ConfirmDialog>
        </div>
    );
};

export default WriteOffPage;
