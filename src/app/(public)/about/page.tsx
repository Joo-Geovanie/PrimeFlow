import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/data-store";
import { getServerLocale } from "@/lib/i18n/locale-server";
import { localizeSiteContent } from "@/lib/i18n/localize-data";

export const metadata: Metadata = {
  title: "About PrimeFlow | Vision, Mission & Industrial Strategy",
  description:
    "Learn about PrimeFlow's mission to produce near-virgin quality recycled Polypropylene (PP) and Polyethylene (PE) resin pellets for medium-sized Indonesian manufacturers.",
};

export default async function AboutPage() {
  const [locale, rawContentBlocks] = await Promise.all([
    getServerLocale(),
    getSiteContent(),
  ]);
  const isId = locale === "id";
  const contentBlocks = localizeSiteContent(rawContentBlocks, locale);
  const overviewBlock = contentBlocks.find(
    (b) => b.page_key === "about" && b.section_key === "overview"
  );

  const missions = isId
    ? [
        {
          num: "M-01",
          title: "Pemurnian Near-Virgin yang Aman bagi Mesin",
          desc: "Memproduksi bijih plastik daur ulang kelas near-virgin melalui teknologi pemurnian berpresisi tinggi, menghasilkan material bersih dan kuat tanpa risiko merusak mesin produksi klien.",
        },
        {
          num: "M-02",
          title: "Kepastian Pasokan Eksklusif Skala Menengah",
          desc: "Membangun rantai pasok tertutup (closed-loop supply chain) yang berfokus melayani pabrik skala menengah dengan jaminan alokasi stok sehingga mitra terhindar dari kelangkaan bahan baku.",
        },
        {
          num: "M-03",
          title: "Pengadaan Selaras Arus Kas & Gudang",
          desc: "Menghadirkan struktur harga yang menekan biaya bahan baku secara signifikan dibanding resin murni, dipadukan dengan pengiriman bertahap yang adaptif terhadap kapasitas gudang dan arus kas klien.",
        },
        {
          num: "M-04",
          title: "Pemulihan Limbah Pasca-Industri Bernilai Tinggi",
          desc: "Menyerap dan mengolah kembali limbah plastik pasca-industri yang bersih menjadi bahan baku rekayasa bernilai tinggi melalui kontrol kualitas yang disiplin.",
        },
      ]
    : [
        {
          num: "M-01",
          title: "Machine-Safe Near-Virgin Purification",
          desc: "Produce near-virgin class recycled plastic pellets through high-precision purification technology, ensuring clean, strong material without risk of damaging client molding machines.",
        },
        {
          num: "M-02",
          title: "Exclusive Mid-Market Supply Security",
          desc: "Build a closed-loop supply chain dedicated to medium-sized factories, providing guaranteed stock allocation so partners avoid raw material shortages.",
        },
        {
          num: "M-03",
          title: "Cash-Flow Aligned Procurement",
          desc: "Deliver a pricing structure that significantly reduces raw material costs compared to virgin resin, paired with staggered delivery schedules adapted to client warehouse capacity and cash flow.",
        },
        {
          num: "M-04",
          title: "High-Value Post-Industrial Recovery",
          desc: "Absorb and upcycle clean post-industrial plastic waste into high-value engineering feedstock through disciplined quality control.",
        },
      ];

  const roadmap = isId
    ? [
        {
          phase: "FOKUS 01 (THN 1 Q1-Q3)",
          title: "Validasi Operasional & Penetrasi Awal",
          points: [
            "Kalibrasi lab QC internal (MFI & Moisture Analyzer) untuk penerbitan COA batch.",
            "Distribusi kit sampel gratis 5-10 kg dengan pendampingan teknisi di pabrik (target kelulusan uji >70%).",
            "Mengamankan 5 produsen kemasan skala menengah pertama dalam kontrak Locked-Supply bulanan.",
          ],
        },
        {
          phase: "FOKUS 02 (THN 1 Q3 - THN 2 Q4)",
          title: "Stabilitas Pendapatan & Maklon Sirkular",
          points: [
            "Memperluas Adaptive Locked-Supply dengan pengiriman bertahap sesuai gudang (target retensi >80%).",
            "Meluncurkan layanan Closed-Loop Toll-Recycling (Maklon) untuk memurnikan sprue dan runner internal klien.",
            "Mengamankan pasokan bahan baku dari risiko kelangkaan skrap di pasar spot.",
          ],
        },
        {
          phase: "FOKUS 03 (THN 2 Q3 - THN 4 Q1)",
          title: "Ekspansi Skala, Pelaporan ESG & Multi-Sourcing",
          points: [
            "Transisi menuju kapasitas ekstrusi mandiri (in-house) dengan target tonggak 100 ton/bulan.",
            "Memperluas sumber bahan baku bersih ke stretch film logistik komersial.",
            "Menerbitkan laporan tahunan Carbon Footprint & sirkularitas bagi audit kepatuhan ramah lingkungan klien.",
          ],
        },
        {
          phase: "FOKUS 04 (THN 4 Q1 - THN 5 Q4)",
          title: "Integrasi Vertikal & Ketahanan Makro",
          points: [
            "Integrasi kapasitas pencetakan hilir non-pangan (palet industri, kantong utilitas, polibag).",
            "Melindungi margin operasional dari fluktuasi harga minyak mentah dan resin murni global.",
            "Mewujudkan ekosistem manufaktur sirkular bebas limbah ke TPA (zero-waste-to-landfill).",
          ],
        },
      ]
    : [
        {
          phase: "FOCUS 01 (Y1 Q1-Q3)",
          title: "Operational Validation & Initial Penetration",
          points: [
            "Calibrate internal QC lab (MFI & Moisture Analyzer) for batch COA issuance.",
            "Distribute 5-10 kg complimentary sample kits with on-site technician support (target >70% trial pass rate).",
            "Secure initial 5 medium-sized packaging manufacturers on monthly Locked-Supply contracts.",
          ],
        },
        {
          phase: "FOCUS 02 (Y1 Q3 - Y2 Q4)",
          title: "Revenue Stability & Closed-Loop Toll-Recycling",
          points: [
            "Scale Adaptive Locked-Supply with staggered warehouse-synced deliveries (target >80% retention).",
            "Launch Closed-Loop Toll-Recycling (Maklon) purifying client internal sprues and runners.",
            "Insulate feedstock supply against spot-market scrap shortages.",
          ],
        },
        {
          phase: "FOCUS 03 (Y2 Q3 - Y4 Q1)",
          title: "Scale Expansion, ESG Reporting & Multi-Sourcing",
          points: [
            "Transition toward in-house extrusion capacity (target 100 tons/month roadmap milestone).",
            "Expand clean feedstock sourcing to commercial logistics stretch film.",
            "Issue annual client Carbon Footprint & circularity reports for eco-compliance audits.",
          ],
        },
        {
          phase: "FOCUS 04 (Y4 Q1 - Y5 Q4)",
          title: "Vertical Integration & Macro Resilience",
          points: [
            "Integrate downstream non-food molding capacity (industrial pallets, utility bags, polybags).",
            "Protect operating margins against global crude oil and virgin resin price downturns.",
            "Establish a zero-waste-to-landfill circular manufacturing ecosystem.",
          ],
        },
      ];

  const team = isId
    ? [
        {
          name: "Muhammad Zidan Nugroho",
          role: "Direktur Utama (Chief Executive) & Pimpinan Kimia Mutu",
          background:
            "Latar belakang kimia analitik dari IPB University & Sekolah Menengah Analis Kimia Bogor (SMAKBO). Memimpin strategi korporat, kalibrasi laboratorium NIR/QC, serta verifikasi Certificate of Analysis.",
          contact: "zidannnugroho@apps.ipb.ac.id",
        },
        {
          name: "Audina Maharani",
          role: "Manajer Keuangan, SDM & Pasokan Strategis",
          background:
            "IPB University. Mengelola perencanaan keuangan, pemodelan pengadaan HPP, penstrukturan kontrak Adaptive Locked-Supply, serta tata kelola sumber daya manusia.",
          contact: "audinamaharani225@gmail.com",
        },
        {
          name: "Karim Abdul Azis",
          role: "Manajer Operasi, Produksi & Logistik",
          background:
            "IPB University. Mengarahkan kurasi dan sortir bahan baku, alur produksi toll-processing, logistik pergudangan, serta pendampingan teknis uji coba sampel di lokasi pabrik.",
          contact: "karimabdulazis154@gmail.com",
        },
      ]
    : [
        {
          name: "Muhammad Zidan Nugroho",
          role: "Chief Executive (Direktur Utama) & Quality Chemistry Lead",
          background:
            "IPB University & Sekolah Menengah Analis Kimia Bogor (SMAKBO) analytical chemistry background. Leads corporate strategy, NIR/QC laboratory calibration, and Certificate of Analysis verification.",
          contact: "zidannnugroho@apps.ipb.ac.id",
        },
        {
          name: "Audina Maharani",
          role: "Finance, HR & Strategic Supply Manager",
          background:
            "IPB University. Oversees financial planning, HPP procurement modeling, Adaptive Locked-Supply contract structuring, and human resource governance.",
          contact: "audinamaharani225@gmail.com",
        },
        {
          name: "Karim Abdul Azis",
          role: "Operations, Production & Logistics Manager",
          background:
            "IPB University. Directs raw material sorting, toll-processing production workflows, warehouse logistics, and on-site sample trial accompaniment.",
          contact: "karimabdulazis154@gmail.com",
        },
      ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="max-w-4xl space-y-6">
            <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
              {isId
                ? "PROFIL KORPORAT & TESIS INDUSTRI"
                : "CORPORATE PROFILE & INDUSTRIAL THESIS"}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-[1.04]">
              {overviewBlock?.title}
            </h1>
            <p className="text-lg sm:text-xl text-[#F3F5F6]/85 leading-relaxed max-w-3xl">
              {overviewBlock?.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Story & Etymology */}
      <section className="py-20 bg-white border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
              {isId ? "01 | FILOSOFI MEREK" : "01 | BRAND PHILOSOPHY"}
            </span>
            <h2 className="font-display text-3xl font-bold text-[#101C2B]">
              {isId
                ? "Mengapa Nama \"PrimeFlow\" Penting di Lantai Produksi Pabrik."
                : "Why the Name \"PrimeFlow\" Matters on the Factory Floor."}
            </h2>
            <p className="text-sm text-[#4B5B6E] leading-relaxed">
              {overviewBlock?.body}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-[#101C2B] bg-[#101C2B] text-[#F3F5F6] p-8 space-y-3">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                {isId ? "ETIMOLOGI BAGIAN I" : "ETYMOLOGY PART I"}
              </span>
              <h3 className="font-display text-3xl font-bold text-[#FFD71C]">
                PRIME
              </h3>
              <p className="text-sm text-[#F3F5F6]/80 leading-relaxed">
                {isId
                  ? "Melambangkan komitmen kami terhadap kurasi bahan baku pasca-industri berkemurnian tinggi: toleransi nol terhadap kontaminasi PVC (<0.1%), pencucian alkali panas 70 hingga 80 C, kadar air di bawah 0.05%, dan residu abu di bawah 0.15%."
                  : "Represents our commitment to high-purity post-industrial feedstock curation: zero tolerance for PVC contamination (<0.1%), 70 to 80 C alkaline washing, moisture below 0.05%, and ash residue below 0.15%."}
              </p>
            </div>

            <div className="border border-[#101C2B] bg-[#0B1420] text-[#F3F5F6] p-8 space-y-3">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                {isId ? "ETIMOLOGI BAGIAN II" : "ETYMOLOGY PART II"}
              </span>
              <h3 className="font-display text-3xl font-bold text-[#02BDEA]">
                FLOW
              </h3>
              <p className="text-sm text-[#F3F5F6]/80 leading-relaxed">
                {isId
                  ? "Menunjukkan stabilitas Melt Flow Index (MFI) yang konsisten (referensi ~2.17 g/10 mnt satu siklus panas dan grade terkalibrasi peroksida) serta filtrasi lelehan 100 hingga 120 mesh agar ekstruder dan nozzle injeksi klien bekerja tanpa lonjakan tekanan."
                  : "Signifies consistent Melt Flow Index (MFI) stability (~2.17 g/10 min single-heat reference and peroxide-tuned grades) plus 100 to 120 mesh melt filtration so client extruders and injection nozzles run without pressure spikes."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-[#F3F5F6] border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 bg-[#101C2B] text-white p-8 sm:p-10 space-y-4 border-l-4 border-[#FFD71C]">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                {isId ? "02 | VISI PERUSAHAAN" : "02 | CORPORATE VISION"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-snug">
                {isId
                  ? "Menjadi produsen bahan baku berkelanjutan yang mewujudkan ekosistem industri tangguh, mandiri, dan berwawasan lingkungan melalui teknologi berpresisi tinggi."
                  : "To become a sustainable raw material producer that realizes a resilient, self-reliant, and environmentally responsible industrial ecosystem through high-precision technology."}
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
                {isId ? "03 | EMPAT MISI OPERASIONAL" : "03 | FOUR OPERATING MISSIONS"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {missions.map((m) => (
                  <div
                    key={m.num}
                    className="border border-[#101C2B]/15 bg-white p-6 space-y-2.5"
                  >
                    <span className="font-mono-tech text-xs font-bold text-[#123A68]">
                      {m.num}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#101C2B]">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[#4B5B6E] leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Market Positioning (TAM / SAM / SOM) */}
      <section className="py-20 bg-white border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
              {isId
                ? "04 | UKURAN PASAR & POSISI STRATEGIS"
                : "04 | MARKET SIZING & STRATEGIC POSITIONING"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B]">
              {isId
                ? "Berfokus pada Koridor Manufaktur Skala Menengah Indonesia."
                : "Focused on Indonesia's Medium-Scale Manufacturing Corridor."}
            </h2>
            <p className="text-sm text-[#4B5B6E] leading-relaxed">
              {isId
                ? "Industri kemasan Indonesia tumbuh 5% hingga 6% per tahun dengan estimasi nilai pasar melampaui Rp 116 triliun (IPF / Fitriani, 2023). PrimeFlow memfokuskan operasi komersial awalnya pada pabrik konversi skala menengah di Jabodetabek dan Pulau Jawa."
                : "Indonesia's packaging industry grows at 5% to 6% annually with an estimated market value exceeding Rp 116 trillion (IPF / Fitriani, 2023). PrimeFlow focuses its initial commercial operations on medium-scale converters in Greater Jakarta (Jabodetabek) and Java."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#101C2B]/20 bg-[#F3F5F6] p-8 space-y-3">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
                {isId
                  ? "TAM | PASAR NASIONAL (INDONESIA)"
                  : "TAM | NATIONAL MARKET (INDONESIA)"}
              </span>
              <div className="font-display text-3xl font-bold text-[#101C2B]">
                {isId ? "650 - 850 Unit Industri" : "650 - 850 Industrial Units"}
              </div>
              <div className="font-mono-tech text-sm font-semibold text-[#123A68]">
                {isId
                  ? "Rp 51,8 - Rp 71,2 Triliun / Tahun"
                  : "Rp 51.8 - Rp 71.2 Trillion / Year"}
              </div>
              <p className="text-xs text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Estimasi volume permintaan nasional sebesar 2,88 hingga 3,24 juta ton per tahun di seluruh produsen kemasan plastik dan peralatan rumah tangga."
                  : "Estimated national demand volume of 2.88 to 3.24 million tons per year across plastic packaging and household goods converters."}
              </p>
            </div>

            <div className="border border-[#101C2B]/20 bg-[#F3F5F6] p-8 space-y-3">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
                {isId
                  ? "SAM | PASAR REGIONAL (PULAU JAWA)"
                  : "SAM | REGIONAL MARKET (JAVA ISLAND)"}
              </span>
              <div className="font-display text-3xl font-bold text-[#101C2B]">
                {isId ? "560 - 740 Unit Industri" : "560 - 740 Industrial Units"}
              </div>
              <div className="font-mono-tech text-sm font-semibold text-[#123A68]">
                {isId
                  ? "Rp 38,8 - Rp 56,9 Triliun / Tahun"
                  : "Rp 38.8 - Rp 56.9 Trillion / Year"}
              </div>
              <p className="text-xs text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Estimasi volume regional sebesar 2,16 hingga 2,59 juta ton per tahun yang terkonsentrasi di kawasan industri Pulau Jawa."
                  : "Estimated regional volume of 2.16 to 2.59 million tons per year concentrated across Java industrial estates."}
              </p>
            </div>

            <div className="border-2 border-[#101C2B] bg-[#101C2B] text-white p-8 space-y-3">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                {isId
                  ? "SOM | PASAR SASARAN (JABODETABEK)"
                  : "SOM | TARGET MARKET (JABODETABEK)"}
              </span>
              <div className="font-display text-3xl font-bold text-white">
                {isId ? "280 - 380 Unit Industri" : "280 - 380 Industrial Units"}
              </div>
              <div className="font-mono-tech text-sm font-semibold text-[#02BDEA]">
                {isId
                  ? "Rp 15,5 - Rp 25,5 Triliun / Tahun"
                  : "Rp 15.5 - Rp 25.5 Trillion / Year"}
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                {isId
                  ? "Serviceable Obtainable Market sebesar 860.000 hingga 1,16 juta ton per tahun di Jabodetabek dan koridor industri sekitarnya."
                  : "Serviceable Obtainable Market of 860,000 to 1.16 million tons per year in Jabodetabek and surrounding industrial corridors."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Phase Operational Model & 5-Year Roadmap */}
      <section className="py-20 bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
              {isId
                ? "05 | TRANSPARANSI OPERASIONAL & PETA JALAN 5 TAHUN"
                : "05 | OPERATIONAL TRANSPARENCY & 5-YEAR ROADMAP"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {isId
                ? "Alokasi Modal Disiplin: Dari Toll-Processing Modular Menuju Ekstrusi Mandiri."
                : "Disciplined Capital Allocation: From Modular Toll-Processing to In-House Extrusion."}
            </h2>
            <p className="text-sm text-[#F3F5F6]/75 leading-relaxed">
              {isId
                ? "Secara transparan, PrimeFlow menjalankan peta jalan industri dua fase. Selama 2,5 tahun pertama, kami menggunakan model produksi kemitraan (toll-processing) dan sewa peralatan yang efisien secara modal, dipadukan dengan laboratorium QC internal terkalibrasi milik kami (Melt Flow Indexer, Moisture Analyzer) untuk memvalidasi setiap batch dan menerbitkan Certificate of Analysis (COA). Mulai Tahun ke-3 dan seterusnya, operasi beralih menuju lini ekstrusi mandiri (in-house)."
                : "In full transparency, PrimeFlow operates a two-phase industrial roadmap. During the first 2.5 years, we utilize a capital-efficient toll-processing and equipment-lease model combined with our own calibrated internal QC laboratory (Melt Flow Indexer, Moisture Analyzer) to validate batches and issue Certificates of Analysis (COA). From Year 3 onward, operations transition toward dedicated in-house extrusion lines."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmap.map((item) => (
              <div
                key={item.phase}
                className="border border-[#1E324A] bg-[#0B1420] p-6 space-y-4"
              >
                <span className="font-mono-tech text-xs text-[#FFD71C] block">
                  {item.phase}
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  {item.title}
                </h3>
                <ul className="space-y-2 text-xs text-[#F3F5F6]/75 leading-relaxed">
                  {item.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="text-[#02BDEA] font-bold">+</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Team & Organizational Structure */}
      <section className="py-20 bg-[#F3F5F6]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
                {isId
                  ? "06 | TIM PENDIRI & TATA KELOLA"
                  : "06 | FOUNDING TEAM & GOVERNANCE"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B]">
                {isId
                  ? "Kepemimpinan Kimia Analitik & Operasi Industri."
                  : "Analytical Chemistry & Industrial Operations Leadership."}
              </h2>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#101C2B] text-[#FFD71C] font-mono-tech text-xs font-semibold uppercase tracking-wider"
            >
              {isId ? "Hubungi Tim Kami" : "Connect With Our Team"} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="border border-[#101C2B]/15 bg-white p-7 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68]">
                    {member.role}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#101C2B]">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#4B5B6E] leading-relaxed">
                    {member.background}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#101C2B]/10 font-mono-tech text-xs text-[#101C2B]">
                  {member.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
