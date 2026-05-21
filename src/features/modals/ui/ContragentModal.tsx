import { messages } from "@/app/constants/message.request";
import {
    ContactTypePhoneNumber,
    CurrencyCodeUZS,
} from "@/app/constants/payment.types";
import {
    useCreateContractor,
    useUpdateContractor,
} from "@/entities/auth/repository";
import type { ContragentType } from "@/pages/counterparty/ui/Counterparty";
import { showErrorLocalMessage, showErrorMessage, showSuccessMessage } from "@/shared/lib/showMessage";
import {
    Button,
    Checkbox,
    Dialog,
    Form,
    FormItem,
    Input,
} from "@/shared/ui/kit";
import PhoneInput from "@/shared/ui/kit-pro/phone-input/PhoneInput";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";
import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

type FormType = {
    is_customer: boolean;
    is_supplier: boolean;
    is_default: boolean;
    name: string;
    phones: string[];
    debt: string;
};

const initialForm = {
    is_customer: false,
    is_supplier: false,
    name: "",
    phones: ["998"],
    debt: "",
};

const ContragentModal = ({
    isOpen,
    type,
    contragent,
    setContragent,
    setIsOpen,
    setType,
    setContractorId,
}: {
    isOpen: boolean;
    type: "add" | "edit";
    contragent?: ContragentType | null;
    setContragent?: (val: ContragentType | null) => void;
    setIsOpen: (val: boolean) => void;
    setType?: (val: "add" | "edit") => void;
    setContractorId?: (val: number | null) => void;
}) => {
    const { mutate: createMutate } = useCreateContractor();
    const { mutate: updateMutate } = useUpdateContractor();

    const { control, handleSubmit, reset } = useForm<FormType>({
        defaultValues: initialForm,
    });

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: "phones",
    });

    const onClose = () => {
        reset();
        setIsOpen(false);
        if (setType) {
            setType("add");
        }
        if (setContragent) {
            setContragent(null);
        }
    };

    const onSubmit = (payload: FormType) => {
        if (!payload.is_customer && !payload.is_supplier) {
            showErrorLocalMessage(
                "Выберите тип контрагента: Клиент или Поставщик",
            );
            return;
        }
        const data = {
            is_customer: payload?.is_customer,
            is_default: false,
            is_supplier: payload?.is_supplier,
            name: payload?.name,
            debt_state: {
                amount: +payload?.debt,
                currency_code: CurrencyCodeUZS,
            },
            contacts: payload?.phones
                ?.map((item) => {
                    return {
                        type: ContactTypePhoneNumber,
                        value: item.slice(0, 12),
                    };
                })
                ?.filter((item) => item?.value?.length === 12),
        };

        if (type === "add") {
            createMutate(data, {
                onSuccess(data: any) {
                    showSuccessMessage(
                        messages.uz.SUCCESS_MESSAGE,
                        messages.ru.SUCCESS_MESSAGE,
                    );

                    if (setContractorId) {
                        setContractorId(data?.id ?? null);
                    }
                    onClose();
                },
                onError(error) {
                    showErrorMessage(error);
                },
            });
        }

        if (type === "edit" && contragent?.id) {
            updateMutate(
                {
                    id: contragent?.id,
                    data: data,
                },
                {
                    onSuccess() {
                        showSuccessMessage(
                            messages.uz.SUCCESS_MESSAGE,
                            messages.ru.SUCCESS_MESSAGE,
                        );
                        onClose();
                    },
                    onError(error) {
                        showErrorMessage(error);
                    },
                },
            );
        }
    };

    useEffect(() => {
        if (contragent && type === "edit") {
            reset({
                is_customer: contragent.is_customer,
                is_supplier: contragent.is_supplier,
                is_default: false,
                name: contragent.name,
                debt: String(
                    contragent.debts?.reduce(
                        (acc, item) => acc + item?.amount,
                        0,
                    ) ?? "",
                ),
                phones: contragent?.contacts?.length
                    ? contragent.contacts.map((p) => p.value)
                    : ["998"],
            });
        } else {
            reset(initialForm);
        }
    }, [contragent, type, reset]);

    return (
        <Dialog
            title={
                type === "add"
                    ? `Добавить контрагента`
                    : "Редактировать контрагента"
            }
            width={"80vw"}
            height={"80vh"}
            onClose={onClose}
            isOpen={isOpen}
        >
            <Form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
                className="flex flex-col justify-between h-full"
            >
                <div className="h-[26vh] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-x-2">
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field, fieldState }) => (
                                <FormItem
                                    label="Название контрагента"
                                    asterisk
                                    invalid={!!fieldState?.error}
                                    errorMessage={fieldState?.error?.message}
                                >
                                    <Input
                                        {...field}
                                        type="text"
                                        autoComplete="off"
                                        size="sm"
                                        inputMode="none"
                                        autoFocus={!!fieldState?.error}
                                        invalid={!!fieldState?.error}
                                        placeholder="Введите название контрагента"
                                        className="w-full"
                                    />
                                </FormItem>
                            )}
                        />
                        <Controller
                            name="debt"
                            control={control}
                            render={({ field }) => (
                                <FormItem label="Долг">
                                    <Input
                                        {...field}
                                        type="number"
                                        disabled={type === "edit"}
                                        autoComplete="off"
                                        inputMode="none"
                                        space={false}
                                        size="sm"
                                        placeholder="Введите долг"
                                        className="w-full"
                                    />
                                </FormItem>
                            )}
                        />
                        {/* Телефонные номера */}
                        <FormItem
                            extra={
                                <div className="form-label flex justify-between w-full mb-1.5 min-w-[250px]">
                                    <span>Тел.</span>
                                    <div
                                        className="text-blue-500"
                                        onClick={() => append("")}
                                    >
                                        Добавить
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-y-2">
                                {fields.map((fieldItem, index) => (
                                    <div
                                        key={fieldItem.id}
                                        className="flex gap-2 items-center"
                                    >
                                        <Controller
                                            name={`phones.${index}`}
                                            control={control}
                                            render={({ field }) => (
                                                <PhoneInput
                                                    {...field}
                                                    inputMode="none"
                                                />
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => remove(index)}
                                        >
                                            🗑
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                    </div>
                    <div className="grid grid-cols-3 mb-5">
                        <Controller
                            name="is_customer"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                    }}
                                >
                                    Клиент
                                </Checkbox>
                            )}
                        />
                        <Controller
                            name="is_supplier"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                    }}
                                >
                                    Поставщик
                                </Checkbox>
                            )}
                        />
                        {/* <Controller
                            name="is_default"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >
                                    Постоянный контрагент
                                </Checkbox>
                            )}
                        /> */}
                    </div>
                </div>
                <div className="flex justify-end items-center gap-x-2 mb-4">
                    <Button
                        // loading={createProductPending || updateLoading}
                        type="button"
                        variant="default"
                        size="sm"
                        className="self-end"
                        onClick={onClose}
                    >
                        Отменить
                    </Button>
                    <Button
                        // loading={createProductPending || updateLoading}
                        type="submit"
                        variant="solid"
                        size="sm"
                        className="self-end"
                    >
                        Сохранить
                    </Button>
                </div>
                <FullKeyboard />
            </Form>
        </Dialog>
    );
};

export default ContragentModal;
