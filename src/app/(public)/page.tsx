import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPublishedProducts, getSiteContent } from "@/lib/data-store";
import { MaterialSavingsCalculator } from "@/components/sections/MaterialSavingsCalculator";
import { getServerLocale } from "@/lib/i18n/locale-server";
import { localizeProducts, localizeSiteContent } from "@/lib/i18n/localize-data";

const PROCESSING_STAGES_EN = [
  {
    step: "01",
    name: "Raw Material Selection",
    spec: "Post-Industrial Single-Heat Stream",
    summary:
      "Curated offcuts, sprues, runners, and clean film trimmings sourced directly from industrial conversion plants, avoiding municipal organic contamination.",
  },
  {
    step: "02",
    name: "NIR Spectroscopy Sorting",
    spec: "PVC Rejection Threshold < 0.1%",
    summary:
      "Handheld Near-Infrared (NIR) verification isolates PP, HDPE, and LDPE streams while rejecting PVC, PET, metal, and elastomer cross-contaminants.",
  },
  {
    step: "03",
    name: "Precision Alkaline Washing",
    spec: "70 - 80 C Multi-Stage Hot Wash",
    summary:
      "Heated alkaline and surfactant washing lifts stubborn surface oils, release agents, and label adhesives without cleaving polymer chains.",
  },
  {
    step: "04",
    name: "Additive Formulation",
    spec: "0.1 - 0.3% Antioxidant + MFI Tuning",
    summary:
      "Loss-in-weight dosing of primary and secondary antioxidants, organic peroxide rheology modifiers for PP, optical brighteners, and odor neutralizers.",
  },
  {
    step: "05",
    name: "Extrusion & Micro-Filtration",
    spec: "100 - 120 Mesh (< 100 Micron)",
    summary:
      "High-durability single-screw compounding paired with automatic screen changers to trap carbonized specks and protect client molding nozzles.",
  },
  {
    step: "06",
    name: "Triple-Stage Vacuum Degassing",
    spec: "Volatile & Moisture Extraction",
    summary:
      "Three-zone vacuum venting strips residual volatile organic compounds (VOCs) and steam prior to die-head exit, preventing voids and bubbles.",
  },
  {
    step: "07",
    name: "Pelletization & Vibrating Sieve",
    spec: "Uniform Cylindrical Geometry",
    summary:
      "Precision strand or die-face cutting followed by centrifugal drying and vibrating classification to eliminate fines and oversized granules.",
  },
  {
    step: "08",
    name: "Hermetic Inner-Liner Packaging",
    spec: "Target Moisture < 0.05%",
    summary:
      "Packed in 25 kg woven PP bags with sealed PE inner liners (or 500 to 1,000 kg jumbo bags) to lock out ambient humidity during storage.",
  },
  {
    step: "09",
    name: "Batch Quality Control & QR COA",
    spec: "ASTM D1238 / D5630 / ISO 527",
    summary:
      "Internal lab verification of Melt Flow Index, moisture (<0.05%), ash content (<0.15%), tensile/impact strength, and mold shrinkage before QR COA release.",
  },
];

const PROCESSING_STAGES_ID = [
  {
    step: "01",
    name: "Seleksi Bahan Baku",
    spec: "Aliran Pasca-Industri Satu Siklus Panas",
    summary:
      "Sisa potongan produksi, sprue, runner, dan trim film bersih yang diserap langsung dari pabrik konversi industri, bebas kontaminasi sampah organik kota.",
  },
  {
    step: "02",
    name: "Sortir Spektroskopi NIR",
    spec: "Ambang Penolakan PVC < 0.1%",
    summary:
      "Verifikasi Near-Infrared (NIR) genggam memisahkan aliran PP, HDPE, dan LDPE secara presisi serta menolak kontaminan silang PVC, PET, logam, dan elastomer.",
  },
  {
    step: "03",
    name: "Pencucian Alkali Panas Presisi",
    spec: "Cuci Panas Bertingkat 70 - 80 C",
    summary:
      "Pencucian alkali panas dan surfaktan mengangkat sisa oli permukaan, mold release agent, serta perekat label tanpa memutus rantai polimer.",
  },
  {
    step: "04",
    name: "Formulasi Aditif",
    spec: "0.1 - 0.3% Antioksidan + Kalibrasi MFI",
    summary:
      "Pendosisan loss-in-weight untuk antioksidan primer dan sekunder, pengatur reologi peroksida organik untuk PP, pencerah optik, dan penetral bau.",
  },
  {
    step: "05",
    name: "Ekstrusi & Mikro-Filtrasi",
    spec: "100 - 120 Mesh (< 100 Mikron)",
    summary:
      "Kompon sekrup tunggal berdaya tahan tinggi yang dipadukan dengan automatic screen changer untuk menahan bintik karbon dan melindungi nozzle mesin klien.",
  },
  {
    step: "06",
    name: "Degassing Vakum Tiga Tahap",
    spec: "Ekstraksi Volatil & Uap Air",
    summary:
      "Tiga zona ekstraksi vakum menarik keluar senyawa organik volatil (VOC) dan uap air sebelum keluar dari die-head, mencegah rongga dan gelembung.",
  },
  {
    step: "07",
    name: "Peletisasi & Ayakan Getar",
    spec: "Geometri Silindris Seragam",
    summary:
      "Pemotongan strand atau die-face presisi yang diikuti pengeringan sentrifugal dan klasifikasi ayakan getar untuk mengeliminasi serbuk halus.",
  },
  {
    step: "08",
    name: "Pengemasan Inner-Liner Kedap",
    spec: "Target Kadar Air < 0.05%",
    summary:
      "Dikemas dalam karung woven PP 25 kg berlapis inner liner PE rapat (atau jumbo bag 500 hingga 1.000 kg) guna menahan kelembapan udara gudang.",
  },
  {
    step: "09",
    name: "QC Laboratorium Batch & QR COA",
    spec: "ASTM D1238 / D5630 / ISO 527",
    summary:
      "Verifikasi lab internal untuk Melt Flow Index, kadar air (<0.05%), kadar abu (<0.15%), kekuatan tarik/impak, dan penyusutan cetakan sebelum rilis QR COA.",
  },
];

export default async function HomePage() {
  const [locale, rawProducts, rawContentBlocks] = await Promise.all([
    getServerLocale(),
    getPublishedProducts(),
    getSiteContent(),
  ]);

  const isId = locale === "id";
  const products = localizeProducts(rawProducts, locale);
  const contentBlocks = localizeSiteContent(rawContentBlocks, locale);

  const heroBlock = contentBlocks.find(
    (b) => b.page_key === "home" && b.section_key === "hero"
  );

  const stages = isId ? PROCESSING_STAGES_ID : PROCESSING_STAGES_EN;

  const comparisonRows = isId
    ? [
        {
          param: "Kebebasan Partikulat Asing & PVC",
          virgin: "Tinggi (Grade reaktor petrokimia)",
          primeflow:
            "Tinggi (Skrining NIR <0.1% PVC + filtrasi 100-120 mesh)",
          scrap:
            "Rendah (Sering terkontaminasi kertas, lem, dan silang PVC)",
        },
        {
          param: "Kemurnian Sumber Bahan Baku",
          virgin: "Monomer hidrokarbon fosil",
          primeflow:
            "Sisa potongan pabrik pasca-industri terkurasi satu siklus panas",
          scrap:
            "Campuran limbah pasca-konsumsi yang terpapar residu organik",
        },
        {
          param: "Stabilitas Melt Flow Index (MFI)",
          virgin: "Konsisten sesuai spesifikasi grade",
          primeflow:
            "Target referensi ~2.17 g/10m + stabilisasi peroksida/antioksidan",
          scrap:
            "Fluktuasi antar-batch tak terprediksi akibat pemutusan rantai berulang",
        },
        {
          param: "Presisi Cetakan & Kontrol Penyusutan",
          virgin: "Penyusutan cetakan (shrinkage) terprediksi",
          primeflow:
            "Uji shrinkage internal + kadar air <0.05% pada setiap COA batch",
          scrap:
            "Rentan melengkung (warpage), rongga, dan variasi ketebalan film",
        },
        {
          param: "Profil Warna Dasar & Bau",
          virgin: "Jernih / putih alami, tidak berbau",
          primeflow:
            "Sortir warna homogen + cuci alkali 70-80C + degassing tiga tahap",
          scrap:
            "Abu-abu kusam/menguning dengan sisa bau senyawa volatil",
        },
        {
          param: "Struktur Biaya Pengadaan (Dampak HPP)",
          virgin:
            "Biaya tinggi; terpapar fluktuasi minyak mentah & kurs USD impor",
          primeflow:
            "Penghematan bahan baku hingga 25% - 30% vs acuan virgin impor*",
          scrap:
            "Harga per kg murah, tetapi downtime mesin dan tingkat rijek tinggi",
        },
        {
          param: "Minimum Order Quantity (MOQ) & Arus Kas",
          virgin: "MOQ curah tinggi yang mengunci modal kerja",
          primeflow:
            "Adaptive Locked-Supply dengan pengiriman bertahap sesuai gudang",
          scrap: "Pembelian tunai spot dengan ketersediaan volume tidak menentu",
        },
        {
          param: "Intensitas Karbon Rantai Pasok & ESG",
          virgin: "Jejak emisi petrokimia hulu tinggi",
          primeflow:
            "Intensitas GRK manufaktur hingga 60% lebih rendah + pelaporan ESG",
          scrap: "Asal bahan tidak terverifikasi; tanpa jejak audit atau COA batch",
        },
      ]
    : [
        {
          param: "Foreign Particulate & PVC Freedom",
          virgin: "High (Petrochemical reactor grade)",
          primeflow:
            "High (NIR screened <0.1% PVC + 100-120 mesh filtration)",
          scrap:
            "Low (Frequent paper, adhesive, and PVC cross-contamination)",
        },
        {
          param: "Feedstock Source Purity",
          virgin: "Fossil hydrocarbon monomer",
          primeflow:
            "Curated single-heat post-industrial factory offcuts",
          scrap:
            "Mixed post-consumer waste exposed to organic residues",
        },
        {
          param: "Melt Flow Index (MFI) Stability",
          virgin: "Consistent within grade specification",
          primeflow:
            "Target ~2.17 g/10m reference + peroxide/antioxidant stabilization",
          scrap:
            "Unpredictable lot-to-lot drift from multi-cycle chain scission",
        },
        {
          param: "Molding Precision & Shrinkage Control",
          virgin: "Predictable mold shrinkage",
          primeflow:
            "Internal shrinkage test + moisture <0.05% per batch COA",
          scrap:
            "High warpage, voids, and film gauge variation",
        },
        {
          param: "Base Color & Odor Profile",
          virgin: "Natural clear / white, odorless",
          primeflow:
            "Homogeneous color sort + 70-80C alkaline wash + triple degassing",
          scrap:
            "Dull gray/yellowing with residual volatile odors",
        },
        {
          param: "Procurement Cost Structure (HPP Impact)",
          virgin:
            "High cost; exposed to crude oil & USD import swings",
          primeflow:
            "Up to 25% - 30% raw material savings vs imported virgin benchmark*",
          scrap:
            "Low unit price, but high machine downtime and reject rate",
        },
        {
          param: "Minimum Order Quantity (MOQ) & Cash Flow",
          virgin: "High bulk MOQs locking up working capital",
          primeflow:
            "Adaptive Locked-Supply with staggered warehouse-synced drops",
          scrap: "Spot cash purchases with erratic monthly volume",
        },
        {
          param: "Supply Chain Carbon Intensity & ESG",
          virgin: "High upstream petrochemical footprint",
          primeflow:
            "Up to 60% lower manufacturing GHG intensity + ESG reporting",
          scrap: "Unverified origin; no audit trail or batch COA",
        },
      ];

  const applications = isId
    ? [
        {
          code: "APP-01",
          sector: "Injection Molding",
          grades: "PP 100 / PE 150",
          items: [
            "Wadah penyimpanan rumah tangga & organizer",
            "Baki komponen industri & krat logistik",
            "Ember utilitas, baskom & gantungan",
            "Tutup botol non-pangan, cap & braket peralatan",
          ],
        },
        {
          code: "APP-02",
          sector: "Extrusion Blow Molding",
          grades: "HDPE 100",
          items: [
            "Botol deterjen & bahan kimia rumah tangga",
            "Jerigen industri 5L hingga 20L & carboy",
            "Wadah pelumas & agrokimia",
            "Dunnage gudang cetakan & ember kimia",
          ],
        },
        {
          code: "APP-03",
          sector: "Blown & Cast Film",
          grades: "LDPE 200",
          items: [
            "Inner liner pelindung industri",
            "Shrink film sekunder & pembungkus transit",
            "Kantong sampah komersial heavy-duty",
            "Polibag pertanian & lembaran pembibitan",
          ],
        },
        {
          code: "APP-04",
          sector: "Lembaran & Profil Sekunder",
          grades: "PP 100 / HDPE 100",
          items: [
            "Baki utilitas non-pangan thermoforming",
            "Palet penanganan material & layer pad",
            "Papan logistik polipropilena bergelombang",
            "Selubung pelindung kabel & spacer",
          ],
        },
      ]
    : [
        {
          code: "APP-01",
          sector: "Injection Molding",
          grades: "PP 100 / PE 150",
          items: [
            "Household storage containers & organizers",
            "Industrial component trays & logistics crates",
            "Utility buckets, basins & hangers",
            "Non-food closures, caps & appliance brackets",
          ],
        },
        {
          code: "APP-02",
          sector: "Extrusion Blow Molding",
          grades: "HDPE 100",
          items: [
            "Detergent & household chemical bottles",
            "5L to 20L industrial jerrycans & carboys",
            "Lubricant & agrochemical containers",
            "Molded warehouse dunnage & pails",
          ],
        },
        {
          code: "APP-03",
          sector: "Blown & Cast Film",
          grades: "LDPE 200",
          items: [
            "Protective industrial inner liners",
            "Secondary shrink & transit bundling film",
            "Heavy-duty commercial refuse sacks",
            "Agricultural polybags & nursery sheeting",
          ],
        },
        {
          code: "APP-04",
          sector: "Sheet & Secondary Profiles",
          grades: "PP 100 / HDPE 100",
          items: [
            "Thermoformed non-food utility trays",
            "Material handling pallets & layer pads",
            "Corrugated polypropylene logistics boards",
            "Protective cable conduits & spacers",
          ],
        },
      ];

  return (
    <div>
      {/* =====================================================================
          1. PREMIUM HERO (Commanding First Viewport)
      ====================================================================== */}
      <section className="relative bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/materials/hero-pellets.jpg"
            alt="Macro close-up of translucent recycled polypropylene and polyethylene resin pellets"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101C2B] via-[#101C2B]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1420] via-transparent to-[#101C2B]/50" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            {/* Left 7 columns: Editorial Headline & CTAs */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 border border-[#02BDEA]/40 bg-[#0B1420]/85 px-4 py-2">
                <span className="h-2 w-2 bg-[#FFD71C]" />
                <span className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#02BDEA]">
                  {isId
                    ? "REKAYASA POLIOLEFIN PASCA-INDUSTRI | PP & PE"
                    : "POST-INDUSTRIAL POLYOLEFIN ENGINEERING | PP & PE"}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98] text-white">
                  Prime Quality.
                  <span className="block text-[#02BDEA] mt-1">
                    Consistent Flow.
                  </span>
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-[#F3F5F6]/90 max-w-2xl leading-relaxed font-normal">
                {heroBlock?.subtitle}
              </p>

              <p className="text-sm text-[#F3F5F6]/70 max-w-xl leading-relaxed border-l-2 border-[#FFD71C] pl-4">
                {heroBlock?.body}
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#ffe14f] transition-colors"
                >
                  {isId ? "Jelajahi Katalog Material" : "Explore Materials"}
                </Link>
                <Link
                  href="/contact?tab=sample"
                  className="px-8 py-4 border border-[#02BDEA] bg-[#0B1420]/80 text-[#F3F5F6] font-mono-tech text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#02BDEA] hover:text-[#101C2B] transition-colors"
                >
                  {isId ? "Minta Sampel Gratis" : "Request a Sample"}
                </Link>
              </div>
            </div>

            {/* Right 5 columns: Technical Telemetry Dossier Card */}
            <div className="lg:col-span-5">
              <div className="border border-[#1E324A] bg-[#0B1420]/92 backdrop-blur-md p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E324A] pb-4">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                    {isId
                      ? "ACUAN SPESIFIKASI TARGET QC"
                      : "TARGET QC SPECIFICATION BENCHMARK"}
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#FFD71C] border border-[#FFD71C]/40 px-2 py-0.5">
                    {isId ? "TERVERIFIKASI COA" : "COA VERIFIED"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-5 font-mono-tech">
                  <div className="border-l-2 border-[#02BDEA] pl-3.5">
                    <span className="text-[10px] uppercase text-[#F3F5F6]/60 block">
                      {isId ? "STABILITAS MELT FLOW" : "MELT FLOW STABILITY"}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
                      ~2.17 g/10m
                    </span>
                    <span className="text-[10px] text-[#F3F5F6]/55">
                      {isId
                        ? "Referensi 1 siklus panas (ASTM D1238)"
                        : "Single-heat reference (ASTM D1238)"}
                    </span>
                  </div>

                  <div className="border-l-2 border-[#02BDEA] pl-3.5">
                    <span className="text-[10px] uppercase text-[#F3F5F6]/60 block">
                      {isId ? "KADAR AIR (MOISTURE)" : "MOISTURE CONTENT"}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
                      &lt; 0.05%
                    </span>
                    <span className="text-[10px] text-[#F3F5F6]/55">
                      {isId
                        ? "Karung inner-liner PE kedap"
                        : "Sealed PE inner-liner bag"}
                    </span>
                  </div>

                  <div className="border-l-2 border-[#FFD71C] pl-3.5">
                    <span className="text-[10px] uppercase text-[#F3F5F6]/60 block">
                      {isId ? "FILTRASI LELEHAN" : "MELT FILTRATION"}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
                      100-120 Mesh
                    </span>
                    <span className="text-[10px] text-[#F3F5F6]/55">
                      {isId
                        ? "Proteksi nozzle <100 mikron"
                        : "<100 micron nozzle protection"}
                    </span>
                  </div>

                  <div className="border-l-2 border-[#FFD71C] pl-3.5">
                    <span className="text-[10px] uppercase text-[#F3F5F6]/60 block">
                      {isId ? "BATAS RESIDU ABU" : "ASH RESIDUE LIMIT"}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
                      &lt; 0.15%
                    </span>
                    <span className="text-[10px] text-[#F3F5F6]/55">
                      {isId ? "QC internal ASTM D5630" : "ASTM D5630 internal QC"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E324A] flex items-center justify-between text-[11px] font-mono-tech text-[#F3F5F6]/65">
                  <span>
                    {isId
                      ? "VISUAL MATERIAL ILUSTRATIF"
                      : "ILLUSTRATIVE MATERIAL RENDER"}
                  </span>
                  <Link
                    href="/technology"
                    className="text-[#02BDEA] hover:underline"
                  >
                    {isId ? "LIHAT PROTOKOL LAB" : "VIEW LAB PROTOCOL"} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. BRAND INTRODUCTION (Asymmetric Editorial Narrative)
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-[#F3F5F6] border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-4">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#123A68] block">
                {isId
                  ? "01 | POSISI STRATEGIS INDUSTRI"
                  : "01 | INDUSTRIAL POSITIONING"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B] leading-tight">
                {isId
                  ? "Mitra Polimer Strategis bagi Pabrik Manufaktur Skala Menengah."
                  : "A Strategic Polymer Partner for Medium-Scale Manufacturing."}
              </h2>
              <div className="h-1 w-16 bg-[#101C2B]" />
              <p className="font-mono-tech text-xs text-[#4B5B6E] leading-relaxed pt-2">
                {isId
                  ? "Industri plastik Indonesia mengimpor 50% hingga 60% kebutuhan resin murni (INAPLAS, 2023), sementara bahan baku resin mencakup 60% hingga 70% dari total biaya produksi (PlasticsEurope, 2023)."
                  : "Indonesia's plastics industry imports 50% to 60% of its virgin resin demand (INAPLAS, 2023), while raw resin represents 60% to 70% of total conversion cost (PlasticsEurope, 2023)."}
              </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <p className="font-display text-xl sm:text-2xl text-[#101C2B] leading-relaxed font-medium">
                {isId
                  ? "Produsen kemasan dan peralatan rumah tangga skala menengah terjebak di antara dua kompromi mahal: menyerap fluktuasi harga resin murni impor yang tinggi, atau menggunakan skrap daur ulang tanpa verifikasi yang memicu lonjakan tekanan ekstruder, penyumbatan die-head, dan produk getas."
                  : "Medium-sized packaging and household manufacturers are caught between two costly compromises: absorbing volatile imported virgin resin prices, or running unverified recycled scrap that triggers melt-pressure spikes, die-head clogging, and brittle parts."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#101C2B]/15">
                <div className="space-y-3">
                  <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68] font-semibold">
                    {isId
                      ? "Mengapa Bahan Baku Pasca-Industri Penting"
                      : "Why Post-Industrial Feedstock Matters"}
                  </div>
                  <p className="text-sm text-[#4B5B6E] leading-relaxed">
                    {isId
                      ? "Konversi plastik domestik menghasilkan sekitar 300.000 hingga 600.000 ton sisa potongan produksi internal per tahun (tingkat skrap proses 5% hingga 12%). Karena aliran pasca-industri ini tidak pernah bersentuhan dengan sampah organik kota atau bahan kimia rumah tangga, rantai polimernya tetap bersih dan stabil secara termal."
                      : "Domestic plastic conversion generates an estimated 300,000 to 600,000 tons of internal production offcuts per year (5% to 12% process scrap rate). Because this post-industrial stream has never contacted municipal organic waste or household chemicals, its polymer backbone remains clean and thermally stable."}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68] font-semibold">
                    {isId
                      ? "Disiplin Rekayasa di Atas Skrap Komoditas"
                      : "Engineering Discipline Over Commodity Scrap"}
                  </div>
                  <p className="text-sm text-[#4B5B6E] leading-relaxed">
                    {isId
                      ? "PrimeFlow dibangun sebagai mitra teknologi material industri, bukan sekadar pedagang skrap plastik. Kami memadukan sortir polimer NIR, pencucian alkali panas, degassing vakum tiga tahap, dan validasi Certificate of Analysis (COA) per batch dengan penjadwalan Adaptive Locked-Supply."
                      : "PrimeFlow is structured as an industrial materials technology partner rather than a scrap trader. We combine NIR polymer sorting, hot alkaline washing, triple-stage vacuum degassing, and batch Certificate of Analysis (COA) validation with Adaptive Locked-Supply scheduling."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. PRIMEFLOW VALUE PROPOSITION (Technical Comparison Matrix)
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#123A68]">
                {isId
                  ? "02 | MATRIKS KOMPARASI MATERIAL"
                  : "02 | COMPARATIVE MATERIAL BENCHMARK"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B]">
                {isId
                  ? "Menjembatani Kesenjangan Antara Resin Murni Impor dan Skrap Konvensional."
                  : "Bridging the Gap Between Imported Virgin Resin and Conventional Scrap."}
              </h2>
            </div>
            <p className="text-xs font-mono-tech text-[#4B5B6E] max-w-md">
              {isId
                ? "Berdasarkan analisis rekayasa komparatif Proposal Bisnis PrimeFlow Bagian 2.1 & Bagian 2.4."
                : "Grounded in PrimeFlow Business Proposal Section 2.1 & Section 2.4 comparative engineering analysis."}
            </p>
          </div>

          {/* 8-Row Engineering Comparison Table */}
          <div className="overflow-x-auto border border-[#101C2B]">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#101C2B] text-[#F3F5F6] font-mono-tech text-xs uppercase tracking-wider">
                  <th className="p-4 sm:p-5 border-r border-[#1E324A] w-[28%]">
                    {isId ? "Parameter Evaluasi" : "Evaluation Parameter"}
                  </th>
                  <th className="p-4 sm:p-5 border-r border-[#1E324A] w-[24%] text-[#F3F5F6]/75">
                    {isId ? "Resin Murni (Virgin) Impor" : "Imported Virgin Resin"}
                  </th>
                  <th className="p-4 sm:p-5 border-r border-[#1E324A] w-[26%] bg-[#123A68] text-[#FFD71C]">
                    PrimeFlow Near-Virgin PP / PE
                  </th>
                  <th className="p-4 sm:p-5 w-[22%] text-[#F3F5F6]/75">
                    {isId ? "Skrap Daur Ulang Konvensional" : "Conventional Recycled Scrap"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101C2B]/15 text-sm">
                {comparisonRows.map((row) => (
                  <tr key={row.param} className="hover:bg-[#F3F5F6]/60">
                    <td className="p-4 sm:p-5 font-display font-semibold text-[#101C2B] border-r border-[#101C2B]/15">
                      {row.param}
                    </td>
                    <td className="p-4 sm:p-5 text-[#4B5B6E] border-r border-[#101C2B]/15">
                      {row.virgin}
                    </td>
                    <td className="p-4 sm:p-5 bg-[#101C2B]/[0.03] font-medium text-[#101C2B] border-r border-[#101C2B]/15">
                      <span className="inline-block h-2 w-2 bg-[#02BDEA] mr-2" />
                      {row.primeflow}
                    </td>
                    <td className="p-4 sm:p-5 text-[#4B5B6E]">{row.scrap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs font-mono-tech text-[#4B5B6E]">
            {isId
              ? "*Kualifikasi: Estimasi penghematan biaya hingga 30% dan penurunan GRK bergantung pada indeks pasar resin murni, rasio substitusi grade, serta validasi aplikasi. Material PrimeFlow bersifat non-food-grade dan bukan setara resin murni bersertifikat."
              : "*Qualification: Cost savings up to 30% and GHG reduction estimates depend on virgin market index, grade substitution ratio, and application validation. PrimeFlow materials are non-food-grade and are not equivalent to certified virgin resin."}
          </p>
        </div>
      </section>

      {/* =====================================================================
          4. PRODUCT COLLECTION (Technical Materials Showcase)
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1E324A] pb-8">
            <div className="space-y-3">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
                {isId
                  ? "03 | KOLEKSI GRADE POLIMER"
                  : "03 | POLYMER GRADE COLLECTION"}
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
                {isId
                  ? "Keluarga Material PP & PE Terformulasi."
                  : "Engineered PP & PE Material Families."}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono-tech text-xs text-[#F3F5F6]/70">
                {isId
                  ? "4 GRADE PROTOTIPE AKTIF DI CMS"
                  : "4 ACTIVE PROTOTYPE GRADES IN CMS"}
              </span>
              <Link
                href="/products"
                className="px-6 py-3 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-wider hover:bg-[#ffe14f]"
              >
                {isId ? "Buka Katalog Material Lengkap" : "Open Full Materials Library"}{" "}
                &rarr;
              </Link>
            </div>
          </div>

          {/* Horizontal asymmetric material showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="border border-[#1E324A] bg-[#0B1420] flex flex-col justify-between group hover:border-[#02BDEA] transition-colors"
              >
                <div>
                  <div className="px-5 py-3 border-b border-[#1E324A] flex items-center justify-between font-mono-tech text-xs">
                    <span className="text-[#FFD71C] font-semibold">
                      0{idx + 1} : {product.grade_code}
                    </span>
                    <span className="text-[#02BDEA]">
                      {product.polymer_family}
                    </span>
                  </div>

                  <div className="relative h-56 bg-[#101C2B] overflow-hidden border-b border-[#1E324A]">
                    <Image
                      src={product.primary_image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#0B1420]/85 px-2.5 py-1 font-mono-tech text-[10px] text-[#F3F5F6]/75">
                      {isId
                        ? "Visual Material Ilustratif"
                        : "Illustrative Material Visual"}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <h3 className="font-display text-lg font-bold text-white leading-snug">
                      <Link
                        href={`/products/${product.slug}`}
                        className="hover:text-[#02BDEA] transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#F3F5F6]/70 leading-relaxed line-clamp-3">
                      {product.short_description}
                    </p>

                    <div className="pt-3 border-t border-[#1E324A] space-y-1.5 font-mono-tech text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[#F3F5F6]/55">
                          {isId ? "KADAR AIR:" : "MOISTURE:"}
                        </span>
                        <span className="text-white">
                          {product.moisture_content}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#F3F5F6]/55">
                          {isId ? "FILTRASI:" : "FILTRATION:"}
                        </span>
                        <span className="text-white">100-120 mesh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#F3F5F6]/55">
                          {isId ? "BATAS ABU:" : "ASH LIMIT:"}
                        </span>
                        <span className="text-white">
                          {product.ash_content}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block w-full text-center py-2.5 border border-[#1E324A] group-hover:border-[#02BDEA] group-hover:bg-[#02BDEA] group-hover:text-[#101C2B] font-mono-tech text-xs uppercase tracking-wider transition-colors"
                  >
                    {isId ? "Periksa Spesifikasi Grade" : "Inspect Grade Spec"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. QUALITY AND ENGINEERING (COA & Packaging Prototype Showcase)
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-[#F3F5F6] border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 7 cols: Engineering QA & QR Digital Passport */}
            <div className="lg:col-span-7 space-y-6">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#123A68]">
                {isId
                  ? "04 | JAMINAN MUTU & PASPOR PRODUK DIGITAL"
                  : "04 | QUALITY ASSURANCE & DIGITAL PRODUCT PASSPORT"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B] leading-tight">
                {isId
                  ? "Setiap Batch Diverifikasi oleh Analisis Laboratorium Internal & COA Berkode QR."
                  : "Every Batch Verified by Internal Laboratory Analysis & QR-Coded COA."}
              </h2>
              <p className="text-base text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "PrimeFlow menghilangkan ketidakpastian dalam pengadaan resin daur ulang. Sebelum dikemas, setiap lot dievaluasi melalui enam titik pemeriksaan mutu kritis untuk memastikan viskositas lelehan, kadar volatil, dan kekuatan mekanis aman bagi mesin cetak Anda."
                  : "PrimeFlow eliminates the guesswork of recycled resin purchasing. Prior to bagging, each lot is evaluated across six critical quality checkpoints to verify that melt viscosity, volatile levels, and mechanical strength remain safe for your molding machines."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {(isId
                  ? [
                      {
                        code: "QC-01",
                        title: "ASTM D1238 Melt Flow Index",
                        desc: "Memastikan viskositas lelehan konsisten guna mencegah short shot, flashing, atau ketebalan film tidak rata.",
                      },
                      {
                        code: "QC-02",
                        title: "Kadar Air Halogen < 0.05%",
                        desc: "Mengeliminasi cacat uap (splay marks), garis perak (silver streaking), dan rongga mikro saat ekstrusi.",
                      },
                      {
                        code: "QC-03",
                        title: "ASTM D5630 Kadar Abu < 0.15%",
                        desc: "Memverifikasi rendahnya residu mineral dan filler anorganik pada setiap batch yang diproses.",
                      },
                      {
                        code: "QC-04",
                        title: "ISO 527 / ISO 179 & Penyusutan",
                        desc: "Memvalidasi kekuatan tarik, ketahanan impak, serta akurasi dimensi penyusutan cetakan (mold shrinkage).",
                      },
                    ]
                  : [
                      {
                        code: "QC-01",
                        title: "ASTM D1238 Melt Flow Index",
                        desc: "Ensures consistent melt viscosity to prevent short shots, flashing, or uneven film thickness.",
                      },
                      {
                        code: "QC-02",
                        title: "Halogen Moisture < 0.05%",
                        desc: "Eliminates steam splay marks, silver streaking, and micro-voids during extrusion.",
                      },
                      {
                        code: "QC-03",
                        title: "ASTM D5630 Ash Content < 0.15%",
                        desc: "Verifies low inorganic filler and mineral residue across every processed batch.",
                      },
                      {
                        code: "QC-04",
                        title: "ISO 527 / ISO 179 & Shrinkage",
                        desc: "Validates tensile strength, impact resistance, and dimensional mold shrinkage accuracy.",
                      },
                    ]
                ).map((item) => (
                  <div
                    key={item.code}
                    className="border border-[#101C2B]/15 bg-white p-5 space-y-2"
                  >
                    <div className="font-mono-tech text-xs font-semibold text-[#123A68]">
                      {item.code} : {item.title}
                    </div>
                    <p className="text-xs text-[#4B5B6E] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Official Prototype 25 kg Packaging Display */}
            <div className="lg:col-span-5">
              <div className="border border-[#101C2B] bg-[#101C2B] text-[#F3F5F6] p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E324A] pb-3">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-[#FFD71C]">
                    {isId
                      ? "KEMASAN PROTOTIPE RESMI"
                      : "OFFICIAL PROTOTYPE PACKAGING"}
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#02BDEA]">
                    25 KG WOVEN PP + PE LINER
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center bg-[#0B1420] p-6 border border-[#1E324A]">
                  <div className="relative h-56 w-full">
                    <Image
                      src="/images/materials/sack-pp-100.png"
                      alt="PrimeFlow PP 100 25 kg prototype sack Lot PF-11223"
                      fill
                      sizes="240px"
                      className="object-contain"
                    />
                  </div>
                  <div className="relative h-56 w-full">
                    <Image
                      src="/images/materials/sack-pe-100.png"
                      alt="PrimeFlow Polyethylene 25 kg prototype sack Lot PF-12345"
                      fill
                      sizes="240px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#F3F5F6]/80 font-mono-tech">
                  <div>LOT PF-11223 (PP 100) &amp; LOT PF-12345 (PE / HDPE 100)</div>
                  <p className="text-[#F3F5F6]/65 font-sans leading-relaxed">
                    {isId
                      ? "Karung woven polipropilena 25 kg berlapis inner-liner kedap dan jumbo bag 500 hingga 1.000 kg menjaga kekeringan resin (kadar air <0.05%) di gudang pabrik beriklim tropis."
                      : "Hermetically lined 25 kg woven polypropylene sacks and 500 to 1,000 kg jumbo bags protect resin dryness (<0.05% moisture) in humid tropical factory warehouses."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. PROCESSING TECHNOLOGY (9-Stage Technical Architecture)
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-industrial-grid-dark text-[#F3F5F6] border-b border-[#1E324A]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
                {isId
                  ? "05 | ARSITEKTUR PEMURNIAN & KOMPON 9-TAHAP"
                  : "05 | 9-STAGE PURIFICATION & COMPOUNDING ARCHITECTURE"}
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
                {isId
                  ? "Dirancang untuk Melindungi Ekstruder, Hot Runner, dan Cetakan Anda."
                  : "Engineered to Protect Your Extruders, Hot Runners, and Molds."}
              </h2>
            </div>
            <Link
              href="/technology"
              className="font-mono-tech text-xs uppercase tracking-widest px-6 py-3.5 border border-[#02BDEA] text-[#02BDEA] hover:bg-[#02BDEA] hover:text-[#101C2B] transition-colors shrink-0"
            >
              {isId ? "Periksa Alur Proses Lengkap" : "Inspect Full Process Narrative"}{" "}
              &rarr;
            </Link>
          </div>

          {/* 9-step engineering schematic grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#1E324A]">
            {stages.map((stage) => (
              <div
                key={stage.step}
                className="border-r border-b border-[#1E324A] bg-[#0B1420]/85 p-6 sm:p-7 space-y-3 hover:bg-[#101C2B] transition-colors"
              >
                <div className="flex items-center justify-between font-mono-tech">
                  <span className="text-2xl font-bold text-[#FFD71C]">
                    {stage.step}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#02BDEA] border border-[#02BDEA]/30 px-2.5 py-0.5">
                    {stage.spec}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {stage.name}
                </h3>
                <p className="text-xs text-[#F3F5F6]/70 leading-relaxed">
                  {stage.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. INDUSTRIAL APPLICATIONS (Non-Food Conversion Sectors)
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#123A68]">
                {isId
                  ? "06 | TARGET APLIKASI MANUFAKTUR"
                  : "06 | TARGET MANUFACTURING APPLICATIONS"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B]">
                {isId
                  ? "Dibuat untuk Lini Injection, Blow Molding, dan Ekstrusi Film Non-Pangan."
                  : "Built for Non-Food Injection, Blow Molding, and Film Extrusion Lines."}
              </h2>
            </div>
            <span className="font-mono-tech text-xs text-[#4B5B6E] border border-[#101C2B]/20 px-3.5 py-2 bg-[#F3F5F6]">
              {isId
                ? "KHUSUS APLIKASI INDUSTRI & RUMAH TANGGA NON-FOOD-GRADE"
                : "NON-FOOD-GRADE INDUSTRIAL & HOUSEHOLD APPLICATIONS ONLY"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app) => (
              <div
                key={app.code}
                className="border border-[#101C2B]/15 bg-[#F3F5F6]/50 p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono-tech text-xs">
                    <span className="text-[#123A68] font-semibold">
                      {app.code}
                    </span>
                    <span className="bg-[#101C2B] text-[#FFD71C] px-2.5 py-0.5 text-[11px]">
                      {app.grades}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#101C2B]">
                    {app.sector}
                  </h3>
                  <ul className="space-y-2 text-xs text-[#4B5B6E]">
                    {app.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span className="text-[#02BDEA] font-bold mt-0.5">
                          +
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/products"
                  className="font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] hover:text-[#123A68] pt-4 border-t border-[#101C2B]/10 flex items-center justify-between"
                >
                  <span>{isId ? "Cocokkan Grade" : "Match Grade"}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. B2B SUPPLY SOLUTIONS (Adaptive Supply, Toll-Recycling, Sample Trial)
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-[#F3F5F6] border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#123A68]">
                {isId
                  ? "07 | ARSITEKTUR KOMERSIAL & RANTAI PASOK"
                  : "07 | COMMERCIAL & SUPPLY CHAIN ARCHITECTURE"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B]">
                {isId
                  ? "Model Pasokan yang Dirancang Mengikuti Arus Kas dan Kapasitas Gudang Pabrik."
                  : "Supply Models Engineered Around Factory Cash Flow and Warehouse Space."}
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                href="/solutions"
                className="inline-block px-6 py-3.5 bg-[#101C2B] text-white font-mono-tech text-xs uppercase tracking-wider hover:bg-[#123A68]"
              >
                {isId
                  ? "Jelajahi 7 Solusi B2B Lengkap"
                  : "Explore All 7 B2B Solutions"}{" "}
                &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="border-t-4 border-[#101C2B] bg-white p-8 space-y-4 border-x border-b border-x-[#101C2B]/15 border-b-[#101C2B]/15">
              <div className="font-mono-tech text-xs text-[#123A68]">
                {isId
                  ? "SOLUSI 01 | LIKUIDITAS MODAL KERJA"
                  : "SOLUTION 01 | WORKING CAPITAL LIQUIDITY"}
              </div>
              <h3 className="font-display text-2xl font-bold text-[#101C2B]">
                {isId
                  ? "Adaptive Locked-Supply & Pengiriman Bertahap"
                  : "Adaptive Locked-Supply & Staggered Delivery"}
              </h3>
              <p className="text-sm text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Kunci kuota alokasi resin bulanan yang terjamin dengan klausul harga proporsional, sambil menerima pengiriman bertahap mingguan atau dua mingguan yang disesuaikan dengan kapasitas fisik gudang dan siklus arus kas Anda."
                  : "Lock in guaranteed monthly resin allocations with proportional oil-indexed pricing clauses, while receiving staggered weekly or bi-weekly dispatches matched to your physical warehouse capacity and cash-flow cycle."}
              </p>
              <div className="pt-2">
                <Link
                  href="/contact?type=ADAPTIVE_SUPPLY"
                  className="font-mono-tech text-xs font-semibold uppercase tracking-wider text-[#123A68] hover:underline"
                >
                  {isId ? "Atur Jadwal Pasokan" : "Structure Supply Schedule"} &rarr;
                </Link>
              </div>
            </div>

            <div className="border-t-4 border-[#02BDEA] bg-white p-8 space-y-4 border-x border-b border-x-[#101C2B]/15 border-b-[#101C2B]/15">
              <div className="font-mono-tech text-xs text-[#123A68]">
                {isId
                  ? "SOLUSI 02 | KEMANDIRIAN SIRKULAR"
                  : "SOLUTION 02 | CIRCULAR SELF-RELIANCE"}
              </div>
              <h3 className="font-display text-2xl font-bold text-[#101C2B]">
                Closed-Loop Toll-Recycling (Maklon Sirkular)
              </h3>
              <p className="text-sm text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Kirimkan sisa sprue, runner, dan produk rijek internal pabrik Anda yang bersih ke PrimeFlow. Kami murnikan, cuci alkali panas, degas, saring (100 hingga 120 mesh), stabilkan kembali dengan antioksidan, dan kembalikan sebagai pelet bersertifikat siap cetak."
                  : "Send your clean internal sprues, runners, and off-spec parts to PrimeFlow. We purify, alkaline-wash, degas, filter (100 to 120 mesh), re-stabilize with antioxidants, and return certified pellets ready for your production line."}
              </p>
              <div className="pt-2">
                <Link
                  href="/contact?type=TOLL_RECYCLING"
                  className="font-mono-tech text-xs font-semibold uppercase tracking-wider text-[#123A68] hover:underline"
                >
                  {isId ? "Tanyakan Program Maklon" : "Inquire Toll-Recycling"} &rarr;
                </Link>
              </div>
            </div>

            <div className="border-t-4 border-[#FFD71C] bg-white p-8 space-y-4 border-x border-b border-x-[#101C2B]/15 border-b-[#101C2B]/15">
              <div className="font-mono-tech text-xs text-[#123A68]">
                {isId
                  ? "SOLUSI 03 | VALIDASI TANPA RISIKO"
                  : "SOLUTION 03 | ZERO-RISK VALIDATION"}
              </div>
              <h3 className="font-display text-2xl font-bold text-[#101C2B]">
                {isId
                  ? "Sampel Gratis 5-10 kg & Pendampingan Teknisi"
                  : "5-10 kg Complimentary Trial & On-Site Technician"}
              </h3>
              <p className="text-sm text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Uji langsung pelet PrimeFlow pada mesin cetak Anda sebelum menandatangani kontrak pasokan. Kami mengirimkan kit sampel gratis 5 hingga 10 kg beserta COA batch dan opsi pendampingan teknisi di pabrik."
                  : "Evaluate PrimeFlow pellets on your own molding machine before signing a supply contract. We dispatch a complimentary 5 to 10 kg sample kit with batch COA and optional on-site technician support."}
              </p>
              <div className="pt-2">
                <Link
                  href="/contact?tab=sample"
                  className="font-mono-tech text-xs font-semibold uppercase tracking-wider text-[#123A68] hover:underline"
                >
                  {isId ? "Minta Kit Uji Coba" : "Request Trial Kit"} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. MATERIAL SAVINGS CALCULATOR (Interactive HPP Simulator)
      ====================================================================== */}
      <section
        id="calculator"
        className="py-20 lg:py-28 bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] scroll-mt-20"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
              {isId
                ? "08 | SIMULATOR PENGHEMATAN HPP PENGADAAN"
                : "08 | HPP PROCUREMENT SAVINGS SIMULATOR"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
              {isId
                ? "Simulasikan Penghematan Biaya Resin Bulanan & Tahunan Anda."
                : "Simulate Your Monthly & Annual Resin Cost Reduction."}
            </h2>
            <p className="text-sm text-[#F3F5F6]/75 leading-relaxed">
              {isId
                ? "Modelkan dampak finansial dari substitusi resin murni PP atau PE impor dengan resin pasca-industri PrimeFlow. Anda dapat mengirim hasil kalkulasi langsung ke tim rekayasa komersial kami untuk mendapatkan penawaran sesuai grade."
                : "Model the financial impact of substituting imported virgin PP or PE with PrimeFlow post-industrial resin. You can submit your calculation directly to our commercial engineering team for a grade-matched quotation."}
            </p>
          </div>

          <MaterialSavingsCalculator />
        </div>
      </section>

      {/* =====================================================================
          10. CIRCULAR ECONOMY & SUSTAINABILITY
      ====================================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#123A68]">
                {isId
                  ? "09 | SIRKULARITAS INDUSTRI & KESELARASAN SDG"
                  : "09 | INDUSTRIAL CIRCULARITY & SDG ALIGNMENT"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B] leading-tight">
                {isId
                  ? "Manufaktur Sirkular Terukur Tanpa Mengorbankan Kekuatan Produk."
                  : "Measurable Circular Manufacturing Without Compromising Part Integrity."}
              </h2>
              <p className="text-sm text-[#4B5B6E] leading-relaxed">
                {isId
                  ? "Indonesia menghasilkan 10,59 juta ton timbulan sampah plastik per tahun (KLHK, 2023), dengan tingkat daur ulang nasional baru mencapai 22% (SWI & IPR, 2024) dan daur ulang film fleksibel di bawah 10% (NPAP, 2020). PrimeFlow mencegah poliolefin pasca-industri bernilai tinggi berakhir di TPA atau mengalami penurunan mutu (downcycling)."
                  : "Indonesia generates 10.59 million tons of plastic waste annually (KLHK, 2023), with overall recycling rates at 22% (SWI & IPR, 2024) and flexible film recycling below 10% (NPAP, 2020). PrimeFlow prevents high-value post-industrial polyolefins from being downcycled or landfilled."}
              </p>
              <div className="pt-2">
                <Link
                  href="/sustainability"
                  className="inline-block px-6 py-3.5 border border-[#101C2B] text-[#101C2B] font-mono-tech text-xs uppercase tracking-wider hover:bg-[#101C2B] hover:text-white transition-colors"
                >
                  {isId
                    ? "Baca Kerangka Keberlanjutan"
                    : "Read Sustainability Framework"}{" "}
                  &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="border border-[#101C2B]/15 bg-[#F3F5F6] p-6 space-y-3">
                <span className="font-mono-tech text-xs font-bold px-2.5 py-1 bg-[#101C2B] text-[#FFD71C] inline-block">
                  SDG 09
                </span>
                <h3 className="font-display text-lg font-bold text-[#101C2B]">
                  {isId
                    ? "Industri, Inovasi & Infrastruktur"
                    : "Industry, Innovation & Infrastructure"}
                </h3>
                <p className="text-xs text-[#4B5B6E] leading-relaxed">
                  {isId
                    ? "Meningkatkan infrastruktur pemulihan polimer domestik melalui sortir NIR, pencucian alkali panas, degassing vakum, dan filtrasi lelehan 100-120 mesh."
                    : "Upgrading domestic polymer recovery through NIR sorting, hot alkaline washing, vacuum degassing, and 100-120 mesh melt filtration."}
                </p>
              </div>

              <div className="border border-[#101C2B]/15 bg-[#F3F5F6] p-6 space-y-3">
                <span className="font-mono-tech text-xs font-bold px-2.5 py-1 bg-[#101C2B] text-[#02BDEA] inline-block">
                  SDG 12
                </span>
                <h3 className="font-display text-lg font-bold text-[#101C2B]">
                  {isId
                    ? "Konsumsi & Produksi Bertanggung Jawab"
                    : "Responsible Consumption & Production"}
                </h3>
                <p className="text-xs text-[#4B5B6E] leading-relaxed">
                  {isId
                    ? "Menyerap sisa potongan pabrik pasca-industri bersih (5% hingga 12% skrap konversi) melalui maklon sirkular tertutup guna mendukung target zero-waste-to-landfill."
                    : "Reclaiming clean post-industrial factory offcuts (5% to 12% conversion scrap) via closed-loop toll-recycling to support zero-waste-to-landfill goals."}
                </p>
              </div>

              <div className="border border-[#101C2B]/15 bg-[#F3F5F6] p-6 space-y-3">
                <span className="font-mono-tech text-xs font-bold px-2.5 py-1 bg-[#123A68] text-white inline-block">
                  SDG 13
                </span>
                <h3 className="font-display text-lg font-bold text-[#101C2B]">
                  {isId
                    ? "Penanganan Perubahan Iklim & ESG"
                    : "Climate Action & ESG Documentation"}
                </h3>
                <p className="text-xs text-[#4B5B6E] leading-relaxed">
                  {isId
                    ? "Substitusi resin petrokimia murni dengan poliolefin daur ulang dapat menurunkan intensitas emisi GRK bahan baku hingga 60% (acuan literatur; laporan ESG klien dijadwalkan pada Roadmap Fase 3)."
                    : "Substituting virgin petrochemical resin with recycled polyolefins can reduce raw-material GHG intensity by up to 60% (literature benchmark; client ESG reporting planned in Roadmap Phase 3)."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          11. FINAL INQUIRY CTA
      ====================================================================== */}
      <section className="py-20 lg:py-24 bg-[#123A68] text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#FFD71C]">
              {isId
                ? "10 | PENGIRIMAN TEKNIS & KOMERSIAL"
                : "10 | TECHNICAL & COMMERCIAL DISPATCH"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
              {isId
                ? "Validasi Pelet PrimeFlow Langsung di Lini Mesin Anda."
                : "Validate PrimeFlow Pellets on Your Molding Line."}
            </h2>
            <p className="text-base text-white/85 leading-relaxed">
              {isId
                ? "Minta kit sampel gratis 5 hingga 10 kg beserta Certificate of Analysis (COA) batch, atau jadwalkan konsultasi Adaptive Locked-Supply bersama tim kami."
                : "Request a complimentary 5 to 10 kg sample kit with batch Certificate of Analysis (COA), or schedule an Adaptive Locked-Supply consultation with our team."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/contact?tab=sample"
              className="px-8 py-4 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest text-center hover:bg-[#ffe14f] transition-colors"
            >
              {isId ? "Minta Sampel 5-10 kg" : "Request 5-10 kg Sample Kit"}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white text-white font-mono-tech text-xs font-semibold uppercase tracking-widest text-center hover:bg-white hover:text-[#101C2B] transition-colors"
            >
              {isId ? "Ajukan RFQ Resmi" : "Submit Official RFQ"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
