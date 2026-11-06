import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerLocale } from "@/lib/i18n/locale-server";

export const metadata: Metadata = {
  title: "Processing Technology | 9-Stage Purification & QC Architecture",
  description:
    "Explore PrimeFlow's 9-stage post-industrial polyolefin purification workflow: NIR sorting, 70-80C alkaline washing, additive dosing, 100-120 mesh filtration, triple-stage vacuum degassing, and COA validation.",
};

const NINE_STAGES_EN = [
  {
    number: "01",
    title: "Raw Material Selection",
    checkpoint: "CHECKPOINT 01 | SINGLE-HEAT FEEDSTOCK CURATION",
    operationalStatus: "Operational Protocol (Direct Factory Scrap Sourcing)",
    parameters: [
      "Origin: Post-industrial conversion sprues, runners, edge trim, and start-up purge",
      "Heat History: Single-heat-history stream (~2.17 g/10 min reference MFI stability)",
      "Manifest Audit: Supplier batch traceability and conversion process log",
    ],
    engineeringDetail:
      "Unlike post-consumer municipal waste, post-industrial conversion scrap has never contacted organic food waste, detergents, or household chemicals (BPOM, 2019). By sourcing directly from partner factories, PrimeFlow preserves macromolecular chain length and eliminates biological odor precursors at the gate.",
  },
  {
    number: "02",
    title: "Material Sorting & NIR Spectroscopy",
    checkpoint: "CHECKPOINT MUTU 1 | ZERO-TOLERANCE PVC REJECTION (< 0.1%)",
    operationalStatus: "Operational Protocol (NIR & Base-Color Segregation)",
    parameters: [
      "Identification: Handheld Near-Infrared (NIR) polymer spectroscopy",
      "Critical Rejection: PVC cross-contamination strictly capped below 0.1%",
      "Homogeneous Grouping: Segregated by conversion family (Injection / Blow / Film) and base color",
    ],
    engineeringDetail:
      "Trace PVC degrades at polyolefin extrusion temperatures, releasing hydrochloric acid (HCl) gas that corrodes nitrided extruder barrels and pits mold cavities. Any incoming lot exceeding 0.1% PVC is rejected prior to granulation.",
  },
  {
    number: "03",
    title: "Precision Hot Alkaline Washing",
    checkpoint: "CHECKPOINT MUTU 2 & 3 | 70-80 C WASH & < 0.05% DRYING",
    operationalStatus: "Phase 1 Modular Processing & Moisture Verification",
    parameters: [
      "Pre-Screening: Metal detector screening and wet size-reduction granulation",
      "Thermal Wash: Multi-stage 70 to 80 C hot water with mild alkali and specialized surfactants",
      "Separation & Drying: Friction washing, sink-float density tanks, centrifugal + thermal drying (<0.05% moisture)",
    ],
    engineeringDetail:
      "Elevated temperature alkaline washing dissolves stubborn surface oils, mold release agents, and label adhesives without initiating thermo-oxidative chain scission. Centrifugal and desiccant/hot-air drying brings flake moisture below 0.05% as verified by halogen moisture analysis.",
  },
  {
    number: "04",
    title: "Additive Formulation",
    checkpoint: "CHECKPOINT MUTU 4 | RHEOLOGY & THERMAL STABILIZATION",
    operationalStatus: "Engineered Formulation Protocol per Grade",
    parameters: [
      "Antioxidant Package: 0.1% to 0.3% primary and secondary antioxidants",
      "Rheology Modifier: Controlled organic peroxide via loss-in-weight feeder (for PP MFI tuning)",
      "Aesthetic & Sensory: Measured optical brighteners and active odor neutralizers",
    ],
    engineeringDetail:
      "To prevent chain degradation when the resin is re-melted in the customer's plant, PrimeFlow compounds a calibrated stabilizer package. Loss-in-weight dosing ensures uniform dispersion and aligns Melt Flow Index (MFI) with the client's target tooling window.",
  },
  {
    number: "05",
    title: "Extrusion & Micro-Filtration",
    checkpoint: "CHECKPOINT MUTU 5A | 100 - 120 MESH (< 100 MICRON) SCREENING",
    operationalStatus: "Phase 1 Toll-Extrusion Line -> Phase 2 In-House Extruder (Year 3)",
    parameters: [
      "Extruder Architecture: High-durability single-screw compounding line",
      "Filtration Rating: Automatic / dual screen changer at 100 to 120 mesh (< 100 micron)",
      "Telemetry: Continuous barrel zone temperature and melt pressure monitoring",
    ],
    engineeringDetail:
      "Unmelted gel particles, carbonized pigment specks, and micro-fibers are the primary cause of clogged hot-runner gates and torn blown films. Fine filtration below 100 microns traps micro-contaminants before the melt reaches the die head.",
  },
  {
    number: "06",
    title: "Triple-Stage Vacuum Degassing",
    checkpoint: "CHECKPOINT MUTU 5B | VOLATILE & STEAM EXTRACTION",
    operationalStatus: "Process Design Standard",
    parameters: [
      "Degassing Architecture: Triple-stage vacuum extraction zones along the barrel",
      "Target Volatiles: Removal of residual VOCs, decomposition gases, and trapped steam",
      "Structural Benefit: Prevents internal pellet porosity, micro-voids, and surface blistering",
    ],
    engineeringDetail:
      "Even trace volatiles cause gas bubbles, splay marks, and uneven film thickness during high-speed conversion. Triple-stage vacuum degassing physically strips volatile compounds from the molten polymer stream.",
  },
  {
    number: "07",
    title: "Pelletization & Vibrating Classification",
    checkpoint: "GEOMETRY CONTROL | UNIFORM HOPPER FEEDING",
    operationalStatus: "Process Design Standard",
    parameters: [
      "Cutting System: Precision water-ring / die-face or strand pelletizing cutter",
      "Drying: Post-cut centrifugal dewatering",
      "Classification: Vibrating sieve removes fine dust powder and oversized fused pellets",
    ],
    engineeringDetail:
      "Consistent cylindrical or lenticular pellet geometry prevents bridging in the customer's hopper throat and ensures uniform plastication along the screw feed zone.",
  },
  {
    number: "08",
    title: "Controlled-Atmosphere Packaging",
    checkpoint: "STAGE 07 PACKAGING | HERMETIC MOISTURE BARRIER",
    operationalStatus: "Prototype Validated (25 kg Woven PP + PE Inner Liner)",
    parameters: [
      "Standard Unit: 25 kg woven polypropylene sack with sealed PE inner liner",
      "Bulk Option: 500 to 1,000 kg FIBC jumbo bag for high-volume contracts",
      "Storage Protection: Maintains < 0.05% moisture threshold against ambient warehouse humidity",
    ],
    engineeringDetail:
      "Every sack is labeled with polymer type, grade code (e.g., PP 100 Lot PF-11223, HDPE 100 Lot PF-12345), net weight, storage instructions, and a batch QR code.",
  },
  {
    number: "09",
    title: "Laboratory Quality Control & QR COA",
    checkpoint: "CHECKPOINT MUTU 6 | 6-PARAMETER DIGITAL PRODUCT PASSPORT",
    operationalStatus: "Internal QC Laboratory Verification Protocol",
    parameters: [
      "Rheology & Purity: ASTM D1238 (MFI), ASTM D5630 (Ash < 0.15%), Moisture Analyzer (< 0.05%)",
      "Mechanical & Tooling: ISO 527 (Tensile), ISO 179 (Impact), and Internal Mold Shrinkage Test",
      "Transparency: Batch Certificate of Analysis (COA) published via scannable QR code",
    ],
    engineeringDetail:
      "No production lot is cleared for commercial dispatch without passing final laboratory verification. Customers can inspect the exact MFI, moisture, ash, and shrinkage values of their lot before loading the hopper.",
  },
];

const NINE_STAGES_ID = [
  {
    number: "01",
    title: "Seleksi Bahan Baku",
    checkpoint: "CHECKPOINT 01 | KURASI BAHAN BAKU SATU SIKLUS PANAS",
    operationalStatus: "Protokol Operasional (Serapan Langsung Sisa Pabrik)",
    parameters: [
      "Asal Bahan: Sprue, runner, potongan tepi (edge trim), dan purge awal pasca-industri",
      "Riwayat Panas: Aliran satu riwayat panas (referensi stabilitas MFI ~2.17 g/10 mnt)",
      "Audit Manifes: Ketertelusuran batch pemasok dan catatan proses konversi asal",
    ],
    engineeringDetail:
      "Berbeda dari sampah kota pasca-konsumsi, sisa konversi pasca-industri tidak pernah bersentuhan dengan limbah makanan organik, deterjen, atau bahan kimia rumah tangga (BPOM, 2019). Dengan menyerap langsung dari pabrik mitra, PrimeFlow menjaga panjang rantai makromolekul dan mengeliminasi pemicu bau biologis sejak awal.",
  },
  {
    number: "02",
    title: "Sortir Material & Spektroskopi NIR",
    checkpoint: "CHECKPOINT MUTU 1 | PENOLAKAN PVC TOLERANSI-NOL (< 0.1%)",
    operationalStatus: "Protokol Operasional (Pemisahan NIR & Warna Dasar)",
    parameters: [
      "Identifikasi: Spektroskopi polimer Near-Infrared (NIR) genggam",
      "Penolakan Kritis: Kontaminasi silang PVC dibatasi ketat di bawah 0.1%",
      "Pengelompokan Homogen: Dipisahkan menurut keluarga konversi (Injeksi / Blow / Film) dan warna dasar",
    ],
    engineeringDetail:
      "Jejak PVC terdegradasi pada suhu ekstrusi poliolefin, melepaskan gas asam klorida (HCl) yang mengkorosi barrel ekstruder berlapis nitrida dan merusak rongga cetakan. Setiap lot masuk yang melebihi 0.1% PVC langsung ditolak sebelum pencacahan.",
  },
  {
    number: "03",
    title: "Pencucian Alkali Panas Presisi",
    checkpoint: "CHECKPOINT MUTU 2 & 3 | CUCI 70-80 C & PENGERINGAN < 0.05%",
    operationalStatus: "Pemrosesan Modular Fase 1 & Verifikasi Kadar Air",
    parameters: [
      "Pra-Skrining: Detektor logam dan pencacahan basah (wet granulation)",
      "Cuci Termal: Air panas bertingkat 70 hingga 80 C dengan alkali ringan dan surfaktan khusus",
      "Pemisahan & Pengeringan: Friction washer, tangki densitas sink-float, pengeringan sentrifugal + termal (kadar air <0.05%)",
    ],
    engineeringDetail:
      "Pencucian alkali bersuhu tinggi melarutkan sisa oli permukaan, mold release agent, dan lem label tanpa memicu pemutusan rantai termo-oksidatif. Pengeringan sentrifugal dan udara panas menurunkan kadar air serpihan di bawah 0.05% yang diverifikasi dengan halogen moisture analyzer.",
  },
  {
    number: "04",
    title: "Formulasi Aditif",
    checkpoint: "CHECKPOINT MUTU 4 | STABILISASI REOLOGI & TERMAL",
    operationalStatus: "Protokol Formulasi Terukur per Grade",
    parameters: [
      "Paket Antioksidan: 0.1% hingga 0.3% antioksidan primer dan sekunder",
      "Pengatur Reologi: Peroksida organik terkontrol via loss-in-weight feeder (untuk kalibrasi MFI PP)",
      "Estetika & Sensori: Pencerah optik terukur dan penetral bau aktif",
    ],
    engineeringDetail:
      "Untuk mencegah degradasi rantai saat resin dilelehkan kembali di pabrik pelanggan, PrimeFlow memformulasikan paket penstabil terkalibrasi. Pendosisan loss-in-weight memastikan dispersi merata dan menyelaraskan Melt Flow Index (MFI) dengan jendela proses mesin klien.",
  },
  {
    number: "05",
    title: "Ekstrusi & Mikro-Filtrasi",
    checkpoint: "CHECKPOINT MUTU 5A | SARINGAN 100 - 120 MESH (< 100 MIKRON)",
    operationalStatus: "Lini Toll-Extrusion Fase 1 -> Ekstruder Mandiri Fase 2 (Tahun ke-3)",
    parameters: [
      "Arsitektur Ekstruder: Lini kompon sekrup tunggal berdaya tahan tinggi",
      "Rating Filtrasi: Automatic / dual screen changer pada 100 hingga 120 mesh (< 100 mikron)",
      "Telemetri: Pemantauan suhu zona barrel dan tekanan lelehan secara kontinu",
    ],
    engineeringDetail:
      "Partikel gel tak meleleh, bintik pigmen karbon, dan serat mikro adalah penyebab utama tersumbatnya gate hot-runner dan robeknya gelembung blown film. Filtrasi halus di bawah 100 mikron menahan mikro-kontaminan sebelum lelehan mencapai die head.",
  },
  {
    number: "06",
    title: "Ekstraksi Vakum Tiga Tahap",
    checkpoint: "CHECKPOINT MUTU 5B | PENYEDOTAN GAS & UAP AIR",
    operationalStatus: "Standar Desain Proses",
    parameters: [
      "Sistem Vakum: Tiga titik ekstraksi vakum di sepanjang barrel ekstruder",
      "Target Ekstraksi: Mengeluarkan sisa gas senyawa volatil (VOC) dan uap air terperangkap",
      "Manfaat Mutu: Mencegah biji plastik keropos di bagian dalam dan bebas gelembung udara",
    ],
    engineeringDetail:
      "Sisa gas atau uap air sekecil apa pun dapat memicu gelembung udara, bercak garis perak (silver streak), dan ketebalan plastik yang tidak rata. Sistem ekstraksi vakum tiga tahap menyedot keluar uap dan gas langsung dari lelehan polimer.",
  },
  {
    number: "07",
    title: "Granulasi Biji Plastik & Ayakan Getar",
    checkpoint: "KONTROL UKURAN | TURUN LANCAR DI HOPPER MESIN",
    operationalStatus: "Standar Desain Proses",
    parameters: [
      "Sistem Pemotong: Pemotong biji plastik water-ring / die-face atau strand presisi",
      "Pengeringan: Pengering sentrifugal setelah pemotongan",
      "Pengayakan: Ayakan getar (vibrating sieve) memisahkan serbuk debu dan butiran yang menempel",
    ],
    engineeringDetail:
      "Bentuk dan ukuran biji plastik yang seragam mencegah bahan menyangkut (bridging) di leher corong hopper mesin pelanggan serta menjaga kestabilan lelehan di sepanjang ulir ekstruder.",
  },
  {
    number: "08",
    title: "Pengemasan Kedap Udara",
    checkpoint: "TAHAP 07 PENGEMASAN | PELINDUNG KELEMBAPAN HERMETIS",
    operationalStatus: "Prototipe Tervalidasi (Karung Woven PP 25 kg + Inner Liner PE)",
    parameters: [
      "Unit Standar: Karung woven polipropilena 25 kg dengan inner liner PE rapat",
      "Opsi Curah: FIBC jumbo bag 500 hingga 1.000 kg untuk kontrak volume besar",
      "Proteksi Gudang: Menjaga ambang kadar air < 0.05% terhadap kelembapan udara tropis",
    ],
    engineeringDetail:
      "Setiap karung dilengkapi label jenis polimer, kode grade (mis. PP 100 Lot PF-11223, HDPE 100 Lot PF-12345), berat bersih, instruksi penyimpanan, serta kode QR batch.",
  },
  {
    number: "09",
    title: "QC Laboratorium & QR COA",
    checkpoint: "CHECKPOINT MUTU 6 | PASPOR PRODUK DIGITAL 6 PARAMETER",
    operationalStatus: "Protokol Verifikasi Laboratorium QC Internal",
    parameters: [
      "Reologi & Kemurnian: ASTM D1238 (MFI), ASTM D5630 (Abu < 0.15%), Moisture Analyzer (< 0.05%)",
      "Mekanik & Dimensi: ISO 527 (Tarik), ISO 179 (Impak), dan Uji Penyusutan Cetakan Internal",
      "Transparansi: Certificate of Analysis (COA) batch diterbitkan melalui kode QR yang dapat dipindai",
    ],
    engineeringDetail:
      "Tidak ada lot produksi yang diizinkan keluar untuk pengiriman komersial tanpa lulus verifikasi laboratorium akhir. Pelanggan dapat memeriksa nilai pasti MFI, kadar air, kadar abu, dan penyusutan lot sebelum memuat bahan ke hopper.",
  },
];

export default async function TechnologyPage() {
  const locale = await getServerLocale();
  const isId = locale === "id";
  const stages = isId ? NINE_STAGES_ID : NINE_STAGES_EN;

  return (
    <div>
      {/* Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-6">
          <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
            {isId
              ? "ARSITEKTUR PEMURNIAN POLIMER & MUTU"
              : "POLYMER PURIFICATION & QUALITY ARCHITECTURE"}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white max-w-4xl leading-[1.03]">
            {isId
              ? "Protokol Rekayasa Sembilan Tahap untuk Resin Daur Ulang Near-Virgin."
              : "Nine-Stage Engineering Protocol for Near-Virgin Recycled Resin."}
          </h1>
          <p className="text-base sm:text-lg text-[#F3F5F6]/80 max-w-3xl leading-relaxed">
            {isId
              ? "Daur ulang mekanis konvensional sering kali merusak rantai poliolefin dan menyisakan kontaminan abrasif yang merusak cetakan injeksi serta die film. PrimeFlow menggantikan penggilingan skrap informal dengan alur pemurnian, kompon, dan verifikasi laboratorium sembilan tahap yang disiplin."
              : "Conventional mechanical recycling often degrades polyolefin chains and leaves abrasive contaminants that damage injection molds and film dies. PrimeFlow replaces informal scrap grinding with a disciplined nine-stage purification, compounding, and laboratory verification workflow."}
          </p>

          {/* Operational vs Planned Qualification Banner */}
          <div className="border-l-4 border-[#FFD71C] bg-[#0B1420] p-5 max-w-4xl text-xs text-[#F3F5F6]/80 leading-relaxed font-mono-tech">
            <strong className="text-[#FFD71C] uppercase block mb-1">
              {isId
                ? "Keterbukaan Tahap Operasional (Fase 1 vs Fase 2):"
                : "Operational Stage Disclosure (Phase 1 vs Phase 2):"}
            </strong>
            {isId
              ? "Sesuai strategi operasional dua fase PrimeFlow, Fase 1 (Tahun 1 hingga 2,5) menjalankan ekstrusi dan pencucian melalui lini toll-processing modular teraudit sambil memegang kendali penuh atas sortir bahan baku internal, formulasi aditif, serta laboratorium QC terkalibrasi (MFI & Moisture Analyzer) untuk penerbitan COA batch. Fase 2 (Tahun ke-3 dan seterusnya) beralih ke fasilitas ekstrusi mandiri (in-house)."
              : "In accordance with PrimeFlow's two-phase operational strategy, Phase 1 (Years 1 to 2.5) executes extrusion and washing via audited modular toll-processing lines while maintaining strict internal feedstock sorting, additive formulation, and calibrated laboratory QC (MFI & Moisture Analyzer) for batch COA issuance. Phase 2 (Year 3 onward) transitions into dedicated in-house extrusion facilities."}
          </div>
        </div>
      </section>

      {/* Vertical Process Narrative */}
      <section className="py-20 bg-[#F3F5F6] border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#123A68]">
                {isId
                  ? "SKEMA PROSES | TAHAP 01 HINGGA 09"
                  : "PROCESS SCHEMATIC | STAGES 01 TO 09"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#101C2B] mt-1">
                {isId
                  ? "Dari Sisa Produksi Pabrik Menjadi Biji Plastik Bersertifikat COA."
                  : "From Post-Industrial Offcut to QR-Certified Pellet."}
              </h2>
            </div>
            <span className="font-mono-tech text-xs text-[#4B5B6E]">
              {isId
                ? "6 TITIK PEMERIKSAAN MUTU WAJIB (CHECKPOINT MUTU 1 - 6)"
                : "6 MANDATORY QUALITY CHECKPOINTS (CHECKPOINT MUTU 1 - 6)"}
            </span>
          </div>

          <div className="relative space-y-6">
            {stages.map((stage) => (
              <div
                key={stage.number}
                className="border border-[#101C2B]/20 bg-white grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Left numeral & checkpoint column */}
                <div className="lg:col-span-4 bg-[#101C2B] text-[#F3F5F6] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E324A]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono-tech">
                      <span className="text-4xl sm:text-5xl font-bold text-[#FFD71C]">
                        {stage.number}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#02BDEA]/40 text-[#02BDEA]">
                        {isId ? "TAHAP" : "STAGE"} {stage.number} / 09
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      {stage.title}
                    </h3>
                    <div className="font-mono-tech text-[11px] text-[#02BDEA] pt-1">
                      {stage.checkpoint}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#1E324A] font-mono-tech text-[11px] text-[#F3F5F6]/70">
                    <span className="text-[#FFD71C] block uppercase text-[10px]">
                      {isId ? "Status Implementasi:" : "Implementation Status:"}
                    </span>
                    {stage.operationalStatus}
                  </div>
                </div>

                {/* Right engineering narrative & parameters */}
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68]">
                      {isId
                        ? "Fungsi Rekayasa & Proteksi Mesin"
                        : "Engineering Function & Tooling Protection"}
                    </div>
                    <p className="text-sm sm:text-base text-[#101C2B] leading-relaxed">
                      {stage.engineeringDetail}
                    </p>
                  </div>

                  <div className="border-t border-[#101C2B]/10 pt-4">
                    <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#4B5B6E] mb-2.5">
                      {isId
                        ? "Parameter Kontrol & Kriteria Verifikasi:"
                        : "Control Parameters & Verification Criteria:"}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {stage.parameters.map((param) => (
                        <div
                          key={param}
                          className="border border-[#101C2B]/15 bg-[#F3F5F6]/70 p-3 text-xs text-[#101C2B] font-mono-tech leading-snug"
                        >
                          {param}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Lab Testing Summary */}
      <section className="py-20 bg-[#101C2B] text-[#F3F5F6]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
              {isId
                ? "VERIFIKASI DI MESIN ANDA SENDIRI"
                : "VERIFY ON YOUR OWN EQUIPMENT"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {isId
                ? "Periksa Contoh Certificate of Analysis & Jalankan Uji Coba Mesin 5-10 kg."
                : "Inspect a Sample Certificate of Analysis & Run a 5-10 kg Machine Trial."}
            </h2>
            <p className="text-sm text-[#F3F5F6]/75 leading-relaxed">
              {isId
                ? "Unduh skema Paspor Produk Digital COA kami atau minta kit sampel gratis dengan pendampingan teknisi di pabrik Anda."
                : "Download our COA Digital Product Passport schema or request a complimentary sample kit with on-site technician accompaniment."}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="/api/documents/primeflow-coa-template"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 border border-[#02BDEA] text-[#02BDEA] font-mono-tech text-xs uppercase tracking-widest hover:bg-[#02BDEA] hover:text-[#101C2B]"
            >
              {isId ? "Lihat Skema COA [TXT]" : "View COA Schema [TXT]"}
            </a>
            <Link
              href="/contact?tab=sample"
              className="px-6 py-4 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe14f]"
            >
              {isId ? "Minta Kit Uji Coba" : "Request Trial Kit"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
