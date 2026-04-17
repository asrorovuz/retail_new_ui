import { Button, Form, FormItem, Input } from "@/shared/ui/kit";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface ChangePasswordForm {
    old_pass: string;
    new_pass: string;
    repeat_pass: string;
}

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const [visible, setVisible] = useState([false, false, false]);

    const { control, handleSubmit, watch, reset } =
        useForm<ChangePasswordForm>();

    const newPass = watch("new_pass");

    const toggleVisibility = (index: number) => {
        setVisible((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const close = () => {
        onClose();
        setVisible([false, false, false]);
        reset();
    };

    const onSubmit = (data: ChangePasswordForm) => {
        console.log("Изменение пароля:", data);
        // API call shu yerda
        // reset();
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Текущий пароль */}
            <Controller
                name="old_pass"
                control={control}
                rules={{ required: "Введите текущий пароль" }}
                render={({ field, fieldState }) => (
                    <FormItem
                        label="Текущий пароль"
                        labelClass="text-gray-700 text-base font-medium"
                        className="mb-6"
                        errorClassName="text-red-500"
                        invalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                    >
                        <div className="relative">
                            <Input
                                {...field}
                                type={visible[0] ? "text" : "password"}
                                placeholder="Введите текущий пароль"
                            />
                            <Button
                                type="button"
                                icon={
                                    visible[0] ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )
                                }
                                onClick={() => toggleVisibility(0)}
                                className="absolute right-3 top-1/2 translate-x-3 -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700"
                            />
                        </div>
                    </FormItem>
                )}
            />

            {/* Новый пароль */}
            <Controller
                name="new_pass"
                control={control}
                rules={{
                    required: "Введите новый пароль",
                }}
                render={({ field, fieldState }) => (
                    <FormItem
                        label="Новый пароль"
                        labelClass="text-gray-700 text-base font-medium"
                        className="mb-6"
                        errorClassName="text-red-500"
                        invalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                    >
                        <div className="relative">
                            <Input
                                {...field}
                                type={visible[1] ? "text" : "password"}
                                placeholder="Введите новый пароль"
                            />
                            <Button
                                type="button"
                                icon={
                                    visible[1] ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )
                                }
                                onClick={() => toggleVisibility(1)}
                                className="absolute right-3 top-1/2 translate-x-3 -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700"
                            />
                        </div>
                    </FormItem>
                )}
            />

            {/* Повтор нового пароля */}
            <Controller
                name="repeat_pass"
                control={control}
                rules={{
                    required: "Повторите новый пароль",
                    validate: (value) =>
                        value === newPass || "Пароли не совпадают",
                }}
                render={({ field, fieldState }) => (
                    <FormItem
                        label="Повторите новый пароль"
                        labelClass="text-gray-700 text-base font-medium"
                        className="mb-6"
                        errorClassName="text-red-500"
                        invalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                    >
                        <div className="relative">
                            <Input
                                {...field}
                                type={visible[2] ? "text" : "password"}
                                placeholder="Повторите новый пароль"
                            />
                            <Button
                                type="button"
                                icon={
                                    visible[2] ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )
                                }
                                onClick={() => toggleVisibility(2)}
                                className="absolute right-3 top-1/2 translate-x-3 -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700"
                            />
                        </div>
                    </FormItem>
                )}
            />

            <div className="flex gap-x-2">
                <Button onClick={close} type="button" className="w-full">
                    Отменить
                </Button>
                <Button variant="solid" type="submit" className="w-full">
                    Изменить пароль
                </Button>
            </div>
        </Form>
    );
};

export default ChangePasswordModal;
