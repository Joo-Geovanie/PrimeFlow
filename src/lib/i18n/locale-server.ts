"use server";

import { cookies } from "next/headers";

export type Locale = "en" | "id";

const LOCALE_COOKIE = "primeflow_locale";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(LOCALE_COOKIE)?.value;
    if (raw === "id" || raw === "en") {
      return raw;
    }
  } catch {
    // Fallback during static generation
  }
  return "en";
}

export async function setLocaleAction(locale: Locale): Promise<{ ok: boolean; locale: Locale }> {
  const normalized: Locale = locale === "id" ? "id" : "en";
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, normalized, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return { ok: true, locale: normalized };
}
