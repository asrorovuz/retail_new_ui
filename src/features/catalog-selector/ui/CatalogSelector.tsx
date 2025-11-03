import { useState, useMemo } from "react";
import { useCatalogSearchApi } from "@/entities/products/repository";
import { Select } from "@/shared/ui/kit";
import type { CommonProps } from "@/shared/ui/kit/@types/common";
import { useDebounce } from "@/shared/lib/useDebounce";
import type { Package } from "@/features/modals/model";

interface CatalogSelectorProps extends CommonProps {
  placeholder?: string;
  onChange: (option: any) => void;
  invalid?: boolean;
  fieldName?: string;
  setPackageNames: (item: Package[] | []) => void;
}

const CatalogSelector = ({
  placeholder,
  onChange,
  setPackageNames,
  ...props
}: CatalogSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [cachedOptions, setCachedOptions] = useState<any[]>([]); 

  // 🔹 Debounced query
  const debouncedQuery = useDebounce(inputValue, 500);

  const { data, isLoading } = useCatalogSearchApi(
    debouncedQuery // 🔹 bo‘sh string yubormaymiz
  );

  // 🔹 Data o‘zgarganda optionlarni tayyorlash
  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return cachedOptions;
    const newOptions = data.map((item: any) => ({
      label: `${item.class_code} - ${item.class_name}`,
      value: item.class_code,
      data: item,
    }));
    setCachedOptions(newOptions); // 🔹 yangi natijani cachega yozamiz
    return newOptions;
  }, [data]);

  // 🔹 Tanlovni o‘zgartirish
  const handleChange = (option: any) => {
    setSelected(option);
    setPackageNames(option?.data?.package_names || [])
    onChange(option ? option : null);
  };

  // 🔹 Input o‘zgarganda, lekin o‘chirilganda emas
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

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
      getOptionLabel={(option: any) => option.label}
      getOptionValue={(option: any) => option.value}
      isClearable
    />
  );
};

export default CatalogSelector;
