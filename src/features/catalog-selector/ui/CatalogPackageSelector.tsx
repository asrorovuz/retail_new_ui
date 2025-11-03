import { Select } from "@/shared/ui/kit";
import type { CommonProps } from "@/shared/ui/kit/@types/common";
import { useState } from "react";

interface CatalogPackageSelectorProps extends CommonProps {
  placeholder?: string;
  onChange: (option: any) => void;
  value?: any; // field.value
  options?: any[]; // catalog.package_names
}

const CatalogPackageSelector = ({
  placeholder,
  onChange,
  value,
  options = [],
  ...props
}: CatalogPackageSelectorProps) => {
  const [selected, setSelected] = useState(value || null);

  const handleChange = (option: any) => {
    setSelected(option);
    onChange(option);
  };

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
    />
  );
};

export default CatalogPackageSelector;
