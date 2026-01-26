import { Button, Input } from "@/shared/ui/kit";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiDelete } from "react-icons/fi";

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
}: BarcodeFormProps) => {
  const { t } = useTranslation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const countRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  });

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const addBarcode = () => {
    const newIndex = fields.length;

    append({ value: new Date().getTime().toString().slice(5, 13), count: 1 });
    setFocusedIndex(newIndex);
  };

  const deleteBarcode = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (focusedIndex === null) return;

    const input = inputRefs.current[focusedIndex];
    if (input) {
      input.focus();
    }
  }, [fields.length]);

  useEffect(() => {
    if (!barcode || focusedIndex === null) return;

    const values = getValues(fieldName) || [];

    values[focusedIndex] = {
      ...values[focusedIndex],
      value: barcode,
    };

    setValue(fieldName, [...values], { shouldDirty: true });
  }, [barcode]);

  useEffect(() => {
    if (focusedIndex === null) return;

    const input = countRefs.current[focusedIndex];
    if (input) {
      input.focus();
      input.select();
    }
  }, [fields.length]);

  return (
    <div className="flex flex-col mb-7">
      {/* <div> */}
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
      <div className="flex flex-col gap-y-1">
        {fields?.map((fieldItem, index) => {
          return (
            <div key={fieldItem.id} className="flex items-center gap-x-2">
              {/* BARCODE VALUE */}
              <Controller
                name={`${fieldName}.${index}.value`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className="min-w-max"
                    placeholder={t("Введите код")}
                    onFocus={() => setFocusedIndex(index)}
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
                    ref={(el: any) => (countRefs.current[index] = el)}
                    type="number"
                    min={1}
                    onChange={(e) => field.onChange(+e.target.value)}
                    className="!w-[100px]"
                  />
                )}
              />

              {fields.length > 1 ? (
                <Button
                  type="button"
                  variant="solid"
                  className="px-3 bg-red-500 hover:bg-red-400 active:bg-red-400"
                  onClick={() => deleteBarcode(index)}
                  icon={<FiDelete size={20} />}
                />
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarcodeForm;
