import { Controller, FormProvider, useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useNavigate, useOutletContext } from "react-router";
import { Button, Form, FormItem, Input } from "@/shared/ui/kit";
import type { LoginPayload } from "@/@types/auth/login";
import { useState, useEffect, useRef } from "react";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";

type OutletContextType = {
  refetch: any;
  isRegistered: boolean;
};

const Login = () => {
  const { login, loading } = useAuthContext();
  const { isRegistered } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const form = useForm<LoginPayload>({
    defaultValues: { username: "", password: "", certificate: null },
  });

  const onSubmit = async (formData: LoginPayload) => {
    try {
      await login(formData);
      showSuccessMessage(
        messages.uz.SUCCESS_MESSAGE,
        messages.ru.SUCCESS_MESSAGE
      );
      navigate("/sales");
    } catch (err: any) {
      showErrorMessage(err);
    }
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
  }, []);

  return (
    <div className="w-full max-w-[512px]">
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h3 className="font-bold text-2xl mb-6 !text-gray-700 border-t-4 border-blue-500 pt-4">
          Добро пожаловать
        </h3>
        <FormProvider {...form}>
          <Form layout="vertical" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Username */}
            <Controller
              name="username"
              control={form.control}
              rules={{ required: "Введите имя пользователя" }}
              render={({ field, fieldState }) => (
                <FormItem
                  label="Имя"
                  labelClass="text-gray-700 text-base font-medium"
                  className="mb-6"
                  errorClassName="text-red-500"
                  invalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                >
                  <Input {...field} placeholder="Имя пользовательства" />
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
                      icon={
                        showPassword ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )
                      }
                      onClick={togglePasswordVisibility}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent cursor-pointer text-gray-700"
                    ></Button>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit button */}
            <FormItem>
              <Button
                type="submit"
                variant="solid"
                loading={loading}
                block
                className="h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl mt-2"
              >
                Войти
              </Button>
            </FormItem>
          </Form>
        </FormProvider>
      </div>
      <div className="flex justify-between text-[16px] text-gray-700 font-normal">
        <a href="tel:+998712006363">+998 71 200 63 63</a>
        <a target="_blank" href="https://t.me/HippoEDI">
          Телеграм канал
        </a>
      </div>
    </div>
  );
};

export default Login;
