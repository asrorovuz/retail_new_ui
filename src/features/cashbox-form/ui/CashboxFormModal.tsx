import { paymentTypes, type CashboxType } from "@/@types/cashbox";
import { messages } from "@/app/constants/message.request";
import {
  CurrencyCodeUZS,
  CurrencyCodeUZSText,
  CurrencyRateUZS,
  PaymentTypeCashCode,
  PaymentTypeCashText,
  paymentTypeList,
} from "@/app/constants/paymentType";
import {
  useCashboxByIdApi,
  useCreateCashExpense,
  useCreateCashIn,
  useCreateCashOut,
  useOperationCategoryApi,
  useUpdateCashExpense,
  useUpdateCashIn,
  useUpdateCashOut,
} from "@/entities/cashbox/repository";
import { useCurrancyApi } from "@/entities/products/repository";
import classNames from "@/shared/lib/classNames";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import {
  Button,
  DatePicker,
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
} from "@/shared/ui/kit";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const CashboxFormModal = ({
  cashId,
  isOpen,
  type,
  onCloseModal,
  cashbox,
  modalType = "add",
}: {
  cashId?: number | null;
  isOpen: boolean;
  type: number;
  onCloseModal: () => void;
  cashbox: CashboxType[];
  modalType?: "add" | "edit";
}) => {
  const { data: categoryData } = useOperationCategoryApi();
  const { data: currencies } = useCurrancyApi();
  const { data: cashboxDataById } = useCashboxByIdApi(
    cashId ?? null,
    type,
    modalType === "edit"
  );
  const { mutate: createCashInMutate, isPending: isCashInPending } =
    useCreateCashIn();
  const { mutate: createCashOutMutate, isPending: isCashOutPending } =
    useCreateCashOut();
  const { mutate: createCashExpenseMutate, isPending: isCashExpensePending } =
    useCreateCashExpense();
  const { mutate: updateCashInMutate, isPending: isUpdateCashInPending } =
    useUpdateCashIn();
  const { mutate: updateCashOutMutate, isPending: isUpdateCashOutPending } =
    useUpdateCashOut();
  const {
    mutate: updateCashExpenseMutate,
    isPending: isUpdateCashExpensePending,
  } = useUpdateCashExpense();

  const { control, handleSubmit, reset } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "amounts",
    control,
  });

  const filterCurrencies = currencies?.filter((i) => i.is_active);

  const handleFocusAction = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  const createMutateFunction =
    type === 1
      ? createCashInMutate
      : type === 2
      ? createCashOutMutate
      : createCashExpenseMutate;
  const updateMutateFunction =
    type === 1
      ? updateCashInMutate
      : type === 2
      ? updateCashOutMutate
      : updateCashExpenseMutate;

  const onSubmit = (data: any) => {
    const payload = {
      date: data.date ? dayjs(data.date).format("YYYY-MM-DD HH:mm:ss") : null,
      cash_box_id: data.cashbox?.id || null,
      category_id: data?.expenseCategory?.id || null,
      amounts: data?.amounts?.map((amount: any) => ({
        type: amount?.type.id || amount?.type,
        amount: amount.amount,
        currency_code: amount?.currency?.code,
      })),
      notes: data.notes || "",
    };

    if (modalType === "edit") {

      updateMutateFunction(
        { id: cashboxDataById?.id, payload },
        {
          onSuccess: () => {
            showSuccessMessage(
              messages.uz.SUCCESS_MESSAGE,
              messages.ru.SUCCESS_MESSAGE
            );
            onCloseModal();
          },
          onError: (err) => {
            showErrorMessage(err);
          },
        }
      );
    } else {
      createMutateFunction(payload, {
        onSuccess: () => {
          showSuccessMessage(
            messages.uz.SUCCESS_MESSAGE,
            messages.ru.SUCCESS_MESSAGE
          );
          onCloseModal();
        },
        onError: (err) => {
          showErrorMessage(err);
        },
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset({
        date: new Date(),
        cashbox: cashbox?.[0] ?? null,
        expenseCategory: null,
        amounts: [
          {
            type: {
              id: PaymentTypeCashCode,
              text: PaymentTypeCashText,
            },
            amount: null,
            currency: {
              code: CurrencyCodeUZS,
              name: CurrencyCodeUZSText,
              rate: CurrencyRateUZS,
            },
          },
        ],
        notes: "",
      });
      return;
    }

    if (modalType === "edit") {
      if (!cashboxDataById) return; // ⛔ data kelmaguncha kut

      const selectedCashbox = cashbox.find(
        (cb) => cb.id === cashboxDataById.cash_box?.id
      );

      reset({
        date: cashboxDataById.date
          ? dayjs(cashboxDataById.date, "DD-MM-YYYY").toDate()
          : new Date(),
        cashbox: selectedCashbox ?? null,
        expenseCategory: null,
        amounts: cashboxDataById.amounts,
        notes: cashboxDataById.notes || "",
      });
    } else {
      // ➕ add mode
      reset({
        date: new Date(),
        cashbox: cashbox?.[0] ?? null,
        expenseCategory: null,
        amounts: [
          {
            type: {
              id: PaymentTypeCashCode,
              text: PaymentTypeCashText,
            },
            amount: null,
            currency: {
              code: CurrencyCodeUZS,
              name: CurrencyCodeUZSText,
              rate: CurrencyRateUZS,
            },
          },
        ],
        notes: "",
      });
    }
  }, [isOpen, modalType, cashboxDataById, cashbox, reset]);

  return (
    <Dialog
      width={640}
      isOpen={!!type && isOpen}
      onClose={onCloseModal}
      title="Касса"
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-h-[70vh] overflow-y-auto">
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState }) => (
              <FormItem
                label={"Дата"}
                invalid={Boolean(fieldState.error)}
                asterisk={true}
              >
                <div className="relative">
                  <DatePicker
                    {...field}
                    size={"sm"}
                    className={"w-full"}
                    inputtable={true}
                    inputFormat={"DD-MM-YYYY"}
                    closePickerOnChange={true}
                    placeholder={"Выберите дату"}
                  />
                </div>
              </FormItem>
            )}
          />

          <Controller
            name="cashbox"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <FormItem label={"Касса"} asterisk={true}>
                  <Select
                    {...field}
                    size={"sm"}
                    options={cashbox}
                    className={"w-full"}
                    invalid={Boolean(fieldState.error)}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    placeholder={"Касса"}
                  />
                </FormItem>
              );
            }}
          />

          <Controller
            name="expenseCategory"
            control={control}
            render={({ field, fieldState }) => (
              <FormItem label={"Категория расходов"}>
                <Select
                  {...field}
                  size={"sm"}
                  isClearable
                  options={categoryData || []}
                  className={"w-full"}
                  invalid={Boolean(fieldState.error)}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder={"Категория расходов"}
                />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <span className={"text-[1.25rem] bold"}>Оплата</span>
            <Button
              type={"button"}
              size={"sm"}
              className={classNames("border-primary text-primary")}
              icon={<FaPlus />}
              onClick={() =>
                append(
                  {
                    type: {
                      id: PaymentTypeCashCode,
                      text: PaymentTypeCashText,
                    },
                    amount: null,
                    currency: {
                      code: CurrencyCodeUZS,
                      name: CurrencyCodeUZSText,
                      rate: CurrencyRateUZS,
                    },
                  },
                  { shouldFocus: false }
                )
              }
            />
          </div>

          <div className="mt-5">
            {fields?.map((field, index) => (
              <div key={field.id} className="flex items-center justify-between">
                <div className="flex items-center w-full">
                  <Controller
                    name={`amounts.${index}.type`}
                    control={control}
                    render={({ field }) => {
                      console.log(field, "5ws45");

                      return (
                        <FormItem>
                          <Select
                            {...field}
                            className={"w-[175px]"}
                            size={"sm"}
                            value={paymentTypeList?.find(
                              (i) => i.id === (field?.value?.id || field.value)
                            )}
                            options={paymentTypeList?.filter(
                              (i) => i.id !== (field?.value?.id || field.value)
                            )}
                            styles={{
                              control: () => ({
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                              }),
                            }}
                            getOptionLabel={(option) =>
                              paymentTypes[option?.id] ||
                              paymentTypes[option?.text]
                            }
                            getOptionValue={(option) => String(option.id)}
                          />
                        </FormItem>
                      );
                    }}
                  />
                  <Controller
                    name={`amounts.${index}.amount`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => {
                      return (
                        <FormItem
                          errorMessage={fieldState.error?.message}
                          className={"w-[calc(100%-350px)]"}
                        >
                          <Input
                            {...field}
                            type="number"
                            size={"sm"}
                            style={{ borderRadius: "0" }}
                            onFocus={handleFocusAction}
                            autoComplete="off"
                            placeholder={"Цена"}
                            value={field.value || ""}
                            invalid={Boolean(fieldState.error)}
                            onChange={(e) => field.onChange(+e.target.value)}
                            className="text-end"
                          />
                        </FormItem>
                      );
                    }}
                  />
                  <Controller
                    name={`amounts.${index}.currency`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Select
                            {...field}
                            className={"w-[175px]"}
                            isDisabled={filterCurrencies?.length! <= 1}
                            size={"sm"}
                            value={filterCurrencies?.find(
                              (i) => i.code === field.value?.code
                            )}
                            options={filterCurrencies?.filter(
                              (i) =>
                                i.is_active && i.code !== field?.value?.code
                            )}
                            styles={{
                              control: () => ({
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                              }),
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => String(option.code)}
                            placeholder={"Валюты"}
                          />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="flex gap-2 ml-2">
                  {fields.length > 1 && (
                    <FormItem>
                      <Button
                        variant="solid"
                        size="sm"
                        className={classNames("bg-red-500 hover:bg-red-600")}
                        icon={<FaTrashAlt />}
                        onClick={() => remove(index)}
                      />
                    </FormItem>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="mt-3"
                rows={2}
                textArea={true}
                placeholder="Примечание"
              />
            )}
          />
        </div>
        <div className="mt-5 flex justify-end gap-x-3">
          <Button type="button" onClick={onCloseModal}>
            Отменить
          </Button>
          <Button
            loading={
              isCashInPending ||
              isCashOutPending ||
              isCashExpensePending ||
              isUpdateCashInPending ||
              isUpdateCashOutPending ||
              isUpdateCashExpensePending
            }
            type="submit"
            variant="solid"
            className="self-end"
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </Dialog>
  );
};

export default CashboxFormModal;
