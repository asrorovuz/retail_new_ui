import { messages } from "@/app/constants/message.request";
import { useRevisionStore } from "@/app/store/useRevision";
import {
    useDeleteRevision,
    useRevision,
    useRevisionCount,
} from "@/entities/revision/repository";
import classNames from "@/shared/lib/classNames";
import { usePermission } from "@/shared/lib/controlActionWithPermission";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, DatePicker, Pagination, Table } from "@/shared/ui/kit";
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
import { FaPlus } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const RevisiyaPage = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 20,
    });
    const [params, setParams] = useState({});
    const [itemId, setItemId] = useState(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const navigate = useNavigate();
    const { checkPermissionByAction } = usePermission();
    const canCreate = checkPermissionByAction("revision", "create");
    const canDelete = checkPermissionByAction("revision", "delete");

    const { mutate: deleteMutate, isPending: deletePending } =
        useDeleteRevision();

    const { clearDraftRevision } = useRevisionStore((s) => s);

    const { control, watch } = useForm({
        defaultValues: {
            date_start: null,
            date_end: null,
        },
    });

    const { data, isPending } = useRevision(
        pagination.pageSize,
        pagination.pageIndex,
        params,
    );
    const { data: count } = useRevisionCount(
        pagination.pageSize,
        pagination.pageIndex,
        params,
    );

    const dateStart = watch("date_start");
    const dateEnd = watch("date_end");

    const onDeleteRevision = () => {
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

    const columns = useMemo<ColumnDef<any>[]>(() => {
        const baseColumns: ColumnDef<any>[] = [
            {
                id: "№",
                enableSorting: false,
                header: () => "№",
                cell: (info) =>
                    (pagination?.pageIndex - 1) * pagination?.pageSize +
                    (info?.row?.index + 1),
                meta: { bodyCellClassName: "text-center min-w-[50px]" },
            },
            {
                accessorKey: "id",
                header: "ID",
                meta: { bodyCellClassName: "text-center min-w-[60px]" },
            },
            {
                accessorKey: "seller",
                header: "Продавец",
            },
            {
                accessorKey: "employee",
                header: "Сотрудник",
            },
            {
                accessorKey: "info",
                header: "Данные",
            },
            {
                accessorKey: "date",
                header: "Дата",
                cell: ({ row }) =>
                    dayjs(row.original.date).format("DD-MM-YYYY HH:mm"),
            },
        ];

        if (canDelete) {
            baseColumns.push({
                id: "actions",
                cell: ({ row }) => (
                    <div
                        onClick={() => {
                            setItemId(row.original.id);
                            setIsOpenDeleteModal(true);
                        }}
                        className="w-full flex items-center gap-2 text-red-500 py-3 px-5 rounded-xl cursor-pointer"
                    >
                        <IoTrashOutline />
                    </div>
                ),
            });
        }

        return baseColumns;
    }, [pagination, canDelete]);

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
        <div className="bg-white h-full rounded-2xl p-3">
            <div className="flex justify-between mb-4 items-center">
                <NavigateButton content="Ревизия" />
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

                    {canCreate && (
                        <Button
                            icon={<FaPlus />}
                            variant="solid"
                            size="sm"
                            onClick={() => {
                                clearDraftRevision();
                                navigate("/revisiya/operation");
                            }}
                        >
                            Добавить
                        </Button>
                    )}
                </div>
            </div>
            {data && data?.length > 0 && !isPending ? (
                <div className="h-[80vh] mb-3 border border-slate-300 rounded-xl overflow-auto">
                    <Table className="min-w-full table-fixed border-separate border-spacing-0">
                        <THead className="sticky top-0">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th key={header.id}>
                                            <div
                                                className={classNames(
                                                    "px-4 text-left font-medium text-xs xl:text-sm text-slate-800",
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
                                    {row.getVisibleCells().map((cell) => (
                                        <Td key={cell.id}>
                                            <div
                                                className={classNames(
                                                    "py-3 text-xs xl:text-sm px-4",
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
                </div>
            ) : (
                <Empty size={150} textSize="32px" />
            )}

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
                title="Вы уверены, что хотите удалить этот ревизия?"
                isOpen={isOpenDeleteModal}
                confirmButtonProps={{
                    loading: deletePending,
                    onClick: onDeleteRevision,
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={onCloseDeleteProductDialog}
                onRequestClose={onCloseDeleteProductDialog}
                onCancel={onCloseDeleteProductDialog}
            >
                <p className="text-gray-600">
                    После удаления, восстановить ревизия будет невозможно.
                </p>
            </ConfirmDialog>
        </div>
    );
};

export default RevisiyaPage;
