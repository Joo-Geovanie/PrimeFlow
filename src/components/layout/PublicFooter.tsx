"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LanguageToggle, useLanguage } from "@/lib/i18n/LanguageContext";

export function PublicFooter() {
  const { isId } = useLanguage();

  return (
    <footer className="bg-[#0B1420] text-[#F3F5F6] border-t border-[#1E324A]">
      {/* Technical compliance & qualification strip */}
      <div className="border-b border-[#1E324A] bg-[#101C2B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="font-mono-tech text-[11px] uppercase tracking-widest px-2.5 py-1 bg-[#123A68] text-[#02BDEA] shrink-0">
              {isId ? "Catatan Kualifikasi" : "Qualification Notice"}
            </span>
            <p className="text-xs text-[#F3F5F6]/80 leading-relaxed">
              {isId
                ? "Pelet daur ulang PP dan PE near-virgin PrimeFlow dirancang khusus untuk manufaktur industri dan rumah tangga non-pangan (non-food-grade). Istilah near-virgin menunjukkan konsistensi reologi dan kemurnian target dibandingkan skrap konvensional, bukan setara resin petrokimia murni bersertifikat atau kepatuhan kontak pangan."
                : "PrimeFlow near-virgin recycled PP and PE pellets are engineered strictly for non-food-grade industrial and household manufacturing. Near-virgin denotes target rheological and purity consistency relative to conventional scrap, not certified virgin petrochemical resin or food-contact compliance."}
            </p>
          </div>
          <Link
            href="/technology"
            className="font-mono-tech text-xs text-[#FFD71C] hover:underline shrink-0"
          >
            {isId ? "Periksa Protokol QC 7-Tahap" : "Inspect 7-Stage QC Protocol"} &rarr;
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
        {/* Col 1: Brand identity */}
        <div className="lg:col-span-4 space-y-5">
          <Link href="/" className="inline-flex items-center gap-3.5">
            <Image
              src="/logo/logo-symbol.png"
              alt="PrimeFlow symbol"
              width={52}
              height={40}
              className="object-contain h-10 w-auto"
            />
            <div>
              <div className="font-display font-bold text-xl tracking-tight leading-none">
                <span className="text-[#FFD71C]">PRIME</span>
                <span className="text-[#02BDEA]">FLOW</span>
              </div>
              <p className="font-mono-tech text-[10px] tracking-[0.18em] text-[#F3F5F6]/60 mt-1 uppercase">
                Prime Quality, Consistent Flow.
              </p>
            </div>
          </Link>
          <p className="text-sm text-[#F3F5F6]/75 leading-relaxed max-w-sm">
            {isId
              ? "Startup material industri berkelanjutan yang berfokus pada produksi dan pasokan pelet resin Polipropilena (PP) serta Polietilena (PE, HDPE, LDPE) daur ulang berkualitas near-virgin dari limbah pasca-industri terpilih."
              : "Sustainable industrial materials startup focused on producing and supplying near-virgin quality recycled Polypropylene (PP) and Polyethylene (PE, HDPE, LDPE) resin pellets from selected post-industrial waste."}
          </p>
          <div className="pt-2 space-y-1.5 font-mono-tech text-xs text-[#F3F5F6]/70">
            <div>
              {isId
                ? "KORIDOR TARGET: Bogor & Jabodetabek"
                : "TARGET CORRIDOR: Bogor & Greater Jakarta (Jabodetabek)"}
            </div>
            <div>COMMERCIAL DESK: zidannnugroho@apps.ipb.ac.id</div>
            <div>WHATSAPP INQUIRY: +62 856-9570-4397</div>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <span className="font-mono-tech text-xs text-[#F3F5F6]/60">
              {isId ? "BAHASA:" : "LANGUAGE:"}
            </span>
            <LanguageToggle />
          </div>
        </div>

        {/* Col 2: Polymer Catalog */}
        <div className="lg:col-span-3 space-y-4">
          <div className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
            {isId ? "01 / Keluarga Polimer" : "01 / Polymer Families"}
          </div>
          <ul className="space-y-2.5 text-sm text-[#F3F5F6]/80">
            <li>
              <Link
                href="/products?family=Polypropylene"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId ? "Grade Polipropilena (PP)" : "Polypropylene (PP) Grades"}
              </Link>
            </li>
            <li>
              <Link
                href="/products?family=Polyethylene"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId ? "Polietilena (Keluarga PE)" : "Polyethylene (PE Family)"}
              </Link>
            </li>
            <li>
              <Link
                href="/products?family=HDPE"
                className="hover:text-[#FFD71C] transition-colors"
              >
                High-Density Polyethylene (HDPE)
              </Link>
            </li>
            <li>
              <Link
                href="/products?family=LDPE"
                className="hover:text-[#FFD71C] transition-colors"
              >
                Low-Density Polyethylene (LDPE)
              </Link>
            </li>
            <li>
              <Link
                href="/products/primeflow-pp-100"
                className="hover:text-[#02BDEA] transition-colors font-mono-tech text-xs"
              >
                {isId
                  ? "Spesifikasi Grade: PP 100 (Lot PF-11223)"
                  : "Grade Spec: PP 100 (Lot PF-11223)"}
              </Link>
            </li>
            <li>
              <Link
                href="/products/primeflow-hdpe-100"
                className="hover:text-[#02BDEA] transition-colors font-mono-tech text-xs"
              >
                {isId
                  ? "Spesifikasi Grade: HDPE 100 (Lot PF-12345)"
                  : "Grade Spec: HDPE 100 (Lot PF-12345)"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Engineering & B2B Programs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
            {isId ? "02 / Program Industri" : "02 / Industrial Programs"}
          </div>
          <ul className="space-y-2.5 text-sm text-[#F3F5F6]/80">
            <li>
              <Link
                href="/solutions#adaptive-supply"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId
                  ? "Kontrak Adaptive Locked-Supply"
                  : "Adaptive Locked-Supply Contracts"}
              </Link>
            </li>
            <li>
              <Link
                href="/solutions#toll-recycling"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId
                  ? "Closed-Loop Toll-Recycling (Maklon)"
                  : "Closed-Loop Toll-Recycling (Maklon)"}
              </Link>
            </li>
            <li>
              <Link
                href="/solutions#sample-trial"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId
                  ? "Uji Coba Sampel Gratis 5-10 kg di Pabrik"
                  : "5-10 kg Complimentary On-Site Trial"}
              </Link>
            </li>
            <li>
              <Link
                href="/#calculator"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId
                  ? "Kalkulator Penghematan HPP Material"
                  : "HPP Material Savings Calculator"}
              </Link>
            </li>
            <li>
              <Link
                href="/technology"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId
                  ? "Pemurnian 7-Tahap & Lab COA"
                  : "7-Stage Purification & COA Lab"}
              </Link>
            </li>
            <li>
              <Link
                href="/sustainability"
                className="hover:text-[#FFD71C] transition-colors"
              >
                {isId
                  ? "Ekonomi Sirkular & SDG 9, 12, 13"
                  : "Circular Economy & SDG 9, 12, 13"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Navigation & Governance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
            {isId ? "03 / Platform" : "03 / Platform"}
          </div>
          <ul className="space-y-2.5 text-sm text-[#F3F5F6]/80">
            <li>
              <Link href="/about" className="hover:text-[#FFD71C] transition-colors">
                {isId ? "Tentang PrimeFlow" : "About PrimeFlow"}
              </Link>
            </li>
            <li>
              <Link href="/insights" className="hover:text-[#FFD71C] transition-colors">
                {isId ? "Wawasan Teknis" : "Technical Insights"}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#FFD71C] transition-colors">
                {isId ? "Meja RFQ & Kontak" : "RFQ & Contact Desk"}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-[#02BDEA] transition-colors">
                {isId ? "Konsol Internal CMS" : "Internal CMS Console"}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#02BDEA] transition-colors">
                {isId ? "Autentikasi Staf" : "Staff Authentication"}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright & operational status */}
      <div className="border-t border-[#1E324A] bg-[#080F18]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#F3F5F6]/60 font-mono-tech">
          <div>
            &copy; {new Date().getFullYear()} PrimeFlow Industrial Materials.{" "}
            {isId
              ? "Berlandaskan Proposal Bisnis NUSC 2026 (M. Zidan Nugroho, Audina Maharani, Karim Abdul Azis)."
              : "Grounded in NUSC 2026 Business Proposal (M. Zidan Nugroho, Audina Maharani, Karim Abdul Azis)."}
          </div>
          <div className="flex items-center gap-4">
            <span>
              {isId
                ? "FASE 1 TOLL-PROCESSING & VALIDASI QC"
                : "PHASE 1 TOLL-PROCESSING & QC VALIDATION"}
            </span>
            <span>|</span>
            <Link href="/sitemap.xml" className="hover:text-[#02BDEA]">
              SITEMAP
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
