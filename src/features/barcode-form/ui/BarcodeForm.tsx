import { Button, Input } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

type BarcodeFormProps = {
    fieldName: string;
    label?: string;
    barcode: string | null;
    control: any;
    getValues: any;
    setValue: any;
    multiplay?: boolean;
};

const BarcodeForm = ({
    fieldName,
    barcode,
    control,
    getValues,
    setValue,
    multiplay,
}: BarcodeFormProps) => {
    const { t } = useTranslation();
    const { fields, append, remove } = useFieldArray({
        name: fieldName,
        control,
    });

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [autoFocusIndex, setAutoFocusIndex] = useState<number | null>(null);

    const addBarcode = () => {
        const newIndex = fields.length;
        append({
            value: new Date().getTime().toString().slice(5, 13),
            count: 1,
        });
        setAutoFocusIndex(newIndex);
    };

    const deleteBarcode = (index: number) => {
        remove(index);
        setAutoFocusIndex(null);
    };

    useEffect(() => {
        if (!barcode || focusedIndex === null) return;

        const values = getValues(fieldName) || [];

        values[focusedIndex] = {
            ...values[focusedIndex],
            value: barcode,
        };

        setValue(fieldName, [...values], { shouldDirty: true });
    }, [barcode]);

    return (
        <div className="flex flex-col">
            {!multiplay && (
                <div className="form-label flex justify-between mb-1 min-w-44">
                    <span className="whitespace-nowrap">Штрих-коды</span>
                    <Button
                        variant="plain"
                        type="button"
                        className="bg-transparent border-transparent py-0 h-auto text-blue-500"
                        size="sm"
                        onClick={addBarcode}
                    >
                        Добавить штрих-код
                    </Button>
                </div>
            )}
            <div className="flex gap-x-2 justify-end">
                <div className="flex flex-col gap-y-1 w-full">
                    {fields?.map((fieldItem, index) => {
                        return (
                            <div
                                key={fieldItem.id}
                                className="flex items-center gap-x-2"
                            >
                                {/* BARCODE VALUE */}
                                <Controller
                                    name={`${fieldName}.${index}.value`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            className={
                                                multiplay
                                                    ? "!w-[160px]"
                                                    : "!w-full"
                                            }
                                            size="sm"
                                            placeholder={t("Введите код")}
                                            autoFocus={autoFocusIndex === index}
                                            onFocus={() =>
                                                setFocusedIndex(index)
                                            }
                                            onBlur={() => {
                                                setAutoFocusIndex(null);
                                                setFocusedIndex(null);
                                            }}
                                        />
                                    )}
                                />

                                {/* COUNT */}
                                <Controller
                                    name={`${fieldName}.${index}.count`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            size="sm"
                                            min={1}
                                            onChange={(e) =>
                                                field.onChange(+e.target.value)
                                            }
                                            className={
                                                multiplay
                                                    ? "!w-[70px]"
                                                    : "!w-[100px]"
                                            }
                                        />
                                    )}
                                />

                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    className="px-3 text-red-500 hover:text-red-400 active:text-red-400"
                                    onClick={() => deleteBarcode(index)}
                                    icon={<IoMdClose size={20} />}
                                />
                            </div>
                        );
                    })}
                </div>
                {multiplay && (
                    <Button
                        variant="default"
                        type="button"
                        icon={<FaPlus size={16} />}
                        size="sm"
                        onClick={addBarcode}
                    ></Button>
                )}
            </div>
        </div>
    );
};

export default BarcodeForm;
