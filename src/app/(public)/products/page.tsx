import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProducts } from "@/lib/data-store";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { getServerLocale } from "@/lib/i18n/locale-server";
import { localizeProducts } from "@/lib/i18n/localize-data";

export const metadata: Metadata = {
  title: "Materials Library | Recycled PP, PE, HDPE & LDPE Resin Catalog",
  description:
    "Explore PrimeFlow's technical catalog of post-industrial Polypropylene (PP) and Polyethylene (PE, HDPE, LDPE) resin pellets with batch COA specifications.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ family?: string }>;
}) {
  const [{ family }, rawProducts, locale] = await Promise.all([
    searchParams,
    getPublishedProducts(),
    getServerLocale(),
  ]);

  const isId = locale === "id";
  const products = localizeProducts(rawProducts, locale);

  return (
    <div>
      {/* Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
                {isId
                  ? "KATALOG MATERIAL TEKNIS | TERHUBUNG CMS"
                  : "TECHNICAL MATERIALS LIBRARY | CMS-DRIVEN CATALOG"}
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-[1.03]">
                {isId
                  ? "Grade Resin PP & PE Pasca-Industri."
                  : "Post-Industrial PP & PE Resin Grades."}
              </h1>
              <p className="text-base sm:text-lg text-[#F3F5F6]/80 max-w-2xl leading-relaxed">
                {isId
                  ? "Evaluasi Polipropilena (PP) dan Polietilena (PE, termasuk sub-keluarga HDPE dan LDPE) PrimeFlow yang dirancang untuk injection molding, blow molding, dan ekstrusi film non-pangan."
                  : "Evaluate PrimeFlow Polypropylene (PP) and Polyethylene (PE, including HDPE and LDPE sub-families) engineered for non-food injection molding, blow molding, and film extrusion."}
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right space-y-3">
              <div className="inline-block border border-[#1E324A] bg-[#0B1420] p-4 text-left font-mono-tech text-xs">
                <div className="text-[#FFD71C]">
                  {isId ? "KUALIFIKASI KATALOG" : "CATALOG QUALIFICATION"}
                </div>
                <p className="text-[#F3F5F6]/70 mt-1 leading-relaxed">
                  {isId
                    ? "Seluruh parameter teknis bersumber langsung dari database CMS. Grade prototipe divalidasi per batch melalui Certificate of Analysis (COA)."
                    : "All technical parameters come directly from CMS records. Prototype grades are validated per batch via Certificate of Analysis (COA)."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Catalog Explorer */}
      <section className="py-16 lg:py-20 bg-[#F3F5F6]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <CatalogExplorer products={products} initialFamily={family || "ALL"} />
        </div>
      </section>

      {/* Bottom Custom Formulation Callout */}
      <section className="py-16 bg-white border-t border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
              {isId
                ? "KALIBRASI REOLOGI & ADITIF KUSTOM"
                : "CUSTOM RHEOLOGY & ADDITIVE TUNING"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101C2B]">
              {isId
                ? "Butuh Spesifikasi Melt Flow Index atau Sortir Warna Dasar Tertentu?"
                : "Need a Specific Melt Flow Index or Base Color Sort?"}
            </h2>
            <p className="text-sm text-[#4B5B6E]">
              {isId
                ? "Protokol kompon kami menyesuaikan dosis peroksida organik (untuk kalibrasi MFI PP), kadar antioksidan (0.1 hingga 0.3%), serta pencerah optik agar selaras dengan siklus cetak Anda."
                : "Our compounding protocol adjusts organic peroxide dosing (for PP MFI tuning), antioxidant loading (0.1 to 0.3%), and optical brighteners to match your molding cycle."}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact?tab=sample"
              className="px-6 py-3.5 bg-[#02BDEA] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-wider"
            >
              {isId ? "Minta Sampel 5-10 kg" : "Request 5-10 kg Sample Kit"}
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-[#101C2B] text-[#FFD71C] font-mono-tech text-xs font-semibold uppercase tracking-wider"
            >
              {isId ? "Ajukan RFQ Kustom" : "Submit Custom RFQ"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
