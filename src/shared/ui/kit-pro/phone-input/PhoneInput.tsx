import { useEffect, useRef, useState, type ChangeEvent } from "react";
import classNames from "classnames";
import { useKeyboard } from "@/app/providers/KeyboardProvider";
import { useConfig } from "../../kit/ConfigProvider";
import { useForm, useFormItem } from "../../kit/Form/context";
import { useInputGroup } from "../../kit/InputGroup/context";

export interface PhoneInputProps {
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: "sm" | "md" | "lg";
    value?: string;
    inputMode?: "none"; // raw: "998901234567"
    onChange?: (value: string) => void;
    autoFocus?: boolean;
}

const PhoneInput = ({
    className,
    disabled,
    invalid,
    size,
    inputMode = "none",
    value,
    onChange,
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
        "input !h-10",
        `input-${inputSize}`,
        !isInputInvalid && "focus:ring-primary focus:border-primary",
        disabled && "input-disabled",
        isInputInvalid && "input-invalid",
        "bg-gray-100 text-gray-800 placeholder-gray-400 rounded-md px-3",
        className,
    );

    // =================== Helpers ===================
    const onlyDigits = (val: string) => val.replace(/\D/g, "");

    const normalizeRaw = (val: string): string => {
        let digits = onlyDigits(val);

        // Bo'sh yoki "9" / "99" / "998" — partial prefix, local qism yo'q
        if (
            digits.length === 0 ||
            (digits.length <= 3 && "998".startsWith(digits))
        ) {
            return "998";
        }

        if (!digits.startsWith("998")) digits = "998" + digits;
        return digits.slice(0, 12);
    };

    const formatPhone = (raw: string): string => {
        const d = raw.slice(3);
        let formatted = "+998";
        if (d.length > 0) formatted += ` ${d.slice(0, 2)}`;
        if (d.length > 2) formatted += ` ${d.slice(2, 5)}`;
        if (d.length > 5) formatted += ` ${d.slice(5, 7)}`;
        if (d.length > 7) formatted += ` ${d.slice(7, 9)}`;
        return formatted;
    };

    // =================== State ===================
    const [rawValue, setRawValue] = useState(() => normalizeRaw(value ?? ""));

    useEffect(() => {
        if (value !== undefined) {
            setRawValue(normalizeRaw(value));
        }
    }, [value]);

    // =================== Main Handler ===================
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        let inputValue = input.value;

        // +998 ni majburiy saqlash
        if (!inputValue.startsWith("+998")) {
            inputValue = "+998" + onlyDigits(inputValue).replace(/^998?/, "");
        }

        const newRaw = normalizeRaw(inputValue);
        const formatted = formatPhone(newRaw);

        // Cursor oldidagi raqamlar soni
        const cursorPos = input.selectionStart ?? 0;
        const digitsBefore = onlyDigits(inputValue.slice(0, cursorPos)).length;

        setRawValue(newRaw);
        onChange?.(newRaw);

        // Cursor pozitsiyasini to'g'rilash
        let newCursor = 4; // +998 dan keyin
        let count = 0;

        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) {
                count++;
                if (count >= digitsBefore - 3) {
                    // -3 chunki 998 hisoblanmaydi
                    newCursor = i + 1;
                    break;
                }
            }
        }

        if (digitsBefore - 3 >= newRaw.length - 3) {
            newCursor = formatted.length;
        }

        setTimeout(() => {
            input.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    // =================== KeyDown - Eng muhim qism ===================
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const cursor = input.selectionStart ?? 0;

        if ((e.key === "Backspace" || e.key === "Delete") && cursor <= 4) {
            e.preventDefault();
            return;
        }
    };

    const clampCursor = (el: HTMLInputElement) => {
        const minPos = 4; // "+998" dan keyin
        const pos = el.selectionStart ?? 0;
        if (pos < minPos) {
            el.setSelectionRange(minPos, minPos);
        }
    };

    const handleFocus = () => {
        // Cursor +998 dan keyinga o'tkazish
        setTimeout(() => {
            if (inputRef.current) clampCursor(inputRef.current);
        }, 0);

        const fieldObj: any = {
            type: "phone",
            onChange: (val: string) => {
                const el = inputRef.current;
                if (!el) return;
                const newRaw = normalizeRaw(val);
                setRawValue(newRaw);
                onChange?.(newRaw);
                const formatted = formatPhone(newRaw);
                const cursorPos = newRaw === "998" ? 4 : formatted.length;
                setTimeout(() => el.setSelectionRange(cursorPos, cursorPos), 0);
            },
            ref: inputRef,
        };
        fieldObjRef.current = fieldObj;
        registerField(fieldObj);
    };

    const handleClick = () => {
        if (inputRef.current) clampCursor(inputRef.current);
    };

    const handleSelect = () => {
        if (inputRef.current) clampCursor(inputRef.current);
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
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onSelect={handleSelect}
            onFocus={handleFocus}
            onBlur={handleBlur}
            inputMode={inputMode}
            placeholder="+998 XX XXX XX XX"
            autoComplete="off"
        />
    );
};

export default PhoneInput;
