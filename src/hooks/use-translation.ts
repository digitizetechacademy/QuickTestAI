
'use client';

import { useLanguage } from '@/context/language-context';

export const useTranslation = () => {
  const { translations } = useLanguage();

  const t = (key: string, options?: Record<string, string | number>): string => {
    let translation = key.split('.').reduce((obj, k) => obj && obj[k], translations);

    if (translation && options) {
        Object.keys(options).forEach(optionKey => {
            translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
        });
    }

    return translation || key;
  };

  return { t };
};
