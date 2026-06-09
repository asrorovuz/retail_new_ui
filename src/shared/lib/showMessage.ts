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

export const showSuccessMessage = (msgUz: string, msgRu?: string, msgOz?: string) => {
    const lang = i18next.language;
    const message =
        lang === "ru" ? (msgRu ?? msgUz) :
        lang === "oz" ? (msgOz ?? msgUz) :
        msgUz;

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

    const msg = (ru: string, uz: string, oz?: string): string => {
        if (lang === "ru") return ru;
        if (lang === "oz") return oz ?? uz;
        return uz;
    };

    const error: ErrorResponse = err?.response?.data ||
        err?.data ||
        err || { message: "Unknown error" };
    const statusCode = err?.code || err?.status_code;

    if (typeof error === "string" && statusCode === 404) {
        return toast.error(
            msg(
                "Такая страница не найдена",
                "Bunday sahifa mavjud emas",
                "Бундай саҳифа мавжуд эмас",
            ),
            { position: "bottom-left", closeOnClick: true, draggable: true },
        );
    }

    if (typeof error === "object" && error !== null) {

        if (error.invalid_username_or_password) {
            return toast.error(msg(
                "Неверный логин или пароль",
                "Login yoki parol noto'g'ri",
                "Логин ёки парол нотўғри",
            ));
        }

        if (error.currency_not_found) {
            return toast.error(msg(
                "Валюта не найдена",
                "Valyuta topilmadi",
                "Валюта топилмади",
            ));
        }

        if (error.sale_not_found) {
            return toast.error(msg(
                "Продажа не найдена",
                "Sotuv topilmadi",
                "Сотув топилмади",
            ));
        }

        if (error.name_exist) {
            return toast.error(msg(
                "Такое название товара уже существует",
                "Bunday mahsulot nomi allaqachon mavjud",
                "Бундай маҳсулот номи аллақачон мавжуд",
            ));
        }

        if (error.active_shift_not_found) {
            return toast.error(msg(
                "Активная смена не найдена",
                "Faol smena topilmadi",
                "Фаол смена топилмади",
            ));
        }

        if (error.already_exist) {
            return toast.error(msg(
                "Товар с таким названием уже существует",
                "Bu nomdagi mahsulot allaqachon mavjud",
                "Бу номдаги маҳсулот аллақачон мавжуд",
            ));
        }

        if (error.bot_exists) {
            return toast.error(msg(
                "Есть такой токен",
                "Bunday token mavjud.",
                "Бундай токен мавжуд.",
            ));
        }

        if (error.is_not_bot) {
            return toast.error(msg(
                "Бота с таким токеном не найдено",
                "Bunday tokenga bog'langan bot mavjud emas.",
                "Бундай токенга боғланган бот мавжуд эмас.",
            ));
        }

        if (error.not_allowed) {
            return toast.error(msg(
                "У вас нет прав для удаления этого пользователя",
                "Sizda ushbu foydalanuvchini o'chirish uchun ruxsat yo'q.",
                "Сизда ушбу фойдаланувчини ўчириш учун рухсат йўқ.",
            ));
        }

        if (error.login_or_password_incorrect) {
            return toast.error(msg(
                "Логин или пароль неверный.",
                "Login yoki parol noto'g'ri.",
                "Логин ёки парол нотўғри.",
            ));
        }

        if (error.organization_already_exist) {
            return toast.error(msg(
                "Организация с таким наименованием уже существует!",
                "Bunday nomli tashkilot allaqachon mavjud!",
                "Бундай номли ташкилот аллақачон мавжуд!",
            ));
        }

        if (error.barcode_exist) {
            return toast.error(msg(
                "Товар с таким штрих-кодом уже существует",
                "Bu shtrix-kodli mahsulot allaqachon mavjud",
                "Бу штрих-кодли маҳсулот аллақачон мавжуд",
            ));
        }

        if (error.barcode_duplicated) {
            return toast.error(msg(
                "Товар с таким штрих-кодом уже существует",
                "Bu shtrix-kodli mahsulot allaqachon mavjud",
                "Бу штрих-кодли маҳсулот аллақачон мавжуд",
            ));
        }

        if (error.product_sku_duplicated) {
            return toast.error(msg(
                "Такой артикул уже существует",
                "Bunday artikul allaqachon mavjud",
                "Бундай артикул аллақачон мавжуд",
            ));
        }

        if (error.code_exist) {
            return toast.error(msg(
                "Такой артикул уже существует",
                "Bunday kod allaqachon mavjud",
                "Бундай код аллақачон мавжуд",
            ));
        }

        if (error.sale_item_catalog_not_found) {
            return toast.error(msg(
                "Единица измерения не найдена",
                "Bunday o'lchov birligi (package) topilmadi",
                "Бундай ўлчов бирлиги топилмади",
            ));
        }

        if (error.warehouse_not_found) {
            return toast.error(msg(
                "Склад не найден",
                "Ombor topilmadi",
                "Омбор топилмади",
            ));
        }

        if (error.shift_disabled) {
            return toast.error(msg(
                "Доступ ограничен. Смотрите «Настройки».",
                "Shift ochishga ruxsat yo'q",
                "Смена очишга рухсат йўқ",
            ));
        }

        if (error?.error_timeout || error?.message === "Network Error") {
            toast.error(
                msg(
                    "Ошибка соединения.",
                    "Tarmoq bilan bog'lanishda xatolik.",
                    "Тармоқ билан боғланишда хатолик.",
                ),
                { position: "bottom-left", closeOnClick: true, draggable: true },
            );
            return;
        }

        if (error.message) {
            return toast.error(msg(
                `Ошибка: ${error.message}`,
                `Xatolik: ${error.message}`,
                `Хатолик: ${error.message}`,
            ));
        }

        if (error.error) {
            return toast.error(msg(
                `Ошибка: ${error.error}`,
                `Xatolik: ${error.error}`,
                `Хатолик: ${error.error}`,
            ));
        }
    }

    toast.error(
        msg("Неизвестная ошибка", "Noma'lum xatolik", "Номаълум хатолик"),
        { position: "bottom-left", closeOnClick: true, draggable: true },
    );
};
