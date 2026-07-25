import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../translations";

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  return { t };
};
