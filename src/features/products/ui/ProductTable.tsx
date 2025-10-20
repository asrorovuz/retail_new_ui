import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useAllProductApi,
  useAllProductCountApi,
} from "@/entities/products/repository";
import { Pagination, Table } from "@/shared/ui/kit";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Th from "@/shared/ui/kit/Table/Th";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import type { Product } from "@/@types/products";
import Loading from "@/shared/ui/loading";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import TableSettingsModal from "./TableSettingsModal";

const ProductTable = ({ search }: { search: string }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });

  // 🚀 API chaqiruv
  const { data, isPending, refetch } = useAllProductApi(
    pagination.pageSize,
    pagination.pageIndex,
    search || ""
  );
  const { data: countData } = useAllProductCountApi();

  const columnHelper = createColumnHelper<Product>();

  // const productTableColumnsKey = useMemo(() => {
  //   return [
  //     { key: "name" },
  //     { key: "totalRemainder", defaultColor: "!bg-green-100" },
  //     { key: "packInCount" },
  //     { key: "package" },
  //     { key: "price" },
  //     { key: "purchasePrice" },
  //     { key: "sku" },
  //     { key: "code" },
  //   ];
  // }, []);

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

      // 🧩 Yangi ustun — Actions
      columnHelper.display({
        id: "actions",
        header: () => <TableSettingsModal />,
        size: 50,
        cell: (info) => (
          <div className="flex items-center justify-center gap-3">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => console.log("Edit:", info.row.original)}
            >
              ✏️
            </button>
          </div>
        ),
      }),
    ],
    [pagination]
  );

  // 📋 Jadval
  const table = useReactTable({
    data: (data as unknown as Product[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 🔁 Sahifa o‘zgarganda qayta so‘rov yuborish
  useEffect(() => {
    refetch();
  }, [pagination.pageIndex, pagination.pageSize, refetch]);

  if (isPending)
    return (
      <div className="p-4 space-y-3">
        <Loading />
      </div>
    );

  return (
    <div className="h-[calc(100%_-_44px)] flex flex-col">
      {/* 🔹 Jadval qismi */}
      <div className="flex-1 mb-3 border border-gray-300 rounded-3xl overflow-y-auto">
        {data && data.length > 0 ? (
          <Table className="w-full">
            <THead className="bg-white sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      <div className="px-4 py-3 text-left font-medium text-sm text-gray-800">
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
    </div>
  );
};

export default ProductTable;
