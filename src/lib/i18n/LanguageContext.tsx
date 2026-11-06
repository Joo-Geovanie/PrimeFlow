"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction, type Locale } from "./locale-server";

interface LanguageContextValue {
  locale: Locale;
  isId: boolean;
  setLocale: (next: Locale) => void;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  isId: false,
  setLocale: () => {},
  isPending: false,
});

export function LanguageProvider({
  initialLocale = "en",
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function setLocale(next: Locale) {
    if (next === locale) return;
    setLocaleState(next);
    if (typeof document !== "undefined") {
      document.cookie = `primeflow_locale=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = next;
    }
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        isId: locale === "id",
        setLocale,
        isPending,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, isPending } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`inline-flex items-center border border-[#1E324A] bg-[#0B1420] font-mono-tech ${
        compact ? "text-[10px]" : "text-xs"
      } ${isPending ? "opacity-75" : ""}`}
    >
      <button
        type="button"
        onClick={() => setLocale("id")}
        aria-pressed={locale === "id"}
        className={`px-2.5 py-1.5 uppercase tracking-wider transition-colors ${
          locale === "id"
            ? "bg-[#FFD71C] text-[#101C2B] font-bold"
            : "text-[#F3F5F6]/70 hover:text-white"
        }`}
      >
        ID
      </button>
      <span className="text-[#1E324A] select-none">|</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`px-2.5 py-1.5 uppercase tracking-wider transition-colors ${
          locale === "en"
            ? "bg-[#02BDEA] text-[#101C2B] font-bold"
            : "text-[#F3F5F6]/70 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
