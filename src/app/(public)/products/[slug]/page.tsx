import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, getPublishedProducts } from "@/lib/data-store";
import { getServerLocale } from "@/lib/i18n/locale-server";
import { localizeProduct, localizeProducts } from "@/lib/i18n/localize-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Material Specification Not Found" };
  }
  return {
    title: product.seo_title || `${product.name} (${product.grade_code})`,
    description: product.seo_description || product.short_description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, rawProduct, rawAllProducts] = await Promise.all([
    getServerLocale(),
    getProductBySlug(slug),
    getPublishedProducts(),
  ]);

  if (!rawProduct) {
    notFound();
  }

  const isId = locale === "id";
  const product = localizeProduct(rawProduct, locale);
  const allProducts = localizeProducts(rawAllProducts, locale);

  const relatedMaterials = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <div>
      {/* Breadcrumb & Grade Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs text-[#F3F5F6]/65">
            <Link href="/" className="hover:text-[#02BDEA]">
              {isId ? "BERANDA" : "HOME"}
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#02BDEA]">
              {isId ? "KATALOG MATERIAL" : "MATERIALS LIBRARY"}
            </Link>
            <span>/</span>
            <span className="text-[#FFD71C]">{product.grade_code}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono-tech text-xs font-bold px-3 py-1 bg-[#FFD71C] text-[#101C2B]">
                  GRADE | {product.grade_code}
                </span>
                <span className="font-mono-tech text-xs px-3 py-1 border border-[#02BDEA] text-[#02BDEA]">
                  {isId ? "KELUARGA" : "FAMILY"} |{" "}
                  {product.polymer_family.toUpperCase()}
                </span>
                <span className="font-mono-tech text-xs px-3 py-1 border border-[#1E324A] text-[#F3F5F6]/80">
                  {product.operational_status === "PROTOTYPE_SPEC"
                    ? isId
                      ? "SPESIFIKASI PROTOTIPE (TARGET QC)"
                      : "PROTOTYPE SPECIFICATION (TARGET QC)"
                    : product.operational_status}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-base sm:text-lg text-[#F3F5F6]/80 leading-relaxed max-w-3xl">
                {product.short_description}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href={`/contact?grade=${encodeURIComponent(product.grade_code)}`}
                className="w-full text-center py-4 px-6 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe14f]"
              >
                {isId
                  ? `Minta Penawaran untuk ${product.grade_code}`
                  : `Request Quotation for ${product.grade_code}`}
              </Link>
              <Link
                href={`/contact?tab=sample&grade=${encodeURIComponent(
                  product.grade_code
                )}`}
                className="w-full text-center py-4 px-6 border border-[#02BDEA] text-[#02BDEA] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#02BDEA] hover:text-[#101C2B]"
              >
                {isId
                  ? "Minta Kit Sampel 5-10 kg"
                  : "Request 5-10 kg Sample Kit"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dossier Content */}
      <section className="py-16 lg:py-20 bg-[#F3F5F6]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-14">
          {/* Top split: Gallery + Primary Technical Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 5 cols: Product Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-[#101C2B]/20 bg-[#101C2B] relative h-80 sm:h-96 overflow-hidden">
                <Image
                  src={product.primary_image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 inset-x-0 bg-[#0B1420]/90 px-4 py-2 font-mono-tech text-[11px] text-[#F3F5F6]/80">
                  {isId
                    ? `Visual Material Ilustratif | ${product.grade_code}`
                    : `Illustrative Material Visual | ${product.grade_code}`}
                </div>
              </div>

              {product.gallery && product.gallery.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {product.gallery.map((img) => (
                    <div
                      key={img.id}
                      className="border border-[#101C2B]/15 bg-white p-3 space-y-2"
                    >
                      <div className="relative h-36 bg-[#101C2B]/5">
                        <Image
                          src={img.url}
                          alt={img.alt_text}
                          fill
                          sizes="220px"
                          className="object-contain"
                        />
                      </div>
                      <p className="font-mono-tech text-[10px] text-[#4B5B6E] leading-snug">
                        {img.caption || img.alt_text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 7 cols: Technical Overview & Core Properties */}
            <div className="lg:col-span-7 space-y-8">
              <div className="border border-[#101C2B]/15 bg-white p-6 sm:p-8 space-y-4">
                <div className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
                  {isId
                    ? "01 | GAMBARAN TEKNIS & ASAL BAHAN BAKU"
                    : "01 | TECHNICAL OVERVIEW & FEEDSTOCK ORIGIN"}
                </div>
                <p className="text-sm sm:text-base text-[#101C2B] leading-relaxed">
                  {product.technical_overview}
                </p>
                <div className="pt-3 border-t border-[#101C2B]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
                  <div>
                    <span className="text-[#4B5B6E] block text-[10px] uppercase">
                      {isId ? "ALIRAN BAHAN BAKU" : "FEEDSTOCK STREAM"}
                    </span>
                    <span className="text-[#101C2B] font-medium mt-0.5 block">
                      {product.feedstock_origin}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#4B5B6E] block text-[10px] uppercase">
                      {isId
                        ? "ACUAN HARGA INDIKATIF PROPOSAL"
                        : "INDICATIVE PROPOSAL BENCHMARK"}
                    </span>
                    <span className="text-[#123A68] font-semibold mt-0.5 block">
                      {product.indicative_price_idr
                        ? isId
                          ? `Rp ${product.indicative_price_idr.toLocaleString("id-ID")} / kg (Rp 452.000 / karung 25 kg)`
                          : `Rp ${product.indicative_price_idr.toLocaleString("id-ID")} / kg (Rp 452,000 / 25 kg bag)`
                        : isId
                        ? "Penawaran sesuai volume & jadwal pengiriman"
                        : "Quoted upon volume & schedule review"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Parameter Grid */}
              <div className="border border-[#101C2B] bg-[#101C2B] text-[#F3F5F6] p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#1E324A] pb-3">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                    {isId
                      ? "02 | PARAMETER UTAMA MATERIAL (REKAMAN CMS)"
                      : "02 | KEY MATERIAL PROPERTIES (CMS RECORD)"}
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#FFD71C]">
                    {isId ? "TERVERIFIKASI COA BATCH" : "BATCH COA VERIFIED"}
                  </span>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-mono-tech text-xs">
                  <div className="border-l-2 border-[#02BDEA] pl-3.5">
                    <dt className="text-[10px] uppercase text-[#F3F5F6]/60">
                      Melt Flow Index (MFI)
                    </dt>
                    <dd className="text-white font-semibold mt-1">
                      {product.mfi_value ||
                        (isId
                          ? "Diverifikasi per COA batch"
                          : "Verified per batch COA")}
                    </dd>
                    {product.mfi_test_condition && (
                      <dd className="text-[10px] text-[#F3F5F6]/55 mt-0.5">
                        {product.mfi_test_condition}
                      </dd>
                    )}
                  </div>

                  <div className="border-l-2 border-[#02BDEA] pl-3.5">
                    <dt className="text-[10px] uppercase text-[#F3F5F6]/60">
                      {isId ? "Densitas" : "Density"}
                    </dt>
                    <dd className="text-white font-semibold mt-1">
                      {product.density_value ||
                        (isId
                          ? "Diverifikasi per COA batch"
                          : "Verified per batch COA")}
                    </dd>
                  </div>

                  <div className="border-l-2 border-[#02BDEA] pl-3.5">
                    <dt className="text-[10px] uppercase text-[#F3F5F6]/60">
                      {isId ? "Kadar Air (Moisture)" : "Moisture Content"}
                    </dt>
                    <dd className="text-white font-semibold mt-1">
                      {product.moisture_content || "< 0.05%"}
                    </dd>
                  </div>

                  <div className="border-l-2 border-[#FFD71C] pl-3.5">
                    <dt className="text-[10px] uppercase text-[#F3F5F6]/60">
                      {isId ? "Kadar Abu (ASTM D5630)" : "Ash Content (ASTM D5630)"}
                    </dt>
                    <dd className="text-white font-semibold mt-1">
                      {product.ash_content || "< 0.15%"}
                    </dd>
                  </div>

                  <div className="border-l-2 border-[#FFD71C] pl-3.5">
                    <dt className="text-[10px] uppercase text-[#F3F5F6]/60">
                      {isId ? "Filtrasi Lelehan" : "Melt Filtration"}
                    </dt>
                    <dd className="text-white font-semibold mt-1">
                      {product.filtration_rating || "100 - 120 mesh (<100 micron)"}
                    </dd>
                  </div>

                  <div className="border-l-2 border-[#FFD71C] pl-3.5">
                    <dt className="text-[10px] uppercase text-[#F3F5F6]/60">
                      {isId ? "Profil Warna" : "Color Profile"}
                    </dt>
                    <dd className="text-white font-semibold mt-1">
                      {product.color_profile || "Standard Industrial Base"}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-[#1E324A] pt-4 text-xs text-[#F3F5F6]/75">
                  <strong className="text-[#FFD71C] font-mono-tech uppercase">
                    {isId
                      ? "Batasan Kepatuhan & Kontak Pangan:"
                      : "Food-Contact & Compliance Boundary:"}
                  </strong>{" "}
                  {product.food_contact_Execution}
                </div>
              </div>

              {/* Processes, Applications & Packaging */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="border border-[#101C2B]/15 bg-white p-5 space-y-3">
                  <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68]">
                    {isId ? "Proses yang Sesuai" : "Applicable Processes"}
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#101C2B] font-medium">
                    {product.manufacturing_processes.map((proc) => (
                      <li key={proc} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[#02BDEA]" />
                        <span>{proc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-[#101C2B]/15 bg-white p-5 space-y-3">
                  <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68]">
                    {isId ? "Rekomendasi Aplikasi" : "Recommended Applications"}
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#4B5B6E]">
                    {product.recommended_applications.map((app) => (
                      <li key={app} className="flex items-start gap-2">
                        <span className="text-[#123A68] font-bold">+</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-[#101C2B]/15 bg-white p-5 space-y-3">
                  <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68]">
                    {isId ? "Opsi Pengemasan" : "Packaging Options"}
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#4B5B6E]">
                    {product.packaging_options.map((pkg) => (
                      <li key={pkg} className="flex items-start gap-2">
                        <span className="text-[#123A68] font-bold">+</span>
                        <span>{pkg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Full Technical Specification Table */}
          <div className="border border-[#101C2B]/20 bg-white">
            <div className="px-6 py-4 bg-[#101C2B] text-[#F3F5F6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                {isId
                  ? `03 | JADWAL SPESIFIKASI LABORATORIUM (${product.grade_code})`
                  : `03 | LABORATORY SPECIFICATION SCHEDULE (${product.grade_code})`}
              </span>
              <span className="font-mono-tech text-[11px] text-[#F3F5F6]/70">
                {isId
                  ? "SELURUH NILAI BERSUMBER DARI REKAMAN DATABASE CMS"
                  : "ALL VALUES DERIVED FROM CMS DATABASE RECORDS"}
              </span>
            </div>

            {product.specifications && product.specifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="border-b border-[#101C2B]/15 bg-[#F3F5F6] font-mono-tech text-[11px] uppercase text-[#4B5B6E]">
                      <th className="p-4">
                        {isId ? "Kategori Sifat" : "Property Category"}
                      </th>
                      <th className="p-4">Parameter</th>
                      <th className="p-4">
                        {isId ? "Metode Uji" : "Test Method"}
                      </th>
                      <th className="p-4">
                        {isId ? "Nilai Target" : "Target Value"}
                      </th>
                      <th className="p-4">
                        {isId ? "Catatan Kualifikasi" : "Qualification Note"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#101C2B]/10 text-xs sm:text-sm">
                    {product.specifications.map((spec) => (
                      <tr key={spec.id} className="hover:bg-[#F3F5F6]/50">
                        <td className="p-4 font-mono-tech text-xs text-[#123A68]">
                          {spec.property_group}
                        </td>
                        <td className="p-4 font-semibold text-[#101C2B]">
                          {spec.property_name}
                        </td>
                        <td className="p-4 font-mono-tech text-xs text-[#4B5B6E]">
                          {spec.test_method || "Internal QC"}
                        </td>
                        <td className="p-4 font-mono-tech font-semibold text-[#101C2B]">
                          {spec.target_value}{" "}
                          {spec.unit ? `(${spec.unit})` : ""}
                        </td>
                        <td className="p-4 text-xs text-[#4B5B6E]">
                          {spec.qualification_note ||
                            (isId
                              ? "Diverifikasi per COA batch"
                              : "Verified per batch COA")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-sm text-[#4B5B6E] font-mono-tech">
                {isId
                  ? "Spesifikasi laboratorium batch terperinci untuk grade ini diterbitkan saat pengiriman sampel uji coba."
                  : "Detailed batch laboratory specifications for this grade are issued upon sample trial dispatch."}
              </div>
            )}
          </div>

          {/* Available Verified Documents & TDS Download */}
          <div className="border border-[#101C2B]/20 bg-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#101C2B]/10 pb-4">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
                  {isId
                    ? "04 | DOKUMENTASI LEMBAR DATA TEKNIS (TDS) & COA"
                    : "04 | TECHNICAL DATA SHEET (TDS) & COA DOCUMENTATION"}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#101C2B] mt-1">
                  {isId
                    ? "Unduh Dokumentasi Grade Terverifikasi"
                    : "Download Verified Grade Documentation"}
                </h2>
              </div>
              <span className="font-mono-tech text-xs text-[#4B5B6E]">
                {isId
                  ? "QR COA SPESIFIK BATCH DISERTAKAN PADA SETIAP KARUNG 25 KG"
                  : "BATCH-SPECIFIC QR COA SHIPS WITH EVERY 25 KG BAG"}
              </span>
            </div>

            {product.documents && product.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {product.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-[#101C2B]/15 bg-[#F3F5F6]/60 p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-mono-tech text-xs">
                        <span className="px-2 py-0.5 bg-[#101C2B] text-[#FFD71C]">
                          {doc.document_type}
                        </span>
                        <span className="text-[#4B5B6E]">
                          {doc.version_label}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#101C2B]">
                        {doc.title}
                      </h3>
                      {doc.qualification_note && (
                        <p className="text-xs text-[#4B5B6E] leading-relaxed">
                          {doc.qualification_note}
                        </p>
                      )}
                    </div>

                    {doc.file_url ? (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between px-4 py-2.5 bg-[#101C2B] text-white font-mono-tech text-xs uppercase tracking-wider hover:bg-[#123A68]"
                      >
                        <span>
                          {isId
                            ? "Buka Lembar Spesifikasi Teknis"
                            : "Open Technical Specification Sheet"}
                        </span>
                        <span>[TXT/SPEC] &rarr;</span>
                      </a>
                    ) : (
                      <span className="font-mono-tech text-xs text-[#4B5B6E]">
                        {isId
                          ? "Tersedia melalui permintaan komersial."
                          : "Available upon commercial inquiry."}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#4B5B6E]">
                {isId
                  ? "Belum ada dokumen publik terlampir. Silakan minta COA batch melalui tim komersial kami."
                  : "No public documents attached yet. Request a batch COA via our commercial desk."}
              </p>
            )}
          </div>

          {/* Related Materials */}
          {relatedMaterials.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#101C2B]">
                  {isId
                    ? "Grade Polimer PrimeFlow Lainnya"
                    : "Related PrimeFlow Polymer Grades"}
                </h2>
                <Link
                  href="/products"
                  className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68] hover:underline"
                >
                  {isId ? "Lihat Semua Grade" : "View All Grades"} &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedMaterials.map((rel) => (
                  <div
                    key={rel.id}
                    className="border border-[#101C2B]/15 bg-white p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-mono-tech text-xs">
                        <span className="font-bold text-[#123A68]">
                          {rel.grade_code}
                        </span>
                        <span className="text-[#4B5B6E]">
                          {rel.polymer_family}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#101C2B]">
                        <Link
                          href={`/products/${rel.slug}`}
                          className="hover:text-[#123A68]"
                        >
                          {rel.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#4B5B6E] line-clamp-2">
                        {rel.short_description}
                      </p>
                    </div>
                    <Link
                      href={`/products/${rel.slug}`}
                      className="font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] hover:text-[#123A68] pt-3 border-t border-[#101C2B]/10 flex justify-between"
                    >
                      <span>
                        {isId ? "Lihat Spesifikasi" : "View Specification"}
                      </span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
