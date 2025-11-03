import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useAllProductApi,
  useAllProductCountApi,
  useDeleteProduct,
} from "@/entities/products/repository";
import { Button, Dropdown, Pagination, Table } from "@/shared/ui/kit";
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
import type { ProductTableProps } from "@/features/modals/model";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import PrintCheckProduct from "@/features/print-modal";
import { useDebounce } from "@/shared/lib/useDebounce";

const ProductTable = ({
  search,
  type,
  setType,
  setBarcode,
  barcode,
  productPriceType,
}: { search: string } & ProductTableProps) => {
  const debouncedSearch = useDebounce(search, 500);
  const [confirmProductId, setConfirmProductId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [item, setItem] = useState<Product | null>(null)
  const { tableSettings } = useSettingsStore((s) => s);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });

  // 🚀 API chaqiruv
  const { data, isPending } = useAllProductApi(
    pagination.pageSize,
    pagination.pageIndex,
    debouncedSearch || ""
  );
  const { data: countData } = useAllProductCountApi(debouncedSearch || "");
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
          messages.ru.SUCCESS_MESSAGE
        );
        setDeleteModalOpen(false);
        setConfirmProductId(null);
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
    setType("add");
    setConfirmProductId(null);
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
        cell: (info) => info.getValue() || "-",
        size: 180,
        meta: {
          color: tableSettings?.find((i) => i.key === "name")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "totalReminder",
        header: "ОБЩАЯ ОСТАТОК",
        cell: (info) => {
          const total = info.row.original.warehouse_items?.[0]?.state;
          return total !== undefined ? total?.toFixed(2) : "0.00";
        },
        size: 100,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "totalRemainder")?.color ||
            "#fff",
        },
      }),
      columnHelper.display({
        id: "packInCount",
        header: "КОЛ-ВО В УП.",
        cell: (info) => info.row.original.product_packages?.[0]?.count || "-",
        size: 100,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "packInCount")?.color ||
            "#fff",
        },
      }),
      columnHelper.display({
        id: "package",
        header: "ЕД. ИЗМ.",
        cell: (info) =>
          info.row.original.product_packages?.[0]?.measurement_name || "-",
        size: 100,
        meta: {
          color:
            tableSettings?.find((i) => i.key === "package")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "price",
        header: "ЦЕНА",
        cell: (info) => {
          const price =
            info.row.original.product_packages?.[0]?.prices?.[0]?.amount;
          return price ? `${price.toLocaleString()} сум` : "-";
        },
        size: 100,
        meta: {
          color: tableSettings?.find((i) => i.key === "price")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "sku",
        header: "АРТИКУЛ",
        cell: (info) => info.row.original.product_packages?.[0]?.sku || "-",
        size: 100,
        meta: {
          color: tableSettings?.find((i) => i.key === "sku")?.color || "#fff",
        },
      }),
      columnHelper.display({
        id: "code",
        header: "КОД",
        cell: (info) => info.row.original.product_packages?.[0]?.code || "-",
        size: 100,
        meta: {
          color: tableSettings?.find((i) => i.key === "code")?.color || "#fff",
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
        cell: (info) => {
          const productId = info.row.original.id;
          return (
            <Dropdown
              toggleClassName="text-2xl text-gray-600 flex justify-center"
              renderTitle={<HiOutlineDotsHorizontal />}
            >
              <DropdownItem className="h-auto!">
                <div
                  onClick={() => {
                    setItem(info?.row?.original)
                    setConfirmProductId(productId);
                    setType("print");
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 py-3 px-5 rounded-xl"
                >
                  <ShtrixCod />
                  Печать штрих код товара
                </div>
              </DropdownItem>
              <DropdownItem className="h-auto!">
                <div
                  onClick={() => {
                    setConfirmProductId(productId);
                    setType("edit");
                  }}
                  className="flex items-center gap-2 text-orange-500 hover:bg-gray-50 py-3 px-5 rounded-xl"
                >
                  <FaRegEdit />
                  Редактировать
                </div>
              </DropdownItem>
              <DropdownItem className="h-auto!">
                <Button
                  variant="plain"
                  onClick={() => {
                    setConfirmProductId(productId);
                    setDeleteModalOpen(true);
                  }}
                  className="w-full bg-transparent flex items-center gap-2 text-red-500 hover:bg-gray-50 active:bg-gray-100 py-3 px-5 rounded-xl"
                >
                  <IoTrashOutline />
                  Удалить
                </Button>
              </DropdownItem>
            </Dropdown>
          );
        },
      }),
    ],
    [pagination]
  );

  const table = useReactTable({
    data: (data as unknown as Product[]) || [],
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
    <div className="h-[calc(100%-44px)] flex flex-col">
      {/* 🔹 Jadval */}
      <div className="flex-1 mb-3 border border-gray-300 rounded-3xl overflow-y-auto">
        {data && data.length > 0 && !isPending ? (
          <Table className="w-full table-fixed">
            <THead className="bg-white sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      <div className="px-4 text-left font-medium text-sm text-gray-800">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                    index % 2 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      <div className="px-4 py-3 text-sm text-gray-800">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
        type={type}
        setType={setType}
        setBarcode={setBarcode}
        productPriceType={productPriceType}
      />

      <PrintCheckProduct item={item} type={type} onClosePrintModal={onClosePrintModal}/>
    </div>
  );
};

export default ProductTable;
