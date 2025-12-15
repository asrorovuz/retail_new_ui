import {
  CurrencyCodeUZS,
  CurrencyCodeUZSText,
  CurrencyRateUZS,
  PaymentTypeCashCode,
  PaymentTypeCashText,
} from "@/app/constants/paymentType";

export default {
  getDefaultPrice(type: any) {
    return [
      {
        amount: null,
        ...(type && {
          type: {
            id: PaymentTypeCashCode,
            text: PaymentTypeCashText,
          },
        }),
        currency: {
          code: CurrencyCodeUZS,
          name: CurrencyCodeUZSText,
          rate: CurrencyRateUZS,
        },
      },
    ];
  },

  calculateToPay(prices: any[] = []) {
    if (prices.length === 0) return [];

    const map = new Map();

    prices.forEach((price) => {
      const code = price?.currency?.code;
      const amount = Number(price?.amount || 0);

      if (!map.has(code)) {
        map.set(code, {
          currency: price.currency,
          amount,
          ...(price?.type ? { type: price.type } : {}),
        });
      } else {
        const entry = map.get(code);
        entry.amount += amount;
      }
    });

    return Array.from(map.values());
  },
};
