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
  useDeleteTransacton,
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

const ProductTable = ({ search }: { search: string }) => {
  const [confirmProductId, setConfirmProductId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });

  // 🚀 API chaqiruv
  const { data, isPending } = useAllProductApi(
    pagination.pageSize,
    pagination.pageIndex,
    search || ""
  );
  const { data: countData } = useAllProductCountApi();
  const { mutate: deleteProduct, isPending: productDeleteLoading } =
    useDeleteTransacton();

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
      }),
      columnHelper.display({
        id: "total",
        header: "ОБЩАЯ ОСТАТОК",
        cell: (info) => {
          const total =
            info.row.original.warehouse_items?.[0]?.purchase_price_amount;
          return total !== undefined ? total?.toFixed(2) : "0.00";
        },
        size: 100,
      }),
      columnHelper.display({
        id: "count",
        header: "КОЛ-ВО В УП.",
        cell: (info) => info.row.original.product_packages?.[0]?.count || "-",
        size: 100,
      }),
      columnHelper.display({
        id: "unit",
        header: "ЕД. ИЗМ.",
        cell: (info) =>
          info.row.original.product_packages?.[0]?.measurement_name || "-",
        size: 100,
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
      }),
      columnHelper.display({
        id: "sku",
        header: "АРТИКУЛ",
        cell: (info) => info.row.original.product_packages?.[0]?.sku || "-",
        size: 100,
      }),
      columnHelper.display({
        id: "code",
        header: "КОД",
        cell: (info) => info.row.original.product_packages?.[0]?.code || "-",
        size: 100,
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
              <DropdownItem className="!h-auto">
                <div className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 py-3 px-5 rounded-xl">
                  <ShtrixCod />
                  Печать штрих код товара
                </div>
              </DropdownItem>
              <DropdownItem className="!h-auto">
                <div className="flex items-center gap-2 text-orange-500 hover:bg-gray-50 py-3 px-5 rounded-xl">
                  <FaRegEdit />
                  Редактировать
                </div>
              </DropdownItem>
              <DropdownItem className="!h-auto">
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
    <div className="h-[calc(100%_-_44px)] flex flex-col">
      {/* 🔹 Jadval */}
      <div className="flex-1 mb-3 border border-gray-300 rounded-3xl overflow-y-auto">
        {data && data.length > 0 ? (
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
    </div>
  );
};

export default ProductTable;
