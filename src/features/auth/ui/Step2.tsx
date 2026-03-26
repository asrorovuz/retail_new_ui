import {
    Controller,
    FormProvider,
    useForm,
    useFormContext,
} from "react-hook-form";
import { Button, Dialog, Form, FormItem, Input, Select } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import { useRegisterOrg } from "@/entities/auth/repository";
import { storeTypeOptions } from "../options";

const Step2 = ({
    item,
    response,
    nextStep,
}: {
    item: any[];
    response: any;
    nextStep: any;
}) => {
    const { control } = useFormContext();

    const [isOpen, setIsOpen] = useState(false);

    const { mutate: registerOrgMutate, isPending: regOrgPending } =
        useRegisterOrg();

    const methods = useForm({
        defaultValues: {
            name: "",
            store_type: null,
        },
    });

    const onClose = () => {
        setIsOpen(false);
        methods.reset();
    };

    const createOrg = (data: any) => {
        registerOrgMutate(
            {
                name: data?.name,
                owner_account_id: response?.id,
                referral_agent_code: response?.referral_agent_code,
                store_type: data?.store_type,
            },
            {
                onSuccess() {
                    onClose();
                    nextStep();
                },
            },
        );
    };

    useEffect(() => {
        if (!item || item.length === 0) {
            setIsOpen(true);
        }
    }, [item]);

    return (
        <>
            {/* Organization */}
            <Controller
                name="organization"
                control={control}
                rules={{ required: "Выберите организацию" }}
                render={({ field, fieldState }) => (
                    <FormItem
                        label="Организация"
                        invalid={!!fieldState?.error}
                        errorMessage={fieldState?.error?.message}
                    >
                        <Select
                            {...field}
                            options={item || []}
                            isSearchable={false}
                            getOptionLabel={(option) => option?.name}
                            // value={item?.find((i) => i?.id === field?.value) || null}
                            placeholder="Введите название организации."
                            onChange={(opt) => field.onChange(opt)}
                        />
                    </FormItem>
                )}
            />

            <Button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full"
                variant="solid"
            >
                + Создать организацию
            </Button>

            <Dialog
                width={"60vw"}
                title={"Создать организацию"}
                onClose={onClose}
                isOpen={isOpen}
            >
                <FormProvider {...methods}>
                    <Form
                        onSubmit={(e) => {
                            e.stopPropagation();
                            methods.handleSubmit(createOrg)(e);
                        }}
                    >
                        <FormItem label="Название организации" asterisk>
                            <Controller
                                name="name"
                                control={methods.control}
                                rules={{ required: "Введите название" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Введите название организации"
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Тип организации">
                            <Controller
                                name="store_type"
                                control={methods.control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={storeTypeOptions}
                                        isSearchable={false}
                                        isClearable
                                        value={
                                            storeTypeOptions.find(
                                                (o) => o.value === field.value,
                                            ) || null
                                        }
                                        onChange={(opt) =>
                                            field.onChange(opt?.value || null)
                                        }
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                        <Button
                            type="submit"
                            loading={regOrgPending}
                            className="w-full"
                            variant="solid"
                        >
                            Сохранить
                        </Button>
                    </Form>
                </FormProvider>
            </Dialog>
        </>
    );
};

export default Step2;
