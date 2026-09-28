'use client';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Language = 'en' | 'tr';

const STORAGE_KEY = 'lang';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');

    // First paint is always EN (it's what the server rendered); afterwards
    // adopt a saved choice, or a Turkish browser. Storage can throw (private
    // mode, blocked site data), in which case this just stays EN.
    useEffect(() => {
        let saved: string | null = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch {}
        if (saved === 'en' || saved === 'tr') setLanguageState(saved);
        else if (navigator.language?.toLowerCase().startsWith('tr')) setLanguageState('tr');
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {}
    }, []);

    // <html lang> is hardcoded "en" in layout.tsx and never follows the
    // in-chat language toggle — this keeps screen readers pronouncing the
    // (now substantial) Turkish page copy correctly.
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Add a custom hook for easier context usage
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};