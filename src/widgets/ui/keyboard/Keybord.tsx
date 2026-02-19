import React from "react";
import NumericKeyboard from "./NumericKeyboard";
import QuertyKeyboard from "./QuertyKeyboard";

interface KeyboardSwitcherProps {
  onClickNumber: (num: string) => void;
  activeType: "numeric" | "qwerty" | null;
  setActiveType: (type: "numeric" | "qwerty") => void;
  setSearch: (val: string) => void;
}

export const KeyboardSwitcher: React.FC<KeyboardSwitcherProps> = ({
  onClickNumber,
  activeType,
  setActiveType,
  setSearch,
}) => {
  if (!activeType) return null;

  return (
    <>
      {activeType === "numeric" && (
        <NumericKeyboard onClickNumber={onClickNumber} />
      )}

      {activeType === "qwerty" && (
        <QuertyKeyboard
          setActiveType={setActiveType}
          setSearch={setSearch}
        />
      )}
    </>
  );
};
