import React from "react";

interface FormattedNumberProps {
  value: number | string;
  scale?: number; // verguldan keyingi raqamlar soni (masalan, 2 => .12)
  showGrouping?: boolean; // 1 000 vs 1000
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  scale = 2,
  showGrouping = true,
}) => {
  const num = Number(value);

  // NaN bo‘lsa, hech narsa chiqmasin
  if (isNaN(num)) return <span>-</span>;

  // Sonni stringga aylantiramiz
  const strValue = String(value);
  const [integerPart, decimalPart] = strValue.split(/[.,]/); // . yoki , bo‘lishi mumkin

  // Guruhlash (masalan, 10000 -> 10 000)
  const grouped = showGrouping
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : integerPart;

  // Agar kasr bo‘lsa, scale bo‘yicha kesib tashlaymiz
  const formattedDecimal =
    decimalPart && scale > 0
      ? decimalPart.slice(0, scale).replace(/0+$/, "") // oxirgi nolni olib tashlash
      : "";

  // Yakuniy format
  const formatted = formattedDecimal
    ? `${grouped}.${formattedDecimal}`
    : grouped;

  return <span>{formatted}</span>;
};

export default FormattedNumber;
