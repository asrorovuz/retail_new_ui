import { Controller, useFormContext } from "react-hook-form";
import { FormItem, Input } from "@/shared/ui/kit";
import PhoneInput from "@/shared/ui/kit-pro/phone-input/PhoneInput";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/shared/ui/kit";
import { useState, useRef } from "react";

const Step1Phone = () => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setShowPassword(false), 3000);
  };

  return (
    <>
      <Controller
        name="login"
        control={control}
        rules={{
          required: "Поле телефона обязательно",
          minLength: {
            value: 12,
            message: "Введите полный номер телефона",
          },
        }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Телефон"
            labelClass="text-gray-700 text-base font-medium"
            className="mb-6"
            errorClassName="text-red-500"
            invalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          >
            <PhoneInput {...field} phone placeholder="+998 90 123 45 67" />
          </FormItem>
        )}
      />

      <Controller
        name="pass"
        control={control}
        rules={{ required: "Введите пароль" }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Пароль"
            labelClass="text-gray-700 text-base font-medium"
            className="mb-6"
            errorClassName="text-red-500"
            invalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          >
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
              />
              <Button
                type="button"
                variant="plain"
                icon={showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent cursor-pointer text-gray-700"
              />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default Step1Phone;
