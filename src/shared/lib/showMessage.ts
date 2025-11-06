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
    position: "top-right",
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

  // 🔹 err.data yoki err.data.message bo‘lishi mumkin
  // if (typeof err === "object" && err !== null) {
  //   const maybeErr = err as Record<string, any>;
  //   if (maybeErr.data) {
  //     error = maybeErr.data.message || maybeErr.data;
  //   }
  // }

  // 1️⃣ - server (runtime) xatoliklar
  // if (error instanceof Error) {
  //   return toast.error(
  //     lang === "ru"
  //       ? `Ошибка: ${error.message}`
  //       : `Xatolik: ${error.message}`
  //   );
  // }

  // if(status_code >= 500){

  //   return
  // }

  if (typeof error === "string" && statusCode === 404) {
    return toast.error(
      lang === "ru" ? "Такая страница не найдена" : "Bunday sahifa mavjud emas",
      {
        position: "bottom-left",
        autoClose: 3000,
      }
    );
  }

  // 2️⃣ - API dan kelgan javob
  if (typeof error === "object" && error !== null) {
    if (error.invalid_username_or_password) {
      return toast.error(
        lang === "ru"
          ? "Неверный логин или пароль"
          : "Login yoki parol noto‘g‘ri",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.currency_not_found) {
      return toast.error(
        lang === "ru" ? "Валюта не найдена" : "Valyuta topilmadi",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.name_exist) {
      return toast.error(
        lang === "ru"
          ? "Такое название товара уже существует"
          : "Bunday mahsulot nomi allaqachon mavjud",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.active_shift_not_found) {
      return toast.error(
        lang === "ru" ? "Активная смена не найдена" : "Faol smena topilmadi",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.already_exist) {
      return toast.error(
        lang === "ru"
          ? "Товар с таким названием уже существует"
          : "Bu nomdagi mahsulot allaqachon mavjud",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.login_or_password_incorrect) {
      return toast.error(
        lang === "ru"
          ? "Логин или пароль неверный."
          : "Login yoki parol noto‘g‘ri.",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.organization_already_exist) {
      return toast.error(
        lang === "ru"
          ? "Организация с таким наименованием уже существует!"
          : "",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.barcode_exist) {
      return toast.error(
        lang === "ru"
          ? "Товар с таким штрих-кодом уже существует"
          : "Bu shtrix-kodli mahsulot allaqachon mavjud",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.product_sku_duplicated) {
      return toast.error(
        lang === "ru"
          ? "Такой артикул уже существует"
          : "Bunday artikul allaqachon mavjud",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.code_exist) {
      return toast.error(
        lang === "ru"
          ? "Такой артикул уже существует"
          : "Bunday kod allaqachon mavjud",
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }

    if (error.message) {
      return toast.error(
        lang === "ru"
          ? `Ошибка: ${error.message}`
          : `Xatolik: ${error.message}`,
        {
          position: "bottom-left",
          autoClose: 3000,
        }
      );
    }
  }

  // 3️⃣ - noma’lum xatolik
  toast.error(lang === "ru" ? "Неизвестная ошибка" : "Noma’lum xatolik", {
    position: "bottom-left",
    autoClose: 3000,
  });
};
