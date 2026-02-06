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
  const selectOption = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map((item: any) => ({
      label: item.name_uz,
      value: item.code,
      ...item,
    }));
  }, [options]);

  const [selectedOption, setSelectedOption] = useState<any>(null);

  // value yoki options yangilanishini kuzatib, selectedOptionni set qilish
  useEffect(() => {
    if (!selectOption.length) {
      setSelectedOption(null);
      return;
    }

    // value object bo'lsa ishlatamiz
    if (value && typeof value === "object") {
      setSelectedOption(value);
      return;
    }

    // value code bo'lsa, option ichidan topamiz
    if (value) {
      const found = selectOption.find((opt) => opt.value === value);
      setSelectedOption(found || null);
      return;
    }

    // value bo'lmasa, birinchi optionni tanlaymiz
    setSelectedOption(selectOption[0]);
  }, [value, selectOption]);

  const handleChange = (option: any) => {
    setSelectedOption(option); // tanlangan optionni statega saqlaymiz

    multiplay
      ? setValue(`products.${index}.package`, option)
      : setValue("package", option);

    onChange(option);
  };

  return (
    <Select
      {...props}
      placeholder={placeholder}
      isSearchable={false}
      options={selectOption}
      value={selectedOption}
      isLoading={!selectOption.length}
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
