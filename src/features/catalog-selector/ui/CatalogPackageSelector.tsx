import { Select } from "@/shared/ui/kit";
import type { CommonProps } from "@/shared/ui/kit/@types/common";
import { useEffect, useState } from "react";

interface CatalogPackageSelectorProps extends CommonProps {
  placeholder?: string;
  onChange: (option: any) => void;
  setValue: any;
  value?: any; // field.value
  options?: any[]; // catalog.package_names
}

const CatalogPackageSelector = ({
  placeholder,
  onChange,
  value,
  setValue,
  options = [],
  ...props
}: CatalogPackageSelectorProps) => {
  
  const [selected, setSelected] = useState(value || null);

  const handleChange = (option: any) => {
    setValue("package", option)
    setSelected(option);
    onChange(option);
  };

  // 🔹 Default yoki value bo‘lganda tanlovni yangilash
  useEffect(() => {
    if (value) {
      // Agar value obyekt bo‘lsa yoki faqat code bo‘lsa
      const found =
        typeof value === "object"
          ? value
          : options.find((opt) => opt.code === +value);
      if (found) setSelected(found);
    } else if (options.length > 0) {
      // Agar value yo‘q bo‘lsa, birinchi elementni tanlash
      setSelected(options[0]);
      onChange(options[0]); // formaga avtomatik yuborish
    }
  }, [value, options]);

  return (
    <Select
      {...props}
      placeholder={placeholder}
      isSearchable={false}
      options={options}
      value={selected}
      onChange={handleChange}
      getOptionLabel={(option: any) => option.name_uz}
      getOptionValue={(option: any) => option.code}
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

export default CatalogPackageSelector;
