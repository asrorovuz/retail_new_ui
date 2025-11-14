import type { FC } from "react";
import Select from "../../kit/Select";
import classNames from "../../kit/utils/classNames";
import { barcodeTypes, type BarcodeType } from "@/app/constants/barcode.types";

interface IProps {
  defaultTypeValue?: any;
  onChange?: any;
  selectProps?: any;
  className?: string;
}

const SelectItemBarcodeType: FC<IProps> = (props) => {
  const { defaultTypeValue, onChange, selectProps, className } = props;
  const ean13Type = barcodeTypes?.find((type) => type?.value === "EAN13");

  return (
    <Select
      className={classNames(className)}
      options={barcodeTypes}
      classNamePrefix="select"
      isSearchable={false}
      hideSelectedOptions
      getOptionLabel={(option: BarcodeType) => option?.label}
      getOptionValue={(option: BarcodeType) => option?.value}
      placeholder={"Штрих код"}
      onChange={onChange}
      value={
        barcodeTypes.find(
          (m: { value: string }) => m.value === defaultTypeValue
        ) || ean13Type
      }
      {...selectProps}
    />
  );
};
export default SelectItemBarcodeType;
