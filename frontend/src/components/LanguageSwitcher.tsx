"use client";

import { useI18n } from '@/contexts/I18nContext';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useI18n();

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLocale('vi')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'vi'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                VI
            </button>
        </div>
    );
}
