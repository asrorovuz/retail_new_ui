import { Controller, useFormContext } from "react-hook-form";
import { Button, FormItem, Input, Select } from "@/shared/ui/kit";
import { useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Step2 = ({ item }: { item: any[] }) => {
  const { control, watch } = useFormContext();
  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const togglePasswordVisibility = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setter(false), 3000);
  };

  return (
    <>
      {/* Organization */}
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
              options={item || []}
              getOptionLabel={(option) => option?.name}
              value={item?.find((i) => i?.id === field?.value) || null}
              placeholder="Введите название организации."
              onChange={(opt) => field.onChange(opt?.id)}
            />
          </FormItem>
        )}
      />

      {/* FIO */}
      <Controller
        name="name"
        render={({ field, fieldState }) => (
          <FormItem
            label="Ф.И.О"
            invalid={!!fieldState?.error}
            errorMessage={fieldState?.error?.message}
            asterisk
          >
            <Input {...field} placeholder="Введите свое имя." />
          </FormItem>
        )}
      />

      {/* Username */}
      <Controller
        name="username"
        render={({ field, fieldState }) => (
          <FormItem
            label="Имя пользователя"
            invalid={!!fieldState?.error}
            errorMessage={fieldState?.error?.message}
            asterisk
          >
            <Input {...field} placeholder="Введите имя пользователя" />
          </FormItem>
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        rules={{ required: "Введите пароль" }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Пароль"
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
                icon={showPassword ? <FiEyeOff /> : <FiEye />}
                onClick={() =>
                  togglePasswordVisibility(setShowPassword)
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent"
              />
            </div>
          </FormItem>
        )}
      />

      {/* Confirm Password */}
      <Controller
        name="confirm_password"
        control={control}
        rules={{
          required: "Подтвердите пароль",
          validate: (value) =>
            value === password || "Пароли не совпадают",
        }}
        render={({ field, fieldState }) => (
          <FormItem
            label="Подтвердите пароль"
            invalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          >
            <div className="relative">
              <Input
                {...field}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Повторите пароль"
              />
              <Button
                type="button"
                icon={
                  showConfirmPassword ? <FiEyeOff /> : <FiEye />
                }
                onClick={() =>
                  togglePasswordVisibility(setShowConfirmPassword)
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent"
              />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default Step2;
