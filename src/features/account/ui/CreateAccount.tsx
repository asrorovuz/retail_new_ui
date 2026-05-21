import { messages } from "@/app/constants/message.request";
import { useAddAccount, useConfirmCode } from "@/entities/auth/repository";
import Step1Phone from "@/features/auth/ui/Step1";
import { showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import { Button, Dialog, Form, FormItem, Input } from "@/shared/ui/kit";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const CreateAccount = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenCode, setIsOpenCode] = useState(false);
    const [response, setResponse] = useState<any>(null);

    const { mutate: confirmCode, isPending } = useConfirmCode();
    const { mutate: addAccount, isPending: addPending } = useAddAccount();

    const form = useForm({
        defaultValues: {
            name: "",
            username: "",
            password: "",
            referral_agent_code: "",
            region_code: null,
            district_code: null,
            confirm_ticket: "",
            confirm_code: "",
        },
    });

    const confirmCodeValue = form.watch("confirm_code");

    const onSubmitCode = (values: any) => {
        confirmCode(values?.username, {
            onSuccess(res: any) {
                setResponse({
                    ...values,
                    confirm_ticket: res?.confirm_ticket, // save confirm_ticket for later
                });
                setIsOpenCode(true); // 🔥 modalni ochish
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    const onClose = () => {
        setResponse(null);
        setIsOpenCode(false);
        setIsOpen(false);
        form.reset();
    };

    const onSubmit = () => {
        const payload = {
            confirm_code: confirmCodeValue,
            confirm_ticket: response?.confirm_ticket,
            district_code: response?.district_code,
            name: response?.name,
            password: response?.password,
            referral_agent_code: response?.referral_agent_code,
            region_code: response?.region_code,
            username: response?.username,
        };

        addAccount(payload, {
            onSuccess() {
                onClose()
                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
            },
            onError(err) {
                showErrorMessage(err);
            },
        });
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="uppercase"
                variant="solid"
                size="sm"
            >
                Создать пользователя
            </Button>
            <Dialog width={"60vw"} height={"86vh"} onClose={onClose} isOpen={isOpen}>
                <FormProvider {...form}>
                    <Form
                        layout="vertical"
                        onSubmit={form.handleSubmit(onSubmitCode)}
                    >
                        <div className={"overflow-y-auto grid grid-cols-2 gap-x-5  mb-5"}>
                            <Step1Phone />
                        </div>

                        <div className="flex gap-x-2 justify-end mb-2">
                            <Button
                                type="button"
                                size="sm"
                                className="text-gray-700 font-medium rounded-xl"
                                onClick={onClose}
                            >
                                Назад
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                size="sm"
                                loading={isPending}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl"
                            >
                                Далее
                            </Button>
                        </div>
                    </Form>
                </FormProvider>
                <FullKeyboard/>
            </Dialog>
            <Dialog
                width={"60vw"}
                isOpen={isOpenCode}
                
                onClose={onClose}
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
                                    message: "Код должен состоять из 6 цифр",
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <FormItem
                                    invalid={!!fieldState.error}
                                    errorMessage={fieldState.error?.message}
                                >
                                    <Input
                                        {...field}
                                        placeholder="Введите SMS-код"
                                        maxLength={6}
                                        inputMode="numeric"
                                        className="text-center text-2xl tracking-[10px]"
                                        onChange={(e) => {
                                            const val = e.target.value.replace(
                                                /\D/g,
                                                "",
                                            );
                                            field.onChange(val);
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="button"
                        variant="solid"
                        loading={isPending || addPending}
                        disabled={(confirmCodeValue?.length || 0) !== 6}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        onClick={onSubmit}
                    >
                        Подтвердить
                    </Button>
                </div>
                <FullKeyboard />
            </Dialog>
        </>
    );
};

export default CreateAccount;
