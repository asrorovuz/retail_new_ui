import React from "react";
import NumericKeyboard from "./NumericKeyboard";
import QuertyKeyboard from "./QuertyKeyboard";

export const KeyboardSwitcher: React.FC<any> = ({
  onClickNumber, 
  activeType,
}) => {

  if (!activeType) return null;

  return (
    <>
      {activeType === "numeric" && (
        <NumericKeyboard onClickNumber={onClickNumber} />
      )}
      {activeType === 'qwerty' && <QuertyKeyboard />}
      {/* {activeType === 'alphanumeric' && <AlphanumericKeyboard />} */}
    </>
  );
};
