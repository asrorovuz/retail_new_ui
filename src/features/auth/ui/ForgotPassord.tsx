import { Button, FormItem, Input } from "@/shared/ui/kit";
import PhoneInput from "@/shared/ui/kit-pro/phone-input/PhoneInput";
import { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ForgotPassord = ({ onClear }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    const { control } = useFormContext();
    const timeoutRef = useRef<number | null>(null);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(
            () => setShowPassword(false),
            3000,
        );
    };

    return (
        <>
            <h3 className="mb-3 text-slate-700 font-medium">Восстановление пароля</h3>

            <Controller
                name="username"
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
                        asterisk
                    >
                        <PhoneInput {...field} inputMode="none" />
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
                        asterisk
                    >
                        <div className="relative">
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Пароль"
                            />
                            <Button
                                type="button"
                                icon={
                                    showPassword ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )
                                }
                                onClick={togglePasswordVisibility}
                                className="absolute border-0 right-0 top-1/2 -translate-y-1/2 bg-transparent cursor-pointer text-gray-700"
                            />
                        </div>
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-x-2 w-full">
                <Button onClick={onClear} type="button">
                    Отменить
                </Button>
                <Button className="w-full" variant="solid" type="submit">
                    Сохранить
                </Button>
            </div>
        </>
    );
};

export default ForgotPassord;
