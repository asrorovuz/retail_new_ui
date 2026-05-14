import { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useDeleteProduct } from "@/entities/products/repository";
import { Dropdown, Pagination, Table, Tooltip } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import type { Product } from "@/@types/products";
import Loading from "@/shared/ui/loading";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import TableSettingsModal from "./TableSettingsModal";
import DropdownItem from "@/shared/ui/kit/Dropdown/DropdownItem";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import ShtrixCod from "@/shared/ui/svg/ShtrixCod";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import { EditProductModal } from "@/features/modals";
import type { ProductPriceType } from "@/features/modals/model";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import PrintCheckProduct from "@/features/print-modal";
import classNames from "@/shared/lib/classNames";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";
import { AccountPermissions } from "@/app/constants/permissions";
import { useCheckPermission } from "@/shared/lib/checkPermission";

const ProductTable = ({
    data,
    countData,
    isPending,
    searchFocus,
    pagination,
    setPagination,
    barcode,
    setBarcode,
    setIsOpen,
    isOpen,
    productPriceType,
    setSearch,
}: {
    data: any;
    countData: number;
    isPending: boolean;
    searchFocus: boolean;
    pagination: any;
    setPagination: any;
    barcode: string | null;
    setBarcode: (val: string | null) => void;
    setIsOpen: (val: boolean) => void;
    isOpen: boolean;
    productPriceType: ProductPriceType[];
    setSearch: (val: string) => void;
}) => {
    const [confirmProductId, setConfirmProductId] = useState<number | null>(
        null,
    );
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isopenPrint, setIsOpenPrint] = useState(false);
    const [item, setItem] = useState<Product | null>(null);
    const { tableSettings } = useSettingsStore((s) => s);

    const checkPermission = useCheckPermission();

    const { mutate: deleteProduct, isPending: productDeleteLoading } =
        useDeleteProduct();

    const columnHelper = createColumnHelper<Product>();

    // 🧱 Mahsulot o‘chirish
    const onDeleteProduct = () => {
        if (!confirmProductId) return;
        deleteProduct(confirmProductId, {
            onSuccess: () => {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                setDeleteModalOpen(false);
                setConfirmProductId(null);
                setSearch("");
            },
            onError: (error) => {
                showErrorMessage(error);
                setDeleteModalOpen(false);
            },
        });
    };

    const onCloseDeleteProductDialog = () => {
        setDeleteModalOpen(false);
        setConfirmProductId(null);
    };

    const onClosePrintModal = () => {
        setConfirmProductId(null);
        setIsOpenPrint(false);
    };

    // 🧱 Ustunlar
    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "index",
                header: "№",
                cell: (info) => (
                    <div className="!w-10">
                        {(pagination?.pageIndex - 1) * pagination?.pageSize +
                            (info?.row?.index + 1)}
                    </div>
                ),
            }),
            columnHelper.accessor("name", {
                header: "НАЗВАНИЕ",
                cell: ({ row }) => {
                    const item = row?.original;
                    return (
                        <div className="min-w-[250px]">
                            <p>{item?.name || "-"}</p>
                            <div className="flex gap-x-2 text-[11px] mt-0.5">
                                {item?.category && (
                                    <span className="bg-green-200 px-0.5 rounded-md text-black">
                                        <Tooltip title="Категория">
                                            {item?.category?.name}
                                        </Tooltip>
                                    </span>
                                )}
                                {(item?.barcodes?.length ?? 0) > 0 && (
                                    <span className="bg-slate-300 px-0.5 rounded-md text-black">
                                        <Tooltip title="Штрих-код">
                                            {item?.barcodes?.[0]?.value}
                                        </Tooltip>
                                    </span>
                                )}
                                {item?.sku && (
                                    <span className="bg-slate-300 px-0.5 rounded-md text-black">
                                        <Tooltip title="Артикул">
                                            {item?.sku}
                                        </Tooltip>
                                    </span>
                                )}
                                {item?.code && (
                                    <span className="bg-slate-300 px-0.5 rounded-md text-black">
                                        <Tooltip title="Код">
                                            {item?.code}
                                        </Tooltip>
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                },
                meta: {
                    color:
                        tableSettings?.find((i) => i.key === "name")?.color ||
                        "#fff",
                },
            }),
            columnHelper.display({
                id: "totalRemainder",
                header: () => <div className="text-center">ОСТАТОК</div>,
                cell: (info) => {
                    const total = info.row.original.warehouse_items?.[0]?.state;

                    return (
                        <p className="w-20 text-center">{`${
                            total !== undefined ? total.toLocaleString() : "0"
                        } ${showMeasurmentName(info.row.original.measurement_code)}`}</p>
                    );
                },
                meta: {
                    color:
                        tableSettings?.find((i) => i.key === "totalRemainder")
                            ?.color || "#fff",
                },
            }),
            ...(checkPermission(
                AccountPermissions.AccountPermissionViewProductCommonPrice,
            )
                ? [
                      columnHelper.display({
                          id: "price",
                          header: () => <div className="text-center">РОЗ.ЦЕНА</div>,
                          cell: (info) => {
                              const price =
                                  info.row.original.prices?.[0]?.amount;
                              return (
                                  <p className="w-[80px] text-right">
                                      {price
                                          ? `${price.toLocaleString()}`
                                          : "-"}
                                  </p>
                              );
                          },

                          meta: {
                              color:
                                  tableSettings?.find((i) => i.key === "price")
                                      ?.color || "#fff",
                          },
                      }),
                  ]
                : []),
            ...(checkPermission(
                AccountPermissions.AccountPermissionViewProductBulkPrice,
            )
                ? [
                      columnHelper.display({
                          id: "bulkPrice",
                          header: () => (
                              <div className="text-nowrap text-center">
                                  ОПТ.ЦЕНА
                              </div>
                          ),
                          cell: (info) => {
                              const price =
                                  info.row.original.prices?.[1]?.amount;
                              return (
                                  <p className="w-[100px] text-right">
                                      {price
                                          ? `${price.toLocaleString()}`
                                          : "-"}
                                  </p>
                              );
                          },
                          size: 140,
                          meta: {
                              color:
                                  tableSettings?.find(
                                      (i) => i.key === "bulkPrice",
                                  )?.color || "#fff",
                          },
                      }),
                  ]
                : []),
            ...(checkPermission(
                AccountPermissions.AccountPermissionViewProductPurchasePrice,
            )
                ? [
                      columnHelper.display({
                          id: "purchesPrice",
                          header: () => (
                              <div className="text-nowrap text-center">
                                  ЗАК.ЦЕНА
                              </div>
                          ),
                          cell: (info) => {
                              const price =
                                  info.row.original.warehouse_items?.[0]
                                      ?.purchase_price_amount;
                              return (
                                  <p className="w-[100px] text-right">
                                      {price
                                          ? `${price.toLocaleString()}`
                                          : "-"}
                                  </p>
                              );
                          },
                          meta: {
                              color:
                                  tableSettings?.find(
                                      (i) => i.key === "purchesPrice",
                                  )?.color || "#fff",
                          },
                      }),
                  ]
                : []),
            columnHelper.display({
                id: "catalogCode",
                header: () => (
                    <div className="text-nowrap text-center">ИКПУ-код</div>
                ),
                cell: (info) => (
                    <p className="w-[250px]">
                        {info.row.original.catalog_name || "-"}
                    </p>
                ),
                meta: {
                    color:
                        tableSettings?.find((i) => i.key === "catalogCode")
                            ?.color || "#fff",
                },
            }),
            columnHelper.display({
                id: "totalRemainderMin",
                header: () => (
                    <div className="text-nowrap text-center">МИН. ОСТ.</div>
                ),
                cell: (info) => {
                    const total =
                        info.row.original.warehouse_items?.[0]?.alert_on;

                    return (
                        <p className="w-[80px] text-center">{`${total ? total?.toLocaleString() : "0"} ${showMeasurmentName(
                            info.row.original.measurement_code,
                        )}`}</p>
                    );
                },
                meta: {
                    color:
                        tableSettings?.find(
                            (i) => i.key === "totalRemainderMin",
                        )?.color || "#fff",
                },
            }),
            // 🧩 Actions ustuni
            columnHelper.display({
                id: "actions",
                header: () => (
                    <div className="text-2xl flex justify-center w-10">
                        <TableSettingsModal />
                    </div>
                ),
                cell: (info) => (
                    <div className="w-[40px] mx-auto">
                        <Dropdown
                            renderTitle={
                                <div className="flex justify-center text-2xl text-slate-600">
                                    <HiOutlineDotsHorizontal />
                                </div>
                            }
                        >
                            {checkPermission(
                                AccountPermissions.AccountPermissionProductUpdate,
                            ) && (
                                <DropdownItem
                                    onClick={() => {
                                        setConfirmProductId(
                                            info.row.original.id,
                                        );
                                        setIsOpen(true);
                                    }}
                                    className="!h-auto !px-0"
                                >
                                    <div className="w-full flex items-center gap-2 text-slate-600 py-2 px-3 rounded-lg hover:text-slate-800">
                                        <FaRegEdit />
                                        Редактировать
                                    </div>
                                </DropdownItem>
                            )}
                            <DropdownItem
                                onClick={() => {
                                    setItem(info?.row?.original);
                                    setConfirmProductId(info.row.original.id);
                                    setIsOpenPrint(true);
                                }}
                                className="!h-auto !px-0"
                            >
                                <div className="w-full flex items-center gap-2 text-slate-600 py-2 px-3 rounded-lg hover:text-slate-800">
                                    <ShtrixCod />
                                    Печать штрих код товара
                                </div>
                            </DropdownItem>

                            {checkPermission(
                                AccountPermissions.AccountPermissionProductDelete,
                            ) && (
                                <DropdownItem
                                    onClick={() => {
                                        setConfirmProductId(
                                            info.row.original.id,
                                        );
                                        setDeleteModalOpen(true);
                                    }}
                                    className="!h-auto !px-0"
                                >
                                    <div className="w-full flex items-center gap-2 text-red-500 py-2 px-3 rounded-lg">
                                        <IoTrashOutline size={20} />
                                        Удалить
                                    </div>
                                </DropdownItem>
                            )}
                        </Dropdown>
                    </div>
                ),
            }),
        ],
        [pagination, tableSettings],
    );

    const table = useReactTable({
        data: (data as unknown as Product[]) || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnVisibility: tableSettings?.reduce(
                (acc: any, i) => {
                    acc[i.key] = i.visible;
                    return acc;
                },
                {} as Record<string, boolean>,
            ),
        },
    });

    if (isPending)
        return (
            <div
                className={classNames(
                    "p-4 space-y-3 mb-3",
                    !searchFocus ? "h-full" : "h-[46vh]",
                )}
            >
                <Loading />
            </div>
        );

    return (
        <div
            className={classNames(
                " flex flex-col mb-3",
                !searchFocus
                    ? "h-[calc(100vh-120px)]"
                    : "h-[calc(100vh-346px)]",
            )}
        >
            {/* 🔹 Jadval */}
            <div className="h-full mb-3 border-slate-300 rounded-lg overflow-auto">
                {data && data?.length > 0 && !isPending ? (
                    <Table className="rounded-lg">
                        <THead className="sticky top-0">
                            {table.getHeaderGroups().map((headerGroup) => {
                                return (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const isActionsColumn =
                                                header.column.id === "actions";
                                            return (
                                                <Th
                                                    className={classNames(
                                                        isActionsColumn
                                                            ? " bg-white"
                                                            : "",
                                                        header.column.columnDef
                                                            .meta?.color,
                                                        "border",
                                                    )}
                                                    key={header.id}
                                                >
                                                    <div
                                                        className={classNames(
                                                            "px-4 text-left font-medium text-xs xl:text-sm text-slate-800",
                                                        )}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                    </div>
                                                </Th>
                                            );
                                        })}
                                    </Tr>
                                );
                            })}
                        </THead>
                        <TBody>
                            {table.getRowModel().rows.map((row) => (
                                <Tr
                                    key={row.id}
                                    className={`hover:bg-slate-100 transition`}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td
                                                key={cell.id}
                                                className={classNames(
                                                    cell.column.columnDef.meta
                                                        ?.color,
                                                    "border",
                                                )}
                                            >
                                                <div
                                                    className={classNames(
                                                        "text-xs xl:text-sm px-1",
                                                        cell.column.columnDef
                                                            .meta
                                                            ?.bodyCellClassName,
                                                    )}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
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

            {/* 🔹 Pagination */}
            <Pagination
                total={countData}
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

            {/* 🔹 ConfirmDialog */}
            <ConfirmDialog
                type="danger"
                className={"w-[600px]"}
                title="Вы уверены, что хотите удалить этот продукт?"
                isOpen={deleteModalOpen}
                confirmButtonProps={{
                    loading: productDeleteLoading,
                    onClick: onDeleteProduct,
                }}
                cancelText="Отмена"
                confirmText="Удалить"
                onClose={onCloseDeleteProductDialog}
                onRequestClose={onCloseDeleteProductDialog}
                onCancel={onCloseDeleteProductDialog}
            >
                <p className="text-gray-600">
                    После удаления, восстановить продукт будет невозможно.
                </p>
            </ConfirmDialog>

            <EditProductModal
                productId={confirmProductId}
                setProductId={setConfirmProductId}
                barcode={barcode}
                type={"edit"}
                setBarcode={setBarcode}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                productPriceType={productPriceType}
            />

            <PrintCheckProduct
                item={item}
                isOpen={isopenPrint}
                onClosePrintModal={onClosePrintModal}
            />
        </div>
    );
};

export default ProductTable;
