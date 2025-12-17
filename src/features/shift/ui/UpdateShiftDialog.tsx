import { useSettingsStore } from "@/app/store/useSettingsStore";
import {
  useCloseShiftApi,
  useShiftApi,
  useShiftOperationApi,
} from "@/entities/init/repository";
import { Button, Dialog, Input, Table } from "@/shared/ui/kit";
import FormattedNumber from "@/shared/ui/kit-pro/numeric-format/NumericFormat";
import Loading from "@/shared/ui/loading";
import {
  flexRender,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { CgMathPercent } from "react-icons/cg";
import { MdDiscount } from "react-icons/md";
import { paymentTypes } from "./CreateShiftDialog";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import MagnetSvg from "@/shared/ui/svg/MagnetSvg";
import { getCoreRowModel } from "@tanstack/react-table";
import THead from "@/shared/ui/kit/Table/THead";
import Th from "@/shared/ui/kit/Table/Th";
import Tr from "@/shared/ui/kit/Table/Tr";
import TBody from "@/shared/ui/kit/Table/TBody";
import Td from "@/shared/ui/kit/Table/Td";
import { FileNotFoundSvg } from "@/shared/ui/svg";
import TFoot from "@/shared/ui/kit/Table/TFoot";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
};

type BalanceItem = {
  type: number;
  amount: string; // majburiy maydon
  expected: number;
  difference: number;
};

export type ShiftUpdateFormData = {
  balances: BalanceItem[];
};

const UpdateShiftDialog = ({ isOpen, onClose }: PropsType) => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ShiftUpdateFormData>({
    defaultValues: {
      balances: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "balances",
  });

  const watchedBalances = watch("balances");

  const { activeShift: shift, setActiveShift } = useSettingsStore();
  const { data: shiftOperations, isPending: isShiftOperationsPending } =
    useShiftOperationApi(shift?.id ?? null, isOpen);
  const { data: activeShift, isPending } = useShiftApi(isOpen);
  const { mutate: closeShiftMutate, isPending: isClosing } = useCloseShiftApi();
  
  const columns: ColumnDef<(typeof fields)[0]>[] = useMemo(
    () => [
      {
        header: "Типы платежей",
        size: 100,
        cell: (info) => {
          const item = info.row.original;
          const paymentType =
            paymentTypes[item.type as keyof typeof paymentTypes];
          return (
            <div className="flex justify-start">
              <img
                src={paymentType}
                alt={String(item.type)}
                className="w-10 h-6 object-contain"
              />
            </div>
          );
        },
        footer: () => <div className="text-normal text-sm px-4 py-2">Итог</div>,
      },
      {
        header: "Начало",
        size: 100,
        cell: (info) => {
          const item = info.row.original;
          const openingBalance =
            activeShift?.cashboxes_balance_opening?.balances?.find(
              (b) => b.type === item.type
            );
          return (
            <div className="text-sm">
              <FormattedNumber value={openingBalance?.amount ?? 0} />
            </div>
          );
        },
        footer: () => {
          const total =
            shiftOperations?.shift_contract.cashboxes_balance_opening
              ?.total?.[0]?.amount ?? 0;
          return (
            <div className="text-normal text-sm px-4 py-2">
              <FormattedNumber value={total} />
            </div>
          );
        },
      },
      {
        header: "Приход",
        size: 90,
        cell: (info) => {
          const item = info.row.original;
          const incoming = activeShift?.cashboxes_in_balance?.balances?.find(
            (b) => b.type === item.type
          );
          return (
            <div className="text-sm text-green-600">
              <FormattedNumber value={incoming?.amount ?? 0} />
            </div>
          );
        },
        footer: () => {
          const total =
            shiftOperations?.shift_contract.cashboxes_in_balance?.total?.[0]
              .amount ?? 0;
          return (
            <div className="text-normal text-sm px-4 py-2">
              <FormattedNumber value={total} />
            </div>
          );
        },
      },
      {
        header: "Расход",
        size: 90,
        cell: (info) => {
          const item = info.row.original;
          const outgoing = activeShift?.cashboxes_out_balance?.balances?.find(
            (b) => b.type === item.type
          );
          return (
            <div className="text-sm text-red-600">
              <FormattedNumber value={outgoing?.amount ?? 0} />
            </div>
          );
        },
        footer: () => {
          const total =
            shiftOperations?.shift_contract.cashboxes_out_balance?.total?.[0]
              .amount ?? 0;
          return (
            <div className="text-normal text-sm px-4 py-2">
              <FormattedNumber value={total} />
            </div>
          );
        },
      },
      {
        header: "Ожидается",
        size: 100,
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="text-sm font-medium">
              <FormattedNumber value={item?.expected ?? 0} />
            </div>
          );
        },
        footer: () => {
          const total =
            shiftOperations?.shift_contract.cashboxes_expected?.total?.[0]
              .amount ?? 0;
          return (
            <div className="text-normal text-sm px-4 py-2">
              <FormattedNumber value={total} />
            </div>
          );
        },
      },
      {
        header: "Фактически",
        size: 120,
        cell: (info) => {
          const index = info.row.index;
          const item = info.row.original;

          return (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Controller
                  control={control}
                  name={`balances.${index}.amount`}
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => {
                    // Qiymatni faqat verguldan keyingi 2 xonagacha kesib olish
                    const value =
                      field.value !== null &&
                      field.value !== undefined &&
                      field.value !== ""
                        ? String(Math.floor(Number(field.value) * 100) / 100)
                        : "0";

                    return (
                      <Input
                        placeholder="Сумма"
                        size="sm"
                        className="text-xs"
                        type="number"
                        value={value}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s/g, "");
                          field.onChange(val === "" ? "" : val);
                        }}
                        onFocus={() => {
                          // Focus bo'lganda errorni tozalash
                          if (errors.balances?.[index]?.amount) {
                            setValue(`balances.${index}.amount`, field.value);
                          }
                        }}
                      />
                    );
                  }}
                />

                <div
                  onClick={() => {
                    setValue(
                      `balances.${index}.amount`,
                      String(item?.expected),
                      {
                        shouldValidate: true, // errorni o'chirish
                        shouldDirty: true, // formani dirty qilib belgilash
                      }
                    );
                  }}
                  className="size-6 text-blue-500 cursor-pointer hover:text-blue-600 flex-shrink-0"
                >
                  <MagnetSvg />
                </div>
              </div>

              {errors.balances?.[index]?.amount && (
                <p className="text-xs text-red-600">
                  {errors.balances[index]?.amount?.message}
                </p>
              )}
            </div>
          );
        },
        footer: () => {
          const totalFact =
            watchedBalances?.reduce((acc, balance) => {
              const actual = parseFloat(balance.amount || "0");
              return acc + actual;
            }, 0) ?? 0;

          return (
            <div className="text-normal text-sm px-4 py-2">
              <FormattedNumber value={totalFact} />
            </div>
          );
        },
      },
      {
        header: "Разница",
        size: 90,
        cell: (info) => {
          const index = info.row.index;
          const difference = watchedBalances?.[index]?.difference || 0;
          const actual = parseFloat(watchedBalances?.[index]?.amount || "0");
          const expected = watchedBalances?.[index]?.expected || 0;
          const factosValue = watch(`balances.${index}.amount`);
          const isOverpayment = actual > expected;
          const isUnderpayment = actual < expected;

          return (
            <div
              className={`text-sm font-medium ${
                isUnderpayment
                  ? "text-red-600"
                  : isOverpayment
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              <FormattedNumber value={difference - Number(factosValue)} />
            </div>
          );
        },
        footer: () => {
          const totalDifference =
            watchedBalances?.reduce((acc, balance) => {
              const actual = parseFloat(balance.amount || "0");
              return acc + (balance.expected - actual);
            }, 0) ?? 0;

          return (
            <div className="text-normal text-sm px-4 py-2">
              <FormattedNumber value={totalDifference} />
            </div>
          );
        },
      },
    ],
    [register, errors, watchedBalances, activeShift, shiftOperations]
  );

  const onSubmit = (data: ShiftUpdateFormData) => {
    const cashboxes_balance_closing = data?.balances?.map((balance) => ({
      type: balance.type,
      amount: parseFloat(balance.amount),
      currency_code: 860,
    }));

    closeShiftMutate(
      { cashboxes_balance_closing },
      {
        onSuccess: () => {
          showSuccessMessage(
            messages.uz.SUCCESS_CLOSE_SHIFT,
            messages.ru.SUCCESS_CLOSE_SHIFT
          );
          onClose();
          setActiveShift(null);
        },
        onError: (error) => {
          showErrorMessage(error);
        },
      }
    );
  };

  const tableData = useMemo(() => {
    return fields;
  }, [fields]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    console.log(activeShift, shift, "activeShift");

    if(isOpen && !activeShift) {
      setActiveShift(null);
      return
    }
    
    if (isOpen && activeShift?.cashboxes_expected?.balances) {
      const initialValues = activeShift.cashboxes_expected.balances.map(
        (balance) => ({
          type: balance.type,
          amount: "0",
          expected: balance.amount,
          difference: balance.amount,
        })
      );
      reset({ balances: initialValues });
    }
  }, [isOpen, activeShift, reset]);

  useEffect(() => {
    if (watchedBalances) {
      watchedBalances.forEach((balance, index) => {
        const actual = parseFloat(balance.amount) || 0;
        const difference = balance.expected - actual;
        setValue(`balances.${index}.difference`, difference);
      });
    }
  }, [watchedBalances, setValue]);

  return (
    <Dialog
      width={"96vw"}
      isOpen={isOpen}
      onClose={onClose} //handleClose
      title={"Закрыть смену"}
    >
      <div className="h-[75vh]">
        <div className="overflow-hidden">
          {isPending && isShiftOperationsPending && (
            <div className="flex items-center justify-center py-16">
              <Loading />
            </div>
          )}
          {!activeShift && (
            <div className="py-24 text-center text-gray-500">
              Нет активной смены
            </div>
          )}

          {activeShift && (
            <div className="flex gap-4 mb-4">
              <div className="w-3/5 border border-gray-200 rounded-2xl p-4 grid grid-cols-2 gap-6">
                <div className="flex gap-x-4">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white">
                    <MdDiscount size={22} />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p>Чеки</p>
                    <p className="font-medium text-xl text-gray-800">
                      {shiftOperations?.sale_count ?? 0}
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-4">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="bg-white text-primary rounded-full">
                      <CgMathPercent size={22} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p>Продажа</p>
                    <p className="font-medium text-xl text-gray-800">
                      <FormattedNumber
                        value={
                          shiftOperations?.sale_price?.[0]?.amount.toFixed(2) ??
                          0
                        }
                      />
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-4">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="bg-white text-primary rounded-full">
                      <CgMathPercent size={22} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p>В долг</p>
                    <p className="font-medium text-xl text-gray-800">
                      <FormattedNumber
                        value={
                          shiftOperations?.sale_debts?.[0]?.amount.toFixed(2) ??
                          0
                        }
                      />
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-4">
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="bg-white text-primary rounded-full">
                      <CgMathPercent size={22} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p>Средний чек</p>
                    <p className="font-medium text-xl text-gray-800">
                      <FormattedNumber
                        value={
                          shiftOperations?.average_check?.amount?.toFixed(2) ??
                          0
                        }
                      />
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-2/5 flex justify-between flex-col gap-y-4">
                <div className="w-full flex flex-col items-center justify-center py-4 bg-blue-50 rounded-2xl">
                  <p>Приход</p>
                  <p className="font-medium text-xl text-gray-800">
                    <FormattedNumber
                      value={
                        shiftOperations?.shift_contract.cashboxes_in_balance.total?.[0]?.amount.toFixed(
                          2
                        ) ?? 0
                      }
                    />
                  </p>
                </div>
                <div className="w-full flex flex-col items-center justify-center py-4 bg-blue-50 rounded-2xl">
                  <p>Расход</p>
                  <p className="font-medium text-xl text-gray-800 mt-1">
                    <FormattedNumber
                      value={
                        shiftOperations?.shift_contract?.cashboxes_out_balance?.total?.[0]?.amount.toFixed(
                          2
                        ) ?? 0
                      }
                    />
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="mb-4 relative" onSubmit={handleSubmit(onSubmit)}>
            {activeShift && (
              <div className="flex-1 h-[36vh] overflow-auto border border-gray-200 rounded-2xl">
                <Table overflow={false} compact={true}>
                  <THead className="sticky top-0">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr className="bg-white" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className="text-start"
                            style={{
                              width: header.getSize(),
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {!activeShift ? (
                      <Tr>
                        <Td
                          colSpan={columns.length}
                          className="py-12 text-center"
                        >
                          <div className="flex justify-center items-center flex-col">
                            <FileNotFoundSvg />
                            <p className="text-gray-500 mt-2">
                              Операций не было.
                            </p>
                          </div>
                        </Td>
                      </Tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <Tr key={row.id} className="hover:bg-gray-100">
                          {row.getVisibleCells().map((cell) => (
                            <Td key={cell.id} className="py-2 px-4">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Td>
                          ))}
                        </Tr>
                      ))
                    )}
                  </TBody>
                  <TFoot>
                    {table.getFooterGroups().map((footerGroup) => (
                      <Tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                          <Td className="text-start" key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                                )}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </TFoot>
                </Table>
              </div>
            )}

            <div className="fixed right-4 bottom-2 flex justify-end gap-2 mt-4 bg-white py-2">
              <Button type="button" onClick={onClose}>
                Отменить
              </Button>
              <Button type="submit" disabled={isClosing} variant="solid">
                {isClosing ? "Закрытие..." : "Закрыть смену"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateShiftDialog;
