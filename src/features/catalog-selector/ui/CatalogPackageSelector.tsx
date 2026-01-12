import { Select } from "@/shared/ui/kit";
import type { CommonProps } from "@/shared/ui/kit/@types/common";
import { useEffect, useMemo, useState } from "react";

interface CatalogPackageSelectorProps extends CommonProps {
  placeholder?: string;
  onChange: (option: any) => void;
  setValue: any;
  value?: any; // field.value
  width?: string;
  multiplay?: boolean;
  index?: number;
  options?: any[]; // catalog.package_names
}

const CatalogPackageSelector = ({
  placeholder,
  onChange,
  value,
  setValue,
  width,
  multiplay = false,
  index,
  options = [],
  ...props
}: CatalogPackageSelectorProps) => {
  const [selected, setSelected] = useState(value || null);

  const handleChange = (option: any) => {
    multiplay ? setValue(`products.${index}.package`, option) : setValue("package", option);
    setSelected(option);
    onChange(option);
  };

  const selectOption = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];
    return options.map((item: any) => ({
      label: item.name_uz,
      value: item.code,
      ...item,
    }));
  }, [value, options]);

  // 🔹 Default yoki value bo‘lganda tanlovni yangilash
  useEffect(() => {
    if (value !== null && value !== undefined) {
      const found =
        typeof value === "object"
          ? value
          : selectOption?.find((opt) => opt.value === value);

      if (found) {
        setSelected(found);
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (selectOption?.length > 0) {
      handleChange(selectOption[0]);
    }else{
      handleChange(null);
    }
  }, [options]);

  return (
    <Select
      {...props}
      placeholder={placeholder}
      isSearchable={false}
      options={selectOption}
      value={selected}
      onChange={handleChange}
      getOptionLabel={(option: any) => option.label}
      getOptionValue={(option: any) => option.value}
      isClearable
      className={width}
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

export default CatalogPackageSelector;
