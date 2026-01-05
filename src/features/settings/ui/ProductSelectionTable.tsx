import type { Product } from "@/@types/products";
import {
  useAllProductApi,
  useAllProductCountApi,
} from "@/entities/products/repository";
import { showMeasurmentName } from "@/shared/lib/showMeausermentName";
import { useDebounce } from "@/shared/lib/useDebounce";
import {
  Button,
  Input,
  Pagination,
  Skeleton,
  Tooltip,
} from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import { FileNotFoundSvg } from "@/shared/ui/svg";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { type UseFormClearErrors, type UseFormSetValue } from "react-hook-form";

type ProductSelectionTableProps = {
  setValue: UseFormSetValue<any>;
  setSelectionDialogShow: Dispatch<SetStateAction<boolean>>;
  clearErrors: UseFormClearErrors<any>;
};

const ProductSelectionTable = ({
  setValue,
  setSelectionDialogShow,
  clearErrors,
}: ProductSelectionTableProps) => {
  const [page, setPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [query, setQuery] = useState("");

  const debouncevalue = useDebounce(query, 500);
  const { data: products, isLoading } = useAllProductApi(
    pageLimit,
    page,
    debouncevalue
  );
  const { data: count, isLoading: fetchCountLoading } =
    useAllProductCountApi(debouncevalue);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "#",
        header: "#",
        cell: ({ row }) => (page - 1) * pageLimit + row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Название",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex flex-col gap-1">
              <div className="text-gray-800 font-semibold">{product.name}</div>
              <div className="flex space-x-2 text-xs">
                {product?.category && (
                  <span className="text-blue-600 px-2 py-0.5 rounded-md bg-blue-600/20 uppercase font-semibold">
                    {product?.category?.name}
                  </span>
                )}
                <span className="text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md font-semibold">
                  {product?.barcodes?.[0]?.value}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "purchase-price",
        header: () => <div className="text-center">Закупочная цена</div>,
        cell: ({ row }) => {
          const product = row.original;
          return product.warehouse_items?.[0]?.purchase_price_amount &&
            product.warehouse_items?.[0]?.purchase_price_currency ? (
            <div className="font-medium bg-blue-600/20  text-blue-600 flex items-center justify-end px-2 py-0.5 rounded-md text-sm gap-2 mx-2">
              <FormattedNumber
                value={product.warehouse_items?.[0]?.purchase_price_amount}
              />
              <span className="text-xs font-bold mt-0.5">
                {product.warehouse_items?.[0]?.purchase_price_currency?.name}
              </span>
            </div>
          ) : null;
        },
      },
      {
        accessorKey: "unit",
        header: "Ед. изм",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="font-semibold">
              {showMeasurmentName(product?.measurement_code) ?? "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: () => <div className="text-end">Цена</div>,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <>
              <div className="flex items-center text-sm font-medium justify-end gap-1 px-2 py-1 rounded-md bg-blue-600/20">
                <FormattedNumber value={product?.prices?.[0]?.amount ?? 0} />
                <span className="text-xs font-bold mt-0.5">
                  {product?.prices?.[0]?.currency?.name}
                </span>
              </div>
            </>
          );
        },
      },
      {
        accessorKey: "stock",
        header: () => <div className="text-center">Остаток</div>,
        cell: ({ row }) => {
          const { warehouse_items } = row.original;
          return (
            <Tooltip
              title={warehouse_items?.map((item) => (
                <div key={item.id} className="flex justify-between gap-6">
                  <span>{item?.warehouse?.name}</span>
                  <span>
                    <FormattedNumber value={item?.state} />
                    {showMeasurmentName(row?.original?.measurement_code) ?? "-"}
                  </span>
                </div>
              ))}
            >
              <div className="cursor-pointer font-bold text-center">
                <FormattedNumber value={warehouse_items?.[0]?.state ?? 0} />
              </div>
            </Tooltip>
          );
        },
      },

      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const product = row.original;

          return (
            <div className="text-right">
              <Button
                variant="solid"
                size="sm"
                type="button"
                onClick={() => {
                  setValue("fiscalization_default_items", {
                    product_name: product.name,
                    catalog: product?.catalog_code ?? "",
                    package: product?.package_code?.toString() ?? "",
                    nds_rate: undefined,
                  });
                  setSelectionDialogShow(false);
                  clearErrors("fiscalization_default_items.product_name");
                }}
              >
                Выбрать
              </Button>
            </div>
          );
        },
      },
    ],
    [setValue, pageLimit, page]
  );

  const memoizedProducts = useMemo(() => products || [], [products]);

  const table = useReactTable({
    data: memoizedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="p-5 pt-0 border-b space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Название
        </label>
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex lg:w-[30vw] w-[40vh]">
            <Input
              type="text"
              placeholder="Введите название"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {/* <AddProduct /> */}
        </div>
      </div>

      <div className="flex-1 h-[calc(90vh_-_240px)] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white flex-1 overflow-auto">
            {(isLoading || fetchCountLoading) &&
              (products ?? [])?.map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-5 py-3 border border-gray-200 text-center"
                    >
                      <Skeleton className="h-5 w-full mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}

            {(!isLoading || !fetchCountLoading) && products?.length === 0 && (
              <tr>
                <td
                  colSpan={columns?.length}
                  className="py-6 text-center text-gray-500"
                >
                  <div className="w-full flex flex-col items-center justify-center">
                    <FileNotFoundSvg />
                    <span className="font-semibold block mt-2">{""}</span>
                  </div>
                </td>
              </tr>
            )}

            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 text-sm">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        displayTotal={false}
        total={count}
        pageSize={pageLimit}
        pageSizeOptions={[10, 20, 50, 100, 1000]}
        currentPage={page}
        onChange={(page, size) => {
          setPageLimit(size ?? 0);
          setPage(page);
        }}
      />
    </>
  );
};

export default ProductSelectionTable;
