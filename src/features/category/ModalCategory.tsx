import { useEffect, useMemo, useState, Fragment } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";
import { Button, Dialog, Form, FormItem, Input, Select } from "@/shared/ui/kit";
import {
    showErrorLocalMessage,
    showErrorMessage,
    showSuccessMessage,
} from "@/shared/lib/showMessage";
import { messages } from "@/app/constants/message.request";
import {
    useCreateCategory,
    useUpdateCategory,
} from "@/entities/products/repository";
import type { CategoryResponse } from "@/@types/products";
import FullKeyboard from "@/widgets/ui/keyboard/FullKeyboard";

interface ModalCategoryProps {
    id: number;
    type: "add" | "edit";
    isOpen: boolean;
    parent_id: number | null;
    parentName: string | null;
    defaultName?: string | null;
    editId?: number | null;
    chainDepth: number;
    onClose: (id: number) => void;
    onSuccess: () => void;
    onAddSubCategory: (args: {
        parent_id: number | null;
        parentName: string | null;
        defaultName?: string | null;
        chainDepth: number;
        editId?: number | null;
    }) => void;
    setEndSelectCategory?: (value: { id: number; name: string }) => void;
    allCategory: CategoryResponse[] | [];
}

const ModalCategory = ({
    id,
    type,
    isOpen,
    parent_id,
    defaultName,
    editId,
    chainDepth,
    onClose,
    onSuccess,
    onAddSubCategory,
    setEndSelectCategory,
    allCategory,
}: ModalCategoryProps) => {
    const [loading, setLoading] = useState(false);
    const { mutateAsync: createCategory } = useCreateCategory();
    const { mutateAsync: updateCategory } = useUpdateCategory();

    const methods = useForm({
        defaultValues: {
            name: defaultName || "",
            parent_id: chainDepth === 1 ? (parent_id ?? null) : null,
        },
    });

    // props o‘zgarsa form reset bo‘lsin
    useEffect(() => {
        methods.reset({
            name: defaultName || "",
            parent_id: chainDepth === 1 ? (parent_id ?? null) : null,
        });
    }, [defaultName, parent_id, chainDepth]);

    // 🔹 Rekursiv kategoriya flatten
    const flattenCategories = (
        categories: any[] = [],
    ): { label: string; value: number }[] => {
        const result: { label: string; value: number }[] = [];
        const traverse = (items: any[]) => {
            items.forEach((item) => {
                result.push({ label: item.name, value: item.id });
                if (item.children?.length) traverse(item.children);
            });
        };
        traverse(categories);
        return result;
    };

    const optionCategory = useMemo(
        () => flattenCategories(allCategory || []),
        [allCategory],
    );

    const isInitialCreate = type === "add" && chainDepth === 1;

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            if (isInitialCreate) {
                if (!values?.name) {
                    showErrorLocalMessage("Введите название категории");
                    setLoading(false);
                    return;
                }
                // CREATE
                const res = await createCategory({
                    name: values?.name,
                    parent_id: values?.parent_id ?? parent_id ?? null,
                });

                if (res && setEndSelectCategory) {
                    setEndSelectCategory({ id: res?.id, name: res.name });
                }

                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                onSuccess();
            } else {
                // UPDATE
                const idToUpdate = editId ?? parent_id;

                if (!idToUpdate) throw new Error("Update uchun ID topilmadi.");

                const parentToSend =
                    type === "edit"
                        ? (values?.parent_id ?? parent_id ?? null)
                        : null;

                await updateCategory({
                    id: idToUpdate,
                    payload: {
                        name: values?.name,
                        parent_id: parentToSend,
                    },
                });

                showSuccessMessage(
                    messages.uz.SUCCESS_MESSAGE,
                    messages.ru.SUCCESS_MESSAGE,
                );
                onSuccess();
            }
        } catch (err: any) {
            showErrorMessage(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <Dialog
                width={"60vw"}
                title={
                    type === "add"
                        ? "Добавить подкатегорию"
                        : "Редактировать категорию"
                }
                isOpen={isOpen}
                onClose={() => onClose(id)}
            >
                <FormProvider {...methods}>
                    <Form
                        onSubmit={(e) => {
                            e.stopPropagation();
                            methods.handleSubmit(onSubmit)(e);
                        }}
                    >
                        <FormItem asterisk={true} label="Название">
                            <Controller
                                name="name"
                                control={methods.control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Введите название"
                                        size="sm"
                                        className="bg-white border-slate-300 font-medium rounded"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <div className="flex items-center justify-between gap-x-1">
                            <FormItem className="w-full" label="Подкатегория">
                                <Controller
                                    name="parent_id"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Выбрать"
                                            isSearchable={false}
                                            size="sm"
                                            value={
                                                optionCategory.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                ) || null
                                            }
                                            options={optionCategory}
                                            onChange={(val) =>
                                                field.onChange(
                                                    val ? val.value : null,
                                                )
                                            }
                                            styles={{
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                }),
                                            }}
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                    )}
                                />
                            </FormItem>

                            <Button
                                icon={<FiPlusCircle />}
                                variant="plain"
                                type="button"
                                size="sm"
                                onClick={() => {
                                    const selectedId =
                                        methods.getValues("parent_id");
                                    if (!selectedId) {
                                        showErrorLocalMessage(
                                            "Выберите подкатегорию",
                                        );
                                        return;
                                    }
                                    const selectedOption = optionCategory.find(
                                        (o) => o.value === selectedId,
                                    );
                                    onAddSubCategory({
                                        parent_id: null,
                                        parentName: null,
                                        defaultName:
                                            selectedOption?.label || "",
                                        editId: selectedId,
                                        chainDepth: chainDepth + 1,
                                    });
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 mb-5">
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => onClose(id)}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="solid"
                                size="sm"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </div>
                    </Form>
                </FormProvider>
                <FullKeyboard />
            </Dialog>
        </Fragment>
    );
};

export default ModalCategory;
