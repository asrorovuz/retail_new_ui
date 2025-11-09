import React from "react";

interface FormattedNumberProps {
  value: number | string;
  scale?: number; // verguldan keyingi raqamlar soni (masalan, 2 => .12)
  showGrouping?: boolean; // 1 000 vs 1000
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  scale,
  showGrouping = true,
}) => {
  const strValue = String(value ?? "");

  // Bo'sh yoki "NaN" holat
  if (!strValue || strValue === "NaN") return <span>-</span>;

  // Butun va kasr qismlarini ajratamiz
  const [integerPart, decimalPart] = strValue.split(/[.,]/); // . yoki , bo‘lishi mumkin

  // Butun qismni minglik bo‘yicha ajratamiz
  const grouped = showGrouping
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : integerPart;

  // Agar foydalanuvchi hali "." ni yozgan bo‘lsa (masalan: "123.")
  if (strValue.endsWith(".")) {
    return <span>{grouped}.</span>;
  }

  // Agar scale berilgan bo‘lsa → verguldan keyingi raqamlarni kesib tashlaymiz
  let formattedDecimal = decimalPart ?? "";

  if (scale !== undefined && scale >= 0 && decimalPart) {
    formattedDecimal = decimalPart.slice(0, scale);
  }

  // Yakuniy format
  const formatted = formattedDecimal
    ? `${grouped}.${formattedDecimal}`
    : grouped;

  return <span>{formatted}</span>;
};

export default FormattedNumber;
