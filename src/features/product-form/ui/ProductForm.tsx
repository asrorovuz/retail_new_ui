import { useEffect, useMemo, useRef, useState, type FC } from "react";
import type { ProductFormType } from "../model";
import {
  Button,
  // Checkbox,
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
  Switcher,
} from "@/shared/ui/kit";
import { Controller, useForm } from "react-hook-form";
import type {
  Package,
  PriceType,
  ProductDefaultValues,
} from "@/features/modals/model";
import {
  useCreateProduct,
  // useCreateregister,
  useUpdateAlertOn,
  useUpdateProduct,
} from "@/entities/products/repository";
import CategorySelect from "@/features/category/CategorySelect";
import {
  CatalogPackageSelector,
  CatalogSelector,
} from "@/features/catalog-selector";
import type { VatRateSelectorOption } from "@/@types/products";
import ImageForm from "@/features/image-form";
import BarcodeForm from "@/features/barcode-form/ui/BarcodeForm";
import { convertImageObjectsToBase64 } from "@/shared/lib/convertFilesToBase64";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import { useSettingsStore } from "@/app/store/useSettingsStore";
import { useDraftSaleStore } from "@/app/store/useSaleDraftStore";
import { useUpdatePurchasedPriceApi } from "@/entities/purchase/repository";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import NavigateButton from "@/shared/ui/kit-pro/navigate-button/NavigateButton";
import { IoMdClose } from "react-icons/io";
import { useCreateregister } from "@/entities/revision/repository";

type MeasurementPackage = {
  id: number;
  name: string;
  amount: number;
};

const ProductForm: FC<ProductFormType> = ({
  type,
  productId,
  pageType,
  isOpen,
  catalogCode,
  setCatalogCode,
  catalogLoading,
  setIsOpen,
  defaultValue,
  setBarcode,
  barcode,
  setProductId,
  catalogData,
  setDefaultValues,
}) => {
  const { handleSubmit, control, getValues, setValue, reset } =
    useForm();
  const lastAddedBarcodeIndex = useRef<number | null>(null);
  const isCatalogApplied = useRef(false);
  const [remainder, setRemainder] = useState<number>(defaultValue?.state || 0);
  const [alertOn, setAlertOn] = useState<string | number>(0);
  // const [isShow, setIsShow] = useState(false);
  const [packageNames, setPackageNames] = useState<Package[] | []>();
  const [measurmentsPackages, setMeasurmentPackages] = useState<
    MeasurementPackage[]
  >([
    { id: Date.now(), name: "", amount: 1 }, // default bitta
  ]);

  const { wareHouseId } = useSettingsStore((s) => s);
  const { updateDraftSaleItem, draftSales } = useDraftSaleStore();
  const activeDraftSale = draftSales?.find((s) => s.isActive);

  const { mutate: createProduct, isPending: createProductPending } =
    useCreateProduct();
  const { mutate: updateProduct, isPending: updateLoading } =
    useUpdateProduct();
  const { mutate: alertOnUpdate } = useUpdateAlertOn();
  const { mutate: createRegister } = useCreateregister();
  const { mutate: updatepurchasePrice } = useUpdatePurchasedPriceApi();

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

  const onClose = () => {
    setBarcode(null);
    setAlertOn(0);
    setRemainder(0);
    // setIsShow(false);
    setIsOpen(false);
    setDefaultValues(null);
    setPackageNames([]);
    reset();
    if (setProductId) {
      setProductId(null);
    }
    if (setCatalogCode) {
      setCatalogCode(null);
    }
  };

  // const handleClick = (value: boolean) => {
  //   setIsShow(value);
  // };

  const options = useMemo<VatRateSelectorOption[]>(
    () => [
      { label: "БЕЗ НДС", value: null },
      { label: "0", value: 0 },
      { label: "12", value: 12 },
    ],
    [],
  );

  const remenderSubmit = async (id: number | null) => {
    if (id && remainder > 0) {
      const reminderData = {
        is_approved: true,
        items: [
          {
            product_id: id,
            warehouse_id: wareHouseId,
            quantity: remainder,
          },
        ],
      };

      createRegister(reminderData, {
        onError(error) {
          console.log(error);
        },
      });
    }
  };

  const addPackage = () => {
    setMeasurmentPackages((prev) => [
      ...prev,
      { id: Date.now(), name: "", amount: 1 },
    ]);
  };

  const removePackage = (id: number) => {
    setMeasurmentPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePackage = (
    id: number,
    field: "name" | "amount",
    value: string | number,
  ) => {
    setMeasurmentPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const onSubmit: any = async (values: ProductDefaultValues) => {
    const package_measurements = measurmentsPackages
      ?.filter((p) => p.name.trim() && p.amount > 0) // bo‘shlarini yubormaymiz
      ?.map((p) => ({
        name: p.name,
        quantity: p.amount,
      }));

    const images = await convertImageObjectsToBase64(
      values?.images || [],
      values?.images?.[0]?.img || "",
    );
    const prices = (values?.prices || [])?.map((p: PriceType) => ({
      price_type_id: p?.price_type?.id ?? null,
      amount: p?.amount ? +p?.amount : 0,
      currency_code: p?.currency?.code ?? "",
    }));

    // product qo'shishda catalog nomlarida xatolik bor
    const category_id = values?.category?.id ?? null;
    const category_name = values?.category?.name ?? null;
    const catalog_code = values.catalog?.value
      ? String(values?.catalog?.value)
      : null;
    const catalog_name = values.catalog ? values?.catalog?.label : null;
    const package_code = values?.package?.code
      ? String(values?.package?.code)
      : null;
    const package_name = values.package ? values?.package?.name_uz : null;

    const data = {
      ...(type === "edit" ? { id: defaultValue?.id } : {}),
      ...(type !== "edit"
        ? {
            purchase_price: {
              amount: Number(values?.purchase_price?.amount) ?? 0,
              currency_code:
                Number(values?.purchase_price?.currency?.code) ?? 0,
            },
          }
        : {}),
      ...{
        name: values?.name,
        measurement_name: values?.measurement_name,
        code: values?.code,
        sku: values?.sku,
        vat_rate: values?.vat_rate,
        barcodes: values?.barcodes || [],
        images,
        prices,
        is_legal: values?.is_legal,
        category_id,
        category_name,
        catalog_code,
        catalog_name,
        package_code,
        package_name,
        package_measurements,
      },
    };

    if (type === "edit" && productId) {
      updateProduct(
        { productId, data },
        {
          onSuccess(res) {
            showSuccessMessage(
              messages.uz.SUCCESS_MESSAGE,
              messages.ru.SUCCESS_MESSAGE,
            );

            if (values?.purchase_price) {
              const payload = {
                amount: Number(values?.purchase_price?.amount) ?? 0,
                currency_code:
                  Number(values?.purchase_price?.currency?.code) ?? 0,
                warehouse_id: wareHouseId,
                product_id: res?.id,
              };

              updatepurchasePrice(payload);
            }

            if (alertOn && wareHouseId) {
              alertOnUpdate({
                warehouse_id: wareHouseId,
                product_id: res?.id,
                alert_on: +alertOn,
              });
            }
            if (res?.id) {
              remenderSubmit(res?.id);
            }
            onClose();
          },
          onError(error) {
            showErrorMessage(error);
          },
        },
      );
    } else {
      createProduct(data, {
        onSuccess(res) {
          showSuccessMessage(
            messages.uz.SUCCESS_MESSAGE,
            messages.ru.SUCCESS_MESSAGE,
          );

          if (alertOn && wareHouseId) {
            alertOnUpdate({
              warehouse_id: wareHouseId,
              product_id: res?.id,
              alert_on: +alertOn,
            });
          }
          if (res?.id) {
            remenderSubmit(res?.id);
          }

          if (pageType !== "products") {
            const operationItem = activeDraftSale?.items?.find(
              (p) => p.productId === res?.id,
            );
            const packagePrice =
              res?.prices?.find(
                (p: any) => p?.product_price_type?.is_primary,
              ) || res?.prices?.[0];
            const quantity = operationItem?.quantity ?? 0;

            const newItem = {
              productId: res?.id,
              productName: res?.name,
              productPackageName: res?.measurement_name || "",
              priceTypeId: packagePrice?.product_price_type?.id,
              priceAmount: packagePrice?.amount,
              quantity: quantity + 1,
              totalAmount: (quantity + 1) * (packagePrice?.amount ?? 0),
              catalogCode: res?.catalog_code,
              catalogName: res?.catalog_name,
            };
            updateDraftSaleItem(newItem);
          }
          onClose();
        },
        onError(error) {
          showErrorMessage(error);
        },
      });
    }
  };

  useEffect(() => {
    if (!defaultValue?.package_measurements) return;

    // edit holatda backenddan kelgan ma'lumotni UI state ga set qilamiz
    const packagesFromBackend = defaultValue.package_measurements.map(
      (p: any) => ({
        id: Date.now() + Math.random(), // unique id
        name: p.name || "",
        amount: p.quantity || 0,
      }),
    );

    if (packagesFromBackend.length) {
      setMeasurmentPackages(packagesFromBackend);
    }
  }, [defaultValue?.package_measurements, isOpen]);

  useEffect(() => {
    const [purchase_price] = defaultValue?.warehouse_items || [];
    if (purchase_price?.alert_on) {
      setAlertOn(purchase_price?.alert_on);
    }
  }, [defaultValue?.warehouse_items, isOpen]);

  // useEffect(() => {
  //   const catalog = getValues(`catalog`);
  //   const packages = getValues(`package`);
  //   const vat_rate = getValues(`vat_rate`);
  //   const shouldShow = !!catalog || !!packages || !!vat_rate;
  //   setIsShow(shouldShow);
  // }, [isOpen]);

  useEffect(() => {
    setRemainder(defaultValue?.state || 0);
  }, [defaultValue?.state, isOpen]);

  useEffect(() => {
    if (!catalogData?.length) return;

    // agar user allaqachon yozib bo‘lgan bo‘lsa – tegmaymiz
    if (isCatalogApplied.current) return;

    const catalogItem = catalogData[0];

    setValue("name", catalogItem?.name ?? "");
    setValue("catalog_code", catalogItem?.class_code ?? null);
    setValue("catalog_name", catalogItem?.class_name ?? null);
    setValue("catalog", {
      label: catalogItem?.class_name,
      value: catalogItem?.class_code,
      data: catalogItem,
    });

    
    // PACKAGE ni ham set qilish
    if (catalogItem?.packages?.length) {
      setPackageNames(catalogItem.packages); // state ga packageNames set qilinadi

      const selectedPackage =
        catalogItem.package_names.find(
          (p: any) => p.code === defaultValue?.package_code,
        ) || catalogItem.packages[0];

      setValue("package_code", selectedPackage?.code || null);
      setValue("package", selectedPackage || null);
    }

    isCatalogApplied.current = true;
  }, [catalogData]);

  useEffect(() => {
    isCatalogApplied.current = false;
  }, [barcode, catalogCode]);

  useEffect(() => {
    if (typeof barcode !== "string") return;
    if (!barcode) return;

    const list = getValues("barcodes") || [];

    const index = list?.findIndex((b: any) => b.value === barcode);

    if (index !== -1) {
      // ❗ countga TEGILMAYDI
      lastAddedBarcodeIndex.current = index;
    } else {
      const newIndex = list.length;

      setValue("barcodes", [...list, { value: barcode, count: 1 }], {
        shouldDirty: true,
      });

      lastAddedBarcodeIndex.current = newIndex;
    }

    setBarcode(null); // loop bo‘lmasin
  }, [barcode]);

  useEffect(() => {
    if (isOpen) {
      reset(defaultValue); // modal ochilganda reset qilish
    }
  }, [defaultValue, reset]);

  return (
    <Dialog
      width={"100vw"}
      height={"100vh"}
      contentClassName="!my-0 !rounded-none"
      closable={false}
      isOpen={isOpen && (type === "add" || type === "edit")}
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <NavigateButton
            content={type === "add" ? "Добавить товар" : "Редактировать товар"}
            click={onClose}
          />
          <Button
            loading={createProductPending || updateLoading}
            type="submit"
            variant="solid"
            size="sm"
            className="self-end"
          >
            Сохранить
          </Button>
        </div>

        <div className="max-h-[53vh] overflow-y-auto mb-4">
          <div className="grid grid-cols-5 gap-x-3 mb-4">
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Название обязательно к заполнению",
              }}
              render={({ field, fieldState }) => (
                <FormItem
                  label="Название товара"
                  asterisk
                  className="col-span-2 !mb-0"
                  invalid={!!fieldState?.error}
                  errorMessage={fieldState?.error?.message}
                >
                  <Input
                    {...field}
                    type="text"
                    autoComplete="off"
                    size="sm"
                    disabled={catalogLoading}
                    autoFocus={!!fieldState?.error}
                    invalid={!!fieldState?.error}
                    placeholder="Введите название товара"
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <Controller
              name="prices.0.amount"
              control={control}
              rules={{
                required: "Розничная цена обязательна к заполнению",
                min: { value: 1, message: "Цена должна быть больше 0" },
              }}
              render={({ field, fieldState }) => (
                <FormItem asterisk className="!mb-0" label="Розничный цена">
                  <Input
                    {...field}
                    autoFocus={!!fieldState?.error}
                    type="number"
                    size="sm"
                    invalid={!!fieldState?.error}
                    autoComplete="off"
                    placeholder="Сумма"
                    replaceLeadingZero={true}
                    className="w-full"
                  />
                </FormItem>
              )}
            />
            <Controller
              name="prices.1.amount"
              control={control}
              render={({ field }) => (
                <FormItem label="Оптовая цена" className="!mb-0">
                  <Input
                    {...field}
                    type="number"
                    size="sm"
                    autoComplete="off"
                    placeholder="Сумма"
                    replaceLeadingZero={true}
                    className="w-full"
                  />
                </FormItem>
              )}
            />
            <Controller
              name="purchase_price.amount"
              control={control}
              render={({ field }) => (
                <FormItem label="Закупочная цена" className="!mb-0">
                  <Input
                    {...field}
                    type="number"
                    // disabled={type === "edit"}
                    autoComplete="off"
                    placeholder="Сумма"
                    size="sm"
                    replaceLeadingZero={true}
                    className="w-full"
                  />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-7 gap-x-3 mb-4">
            <FormItem className={"!mb-0"} label="Остаток">
              <Input
                type="number"
                autoComplete="off"
                size="sm"
                value={remainder}
                placeholder="Введите остаток"
                replaceLeadingZero={true}
                className="w-full"
                onChange={(e) => setRemainder(+e.target.value)}
              />
            </FormItem>
            <Controller
              name="measurement_name"
              control={control}
              render={({ field, fieldState }) => (
                <FormItem
                  className={"!mb-0"}
                  label="Ед. изм."
                  invalid={!!fieldState?.error}
                >
                  <Select
                    {...field}
                    options={optionMeasurement}
                    isSearchable={false}
                    className="w-full"
                    size="sm"
                    hideDropdownIndicator={true}
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => String(option?.value)}
                    value={
                      optionMeasurement?.find(
                        (opt) => opt.value === field.value,
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
                    onChange={(option) => field.onChange(option?.value ?? "шт")}
                  />
                </FormItem>
              )}
            />
            <FormItem className={"!mb-0"} label="Оповещения">
              <Input
                type="number"
                autoComplete="off"
                size="sm"
                value={alertOn}
                placeholder="Введите остаток"
                replaceLeadingZero={true}
                className="w-full"
                onChange={(e) => setAlertOn(+e.target.value)}
              />
            </FormItem>
            <CategorySelect
              name={`category`}
              control={control}
              label={"Категория"}
              placeholder={"Категория"}
            />
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <FormItem className={"!mb-0"} label="Код">
                  <Input
                    {...field}
                    size="sm"
                    type="text"
                    autoComplete="off"
                    placeholder="Введите код"
                  />
                </FormItem>
              )}
            />
            <Controller
              name="sku"
              control={control}
              render={({ field }) => (
                <FormItem className={"!mb-0"} asterisk={false} label="Артикул">
                  <div className="relative">
                    <Input
                      {...field}
                      type="text"
                      size="sm"
                      autoComplete="off"
                      placeholder="Введите артикул"
                    />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 items-start gap-x-3 mb-4">
            <BarcodeForm
              fieldName={"barcodes"}
              barcode={barcode}
              setValue={setValue}
              control={control}
              getValues={getValues}
            />
            <div className="flex flex-col">
              <div className="form-label flex justify-between mb-1">
                <span className="font-semibold">Название упаковки</span>
                <Button
                  variant="plain"
                  type="button"
                  className="bg-transparent border-transparent py-0 h-auto text-blue-500"
                  size="sm"
                  onClick={addPackage}
                >
                  Добавить упаковку
                </Button>
              </div>
              <div className="flex flex-col gap-y-1">
                {measurmentsPackages?.map((item) => (
                  <div key={item.id} className="flex items-center gap-x-2">
                    <Input
                      placeholder="Название упаковки"
                      value={item.name}
                      onChange={(e) =>
                        updatePackage(item.id, "name", e.target.value)
                      }
                    />

                    <Input
                      type="number"
                      placeholder="Количество в упаковке"
                      value={item.amount}
                      className="!w-[100px]"
                      onChange={(e) =>
                        updatePackage(item.id, "amount", +e.target.value)
                      }
                    />

                    {measurmentsPackages?.length > 1 && (
                      <Button
                        type="button"
                        variant="default"
                        icon={<IoMdClose size={20} />}
                        className="text-red-500 hover:text-red-400 active:text-red-400 px-3"
                        onClick={() => removePackage(item.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 items-end gap-x-3 mb-4">
            {/* <Checkbox
              className="text-nowrap text-slate-800 col-span-2 mb-3"
              checked={isShow}
              onChange={handleClick}
            >
            </Checkbox> */}
              {/* Идентификаторы и измерения в GN */}
              <span className="text-nowrap text-slate-800 col-span-2 mb-3">Интергация с ОФД</span>
              <>
                <Controller
                  name={`catalog_code`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormItem className="col-span-3 !mb-0" label={"ИКПУ-код"}>
                        <CatalogSelector
                          {...field}
                          fieldName={`catalog`}
                          isOpen={isOpen}
                          placeholder={"Введите ИКПУ-код"}
                          value={field.value}
                          setValue={setValue}
                          getValues={getValues}
                          onChange={(opt) => field.onChange(opt.value)}
                          setPackageNames={setPackageNames}
                        />
                      </FormItem>
                    );
                  }}
                />

                <Controller
                  name={`package_code`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormItem className="col-span-3 !mb-0" label={"Ед. изм."}>
                        <CatalogPackageSelector
                          {...field}
                          options={packageNames || []}
                          value={field?.value}
                          setValue={setValue}
                          placeholder={"Введите Ед. изм."}
                          onChange={field.onChange}
                        />
                      </FormItem>
                    );
                  }}
                />

                <Controller
                  name={`vat_rate`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 !mb-0" label={"НДС"}>
                      <Select
                        options={options}
                        isSearchable={false}
                        size="sm"
                        placeholder={"Введите НДС"}
                        getOptionLabel={(option) =>
                          typeof option?.value === "number"
                            ? option.label
                            : "БЕЗ НДС"
                        }
                        getOptionValue={(option) => String(option.value)}
                        value={
                          options.find((opt) => opt.value === field.value) ||
                          options[0]
                        }
                        onChange={(option) =>
                          field.onChange(option?.value ?? null)
                        }
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </FormItem>
                  )}
                />
              </>
            <div className="w-full flex gap-x-2 text-nowrap grid-cols-2 mb-3">
              <Controller
                name="is_legal"
                control={control}
                render={({ field }) => (
                  <Switcher checked={field.value} onChange={field.onChange} />
                )}
              />
              Белых товаров
            </div>
          </div>

          <ImageForm fieldName={`images`} control={control} />
        </div>
      </Form>
      <FullKeyboard />
    </Dialog>
  );
};

export default ProductForm;
