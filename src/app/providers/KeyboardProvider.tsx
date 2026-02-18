// KeyboardContext.tsx - The context and provider for managing active input and keyboard actions
import React, { createContext, useContext } from "react";

type KeyboardType = "numeric" | "qwerty" | "alphanumeric" | null;

interface ActiveField {
  type: KeyboardType;
  onChange: (value: string) => void;
  ref: React.RefObject<HTMLInputElement>;
}

interface KeyboardContextType {
  // activeType: KeyboardType;
  // setActiveType: (type: KeyboardType) => void;
  registerField: (field: ActiveField) => void;
  unregisterField: () => void;
  insert: (key: string, onClickNumber?: () => void) => void;
  backspace: () => void;
  blurActiveField: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined,
);

import { useRef } from "react";

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeType, setActiveType] = React.useState<KeyboardType>("numeric");
  const activeFieldRef = useRef<ActiveField | null>(null);

  const registerField = (field: ActiveField) => {
    activeFieldRef.current = field;
  };

  const unregisterField = () => {
    activeFieldRef.current = null;
  };

  const insert = (key: string, onClickNumber?: () => void) => {
    const activeField = activeFieldRef.current;

    if (!activeField?.ref?.current) {
      // Faqat numeric keyboard sahifasida onClickNumber chaqiriladi
      if (
        typeof onClickNumber === "function" &&
        activeField?.type === "numeric"
      ) {
        onClickNumber();
      }
      return;
    }

    const input = activeField.ref.current;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const currentValue = input.value;

    // Agar type numeric bo'lsa, faqat raqam kiritish
    if (activeField.type === "numeric" && !/[\d.]/.test(key)) {
      return; // raqam bo'lmagan belgilarni o'tkazib yuborish
    }

    let newValue =
      currentValue.substring(0, start) + key + currentValue.substring(end);

    // Agar numeric bo'lsa, tekshirish — faqat bitta '.' bo'lishi mumkin
    if (activeField?.type === "numeric") {
      const parts = newValue.split(".");
      if (parts.length > 2) {
        return; // ko'p nuqta bo'lsa insert qilinmasin
      }
    }

    activeField.onChange(newValue);

    requestAnimationFrame(() => {
      if (document.activeElement === input) {
        input.setSelectionRange(start + key.length, start + key.length);
      }
    });
  };

  const backspace = () => {
    const activeField = activeFieldRef.current;
    if (!activeField?.ref.current) return;

    const input = activeField.ref.current;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const currentValue = input.value;
    let newValue = currentValue;

    if (start !== end) {
      newValue = currentValue.substring(0, start) + currentValue.substring(end);
    } else if (start > 0) {
      newValue =
        currentValue.substring(0, start - 1) + currentValue.substring(start);
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

  const blurActiveField = () => {
    const activeField = activeFieldRef.current;

    if (activeField?.ref?.current) {
      activeField.ref.current.blur(); // focus yo'qotadi
    }
  };

  return (
    <KeyboardContext.Provider
      value={{
        registerField,
        unregisterField,
        insert,
        backspace,
        blurActiveField,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
};
