import i18next from "i18next";
import { toast } from "react-toastify";

type ErrorResponse = {
    name_exsist?: boolean;
    barcode_exsist?: boolean;
    login?: string;
    invalid_username_or_password?: boolean;
    message?: string;
    data?: any;
} & Record<string, any>;

export const showSuccessMessage = (msgUz: string, msgRu?: string) => {
    const lang = i18next.language;
    const message = lang === "ru" ? msgRu || msgUz : msgUz;

    toast.success(message, {
        position: "bottom-right",
        autoClose: 2000,
    });
};

export const showErrorLocalMessage = (message: string) => {
    toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
    });
};

export const showErrorMessage = (err: ErrorResponse | any) => {
    const lang = i18next.language;

    // const status_code = err?.response?.status || err?.status_code;
    const error: ErrorResponse = err?.response?.data ||
        err?.data ||
        err || { message: "Unknown error" };
    const statusCode = err?.code || err?.status_code;

    if (typeof error === "string" && statusCode === 404) {
        return toast.error(
            lang === "ru"
                ? "Такая страница не найдена"
                : "Bunday sahifa mavjud emas",
            {
                position: "bottom-left",
                closeOnClick: true,
                draggable: true,
            },
        );
    }

    // 2️⃣ - API dan kelgan javob
    if (typeof error === "object" && error !== null) {

        if (error.invalid_username_or_password) {
            return toast.error(
                lang === "ru"
                    ? "Неверный логин или пароль"
                    : "Login yoki parol noto‘g‘ri",
            );
        }

        if (error.currency_not_found) {
            return toast.error(
                lang === "ru" ? "Валюта не найдена" : "Valyuta topilmadi",
            );
        }

        if (error.sale_not_found) {
            return toast.error(
                lang === "ru" ? "Продажа не найдена" : "Sotuv topilmadi",
            );
        }

        if (error.name_exist) {
            return toast.error(
                lang === "ru"
                    ? "Такое название товара уже существует"
                    : "Bunday mahsulot nomi allaqachon mavjud",
            );
        }

        if (error.active_shift_not_found) {
            return toast.error(
                lang === "ru"
                    ? "Активная смена не найдена"
                    : "Faol smena topilmadi",
            );
        }

        if (error.already_exist) {
            return toast.error(
                lang === "ru"
                    ? "Товар с таким названием уже существует"
                    : "Bu nomdagi mahsulot allaqachon mavjud",
            );
        }

        if (error.bot_exists) {
            return toast.error(
                lang === "ru" ? "Есть такой токен" : "Bunday token mavjud.",
            );
        }

        if (error.is_not_bot) {
            return toast.error(
                lang === "ru"
                    ? "Бота с таким токеном не найдено"
                    : "Bunday tokenga bog'langan bot mavjud emas.",
            );
        }

        if (error.not_allowed) {
            return toast.error(
                lang === "ru"
                    ? "У вас нет прав для удаления этого пользователя"
                    : "Sizda ushbu foydalanuvchini o‘chirish uchun ruxsat yo‘q.",
            );
        }

        if (error.login_or_password_incorrect) {
            return toast.error(
                lang === "ru"
                    ? "Логин или пароль неверный."
                    : "Login yoki parol noto‘g‘ri.",
            );
        }

        if (error.organization_already_exist) {
            return toast.error(
                lang === "ru"
                    ? "Организация с таким наименованием уже существует!"
                    : "",
            );
        }

        if (error.barcode_exist) {
            return toast.error(
                lang === "ru"
                    ? "Товар с таким штрих-кодом уже существует"
                    : "Bu shtrix-kodli mahsulot allaqachon mavjud",
            );
        }

        if (error.barcode_duplicated) {
            return toast.error(
                lang === "ru"
                    ? "Товар с таким штрих-кодом уже существует"
                    : lang === "en"
                      ? "A product with this barcode already exists"
                      : "Bu shtrix-kodli mahsulot allaqachon mavjud",
            );
        }

        if (error.product_sku_duplicated) {
            return toast.error(
                lang === "ru"
                    ? "Такой артикул уже существует"
                    : "Bunday artikul allaqachon mavjud",
            );
        }

        if (error.code_exist) {
            return toast.error(
                lang === "ru"
                    ? "Такой артикул уже существует"
                    : "Bunday kod allaqachon mavjud",
            );
        }

        if (error.sale_item_catalog_not_found) {
            return toast.error(
                lang === "ru"
                    ? "Единица измерения не найдена"
                    : "Bunday o‘lchov birligi (package) topilmadi",
            );
        }

        if (error.warehouse_not_found) {
            return toast.error(
                lang === "ru" ? "Склад не найден" : "Ombor topilmadi",
            );
        }

        if (error.shift_disabled) {
            return toast.error(
                lang === "ru"
                    ? "Доступ ограничен. Смотрите «Настройки»."
                    : "Shift ochishga ruxsat yo‘q",
            );
        }

        if (error?.error_timeout || error?.message === "Network Error") {
            const message =
                lang === "ru"
                    ? "Ошибка соединения."
                    : "Tarmoq bilan bog‘lanishda xatolik.";

            toast.error(message, {
                position: "bottom-left",
                closeOnClick: true,
                draggable: true,
            });

            return;
        }

        if (error.message) {
            return toast.error(
                lang === "ru"
                    ? `Ошибка: ${error.message}`
                    : `Xatolik: ${error.message}`,
            );
        }

        if (error.error) {
            return toast.error(
                lang === "ru"
                    ? `Ошибка: ${error.error}`
                    : `Xatolik: ${error.error}`,
            );
        }
    }

    // 3️⃣ - noma’lum xatolik
    toast.error(lang === "ru" ? "Неизвестная ошибка" : "Noma’lum xatolik", {
        position: "bottom-left",
        closeOnClick: true,
        draggable: true,
    });
};
