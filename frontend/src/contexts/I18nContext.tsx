"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import enMessages from '@/messages/en.json';
import viMessages from '@/messages/vi.json';

type Locale = 'en' | 'vi';
type Messages = typeof enMessages;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    messages: Messages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const messages: Record<Locale, Messages> = {
    en: enMessages,
    vi: viMessages,
};

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('vi');

    useEffect(() => {
        // Load saved locale from localStorage
        const saved = localStorage.getItem('locale') as Locale;
        if (saved && (saved === 'en' || saved === 'vi')) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = (key: string, params?: Record<string, string | number>): string => {
        const keys = key.split('.');
        let value: any = messages[locale];

        for (const k of keys) {
            value = value?.[k];
        }

        let result = value || key;

        if (params && typeof result === 'string') {
            Object.entries(params).forEach(([key, value]) => {
                result = result.replace(`{${key}}`, String(value));
            });
        }

        return result;
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, messages: messages[locale] }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}
