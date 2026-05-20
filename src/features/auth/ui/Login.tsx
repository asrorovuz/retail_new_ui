import { Controller, FormProvider, useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useNavigate, useOutletContext } from "react-router";
import { Button, Dialog, Form, FormItem, Input } from "@/shared/ui/kit";
import type { LoginPayload } from "@/@types/auth/login";
import React, { useState, useEffect, useRef } from "react";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import PhoneInput from "@/shared/ui/kit-pro/phone-input/PhoneInput";
import ForgotPassord from "./ForgotPassord";
import { useConfirmCode, useResetPass } from "@/entities/auth/repository";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";

type OutletContextType = {
    refetch: any;
    isRegistered: boolean;
};

const Login = () => {
    const { login, loading } = useAuthContext();
    const { isRegistered } = useOutletContext<OutletContextType>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);
    const [isOpenCode, setIsOpenCode] = useState(false);
    const [response, setResponse] = useState<any>(null);

    const timeoutRef = useRef<number | null>(null);

    const { mutate: confirmCode, isPending } = useConfirmCode();
    const { mutate: resetPassord, isPending: isPendingReset } = useResetPass();

    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
            new_password: "",
            confirm_new_password: "",
            certificate: null,
            confirm_code: "",
            confirm_ticket: "",
        },
    });

    const confirmCodeValue = form.watch("confirm_code");

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...otpValues];
        next[index] = digit;
        setOtpValues(next);
        form.setValue("confirm_code", next.join(""));
        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
        const next = [...otpValues];
        pasted.split("").forEach((ch, i) => {
            next[i] = ch;
        });
        setOtpValues(next);
        form.setValue("confirm_code", next.join(""));
        const lastFilled = Math.min(pasted.length, 5);
        otpRefs.current[lastFilled]?.focus();
    };

    const onSubmitForgot = (values: any) => {
        confirmCode(values?.username, {
            onSuccess(res: any) {
                const payload = {
                    username: values?.username,
                    new_password: values?.new_password,
                    confirm_code: confirmCodeValue,
                    confirm_ticket: res?.confirm_ticket,
                };
                setResponse(payload);
                setOtpValues(["", "", "", "", "", ""]);
                form.setValue("confirm_code", "");
                setTimeout(() => otpRefs.current[0]?.focus(), 150);
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    const onResetPass = () => {
        if (!response) return;

        const confirm_code = form.getValues("confirm_code");

        const payload = {
            ...response,
            confirm_code,
        };

        resetPassord(payload, {
            onSuccess() {
                setIsOpenCode(false);
                setForgotPass(false);
                form.reset();
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    const onSubmit = async (formData: LoginPayload) => {
        if (forgotPass) {
            setIsOpenCode(true);
            onSubmitForgot(formData);
        } else {
            const payload = {
                username: formData?.username,
                password: formData?.password,
                certificate: null,
            };
            try {
                await login(payload);
                navigate("/sales");
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
            } catch (err: any) {
                showErrorMessage(err);
            }
        }
    };

    const onClear = () => {
        setForgotPass(false);
        form.reset();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);

        // Agar avvalgi timeout bo'lsa, uni bekor qilish
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 3 soniyadan keyin parolni yashirish
        timeoutRef.current = window.setTimeout(() => {
            setShowPassword(false);
        }, 3000);
    };

    // Component unmount bo'lganda timeout ni tozalash
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isRegistered) {
            navigate("/register");
        }
    }, [isRegistered]);

    return (
        <div className="w-full max-w-[512px] p-6">
            <div className="bg-white mb-6 border-t-4 border-blue-500 pt-4">
                <FormProvider {...form}>
                    <Form
                        layout="vertical"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {forgotPass ? (
                            <>
                                {!isOpenCode && (
                                    <ForgotPassord onClear={onClear} />
                                )}

                                <Dialog
                                    width={400}
                                    isOpen={isOpenCode}
                                    onClose={() => setIsOpenCode(false)}
                                >
                                    <div className="flex flex-col items-center gap-6 px-6 pt-2 pb-6">
                                        <div className="text-center">
                                            <p className="text-base text-gray-500 mt-1">
                                                Введите 6-значный код,
                                                отправленный на ваш номер
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            {otpValues.map((val, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => {
                                                        otpRefs.current[index] =
                                                            el;
                                                    }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={val}
                                                    onChange={(e) =>
                                                        handleOtpChange(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleOtpKeyDown(
                                                            index,
                                                            e,
                                                        )
                                                    }
                                                    onPaste={
                                                        index === 0
                                                            ? handleOtpPaste
                                                            : undefined
                                                    }
                                                    className={[
                                                        "w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-colors",
                                                        val
                                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                                            : "border-gray-300 bg-white text-gray-800",
                                                        "focus:border-blue-500",
                                                    ].join(" ")}
                                                />
                                            ))}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="solid"
                                            loading={
                                                isPendingReset || isPending
                                            }
                                            disabled={
                                                confirmCodeValue?.length !== 6
                                            }
                                            className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                                            onClick={onResetPass}
                                        >
                                            Подтвердить
                                        </Button>
                                    </div>
                                    <FullKeyboard />
                                </Dialog>
                            </>
                        ) : (
                            <>
                                {/* Username */}
                                <Controller
                                    name="username"
                                    control={form.control}
                                    rules={{
                                        required: "Поле телефона обязательно",
                                        minLength: {
                                            value: 12,
                                            message:
                                                "Введите полный номер телефона",
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <FormItem
                                            label="Телефон"
                                            labelClass="text-gray-700 text-base font-medium"
                                            className="mb-6"
                                            errorClassName="text-red-500"
                                            invalid={!!fieldState.error}
                                            errorMessage={
                                                fieldState.error?.message
                                            }
                                        >
                                            <PhoneInput
                                                {...field}
                                                inputMode="none"
                                            />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <Controller
                                    name="password"
                                    control={form.control}
                                    rules={{ required: "Введите пароль" }}
                                    render={({ field, fieldState }) => (
                                        <FormItem
                                            label="Пароль"
                                            labelClass="text-gray-700 text-base font-medium"
                                            className="!mb-4"
                                            errorClassName="text-red-500"
                                            invalid={!!fieldState.error}
                                        >
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Пароль"
                                                />
                                                <Button
                                                    type="button"
                                                    icon={
                                                        showPassword ? (
                                                            <FiEyeOff
                                                                size={20}
                                                            />
                                                        ) : (
                                                            <FiEye size={20} />
                                                        )
                                                    }
                                                    onClick={
                                                        togglePasswordVisibility
                                                    }
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent cursor-pointer text-gray-700"
                                                ></Button>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        setForgotPass(true)
                                                    }
                                                    className="bg-transparent !text-blue-500 p-0"
                                                    variant="plain"
                                                >
                                                    Forgot password
                                                </Button>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Submit button */}
                                <FormItem>
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        block
                                        loading={loading}
                                        className="h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl mt-2"
                                    >
                                        Войти
                                    </Button>
                                </FormItem>
                            </>
                        )}
                    </Form>
                </FormProvider>
            </div>
            <div className="flex justify-between text-[16px] text-gray-700 font-normal">
                <a href="tel:+998712006363">+998 71 200 63 63</a>
                <a
                    target="_blank"
                    href="https://t.me/hippo_uz"
                    rel="noreferrer"
                >
                    Телеграм канал
                </a>
            </div>
        </div>
    );
};

export default Login;
