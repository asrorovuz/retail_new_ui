import type { Currency } from "@/@types/products";
import classNames from "./classNames";
import { CurrencyCodeUSD, CurrencyCodeUZS } from "@/app/constants/paymentType";


type CurrencyNameProps = {
  currency: Currency;
  className?: string;
};

const CurrencyName = ({ currency, className }: CurrencyNameProps) => {
  
  return (
    <span
      className={classNames(
        `capitalize font-semibold`,
        currency?.code === CurrencyCodeUZS
          ? "text-primary"
          : currency?.code === CurrencyCodeUSD
          ? "text-warning"
          : "",
        className
      )}
    >
      {currency?.name}
    </span>
  );
};

export default CurrencyName;
