"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LocaleSwitcher() {
  const { locale, switchLocale, isHydrated } = useI18n();
  const [isChanging, setIsChanging] = useState(false);

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-16 p-0">
        <Loader2 className="h-4 w-4" />
      </Button>
    );
  }

  const handleLocaleSwitch = () => {
    setIsChanging(true);
    const newLocale = locale === 'en' ? 'fr' : 'en';
    switchLocale(newLocale);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLocaleSwitch}
      className="h-9 w-16 p-0 relative overflow-hidden"
      title={locale === 'en' ? 'Switch to French' : 'Passer en anglais'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isChanging ? 'loading' : locale}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isChanging ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <span className="text-xs font-semibold tracking-wider">
              {locale.toUpperCase()}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
