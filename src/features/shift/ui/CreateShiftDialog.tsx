import type { AmountType } from "@/@types/cashbox";
import { messages } from "@/app/constants/message.request";
import { CurrencyCodeUZSText } from "@/app/constants/paymentType";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useCashboxApi, useCreateShiftApi } from "@/entities/init/repository";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Table } from "@/shared/ui/kit";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import Th from "@/shared/ui/kit/Table/Th";
import THead from "@/shared/ui/kit/Table/THead";
import Tr from "@/shared/ui/kit/Table/Tr";
import Loading from "@/shared/ui/loading";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { toast } from "react-toastify";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
};

export const paymentTypes = {
  [1]: "img/payments/cash.png",
  [2]: "img/payments/uzcard.png",
  [3]: "img/payments/humo.png",
  [5]: "img/payments/click.png",
  [6]: "img/payments/payme.png",
  [7]: "img/payments/visa.png",
};

const CreateShiftDialog = ({ isOpen, onClose }: PropsType) => {
  const { data: cashboxs, isPending } = useCashboxApi();
  const { mutate: createShiftMutate, isPending: createShiftPending } =
    useCreateShiftApi();

  const { setActiveShift } = useSettingsStore();

  const handleShiftCreate = async () => {
    if (cashboxs?.length === 0) {
      toast.warning(
        "Упс, что-то пошло не так. Обратитесь к администратору, чтобы решить эту проблему."
      );

      return;
    }
    createShiftMutate(cashboxs?.[0]?.id ?? null, {
      onSuccess(res) {
        showSuccessMessage(
          messages.uz.SUCCESS_CREATE_SHIFT,
          messages.ru.SUCCESS_CREATE_SHIFT
        );
        setActiveShift(res);
        onClose();
      },
      onError(error) {
        showErrorMessage(error);
      },
    });
  };

  const shiftColumns: ColumnDef<AmountType>[] = useMemo(
    () => [
      {
        accessorKey: "type",
        header: () => <p className="font-normal text-left">Типы платежей</p>,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex justify-start px-3">
              <img
                src={
                  paymentTypes[item?.money_type as keyof typeof paymentTypes]
                }
                alt={info.cell.id}
                className="w-10 object-contain"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "sum",
        header: () => <p className="font-normal text-left">Сумма</p>,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="text-left font-semibold text-sm py-2 px-3">
              <FormattedNumber value={item.amount} /> {CurrencyCodeUZSText}
            </div>
          );
        },
      },
    ],
    []
  );

  const shiftTable = useReactTable<AmountType>({
    data: cashboxs?.length ? cashboxs[0].amounts ?? [] : [],
    columns: shiftColumns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 130,
    },
  });

  return (
    <Dialog
      width={480}
      onClose={onClose}
      isOpen={isOpen}
      title={"Открыть смену"}
    >
      <div className="flex flex-col h-full max-h-[70vh]">
        {/* <p className="text-sm text-gray-500">Остатки с последней смены</p> */}
        <div className="flex-1 overflow-hidden">
          {isPending ? (
            <div className="flex items-center justify-center py-16">
              <Loading />
            </div>
          ) : null}
          {!isPending && !cashboxs?.[0]?.amounts?.length ? (
            <div className="border border-gray-200 rounded-2xl">
              <div className="grid grid-cols-2 py-2 px-3 border-b">
                <p>ТИП ПЛАТЕЖИ</p>
                <p>СУММА</p>
              </div>
              <div className="h-[256px] flex justify-center items-center">
                <Empty
                  text="До вас смены не было."
                  textSize={"20px"}
                  size={120}
                />
              </div>
              <div className="flex justify-between py-2 px-3 font-medium border-t">
                <p>Общая сумма</p>
                <p className="text-primary">0 сум</p>
              </div>
            </div>
          ) : null}

          {!isPending && cashboxs?.[0]?.amounts?.length ? (
            <div className="h-full overflow-auto">
              <div className="bg-white border border-gray-200 rounded-t-2xl overflow-hidden">
                <Table className="w-full">
                  <THead className="bg-white">
                    {shiftTable?.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {shiftTable?.getRowModel().rows.map((row, ind) => (
                      <Tr
                        key={row.id}
                        className={classNames(!(ind % 2) && "bg-gray-100")}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td key={cell.id} className="px-3 py-2 text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded-b-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">Общая сумма:</span>
                  <span className="font-medium text-primary flex gap-x-1">
                    <FormattedNumber
                      value={cashboxs?.[0]?.amounts.reduce(
                        (sum, item) => sum + item.amount,
                        0
                      )}
                    />
                    {CurrencyCodeUZSText}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <Button onClick={onClose} disabled={createShiftPending}>
            Отменить
          </Button>
          <Button
            variant="solid"
            onClick={() => handleShiftCreate()}
            disabled={createShiftPending}
          >
            {createShiftPending ? "Открытие..." : "Открыть смену"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateShiftDialog;
