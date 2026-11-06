import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerLocale } from "@/lib/i18n/locale-server";

export const metadata: Metadata = {
  title: "Sustainability & Circular Economy | Post-Industrial Polymer Recovery",
  description:
    "How PrimeFlow operationalizes circular economy principles across Indonesia's plastics sector, aligned with UN SDGs 9, 12, and 13.",
};

export default async function SustainabilityPage() {
  const locale = await getServerLocale();
  const isId = locale === "id";

  const cycleSteps = isId
    ? [
        {
          step: "SIKLUS 01",
          title: "Pabrik Konversi Mitra",
          desc: "Proses injection, blow, atau ekstrusi film menghasilkan 5% hingga 12% sisa sprue, runner, dan potongan tepi internal yang bersih.",
        },
        {
          step: "SIKLUS 02",
          title: "Pengumpulan Terpisah",
          desc: "Sisa produksi dipisahkan langsung di samping mesin berdasarkan keluarga polimer (PP, HDPE, LDPE) dan warna dasar tanpa bercampur sampah kota.",
        },
        {
          step: "SIKLUS 03",
          title: "Pemurnian 7-Tahap PrimeFlow",
          desc: "Skrining NIR (<0.1% PVC), cuci alkali panas 70-80C, dosis antioksidan, degassing vakum tiga tahap, dan filtrasi 100-120 mesh.",
        },
        {
          step: "SIKLUS 04",
          title: "Pencetakan Ulang Bersertifikat COA",
          desc: "Dikembalikan ke pabrik mitra dalam karung 25 kg berlapis inner-liner kedap beserta verifikasi QR COA untuk langsung dicetak kembali.",
        },
      ]
    : [
        {
          step: "CYCLE 01",
          title: "Partner Conversion Plant",
          desc: "Injection, blow, or film manufacturing generates 5% to 12% clean internal sprues, runners, and edge trimmings.",
        },
        {
          step: "CYCLE 02",
          title: "Segregated Collection",
          desc: "Scrap is segregated at the machine side by polymer family (PP, HDPE, LDPE) and base color without touching municipal waste.",
        },
        {
          step: "CYCLE 03",
          title: "PrimeFlow 7-Stage Purification",
          desc: "NIR screening (<0.1% PVC), 70-80C alkaline wash, antioxidant dosing, triple vacuum degassing, and 100-120 mesh filtration.",
        },
        {
          step: "CYCLE 04",
          title: "COA-Certified Re-Molding",
          desc: "Returned to the partner factory as hermetically lined 25 kg bags with QR COA verification for immediate re-molding.",
        },
      ];

  return (
    <div>
      {/* Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-6">
          <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
            {isId
              ? "EKONOMI SIRKULAR & DEKARBONISASI INDUSTRI"
              : "CIRCULAR ECONOMY & INDUSTRIAL DECARBONIZATION"}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white max-w-4xl leading-[1.03]">
            {isId
              ? "Sirkularitas Berbasis Data untuk Industri Konversi Plastik."
              : "Data-Driven Circularity for Industrial Plastics Conversion."}
          </h1>
          <p className="text-base sm:text-lg text-[#F3F5F6]/80 max-w-3xl leading-relaxed">
            {isId
              ? "Polimer tetap tak tergantikan bagi kemasan industri dan rumah tangga karena rasio kekuatan terhadap bobot serta efisiensinya. Tantangan rekayasanya adalah mengubah pola produksi linier ambil-buat-buang menjadi siklus hidup material tertutup (closed-loop) yang terverifikasi."
              : "Polymers remain indispensable to industrial and household packaging due to their strength-to-weight ratio and efficiency. The engineering challenge is transforming linear take-make-dispose production into a verified closed-loop material lifecycle."}
          </p>

          {/* Mandatory Carbon & Environmental Data Qualification */}
          <div className="border-l-4 border-[#02BDEA] bg-[#0B1420] p-5 max-w-4xl text-xs font-mono-tech text-[#F3F5F6]/80 leading-relaxed">
            <strong className="text-[#02BDEA] uppercase block mb-1">
              {isId
                ? "Kualifikasi Data Lingkungan & Pengukuran:"
                : "Environmental Data & Measurement Qualification:"}
            </strong>
            {isId
              ? "Seluruh angka timbulan sampah dan tingkat daur ulang yang dikutip pada halaman ini merujuk pada studi nasional terpublikasi (KLHK 2023; SWI & IPR 2024; NPAP 2020) serta Proposal Bisnis NUSC 2026 PrimeFlow. PrimeFlow tidak mengklaim kredit karbon operasional tanpa verifikasi; Laporan Carbon Footprint ESG spesifik klien dijadwalkan sebagai layanan Roadmap Fase 3 setelah verifikasi siklus hidup batch."
              : "All waste generation and recycling rate figures cited on this page reference published national studies (KLHK 2023; SWI & IPR 2024; NPAP 2020) and PrimeFlow's NUSC 2026 Business Proposal. PrimeFlow does not claim unverified operational carbon offsets; client-specific ESG Carbon Footprint Reports are scheduled as a Roadmap Phase 3 service following batch lifecycle verification."}
          </div>
        </div>
      </section>

      {/* Post-Industrial Waste Recovery Context */}
      <section className="py-20 bg-white border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
              {isId
                ? "01 | KESENJANGAN PEMULIHAN PASCA-INDUSTRI INDONESIA"
                : "01 | INDONESIA'S POST-INDUSTRIAL RECOVERY GAP"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B]">
              {isId
                ? "Menyerap Sisa Potongan Pabrik Bersih Sebelum Mengalami Downcycling atau Berakhir di TPA."
                : "Capturing Clean Factory Offcuts Before They Are Downcycled or Landfilled."}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#101C2B]/15 bg-[#F3F5F6] p-8 space-y-3">
              <span className="font-mono-tech text-xs text-[#123A68]">
                {isId
                  ? "KLHK (2023) & ACUAN LOSS KONVERSI"
                  : "KLHK (2023) & CONVERSION LOSS BENCHMARK"}
              </span>
              <div className="font-display text-3xl font-bold text-[#101C2B]">
                {isId
                  ? "300.000 - 600.000 Ton / Thn"
                  : "300,000 - 600,000 Tons / Yr"}
              </div>
              <p className="text-xs text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Estimasi volume tahunan sisa produksi internal (tingkat loss konversi 5% hingga 12%) di pabrik kemasan dan manufaktur plastik Indonesia dari total 10,59 juta ton sampah plastik nasional."
                  : "Estimated annual volume of internal production scrap (5% to 12% conversion loss rate) across Indonesia's packaging and plastic manufacturing plants out of 10.59 million tons total national plastic waste."}
              </p>
            </div>

            <div className="border border-[#101C2B]/15 bg-[#F3F5F6] p-8 space-y-3">
              <span className="font-mono-tech text-xs text-[#123A68]">
                SWI &amp; IPR (2024) / NPAP (2020)
              </span>
              <div className="font-display text-3xl font-bold text-[#101C2B]">
                {isId ? "22% Nasional / <10% Film" : "22% National / <10% Film"}
              </div>
              <p className="text-xs text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Tingkat daur ulang plastik nasional berada di angka 22%, sedangkan aliran film fleksibel (seperti LDPE dan PP film) masih di bawah 10% akibat kendala sortir dan filtrasi."
                  : "Overall plastic recycling in Indonesia stands at 22%, while flexible film streams (such as LDPE and PP film) remain below 10% due to sorting and filtration barriers."}
              </p>
            </div>

            <div className="border border-[#101C2B] bg-[#101C2B] text-white p-8 space-y-3">
              <span className="font-mono-tech text-xs text-[#FFD71C]">
                {isId
                  ? "ACUAN SIKLUS HIDUP LITERATUR"
                  : "LITERATURE LIFECYCLE BENCHMARK"}
              </span>
              <div className="font-display text-3xl font-bold text-[#02BDEA]">
                {isId
                  ? "Hingga 60% Lebih Rendah Emisi GRK"
                  : "Up to 60% Lower GHG Intensity"}
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                {isId
                  ? "Menggantikan resin murni berbasis fosil dengan poliolefin pasca-industri yang dimurnikan secara mekanis dapat menurunkan intensitas gas rumah kaca produksi bahan baku hingga 60% (acuan referensi proposal)."
                  : "Replacing fossil-derived virgin resin with mechanically purified post-industrial polyolefins can reduce raw material manufacturing greenhouse gas intensity by up to 60% (proposal reference benchmark)."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Dimensions of Sustainability */}
      <section className="py-20 bg-[#F3F5F6] border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
              {isId
                ? "02 | KERANGKA KEBERLANJUTAN MULTIDIMENSI"
                : "02 | MULTIDIMENSIONAL SUSTAINABILITY FRAMEWORK"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B]">
              {isId
                ? "Menyelaraskan Tanggung Jawab Lingkungan dengan Ketahanan Industri."
                : "Aligning Environmental Stewardship With Industrial Resilience."}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="border border-[#101C2B]/20 bg-white p-8 space-y-4">
              <span className="font-mono-tech text-xs font-bold text-[#123A68]">
                {isId ? "DIMENSI 01 | LINGKUNGAN" : "DIMENSION 01 | ENVIRONMENTAL"}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#101C2B]">
                {isId
                  ? "Zero-Waste-at-Source & Konservasi Sumber Daya"
                  : "Zero-Waste-at-Source & Resource Conservation"}
              </h3>
              <p className="text-sm text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Dengan menyerap sprue, runner, dan potongan tepi pasca-industri langsung di pabrik mitra, PrimeFlow mencegah polimer hidrokarbon bersih masuk ke TPA atau terdegradasi menjadi produk rongsok bermutu rendah."
                  : "By intercepting post-industrial sprues, runners, and edge trimmings directly at partner factories, PrimeFlow prevents clean hydrocarbon polymers from entering landfills or being downcycled into brittle low-grade products."}
              </p>
            </div>

            <div className="border border-[#101C2B]/20 bg-white p-8 space-y-4">
              <span className="font-mono-tech text-xs font-bold text-[#123A68]">
                {isId
                  ? "DIMENSI 02 | EKONOMI & INDUSTRI"
                  : "DIMENSION 02 | ECONOMIC & INDUSTRIAL"}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#101C2B]">
                {isId
                  ? "Kemandirian Pasokan Domestik & Efisiensi HPP"
                  : "Domestic Supply Self-Reliance & HPP Efficiency"}
              </h3>
              <p className="text-sm text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Material sirkular harus layak secara komersial. Substitusi resin murni impor dengan pelet PrimeFlow menurunkan pengeluaran bahan baku sebesar 25% hingga 30% (bergantung pada grade dan indeks pasar) sekaligus melindungi pabrik domestik dari defisit impor."
                  : "Circular materials must be commercially viable. Substituting imported virgin resin with PrimeFlow pellets reduces raw material expenditure by 25% to 30% (subject to grade and market index) while buffering domestic factories against import deficits."}
              </p>
            </div>

            <div className="border border-[#101C2B]/20 bg-white p-8 space-y-4">
              <span className="font-mono-tech text-xs font-bold text-[#123A68]">
                {isId
                  ? "DIMENSI 03 | TATA KELOLA & KEPATUHAN"
                  : "DIMENSION 03 | GOVERNANCE & COMPLIANCE"}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#101C2B]">
                {isId
                  ? "SDG 9, 12, 13 & Paspor Batch Tertelusur"
                  : "SDG 9, 12, 13 & Traceable Batch Passports"}
              </h3>
              <p className="text-sm text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Setiap batch dilengkapi Certificate of Analysis (COA) berkode QR yang mendokumentasikan kemurnian bahan baku dan verifikasi lab, mempersiapkan mitra manufaktur menghadapi audit rantai pasok hijau multinasional."
                  : "Every batch carries a QR-coded Certificate of Analysis (COA) documenting feedstock purity and lab verification, preparing manufacturing partners for multinational eco-compliance and green supply chain audits."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Material Lifecycle & Sustainability Roadmap */}
      <section className="py-20 bg-[#101C2B] text-[#F3F5F6]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
              {isId
                ? "03 | SIKLUS TERTUTUP & PETA JALAN KEBERLANJUTAN"
                : "03 | CLOSED-LOOP LIFECYCLE & SUSTAINABILITY ROADMAP"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {isId
                ? "Bagaimana Closed-Loop Toll-Recycling Menjaga Polimer Tetap Produktif."
                : "How Closed-Loop Toll-Recycling Keeps Polymers in Productive Circulation."}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {cycleSteps.map((item) => (
              <div
                key={item.step}
                className="border border-[#1E324A] bg-[#0B1420] p-6 space-y-3"
              >
                <span className="font-mono-tech text-xs text-[#FFD71C]">
                  {item.step}
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[#F3F5F6]/75 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-6 border-t border-[#1E324A]">
            <p className="text-xs font-mono-tech text-[#F3F5F6]/70">
              {isId
                ? "Tertarik membangun aliran maklon daur ulang tertutup (closed-loop) untuk pabrik Anda?"
                : "Interested in establishing a closed-loop toll-recycling stream for your facility?"}
            </p>
            <Link
              href="/contact?type=TOLL_RECYCLING"
              className="px-7 py-3.5 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe14f]"
            >
              {isId ? "Tanyakan Program Closed-Loop" : "Inquire Closed-Loop Program"}{" "}
              &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
