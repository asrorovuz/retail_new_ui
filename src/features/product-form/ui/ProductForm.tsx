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
  const [isShow, setIsShow] = useState(false);
  const [packageNames, setPackageNames] = useState<Package[] | []>([]);

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
    reset(defaultValue || {});
    setIsShow(false);
    setIsOpen(false);

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
            product_package_id: id,
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
    const transformatedData = await Promise.all(
      values?.packages?.map(async (pkg: any) => {
        const images = await convertImageObjectsToBase64(
          pkg?.images || [],
          pkg?.images?.[0]?.img || ""
        );

        const prices = (pkg?.prices || [])?.map((p: PriceType) => ({
          price_type_id: p?.price_type?.id ?? null,
          amount: p?.amount ? +p?.amount : 0,
          currency_code: p?.currency?.code ?? "",
        }));

        // const purchase_price = {
        //   amount: pkg?.purchase_price?.amount ?? 0,
        //   currency_code: pkg?.purchase_price?.currency?.code ?? "",
        // }

        const category_id = pkg?.category?.id ?? null;
        const catalog_code = pkg.catalog
          ? pkg.catalog.class_code.toString()
          : null;
        const catalog_name = pkg.catalog ? pkg.catalog.class_name : null;
        const package_code = pkg.package ? pkg.package.code.toString() : null;
        const package_name = pkg.package ? pkg?.package?.name_uz : null;

        return {
          ...pkg,
          count: +pkg?.count || 0,
          images,
          prices,
          // purchase_price,
          category_id,
          catalog_code,
          catalog_name,
          package_code,
          package_name,
        };
      }) ?? []
    );

    const data = {
      ...values,
      ...(type === "edit" ? { id: defaultValue?.id } : {}),
      ...(type !== "edit"
        ? {
            purchase_price: {
              amount: values?.purchase_price?.amount ?? 0,
              currency_code: values?.purchase_price?.currency?.code ?? "",
            },
          }
        : {}),
      packages: transformatedData,
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
                product_id: res?.product?.id,
                alert_on: +alertOn,
              });
            }
            if (res && res?.package) {
              remenderSubmit(res?.package[0]?.id);
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
              product_id: res?.product?.id,
              alert_on: +alertOn,
            });
          }
          if (res && res?.package) {
            remenderSubmit(res?.package[0]?.id);
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
  }, [defaultValue?.warehouse_items]);

  useEffect(() => {
    const values = getValues(`packages.0`) || {};
    const shouldShow =
      !!values.catalog || !!values.package || !!values.vat_rate;
    setIsShow(shouldShow);
  }, [
    watch(`packages.0.catalog_code`),
    watch(`packages.0.package`),
    watch(`packages.0.vat_rate`),
    isOpen,
  ]);

  useEffect(() => {
    setRemainder(defaultValue?.state || 0);
  }, [defaultValue?.state]);

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
                name="packages.0.prices.0.amount"
                control={control}
                rules={{
                  required: "Розничная цена обязательна к заполнению", // 🔥 xabarni to‘g‘riladik
                  min: { value: 1, message: "Цена должна быть больше 0" }, // ixtiyoriy: minimal qiymat
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
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
                name="packages.0.prices.0.currency"
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
                    className="w-[90px]"
                    placeholder={"Валюта"}
                  />
                )}
              />
            </InputGroup>
          </FormItem>

          <FormItem label="Оптовая цена" className="w-full p-0">
            <InputGroup>
              <Controller
                name="packages.0.prices.1.amount"
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
                name="packages.0.prices.1.currency"
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
            name={`packages.0.category`}
            control={control}
            label={"Категория"}
            placeholder={"Категория"}
          />

          <Controller
            name="packages.0.measurement_name"
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
            name="packages.0.sku"
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
            name="packages.0.count"
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
            name="packages.0.code"
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
              fieldName={"packages.0.barcodes"}
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
                name={`packages.0.catalog_code`}
                control={control}
                render={({ field }) => {
                  return (
                    <FormItem label={"ИКПУ-код"}>
                      <CatalogSelector
                        {...field}
                        fieldName={`packages.0`}
                        isOpen={isOpen}
                        placeholder={"Введите ИКПУ-код"}
                        value={field.value}
                        onChange={field.onChange}
                        setPackageNames={setPackageNames}
                      />
                    </FormItem>
                  );
                }}
              />

              <Controller
                name={`packages.0.package`}
                control={control}
                render={({ field }) => {
                  console.log(packageNames, "edizs");

                  return (
                    <FormItem label={"Ед. изм."}>
                      <CatalogPackageSelector
                        {...field}
                        options={packageNames || []}
                        value={field?.value}
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
            <ImageForm fieldName={`packages.0.images`} control={control} />
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
