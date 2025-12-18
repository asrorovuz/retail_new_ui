import classNames from "@/shared/lib/classNames";
import CurrencyName from "@/shared/lib/CurrencyName";
import { onChangePagination } from "@/shared/lib/onPaginationChange";
import payment from "@/shared/lib/payment";
import { Pagination, Table, Tag, Tooltip } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { TbEdit, TbEye, TbTrash } from "react-icons/tb";

const TableHistory = ({
  data,
  count,
  setParams,
  params,
  loading,
  pay,
  payKey,
}: {
  data: any[];
  count: number;
  setParams: any;
  params: any;
  loading: boolean;
  pay: boolean;
  payKey: string;
}) => {
  const onPaginationChange = (updater: any) => {
    onChangePagination(updater, params, setParams);
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return [
      {
        id: "№",
        enableSorting: false,
        enableHiding: false,
        meta: {
          cellClassName: "text-center min-w-[75px] max-w-[75px]",
        },
        header: () => {
          return `№`;
        },
        cell: ({ row }) => {
          return (
            <span className="cursor-pointer font-bold">
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
              //   onClick={() => navigate(`/${operationType}/${row.id}`)}
            >
              #{number}
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
          cellClassName: "text-end min-w-[175px]",
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
                  <p key={index} className={"heading-text font-bold"}>
                    <FormattedNumber value={item?.amount} />
                    <CurrencyName currency={item.currency} />
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
                const { [payKey as string]: pay } = row?.original as any;

                const { cash_box_states } = pay || {};
                return (
                  <div>
                    {cash_box_states ? (
                      payment
                        .calculateToPay(cash_box_states)
                        ?.map((item: any, index: number) => (
                          <p key={index} className={"heading-text font-bold"}>
                            <FormattedNumber value={item?.amount} />
                            <CurrencyName currency={item.currency} />
                          </p>
                        ))
                    ) : (
                      <p className={"heading-text font-bold"}>0</p>
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
                        ?.map((item: any, index: number) => (
                          <p key={index} className={"heading-text font-bold"}>
                            <FormattedNumber value={item?.amount} />
                            <CurrencyName currency={item.currency} />
                          </p>
                        ))
                    ) : (
                      <p className={"heading-text font-bold"}>0</p>
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
        id: "approved",
        enableSorting: false,
        enableHiding: false,
        header: () => {
          return "Статус";
        },
        cell: ({ row }) => {
          const status = row?.original.is_approved;
          return (
            <Tag
              className={classNames(
                status ? "bg-success-subtle" : "bg-warning-subtle"
              )}
            >
              <span
                className={classNames(
                  `capitalize font-semibold`,
                  status ? "text-success" : "text-warning"
                )}
              >
                {status ? "Подтверждено" : "В ожидании"}
              </span>
            </Tag>
          );
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
            "text-center sticky right-0 z-999 !bg-white dark:!bg-gray-800 hover:!bg-white dark:hover:!bg-gray-800 shadow-[inset_0_1px_0_#e5e7eb] dark:shadow-[inset_0_1px_0_#374151]",
          headerClassName:
            "text-center sticky right-0 z-999 !bg-white dark:!bg-gray-800 hover:!bg-white dark:hover:!bg-gray-800 shadow-[inset_0_0_0_#e5e7eb] dark:shadow-[inset_0_0_0_#374151]",
        },
        header: () => {
          return "Действие";
        },
        cell: () => {
          return (
            <div className="flex justify-end text-lg gap-1">
              <Tooltip wrapperClass="flex" title="View">
                <span
                  className={`cursor-pointer p-2`}
                  onClick={() => {
                    // setVeiwModal(true);
                    // setVeiwedItemId(row.original.id);
                  }}
                >
                  <TbEye />
                </span>
              </Tooltip>
              <Tooltip wrapperClass="flex" title="View">
                <span
                  className={`cursor-pointer p-2`}
                  //   onClick={() => navigate(`/${operationType}/${row.id}`)}
                >
                  <TbEdit />
                </span>
              </Tooltip>
              <Tooltip wrapperClass="flex" title="Delete">
                <span
                  className="cursor-pointer p-2 hover:text-red-500"
                  //   onClick={() => onOpenDeleteDataDialog(row.original)}
                >
                  <TbTrash />
                </span>
              </Tooltip>
            </div>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, params]);

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

  return (
    <div>
      <div className="flex-1 mb-3 border border-gray-200 rounded-3xl overflow-y-auto">
        {data && data.length > 0 && !loading ? (
          <Table className="w-full table-fixed flex-1">
            <THead className="bg-white sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      <div
                        className={classNames(
                          "px-4 text-left font-medium text-xs xl:text-sm text-gray-800",
                          header.column.columnDef.meta?.headerClassName
                        )}
                      >
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
                    index % 2 ? "bg-white" : "bg-gray-100"
                  } hover:bg-gray-100 transition`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      className={classNames(
                        cell.column.columnDef.meta?.color || "#fff"
                      )}
                      key={cell.id}
                    >
                      <div
                        className={classNames("px-4 py-3 text-xs xl:text-sm")}
                      >
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
          <Empty size={150} textSize="32px"/>
        )}
      </div>

      <Pagination
        displayTotal={false}
        total={count}
        pageSize={params.limit}
        pageSizeOptions={[10, 20, 50, 100, 1000]}
        currentPage={Math.floor((params.skip ?? 0) / (params.limit ?? 1)) + 1}
        onChange={(page, size) =>
          setParams((prev: any) => ({
            ...prev,
            limit: size,
            skip: (page - 1) * (size ?? 10),
          }))
        }
      />
    </div>
  );
};

export default TableHistory;
