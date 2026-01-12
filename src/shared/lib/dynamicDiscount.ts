export function getDynamicDiscounts(amount: number, scale: number = 2): number[] {
  if (amount < 1000) return [];

  const DENOMINATIONS = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
  const MAX_DISCOUNT = 10000;

  const discounts = new Set<number>();

  for (const d of DENOMINATIONS) {
    const discount = amount % d;
    if (discount > 0 && discount <= MAX_DISCOUNT) {
      // `toFixed` string qaytaradi, shuning uchun qayta number ga o‘giramiz
      discounts.add(Number(discount.toFixed(scale)));
    }
  }

  return Array.from(discounts)
    .sort((a, b) => a - b)
    .slice(0, 4);
}
