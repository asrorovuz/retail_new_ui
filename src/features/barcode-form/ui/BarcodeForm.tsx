import { Button, Input, InputGroup } from "@/shared/ui/kit";
import { useEffect, useState } from "react";
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
  multiplay,
}: BarcodeFormProps) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  });

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const addBarcode = () => {
    append(new Date().getTime().toString().slice(5, 13));
  };

  const deleteBarcode = (index: number) => {
    remove(index);
  };

  // useEffect(() => {
  //   if (barcode) {
  //     if ((getValues(fieldName) as string[]).some((i) => i.length === 8))
  //       remove(
  //         (getValues(fieldName) as string[]).findIndex((i) => i.length === 8)
  //       );

  //     if ((getValues(fieldName) as string[]).some((i) => i === barcode)) {
  //       remove(
  //         (getValues(fieldName) as string[]).findIndex((i) => i === barcode)
  //       );
  //       append(barcode);
  //     } else append(barcode);
  //   }
  // }, [barcode]);

  useEffect(() => {
    if (barcode && focusedIndex !== null) {
      const values = getValues(fieldName);
      values[focusedIndex] = barcode;
      setValue(fieldName, [...values]); // faqat bitta input qiymatini yangilaymiz
    }
  }, [barcode]);

  return (
    <div>
      {fields?.map((fieldItem, index) => {
        // 👉 agar multiplay true bo‘lsa — FAQAT input
        if (multiplay) {
          return (
            <Controller
              key={fieldItem.id}
              name={`${fieldName}.${index}`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  autoComplete="off"
                  className="!w-44"
                  placeholder={t("Введите код")}
                  onFocus={() => setFocusedIndex(index)}
                />
              )}
            />
          );
        }

        // 👉 multiplay false bo‘lsa — Input + delete button
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

      {/* ➕ Add button — faqat multiplay FALSE bo‘lsa */}
      {!multiplay && (
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
      )}
    </div>

    // <div>

    //   {fields?.map((field, index) => (
    //     <Controller
    //         name={`${fieldName}.${index}`}
    //         control={control}
    //         render={({ field }) => (
    //           <Input
    //             type={"text"}
    //             autoComplete={"off"}
    //             multiple
    //             placeholder={t("Введите код")}
    //             onFocus={() => setFocusedIndex(index)}
    //             {...field}
    //           />
    //         )}
    //       />
    //     // <InputGroup className={"mb-3"} key={field.id}>
    //     //   <Controller
    //     //     name={`${fieldName}.${index}`}
    //     //     control={control}
    //     //     render={({ field }) => (
    //     //       <Input
    //     //         type={"text"}
    //     //         autoComplete={"off"}
    //     //         multiple
    //     //         placeholder={t("Введите код")}
    //     //         onFocus={() => setFocusedIndex(index)}
    //     //         {...field}
    //     //       />
    //     //     )}
    //     //   />
    //     //   {!multiplay ? (
    //     //     <Button
    //     //       type={"button"}
    //     //       variant={"solid"}
    //     //       className={"bg-red-500 hover:bg-red-600 text-white"}
    //     //       onClick={() => deleteBarcode(index)}
    //     //       icon={<FaTrash className={"text-sm"} />}
    //     //     />
    //     //   ) : (
    //     //     ""
    //     //   )}
    //     // </InputGroup>
    //   ))}
    //   {!multiplay ? (
    //     <div className={"flex justify-center items-center "}>
    //       <Button
    //         type={"button"}
    //         variant={"solid"}
    //         size={"sm"}
    //         className={"bg-primary text-white"}
    //         onClick={addBarcode}
    //         icon={<FaPlus className={"text-sm"} />}
    //       >
    //         {t("common.add")}
    //       </Button>
    //     </div>
    //   ) : (
    //     ""
    //   )}
    // </div>
  );
};

export default BarcodeForm;
