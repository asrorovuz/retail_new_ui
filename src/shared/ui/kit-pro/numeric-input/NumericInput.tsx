import { useEffect, useRef, useState, type ChangeEvent, type ElementType, type HTMLInputTypeAttribute, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import type { CommonProps, TypeAttributes } from "../../kit/@types/common";
import { useConfig } from "../../kit/ConfigProvider";
import { useForm, useFormItem } from "../../kit/Form/context";
import { useInputGroup } from "../../kit/InputGroup/context";
import classNames from "@/shared/lib/classNames";
import { CONTROL_SIZES } from "../../kit/utils/constants";


export interface InputProps
  extends CommonProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
      "size" | "prefix" | "value" | "onChange"
    > {
  startSuffixClassName?: string;
  endSuffixClassName?: string;
  asElement?: ElementType;
  disabled?: boolean;
  invalid?: boolean;
  prefix?: string | ReactNode;
  rows?: number;
  ref?: Ref<ElementType | HTMLInputElement | HTMLTextAreaElement>;
  size?: TypeAttributes.ControlSize;
  suffix?: string | ReactNode;
  textArea?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: string | number;
  unstyle?: boolean;
  /** 🔥 Custom qo‘shilgan */
  numeric?: boolean;
  onChange?: (value: string) => void;
}

const PhoneInput = (props: InputProps) => {
  const {
    asElement: Component = "input",
    className,
    disabled,
    invalid,
    prefix,
    size,
    suffix,
    textArea,
    type = "text",
    ref,
    rows,
    style,
    startSuffixClassName,
    endSuffixClassName,
    unstyle = false,
    numeric = false,
    value,
    onChange,
    ...rest
  } = props;

  const [displayValue, setDisplayValue] = useState("");

  // 🔹 Faqat raqamlarni olish
  const onlyDigits = (val: string) => val.replace(/\D/g, "");

  // 🔹 Har 3 tadan keyin bo‘sh joy qo‘yish
  const formatValue = (val: string) => {
    const digits = onlyDigits(val);
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // 🔹 Dastlabki qiymatni formatlab qo‘yish
  useEffect(() => {
    if (numeric && value !== undefined) {
      setDisplayValue(formatValue(String(value)));
    } else if (!numeric && value !== undefined) {
      setDisplayValue(String(value));
    }
  }, [value, numeric]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (numeric) {
      const raw = onlyDigits(val);
      const formatted = formatValue(raw);
      setDisplayValue(formatted);
      if (onChange) onChange(raw); // backendga toza raqam
    } else {
      setDisplayValue(val);
      if (onChange) onChange(val);
    }
  };

  const { controlSize, direction } = useConfig();
  const formControlSize = useForm()?.size;
  const formItemInvalid = useFormItem()?.invalid;
  const inputGroupSize = useInputGroup()?.size;

  const inputSize = size || inputGroupSize || formControlSize || controlSize;
  const isInputInvalid = invalid || formItemInvalid;

  const inputDefaultClass = "input";
  const inputSizeClass = `input-${inputSize} ${CONTROL_SIZES[inputSize].h}`;
  const inputFocusClass = `focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary`;
  const inputWrapperClass = classNames(
    "input-wrapper",
    prefix || suffix ? className : ""
  );
  const inputClass = classNames(
    inputDefaultClass,
    !textArea && inputSizeClass,
    !isInputInvalid && inputFocusClass,
    !prefix && !suffix ? className : "",
    disabled && "input-disabled",
    isInputInvalid && "input-invalid",
    textArea && "input-textarea"
  );

  const prefixNode = useRef<HTMLDivElement>(null);
  const suffixNode = useRef<HTMLDivElement>(null);

  const getAffixSize = () => {
    if (!prefixNode.current && !suffixNode.current) return;
    const prefixNodeWidth = prefixNode?.current?.offsetWidth;
    const suffixNodeWidth = suffixNode?.current?.offsetWidth;
    if (prefixNodeWidth) setPrefixGutter(prefixNodeWidth);
    if (suffixNodeWidth) setSuffixGutter(suffixNodeWidth);
  };

  const [prefixGutter, setPrefixGutter] = useState(0);
  const [suffixGutter, setSuffixGutter] = useState(0);

  useEffect(() => {
    getAffixSize();
  }, [prefix, suffix]);

  const remToPxConvertion = (pixel: number) => 0.0625 * pixel;

  const affixGutterStyle = () => {
    const leftGutter = `${remToPxConvertion(prefixGutter) + 1}rem`;
    const rightGutter = `${remToPxConvertion(suffixGutter) + 1}rem`;
    const gutterStyle: { paddingLeft?: string; paddingRight?: string } = {};

    if (direction === "ltr") {
      if (prefix) gutterStyle.paddingLeft = leftGutter;
      if (suffix) gutterStyle.paddingRight = rightGutter;
    } else {
      if (prefix) gutterStyle.paddingRight = leftGutter;
      if (suffix) gutterStyle.paddingLeft = rightGutter;
    }

    return gutterStyle;
  };

  const inputProps = {
    className: !unstyle ? inputClass : "",
    disabled,
    type: numeric ? "text" : type, // 🔥 number emas, text, lekin raqamli nazorat
    ref,
    value: displayValue,
    onChange: handleChange,
    inputMode: numeric ? "numeric" : undefined,
    ...rest,
  };

  const renderInput = (
    <Component style={{ ...affixGutterStyle(), ...style }} {...inputProps} />
  );

  return prefix || suffix ? (
    <span className={inputWrapperClass}>
      {prefix ? (
        <div
          ref={prefixNode}
          className={"input-suffix-start " + startSuffixClassName}
        >
          {prefix}
        </div>
      ) : null}
      {renderInput}
      {suffix ? (
        <div
          ref={suffixNode}
          className={"input-suffix-end " + endSuffixClassName}
        >
          {suffix}
        </div>
      ) : null}
    </span>
  ) : (
    renderInput
  );
};

export default PhoneInput;
