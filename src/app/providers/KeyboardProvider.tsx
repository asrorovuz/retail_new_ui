// KeyboardProvider.tsx
import React, { createContext, useContext, useRef } from "react";

type KeyboardType = "numeric" | "qwerty" | "alphanumeric" | null;

interface ActiveField {
    type: KeyboardType;
    onChange: (value: string) => void;
    ref: React.RefObject<HTMLInputElement>;
}

interface KeyboardContextType {
    registerField: (field: ActiveField) => void;
    unregisterField: (field?: ActiveField) => void;
    insert: (key: string, onClickNumber?: () => void) => void;
    backspace: (onBackSpace?: () => void) => void;
    clear: (onClear?: () => void) => void;
    blurActiveField: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(
    undefined,
);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const activeFieldRef = useRef<ActiveField | null>(null);

    const registerField = (field: ActiveField) => {
        activeFieldRef.current = field;
    };

    // ✅ Правильный вариант
    const unregisterField = (field?: ActiveField) => {
        if (!activeFieldRef.current) return;

        if (!field || activeFieldRef.current.ref === field.ref) {
            activeFieldRef.current = null;
        }
    };

    const insert = (key: string, onClickNumber?: () => void) => {
        const activeField = activeFieldRef.current;

        // 🔥 Fokus yo'q bo'lsa
        if (!activeField || !activeField.ref.current) {
            onClickNumber?.();
            return;
        }

        const input = activeField.ref.current;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const currentValue = input.value;

        if (activeField.type === "numeric" && !/[\d.]/.test(key)) return;

        let newValue =
            currentValue.substring(0, start) +
            key +
            currentValue.substring(end);

        if (activeField.type === "numeric") {
            if (newValue.split(".").length > 2) return;
        }

        activeField.onChange(newValue);

        requestAnimationFrame(() => {
            input.setSelectionRange(start + key.length, start + key.length);
        });
    };

    const backspace = (onBackSpace?: () => void) => {
        const activeField = activeFieldRef.current;

        // 🔥 Fokus yo'q bo'lsa fallback ishlaydi
        if (!activeField || !activeField.ref.current) {
            onBackSpace?.();
            return;
        }

        const input = activeField.ref.current;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const currentValue = input.value;
        let newValue = currentValue;

        if (start !== end) {
            newValue =
                currentValue.substring(0, start) + currentValue.substring(end);
        } else if (start > 0) {
            newValue =
                currentValue.substring(0, start - 1) +
                currentValue.substring(start);
        } else {
            return;
        }

        activeField.onChange(newValue);

        requestAnimationFrame(() => {
            if (document.activeElement === input) {
                const newPos = start !== end ? start : start - 1;
                input.setSelectionRange(newPos, newPos);
            }
        });
    };

    const clear = (onClear?: () => void) => {
        const activeField = activeFieldRef.current;

        if (!activeField || !activeField.ref.current) {
            onClear?.();
            return;
        }

        const input = activeField.ref.current;

        activeField.onChange("");

        requestAnimationFrame(() => {
            input.setSelectionRange(0, 0);
        });
    };

    const blurActiveField = () => {
        const activeField = activeFieldRef.current;

        if (activeField?.ref?.current) {
            activeField.ref.current.blur();
        }

        activeFieldRef.current = null;
    };

    return (
        <KeyboardContext.Provider
            value={{
                registerField,
                unregisterField,
                insert,
                backspace,
                clear,
                blurActiveField,
            }}
        >
            {children}
        </KeyboardContext.Provider>
    );
};

export const useKeyboard = () => {
    const context = useContext(KeyboardContext);
    if (!context)
        throw new Error("useKeyboard must be used within a KeyboardProvider");
    return context;
};
