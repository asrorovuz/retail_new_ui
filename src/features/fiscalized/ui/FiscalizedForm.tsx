import {
  CashRegisterProviderTypeArca,
  CashRegisterProviderTypeEPos,
  CashRegisterProviderTypeHippoPos,
  CashRegisterProviderTypes,
  CashRegisterProviderTypeSimurg,
  GetCashRegisterProviderLogo,
  GetCashRegisterProviderName,
} from "@/shared/lib/cashProvider";
import classNames from "@/shared/lib/classNames";
import { FormItem, Input, Select, Switcher } from "@/shared/ui/kit";
import {
  Controller,
  FormProvider,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Fragment } from "react/jsx-runtime";

interface CashRegisterFormData {
  id?: string;
  type: number;
  name: string;
  isEnabled: boolean;
  arca?: {
    address: string;
    username: string;
    password: string;
  };
  simurg?: {
    comPortNumber: string;
    cashierPassword: string;
  };
  hippopos?: {
    companyName: string;
    companyAddress: string;
    companyInn: string;
    printerSize: string;
  };
  epos?: {
    companyName: string;
    companyAddress: string;
    companyInn: string;
    printerSize: string;
  };
}

const formatOptionLabel = (cashRegisterProvider: { type: number }) => {
  return (
    <div className="flex items-center p-0">
      {GetCashRegisterProviderLogo(Number(cashRegisterProvider.type)) ? (
        <img
          width={60}
          src={GetCashRegisterProviderLogo(cashRegisterProvider.type)}
          alt={String(cashRegisterProvider?.type)}
        />
      ) : (
        <span>{GetCashRegisterProviderName(cashRegisterProvider.type)}</span>
      )}
    </div>
  );
};

const printerSizeOptions = [
  { value: "80", label: "80" },
  { value: "58", label: "58" },
];

const CashRegisterForm = () => {
  const form = useFormContext<CashRegisterFormData>();
  const cashRegisterType = useWatch({ name: "type" });
  const isEditing = useWatch({ name: "id" });
  const showArca = Number(cashRegisterType) === CashRegisterProviderTypeArca;
  const showHippoPos =
    Number(cashRegisterType) === CashRegisterProviderTypeHippoPos;
  const showEPos = Number(cashRegisterType) === CashRegisterProviderTypeEPos;
  const showSimurg =
    Number(cashRegisterType) === CashRegisterProviderTypeSimurg;

  return (
    <Fragment>
      <FormProvider {...form}>
        <Controller
          control={form.control}
          name={"type"}
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <div className="mb-2">
              <FormItem label="Тип ККМ">
                <Select
                  autoFocus
                  openMenuOnFocus
                  hideSelectedOptions
                  isSearchable={false}
                  isDisabled={isEditing}
                  options={CashRegisterProviderTypes}
                  classNamePrefix="react-select"
                  formatOptionLabel={formatOptionLabel}
                  getOptionValue={(option) => String(option.type)}
                  getOptionLabel={(option) => option.name}
                  onChange={(option) => field.onChange(option?.type)}
                  className={classNames({
                    "border-red-500": form.formState.errors?.type,
                  })}
                  value={CashRegisterProviderTypes.find(
                    (item) => item.type === field.value
                  )}
                  placeholder="Введите тип ККМ"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </FormItem>
              {form.formState.errors?.type && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>
          )}
        />
      </FormProvider>
      <div className="grid gap-y-2">
        <div className="mb-2">
          <FormItem label="Название">
            <Controller
              name="name"
              control={form.control}
              rules={{ required: "Обязательное поле" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Введите название"
                  className={classNames(
                    "bg-white border-gray-300 font-normal rounded",
                    {
                      "border-red-500": form.formState.errors?.arca?.username,
                    }
                  )}
                />
              )}
            />
          </FormItem>

          {form.formState.errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {showArca && <ArcaForm />}
        {showSimurg && <SimurgForm />}
        {showHippoPos && <HippoPosForm />}
        {showEPos && <EPosForm />}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <FormItem
          layout="horizontal"
          label={"По умолчанию включено"}
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

export default CashRegisterForm;

const ArcaForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CashRegisterFormData>();

  return (
    <>
      {/* ADDRESS */}
      <div className="mb-2">
        <FormItem label="Адрес">
          <Controller
            name="arca.address"
            control={control}
            rules={{ required: "Обязательное поле" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите адрес"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.arca?.address }
                )}
              />
            )}
          />
        </FormItem>

        {errors?.arca?.address && (
          <p className="text-red-500 text-sm mt-1">
            {errors.arca.address.message}
          </p>
        )}
      </div>

      {/* USERNAME */}
      <div className="mb-2">
        <FormItem label="Логин">
          <Controller
            name="arca.username"
            control={control}
            rules={{ required: "Обязательное поле" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите логин"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.arca?.username }
                )}
              />
            )}
          />
        </FormItem>

        {errors?.arca?.username && (
          <p className="text-red-500 text-sm mt-1">
            {errors.arca.username.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="mb-2">
        <FormItem label="Пароль">
          <Controller
            name="arca.password"
            control={control}
            rules={{
              required: "Обязательное поле",
              pattern: {
                value: /^\d+$/,
                message: "Пароль должен состоять только из цифр",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="Введите пароль"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.arca?.password }
                )}
              />
            )}
          />
        </FormItem>

        {errors?.arca?.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.arca.password.message}
          </p>
        )}
      </div>
    </>
  );
};

const SimurgForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CashRegisterFormData>();

  return (
    <>
      <div className="mb-2">
        <FormItem label="Номер COM-порта">
          <Controller
            name="simurg.comPortNumber"
            control={control}
            rules={{
              required: "Обязательное поле",
              pattern: {
                value: /^\d+$/,
                message: "Номер порта должен состоять только из цифр",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                space={false}
                placeholder="Введите номер COM-порта"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.simurg?.comPortNumber }
                )}
              />
            )}
          />
          {errors?.simurg?.comPortNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.simurg.comPortNumber.message}
            </p>
          )}
        </FormItem>
      </div>

      <div className="mb-2">
        <FormItem label="Пароль кассира">
          <Controller
            name="simurg.cashierPassword"
            control={control}
            rules={{
              required: "Обязательное поле",
              pattern: {
                value: /^\d+$/,
                message: "Пароль должен состоять только из цифр",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="Введите пароль кассира"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.simurg?.cashierPassword }
                )}
              />
            )}
          />
          {errors?.simurg?.cashierPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.simurg.cashierPassword.message}
            </p>
          )}
        </FormItem>
      </div>
    </>
  );
};

const HippoPosForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CashRegisterFormData>();

  return (
    <>
      <div className="mb-2">
        <FormItem label="Название организации">
          <Controller
            name="hippopos.companyName"
            control={control}
            rules={{ required: "Обязательное поле" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите название организации"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.hippopos?.companyName }
                )}
              />
            )}
          />
          {errors?.hippopos?.companyName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.hippopos.companyName.message}
            </p>
          )}
        </FormItem>
      </div>

      <div className="mb-2">
        <FormItem label="Адрес организации">
          <Controller
            name="hippopos.companyAddress"
            control={control}
            rules={{ required: "Обязательное поле" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите адрес организации"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.hippopos?.companyAddress }
                )}
              />
            )}
          />
          {errors?.hippopos?.companyAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.hippopos.companyAddress.message}
            </p>
          )}
        </FormItem>
      </div>

      <div className="mb-2">
        <FormItem label="Инн организации">
          <Controller
            name="hippopos.companyInn"
            control={control}
            rules={{
              required: "Обязательное поле",
              pattern: {
                value: /^\d+$/,
                message: "ИНН должен состоять только из цифр",
              },
              minLength: {
                value: 6,
                message: "ИНН должен содержать минимум 6 цифр",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите инн организации"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.hippopos?.companyInn }
                )}
              />
            )}
          />
          {errors?.hippopos?.companyInn && (
            <p className="text-red-500 text-sm mt-1">
              {errors.hippopos.companyInn.message}
            </p>
          )}
        </FormItem>
      </div>

      <div className="mb-2">
        <Controller
          name="hippopos.printerSize"
          control={control}
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <>
              <FormItem label="Размер печатаемого чека">
                <Select
                  placeholder="Введите размер печатаемого чека"
                  className={classNames(
                    "bg-white border-gray-300 font-medium rounded",
                    { "border-red-500": errors?.hippopos?.printerSize }
                  )}
                  options={printerSizeOptions}
                  value={printerSizeOptions.find(
                    (opt) => opt.value === field.value
                  ) ?? printerSizeOptions?.[0]}
                  onChange={(newValue) => field.onChange(newValue?.value)}
                  onBlur={field.onBlur}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </FormItem>
              {errors?.hippopos?.printerSize && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hippopos.printerSize.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};

const EPosForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CashRegisterFormData>();

  return (
    <>
      <div className="mb-2">
        <FormItem label="Название организации">
          <Controller
            name="epos.companyName"
            control={control}
            rules={{ required: "Обязательное поле" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите название организации"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.epos?.companyName }
                )}
              />
            )}
          />
          {errors?.epos?.companyName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.epos.companyName.message}
            </p>
          )}
        </FormItem>
      </div>

      <div className="mb-2">
        <FormItem label="Адрес организации">
          <Controller
            name="epos.companyAddress"
            control={control}
            rules={{ required: "Обязательное поле" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите адрес организации"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.epos?.companyAddress }
                )}
              />
            )}
          />
          {errors?.epos?.companyAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.epos.companyAddress.message}
            </p>
          )}
        </FormItem>
      </div>

      <div className="mb-2">
        <FormItem label="Инн организации">
          <Controller
            name="epos.companyInn"
            control={control}
            rules={{
              required: "Обязательное поле",
              pattern: {
                value: /^\d+$/,
                message: "ИНН должен состоять только из цифр",
              },
              minLength: {
                value: 6,
                message: "ИНН должен содержать минимум 6 цифр",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите инн организации"
                className={classNames(
                  "bg-white border-gray-300 font-medium rounded",
                  { "border-red-500": errors?.epos?.companyInn }
                )}
              />
            )}
          />
          {errors?.epos?.companyInn && (
            <p className="text-red-500 text-sm mt-1">
              {errors.epos.companyInn.message}
            </p>
          )}
        </FormItem>
      </div>

      <div className="mb-2">
        <Controller
          name="epos.printerSize"
          control={control}
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <>
              <FormItem label="Размер печатаемого чека">
                <Select
                  placeholder="Введите размер печатаемого чека"
                  className={classNames(
                    "bg-white border-gray-300 font-medium rounded",
                    { "border-red-500": errors?.epos?.printerSize }
                  )}
                  options={printerSizeOptions}
                  value={printerSizeOptions.find(
                    (opt) => opt.value === field.value
                  )}
                  onChange={(newValue) => field.onChange(newValue?.value)}
                  onBlur={field.onBlur}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </FormItem>
              {errors?.epos?.printerSize && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.epos.printerSize.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};
