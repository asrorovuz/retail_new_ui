import { Button, Input, InputGroup } from "@/shared/ui/kit";
import { useEffect } from "react";
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
};

const BarcodeForm = ({ fieldName, barcode, control, getValues }: BarcodeFormProps) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  });

  const addBarcode = () => {
    append(new Date().getTime().toString().slice(5, 13));
  };

  const deleteBarcode = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (barcode) {
      if ((getValues(fieldName) as string[]).some((i) => i.length === 8))
        remove(
          (getValues(fieldName) as string[]).findIndex((i) => i.length === 8)
        );

      if ((getValues(fieldName) as string[]).some((i) => i === barcode)) {
        remove(
          (getValues(fieldName) as string[]).findIndex((i) => i === barcode)
        );
        append(barcode);
      } else append(barcode);
    }
  }, [barcode]);

  return (
    <div className="w-1/2">
      {fields?.map((field, index) => (
        <InputGroup className={"mb-3"} key={field.id}>
          <Controller
            name={`${fieldName}.${index}`}
            control={control}
            render={({ field }) => (
              <Input
                type={"text"}
                autoComplete={"off"}
                placeholder={t("Введите код")}
                {...field}
              />
            )}
          />
          <Button
            type={"button"}
            variant={"solid"}
            className={"bg-red-500 hover:bg-red-600 text-white"}
            onClick={() => deleteBarcode(index)}
            icon={<FaTrash className={"text-sm"} />}
          />
        </InputGroup>
      ))}
      <div className={"flex justify-center items-center "}>
        <Button
          type={"button"}
          variant={"solid"}
          size={"sm"}
          className={"bg-primary text-white"}
          onClick={addBarcode}
          icon={<FaPlus className={"text-sm"} />}
        >
          {t("common.add")}
        </Button>
      </div>
    </div>
  );
};

export default BarcodeForm;
