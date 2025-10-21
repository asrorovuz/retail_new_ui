import { type FC } from "react";
import type { ProductFormType } from "../model";
import { Button, Dialog, Form, Input } from "@/shared/ui/kit";
import { useForm } from "react-hook-form";
import type { ProductDefaultValues } from "@/features/modals/model";

const ProductForm: FC<ProductFormType> = ({
  type,
  isOpen,
  setIsOpen,
  defaultValue,
}) => {
  console.log(defaultValue);
  const { register, handleSubmit, control } = useForm<ProductDefaultValues>({
    defaultValues: defaultValue,
  });

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (data: ProductDefaultValues) => {
    console.log(data);
  };

  return (
    <Dialog
      width={630}
      title={type === "add" ? "Добавить товар" : "Редактировать товар"}
      onClose={onClose}
      isOpen={isOpen}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("name")}
          placeholder="Название товара"
          className="w-full"
        />
        <div className="mt-5 flex justify-end gap-x-3">
          <Button variant="plain" onClick={onClose}>Отменить</Button>
          <Button type="submit" variant="solid" className="self-end">
            {type === "add" ? "Добавить" : "Сохранить"}
          </Button>
        </div>
      </Form>
    </Dialog>
  );
};

export default ProductForm;
