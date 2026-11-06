"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PolymerFamily, Product } from "@/types/domain";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface CatalogExplorerProps {
  products: Product[];
  initialFamily?: string;
}

const POLYMER_FAMILIES: Array<{
  labelEn: string;
  labelId: string;
  value: "ALL" | PolymerFamily;
  noteEn: string;
  noteId: string;
}> = [
  {
    labelEn: "All Polymer Grades",
    labelId: "Semua Grade Polimer",
    value: "ALL",
    noteEn: "PP & PE Portfolio",
    noteId: "Portofolio PP & PE",
  },
  {
    labelEn: "Polypropylene (PP)",
    labelId: "Polipropilena (PP)",
    value: "Polypropylene",
    noteEn: "Homopolymer & Molding",
    noteId: "Homopolimer & Molding",
  },
  {
    labelEn: "Polyethylene (PE Family)",
    labelId: "Polietilena (Keluarga PE)",
    value: "Polyethylene",
    noteEn: "General PE & Blends",
    noteId: "PE Umum & Sub-Keluarga",
  },
  {
    labelEn: "HDPE",
    labelId: "HDPE",
    value: "HDPE",
    noteEn: "PE Sub-Family: High-Density",
    noteId: "Sub-Keluarga PE: Densitas Tinggi",
  },
  {
    labelEn: "LDPE",
    labelId: "LDPE",
    value: "LDPE",
    noteEn: "PE Sub-Family: Low-Density",
    noteId: "Sub-Keluarga PE: Densitas Rendah",
  },
];

export function CatalogExplorer({
  products,
  initialFamily = "ALL",
}: CatalogExplorerProps) {
  const { isId } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<string>(
    POLYMER_FAMILIES.some((f) => f.value === initialFamily)
      ? initialFamily
      : "ALL"
  );
  const [selectedProcess, setSelectedProcess] = useState<string>("ALL");
  const [selectedPropertyFilter, setSelectedPropertyFilter] =
    useState<string>("ALL");

  const availableProcesses = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      for (const proc of p.manufacturing_processes) {
        set.add(proc);
      }
    }
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedFamily !== "ALL") {
        if (selectedFamily === "Polyethylene") {
          const isPeFamily =
            product.polymer_family === "Polyethylene" ||
            product.polymer_family === "HDPE" ||
            product.polymer_family === "LDPE";
          if (!isPeFamily) return false;
        } else if (product.polymer_family !== selectedFamily) {
          return false;
        }
      }

      if (
        selectedProcess !== "ALL" &&
        !product.manufacturing_processes.includes(selectedProcess)
      ) {
        return false;
      }

      if (selectedPropertyFilter === "LOW_MOISTURE") {
        if (!product.moisture_content?.includes("0.05")) return false;
      } else if (selectedPropertyFilter === "MICRO_FILTRATION") {
        if (!product.filtration_rating?.includes("100")) return false;
      } else if (selectedPropertyFilter === "SINGLE_HEAT_MFI") {
        if (!product.mfi_value?.includes("2.17")) return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          product.name,
          product.grade_code,
          product.polymer_family,
          product.short_description,
          ...product.recommended_applications,
          ...product.manufacturing_processes,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [
    products,
    selectedFamily,
    selectedProcess,
    selectedPropertyFilter,
    searchQuery,
  ]);

  function resetAllFilters() {
    setSearchQuery("");
    setSelectedFamily("ALL");
    setSelectedProcess("ALL");
    setSelectedPropertyFilter("ALL");
  }

  return (
    <div className="space-y-10">
      {/* Control console bar */}
      <div className="border border-[#101C2B]/15 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#101C2B]/10 pb-5">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
              {isId
                ? "Katalog Material Teknis & Filter Spesifikasi"
                : "Technical Materials Library & Specification Filter"}
            </span>
            <p className="text-xs text-[#4B5B6E] mt-1">
              {isId
                ? "Catatan: HDPE dan LDPE berada di bawah keluarga besar Polietilena (PE). Seluruh spesifikasi mencerminkan parameter QC internal target yang diverifikasi per batch pada Certificate of Analysis (COA)."
                : "Note: HDPE and LDPE belong under the broader Polyethylene (PE) material family. All specifications reflect target internal QC parameters verified per batch on the Certificate of Analysis (COA)."}
            </p>
          </div>
          <div className="font-mono-tech text-xs text-[#101C2B] bg-[#F3F5F6] px-3.5 py-2 border border-[#101C2B]/15 shrink-0">
            {isId
              ? `MENAMPILKAN ${filteredProducts.length} DARI ${products.length} GRADE AKTIF`
              : `DISPLAYING ${filteredProducts.length} OF ${products.length} PUBLISHED GRADES`}
          </div>
        </div>

        {/* Polymer family selector tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {POLYMER_FAMILIES.map((fam) => {
            const active = selectedFamily === fam.value;
            return (
              <button
                key={fam.value}
                type="button"
                onClick={() => setSelectedFamily(fam.value)}
                className={`text-left p-3.5 border transition-colors ${
                  active
                    ? "border-[#101C2B] bg-[#101C2B] text-white"
                    : "border-[#101C2B]/15 bg-[#F3F5F6]/60 text-[#101C2B] hover:border-[#123A68]"
                }`}
              >
                <div className="font-display font-semibold text-sm">
                  {isId ? fam.labelId : fam.labelEn}
                </div>
                <div
                  className={`font-mono-tech text-[10px] uppercase tracking-wider mt-1 ${
                    active ? "text-[#02BDEA]" : "text-[#4B5B6E]"
                  }`}
                >
                  {isId ? fam.noteId : fam.noteEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search, Process, and Technical Property Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
          <div className="md:col-span-5">
            <label
              htmlFor="catalog-search"
              className="block font-mono-tech text-[11px] uppercase tracking-wider text-[#4B5B6E] mb-1.5"
            >
              {isId
                ? "Cari Grade, Polimer, atau Target Aplikasi"
                : "Search Grade, Polymer, or Target Application"}
            </label>
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isId
                  ? "mis. PP 100, jerigen, film, keranjang, 2.17..."
                  : "e.g., PP 100, jerrycan, film, crate, 2.17..."
              }
              className="w-full border border-[#101C2B]/20 bg-[#F3F5F6]/40 px-4 py-2.5 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="catalog-process"
              className="block font-mono-tech text-[11px] uppercase tracking-wider text-[#4B5B6E] mb-1.5"
            >
              {isId
                ? "Filter Berdasarkan Proses Konversi"
                : "Filter by Conversion Process"}
            </label>
            <select
              id="catalog-process"
              value={selectedProcess}
              onChange={(e) => setSelectedProcess(e.target.value)}
              className="w-full border border-[#101C2B]/20 bg-[#F3F5F6]/40 px-3.5 py-2.5 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
            >
              <option value="ALL">
                {isId
                  ? "Semua Proses Manufaktur"
                  : "All Manufacturing Processes"}
              </option>
              {availableProcesses.map((proc) => (
                <option key={proc} value={proc}>
                  {proc}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="catalog-property"
              className="block font-mono-tech text-[11px] uppercase tracking-wider text-[#4B5B6E] mb-1.5"
            >
              {isId
                ? "Filter Berdasarkan Parameter Teknis"
                : "Filter by Technical Property"}
            </label>
            <select
              id="catalog-property"
              value={selectedPropertyFilter}
              onChange={(e) => setSelectedPropertyFilter(e.target.value)}
              className="w-full border border-[#101C2B]/20 bg-[#F3F5F6]/40 px-3.5 py-2.5 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
            >
              <option value="ALL">
                {isId ? "Semua Parameter QC Terverifikasi" : "All Verified QC Parameters"}
              </option>
              <option value="LOW_MOISTURE">
                {isId ? "Kadar Air < 0.05% Terverifikasi" : "Moisture < 0.05% Verified"}
              </option>
              <option value="MICRO_FILTRATION">
                {isId
                  ? "Filtrasi 100-120 Mesh (<100 Mikron)"
                  : "100-120 Mesh (<100 Micron) Filtered"}
              </option>
              <option value="SINGLE_HEAT_MFI">
                {isId
                  ? "Aliran MFI Referensi ~2.17 g/10 mnt"
                  : "Reference ~2.17 g/10 min MFI Stream"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="border border-[#101C2B]/20 bg-white p-12 text-center space-y-4">
          <div className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
            {isId
              ? "Spesifikasi Material Tidak Ditemukan"
              : "No Matching Material Specification Found"}
          </div>
          <h3 className="font-display text-2xl font-bold text-[#101C2B]">
            {isId
              ? "Tidak ada grade polimer yang cocok dengan kombinasi filter Anda."
              : "No polymer grades match your current filter combination."}
          </h3>
          <p className="text-sm text-[#4B5B6E] max-w-lg mx-auto">
            {isId
              ? "PrimeFlow memformulasikan paket aditif dan reologi kustom untuk aliran PP dan PE pasca-industri. Atur ulang filter Anda atau hubungi tim rekayasa kami."
              : "PrimeFlow formulates custom additive and rheology packages for post-industrial PP and PE streams. Reset your filters or contact our engineering team to discuss your tooling requirement."}
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 bg-[#101C2B] text-white font-mono-tech text-xs uppercase tracking-wider"
            >
              {isId ? "Atur Ulang Filter" : "Reset All Filters"}
            </button>
            <Link
              href="/contact"
              className="px-5 py-2.5 border border-[#101C2B] text-[#101C2B] font-mono-tech text-xs uppercase tracking-wider"
            >
              {isId ? "Konsultasi Engineer Material" : "Consult Material Engineer"}
            </Link>
          </div>
        </div>
      ) : (
        /* Material Showcase Dossier Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProducts.map((product, index) => (
            <article
              key={product.id}
              className="group border border-[#101C2B]/15 bg-white hover:border-[#101C2B] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Top technical strip */}
                <div className="border-b border-[#101C2B]/10 px-6 py-3.5 bg-[#101C2B] text-[#F3F5F6] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tech text-xs font-semibold text-[#FFD71C]">
                      GRADE | {product.grade_code}
                    </span>
                    <span className="text-[#1E324A]">|</span>
                    <span className="font-mono-tech text-xs text-[#02BDEA]">
                      {product.polymer_family.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono-tech text-[11px] uppercase tracking-wider px-2 py-0.5 border border-[#02BDEA]/40 text-[#F3F5F6]/80">
                    {product.operational_status === "PROTOTYPE_SPEC"
                      ? isId
                        ? "Spesifikasi Prototipe / Target QC"
                        : "Prototype Spec / Target QC"
                      : product.operational_status}
                  </span>
                </div>

                {/* Split image + primary specification readout */}
                <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-[#101C2B]/10">
                  <div className="sm:col-span-5 relative min-h-[240px] bg-[#101C2B] overflow-hidden border-b sm:border-b-0 sm:border-r border-[#101C2B]/10">
                    <Image
                      src={product.primary_image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#101C2B]/85 backdrop-blur-xs px-2.5 py-1 font-mono-tech text-[10px] tracking-wider text-[#F3F5F6]">
                      SPEC 0{index + 1}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-[#101C2B]/85 px-3 py-1.5 font-mono-tech text-[10px] text-[#F3F5F6]/75">
                      {isId ? "Visual Material Ilustratif" : "Illustrative Material Visual"}
                    </div>
                  </div>

                  <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#101C2B] group-hover:text-[#123A68] transition-colors">
                        <Link href={`/products/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h2>
                      <p className="text-sm text-[#4B5B6E] mt-2 leading-relaxed">
                        {product.short_description}
                      </p>
                    </div>

                    {/* Key technical metrics grid */}
                    <dl className="grid grid-cols-2 gap-3 pt-3 border-t border-[#101C2B]/10 font-mono-tech text-xs">
                      <div>
                        <dt className="text-[10px] uppercase text-[#4B5B6E]">
                          {isId ? "Filtrasi Lelehan" : "Melt Filtration"}
                        </dt>
                        <dd className="text-[#101C2B] font-semibold mt-0.5">
                          {product.filtration_rating || "100-120 mesh"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase text-[#4B5B6E]">
                          {isId ? "Target Kadar Air" : "Target Moisture"}
                        </dt>
                        <dd className="text-[#101C2B] font-semibold mt-0.5">
                          {product.moisture_content || "< 0.05%"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase text-[#4B5B6E]">
                          {isId ? "Rentang Densitas" : "Density Range"}
                        </dt>
                        <dd className="text-[#101C2B] font-semibold mt-0.5">
                          {product.density_value?.split("(")[0] || "COA Verified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase text-[#4B5B6E]">
                          {isId ? "Kadar Abu" : "Ash Content"}
                        </dt>
                        <dd className="text-[#101C2B] font-semibold mt-0.5">
                          {product.ash_content || "< 0.15%"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Applicable processes & applications */}
                <div className="px-6 py-4 bg-[#F3F5F6]/50 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#4B5B6E] mr-1">
                      {isId ? "Proses:" : "Processes:"}
                    </span>
                    {product.manufacturing_processes.map((proc) => (
                      <span
                        key={proc}
                        className="font-mono-tech text-[11px] px-2.5 py-0.5 bg-white border border-[#101C2B]/15 text-[#101C2B]"
                      >
                        {proc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="px-6 py-4 border-t border-[#101C2B]/15 bg-white flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-mono-tech text-xs font-semibold uppercase tracking-wider text-[#101C2B] hover:text-[#123A68] flex items-center gap-2"
                >
                  <span>
                    {isId
                      ? "Lihat Spesifikasi Teknis"
                      : "Inspect Technical Specification"}
                  </span>
                  <span>&rarr;</span>
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/contact?tab=sample&grade=${encodeURIComponent(
                      product.grade_code
                    )}`}
                    className="px-3.5 py-2 text-[11px] font-mono-tech uppercase tracking-wider border border-[#101C2B]/25 text-[#101C2B] hover:border-[#101C2B]"
                  >
                    {isId ? "Sampel (5-10 kg)" : "Sample (5-10 kg)"}
                  </Link>
                  <Link
                    href={`/contact?grade=${encodeURIComponent(
                      product.grade_code
                    )}`}
                    className="px-4 py-2 text-[11px] font-mono-tech font-semibold uppercase tracking-wider bg-[#101C2B] text-[#FFD71C] hover:bg-[#123A68]"
                  >
                    {isId ? "Minta Penawaran" : "Request Quotation"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
