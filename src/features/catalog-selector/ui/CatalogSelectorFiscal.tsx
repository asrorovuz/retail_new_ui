import { useState, useMemo, useEffect } from "react";
import { useCatalogSearchFiscalApi } from "@/entities/products/repository";
import { Select } from "@/shared/ui/kit";
import type { CommonProps } from "@/shared/ui/kit/@types/common";
import { useDebounce } from "@/shared/lib/useDebounce";
import type { Package } from "@/features/modals/model";

interface CatalogSelectorFiscalProps extends CommonProps {
  placeholder?: string;
  onChange: (option: any) => void;
  setValue: any;
  getValues: any;
  value: any;
  fieldName?: string;
  setPackageNames: (item: Package[] | []) => void;
}

const CatalogSelectorFiscal = ({
  placeholder,
  onChange,
  setValue,
  getValues,
  value,
  setPackageNames,
  ...props
}: CatalogSelectorFiscalProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [selected, setSelected] = useState<any>(null);
  const [cachedOptions, setCachedOptions] = useState<any[]>([]);

  // 🔹 Debounced query
  const debouncedQuery = useDebounce(inputValue, 500);

  const { data, isLoading } = useCatalogSearchFiscalApi(
    debouncedQuery ?? value
  );

  // 🔹 Data o‘zgarganda optionlarni tayyorlash
  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return cachedOptions;
    const newOptions = data?.map((item: any) => ({
      label: `${item.class_code} - ${item.class_name}`,
      value: item.class_code,
      data: item,
    }));
    setCachedOptions(newOptions); 
    return newOptions;
  }, [data]);

  // 🔹 Tanlovni o‘zgartirish
  const handleChange = (option: any) => {
    setSelected(option);
    setValue("catalog", option);
    setPackageNames(option?.data?.package_names || []);
    onChange(option ? option : null);
  };

  // 🔹 Input o‘zgarganda, lekin o‘chirilganda emas
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  // 🔹 default value update qilish (edit holatda)
  useEffect(() => {
    if (!value) return;

    const found = options?.find((opt) => opt?.value === value);
    if (found) {
      setSelected(found);
      setPackageNames(found?.data?.package_names || []);
    }
  }, [value, options]);

  return (
    <Select
      {...props}
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      value={selected}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option: any) =>
        option?.label ? String(option.label) : ""
      }
      getOptionValue={(option: any) =>
        option?.value ? String(option.value) : ""
      }
      isClearable
      menuPortalTarget={document.body}
      menuPosition="fixed"
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  );
};

export default CatalogSelectorFiscal;
