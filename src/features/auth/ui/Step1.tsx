import { Controller, useFormContext } from "react-hook-form";
import { FormItem, Input, Select } from "@/shared/ui/kit";
import PhoneInput from "@/shared/ui/kit-pro/phone-input/PhoneInput";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/shared/ui/kit";
import { useState, useRef } from "react";
import { DISTRICTS, REGIONS } from "../options";

const Step1Phone = () => {
  const { control, watch, setValue } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setShowPassword(false), 3000);
  };

  const regionCode = watch("region_code");

  return (
    <>
      {/* FIO */}
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Ф.И.О"
            invalid={!!fieldState?.error}
            errorMessage={fieldState?.error?.message}
            asterisk
          >
            <Input {...field} size="sm" placeholder="Введите свое имя." />
          </FormItem>
        )}
      />

      <Controller
        name="username"
        control={control}
        rules={{
          required: true,
          minLength: {
            value: 12,
            message: "Введите полный номер телефона",
          },
        }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Телефон"
            labelClass="text-gray-700 text-base font-medium"
            errorClassName="text-red-500"
            invalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            asterisk
          >
            <PhoneInput {...field} inputMode="none" />
          </FormItem>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Пароль"
            labelClass="text-gray-700 text-base font-medium"
            errorClassName="text-red-500"
            invalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            asterisk
          >
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                size="sm"
              />
              <Button
                type="button"
                icon={
                  showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />
                }
                onClick={togglePasswordVisibility}
                className="absolute border-0 right-0 top-1/2 -translate-y-1/2 bg-transparent cursor-pointer text-gray-700"
              />
            </div>
          </FormItem>
        )}
      />

      <Controller
        name="referral_agent_code"
        control={control}
        render={({ field, fieldState }) => (
          <FormItem
            label="Код агента"
            invalid={!!fieldState?.error}
            errorMessage={fieldState?.error?.message}
          >
            <Input {...field} placeholder="Введите код агента." size="sm"/>
          </FormItem>
        )}
      />

      {/* REGION */}
      <Controller
        name="region_code"
        control={control}
        render={({ field }) => (
          <FormItem label="Регион">
            <Select
              {...field}
              options={REGIONS || []}
              getOptionLabel={(option) => option?.name}
              getOptionValue={(option: any) => option?.id}
              value={REGIONS?.find((i) => i?.id === field?.value) || null}
              placeholder="Выберите регион"
              size="sm"
              isSearchable={false}
              onChange={(opt) => {
                field.onChange(opt?.id);
                setValue("district_code", null); // 🔥 region o‘zgarsa district reset
              }}
              isClearable
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
        )}
      />

      {/* DISTRICT */}
      <Controller
        name="district_code"
        control={control}
        render={({ field }) => (
          <FormItem label="Район / Город">
            <Select
              {...field}
              isDisabled={!regionCode}
              options={DISTRICTS?.[regionCode] || []}
              getOptionLabel={(option) => option?.name}
              getOptionValue={(option: any) => option?.id}
              isSearchable={false}
              size="sm"
              value={
                DISTRICTS?.[regionCode]?.find((i) => i?.id === field?.value) ||
                null
              }
              placeholder="Выберите район или город"
              onChange={(opt) => field.onChange(opt?.id)}
              isClearable
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
        )}
      />
    </>
  );
};

export default Step1Phone;
