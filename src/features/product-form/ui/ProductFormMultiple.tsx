import {
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
    memo,
    type FC,
} from "react";
import { Button, Form, Input, Select } from "@/shared/ui/kit";
import {
    Controller,
    useFieldArray,
    FormProvider,
    useForm,
} from "react-hook-form";
import CategorySelect from "@/features/category/CategorySelect";
import ImageForm from "@/features/image-form";
import BarcodeForm from "@/features/barcode-form";
import {
    useCreateProduct,
    useUpdateAlertOn,
} from "@/entities/products/repository";
import {
    CatalogPackageSelector,
    CatalogSelector,
} from "@/features/catalog-selector";
import type { Package, PriceType } from "@/features/modals/model";
import { convertImageObjectsToBase64 } from "@/shared/lib/convertFilesToBase64";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import Empty from "@/shared/ui/kit-pro/empty/Empty";
import { FiPlusCircle } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useCreateregister } from "@/entities/revision/repository";

type MeasurementPackage = {
    id: number;
    name: string;
    amount: number;
};

interface Props {
    name: string;
    products: any;
    onRemove?: (index: number) => void;
    barcode: string | null;
    setBarcode: (val: string | null) => void;
    setProducts: any;
    catalogData: any;
    createEmptyProduct: (barcode?: string) => any;
}

const vatOptions = [
    { label: "БЕЗ НДС", value: null },
    { label: "0", value: 0 },
    { label: "6", value: 6 },
    { label: "12", value: 12 },
];

const legalOptions = [
    { value: true, label: "Белый" },
    { value: false, label: "Чёрный" },
];

// ✅ Har bir qator alohida memo komponentga ajratildi
// Bu — boshqa qatorlar o'zgarganda bu qator re-render bo'lmasligi uchun
const ProductRow = memo(
    ({
        field,
        index,
        name,
        control,
        setValue,
        getValues,
        barcode,
        packageNamesMap,
        measurmentsPackages,
        activePacage,
        optionMeasurement,
        onRemove,
        onAddPackage,
        onRemovePackage,
        onUpdatePackage,
        onSetActivePackage,
        onSetPackageNamesMap,
    }: any) => {
        return (
            <div key={field.id} className="border-t align-top flex">
                <div className="p-2 text-center w-[60px] border border-slate-300 border-t-0">
                    {index + 1}
                </div>

                {/* Название */}
                <div className="p-2 w-[200px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.name` as any}
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                type="text"
                                className="w-full"
                                size="sm"
                                autoComplete="off"
                                invalid={!!fieldState.error}
                                placeholder="Введите название товара"
                            />
                        )}
                    />
                </div>

                {/* Розничная цена */}
                <div className="p-2 w-[128px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.prices.0.amount` as any}
                        control={control}
                        rules={{
                            required: "Розничная цена обязательна к заполнению",
                            min: {
                                value: 1,
                                message: "Цена должна быть больше 0",
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                type="number"
                                autoComplete="off"
                                size="sm"
                                space={false}
                                invalid={!!fieldState.error}
                                placeholder="Сумма"
                                replaceLeadingZero
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Оптовая цена */}
                <div className="p-2 w-[128px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.prices.1.amount` as any}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                space={false}
                                autoComplete="off"
                                size="sm"
                                placeholder="Сумма"
                                replaceLeadingZero
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Закупочная */}
                <div className="p-2 w-[128px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.purchase_price.amount` as any}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                space={false}
                                autoComplete="off"
                                size="sm"
                                placeholder="Сумма"
                                replaceLeadingZero
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Остаток */}
                <div className="p-2 w-[128px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.remainder` as any}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                space={false}
                                autoComplete="off"
                                size="sm"
                                placeholder="Остаток"
                                replaceLeadingZero
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Мин остаток */}
                <div className="p-2 w-[128px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.alertOn` as any}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                space={false}
                                autoComplete="off"
                                size="sm"
                                placeholder="Мин. ост."
                                replaceLeadingZero
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Ед изм */}
                <div className="p-2 w-[120px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.measurement_name` as any}
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={optionMeasurement}
                                className="w-full"
                                size="sm"
                                isSearchable={false}
                                hideDropdownIndicator={true}
                                getOptionLabel={(option) => option?.label}
                                getOptionValue={(option) =>
                                    String(option?.value)
                                }
                                value={
                                    optionMeasurement?.find(
                                        (opt: any) => opt.value === field.value,
                                    ) ?? { label: "шт", value: "шт" }
                                }
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                                onChange={(option) =>
                                    field.onChange(option?.value ?? "шт")
                                }
                            />
                        )}
                    />
                </div>

                {/* Упаковка */}
                <div className="p-2 w-[280px] border border-slate-300 border-t-0 border-l-0">
                    <div className="flex flex-col gap-2">
                        {(measurmentsPackages[field.id] || []).map(
                            (pkg: any, ind: number) => (
                                <div
                                    key={pkg.id}
                                    className="flex gap-2 items-center"
                                >
                                    <Input
                                        size="sm"
                                        placeholder="Название"
                                        value={pkg.name}
                                        className="!w-[100px]"
                                        onChange={(e) =>
                                            onUpdatePackage(
                                                field.id,
                                                pkg.id,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Input
                                        size="sm"
                                        type="number"
                                        placeholder="Кол-во"
                                        value={pkg.amount}
                                        space={false}
                                        autoFocus={activePacage === field.id}
                                        onChange={(e) =>
                                            onUpdatePackage(
                                                field.id,
                                                pkg.id,
                                                "amount",
                                                +e.target.value,
                                            )
                                        }
                                        className="!w-[60px]"
                                    />
                                    {measurmentsPackages[field.id]?.length >
                                        1 && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="default"
                                            icon={
                                                <IoClose
                                                    color="red"
                                                    size={18}
                                                />
                                            }
                                            onClick={() => {
                                                onRemovePackage(
                                                    field.id,
                                                    pkg.id,
                                                );
                                                onSetActivePackage(null);
                                            }}
                                        />
                                    )}
                                    {!ind && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            icon={<FaPlus size={16} />}
                                            onClick={() => {
                                                onAddPackage(field.id);
                                                onSetActivePackage(field.id);
                                            }}
                                            variant="default"
                                        />
                                    )}
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* Категория */}
                <div className="p-2 w-[200px] border border-slate-300 border-t-0 border-l-0">
                    <CategorySelect
                        name={`${name}.${index}.category` as any}
                        control={control}
                        label="Категория"
                        width="w-full"
                        multi={true}
                        placeholder="Категория"
                    />
                </div>

                {/* Артикул */}
                <div className="p-2 w-[100px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.sku` as any}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                autoComplete="off"
                                size="sm"
                                space={false}
                                placeholder="Артикул"
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Код */}
                <div className="p-2 w-[100px] border border-slate-300 border-t-0 border-l-0">
                    <Controller
                        name={`${name}.${index}.code` as any}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                size="sm"
                                space={false}
                                placeholder="Код"
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Штрих-коды */}
                <div className="p-2 w-[350px] border border-slate-300 border-t-0 border-l-0">
                    <BarcodeForm
                        fieldName={`${name}.${index}.barcodes`}
                        barcode={barcode}
                        control={control}
                        setValue={setValue}
                        getValues={getValues}
                        multiplay={true}
                    />
                </div>

                {/* ИКПУ */}
                <div className="p-2 w-[450px] border border-slate-300 border-t-0 border-l-0 flex gap-x-2">
                    <Controller
                        name={`${name}.${index}.catalog_code` as any}
                        control={control}
                        render={({ field }) => (
                            <CatalogSelector
                                {...field}
                                fieldName={`${name}.${index}.catalog`}
                                isOpen={true}
                                placeholder="ИКПУ-код"
                                value={field.value}
                                setValue={setValue}
                                getValues={getValues}
                                onChange={(opt) =>
                                    field.onChange(opt ? opt.value : null)
                                }
                                setPackageNames={(packages) => {
                                    onSetPackageNamesMap(index, packages);
                                }}
                                width={"!w-[290px]"}
                                multiplay={true}
                                index={index}
                            />
                        )}
                    />
                    <Controller
                        name={`${name}.${index}.package_code` as any}
                        control={control}
                        render={({ field }) => (
                            <CatalogPackageSelector
                                {...field}
                                options={packageNamesMap[index] || []}
                                value={field.value}
                                setValue={setValue}
                                placeholder="Ед. изм."
                                onChange={field.onChange}
                                width={"!w-[170px]"}
                                index={index}
                            />
                        )}
                    />
                    <Controller
                        name={`${name}.${index}.vat_rate` as any}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={vatOptions}
                                isSearchable={false}
                                className="!w-[100px]"
                                placeholder="НДС"
                                getOptionLabel={(opt) =>
                                    typeof opt.value === "number"
                                        ? opt.label
                                        : "БЕЗ НДС"
                                }
                                size="sm"
                                getOptionValue={(opt) => String(opt.value)}
                                value={
                                    vatOptions.find(
                                        (opt) => opt.value === field.value,
                                    ) || vatOptions[0]
                                }
                                onChange={(opt) =>
                                    field.onChange(opt?.value ?? null)
                                }
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        width: "150px",
                                    }),
                                }}
                            />
                        )}
                    />
                </div>

                {/* Белый товар */}
                <div className="p-2 w-[120px] border border-t-0 border-l-0 border-slate-300">
                    <Controller
                        name={`${name}.${index}.is_legal` as any}
                        control={control}
                        defaultValue={true}
                        render={({ field }) => (
                            <Select
                                options={legalOptions}
                                size="sm"
                                isSearchable={false}
                                value={legalOptions.find(
                                    (opt) => opt.value === field.value,
                                )}
                                onChange={(opt) => field.onChange(opt?.value)}
                            />
                        )}
                    />
                </div>

                {/* Фото */}
                <div className="p-2 w-[60px] border border-t-0 border-l-0 border-slate-300 flex">
                    <ImageForm
                        extra={true}
                        width={"50px"}
                        fieldName={`${name}.${index}.images`}
                        control={control}
                    />
                </div>

                {/* Delete */}
                <div className="p-2 w-[60px] border border-t-0 border-l-0 border-slate-300 flex">
                    <Button
                        type="button"
                        variant="default"
                        icon={<IoClose size={22} />}
                        onClick={() => onRemove(index)}
                    />
                </div>
            </div>
        );
    },
);

ProductRow.displayName = "ProductRow";

const ProductFormMultiple: FC<Props> = ({
    name,
    onRemove,
    products,
    barcode,
    setBarcode,
    catalogData,
    createEmptyProduct,
}) => {
    const [packageNamesMap, setPackageNamesMap] = useState<
        Record<number, Package[]>
    >({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [measurmentsPackages, setMeasurmentPackages] = useState<
        Record<string, MeasurementPackage[]>
    >({});
    const [activePacage, setActivePackage] = useState<any>(null);

    const methods = useForm({ defaultValues: { products } });
    const lastAddedBarcodeRef = useRef<string | null>(null);

    const { mutate: createProduct } = useCreateProduct();
    const { mutate: alertOnUpdate } = useUpdateAlertOn();
    const { mutate: createRegister } = useCreateregister();
    const { wareHouseId } = useSettingsStore((s) => s);

    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name,
    });

    const remenderSubmit = useCallback(
        async (id: number | null, item: number) => {
            if (id && item > 0) {
                createRegister(
                    {
                        is_approved: true,
                        items: [
                            {
                                product_id: id,
                                warehouse_id: wareHouseId,
                                quantity: item,
                            },
                        ],
                        skip_active_shift_check: true,
                    },
                    { onError: console.log },
                );
            }
        },
        [createRegister, wareHouseId],
    );

    // ✅ useCallback — handlelar qayta yaratilmaydi
    const addPackage = useCallback((fieldId: string) => {
        setMeasurmentPackages((prev) => ({
            ...prev,
            [fieldId]: [
                ...(prev[fieldId] || []),
                { id: Date.now(), name: "", amount: 1 },
            ],
        }));
    }, []);

    const removePackage = useCallback((fieldId: string, id: number) => {
        setMeasurmentPackages((prev) => ({
            ...prev,
            [fieldId]: prev[fieldId]?.filter((p) => p.id !== id) || [],
        }));
    }, []);

    const updatePackage = useCallback(
        (
            fieldId: string,
            id: number,
            field: "name" | "amount",
            value: string | number,
        ) => {
            setMeasurmentPackages((prev) => ({
                ...prev,
                [fieldId]:
                    prev[fieldId]?.map((p) =>
                        p.id === id ? { ...p, [field]: value } : p,
                    ) || [],
            }));
        },
        [],
    );

    const handleSetPackageNamesMap = useCallback(
        (index: number, packages: Package[]) => {
            setPackageNamesMap((prev) => ({ ...prev, [index]: packages }));
        },
        [],
    );

    const handleRemove = useCallback(
        (index: number) => {
            const fieldId = fields[index].id;
            remove(index);
            setMeasurmentPackages((prev) => {
                const newState = { ...prev };
                delete newState[fieldId];
                return newState;
            });
            onRemove?.(index);
        },
        [fields, remove, onRemove],
    );

    const handleAddProduct = useCallback(() => {
        const newIndex = fields.length;
        append(createEmptyProduct());
        setMeasurmentPackages((prev) => ({
            ...prev,
            [newIndex]: [{ id: Date.now(), name: "", amount: 1 }],
        }));
        setTimeout(() => methods.setFocus(`products.${newIndex}.name` as any), 0);
    }, [fields.length, append, createEmptyProduct, methods]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const successfullyAdded: number[] = [];

        for (const [index, values] of data?.products?.entries()) {
            try {
                const images = await convertImageObjectsToBase64(
                    values?.images || [],
                    values?.images?.[0]?.img || "",
                );
                const prices = (values?.prices || []).map((p: PriceType) => ({
                    price_type_id: p?.price_type?.id ?? null,
                    amount: p?.amount ? +p?.amount : 0,
                    currency_code: p?.currency?.code ?? "",
                }));
                const productData = {
                    purchase_price: {
                        amount: Number(values?.purchase_price?.amount) ?? 0,
                        currency_code:
                            Number(values?.purchase_price?.currency?.code) ?? 0,
                    },
                    name: values?.name,
                    measurement_name: values?.measurement_name,
                    code: values?.code,
                    sku: values?.sku,
                    vat_rate: values?.vat_rate,
                    barcodes: values?.barcodes || [],
                    images,
                    prices,
                    is_legal: values?.is_legal,
                    category_id: values?.category?.id ?? null,
                    category_name: values?.category?.name ?? null,
                    package_measurements: (
                        measurmentsPackages[fields[index].id] || []
                    )
                        .map((p) => ({
                            name: p.name,
                            quantity: Number(p.amount) || 0,
                        }))
                        .filter((item) => !!item?.name),
                    catalog_code: values.catalog?.value
                        ? String(values?.catalog?.value)
                        : null,
                    catalog_name: values.catalog
                        ? values?.catalog?.label
                        : null,
                    package_code: values?.package?.code
                        ? String(values?.package?.code)
                        : null,
                    package_name: values.package
                        ? values?.package?.name_uz
                        : null,
                };

                await new Promise<void>((resolve) => {
                    createProduct(productData, {
                        onSuccess(res) {
                            if (values?.alertOn && wareHouseId) {
                                alertOnUpdate({
                                    warehouse_id: wareHouseId,
                                    product_id: res?.id,
                                    alert_on: +values?.alertOn || 0,
                                });
                            }
                            if (res?.id)
                                remenderSubmit(res?.id, +values?.remainder);
                            successfullyAdded.push(index);
                            resolve();
                        },
                        onError(err) {
                            showErrorMessage(err);
                            resolve();
                        },
                    });
                });
            } catch (err) {
                console.log("Error for product index", index, err);
            }
        }

        successfullyAdded.sort((a, b) => b - a).forEach((i) => remove(i));
        if (successfullyAdded.length > 0) {
            showSuccessMessage(
                messages.uz.SUCCESS_MESSAGE,
                messages.ru.SUCCESS_MESSAGE,
            );
        }
        setIsSubmitting(false);
    };

    /* 🔥 BARCODE LOGIC */
    // useEffect(() => {
    //     if (!barcode) return;

    //     // ✅ watch() o'rniga getValues() — subscription yo'q, re-render yo'q
    //     const currentProducts = methods.getValues("products");

    //     const isHasBarcode = currentProducts?.some((item: any) =>
    //         item.barcodes?.some((b: any) => b.value === barcode),
    //     );

    //     if (!isHasBarcode) {
    //         const catalog = catalogData?.[0];
    //         const newProduct = createEmptyProduct(barcode);
    //         if (catalog) {
    //             newProduct.name = catalog.name ?? "";
    //             newProduct.catalog_code = catalog?.class_code;
    //             newProduct.catalog_name = catalog?.class_name;
    //             newProduct.catalog = {
    //                 label: catalog?.class_name,
    //                 value: catalog?.class_code,
    //                 data: catalog,
    //             };
    //         }
    //         append(newProduct);
    //         setBarcode(null);
    //     }
    // }, [barcode, catalogData]);
    /* 🔥 BARCODE LOGIC — bosqich 1: qatorni darhol qo'sh */
    useEffect(() => {
        if (!barcode) return;

        const currentProducts = methods.getValues("products");
        const isHasBarcode = currentProducts?.some((item: any) =>
            item.barcodes?.some((b: any) => b.value === barcode),
        );

        if (isHasBarcode) {
            setBarcode(null);
            return;
        }

        const newIndex = currentProducts?.length ?? 0;
        lastAddedBarcodeRef.current = barcode;
        append(createEmptyProduct(barcode));
        setBarcode(null);
        setTimeout(() => methods.setFocus(`products.${newIndex}.name` as any), 0);
    }, [barcode, append, createEmptyProduct, methods, setBarcode]);

    /* 🔥 BARCODE LOGIC — bosqich 2: catalogData kelganda qatorni yangilash */
    useEffect(() => {
        if (!catalogData?.length || !lastAddedBarcodeRef.current) return;

        const currentProducts = methods.getValues("products");
        const rowIndex = currentProducts?.findIndex((item: any) =>
            item.barcodes?.some((b: any) => b.value === lastAddedBarcodeRef.current),
        );

        if (rowIndex === undefined || rowIndex === -1) {
            lastAddedBarcodeRef.current = null;
            return;
        }

        const catalog = catalogData[0];
        if (!methods.getValues(`products.${rowIndex}.name` as any)) {
            methods.setValue(`products.${rowIndex}.name` as any, catalog.name ?? catalog.class_name ?? "");
        }
        methods.setValue(`products.${rowIndex}.catalog_code` as any, catalog.class_code || catalog.code || null);
        methods.setValue(`products.${rowIndex}.catalog_name` as any, catalog.class_name || catalog.name || null);
        methods.setValue(`products.${rowIndex}.catalog` as any, {
            label: catalog.class_name || catalog.name,
            value: catalog.class_code || catalog.code,
            data: catalog,
        });

        lastAddedBarcodeRef.current = null;
    }, [catalogData, methods]);

    useEffect(() => {
        setMeasurmentPackages((prev) => {
            const updated = { ...prev };
            fields.forEach((field) => {
                if (!updated[field.id]) {
                    updated[field.id] = [
                        { id: Date.now(), name: "", amount: 1 },
                    ];
                }
            });
            return updated;
        });
    }, [fields]);

    const optionMeasurement = useMemo(
        () => [
            { label: "шт", value: "шт" },
            { label: "кг", value: "кг" },
            { label: "л", value: "л" },
            { label: "м", value: "м" },
            { label: "кв м", value: "кв м" },
        ],
        [],
    );

    return (
        <FormProvider {...methods}>
            <Form
                onSubmit={methods.handleSubmit(onSubmit)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        e.isPropagationStopped();
                    }
                }}
            >
                <div className="bg-white flex justify-end gap-x-2 pb-3 sticky top-0">
                    <Button
                        type="button"
                        size="sm"
                        icon={<FiPlusCircle />}
                        onClick={handleAddProduct}
                        variant="default"
                    >
                        Добавить новую строку.
                    </Button>
                    <Button
                        disabled={fields?.length === 0}
                        loading={isSubmitting}
                        size="sm"
                        type="submit"
                        variant="solid"
                    >
                        Сохранить
                    </Button>
                </div>

                <div className="rounded-lg overflow-auto">
                    <div className="w-max text-xs text-slate-700 font-semibold overflow-x-auto">
                        {/* Header */}
                        <div className="sticky top-0 flex items-center">
                            <div className="p-2 text-nowrap text-center w-[60px] border border-t-2 border-l-2 border-slate-200 rounded-tl-lg">
                                №
                            </div>
                            <div className="p-2 text-nowrap w-[200px] border border-slate-300 border-l-0 flex justify-between items-center">
                                Название{" "}
                                <span className="text-xs">
                                    <FaPlus />
                                </span>
                            </div>
                            <div className="p-2 text-nowrap w-[128px] border border-slate-300 border-l-0">
                                Розн. цена
                            </div>
                            <div className="p-2 text-nowrap w-[128px] border border-slate-300 border-l-0">
                                Опт. цена
                            </div>
                            <div className="p-2 text-nowrap w-[128px] border border-slate-300 border-l-0">
                                Зак. цена
                            </div>
                            <div className="p-2 text-nowrap w-[128px] border border-slate-300 border-l-0">
                                Остаток
                            </div>
                            <div className="p-2 text-nowrap w-[128px] border border-slate-300 border-l-0">
                                Оповещения
                            </div>
                            <div className="p-2 text-nowrap w-[120px] border border-slate-300 border-l-0">
                                Ед. изм.
                            </div>
                            <div className="p-2 text-nowrap w-[280px] border border-slate-300 border-l-0">
                                Упаковка
                            </div>
                            <div className="p-2 text-nowrap w-[200px] border border-slate-300 border-l-0">
                                Категория
                            </div>
                            <div className="p-2 text-nowrap w-[100px] border border-slate-300 border-l-0">
                                Артикул
                            </div>
                            <div className="p-2 text-nowrap w-[100px] border border-slate-300 border-l-0">
                                Код
                            </div>
                            <div className="p-2 text-nowrap w-[350px] border border-slate-300 border-l-0">
                                Штрих-код
                            </div>
                            <div className="p-2 text-nowrap w-[450px] border border-slate-300 border-l-0">
                                IKPU KOD
                            </div>
                            <div className="p-2 text-nowrap w-[120px] border border-slate-300 border-l-0">
                                Описание товара
                            </div>
                            <div className="p-2 text-nowrap w-[120px] border border-slate-300 border-l-0 rounded-tr-xl">
                                Фото
                            </div>
                        </div>

                        <div className="h-[45vh] overflow-y-auto">
                            {fields?.length ? (
                                fields.map((field, index) => (
                                    <ProductRow
                                        key={field.id}
                                        field={field}
                                        index={index}
                                        name={name}
                                        control={methods.control}
                                        setValue={methods.setValue}
                                        getValues={methods.getValues}
                                        barcode={barcode}
                                        packageNamesMap={packageNamesMap}
                                        measurmentsPackages={
                                            measurmentsPackages
                                        }
                                        activePacage={activePacage}
                                        optionMeasurement={optionMeasurement}
                                        onRemove={handleRemove}
                                        onAddPackage={addPackage}
                                        onRemovePackage={removePackage}
                                        onUpdatePackage={updatePackage}
                                        onSetActivePackage={setActivePackage}
                                        onSetPackageNamesMap={
                                            handleSetPackageNamesMap
                                        }
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center py-5 border border-t-0 border-slate-300">
                                    <Empty size={120} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Form>
        </FormProvider>
    );
};

export default ProductFormMultiple;
