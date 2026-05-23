import { messages } from "@/app/constants/message.request";
import { useSettingsApi } from "@/entities/init/repository";
import { useUpdateSettings } from "@/entities/settings/repository";
import i18n from "@/app/config/i18n";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import {
    Button,
    Checkbox,
    Form,
    FormItem,
    Input,
    // Select,
    Switcher,
} from "@/shared/ui/kit";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const LanguageOptions = [
    { label: "O'zbekcha", value: "uz" },
    { label: "Русский", value: "ru" },
];

const OtherSettings = () => {
    const { data: settingsData } = useSettingsApi();
    const { mutate: updateSettings, isPending } = useUpdateSettings();

    const form = useForm();

    const onSubmit = async (values: any) => {
        const lang = values.lang?.value ?? "ru";
        updateSettings(
            {
                ...settingsData,
                lang,
                organization_inn: values.organization_inn ?? "",
                enable_create_unknown_product:
                    values.enable_create_unknown_product,
                fiscalization_enabled: values.fiscalization_enabled,
            },
            {
                onSuccess() {
                    i18n.changeLanguage(lang);
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
                lang:
                    LanguageOptions.find(
                        (o) => o.value === settingsData.lang,
                    ) ?? null,
                organization_inn: settingsData.organization_inn ?? "",
                enable_create_unknown_product:
                    settingsData.enable_create_unknown_product ?? false,
                fiscalization_enabled:
                    settingsData.fiscalization_enabled ?? false,
            });
        }
    }, [settingsData]);

    return (
        <div className="p-3 rounded-lg bg-white w-full">
            <FormProvider {...form}>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* <div className="bg-white rounded-lg border p-4 mb-4">
                        <h3 className="text-base font-medium mb-4">Язык</h3>
                        <Controller
                            name="lang"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem
                                    label="Язык интерфейса"
                                    className="mb-0"
                                >
                                    <Select
                                        {...field}
                                        options={LanguageOptions}
                                        value={field.value}
                                        isSearchable={false}
                                        getOptionLabel={(o) => o.label}
                                        getOptionValue={(o) => o.value}
                                        placeholder="Выбрать"
                                        className="border border-slate-300 rounded-xl text-sm"
                                    />
                                </FormItem>
                            )}
                        />
                    </div> */}

                    <div className="bg-white rounded-lg border p-4 mb-4">
                        <h3 className="text-base font-medium mb-4">
                            Организация
                        </h3>
                        <Controller
                            name="organization_inn"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem
                                    label="ИНН организации"
                                    className="mb-0"
                                >
                                    <Input
                                        {...field}
                                        placeholder="Введите ИНН"
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-white rounded-lg border p-4 mb-4">
                        <h3 className="text-base font-medium mb-4">Прочие</h3>
                        <Controller
                            name="enable_create_unknown_product"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex items-center gap-x-2 py-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Включить создание неизвестного товара
                                    </label>
                                    <Switcher
                                        {...field}
                                        checked={field.value}
                                    />
                                </div>
                            )}
                        />
                        <div className="flex items-center space-x-3 py-2">
                            <Controller
                                name="fiscalization_enabled"
                                control={form.control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value}
                                        onChange={field.onChange}
                                    >
                                        Фискализация
                                    </Checkbox>
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

export default OtherSettings;
