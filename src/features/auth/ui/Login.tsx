import { Controller, FormProvider, useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useNavigate, useOutletContext } from "react-router";
import { Button, Dialog, Form, FormItem, Input } from "@/shared/ui/kit";
import type { LoginPayload } from "@/@types/auth/login";
import { useState, useEffect, useRef } from "react";
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
    const [activeIndex, setActiveIndex] = useState(0);

    const timeoutRef = useRef<number | null>(null);

    const { mutate: confirmCode, isPending } = useConfirmCode();
    const { mutate: resetPassord, isPending: isPendingReset } = useResetPass();

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
            certificate: null,
            confirm_code: "",
            confirm_ticket: "",
        },
    });

    const confirmCodeValue = form.watch("confirm_code");

    const onSubmitForgot = (values: any) => {
        confirmCode(values?.username, {
            onSuccess(res: any) {
                const payload = {
                    username: values?.username,
                    new_password: values?.password,
                    confirm_code: confirmCodeValue,
                    confirm_ticket: res?.confirm_ticket,
                };
                setResponse(payload);
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
                                <ForgotPassord onClear={onClear} />
                                <Dialog
                                    width={"60vw"}
                                    isOpen={isOpenCode}
                                    onClose={() => setIsOpenCode(false)}
                                >
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-center">
                                            Введите SMS-код
                                        </h3>

                                        <div className="flex justify-center gap-2 mb-6">
                                            <Controller
                                                name="confirm_code"
                                                control={form.control}
                                                rules={{
                                                    required: "Введите код",
                                                    minLength: {
                                                        value: 6,
                                                        message:
                                                            "Код должен состоять из 6 цифр",
                                                    },
                                                }}
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <FormItem
                                                        invalid={
                                                            !!fieldState.error
                                                        }
                                                        errorMessage={
                                                            fieldState.error
                                                                ?.message
                                                        }
                                                    >
                                                        <Input
                                                            {...field}
                                                            placeholder="Введите SMS-код"
                                                            maxLength={6}
                                                            inputMode="numeric"
                                                            className="text-center text-2xl tracking-[10px]"
                                                            onChange={(e) => {
                                                                const val =
                                                                    e.target.value.replace(
                                                                        /\D/g,
                                                                        "",
                                                                    );
                                                                field.onChange(
                                                                    val,
                                                                );
                                                            }}
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="solid"
                                            loading={
                                                isPendingReset || isPending
                                            }
                                            disabled={
                                                (confirmCodeValue?.length ||
                                                    0) !== 6
                                            }
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
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
