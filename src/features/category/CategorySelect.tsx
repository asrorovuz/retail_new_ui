import { FormItem, Select } from "@/shared/ui/kit";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import ModalCategory from "./ModalCategory";
import { showErrorLocalMessage } from "@/shared/lib/showMessage";
import { useCategoryApi } from "@/entities/products/repository";

type CategorySelectProps = {
  name: string;
  label: string;
  control: any;
  placeholder: string;
  width?: string;
  onChange?: (option: { id: number; name: string } | null) => void;
};

const CategorySelect = ({
  name,
  label,
  control,
  placeholder,
  width,
  onChange = () => {},
}: CategorySelectProps) => {
  const [modals, setModals] = useState<any[]>([]);
  const { data: allCategory, refetch } = useCategoryApi();

  const categoryOptions = useMemo(
    () =>
      allCategory?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [allCategory],
  );

  const handleShowAdd = (opts: {
    parent_id: number | null;
    parentName: string | null;
    defaultName?: string | null;
    type?: "add" | "edit" | "print";
    editId?: number | null;
    chainDepth?: number;
  }) => {
    const {
      parent_id,
      parentName,
      defaultName = null,
      type = "add",
      editId = null,
      chainDepth = 1,
    } = opts;

    if (chainDepth > 1 && parent_id) {
      showErrorLocalMessage("Подкатегория обязательна для выбора");
    }

    setModals((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        parent_id,
        parentName,
        defaultName,
        editId,
        chainDepth,
      },
    ]);
  };

  const handleCloseModal = (id: number) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  };
  return (
    <div className="flex justify-center items-center gap-x-1 col-span-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem
            className="w-full !mb-0"
            labelClass="flex justify-between items-center"
            label={label}
            extra={
              <div
                className="text-blue-500 active:text-blue-400"
                onClick={() =>
                  handleShowAdd({
                    parent_id: null,
                    parentName: null,
                    type: "add",
                    chainDepth: 1,
                  })
                }
              >
                Добавить категорию
              </div>
            }
          >
            <Select
              {...field}
              className={width ? width : "w-full"}
              isClearable
              hideSelectedOptions
              size="sm"
              options={categoryOptions}
              value={
                field?.value
                  ? categoryOptions?.find(
                      (opt) => opt.value === field.value.id,
                    ) || null
                  : null
              }
              onChange={(data) => {
                const transformed = data
                  ? { id: data.value, name: data.label }
                  : null;
                field.onChange(transformed);
                onChange?.(transformed);
              }}
              placeholder={placeholder}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />

            {modals?.map((m) => (
              <ModalCategory
                key={m.id}
                id={m.id}
                type={m.type}
                parent_id={m.parent_id}
                parentName={m.parentName}
                defaultName={m.defaultName}
                editId={m.editId}
                chainDepth={m.chainDepth}
                isOpen={true}
                onClose={handleCloseModal}
                onSuccess={() => {
                  refetch();
                  handleCloseModal(m.id);
                }}
                onAddSubCategory={(args) =>
                  handleShowAdd({ ...args, type: "edit" })
                }
                setEndSelectCategory={(val) => {
                  field.onChange(val);
                }}
                allCategory={allCategory ?? []}
              />
            ))}
          </FormItem>
        )}
      />
    </div>
  );
};

export default CategorySelect;
