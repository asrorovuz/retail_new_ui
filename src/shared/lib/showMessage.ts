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
    autoClose: 3000,
  });
};

export const showErrorMessage = (err: unknown) => {
  const lang = i18next.language;
  let error: any = err;

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

  // 2️⃣ - API dan kelgan javob
  if (typeof error === "object" && error !== null) {
    const e = (error?.response?.data as ErrorResponse) || error;

    if (e.invalid_username_or_password) {
      return toast.error(
        lang === "ru"
          ? "Неверный логин или пароль"
          : "Login yoki parol noto‘g‘ri"
      );
    }

    if (e.name_exsist) {
      return toast.error(
        lang === "ru" ? "Имя уже существует" : "Bunday nom allaqachon mavjud"
      );
    }

    if (e.barcode_exsist) {
      return toast.error(
        lang === "ru"
          ? "Штрихкод уже существует"
          : "Bu shtrixkod allaqachon mavjud"
      );
    }

    if (e.message) {
      return toast.error(
        lang === "ru" ? `Ошибка: ${e.message}` : `Xatolik: ${e.message}`
      );
    }
  }

  // 3️⃣ - noma’lum xatolik
  toast.error(lang === "ru" ? "Неизвестная ошибка" : "Noma’lum xatolik");
};
