import { messages } from "@/app/constants/message.request";
import { useDeleteContractor } from "@/entities/auth/repository";
import { useContractorApi } from "@/entities/sale/repository";
import ContragentModal from "@/features/modals/ui/ContragentModal";
import PaymentDebtsModal from "@/features/modals/ui/PaymentDebtsModal";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dropdown, Input, Pagination, Table } from "@/shared/ui/kit";
import ConfirmDialog from "@/shared/ui/kit-pro/confirm-dialog/ConfirmDialog";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import DropdownItem from "@/shared/ui/kit/Dropdown/DropdownItem";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";

export type ContragentType = {
  id: number;
  name: string;
  is_customer: boolean;
  is_supplier: boolean;
  is_default: boolean;
  debts: {
    amount: number;
    currency_code: number;
  }[];
  contacts?: {
    value: string;
  }[];
};

const Counterparty = () => {
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });
  const [type, setType] = useState<"add" | "edit">("add");
  const [deleteModal, setDeleteModal] = useState(false);
  const [dobtModal, setDebitModal] = useState(false);
  const [contractorId, setContractorId] = useState<number | null>(null);
  const [contragent, setContragent] = useState<ContragentType | null>(null);

  const columnHelper = createColumnHelper<any>();

  const { data, isPending } = useContractorApi(true, search);
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteContractor();
  // const [filterItems, setFilterItems] = useState({
  //   type: null,
  //   debit: null,
  // });

  const onDeleteContragent = () => {
    if (contragent) {
      deleteMutate(contragent?.id, {
        onSuccess() {
          showSuccessMessage(
            messages.uz.SUCCESS_MESSAGE,
            messages.ru.SUCCESS_MESSAGE,
          );
          setContragent(null);
          setDeleteModal(false);
        },
        onError(err) {
          showErrorMessage(err);
        },
      });
    }
  };

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
      columnHelper.display({
        id: "name",
        header: "НАЗВАНИЕ",
        cell: ({ row }) => (
          <p className="w-[250px]">{row.original.name || "-"}</p>
        ),
      }),
      columnHelper.display({
        id: "type",
        header: "Тип",
        cell: ({ row }) => {
          const type = row.original.is_customer
            ? "Клиент"
            : row.original.is_supplier
              ? "Поставшик"
              : "-";
          return <p className="w-[180px]">{type || "-"}</p>;
        },
      }),
      columnHelper.display({
        id: "price",
        header: "Задолжность",
        cell: ({ row }) => {
          const totalPrice =
            row.original?.debts?.reduce(
              (acc: number, item: { amount: number }) => acc + item.amount,
              0,
            ) ?? 0;
          return (
            <p className="w-[200px]">
              <FormattedNumber value={totalPrice} scale={2} />
            </p>
          );
        },
      }),
      columnHelper.display({
        id: "date",
        header: "Дата операцы",
        cell: ({ row }) => (
          <p className="w-[120px]">
            {dayjs(row.original.created_at).format("YYYY-MM-DD HH:mm") || "-"}
          </p>
        ),
      }),
      columnHelper.display({
        id: "phone",
        header: "Тел. номер",
        cell: ({ row }) => {
          const contacts = row.original?.contacts || [];

          if (contacts.length === 0) return <span>-</span>;

          return (
            <div className="flex flex-col gap-1">
              {contacts.map((item: any, index: number) => {
                const value = item?.value || "";

                // +998 XX XXX XX XX format
                const formatted =
                  value.length === 12
                    ? `+${value.slice(0, 3)} ${value.slice(3, 5)} ${value.slice(5, 8)} ${value.slice(8, 10)} ${value.slice(10)}`
                    : value;

                return (
                  <span key={index} className="w-[180px]">
                    {formatted || "-"}
                  </span>
                );
              })}
            </div>
          );
        },
      }),
      // columnHelper.display({
      //   id: "comment",
      //   header: "Коментарие",
      //   cell: ({ row }) => (
      //     <p className="w-[280px]">{row.original.name || "-"}</p>
      //   ),
      // }),
      columnHelper.display({
        id: "action",
        header: "",
        cell: ({ row }) => (
          <Dropdown renderTitle={<HiDotsHorizontal size={22} />}>
            <DropdownItem
              onClick={() => {
                setDebitModal(true);
                setContractorId(row.original?.id);
              }}
            >
              <div className="w-full flex items-center gap-2 text-slate-700 rounded-xl">
                💰 Погасить долг
              </div>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setType("edit");
                setContragent(row.original);
                setIsOpen(true);
              }}
            >
              <div className="w-full flex items-center gap-2 text-slate-700 rounded-xl">
                <FaRegEdit />
                Редактировать
              </div>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDeleteModal(true);
                setContragent(row.original);
              }}
            >
              <div className="w-full flex items-center gap-2 text-red-500 rounded-xl">
                <IoTrashOutline />
                Удалить
              </div>
            </DropdownItem>
          </Dropdown>
        ),
      }),
    ],
    [pagination, search],
  );

  const table = useReactTable({
    data: (data as unknown as any) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white h-full rounded-2xl p-4">
      <NavigateButton content="Контрагенты" />
      <div className="mb-3 flex items-center justify-between">
        <Input
          value={search ?? ""}
          size="sm"
          inputMode="none"
          className="max-w-[332px]"
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          placeholder="Поиск по любому товару"
        />
        <Button
          onClick={() => setIsOpen(true)}
          variant="solid"
          size="sm"
          icon={<FaPlus />}
        >
          Добавить контрагента
        </Button>
      </div>

      <div
        className={classNames(
          "h-[46vh] flex flex-col mb-3",
          !searchFocus ? "h-[78vh]" : "h-[46vh]",
        )}
      >
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
          total={20}
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

      {searchFocus && (
        <div className="rounded-2xl bg-slate-200 mb-3 p-1">
          <FullKeyboard setSearch={setSearch} />
        </div>
      )}

      <ContragentModal
        isOpen={isOpen}
        type={type}
        contragent={contragent}
        setContragent={setContragent}
        setIsOpen={setIsOpen}
        setType={setType}
      />

      <PaymentDebtsModal
        dobtModal={dobtModal}
        setDebitModal={setDebitModal}
        contractorId={contractorId}
        setContragentId={setContractorId}
      />

      <ConfirmDialog
        type="danger"
        className={"w-[600px]"}
        title="Вы уверены, что хотите удалить этого контрагента?"
        isOpen={deleteModal}
        confirmButtonProps={{
          loading: isDeletePending,
          onClick: onDeleteContragent,
        }}
        cancelText="Отмена"
        confirmText="Удалить"
        onClose={() => setDeleteModal(false)}
        onRequestClose={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
      >
        <p className="text-gray-600">
          После удаления восстановить контрагента будет невозможно.
        </p>
      </ConfirmDialog>
    </div>
  );
};

export default Counterparty;
