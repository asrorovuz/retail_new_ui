import { messages } from "@/app/constants/message.request";
import { useUpdateFiscalizationWhite } from "@/entities/settings/repository";
import { CatalogPackageSelector } from "@/features/catalog-selector";
import type { Package } from "@/features/modals/model";
import classNames from "@/shared/lib/classNames";
import {
    showErrorLocalMessage,
    showErrorMessage,
    showSuccessMessage,
} from "@/shared/lib/showMessage";
import { Button, Card, Dialog, Input, Select, Switcher } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import { Controller, useForm, type FieldError } from "react-hook-form";
import { CiCirclePlus } from "react-icons/ci";
import ProductSelectionTable from "./ProductSelectionTable";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import CatalogSelectorFiscal from "@/features/catalog-selector/ui/CatalogSelectorFiscal";
import { FiscalizedSection } from "@/features/fiscalized";

const FiscalizationSettings = () => {
    const [selectionDialogShow, setSelectionDialogShow] = useState(false);
    const [packageNames, setPackageNames] = useState<Package[] | []>();
    const [show, setShow] = useState(false);
    const { settings } = useSettingsStore((s) => s);
    const { mutate: fiscalizedWhite, isPending } =
        useUpdateFiscalizationWhite();

    const { handleSubmit, setValue, getValues, watch, clearErrors, control } =
        useForm<any>({
            defaultValues: {
                fiscalize_only_legal_items: false,
                fiscalize_only_default_item: false,
                fiscalization_default_items: null,
            },
        });

    const fiscalizeOnlyLegal = watch("fiscalize_only_legal_items");
    const defaultProductSwitcher = watch("fiscalize_only_default_item");

    useEffect(() => {
        if (!settings?.fiscalization_settings) return;

        const item = settings.fiscalization_settings;
        const defaultItem = item.fiscalization_default_item;

        setValue(
            "fiscalize_only_legal_items",
            !!item.fiscalize_only_legal_items,
        );
        setValue(
            "fiscalize_only_default_item",
            !!item.fiscalize_only_default_item,
        );

        setValue("fiscalization_default_items", {
            product_name: defaultItem?.product_name ?? null,
            catalog: defaultItem?.catalog_code ?? null,
            package: defaultItem?.package_code ?? null,
            nds_rate: defaultItem?.nds_rate ?? null,
        });
    }, [settings, setValue]);

    const onSubmit = () => {
        const data = getValues();

        // 🔹 Validation faqat kerak bo‘lganda
        if (data.fiscalize_only_default_item) {
            const item = data.fiscalization_default_items;

            if (!item?.product_name) {
                showErrorLocalMessage("Название продукта обязательно");
                return;
            }

            if (!item?.catalog) {
                showErrorLocalMessage("ИКПУ код обязателен");
                return;
            }

            if (!item?.package) {
                showErrorLocalMessage("Код упаковки обязателен");
                return;
            }
        }

        const payload = {
            fiscalize_only_legal_items: data.fiscalize_only_legal_items,
            fiscalize_only_default_item: data.fiscalize_only_default_item,

            // ❗ MUHIM QISM
            fiscalization_default_item: {
                product_name: data.fiscalization_default_items.product_name,
                nds_rate: data.fiscalization_default_items.nds_rate ?? 0,
                catalog_code:
                    typeof data.fiscalization_default_items.catalog === "string"
                        ? data.fiscalization_default_items.catalog
                        : data.fiscalization_default_items.catalog.class_code,
                package_code:
                    typeof data.fiscalization_default_items.package === "string"
                        ? data.fiscalization_default_items.package
                        : String(data.fiscalization_default_items.package.code),
            },
        };

        fiscalizedWhite(payload, {
            onSuccess() {
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    const FieldErrorMsg = ({
        name,
        defaultItemErrors,
    }: {
        name: string;
        defaultItemErrors?: Record<string, FieldError>;
    }) => {
        const error = defaultItemErrors?.[name];
        return error ? (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
        ) : null;
    };

    return (
        <>
            <Card className="p-3 rounded-lg bg-white w-full select-none">
                <h2 className="text-lg font-semibold text-slate-800 mb-5">
                    Настройки фискализации
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3">
                            <Switcher
                                checked={fiscalizeOnlyLegal}
                                onChange={(v) => {
                                    setValue("fiscalize_only_legal_items", v);
                                    if (v)
                                        setValue(
                                            "fiscalize_only_default_item",
                                            false,
                                        ); // ← qo'shildi
                                }}
                            />
                            <label className="text-base text-slate-700 select-none">
                                Фискализировать только белых товаров
                            </label>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Switcher
                                checked={defaultProductSwitcher}
                                onChange={(v) => {
                                    setValue("fiscalize_only_default_item", v);
                                    if (v)
                                        setValue(
                                            "fiscalize_only_legal_items",
                                            false,
                                        ); // ← qo'shildi
                                }}
                            />
                            <label className="text-base text-slate-700 select-none">
                                Фискализировать только продукт по умолчанию
                            </label>
                        </div>
                    </div>

                    <div
                        className={classNames("hidden", {
                            "grid grid-cols-[150px_1fr] gap-x-6 gap-y-4 items-start":
                                defaultProductSwitcher,
                        })}
                    >
                        <label
                            htmlFor="product-name"
                            className="text-slate-700 font-medium text-sm pt-2"
                        >
                            Название
                        </label>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="fiscalization_default_items.product_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="product-name"
                                            size="sm"
                                            placeholder="Введите название"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    )}
                                />

                                <Button
                                    variant="solid"
                                    size="sm"
                                    icon={<CiCirclePlus />}
                                    type="button"
                                    onClick={() => setSelectionDialogShow(true)}
                                >
                                    Выбрать
                                </Button>
                            </div>
                            <FieldErrorMsg name="product_name" />
                        </div>

                        <label
                            htmlFor="catalog-code"
                            className="text-slate-700 font-medium text-sm pt-2"
                        >
                            ИКПУ-код
                        </label>
                        <div className="flex flex-col">
                            <Controller
                                name={`fiscalization_default_items.catalog`}
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <CatalogSelectorFiscal
                                            {...field}
                                            placeholder={"Введите ИКПУ-код"}
                                            value={field.value}
                                            setValue={setValue}
                                            getValues={getValues}
                                            onChange={(opt) =>
                                                field.onChange(opt.value)
                                            }
                                            setPackageNames={setPackageNames}
                                        />
                                    );
                                }}
                            />
                        </div>

                        <label
                            htmlFor="package-code"
                            className="text-slate-700 font-medium text-sm pt-2"
                        >
                            Код упаковки
                        </label>
                        <div className="flex flex-col">
                            <Controller
                                name={`fiscalization_default_items.package`}
                                control={control}
                                render={({ field }) => (
                                    <CatalogPackageSelector
                                        {...field}
                                        options={packageNames || []}
                                        value={field?.value}
                                        setValue={setValue}
                                        placeholder={"Введите Ед. изм."}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <label
                            htmlFor="nds-rate"
                            className="text-slate-700 font-medium text-sm pt-2"
                        >
                            НДС ставка
                        </label>
                        <div className="flex flex-col">
                            <Controller
                                name="fiscalization_default_items.nds_rate"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="nds-rate"
                                        placeholder="Выберите ставку"
                                        isSearchable={false}
                                        size="sm"
                                        options={[
                                            { label: "Без НДС", value: null },
                                            { label: "0%", value: 0 },
                                            { label: "12%", value: 12 },
                                            { label: "15%", value: 15 },
                                        ]}
                                        value={
                                            [
                                                {
                                                    label: "Без НДС",
                                                    value: null,
                                                },
                                                { label: "0%", value: 0 },
                                                { label: "12%", value: 12 },
                                                { label: "15%", value: 15 },
                                            ].find(
                                                (opt) =>
                                                    opt.value === field.value,
                                            ) ?? null
                                        }
                                        onChange={(v) =>
                                            field.onChange(
                                                v?.value === null
                                                    ? null
                                                    : v?.value,
                                            )
                                        }
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-2 justify-end">
                        <Button
                            type="submit"
                            variant="solid"
                            size="sm"
                            loading={isPending}
                        >
                            Сохранить
                        </Button>
                    </div>

                    <Dialog
                        closable
                        isOpen={selectionDialogShow}
                        title={"Выбрать продукт"}
                        className={"max-w-[99vw] min-w-[99vw] h-[90vh]"}
                        onClose={() => setSelectionDialogShow(false)}
                    >
                        <ProductSelectionTable
                            setValue={setValue}
                            clearErrors={clearErrors}
                            setSelectionDialogShow={setSelectionDialogShow}
                        />
                    </Dialog>
                </form>
            </Card>
            <Card className="p-3 rounded-lg bg-white w-full select-none">
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Список кассовых аппаратов
                    </h2>
                    <Button
                        type="button"
                        onClick={() => setShow(true)}
                        size="sm"
                        variant="solid"
                    >
                        + Добавить ККМ
                    </Button>
                </div>
                <FiscalizedSection show={show} handleShow={setShow} />
            </Card>
        </>
    );
};

export default FiscalizationSettings;
