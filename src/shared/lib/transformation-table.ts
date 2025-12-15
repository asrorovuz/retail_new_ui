

interface ProductColumnValue {
  visible: boolean;
}

interface ProductColumnsResponse {
  product?: {
    data_table_column?: Record<string, ProductColumnValue>;
  };
}

interface TableColumn {
  key: string;
  visible: boolean;
  color: string;
}

export const transformProductColumns = (
  settingsTable: ProductColumnsResponse
): TableColumn[] => {
  const columns = settingsTable?.product?.data_table_column || {};

  const keyMap: Record<string, string> = {
    product_name: "name",
    total_warehouses_state: "totalRemainder",
    package_quantity: "packInCount",
    measurement_name: "package",
    purchase_price: "purchesPrice",
    primary_price: "price",
    sku: "sku",
    code: "code",
  };

  return Object.entries(columns)
    .filter(([key]) => keyMap[key])
    .map(([key, value]) => ({
      key: keyMap[key],
      visible: (value as ProductColumnValue)?.visible ?? false,
      color: (value as any)?.color ?? "#fff",
    }));
};

export function convertArrayToBackendSettings(
  arr: { key: string; color: string | null; visible: boolean }[]
) {
  const keyMapping: Record<string, string> = {
    name: "product_name",
    totalRemainder: "total_warehouses_state",
    packInCount: "package_quantity",
    package: "measurement_name",
    price: "primary_price",
    purchesPrice: "purchase_price",
    sku: "sku",
    code: "code",
  };
  
  return arr.reduce((acc, item) => {
    const backendKey = keyMapping[item.key] || item.key;
    acc[backendKey] = {
      visible: item.visible,
      ...(item.color ? { color: item.color } : {}),
    };
    return acc;
  }, {} as Record<string, { visible: boolean; color?: string }>);
}
