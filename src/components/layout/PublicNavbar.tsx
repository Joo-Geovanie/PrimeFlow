"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageToggle, useLanguage } from "@/lib/i18n/LanguageContext";

const NAV_ITEMS = [
  { href: "/products", labelEn: "Materials Library", labelId: "Katalog Produk", code: "01" },
  { href: "/technology", labelEn: "Technology", labelId: "Teknologi Proses", code: "02" },
  { href: "/solutions", labelEn: "B2B Solutions", labelId: "Solusi B2B", code: "03" },
  { href: "/sustainability", labelEn: "Sustainability", labelId: "Keberlanjutan", code: "04" },
  { href: "/about", labelEn: "About", labelId: "Tentang Kami", code: "05" },
  { href: "/insights", labelEn: "Insights", labelId: "Artikel Teknis", code: "06" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isId } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-[#1E324A] bg-[#101C2B]/95 backdrop-blur-md text-[#F3F5F6]">
      {/* Top technical telemetry micro-strip */}
      <div className="hidden lg:block border-b border-[#1E324A]/80 bg-[#0B1420] text-[11px] font-mono-tech tracking-wider text-[#F3F5F6]/70">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-[#02BDEA]" />
              {isId
                ? "BIJI PLASTIK DAUR ULANG PP & PE PASCA-INDUSTRI"
                : "POST-INDUSTRIAL PP & PE RECOVERY"}
            </span>
            <span className="text-[#1E324A]">|</span>
            <span>
              {isId ? "TARGET KADAR AIR < 0.05%" : "TARGET MOISTURE < 0.05%"}
            </span>
            <span className="text-[#1E324A]">|</span>
            <span>
              {isId
                ? "FILTRASI 100-120 MESH (<100 MIKRON)"
                : "FILTRATION 100-120 MESH (<100 MICRON)"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#F3F5F6]/60">
              {isId ? "BAHASA:" : "LANGUAGE:"}
            </span>
            <LanguageToggle compact />
            <span className="text-[#1E324A]">|</span>
            <Link
              href="/admin"
              className="text-[#02BDEA] hover:text-[#FFD71C] transition-colors"
            >
              {isId ? "KONSOL OPERATOR [CMS]" : "OPERATOR CONSOLE [CMS]"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus:outline-none"
          aria-label="PrimeFlow Home"
        >
          <div className="relative h-11 w-14 shrink-0 flex items-center justify-center">
            <Image
              src="/logo/logo-symbol.png"
              alt="PrimeFlow official symbol"
              width={56}
              height={44}
              className="object-contain h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline tracking-tight font-display font-bold text-xl leading-none">
              <span className="text-[#FFD71C]">PRIME</span>
              <span className="text-[#02BDEA]">FLOW</span>
            </div>
            <span className="font-mono-tech text-[10px] tracking-[0.18em] text-[#F3F5F6]/65 mt-1 uppercase">
              {isId ? "Rekayasa Polimer" : "Polymer Engineering"}
            </span>
          </div>
        </Link>

        {/* Desktop navigation links */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 text-sm font-medium transition-colors relative group ${
                  active
                    ? "text-[#FFD71C]"
                    : "text-[#F3F5F6]/85 hover:text-white"
                }`}
              >
                <span className="font-mono-tech text-[10px] text-[#02BDEA]/80 mr-1.5">
                  {item.code}
                </span>
                <span>{isId ? item.labelId : item.labelEn}</span>
                <span
                  className={`absolute left-3.5 right-3.5 bottom-0.5 h-[2px] transition-transform duration-200 origin-left ${
                    active
                      ? "bg-[#FFD71C] scale-x-100"
                      : "bg-[#02BDEA] scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="lg:hidden">
            <LanguageToggle compact />
          </div>
          <Link
            href="/contact?tab=sample"
            className="px-4 py-2.5 text-xs font-mono-tech uppercase tracking-wider border border-[#02BDEA]/60 text-[#02BDEA] hover:bg-[#02BDEA]/10 transition-colors"
          >
            {isId ? "Minta Sampel" : "Request Sample Kit"}
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 text-xs font-mono-tech font-semibold uppercase tracking-wider bg-[#FFD71C] text-[#101C2B] hover:bg-[#ffe14f] transition-colors"
          >
            {isId ? "Hubungi Sales" : "Contact Sales"}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex xl:hidden items-center gap-2">
          <div className="md:hidden">
            <LanguageToggle compact />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex items-center justify-center px-3 py-2 border border-[#1E324A] text-xs font-mono-tech uppercase tracking-wider text-[#F3F5F6] hover:border-[#02BDEA]"
          >
            {mobileOpen
              ? isId
                ? "TUTUP [X]"
                : "CLOSE [X]"
              : "MENU [+]"}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[#1E324A] bg-[#0B1420] px-6 py-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E324A]">
            <span className="font-mono-tech text-xs text-[#F3F5F6]/70">
              {isId ? "PILIH BAHASA / LANGUAGE:" : "SELECT LANGUAGE / BAHASA:"}
            </span>
            <LanguageToggle />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 border ${
                    active
                      ? "border-[#FFD71C] bg-[#101C2B] text-[#FFD71C]"
                      : "border-[#1E324A] text-[#F3F5F6] hover:border-[#02BDEA]"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {isId ? item.labelId : item.labelEn}
                  </span>
                  <span className="font-mono-tech text-xs text-[#02BDEA]">
                    {item.code}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="pt-3 border-t border-[#1E324A] flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact?tab=sample"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-3 text-xs font-mono-tech uppercase tracking-wider border border-[#02BDEA] text-[#02BDEA]"
            >
              {isId
                ? "Minta Sampel Gratis (5-10 kg)"
                : "Request a Sample (5-10 kg)"}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-3 text-xs font-mono-tech font-semibold uppercase tracking-wider bg-[#FFD71C] text-[#101C2B]"
            >
              {isId ? "Hubungi Sales" : "Contact Sales"}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-center py-3 px-4 text-xs font-mono-tech uppercase tracking-wider border border-[#1E324A] text-[#F3F5F6]/70"
            >
              {isId ? "Konsol CMS" : "CMS Console"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
