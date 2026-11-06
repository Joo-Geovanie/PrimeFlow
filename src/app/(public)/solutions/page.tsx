import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerLocale } from "@/lib/i18n/locale-server";

export const metadata: Metadata = {
  title: "B2B Supply Solutions | Adaptive Locked-Supply & Closed-Loop Toll-Recycling",
  description:
    "Commercial supply programs for medium-sized manufacturers: Adaptive Locked-Supply, staggered delivery, closed-loop toll-recycling, material consultation, and 5-10 kg on-site trials.",
};

const SOLUTIONS_EN = [
  {
    id: "industrial-resin-supply",
    code: "SOL-01",
    title: "Industrial Resin Supply (PP, PE, HDPE, LDPE)",
    subtitle: "Batch-Validated Post-Industrial Feedstock",
    problem:
      "Medium-sized converters face 50% to 60% national dependence on imported virgin resin, while informal recycled pellets cause nozzle blockages and erratic mold shrinkage.",
    solution:
      "PrimeFlow supplies curated post-industrial Polypropylene and Polyethylene pellets purified through 70 to 80 C alkaline washing, triple-stage vacuum degassing, and 100 to 120 mesh (<100 micron) filtration, backed by a QR-coded Certificate of Analysis (COA) on every 25 kg bag.",
    ctaLabel: "Request Resin Quotation",
    ctaHref: "/contact?type=RFQ",
  },
  {
    id: "flexible-procurement",
    code: "SOL-02",
    title: "Flexible Procurement (Right-Sized MOQs)",
    subtitle: "Eliminating Working Capital Lockup",
    problem:
      "Major petrochemical producers enforce high Minimum Order Quantities (MOQs), forcing medium-sized factories to tie up working capital in excess inventory.",
    solution:
      "PrimeFlow structures right-sized order volumes tailored to medium-scale manufacturing plants, allowing procurement teams to capture up to 25% to 30% raw material savings (subject to grade and market index) without overextending cash reserves.",
    ctaLabel: "Configure Order Volume",
    ctaHref: "/contact?type=RFQ",
  },
  {
    id: "adaptive-delivery",
    code: "SOL-03",
    title: "Adaptive & Staggered Delivery",
    subtitle: "Synchronized With Your Warehouse Floor & Cash Flow",
    problem:
      "Bulk single-drop deliveries congest factory warehouse space and create liquidity bottlenecks between raw material payment and finished goods collection.",
    solution:
      "Under our staggered delivery schedule, monthly resin allocations are dispatched in weekly or bi-weekly drops aligned directly with your physical warehouse storage capacity and production cash-flow cycle.",
    ctaLabel: "Plan Staggered Delivery Schedule",
    ctaHref: "/contact?type=ADAPTIVE_SUPPLY",
  },
  {
    id: "adaptive-supply",
    code: "SOL-04",
    title: "Recurring Supply Partnerships (Adaptive Locked-Supply)",
    subtitle: "Guaranteed Monthly Quota & Proportional Price Indexing",
    problem:
      "Spot-market scrap buyers suffer from sudden stock shortages, fluctuating quality, and exposure to crude oil price swings.",
    solution:
      "Our Adaptive Locked-Supply contract reserves an exclusive monthly tonnage quota for your plant, supported by a Dedicated Account Manager, 100% quality return guarantee against agreed COA tolerances, and proportional index clauses that protect both parties when global virgin resin prices shift.",
    ctaLabel: "Inquire Locked-Supply Partnership",
    ctaHref: "/contact?type=ADAPTIVE_SUPPLY",
  },
  {
    id: "toll-recycling",
    code: "SOL-05",
    title: "Closed-Loop Toll-Recycling (Jasa Maklon Sirkular)",
    subtitle: "Turn Your Internal Production Scrap Into Certified Pellets",
    problem:
      "Plastic conversion plants lose 5% to 12% of processed resin as internal sprues, runners, edge trim, and off-spec parts that are often sold off cheaply or downcycled.",
    solution:
      "Partner factories send their clean internal scrap to PrimeFlow. We sort, hot-alkaline wash, re-stabilize with 0.1 to 0.3% antioxidants, vacuum-degas, filter at 100 to 120 mesh, and return certified pellets ready for immediate re-molding in your own facility.",
    ctaLabel: "Start Closed-Loop Toll-Recycling",
    ctaHref: "/contact?type=TOLL_RECYCLING",
  },
  {
    id: "material-consultation",
    code: "SOL-06",
    title: "Material Substitution & Rheology Consultation",
    subtitle: "Engineering Support for Virgin-to-Recycled Transitions",
    problem:
      "Switching from 100% virgin resin to recycled polyolefins without adjusting MFI or barrel temperature profiles can impact cycle time and part stiffness.",
    solution:
      "PrimeFlow's chemistry and operations team evaluates your part geometry, clamping force, and target Melt Flow Index to recommend optimal blend ratios (from partial virgin substitution to 100% PrimeFlow resin) and peroxide/antioxidant formulations.",
    ctaLabel: "Request Engineering Consultation",
    ctaHref: "/contact?type=CONSULTATION",
  },
  {
    id: "sample-trial",
    code: "SOL-07",
    title: "Complimentary 5-10 kg Sample Trial Program",
    subtitle: "On-Site Technician Accompaniment & Machine Calibration",
    problem:
      "Factory owners and QA managers are understandably cautious about loading unfamiliar recycled pellets into high-precision injection or film equipment.",
    solution:
      "We dispatch a complimentary 5 to 10 kg sample kit accompanied by its laboratory Certificate of Analysis (COA). For plants in our target corridor, a PrimeFlow technical representative accompanies your team on-site during machine trial calibration.",
    ctaLabel: "Request 5-10 kg Sample Kit",
    ctaHref: "/contact?tab=sample",
  },
];

const SOLUTIONS_ID = [
  {
    id: "industrial-resin-supply",
    code: "SOL-01",
    title: "Pasokan Resin Industri (PP, PE, HDPE, LDPE)",
    subtitle: "Bahan Baku Pasca-Industri Tervalidasi per Batch",
    problem:
      "Pabrik konversi skala menengah menghadapi ketergantungan nasional 50% hingga 60% pada resin murni impor, sementara pelet daur ulang informal memicu penyumbatan nozzle dan penyusutan cetakan yang tidak stabil.",
    solution:
      "PrimeFlow memasok pelet Polipropilena dan Polietilena pasca-industri terkurasi yang dimurnikan melalui pencucian alkali panas 70 hingga 80 C, degassing vakum tiga tahap, dan filtrasi 100 hingga 120 mesh (<100 mikron), didukung Certificate of Analysis (COA) berkode QR pada setiap karung 25 kg.",
    ctaLabel: "Minta Penawaran Resin",
    ctaHref: "/contact?type=RFQ",
  },
  {
    id: "flexible-procurement",
    code: "SOL-02",
    title: "Pengadaan Fleksibel (MOQ Sesuai Skala Pabrik)",
    subtitle: "Menghilangkan Penguncian Modal Kerja",
    problem:
      "Produsen petrokimia besar menerapkan Minimum Order Quantity (MOQ) tinggi yang memaksa pabrik menengah mengunci modal kerja dalam stok berlebih.",
    solution:
      "PrimeFlow menyusun volume pemesanan yang proporsional bagi pabrik manufaktur skala menengah, memungkinkan tim pengadaan meraih penghematan bahan baku hingga 25% hingga 30% (bergantung pada grade dan indeks pasar) tanpa membebani likuiditas kas.",
    ctaLabel: "Atur Volume Pemesanan",
    ctaHref: "/contact?type=RFQ",
  },
  {
    id: "adaptive-delivery",
    code: "SOL-03",
    title: "Pengiriman Adaptif & Bertahap (Staggered Delivery)",
    subtitle: "Disinkronkan dengan Kapasitas Gudang & Arus Kas Anda",
    problem:
      "Pengiriman curah sekaligus memenuhi ruang lantai gudang pabrik dan menciptakan hambatan likuiditas antara pembayaran bahan baku dan pencairan piutang barang jadi.",
    solution:
      "Melalui jadwal pengiriman bertahap kami, alokasi resin bulanan dikirim secara mingguan atau dua mingguan selaras dengan kapasitas penyimpanan fisik gudang dan siklus arus kas produksi Anda.",
    ctaLabel: "Rencanakan Jadwal Pengiriman Bertahap",
    ctaHref: "/contact?type=ADAPTIVE_SUPPLY",
  },
  {
    id: "adaptive-supply",
    code: "SOL-04",
    title: "Kemitraan Pasokan Berkelanjutan (Adaptive Locked-Supply)",
    subtitle: "Kuota Bulanan Terjamin & Penyesuaian Harga Proporsional",
    problem:
      "Pembeli skrap pasar spot sering mengalami kelangkaan stok mendadak, kualitas berfluktuasi, dan paparan terhadap lonjakan harga minyak mentah.",
    solution:
      "Kontrak Adaptive Locked-Supply kami mengunci kuota tonase bulanan eksklusif untuk pabrik Anda, didukung Dedicated Account Manager, garansi retur kualitas 100% sesuai toleransi COA yang disepakati, serta klausul indeks proporsional yang melindungi kedua pihak saat harga resin murni dunia berubah.",
    ctaLabel: "Tanyakan Kemitraan Locked-Supply",
    ctaHref: "/contact?type=ADAPTIVE_SUPPLY",
  },
  {
    id: "toll-recycling",
    code: "SOL-05",
    title: "Closed-Loop Toll-Recycling (Jasa Maklon Sirkular)",
    subtitle: "Ubah Sisa Produksi Internal Anda Menjadi Pelet Bersertifikat",
    problem:
      "Pabrik konversi plastik kehilangan 5% hingga 12% resin yang diproses sebagai sprue, runner, potongan tepi, dan produk rijek internal yang sering dijual murah sebagai rongsok.",
    solution:
      "Pabrik mitra mengirimkan sisa produksi internal mereka yang bersih ke PrimeFlow. Kami sortir, cuci alkali panas, stabilkan kembali dengan antioksidan 0.1 hingga 0.3%, degas vakum, saring pada 100 hingga 120 mesh, dan kembalikan sebagai pelet bersertifikat siap cetak kembali di pabrik Anda.",
    ctaLabel: "Mulai Program Maklon Sirkular",
    ctaHref: "/contact?type=TOLL_RECYCLING",
  },
  {
    id: "material-consultation",
    code: "SOL-06",
    title: "Konsultasi Substitusi Material & Reologi",
    subtitle: "Dukungan Rekayasa untuk Transisi Virgin ke Daur Ulang",
    problem:
      "Beralih dari 100% resin murni ke poliolefin daur ulang tanpa menyesuaikan MFI atau profil suhu barrel dapat memengaruhi cycle time dan kekakuan produk.",
    solution:
      "Tim kimia dan operasi PrimeFlow mengevaluasi geometri produk, gaya klem (clamping force), dan target Melt Flow Index Anda guna merekomendasikan rasio campuran optimal (mulai substitusi parsial hingga 100% resin PrimeFlow) beserta formulasi peroksida/antioksidan.",
    ctaLabel: "Minta Konsultasi Teknis",
    ctaHref: "/contact?type=CONSULTATION",
  },
  {
    id: "sample-trial",
    code: "SOL-07",
    title: "Program Uji Coba Sampel Gratis 5-10 kg",
    subtitle: "Pendampingan Teknisi di Lokasi & Kalibrasi Mesin",
    problem:
      "Pemilik pabrik dan manajer QA wajar bersikap hati-hati sebelum memasukkan pelet daur ulang baru ke dalam mesin injeksi atau ekstrusi film berpresisi tinggi.",
    solution:
      "Kami mengirimkan kit sampel gratis 5 hingga 10 kg lengkap dengan Certificate of Analysis (COA) laboratoriumnya. Bagi pabrik di koridor sasaran kami, perwakilan teknis PrimeFlow mendampingi tim Anda langsung di lokasi saat kalibrasi uji coba mesin.",
    ctaLabel: "Minta Kit Sampel 5-10 kg",
    ctaHref: "/contact?tab=sample",
  },
];

export default async function SolutionsPage() {
  const locale = await getServerLocale();
  const isId = locale === "id";
  const solutions = isId ? SOLUTIONS_ID : SOLUTIONS_EN;

  return (
    <div>
      {/* Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-6">
          <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
            {isId
              ? "SOLUSI KOMERSIAL & RANTAI PASOK B2B"
              : "B2B COMMERCIAL & SUPPLY CHAIN SOLUTIONS"}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white max-w-4xl leading-[1.03]">
            {isId
              ? "Dirancang Mengikuti Kebutuhan Operasional Pabrik Skala Menengah."
              : "Engineered Around Medium-Scale Factory Operations."}
          </h1>
          <p className="text-base sm:text-lg text-[#F3F5F6]/80 max-w-3xl leading-relaxed">
            {isId
              ? "PrimeFlow hadir sebagai mitra pasokan strategis, bukan sekadar pialang komoditas spot. Setiap program komersial dirancang untuk melindungi mesin cetak Anda, menstabilkan alokasi resin bulanan, dan menjaga likuiditas modal kerja."
              : "PrimeFlow is structured as a strategic supply partner rather than a spot commodity broker. Every commercial program is designed to protect your molding equipment, stabilize monthly resin allocation, and preserve working capital liquidity."}
          </p>
        </div>
      </section>

      {/* 7 Solutions Grid */}
      <section className="py-20 bg-[#F3F5F6] border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-8">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              id={sol.id}
              className="scroll-mt-24 border border-[#101C2B]/20 bg-white grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-4 bg-[#101C2B] text-[#F3F5F6] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E324A]">
                <div className="space-y-3">
                  <span className="font-mono-tech text-xs font-bold text-[#FFD71C]">
                    {sol.code}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white leading-snug">
                    {sol.title}
                  </h2>
                  <p className="font-mono-tech text-xs text-[#02BDEA]">
                    {sol.subtitle}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href={sol.ctaHref}
                    className="inline-block w-full text-center py-3.5 px-5 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-wider hover:bg-[#ffe14f] transition-colors"
                  >
                    {sol.ctaLabel} &rarr;
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-8 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2.5 border-l-2 border-rose-500/60 pl-4">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-[#4B5B6E]">
                    {isId ? "Tantangan Industri" : "Industry Bottleneck"}
                  </span>
                  <p className="text-sm text-[#101C2B] leading-relaxed">
                    {sol.problem}
                  </p>
                </div>

                <div className="space-y-2.5 border-l-2 border-[#02BDEA] pl-4">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68] font-semibold">
                    {isId ? "Solusi PrimeFlow" : "PrimeFlow Architecture"}
                  </span>
                  <p className="text-sm text-[#101C2B] leading-relaxed">
                    {sol.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA to Calculator & Contact */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
              {isId
                ? "EVALUASI DAMPAK KOMERSIAL"
                : "EVALUATE COMMERCIAL IMPACT"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101C2B]">
              {isId
                ? "Simulasikan Penghematan Bulanan Anda atau Jadwalkan Uji Coba Sampel di Pabrik."
                : "Model Your Monthly Savings or Schedule an On-Site Sample Trial."}
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/#calculator"
              className="px-6 py-3.5 border border-[#101C2B] text-[#101C2B] font-mono-tech text-xs uppercase tracking-wider hover:bg-[#101C2B] hover:text-white"
            >
              {isId
                ? "Buka Kalkulator Penghematan HPP"
                : "Open HPP Savings Calculator"}
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-[#101C2B] text-[#FFD71C] font-mono-tech text-xs font-semibold uppercase tracking-wider"
            >
              {isId
                ? "Lanjut ke Formulir Permintaan"
                : "Proceed to Inquiry Forms"}{" "}
              &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
