"use client";

import { useState, useEffect, useCallback } from 'react';
import { locales, Locale } from '@/lib/i18n';

export function useI18n() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
      // Only update if different to avoid unnecessary re-renders
      setCurrentLocale(prev => prev !== savedLocale ? savedLocale : prev);
    } else {
      // Set default to English if no saved locale
      setCurrentLocale('en');
    }
    setIsHydrated(true);
  }, []);

  // Switch locale with automatic page reload
  const switchLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    
    // Auto reload page to apply new language
    window.location.reload();
  }, []);

  // Translation function with nested key support
  const t = useCallback((key: string): string => {
    if (!isHydrated) return ''; // Return empty string during hydration
    
    const keys = key.split('.');
    let value: Record<string, unknown> | string = locales[currentLocale];
    
    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k] as Record<string, unknown> | string;
      } else {
        // Fallback to English if key not found in current locale
        if (currentLocale === 'fr') {
          let fallback: Record<string, unknown> | string = locales.en;
          for (const fk of keys) {
            if (fallback && typeof fallback === 'object' && fk in fallback) {
              fallback = (fallback as Record<string, unknown>)[fk] as Record<string, unknown> | string;
            } else {
              return key; // Return key if not found anywhere
            }
          }
          return typeof fallback === 'string' ? fallback : key;
        }
        return key; // Return key if not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, [currentLocale, isHydrated]);

  return {
    locale: currentLocale,
    switchLocale,
    t,
    isHydrated
  };
}
