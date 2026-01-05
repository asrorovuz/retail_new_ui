import {
  GetPaymentProviderLogo,
  PaymentProviderTypeClick,
  PaymentProviderTypePayme,
  PaymentProviderTypes,
} from "@/app/constants/payme-providers";
import classNames from "@/shared/lib/classNames";
import { FormItem, Input, Select, Switcher } from "@/shared/ui/kit";
import {
  Controller,
  FormProvider,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Fragment } from "react/jsx-runtime";

type FormValues = {
  payme: {
    merchantCashBoxId: string;
    merchantCashBoxKey: string;
  };
  click: {
    serviceId: number;
    merchantId: number;
    merchantUserId: number;
    secretKey: string;
  };
};

const t = (text: string) => text; // Static translation function

const formatOptionLabel = (paymentProvider: { type: number }) => {
  return (
    <div className="flex items-center p-0">
      <img
        width={60}
        src={GetPaymentProviderLogo(paymentProvider.type)}
        alt={String(paymentProvider?.type)}
      />
    </div>
  );
};

const PaymentProviderForm = () => {
  const form = useFormContext();

  const paymentProviderType = useWatch({ name: "type" });
  const isEditing = useWatch({ name: "id" });

  const showPaymeForm =
    Number(paymentProviderType) === PaymentProviderTypePayme;
  const showClickForm =
    Number(paymentProviderType) === PaymentProviderTypeClick;

  return (
    <Fragment>
      <FormProvider {...form}>
        <Controller
          control={form.control}
          name={"type"}
          rules={{ required: t("Обязательное поле") }}
          render={({ field }) => (
            <FormItem className="mb-2" label="Тип поставщика платежей">
              <Select
                autoFocus
                openMenuOnFocus
                hideSelectedOptions
                isDisabled={isEditing}
                isSearchable={false}
                options={PaymentProviderTypes}
                classNamePrefix="react-select"
                formatOptionLabel={formatOptionLabel}
                getOptionValue={(option) => String(option.type)}
                getOptionLabel={(option) => t(option.name)}
                onChange={(option) => field.onChange(option?.type)}
                className={classNames({
                  "border-red-500": form.formState.errors?.type,
                })}
                value={PaymentProviderTypes.find(
                  (item) => item.type === field.value
                )}
                placeholder="Выберите поставщика"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
              {form.formState.errors?.type && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.type.message as string}
                </p>
              )}
            </FormItem>
          )}
        />
      </FormProvider>

      {showPaymeForm && <PaymeForm />}
      {showClickForm && <ClickForm />}

      <div className="mt-4 flex items-center gap-2">
        <FormItem
          layout="horizontal"
          label={t("По умолчанию включено")}
          className="mb-0 *:w-fit *:items-start items-start"
        >
          <Controller
            name="isEnabled"
            render={({ field }) => (
              <Switcher {...field} checked={field.value ?? true} />
            )}
          />
        </FormItem>
      </div>
    </Fragment>
  );
};

const PaymeForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="grid gap-y-2">
      <Controller
        name="payme.merchantCashBoxId"
        control={control}
        rules={{
          required: "Обязательное поле",
        }}
        render={({ field }) => (
          <FormItem className="mb-1" label="ID кассы мерчанта">
            <Input
              {...field}
              placeholder="Введите ID кассы мерчанта"
              className={classNames(
                "bg-white border-gray-300 font-medium rounded",
                errors?.payme?.merchantCashBoxId && "border-red-500"
              )}
            />
            {errors?.payme?.merchantCashBoxId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payme.merchantCashBoxId.message as string}
              </p>
            )}
          </FormItem>
        )}
      />

      <Controller
        name="payme.merchantCashBoxKey"
        control={control}
        rules={{
          required: "Обязательное поле",
        }}
        render={({ field }) => (
          <FormItem className="mb-1" label="Ключ кассы мерчанта">
            <Input
              {...field}
              placeholder="Введите ключ кассы мерчанта"
              className={classNames(
                "bg-white border-gray-300 font-medium rounded",
                errors?.payme?.merchantCashBoxKey && "border-red-500"
              )}
            />
            {errors?.payme?.merchantCashBoxKey && (
              <p className="text-red-500 text-xs mt-1">
                {errors.payme.merchantCashBoxKey.message as string}
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

const ClickForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="grid gap-y-2">
      <Controller
        name="click.serviceId"
        control={control}
        rules={{
          required: "Обязательное поле",
          pattern: {
            value: /^\d+$/,
            message: "Пароль должен состоять только из цифр",
          },
        }}
        render={({ field }) => (
          <FormItem className="mb-1" label="ID сервиса">
            <Input
              {...field}
              placeholder="Введите ID сервиса"
              type="number"
              space={false}
              className={classNames(
                "bg-white border-gray-300 font-medium rounded",
                errors?.click?.serviceId && "border-red-500"
              )}
            />
            {errors?.click?.serviceId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.click.serviceId.message as string}
              </p>
            )}
          </FormItem>
        )}
      />

      <Controller
        name="click.merchantId"
        control={control}
        rules={{
          required: "Обязательное поле",
          pattern: {
            value: /^\d+$/,
            message: "Пароль должен состоять только из цифр",
          },
        }}
        render={({ field }) => (
          <FormItem className="mb-1" label="ID мерчанта">
            <Input
              {...field}
              placeholder="Введите ID мерчанта"
              type="number"
              space={false}
              className={classNames(
                "bg-white border-gray-300 font-medium rounded",
                errors?.click?.merchantId && "border-red-500"
              )}
            />
            {errors?.click?.merchantId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.click.merchantId.message as string}
              </p>
            )}
          </FormItem>
        )}
      />

      <Controller
        name="click.merchantUserId"
        control={control}
        rules={{
          required: "Обязательное поле",
          pattern: {
            value: /^\d+$/,
            message: "Пароль должен состоять только из цифр",
          },
        }}
        render={({ field }) => (
          <FormItem className="mb-1" label="ID пользователя мерчанта">
            <Input
              {...field}
              space={false}
              placeholder="Введите ID пользователя мерчанта"
              type="number"
              className={classNames(
                "bg-white border-gray-300 font-medium rounded",
                errors?.click?.merchantUserId && "border-red-500"
              )}
            />
            {errors?.click?.merchantUserId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.click.merchantUserId.message as string}
              </p>
            )}
          </FormItem>
        )}
      />

      <Controller
        name="click.secretKey"
        control={control}
        rules={{ required: "Обязательное поле" }}
        render={({ field }) => (
          <FormItem className="mb-1" label="Секретный ключ">
            <Input
              {...field}
              placeholder="Введите секретный ключ"
              className={classNames(
                "bg-white border-gray-300 font-medium rounded",
                errors?.click?.secretKey && "border-red-500"
              )}
            />
            {errors?.click?.secretKey && (
              <p className="text-red-500 text-xs mt-1">
                {errors.click.secretKey.message as string}
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default PaymentProviderForm;
