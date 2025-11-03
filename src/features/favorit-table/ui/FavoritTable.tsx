import { messages } from "@/app/constants/message.request";
import {
  useAllFavoritProductApi,
  useDeleteFavoritproduct,
} from "@/entities/products/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Table } from "@/shared/ui/kit";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Loading from "@/shared/ui/loading";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";

const FavoritTable = () => {
  const [confirmProductId, setConfirmProductId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isPending } = useAllFavoritProductApi();
  const {
    mutate: deleteFavoritProduct,
    isPending: productFavoritDeleteLoading,
  } = useDeleteFavoritproduct();

  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "№",
        cell: (info) => <div className="max-w-16">{info.row.index}</div>,
        size: 60,
      }),
      columnHelper.display({
        id: "name",
        header: "НАЗВАНИЕ",
        cell: (info) => info.row.original?.product?.name,
        size: 400,
      }),
      columnHelper.display({
        id: "img",
        header: "Изображение",
        size: 100,
        cell: (info) =>
          info.row.original?.product_package?.images?.length > 0 ? (
            <div className="h-[100px] w-[100px]">
              <img
                className="w-full h-full object-contain"
                src={info.row.original?.product_package?.images[0]?.fs_url}
                alt="info.row.original.product.name"
              />
            </div>
          ) : (
            "--"
          ),
      }),
      columnHelper.display({
        id: "action",
        header: "",
        size: 80,
        cell: (info) => {
          const productId = info.row.original?.id;

          return (
            <Button
              variant="plain"
              onClick={() => {
                setConfirmProductId(productId);
                setDeleteModalOpen(true);
              }}
              className="w-full bg-transparent flex items-center gap-2 text-red-500 hover:bg-gray-50 hover:text-red-400 active:bg-gray-100 py-3 px-5 rounded-xl"
            >
              <IoTrashOutline />
              Удалить
            </Button>
          );
        },
      }),
    ],
    []
  );

  const onDeleteFavoritProduct = () => {
    if (!confirmProductId) return;
    deleteFavoritProduct(confirmProductId, {
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

  const table = useReactTable({
    data: (data as unknown as any[]) || [],
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
      <div className="flex-1 mb-3 border border-gray-300 rounded-3xl overflow-y-auto">
        {data && data.length > 0 && !isPending ? (
          <Table className="w-full">
            <THead className="bg-white sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th style={{ width: header.getSize() }} key={header.id}>
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
                    <Td style={{ width: cell.column.getSize() }} key={cell.id}>
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

      <ConfirmDialog
        type="danger"
        className={"w-[600px]"}
        title="Удалить из избранного?"
        isOpen={deleteModalOpen}
        confirmButtonProps={{
          loading: productFavoritDeleteLoading,
          onClick: onDeleteFavoritProduct,
        }}
        cancelText="Отмена"
        confirmText="Удалить"
        onClose={onCloseDeleteProductDialog}
        onRequestClose={onCloseDeleteProductDialog}
        onCancel={onCloseDeleteProductDialog}
      >
        <p className="text-gray-600">Товар будет удалён из списка избранных.</p>
      </ConfirmDialog>
    </div>
  );
};

export default FavoritTable;
