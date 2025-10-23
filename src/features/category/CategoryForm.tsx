import { FormItem, Input } from "@/shared/ui/kit";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";
import { useCategoryApi } from "@/entities/products/repository";

const t = (text: string) => text;

const CategoryForm = ({ checkedId }: { checkedId?: number | null }) => {
  const form = useFormContext();
  const { data: allCategory } = useCategoryApi();

  // 🔹 Kategoriyalarni flatten qilish (ota-bola tuzilmani tekis formatga o‘tkazish)
  const flattenCategories = (data: any[] = []): { label: string; value: number }[] => {
    const result: { label: string; value: number }[] = [];
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        result.push({ label: item.name, value: item.id });
        if (item.children?.length) traverse(item.children);
      });
    };
    traverse(data);
    return result;
  };

  const optionCategory = useMemo(() => flattenCategories(allCategory || []), [allCategory]);

  return (
    <>
      {!checkedId && (
        <FormItem asterisk label="Название">
          <Input
            placeholder="Введите название"
            size="sm"
            className="bg-white border-gray-300 font-medium rounded"
            {...form.register("name", {
              required: "Обязательное поле",
            })}
          />
        </FormItem>
      )}

      <FormItem label="Подкатегория">
        <Controller
          name="parent_id"
          control={form.control}
          render={({ field }) => (
            <ReactSelect
              {...field}
              placeholder="Выбрать"
              value={optionCategory.find((opt) => opt.value === field.value) || null}
              options={optionCategory}
              isSearchable={false}
              onChange={(val) => field.onChange(val ? val.value : null)}
              classNamePrefix="react-select"
              getOptionValue={(option) => String(option.value)}
              getOptionLabel={(option) => t(option.label)}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          )}
        />
      </FormItem>
    </>
  );
};

export default CategoryForm;
