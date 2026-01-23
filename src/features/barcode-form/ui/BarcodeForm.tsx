import { Button, FormItem, Input, InputGroup } from "@/shared/ui/kit";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

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
  multiplay = false,
}: BarcodeFormProps) => {
  const { t } = useTranslation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  });

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const addBarcode = () => {
    const newIndex = fields.length;

    append(new Date().getTime().toString().slice(5, 13));
    setFocusedIndex(newIndex);
    // const input = inputRefs.current[newIndex];
    // if (input) {
    //   input.focus();
    // }
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
    if (barcode && focusedIndex !== null) {
      const values = getValues(fieldName);
      values[focusedIndex] = barcode;
      setValue(fieldName, [...values]); // faqat bitta input qiymatini yangilaymiz
    }
  }, [barcode]);

  return !!multiplay ? (
    <div className="flex flex-col mb-7">
      {/* <div> */}
      <div className="form-label flex justify-between mb-1 min-w-44">
        <span>Штрих-коды</span>
        <div
          onClick={addBarcode}
          className="p-1 rounded-full border border-primary"
        >
          <FaPlus className="text-sm" />
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        {fields?.map((fieldItem, index) => {
          if (multiplay) {
            return (
              <InputGroup key={fieldItem.id}>
                <Controller
                  key={fieldItem.id}
                  name={`${fieldName}.${index}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      ref={(el) => {
                        inputRefs.current[index] =
                          el as HTMLInputElement | null;
                      }}
                      type="text"
                      autoComplete="off"
                      className="!w-44"
                      placeholder={t("Введите код")}
                      onFocus={() => setFocusedIndex(index)}
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="solid"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => deleteBarcode(index)}
                  icon={<FaTrash className="text-sm" />}
                />
              </InputGroup>
            );
          }
        })}
      </div>
    </div>
  ) : (
    <FormItem label={"Штрих-коды"}>
      {fields?.map((fieldItem, index) => {
        return (
          <InputGroup className="mb-3" key={fieldItem.id}>
            <Controller
              name={`${fieldName}.${index}`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  autoComplete="off"
                  placeholder={t("Введите код")}
                  onFocus={() => setFocusedIndex(index)}
                />
              )}
            />

            <Button
              type="button"
              variant="solid"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => deleteBarcode(index)}
              icon={<FaTrash className="text-sm" />}
            />
          </InputGroup>
        );
      })}

      <div className="flex justify-center items-center">
        <Button
          type="button"
          variant="solid"
          size="sm"
          className="bg-primary text-white"
          onClick={addBarcode}
          icon={<FaPlus className="text-sm" />}
        >
          {t("common.add")}
        </Button>
      </div>
    </FormItem>
  );
};

export default BarcodeForm;
