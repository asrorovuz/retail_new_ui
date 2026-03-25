import { useEffect, useRef, useState, type ChangeEvent } from "react";
import classNames from "classnames";
import { useKeyboard } from "@/app/providers/KeyboardProvider";
import { useConfig } from "../../kit/ConfigProvider";
import { useForm, useFormItem } from "../../kit/Form/context";
import { useInputGroup } from "../../kit/InputGroup/context";
import { CONTROL_SIZES } from "../../kit/utils/constants";

export interface PhoneInputProps {
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
  value?: string;   
  inputMode?: "none"        // raw: "998901234567"
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}

const PhoneInput = ({
  className,
  disabled,
  invalid,
  size,
  inputMode,
  value,
  onChange,
  autoFocus = false,
}: PhoneInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldObjRef = useRef<any>(null);

  const { registerField, unregisterField } = useKeyboard();
  const { controlSize } = useConfig();
  const formControlSize = useForm()?.size;
  const formItemInvalid = useFormItem()?.invalid;
  const inputGroupSize = useInputGroup()?.size;

  const inputSize = size || inputGroupSize || formControlSize || controlSize;
  const isInputInvalid = invalid || formItemInvalid;

  const inputClass = classNames(
    "input",
    "!h-10",
    `input-${inputSize} ${CONTROL_SIZES[inputSize].h}`,
    !isInputInvalid && "focus:ring-primary focus:border-primary",
    disabled && "input-disabled",
    isInputInvalid && "input-invalid",
    "bg-gray-100 text-gray-800 placeholder-gray-400 rounded-md px-3",
    className
  );

  // =================== Helpers ===================
  const onlyDigits = (val: string) => val.replace(/\D/g, "");
  
  const normalizeRaw = (val: string) => {
    let digits = onlyDigits(val);
    if (!digits.startsWith("998")) digits = "998" + digits;
    return digits.slice(0, 12); // 998 + 9 digits
  };

  const formatPhone = (raw: string) => {
    const d = raw.slice(3); // remove '998'
    let formatted = "+998";
    if (d.length > 0) formatted += ` ${d.slice(0,2)}`;
    if (d.length > 2) formatted += ` ${d.slice(2,5)}`;
    if (d.length > 5) formatted += ` ${d.slice(5,7)}`;
    if (d.length > 7) formatted += ` ${d.slice(7,9)}`;
    return formatted;
  };

  const countDigits = (val: string) => (val.match(/\d/g) ?? []).length;

  const cursorFromDigits = (formatted: string, digitsBefore: number) => {
    let digitsSeen = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) digitsSeen++;
      if (digitsSeen >= digitsBefore) return i + 1;
    }
    return formatted.length;
  };

  // =================== State ===================
  const [rawValue, setRawValue] = useState(normalizeRaw(value ?? ""));

  useEffect(() => {
    if (value !== undefined) {
      setRawValue(normalizeRaw(value));
    }
  }, [value]);

  // =================== Handlers ===================
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const oldValue = input.value;
    const oldCursor = input.selectionStart ?? oldValue.length;

    // Nechta raqam cursor oldida
    const digitsBefore = Math.max(0, countDigits(oldValue.slice(0, oldCursor)) - 3); // 3 = '998'

    // Normalize va update
    const newRaw = normalizeRaw(oldValue);
    setRawValue(newRaw);
    onChange?.(newRaw);

    // Yangi cursor
    const newCursor = cursorFromDigits(formatPhone(newRaw), digitsBefore + 3);
    setTimeout(() => input.setSelectionRange(newCursor, newCursor), 0);
  };

  const handleFocus = () => {
    const fieldObj: any = {
      type: "phone",
      onChange: (val: string) => {
        const el = inputRef.current;
        if (!el) return;

        let newRaw = normalizeRaw(val);
        setRawValue(newRaw);
        onChange?.(newRaw);

        // Cursor oxirida bo'lsin
        const newCursor = formatPhone(newRaw).length;
        setTimeout(() => el.setSelectionRange(newCursor, newCursor), 0);
      },
      ref: inputRef,
    };
    fieldObjRef.current = fieldObj;
    registerField(fieldObj);

    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleBlur = () => {
    if (fieldObjRef.current) {
      unregisterField(fieldObjRef.current);
      fieldObjRef.current = null;
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className={inputClass}
      disabled={disabled}
      value={formatPhone(rawValue)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      inputMode={inputMode}
      placeholder="+998 XX XXX XX XX"
      autoComplete="off"
    />
  );
};

export default PhoneInput;