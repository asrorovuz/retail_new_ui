import { messages } from "@/app/constants/message.request";
import { usePrinterApi, useSettingsApi } from "@/entities/init/repository";
import {
  useUpdateSettings,
  useUpdateSettingsShift,
} from "@/entities/settings/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import {
  Button,
  Checkbox,
  Form,
  FormItem,
  Select,
  Switcher,
} from "@/shared/ui/kit";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const ReceiptSizeOptions = [
  { type: "80mm", value: "80" },
  { type: "58mm", value: "58" },
];

const SettingsPage = () => {
  const { data: settingsData } = useSettingsApi();
  const { data: printerData = [] } = usePrinterApi();
  const { mutate: updateSettings, isPending: settingsloading } =
    useUpdateSettings();
  const { mutate: updateSettingsShift, isPending: shiftLoading } =
    useUpdateSettingsShift();

  const form = useForm();

  function mapFormToPayload(data: any) {
    return {
      printer_name: data.printer_name?.value ?? null,
      receipt_size: data.receipt_size?.value ?? "80",
      fiscalization_enabled: data.fiscalization_enabled,
      auto_print_receipt: data.auto_print_receipt,
      enable_create_unknown_product: data.enable_create_unknown_product,
    };
  }

  function renderSelect(
    name: keyof any,
    label: string,
    options: any[],
    form: any,
    loading?: boolean
  ) {
    return (
      <Controller
        name={name as any}
        control={form.control}
        render={({ field }) => (
          <FormItem label={label} className="mb-0">
            <Select
              {...field}
              options={options}
              value={field.value}
              isSearchable={false}
              getOptionLabel={(o) => o.type}
              getOptionValue={(o) => o.value}
              placeholder="Выбрать"
              className="border border-gray-300 rounded-xl text-sm"
              isLoading={loading ?? false}
            />
          </FormItem>
        )}
      />
    );
  }

  function renderSwitch(name: keyof any, label: string, form: any) {
    return (
      <div className="flex items-center gap-x-2 py-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Controller
          name={name as any}
          control={form.control}
          render={({ field }) => <Switcher {...field} checked={field.value} />}
        />
      </div>
    );
  }

  const onSubmit = async (values: any) => {
    updateSettings(
      { ...settingsData, ...mapFormToPayload(values) },
      {
        onSuccess() {
          updateSettingsShift(
            { shift_enabled: values?.shift_enabled },
            {
              onSuccess() {
                showSuccessMessage(
                  messages.uz.SUCCESS_MESSAGE,
                  messages.ru.SUCCESS_MESSAGE
                );
              },
              onError(err) {
                showErrorMessage(err);
              },
            }
          );
        },
        onError(err) {
          showErrorMessage(err);
        },
      }
    );
  };

  useEffect(() => {
    if (settingsData) {
      form.reset({
        printer_name: settingsData.printer_name
          ? {
              type: settingsData.printer_name,
              value: settingsData.printer_name,
            }
          : null,
        receipt_size: settingsData.receipt_size
          ? {
              type: `${settingsData.receipt_size}mm`,
              value: `${settingsData.receipt_size}`,
            }
          : null,
        fiscalization_enabled: settingsData.fiscalization_enabled ?? false,
        auto_print_receipt: settingsData.auto_print_receipt ?? false,
        enable_create_unknown_product:
          settingsData.enable_create_unknown_product ?? false,
        shift_enabled: settingsData.shift?.shift_enabled ?? false,
      });
    }
  }, [settingsData]);

  return (
    <div className="p-6 rounded-3xl bg-white w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">
        Общие настройки
      </h2>

      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-x-5">
            <div className="bg-white rounded-lg border p-4 mb-4">
              <h3 className="text-lg font-medium mb-4">Настройки печати</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect(
                  "printer_name",
                  "Принтер",
                  [
                    { type: "Не требуется", value: "" },
                    ...(printerData.map((i) => ({
                      type: i,
                      value: i,
                    })) ?? {}),
                  ],
                  form
                )}
                {renderSelect(
                  "receipt_size",
                  "Размер чека",
                  ReceiptSizeOptions,
                  form
                )}
              </div>

              <div className="mt-4">
                {renderSwitch(
                  "auto_print_receipt",
                  "Автоматическая распечатать",
                  form
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">
                Функциональные настройки
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {renderSwitch("shift_enabled", "Смена", form)}
                {renderSwitch(
                  "enable_create_unknown_product",
                  "Включить создание неизвестного товара",
                  form
                )}

                <div className="flex items-center space-x-3">
                  <Controller
                    name="fiscalization_enabled"
                    render={({ field }) => (
                      <Checkbox checked={field.value} onChange={field.onChange}>
                        {"Фискализация"}
                      </Checkbox>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Кнопка сохранения */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="solid"
              loading={settingsloading || shiftLoading}
              className="min-w-[120px]"
            >
              Сохранить
            </Button>
          </div>
        </Form>
      </FormProvider>
    </div>
  );
};

export default SettingsPage;
