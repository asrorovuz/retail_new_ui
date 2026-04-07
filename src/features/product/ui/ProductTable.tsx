import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useDeleteProduct } from "@/entities/products/repository";
import { Dropdown, Pagination, Table } from "@/shared/ui/kit";
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
import type {
  ProductPriceType,
} from "@/features/modals/model";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import PrintCheckProduct from "@/features/print-modal";
import classNames from "@/shared/lib/classNames";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";

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
  setSearch
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
  const [confirmProductId, setConfirmProductId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isopenPrint, setIsOpenPrint] = useState(false);
  const [item, setItem] = useState<Product | null>(null);
  const { tableSettings } = useSettingsStore((s) => s);

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
        cell: (info) =>
          (pagination?.pageIndex - 1) * pagination?.pageSize +
          (info?.row?.index + 1),
        size: 60,
      }),
      columnHelper.accessor("name", {
        header: "НАЗВАНИЕ",
        cell: (info) => <p className="w-[280px]">{info.getValue() || "-"}</p>,
        meta: {
          color: tableSettings?.find((i) => i.key === "name")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "totalRemainder",
        header: () => <span className="text-nowrap">ОСТАТОК</span>,
        cell: (info) => {
          const total = info.row.original.warehouse_items?.[0]?.state;

          return `${
            total !== undefined ? total.toLocaleString() : "0"
          } ${showMeasurmentName(info.row.original.measurement_code)}`;
        },
        size: 80,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "totalRemainder")?.color ||
            "#fff",
        },
      }),
      columnHelper.display({
        id: "price",
        header: () => <span className="text-nowrap">ЦЕНА</span>,
        cell: (info) => {
          const price = info.row.original.prices?.[0]?.amount;
          return (
            <p className="w-[140px]">
              {price ? `${price.toLocaleString()}` : "-"}
            </p>
          );
        },
        meta: {
          color: tableSettings?.find((i) => i.key === "price")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "bulkPrice",
        header: () => <span className="text-nowrap">ОПТОВАЯ ЦЕНА</span>,
        cell: (info) => {
          const price = info.row.original.prices?.[1]?.amount;
          return (
            <p className="w-[140px]">
              {price ? `${price.toLocaleString()}` : "-"}
            </p>
          );
        },
        size: 140,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "bulkPrice")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "purchesPrice",
        header: () => <span className="text-nowrap">Приходная цена</span>,
        cell: (info) => {
          const price =
            info.row.original.warehouse_items?.[0]?.purchase_price_amount;
          return price ? `${price.toLocaleString()} сум` : "-";
        },
        size: 140,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "purchesPrice")?.color ||
            "#fff",
        },
      }),
      columnHelper.display({
        id: "category",
        header: () => <span className="text-nowrap">КАТЕГОРИЯ</span>,
        cell: (info) => info.row.original.category?.name || "-",
        size: 100,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "category")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "barcode",
        header: () => <span className="text-nowrap">ШТРИХ-КОД</span>,
        cell: (info) => {
          const barcodes = info.row.original.barcodes;

          if (!Array.isArray(barcodes) || !barcodes.length) return "-";

          return barcodes[0]?.value || "-";
        },
        size: 100,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "barcode")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "sku",
        header: () => <span className="text-nowrap">АРТИКУЛ</span>,
        cell: (info) => info.row.original.sku || "-",
        size: 100,
        meta: {
          color: tableSettings?.find((i) => i.key === "sku")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "code",
        header: () => <span className="text-nowrap">КОД</span>,
        cell: (info) => info.row.original.code || "-",
        size: 100,
        meta: {
          color: tableSettings?.find((i) => i.key === "code")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "catalogCode",
        header: () => <span className="text-nowrap">ИКПУ-код</span>,
        cell: (info) => info.row.original.catalog_name || "-",
        size: 100,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "catalogCode")?.color ||
            "#fff",
        },
      }),
      columnHelper.display({
        id: "totalRemainderMin",
        header: () => <span className="text-nowrap">МИН. ОСТАТОК</span>,
        cell: (info) => {
          const total = info.row.original.warehouse_items?.[0]?.alert_on;

          return `${total ? total?.toLocaleString() : "0"} ${showMeasurmentName(
            info.row.original.measurement_code,
          )}`;
        },
        size: 80,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "totalRemainderMin")?.color ||
            "#fff",
        },
      }),
      // 🧩 Actions ustuni
      columnHelper.display({
        id: "actions",
        header: () => (
          <div className="text-2xl flex justify-center">
            <TableSettingsModal />
          </div>
        ),
        size: 50,
        cell: (info) => (
          <Dropdown
            renderTitle={
              <div className="flex justify-center text-2xl text-slate-600">
                <HiOutlineDotsHorizontal />
              </div>
            }
          >
            <DropdownItem
              onClick={() => {
                setItem(info?.row?.original);
                setConfirmProductId(info.row.original.id);
                setIsOpenPrint(true);
              }}
              className="h-auto!"
            >
              <div className="w-full flex items-center gap-2 text-slate-700 py-3 px-5 rounded-xl">
                <ShtrixCod />
                Печать штрих код товара
              </div>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setConfirmProductId(info.row.original.id);
                setIsOpen(true);
              }}
              className="h-auto!"
            >
              <div className="w-full flex items-center gap-2 text-orange-500 py-3 px-5 rounded-xl">
                <FaRegEdit />
                Редактировать
              </div>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setConfirmProductId(info.row.original.id);
                setDeleteModalOpen(true);
              }}
              className="h-auto!"
            >
              <div className="w-full flex items-center gap-2 text-red-500 py-3 px-5 rounded-xl">
                <IoTrashOutline />
                Удалить
              </div>
            </DropdownItem>
          </Dropdown>
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
        "h-[46vh] flex flex-col mb-3",
        !searchFocus ? "h-[78vh]" : "h-[46vh]",
      )}
    >
      {/* 🔹 Jadval */}
      <div className="h-full mb-3 border border-slate-300 rounded-3xl overflow-auto">
        {data && data?.length > 0 && !isPending ? (
          <Table className="min-w-full table-fixed border-separate border-spacing-0">
            <THead className="sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isActionsColumn = header.column.id === "actions";
                      return (
                        <Th
                          className={isActionsColumn ? " bg-white" : ""}
                          key={header.id}
                        >
                          <div
                            className={classNames(
                              "px-4 text-left font-medium text-xs xl:text-sm text-slate-800",
                              header.column.columnDef.meta?.headerClassName,
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
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
                          cell.column.columnDef.meta?.bodyCellClassName,
                        )}
                      >
                        <div
                          className={classNames("py-3 text-xs xl:text-sm px-4")}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
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
