import { useEffect, useState, type FC } from "react";
import {
  Button,
  Form,
  FormItem,
  Input,
  InputGroup,
  Select,
  Switcher,
} from "@/shared/ui/kit";
import { MdDelete } from "react-icons/md";
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
  useCreateregister,
  useCurrancyApi,
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

interface Props {
  name: string; // e.g., "products"
  products: any;
  onRemove?: (index: number) => void;
  barcode: string | null;
  setBarcode: (val: string | null) => void;
  addProduct: any;
  setProducts: any;
  catalogData: any;
  createEmptyProduct: (barcode?: string) => any;
}

const options = [
  { label: "БЕЗ НДС", value: null },
  { label: "0", value: 0 },
  { label: "12", value: 12 },
];

const ProductFormMultiple: FC<Props> = ({
  name,
  onRemove,
  products,
  barcode,
  setBarcode,
  addProduct,
  catalogData,
  createEmptyProduct,
}) => {
  const [packageNamesMap, setPackageNamesMap] = useState<
    Record<number, Package[]>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: { products },
  });

  const { data: currencies } = useCurrancyApi();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: alertOnUpdate } = useUpdateAlertOn();
  const { mutate: createRegister } = useCreateregister();

  const { wareHouseId } = useSettingsStore((s) => s);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name,
  });

  const remenderSubmit = async (id: number | null, item: number) => {
    if (id && item > 0) {
      const reminderData = {
        is_approved: true,
        items: [
          {
            product_id: id,
            warehouse_id: wareHouseId,
            quantity: item,
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

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    const successfullyAdded: number[] = []; // muvaffaqiyatli elementlar

    for (const [index, values] of data.products.entries()) {
      try {
        // IMAGE LOGIKASI O'ZGARMADI
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
            currency_code: Number(values?.purchase_price?.currency?.code) ?? 0,
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
          catalog_code: values.catalog?.value
            ? String(values?.catalog?.value)
            : null,
          catalog_name: values.catalog ? values?.catalog?.label : null,
          package_code: values?.package?.code
            ? String(values?.package?.code)
            : null,
          package_name: values.package ? values?.package?.name_uz : null,
        };

        // createProduct mutate – Promise emas, shuning uchun ketma-ket kutamiz
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
              if (res?.id) {
                remenderSubmit(res?.id, +values?.remainder);
              }

              successfullyAdded.push(index); // muvaffaqiyatli element
              resolve(); // promise resolved
            },
            onError(err) {
              console.log("Product error index:", index, err);
              showErrorMessage(err);
              resolve(); // error bo‘lsa ham promise resolved qilamiz
            },
          });
        });
      } catch (err) {
        console.log("Error for product index", index, err);
      }
    }

    // muvaffaqiyatli elementlarni reverse order da remove qilish
    successfullyAdded.sort((a, b) => b - a).forEach((i) => remove(i));

    // agar biror element muvaffaqiyatli bo‘lsa
    if (successfullyAdded.length > 0) {
      showSuccessMessage(
        messages.uz.SUCCESS_MESSAGE,
        messages.ru.SUCCESS_MESSAGE,
      );
    }

    setIsSubmitting(false);
  };

  /* 🔥 BARCODE LOGIC */
  useEffect(() => {
    if (typeof barcode !== "string") return;
    if (!barcode) return;

    // form array'dan olamiz
    const currentProducts = methods.watch("products"); // react-hook-form watch

    const isHasBarcode = currentProducts?.some((item: any) =>
      item.barcodes?.some((b: any) => b.value === barcode),
    );

    if (!isHasBarcode) {
      const catalog = catalogData?.[0];
      const newProduct = createEmptyProduct(barcode);

      if (catalog) {
        newProduct.name = catalog.name ?? "";
        newProduct.catalog_code = catalog?.class_code;
        newProduct.catalog_name = catalog?.class_name;
        newProduct.catalog = {
          label: catalog?.class_name,
          value: catalog?.class_code,
          data: catalog,
        };
      }
      append(newProduct);
      setBarcode(null);
    }
  }, [barcode, catalogData]);

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="bg-white flex justify-end pb-3 sticky top-0 z-30">
          <Button
            type="button"
            onClick={() => addProduct(append)}
            variant="solid"
          >
            Добавить в список
          </Button>
        </div>
        {fields?.length ? (
          fields?.map((field, index) => (
            <div key={field.id} className="border p-4 rounded space-y-4">
              {/* Header with delete */}
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Товар {index + 1}</h4>
                {fields.length > 1 && onRemove && (
                  <Button
                    type="button"
                    variant="plain"
                    className="bg-red-500 text-white hover:text-white hover:bg-red-400 active:bg-red-400 active:text-white"
                    icon={<MdDelete />}
                    onClick={() => {
                      remove(index);
                      onRemove(index);
                    }}
                  />
                )}
              </div>

              <div className="flex gap-x-2 items-center overflow-x-auto">
                {/* Название */}
                <Controller
                  name={`${name}.${index}.name` as any}
                  control={methods.control}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <FormItem
                      label="Название"
                      asterisk
                      invalid={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                    >
                      <Input
                        {...field}
                        type="text"
                        className="!w-52"
                        autoComplete="off"
                        invalid={!!fieldState.error}
                        placeholder="Введите название товара"
                      />
                    </FormItem>
                  )}
                />

                {/* Розничная цена */}
                <FormItem
                  asterisk
                  label="Розничная цена"
                  className="w-full p-0"
                >
                  <InputGroup>
                    <Controller
                      name={`${name}.${index}.prices.0.amount` as any}
                      control={methods.control}
                      rules={{
                        required: "Розничная цена обязательна к заполнению",
                        min: { value: 1, message: "Цена должна быть больше 0" },
                      }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          type="number"
                          autoComplete="off"
                          invalid={!!fieldState.error}
                          placeholder="Сумма"
                          replaceLeadingZero
                          className="!w-44"
                        />
                      )}
                    />
                    <Controller
                      name={`${name}.${index}.prices.0.currency` as any}
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isDisabled
                          options={currencies?.filter((c) => c.is_active)}
                          getOptionLabel={(opt) => opt.name}
                          getOptionValue={(opt) => String(opt.code)}
                          className="w-[90px]"
                          placeholder="Валюта"
                        />
                      )}
                    />
                  </InputGroup>
                </FormItem>

                {/* Оптовая цена */}
                <FormItem label="Оптовая цена" className="w-full p-0">
                  <InputGroup>
                    <Controller
                      name={`${name}.${index}.prices.1.amount` as any}
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          autoComplete="off"
                          placeholder="Сумма"
                          replaceLeadingZero
                          className="!w-44"
                        />
                      )}
                    />
                    <Controller
                      name={`${name}.${index}.prices.1.currency` as any}
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isDisabled
                          options={currencies?.filter((c) => c.is_active)}
                          getOptionLabel={(opt) => opt.name}
                          getOptionValue={(opt) => String(opt.code)}
                          className="w-[90px]"
                          placeholder="Валюта"
                        />
                      )}
                    />
                  </InputGroup>
                </FormItem>

                {/* Закупочная цена */}
                <FormItem label="Закупочная цена" className="w-full p-0">
                  <InputGroup>
                    <Controller
                      name={`${name}.${index}.purchase_price.amount` as any}
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          autoComplete="off"
                          placeholder="Сумма"
                          replaceLeadingZero
                          className="!w-44"
                        />
                      )}
                    />
                    <Controller
                      name={`${name}.${index}.purchase_price.currency` as any}
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isDisabled
                          options={currencies?.filter((c) => c.is_active)}
                          getOptionLabel={(opt) => opt.name}
                          getOptionValue={(opt) => String(opt.code)}
                          className="w-[90px]"
                          placeholder="Валюта"
                        />
                      )}
                    />
                  </InputGroup>
                </FormItem>

                {/* Остаток */}
                <Controller
                  name={`${name}.${index}.remainder` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="Остаток">
                      <Input
                        {...field}
                        type="number"
                        autoComplete="off"
                        placeholder="Введите остаток"
                        replaceLeadingZero
                        className="!w-44"
                      />
                    </FormItem>
                  )}
                />

                {/* Мин. остаток для оповещения */}
                <Controller
                  name={`${name}.${index}.alertOn` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="Мин. остаток">
                      <Input
                        {...field}
                        type="number"
                        autoComplete="off"
                        placeholder="Введите остаток"
                        replaceLeadingZero
                        className="!w-44"
                      />
                    </FormItem>
                  )}
                />

                {/* Категория */}
                <CategorySelect
                  name={`${name}.${index}.category`}
                  control={methods.control}
                  label="Категория"
                  width="!w-44"
                  placeholder="Категория"
                />

                {/* Название упаковка */}
                <Controller
                  name={`${name}.${index}.measurement_name` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="Название упаковка">
                      <Input
                        {...field}
                        type="text"
                        autoComplete="off"
                        placeholder="Введите название упаковка"
                        className="!w-44"
                      />
                    </FormItem>
                  )}
                />

                {/* Артикул */}
                <Controller
                  name={`${name}.${index}.sku` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="Артикул">
                      <Input
                        {...field}
                        type="text"
                        autoComplete="off"
                        placeholder="Введите артикул"
                        className="!w-44"
                      />
                    </FormItem>
                  )}
                />

                {/* Код */}
                <Controller
                  name={`${name}.${index}.code` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="Код">
                      <Input
                        {...field}
                        autoComplete="off"
                        placeholder="Введите код"
                        className="!w-44"
                      />
                    </FormItem>
                  )}
                />

                {/* Штрих-коды */}

                <BarcodeForm
                  fieldName={`${name}.${index}.barcodes`}
                  barcode={barcode}
                  control={methods.control}
                  setValue={methods.setValue}
                  getValues={methods.getValues}
                  multiplay={true}
                />

                {/* ИКПУ-код */}
                <Controller
                  name={`${name}.${index}.catalog_code` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="ИКПУ-код">
                      <CatalogSelector
                        {...field}
                        fieldName={`${name}.${index}.catalog`}
                        isOpen={true}
                        placeholder="Введите ИКПУ-код"
                        value={field.value}
                        setValue={methods.setValue}
                        getValues={methods.getValues}
                        onChange={(opt) =>
                          field.onChange(opt ? opt.value : null)
                        }
                        setPackageNames={(packages) => {
                          setPackageNamesMap((prev) => ({
                            ...prev,
                            [index]: packages,
                          }));
                        }}
                        width={"!w-52"}
                        multiplay={true}
                        index={index}
                      />
                    </FormItem>
                  )}
                />

                {/* Ед. изм. */}
                <Controller
                  name={`${name}.${index}.package_code` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="Ед. изм.">
                      <CatalogPackageSelector
                        key={`${index}-${packageNamesMap[index]?.length || 0}`}
                        {...field}
                        options={packageNamesMap[index] || []}
                        value={field.value}
                        setValue={methods.setValue}
                        placeholder="Введите Ед. изм."
                        onChange={field.onChange}
                        width={"!w-52"}
                        multiplay={true}
                        index={index}
                      />
                    </FormItem>
                  )}
                />

                {/* НДС */}
                <Controller
                  name={`${name}.${index}.vat_rate` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="НДС">
                      <Select
                        options={options}
                        isSearchable={false}
                        className="!w-44"
                        placeholder="Введите НДС"
                        getOptionLabel={(opt) =>
                          typeof opt.value === "number" ? opt.label : "БЕЗ НДС"
                        }
                        getOptionValue={(opt) => String(opt.value)}
                        value={
                          options.find((opt) => opt.value === field.value) ||
                          options[0]
                        }
                        onChange={(opt) => field.onChange(opt?.value ?? null)}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </FormItem>
                  )}
                />

                {/* Белых товаров */}
                <Controller
                  name={`${name}.${index}.is_legal` as any}
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem label="Белых товаров">
                      <div className="!w-32">
                        <Switcher
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Изображения */}
                <div className="col-span-2 py-1">
                  <ImageForm
                    fieldName={`${name}.${index}.images`}
                    control={methods.control}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-5">
            <Empty size={120} />
          </div>
        )}

        <div className="bg-white sticky bottom-0 flex justify-end pt-3">
          <Button
            disabled={fields?.length === 0}
            loading={isSubmitting}
            type="submit"
            variant="solid"
          >
            Добавить
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default ProductFormMultiple;
