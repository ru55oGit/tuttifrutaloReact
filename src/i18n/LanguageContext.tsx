import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Translation, translations, SupportedLanguage } from "./translations";

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translation;
  availableLanguages: Array<{ code: SupportedLanguage; name: string; flag: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "tuttifrutalo_language";

export const availableLanguages = [
  { code: "es" as SupportedLanguage, name: "Español", flag: "🇦🇷" },
  { code: "en" as SupportedLanguage, name: "English", flag: "🇺🇸" },
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("es");
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;
    // El hub pasa el idioma elegido por query param al linkear a cada
    // juego (?lang=xx) — tiene prioridad sobre lo guardado localmente.
    const urlLang = new URLSearchParams(window.location.search).get("lang") as SupportedLanguage;
    if (urlLang && translations[urlLang]) {
      setCurrentLanguage(urlLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, urlLang);
      setHasInitialized(true);
      return;
    }
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
    setHasInitialized(true);
  }, [hasInitialized]);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: translations[currentLanguage],
    availableLanguages,
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
