import {
    useState,
    useEffect,
    useRef,
    type ChangeEvent,
    type ElementType,
    type ReactNode,
} from "react";
import classNames from "classnames";
import { useConfig } from "../ConfigProvider";
import { useForm, useFormItem } from "../Form/context";
import { useInputGroup } from "../InputGroup/context";
import { CONTROL_SIZES } from "../utils/constants";
import type { CommonProps, TypeAttributes } from "../@types/common";
import { useKeyboard } from "@/app/providers/KeyboardProvider";

type NumberMode = "int" | "float";
export interface InputProps
    extends
        CommonProps,
        Omit<
            React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
            "size" | "prefix" | "value" | "onChange"
        > {
    startSuffixClassName?: string;
    endSuffixClassName?: string;
    asElement?: ElementType;
    disabled?: boolean;
    invalid?: boolean;
    prefix?: string | ReactNode;
    numberMode?: NumberMode;
    rows?: number;
    ref?: React.Ref<ElementType | HTMLInputElement | HTMLTextAreaElement>;
    size?: TypeAttributes.ControlSize;
    suffix?: string | ReactNode;
    textArea?: boolean;
    type?: React.HTMLInputTypeAttribute;
    value?: string | readonly string[] | number | undefined | null;
    unstyle?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    replaceLeadingZero?: boolean;
    space?: boolean;
    autoFocus?: boolean;
}

const Input = (props: InputProps) => {
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
        numberMode,
        style,
        startSuffixClassName,
        endSuffixClassName,
        unstyle = false,
        value,
        onChange,
        onFocus,
        onBlur,
        autoFocus = false,
        replaceLeadingZero = false,
        space = true,
        ...rest
    } = props;

    const [displayValue, setDisplayValue] = useState<string>(
        value ? String(value) : "",
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fieldObjRef = useRef<any | null>(null); // ActiveField obyekti saqlash uchun

    // tayyorlaydigan funksiya, register uchun foydalanamiz
    // const createFieldObj = () => ({
    //   type: type === "number" ? "numeric" : "qwerty",

    //   onChange: (val: string) => {
    //     let raw = val;

    //     if (type === "number") {
    //       raw = raw.replace(/\s+/g, "");

    //       if (numberMode === "int") {
    //         raw = raw.replace(/[^0-9]/g, "");
    //       } else {
    //         raw = raw.replace(/[^0-9.]/g, "");
    //         const parts = raw.split(".");
    //         if (parts.length > 2) {
    //           raw = parts[0] + "." + parts.slice(1).join("");
    //         }
    //       }
    //     }

    //     setDisplayValue(space && type === "number" ? formatValue(raw) : raw);

    //     onChange?.({
    //       target: { value: raw },
    //     } as any);
    //   },
    //   ref: inputRef as React.RefObject<HTMLInputElement>,
    // });
    const createFieldObj = () => {
        const currentRef = textArea ? textareaRef : inputRef;

        return {
            type: type === "number" ? "numeric" : "qwerty",
            onChange: (val: string) => {
                let raw = val;

                if (type === "number") {
                    raw = raw.replace(/\s+/g, "");

                    if (numberMode === "int") {
                        raw = raw.replace(/[^0-9]/g, "");
                    } else {
                        raw = raw.replace(/[^0-9.]/g, "");
                        const parts = raw.split(".");
                        if (parts.length > 2) {
                            raw = parts[0] + "." + parts.slice(1).join("");
                        }
                    }
                }

                setDisplayValue(
                    space && type === "number" ? formatValue(raw) : raw,
                );

                onChange?.({
                    target: { value: raw },
                } as any);
            },
            ref: currentRef, // 🔥 MUHIM
        };
    };

    const onlyValidNumbers = (val: string) => val.replace(/[^0-9.]/g, "");
    const onlyInt = (val: string) => val.replace(/[^0-9]/g, "");

    const onlyFloat = (val: string) => val.replace(/[^0-9.]/g, "");

    const formatValue = (val: string) => {
        if (val.includes(".")) {
            const [intPart, decPart] = val.split(".");
            const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return `${formattedInt}.${decPart}`;
        }
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const { registerField, unregisterField } = useKeyboard();

    useEffect(() => {
        if (type === "number" && value !== undefined && value !== null) {
            const val = String(value);
            setDisplayValue(space ? formatValue(val) : onlyValidNumbers(val));
        } else if (value !== undefined && value !== null) {
            setDisplayValue(
                space ? String(value) : String(value).replace(/\s+/g, ""),
            );
        }
    }, [value, type, space]);

    useEffect(() => {
        const current = textArea ? textareaRef.current : inputRef.current;
        if (autoFocus && current) {
            setTimeout(() => {
                current.focus();
                current.select();
            }, 0);
        }
    }, [autoFocus, textArea]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        let val = e.target.value;

        if (type === "number") {
            let raw = onlyValidNumbers(val);

            if (replaceLeadingZero && raw.length > 1 && raw.startsWith("0")) {
                raw = raw.replace(/^0+/, "");
            }

            if (numberMode === "int") {
                raw = onlyInt(val);
            } else {
                raw = onlyFloat(val);

                const dotCount = (raw.match(/\./g) || []).length;
                if (dotCount > 1) {
                    raw = raw.slice(0, raw.lastIndexOf("."));
                }
            }

            const formatted = space ? formatValue(raw) : raw;
            setDisplayValue(formatted);

            // 🔹 fakeEvent saqlanadi
            const fakeEvent = {
                ...e,
                target: { ...e.target, value: raw },
            } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

            onChange?.(fakeEvent);
        } else {
            if (!space) val = val.replace(/\s+/g, "");
            setDisplayValue(val);
            onChange?.({
                ...e,
                target: { ...e.target, value: val },
            } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
        }
    };

    const handleFocus = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        e.target.select();
        onFocus?.(e as React.FocusEvent<HTMLInputElement>);

        // register qilish
        const fieldObj: any = createFieldObj();
        fieldObjRef.current = fieldObj;
        registerField(fieldObj);
    };

    const handleBlur = (e: any) => {
        onBlur?.(e);  
        if (fieldObjRef.current) {
            // provider unregisterField signature'iga qarab yuqoridagi object-ni uzatamiz
            unregisterField(fieldObjRef.current);
            fieldObjRef.current = null;
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
    const inputFocusClass =
        "focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary";

    const inputWrapperClass = classNames(
        "input-wrapper",
        prefix || suffix ? className : "",
    );
    const inputClass = classNames(
        inputDefaultClass,
        !textArea && inputSizeClass,
        !isInputInvalid && inputFocusClass,
        !prefix && !suffix ? className : "",
        disabled && "input-disabled",
        isInputInvalid && "input-invalid",
        textArea && "input-textarea",
    );

    const prefixNode = useRef<HTMLDivElement>(null);
    const suffixNode = useRef<HTMLDivElement>(null);
    const [prefixGutter, setPrefixGutter] = useState(0);
    const [suffixGutter, setSuffixGutter] = useState(0);

    const getAffixSize = () => {
        if (!prefixNode.current && !suffixNode.current) return;
        const prefixNodeWidth = prefixNode?.current?.offsetWidth;
        const suffixNodeWidth = suffixNode?.current?.offsetWidth;
        if (prefixNodeWidth) setPrefixGutter(prefixNodeWidth);
        if (suffixNodeWidth) setSuffixGutter(suffixNodeWidth);
    };

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
        }
        if (direction === "rtl") {
            if (prefix) gutterStyle.paddingRight = leftGutter;
            if (suffix) gutterStyle.paddingLeft = rightGutter;
        }
        return gutterStyle;
    };

    const inputProps = {
        className: !unstyle ? inputClass : "",
        disabled,
        type: type === "number" ? "text" : type,
        ref: inputRef,
        value: displayValue,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        autoFocus,
        inputMode: "none",
        ...rest,
    };

    const renderTextArea = (
        <textarea
            style={{ ...affixGutterStyle(), ...style }}
            rows={rows}
            value={displayValue}
            onChange={
                handleChange as React.ChangeEventHandler<HTMLTextAreaElement>
            }
            onFocus={handleFocus} // 🔥 qo‘shildi
            onBlur={handleBlur} // 🔥 qo‘shildi
            ref={textareaRef}
            className={inputClass}
            disabled={disabled}
            {...rest}
        />
    );

    const renderInput = (
        <Component
            style={{ ...affixGutterStyle(), ...style }}
            {...inputProps}
        />
    );

    const renderAffixInput = (
        <span className={inputWrapperClass}>
            {prefix && (
                <div
                    ref={prefixNode}
                    className={"input-suffix-start " + startSuffixClassName}
                >
                    {prefix}
                </div>
            )}
            {renderInput}
            {suffix && (
                <div
                    ref={suffixNode}
                    className={"input-suffix-end " + endSuffixClassName}
                >
                    {suffix}
                </div>
            )}
        </span>
    );

    return textArea
        ? renderTextArea
        : prefix || suffix
          ? renderAffixInput
          : renderInput;
};

export default Input;
