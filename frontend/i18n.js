// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en.json";
import faTranslation from "./locales/fa.json";

// the translations
const resources = {
  fa: {
    translation: faTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

// Fetch language from localStorage or default to 'fa'
const storedLanguage = localStorage.getItem("selectedLanguage") || "fa";

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage, // set the initial language from localStorage
  fallbackLng: "fa",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;