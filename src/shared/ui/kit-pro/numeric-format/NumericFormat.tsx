import React from "react";

interface FormattedNumberProps {
  value: number | string;
  scale?: number; // kasr aniqligi (default: 2)
  showGrouping?: boolean; // 1 000 vs 1000
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  scale = 2,
  showGrouping = true,
}) => {
  const num = Number(value);

  // Agar son emas bo‘lsa, bo‘sh chiqadi
  if (isNaN(num)) return <span>-</span>;

  // Butun va kasr qismini ajratamiz
  const [integerPart, decimalPart = ""] = num.toFixed(scale).split(".");

  // Guruhlash (masalan, 10000 -> 10 000)
  const grouped = showGrouping
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : integerPart;

  // Yakuniy formatlangan qiymat
  const formatted = scale > 0 ? `${grouped}.${decimalPart}` : grouped;

  return <span>{formatted}</span>;
};

export default FormattedNumber;
