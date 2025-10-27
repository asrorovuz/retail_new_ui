import { Controller, useFormContext } from "react-hook-form";
import { Button, FormItem, Input, Select } from "@/shared/ui/kit";
import { useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Step2 = ({ item }: {item: any[]}) => {
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
        name="organization_id"
        control={control}
        render={({ field, fieldState }) => (
          <FormItem
            label="Организация"
            invalid={!!fieldState?.error}
            errorMessage={fieldState?.error?.message}
          >
            <Select
              {...field}
              options={item|| []}
              getOptionLabel={(option) => option?.name}
              value={item?.find((i) => i.id === field.value) || null}
              placeholder="Введите название организации."
              onChange={(selectedOption) => field?.onChange(selectedOption?.id)}
            />
          </FormItem>
        )}
      />

      <Controller
        name="name"
        render={({ field, fieldState }) => (
          <FormItem
            label={"Ф.И.О"}
            invalid={Boolean(fieldState?.error)}
            errorMessage={fieldState?.error?.message}
            asterisk={true}
          >
            <Input
              type="text"
              autoComplete="off"
              placeholder={"Введите свое имя."}
              {...field}
            />
          </FormItem>
        )}
      />

      <Controller
        name="username"
        render={({ field, fieldState }) => (
          <FormItem
            label={"Имя пользователя"}
            invalid={Boolean(fieldState?.error)}
            errorMessage={fieldState?.error?.message}
            asterisk={true}
          >
            <Input
              type="text"
              autoComplete="off"
              placeholder={"Введите имя пользователя"}
              {...field}
            />
          </FormItem>
        )}
      />

      <Controller
        name="password"
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
                icon={
                  showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />
                }
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

export default Step2;
