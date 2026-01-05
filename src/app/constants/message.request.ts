export const messages = {
  uz: {
    SUCCESS_MESSAGE: "Muvaffaqiyatli!",
    SUCCESS_CREATE_SHIFT: "Smena muvaffaqiyatli yaratildi!",
    SUCCESS_CLOSE_SHIFT: "Smena muvaffaqiyatli yopildi!",
    ERROR_MESSAGE: "Xatolik yuz berdi!",
    UNKNOWN_ERROR: "Nomaʼlum xatolik",
    NAME_EXISTS: "Bunday nom allaqachon mavjud",
    BARCODE_EXISTS: "Bu shtrixkod allaqachon mavjud",
    INVALID_LOGIN: "Login yoki parol noto‘g‘ri",
  },
  ru: {
    SUCCESS_MESSAGE: "Успешно!",
    SUCCESS_CREATE_SHIFT: "Смена успешно создана!",
    SUCCESS_CLOSE_SHIFT: "Смена успешно закрыта!",
    ERROR_MESSAGE: "Произошла ошибка!",
    UNKNOWN_ERROR: "Неизвестная ошибка",
    NAME_EXISTS: "Имя уже существует",
    BARCODE_EXISTS: "Штрихкод уже существует",
    INVALID_LOGIN: "Неверный логин или пароль",
  },
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  notID: "Такой товар не найден",
  error:
    "Произошла ошибка: не выбрана строка или возникла непредвиденная ошибка",
  name_exist: "Товар с таким названием уже существует",
  barcode_dublicated: "Штрих-код продублирован в файле",
  barcode_exist: "Товар с таким штрих-кодом уже существует",
  code_exist: "Товар с таким кодом уже существует",
  product_price_type_not_found: "Тип цены для товара не найден",
  product_not_found: "Товар не найден",
  category_not_found: "Категория не найдена",
  unit_not_found: "Единица измерения не найдена",
  package_not_found: "Упаковка не найдена",
  supplier_not_found: "Поставщик не найден",
};
