import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Agar JSON fayllarni o‘zingiz yuklamoqchi bo‘lsangiz, shunday ham bo‘ladi
import uzTranslation from "./locales/uz/translation.json";
import ruTranslation from "./locales/ru/translation.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpBackend)
  .init({
    fallbackLng: "ru", // default til
    debug: false,
    interpolation: {
      escapeValue: false, // React avtomatik escape qiladi
    },
    resources: {
      uz: {
        translation: uzTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
    },
  });

export default i18n;
