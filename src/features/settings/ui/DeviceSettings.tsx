import { messages } from "@/app/constants/message.request";
import { usePrinterApi, useSettingsApi } from "@/entities/init/repository";
import { useUpdateSettings } from "@/entities/settings/repository";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Form, FormItem, Select, Switcher } from "@/shared/ui/kit";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const ReceiptSizeOptions = [
    { type: "80mm", value: "80" },
    { type: "58mm", value: "58" },
];

const DeviceSettings = () => {
    const { data: settingsData } = useSettingsApi();
    const { data: printerData = [] } = usePrinterApi();
    const { mutate: updateSettings, isPending } = useUpdateSettings();

    const form = useForm();

    const onSubmit = async (values: any) => {
        updateSettings(
            {
                ...settingsData,
                printer_name: values.printer_name?.value ?? null,
                receipt_size: values.receipt_size?.value ?? "80",
                auto_print_receipt: values.auto_print_receipt,
            },
            {
                onSuccess() {
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );
                },
                onError(err) {
                    showErrorMessage(err);
                },
            },
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
                auto_print_receipt: settingsData.auto_print_receipt ?? false,
            });
        }
    }, [settingsData]);

    return (
        <div className="p-3 rounded-lg bg-white w-full">
            <FormProvider {...form}>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="bg-white rounded-lg border p-4 mb-4">
                        <h3 className="text-base font-medium mb-4">
                            Настройки печати
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="printer_name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem label="Принтер" className="mb-0">
                                        <Select
                                            {...field}
                                            options={[
                                                {
                                                    type: "Не требуется",
                                                    value: "",
                                                },
                                                ...(printerData.map((i) => ({
                                                    type: i,
                                                    value: i,
                                                })) ?? []),
                                            ]}
                                            value={field.value}
                                            isSearchable={false}
                                            getOptionLabel={(o) => o.type}
                                            getOptionValue={(o) => o.value}
                                            placeholder="Выбрать"
                                            className="border border-slate-300 rounded-xl text-sm"
                                        />
                                    </FormItem>
                                )}
                            />
                            <Controller
                                name="receipt_size"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem
                                        label="Размер чека"
                                        className="mb-0"
                                    >
                                        <Select
                                            {...field}
                                            options={ReceiptSizeOptions}
                                            value={field.value}
                                            isSearchable={false}
                                            getOptionLabel={(o) => o.type}
                                            getOptionValue={(o) => o.value}
                                            placeholder="Выбрать"
                                            className="border border-slate-300 rounded-xl text-sm"
                                        />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mt-4">
                            <Controller
                                name="auto_print_receipt"
                                control={form.control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-x-2 py-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Автоматическая распечатать
                                        </label>
                                        <Switcher
                                            {...field}
                                            checked={field.value}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="solid"
                            size="sm"
                            loading={isPending}
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

export default DeviceSettings;
