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

  // Verguldan keyingi raqamlarni cheklash (default 3, trailing nollarni trim)
  let formattedDecimal = decimalPart ?? "";

  if (decimalPart) {
    const maxScale = scale !== undefined ? scale : 3;
    formattedDecimal = decimalPart.slice(0, maxScale).replace(/0+$/, "");
  }

  // Yakuniy format
  const formatted = formattedDecimal
    ? `${grouped}.${formattedDecimal}`
    : grouped;

  return <span>{formatted}</span>;
};

export default FormattedNumber;
