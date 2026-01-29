export const getActivePrice = (item: any, type: "sale" | "refund" | "purchase", selectedRows: any) => {
  if (type === "sale" && selectedRows?.[item.productId]) {
    return item.priceAmoutBulk > 0
      ? item.priceAmoutBulk
      : item.priceAmount;
  }
  return item.priceAmount;
};
