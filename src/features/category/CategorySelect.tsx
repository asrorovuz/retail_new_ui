import { Button, FormItem, Select } from "@/shared/ui/kit";
import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import ModalCategory from "./ModalCategory";
import { showErrorMessage } from "@/shared/lib/showMessage";
import { useCategoryApi } from "@/entities/products/repository";
import { FiPlusCircle } from "react-icons/fi";

type Category = {
  id: number;
  name: string;
  children?: Category[];
};

type CategorySelectProps = {
  defaultCategory?: Category[];
  name: string;
  label: string;
  control: any;
  placeholder: string;
  onChange?: (option: { id: number; name: string } | null) => void;
};

const CategorySelect = ({
  defaultCategory = [],
  name,
  label,
  control,
  placeholder,
  onChange = () => {},
}: CategorySelectProps) => {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [modals, setModals] = useState<any[]>([]);
  const { data: allCategory } = useCategoryApi();

  const flattenCategories = (data: Category[]): Category[] => {
    let result: Category[] = [];
    data.forEach((item) => {
      result.push({ id: item.id, name: item.name });
      if (item.children?.length)
        result = result.concat(flattenCategories(item.children));
    });
    return result;
  };

  const fetchCategory = async () => {
    const flat = flattenCategories(allCategory || []);
    setCategoryData(flat);
  };

  const categoryOptions = useMemo(
    () =>
      categoryData.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [categoryData]
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
      showErrorMessage("Подкатегория обязательна для выбора");
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

  useEffect(() => {
    fetchCategory();
  }, [allCategory]);

  return (
    <div className="flex justify-center items-center gap-x-1">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem className="w-full" label={label}>
            <Select
              {...field}
              className="w-full"
              isClearable
              hideSelectedOptions
              options={categoryOptions}
              value={
                field?.value
                  ? categoryOptions.find(
                      (opt) => opt.value === field.value.id
                    ) || null
                  : null
              }
              defaultValue={
                defaultCategory.length > 0
                  ? {
                      value: defaultCategory[0].id,
                      label: defaultCategory[0].name,
                    }
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
                  fetchCategory();
                  handleCloseModal(m.id);
                }}
                onAddSubCategory={(args) =>
                  handleShowAdd({ ...args, type: "edit" })
                }
                setEndSelectCategory={(val) => field.onChange(val)}
                allCategory={allCategory}
              />
            ))}
          </FormItem>
        )}
      />

      <Button
        type="button"
        icon={<FiPlusCircle />}
        className="bg-gray-400"
        variant="solid"
        onClick={() =>
          handleShowAdd({
            parent_id: null,
            parentName: null,
            type: "add",
            chainDepth: 1,
          })
        }
      >
        
      </Button>
    </div>
  );
};

export default CategorySelect;
