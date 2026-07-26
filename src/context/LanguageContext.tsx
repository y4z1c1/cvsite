'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'tr';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

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