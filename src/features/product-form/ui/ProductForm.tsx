import { useEffect, useMemo, useRef, useState, type FC } from "react";
import type { ProductFormType } from "../model";
import {
  Button,
  Checkbox,
  Dialog,
  Form,
  FormItem,
  Input,
  InputGroup,
  Select,
} from "@/shared/ui/kit";
import { Controller, useForm } from "react-hook-form";
import type {
  Package,
  PriceType,
  ProductDefaultValues,
} from "@/features/modals/model";
import {
  useCreateProduct,
  useCreateregister,
  useCurrancyApi,
  useUpdateAlertOn,
  useUpdateProduct,
} from "@/entities/products/repository";
import CategorySelect from "@/features/category/CategorySelect";
import {
  CatalogPackageSelector,
  CatalogSelector,
} from "@/features/catalog-selector";
import type { Product, VatRateSelectorOption } from "@/@types/products";
import ImageForm from "@/features/image-form";
import BarcodeForm from "@/features/barcode-form/ui/BarcodeForm";
import { convertImageObjectsToBase64 } from "@/shared/lib/convertFilesToBase64";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import { useSettingsStore } from "@/app/store/useSettingsStore";

const ProductForm: FC<ProductFormType> = ({
  type,
  productId,
  isOpen,
  setIsOpen,
  setType,
  defaultValue,
  setBarcode,
  barcode,
  setProductId,
}) => {
  const { handleSubmit, control, getValues, setValue, reset, watch } = useForm<
    Product | ProductDefaultValues
  >({
    defaultValues: defaultValue,
  });
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const [remainder, setRemainder] = useState<number>(defaultValue?.state || 0);
  const [alertOn, setAlertOn] = useState<string | number>(0);
  const [isShow, setIsShow] = useState(true);
  const [packageNames, setPackageNames] = useState<Package[] | []>();

  const { wareHouseId } = useSettingsStore((s) => s);

  const { data: currencies } = useCurrancyApi();
  const { mutate: createProduct, isPending: createProductPending } =
    useCreateProduct();
  const { mutate: updateProduct, isPending: updateLoading } =
    useUpdateProduct();
  const { mutate: alertOnUpdate } = useUpdateAlertOn();
  const { mutate: createRegister } = useCreateregister();

  const onClose = () => {
    setBarcode(null);
    setAlertOn(0);
    setRemainder(0);
    reset();
    setIsShow(false);
    setIsOpen(false);
    setType("add");
    if (setProductId) {
      setProductId(null);
    }
  };

  const handleClick = (value: boolean) => {
    setIsShow(value);
    if (value && inputWrapperRef.current) {
      inputWrapperRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const options = useMemo<VatRateSelectorOption[]>(
    () => [
      { label: "БЕЗ НДС", value: null },
      { label: "0", value: 0 },
      { label: "12", value: 12 },
    ],
    []
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

  const onSubmit: any = async (values: ProductDefaultValues) => {
    const images = await convertImageObjectsToBase64(
      values?.images || [],
      values?.images?.[0]?.img || ""
    );
    const prices = (values?.prices || [])?.map((p: PriceType) => ({
      price_type_id: p?.price_type?.id ?? null,
      amount: p?.amount ? +p?.amount : 0,
      currency_code: p?.currency?.code ?? "",
    }));

    // product qo'shishda catalog nomlarida xatolik bor
    const category_id = values?.category?.id ?? null;
    const category_name = values?.category?.name ?? null;
    const catalog_code = values.catalog
      ? values.catalog.value.toString()
      : null;
    const catalog_name = values.catalog ? values.catalog.label : null;
    const package_code = values.package ? values.package.code.toString() : null;
    const package_name = values.package ? values?.package?.name_uz : null;

    const data = {
      ...(type === "edit" ? { id: defaultValue?.id } : {}),
      ...(type !== "edit"
        ? {
            purchase_price: {
              amount: values?.purchase_price?.amount ?? 0,
              currency_code: values?.purchase_price?.currency?.code ?? "",
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
        count: +values?.count || 0,
        images,
        prices,
        category_id,
        category_name,
        catalog_code,
        catalog_name,
        package_code,
        package_name,
      },
    };

    if (type === "edit" && productId) {
      updateProduct(
        { productId, data },
        {
          onSuccess(res) {
            showSuccessMessage(
              messages.uz.SUCCESS_MESSAGE,
              messages.ru.SUCCESS_MESSAGE
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
            onClose();
          },
          onError(error) {
            showErrorMessage(error);
          },
        }
      );
    } else {
      createProduct(data, {
        onSuccess(res) {
          showSuccessMessage(
            messages.uz.SUCCESS_MESSAGE,
            messages.ru.SUCCESS_MESSAGE
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
          onClose();
        },
        onError(error) {
          showErrorMessage(error);
        },
      });
    }
  };

  useEffect(() => {
    const [purchase_price] = defaultValue?.warehouse_items || [];
    if (purchase_price?.alert_on) {
      setAlertOn(purchase_price?.alert_on);
    }
  }, [defaultValue?.warehouse_items, isOpen]);

  useEffect(() => {
    const catalog = getValues(`catalog_code`);
    const packages = getValues(`package`);
    const vat_rate = getValues(`vat_rate`);
    const shouldShow = !!catalog || !!packages || !!vat_rate;
    setIsShow(shouldShow);
  }, [watch(`catalog_code`), watch(`package`), watch(`vat_rate`), isOpen]);

  useEffect(() => {
    setRemainder(defaultValue?.state || 0);
  }, [defaultValue?.state, isOpen]);

  useEffect(() => {
    if (isOpen && defaultValue) {
      reset(defaultValue);
    }
  }, [isOpen, defaultValue, reset]);

  return (
    <Dialog
      width={630}
      title={type === "add" ? "Добавить товар" : "Редактировать товар"}
      onClose={onClose}
      isOpen={isOpen && (type === "add" || type === "edit")}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-4 max-h-[60vh] overflow-y-auto">
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Название обязательно к заполнению",
            }}
            render={({ field, fieldState }) => (
              <FormItem
                label="Название"
                asterisk
                invalid={!!fieldState?.error}
                errorMessage={fieldState?.error?.message}
              >
                <Input
                  {...field}
                  type="text"
                  autoComplete="off"
                  autoFocus={!!fieldState?.error}
                  invalid={!!fieldState?.error}
                  placeholder="Введите название товара"
                  className="w-full"
                />
              </FormItem>
            )}
          />

          {type === "add" && (
            <FormItem label="Остаток">
              <Input
                type="number"
                autoComplete="off"
                value={remainder}
                placeholder="Введите остаток"
                replaceLeadingZero={true}
                className="w-full"
                onChange={(e) => setRemainder(+e.target.value)}
              />
            </FormItem>
          )}

          <FormItem label="Мин. остаток для оповещения">
            <Input
              type="number"
              autoComplete="off"
              value={alertOn}
              placeholder="Введите остаток"
              replaceLeadingZero={true}
              className="w-full"
              onChange={(e) => setAlertOn(+e.target.value)}
            />
          </FormItem>

          <FormItem asterisk label="Розничный цена" className="w-full p-0">
            <InputGroup>
              <Controller
                name="prices.0.amount"
                control={control}
                rules={{
                  required: "Розничная цена обязательна к заполнению", // 🔥 xabarni to‘g‘riladik
                  min: { value: 1, message: "Цена должна быть больше 0" }, // ixtiyoriy: minimal qiymat
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    autoFocus={!!fieldState?.error}
                    type="number"
                    invalid={!!fieldState?.error}
                    autoComplete="off"
                    placeholder="Сумма"
                    replaceLeadingZero={true}
                    className="w-full"
                  />
                )}
              />
              <Controller
                name="prices.0.currency"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    isDisabled={true}
                    invalid={!!fieldState?.error}
                    hideDropdownIndicator={true}
                    options={currencies?.filter((i) => i.is_active)}
                    getOptionLabel={(option) => option?.name}
                    getOptionValue={(option) => String(option?.code)}
                    className="w-[90px] !whitespace-normal"
                    placeholder={"Валюта"}
                  />
                )}
              />
            </InputGroup>
          </FormItem>

          <FormItem label="Оптовая цена" className="w-full p-0">
            <InputGroup>
              <Controller
                name="prices.1.amount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    autoComplete="off"
                    placeholder="Сумма"
                    replaceLeadingZero={true}
                    className="w-full"
                  />
                )}
              />
              <Controller
                name="prices.1.currency"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    isDisabled={true}
                    invalid={!!fieldState?.error}
                    hideDropdownIndicator={true}
                    options={(currencies || [])?.filter((i) => i.is_active)}
                    getOptionLabel={(option) => option?.name}
                    getOptionValue={(option) => String(option?.code)}
                    className="w-[90px]"
                    placeholder="Валюта"
                  />
                )}
              />
            </InputGroup>
          </FormItem>

          <CategorySelect
            name={`category`}
            control={control}
            label={"Категория"}
            placeholder={"Категория"}
          />

          <Controller
            name="measurement_name"
            control={control}
            render={({ field, fieldState }) => (
              <FormItem label="Название упаковка" invalid={!!fieldState?.error}>
                <Input
                  {...field}
                  type="text"
                  autoComplete="off"
                  placeholder="Введите название упаковка"
                  className="w-full"
                />
              </FormItem>
            )}
          />

          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <FormItem asterisk={false} label="Артикул">
                <div className="relative">
                  <Input
                    {...field}
                    type="number"
                    autoComplete="off"
                    replaceLeadingZero={false}
                    space={false}
                    placeholder="Введите артикул"
                  />
                </div>
              </FormItem>
            )}
          />

          <Controller
            name="count"
            control={control}
            rules={{
              required: "Кол-во в уп. обязательно для заполнения", // 🔥 majburiy xabar
            }}
            render={({ field, fieldState }) => (
              <FormItem
                asterisk
                invalid={!!fieldState.error}
                label="Кол-во в уп."
              >
                <Input
                  {...field}
                  type="number"
                  autoComplete="off"
                  disabled={type === "edit"}
                  replaceLeadingZero={false}
                  space={false}
                  placeholder="Введите Кол-во в уп."
                />
              </FormItem>
            )}
          />

          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <FormItem label="Код">
                <Input
                  {...field}
                  type="number"
                  autoComplete="off"
                  replaceLeadingZero={false}
                  space={false}
                  placeholder="Введите код"
                />
              </FormItem>
            )}
          />

          <FormItem className="col-span-2" label="Штрих-коды">
            <BarcodeForm
              fieldName={"barcodes"}
              barcode={barcode}
              setValue={setValue}
              control={control}
              getValues={getValues}
            />
          </FormItem>

          <Checkbox
            className="ml-1 mb-3"
            checked={isShow}
            onChange={handleClick}
          >
            Идентификаторы и измерения в GN
          </Checkbox>

          {isShow ? (
            <>
              <Controller
                name={`catalog_code`}
                control={control}
                render={({ field }) => {
                  return (
                    <FormItem label={"ИКПУ-код"}>
                      <CatalogSelector
                        {...field}
                        fieldName={`catalog`}
                        isOpen={isOpen}
                        placeholder={"Введите ИКПУ-код"}
                        value={field.value}
                        setValue={setValue}
                        getValues={getValues}
                        onChange={field.onChange}
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
                    <FormItem label={"Ед. изм."}>
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
                  <FormItem label={"НДС"}>
                    <Select
                      options={options}
                      isSearchable={false}
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
          ) : (
            <></>
          )}

          <div className="col-span-2">
            <ImageForm fieldName={`images`} control={control} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-x-3">
          <Button type="button" onClick={onClose}>
            Отменить
          </Button>
          <Button
            loading={createProductPending || updateLoading}
            type="submit"
            variant="solid"
            className="self-end"
          >
            {type === "add" ? "Добавить" : "Сохранить"}
          </Button>
        </div>
      </Form>
    </Dialog>
  );
};

export default ProductForm;
