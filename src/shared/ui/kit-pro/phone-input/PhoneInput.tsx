import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
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
  /** 🔥 Telefon raqam kiritish rejimi */
  phone?: boolean;
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
    phone = false,
    value,
    onChange,
    ...rest
  } = props;

  const [displayValue, setDisplayValue] = useState("+998 ");

  // 🔹 Faqat raqamlarni olish
  const onlyDigits = (val: string) => val.replace(/\D/g, "");

  // 🔹 Telefon raqamni formatlash: +998 90 123 45 67
  const formatPhone = (val: string) => {
    const digits = onlyDigits(val);
    const rest = digits.startsWith("998") ? digits.slice(3) : digits;

    let formatted = "+998 ";

    if (rest.length <= 2) formatted += rest;
    else if (rest.length <= 5) formatted += `${rest.slice(0, 2)} ${rest.slice(2)}`;
    else if (rest.length <= 8)
      formatted += `${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
    else
      formatted += `${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(
        5,
        7
      )} ${rest.slice(7, 9)}`;

    return formatted.trim();
  };

  useEffect(() => {
    if (phone && value !== undefined) {
      setDisplayValue(formatPhone(String(value)));
    } else if (!phone && value !== undefined) {
      setDisplayValue(String(value));
    }
  }, [value, phone]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // 🔒 Foydalanuvchi +998 ni o‘chirib yubora olmasin
    if (!val.startsWith("+998")) {
      val = "+998 ";
    }

    if (phone) {
      const raw = onlyDigits(val);
      const formatted = formatPhone(raw);
      setDisplayValue(formatted);
      onChange?.(raw.startsWith("998") ? raw : `998${raw}`);
    } else {
      setDisplayValue(val);
      onChange?.(val);
    }
  };

  const { controlSize } = useConfig();
  const formControlSize = useForm()?.size;
  const formItemInvalid = useFormItem()?.invalid;
  const inputGroupSize = useInputGroup()?.size;

  const inputSize = size || inputGroupSize || formControlSize || controlSize;
  const isInputInvalid = invalid || formItemInvalid;

  const inputClass = classNames(
    "input",
    !textArea && `input-${inputSize} ${CONTROL_SIZES[inputSize].h}`,
    !isInputInvalid && "focus:ring-primary focus:border-primary",
    disabled && "input-disabled",
    isInputInvalid && "input-invalid",
    textArea && "input-textarea",
    "bg-gray-100 text-gray-800", // 🔥 orqa fonni to‘qroq qilish
    "placeholder-gray-400",
    "rounded-md px-3",
    className
  );

  const inputProps = {
    className: !unstyle ? inputClass : "",
    disabled,
    type: "text",
    ref,
    value: displayValue,
    onChange: handleChange,
    inputMode: phone ? "numeric" : undefined,
    ...rest,
  };

  return (
    <span className={classNames("input-wrapper", prefix || suffix ? className : "")}>
      {prefix && (
        <div
          ref={useRef<HTMLDivElement>(null)}
          className={"input-suffix-start " + startSuffixClassName}
        >
          {prefix}
        </div>
      )}
      <Component style={style} {...inputProps} />
      {suffix && (
        <div
          ref={useRef<HTMLDivElement>(null)}
          className={"input-suffix-end " + endSuffixClassName}
        >
          {suffix}
        </div>
      )}
    </span>
  );
};

export default PhoneInput;
