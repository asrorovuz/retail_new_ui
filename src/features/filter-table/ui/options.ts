export type FilterParams = {
  is_legal: null | "white" | "black";
  category_exists: boolean | null;
  category_id: number | null;
  state: null | number;
  measurement_code: number | null;
  sku: string | null;
  sku_exists: boolean | null;
  code: string | null;
  code_exists: boolean | null;
  barcode_exists: null | boolean;
  catalog_code_exists: null | boolean;
  sort: null | number;
  is_selling_at_loss: null | boolean;
};

export const isLegalOptions = [
  { label: "Все", value: null },
  { label: "Белые", value: true },
  { label: "Чёрные", value: false },
];

export const categoryOptions = [
  { label: "Все", value: null },
  { label: "Да", value: true },
  { label: "Нет", value: false },
];

export const stateOptions = [
  { label: "Все", value: null },
  { label: "В наличии", value: 1 },
  { label: "Нет в наличии", value: 2 },
  { label: "Мало на складе", value: 3 },
  { label: "Менее 0", value: 4 },
];

export const measurmentOptions = [
  { label: "Штука", value: 0 },
  { label: "Килограмм", value: 1 },
  { label: "Грамм", value: 2 },
  { label: "Литр", value: 3 },
  { label: "Метр", value: 4 },
  { label: "Квадратный метр", value: 5 },
];

export const artiklOptions = [
  { label: "Все", value: null },
  { label: "Да", value: true },
  { label: "Нет", value: false },
];

export const barcodeOptions = [
  { label: "Все", value: null },
  { label: "Со штрих-кодом", value: true },
  { label: "Без штрих-кода", value: false },
];

export const mxikOptions = [
  { label: "Все", value: null },
  { label: "С кодом МХИК", value: true },
  { label: "Без кода МХИК", value: false },
];

export const packageCodeOptions = [
  { label: "Все", value: null },
  { label: "С кодом упаковки", value: true },
  { label: "Без кода упаковки", value: false },
];

export const purchaseGreaterThanSaleOptions = [
  { label: "По умолчанию", value: null },
  { label: "Да", value: true },
  { label: "Нет", value: false },
];

export const sortOptions = [
  { label: "По умолчанию", value: null },

  // Розничная цена (Common price)
  {
    label: "Розничная цена (по возрастанию)",
    value: 1,
  },
  {
    label: "Розничная цена (по убыванию)",
    value: 2,
  },

  // Оптовая цена (Bulk price)
  {
    label: "Оптовая цена (по возрастанию)",
    value: 3,
  },
  {
    label: "Оптовая цена (по убыванию)",
    value: 4,
  },

  // Закупочная цена (Purchase price)
  {
    label: "Закупочная цена (по возрастанию)",
    value: 5,
  },
  {
    label: "Закупочная цена (по убыванию)",
    value: 6,
  },

  // Прибыль (сумма)
  {
    label: "Наибольшая прибыль",
    value: 7,
  },
  {
    label: "Наименьшая прибыль",
    value: 8,
  },

  // Прибыль в процентах (маржа)
  {
    label: "Наибольшая прибыль (в процентах)",
    value: 9,
  },
  {
    label: "Наименьшая прибыль (в процентах)",
    value: 10,
  },

  // Название
  {
    label: "По названию (по возрастанию)",
    value: 11,
  },
  {
    label: "По названию (по убыванию)",
    value: 12,
  },

  // Дата создания
  {
    label: "По дате создания (по возрастанию)",
    value: 13,
  },
  {
    label: "По дате создания (по убыванию)",
    value: 14,
  },

  // Остаток
  {
    label: "По остатку (по возрастанию)",
    value: 15,
  },
  {
    label: "По остатку (по убыванию)",
    value: 16,
  },

  // Артикул (SKU)
  {
    label: "По артикулу (по возрастанию)",
    value: 17,
  },
  {
    label: "По артикулу (по убыванию)",
    value: 18,
  },
];
