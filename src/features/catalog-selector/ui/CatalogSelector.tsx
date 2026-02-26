import { useState, useMemo, useEffect } from "react";
import { useCatalogSearchApi } from "@/entities/products/repository";
import { Select } from "@/shared/ui/kit";
import type { CommonProps } from "@/shared/ui/kit/@types/common";
import { useDebounce } from "@/shared/lib/useDebounce";
import type { Package } from "@/features/modals/model";

interface CatalogSelectorProps extends CommonProps {
  placeholder?: string;
  onChange: (option: any) => void;
  invalid?: boolean;
  isOpen: boolean;
  setValue: any;
  getValues: any;
  value: any;
  width?: string;
  fieldName?: string;
  multiplay?: boolean;
  index?: number;
  setPackageNames: (item: Package[] | []) => void;
}

const CatalogSelector = ({
  placeholder,
  onChange,
  isOpen,
  setValue,
  getValues,
  value,
  width,
  multiplay = false,
  index,
  setPackageNames,
  ...props
}: CatalogSelectorProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [selected, setSelected] = useState<any>(null);

  // 🔹 Debounced query
  const debouncedQuery = useDebounce(inputValue, 500);

  const { data, isLoading } = useCatalogSearchApi(
    debouncedQuery || value, // 🔹 bo‘sh string yubormaymiz
    isOpen,
  );

  // 🔹 Data o‘zgarganda optionlarni tayyorlash
  const options = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data?.map((item: any) => ({
      label: `${item.class_code} - ${item.class_name}`,
      value: item.class_code,
      data: item,
    }));
  }, [data]);

  // 🔹 Tanlovni o‘zgartirish
  const handleChange = (option: any) => {
    setSelected(option || null);
    const packages = option?.data?.package_names || [];
     const defaultPackage = packages[0] || null; 
    setPackageNames(packages);
    if (multiplay) {
      setValue(`products.${index}.catalog`, option || null);
      setValue(`products.${index}.package`, defaultPackage);
    } else {
      setValue("catalog", option || null);
      setValue(`products.${index}.package`, defaultPackage);
    }

    onChange(option || null);
  };

  // 🔹 Input o‘zgarganda, lekin o‘chirilganda emas
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  // 🔹 default value update qilish (edit holatda)
  useEffect(() => {
    if (value == null) {
      setSelected(null);
      setPackageNames([]);
      if (multiplay) {
        setValue(`products.${index}.package`, null);
      } else {
        setValue("package", null);
      }
      return;
    }

    const valToFind = typeof value === "object" ? value.value : value;
    const found = options.find((opt) => opt.value === valToFind);

    if (found) {
      setSelected(found);
      const packages = found.data?.package_names || [];
      setPackageNames(packages);
      const defaultPackage = packages[0] || null;
      if (multiplay) {
        setValue(`products.${index}.package`, defaultPackage);
      } else {
        setValue("package", defaultPackage);
      }
    } else {
      setSelected(null);
      setPackageNames([]);
      if (multiplay) {
        setValue(`products.${index}.package`, null);
      } else {
        setValue("package", null);
      }
    }
  }, [value, options]);

  return (
    <Select
      {...props}
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      value={selected}
      size="sm"
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option: any) => option?.label || ""}
      getOptionValue={(option: any) => option?.value || ""}
      className={width}
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

export default CatalogSelector;
