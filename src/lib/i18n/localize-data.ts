import type {
  Article,
  Product,
  ProductSpecification,
  SiteContentBlock,
} from "@/types/domain";
import type { Locale } from "./locale-server";

const PRODUCT_ID_TRANSLATIONS: Record<
  string,
  {
    name: string;
    short_description: string;
    technical_overview: string;
    feedstock_origin: string;
    manufacturing_processes: string[];
    recommended_applications: string[];
    mfi_value: string;
    density_value: string;
    filtration_rating: string;
    color_profile: string;
    packaging_options: string[];
    food_contact_Execution: string;
    specifications: Record<
      string,
      Partial<Pick<ProductSpecification, "property_group" | "property_name" | "target_value" | "qualification_note">>
    >;
    documents: Record<string, { title: string; qualification_note: string }>;
    gallery: Record<string, { alt_text: string; caption: string }>;
  }
> = {
  "prod-pp-100": {
    name: "PrimeFlow PP 100 Homopolimer Near-Virgin",
    short_description:
      "Pelet resin Polipropilena (PP) daur ulang pasca-industri (Lot Prototipe PF-11223) yang diformulasikan untuk stabilitas viskositas lelehan pada injection molding dan kemasan kaku non-pangan.",
    technical_overview:
      "PrimeFlow PP 100 diproduksi dari sisa potongan konversi polipropilena pasca-industri terkurasi (runner dan trim satu siklus panas), diverifikasi dengan spektroskopi NIR genggam dan kebijakan penolakan ketat terhadap kontaminasi PVC (<0.1%). Bahan baku melewati pencucian alkali panas bertingkat (70 hingga 80 C), formulasi antioksidan dan peroksida organik presisi melalui loss-in-weight feeder, degassing vakum tiga tahap, serta filtrasi lelehan 100 hingga 120 mesh (<100 mikron) guna melindungi nozzle injeksi dan hot runner pabrik klien.",
    feedstock_origin:
      "Potongan konversi dan runner PP pasca-industri terpilih (aliran satu riwayat pemanasan)",
    manufacturing_processes: [
      "Injection Molding",
      "Ekstrusi Lembaran Kaku (Rigid Sheet)",
      "Thermoforming (Non-Pangan)",
    ],
    recommended_applications: [
      "Wadah penyimpanan rumah tangga, keranjang, dan organizer",
      "Baki komponen industri, kotak perkakas, dan krat logistik",
      "Tutup botol non-pangan, cap, dan aktuator dispenser",
      "Braket utilitas peralatan dan casing non-struktural",
    ],
    mfi_value: "Target ~2.17 g/10 mnt (dapat dikalibrasi sesuai grade via dosis peroksida)",
    density_value: "0.90 - 0.91 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Natural Translusen / Basis Industri Terang",
    packaging_options: [
      "Karung Woven PP 25 kg dengan Inner Liner PE (Lot Prototipe PF-11223)",
      "Jumbo Bag 500 - 1.000 kg dengan liner penahan lembap (jadwal kontrak)",
    ],
    food_contact_Execution:
      "Dirancang khusus untuk aplikasi industri dan rumah tangga non-pangan (non-food-grade). Istilah near-virgin merujuk pada target stabilitas pemrosesan dan kemurnian, bukan setara resin murni bersertifikat atau kepatuhan kontak pangan.",
    specifications: {
      "spec-pp-1": {
        property_group: "Reologi & Termal",
        property_name: "Melt Flow Index (MFI)",
        target_value: "Referensi 2.17 (dapat disesuaikan dengan cetakan klien)",
        qualification_note:
          "Spesifikasi QC target yang dikalibrasi melalui dosis peroksida organik; nilai aktual per batch diverifikasi pada COA.",
      },
      "spec-pp-2": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note:
          "Target spesifikasi pasca-pengeringan dan pengemasan inner-liner kedap udara.",
      },
      "spec-pp-3": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Abu (Residu Anorganik)",
        target_value: "< 0.15",
        qualification_note: "Batas rilis QC laboratorium internal per batch.",
      },
      "spec-pp-4": {
        property_group: "Filtrasi & Penyaringan",
        property_name: "Rating Saringan Filtrasi Lelehan",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Parameter desain proses untuk mencegah penyumbatan nozzle.",
      },
      "spec-pp-5": {
        property_group: "Filtrasi & Penyaringan",
        property_name: "Batas Kontaminasi Silang PVC",
        target_value: "< 0.1 (Kebijakan penolakan batch ketat)",
        qualification_note:
          "Ambang sortir Checkpoint Mutu 1 untuk mencegah korosi asam HCl pada barrel.",
      },
      "spec-pp-6": {
        property_group: "Mekanik & Dimensi",
        property_name: "Kuat Tarik, Impak & Penyusutan Cetakan (Shrinkage)",
        target_value: "Divalidasi per lot produksi",
        qualification_note:
          "Dilaporkan pada Digital Product Passport QR COA sebelum pengiriman.",
      },
    },
    documents: {
      "doc-pp-1": {
        title: "Lembar Data Teknis (TDS) Awal PrimeFlow PP 100 (Spesifikasi Prototipe)",
        qualification_note:
          "Spesifikasi rekayasa target berdasarkan desain proses PrimeFlow. Certificate of Analysis (COA) spesifik per batch diterbitkan bersama pengiriman kit sampel fisik.",
      },
      "doc-pp-2": {
        title: "Templat Certificate of Analysis (COA) & Skema Paspor QR Batch",
        qualification_note:
          "Mengilustrasikan laporan QC internal 6 parameter yang disertakan pada setiap karung 25 kg.",
      },
    },
    gallery: {
      "img-pp-1": {
        alt_text: "Tampilan makro pelet resin polipropilena natural translusen",
        caption: "Visual material ilustratif: morfologi pelet PP natural translusen.",
      },
      "img-pp-2": {
        alt_text: "Karung kemasan prototipe 25 kg PrimeFlow PP 100 (Lot PF-11223)",
        caption:
          "Kemasan prototipe resmi PrimeFlow 25 kg woven PP + inner liner PE (Grade PP 100, Lot PF-11223).",
      },
    },
  },
  "prod-hdpe-100": {
    name: "PrimeFlow HDPE 100 Grade Struktural Blow & Injection",
    short_description:
      "Resin daur ulang High-Density Polyethylene (Lot Prototipe PF-12345) yang dirancang untuk stabilitas dimensi pada botol non-pangan, jerigen, dan wadah industri.",
    technical_overview:
      "PrimeFlow HDPE 100 merupakan bagian dari keluarga material Polietilena (PE) dan diproses dari potongan wadah serta flash blow-molding HDPE pasca-industri tersortir. Pencucian alkali panas bertingkat (70 hingga 80 C) mengangkat sisa oli permukaan, pelumas, dan perekat label tanpa merusak rantai polimer. Degassing vakum tiga tahap mengekstraksi senyawa volatil dan bau, sedangkan filtrasi 100 hingga 120 mesh mencegah garis die-line dan bintik hitam pada produk berongga.",
    feedstock_origin:
      "Potongan flash blow-molding dan trim wadah HDPE pasca-industri tersortir",
    manufacturing_processes: [
      "Extrusion Blow Molding",
      "Injection Molding",
      "Ekstrusi Profil & Pipa Non-Tekanan",
    ],
    recommended_applications: [
      "Botol kimia rumah tangga non-pangan, deterjen, dan pelumas",
      "Jerigen industri, carboy, dan ember kimia",
      "Palet penanganan material, dunnage, dan kotak gudang",
      "Selubung kabel utilitas non-tekanan dan profil pelindung",
    ],
    mfi_value: "Dikonfigurasi sesuai grade blow atau injeksi (diverifikasi per COA batch)",
    density_value: "0.94 - 0.96 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Putih Natural / Sortir Warna Dasar Homogen",
    packaging_options: [
      "Karung Woven PP 25 kg dengan Inner Liner PE (Lot Prototipe PF-12345)",
      "Jumbo Bag 500 - 1.000 kg (sesuai jadwal kontrak)",
    ],
    food_contact_Execution:
      "Dibatasi khusus untuk kemasan industri dan rumah tangga non-pangan. Tidak disertifikasi untuk kontak makanan atau farmasi.",
    specifications: {
      "spec-hdpe-1": {
        property_group: "Reologi & Fisik",
        property_name: "Melt Flow Index (MFI)",
        target_value: "Disesuaikan dengan tooling blow atau injeksi (terverifikasi COA)",
        qualification_note:
          "Target reologi distabilkan dengan antioksidan primer dan sekunder (0.1 hingga 0.3%).",
      },
      "spec-hdpe-2": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note: "Target spesifikasi sebelum pengemasan berpelapis kedap udara.",
      },
      "spec-hdpe-3": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Abu (Ash Content)",
        target_value: "< 0.15",
        qualification_note: "Ambang batas QC laboratorium internal.",
      },
      "spec-hdpe-4": {
        property_group: "Filtrasi & Penyaringan",
        property_name: "Rating Saringan Filtrasi Lelehan",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Mengeliminasi partikel tak meleleh dan cacat garis parison.",
      },
      "spec-hdpe-5": {
        property_group: "Sensori & Permukaan",
        property_name: "Protokol Cuci Alkali & Deodorisasi",
        target_value: "Nol bintik hitam / Profil bau dinetralkan",
        qualification_note: "Dievaluasi pada Checkpoint Mutu 2 dan Checkpoint Mutu 6.",
      },
    },
    documents: {
      "doc-hdpe-1": {
        title: "Lembar Data Teknis (TDS) Awal PrimeFlow HDPE 100 (Spesifikasi Prototipe)",
        qualification_note:
          "Lembar spesifikasi target berdasarkan desain pemurnian 7 tahap PrimeFlow.",
      },
    },
    gallery: {
      "img-hdpe-1": {
        alt_text: "Pelet resin high-density polyethylene warna putih natural",
        caption: "Visual material ilustratif: granula HDPE putih natural opak.",
      },
      "img-hdpe-2": {
        alt_text: "Karung prototipe woven 25 kg PrimeFlow HDPE 100 (Lot PF-12345)",
        caption:
          "Desain kemasan prototipe resmi PrimeFlow 25 kg (Grade HDPE 100, Lot PF-12345).",
      },
    },
  },
  "prod-ldpe-200": {
    name: "PrimeFlow LDPE 200 Grade Film Fleksibel & Liner",
    short_description:
      "Resin LDPE pasca-industri rendah gel (low-gel) dari potongan tepi film pabrik yang bersih untuk stabilitas ketebalan blown-film.",
    technical_overview:
      "Film fleksibel seperti LDPE memiliki tingkat daur ulang nasional di bawah 10% di Indonesia akibat tingginya kontaminasi pada limbah pasca-konsumsi. PrimeFlow LDPE 200 menyerap potongan tepi (edge-trim) film pasca-industri dan stretch wrap distribusi komersial yang belum pernah bersentuhan dengan sampah organik rumah tangga. Diproses dengan preservasi satu riwayat panas (referensi stabilitas MFI ~2.17 g/10 mnt), filtrasi lelehan 100 hingga 120 mesh, serta degassing tiga tahap, LDPE 200 mencegah robeknya gelembung film (bubble tear), bintik gel, dan variasi ketebalan.",
    feedstock_origin:
      "Potongan tepi film LDPE pasca-industri bersih dan stretch film distribusi logistik",
    manufacturing_processes: [
      "Blown Film Extrusion",
      "Cast Film Extrusion",
      "Carrier Compound & Masterbatch",
    ],
    recommended_applications: [
      "Inner liner industri dan selongsong pelindung kemasan",
      "Kantong sampah komersial heavy-duty dan karung pengumpul",
      "Shrink film sekunder non-pangan dan pembungkus transit",
      "Polibag pertanian dan lembaran pembibitan",
    ],
    mfi_value: "Referensi ~2.17 g/10 mnt pada aliran film pasca-industri satu siklus panas",
    density_value: "0.915 - 0.930 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Natural Semi-Translusen",
    packaging_options: [
      "Karung Woven PP 25 kg dengan Inner Liner PE",
      "Jumbo Bag 500 - 1.000 kg",
    ],
    food_contact_Execution:
      "Khusus untuk aplikasi film industri dan liner non-pangan.",
    specifications: {
      "spec-ldpe-1": {
        property_group: "Reologi & Stabilitas Film",
        property_name: "Melt Flow Index (MFI)",
        target_value: "Referensi ~2.17 (aliran pasca-industri satu siklus panas)",
        qualification_note:
          "Menjaga keutuhan rantai polimer untuk menghindari ketidakstabilan balon film.",
      },
      "spec-ldpe-2": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note: "Mencegah rongga mikro uap dan cacat lensa selama ekstrusi film.",
      },
      "spec-ldpe-3": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Abu (Ash Content)",
        target_value: "< 0.15",
        qualification_note: "Batas rilis QC laboratorium internal.",
      },
      "spec-ldpe-4": {
        property_group: "Filtrasi & Penyaringan",
        property_name: "Rating Mikro-Filtrasi",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Sangat krusial untuk mengeliminasi bintik gel pada film tipis.",
      },
    },
    documents: {
      "doc-ldpe-1": {
        title: "Lembar Data Teknis (TDS) Awal PrimeFlow LDPE 200 (Spesifikasi Prototipe)",
        qualification_note:
          "Spesifikasi rekayasa target untuk evaluasi ekstrusi blown-film.",
      },
    },
    gallery: {
      "img-ldpe-1": {
        alt_text: "Pelet resin LDPE semi-translusen",
        caption: "Visual material ilustratif: granula LDPE grade film semi-translusen.",
      },
    },
  },
  "prod-pe-150": {
    name: "PrimeFlow PE 150 Kompon Utilitas Industri",
    short_description:
      "Grade utilitas Polietilena seimbang yang dirancang bagi manufaktur skala menengah yang membutuhkan bahan baku hemat biaya dan aman bagi mesin.",
    technical_overview:
      "PrimeFlow PE 150 berada di bawah kategori besar Polietilena (PE), memberikan alternatif yang andal bagi pabrik pencetakan peralatan rumah tangga dan industri dibandingkan cacahan skrap tanpa verifikasi. Disortir berdasarkan kelompok warna dan distabilkan dengan antioksidan primer/sekunder serta pencerah optik terukur, PE 150 menghadirkan pengisian cetakan yang bersih dan penyusutan dimensi yang terprediksi.",
    feedstock_origin: "Sisa konversi Polietilena pasca-industri terkurasi",
    manufacturing_processes: [
      "Injection Molding",
      "Compression Molding",
      "Ekstrusi Umum",
    ],
    recommended_applications: [
      "Peralatan utilitas rumah tangga (ember, baskom, pengki, gantungan)",
      "Kotak sortir gudang dan sekat partisi",
      "Dunnage kemasan sekunder dan pelindung sudut",
      "Aksesori pertanian dan konstruksi non-pangan",
    ],
    mfi_value: "Dikonfigurasi sesuai kebutuhan cetakan pelanggan (terverifikasi COA)",
    density_value: "0.92 - 0.95 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Putih Opak / Netral Industri",
    packaging_options: [
      "Karung Woven PP 25 kg dengan Inner Liner PE",
      "Jumbo Bag 500 - 1.000 kg",
    ],
    food_contact_Execution:
      "Khusus untuk aplikasi pencetakan utilitas dan industri non-pangan.",
    specifications: {
      "spec-pe-1": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note: "Ambang rilis QC internal target.",
      },
      "spec-pe-2": {
        property_group: "Kemurnian & Volatil",
        property_name: "Kadar Abu (Ash Content)",
        target_value: "< 0.15",
        qualification_note: "Ambang rilis QC internal target.",
      },
      "spec-pe-3": {
        property_group: "Filtrasi & Penyaringan",
        property_name: "Rating Filtrasi Lelehan",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Melindungi hot runner dan lubang gate cetakan.",
      },
    },
    documents: {
      "doc-pe-1": {
        title: "Lembar Data Teknis (TDS) Awal PrimeFlow PE 150 (Spesifikasi Prototipe)",
        qualification_note: "Lembar spesifikasi target.",
      },
    },
    gallery: {
      "img-pe-1": {
        alt_text: "Pelet resin polietilena putih opak",
        caption: "Visual material ilustratif: pelet grade PE putih opak.",
      },
    },
  },
};

const ARTICLE_ID_TRANSLATIONS: Record<
  string,
  {
    title: string;
    excerpt: string;
    category_name: string;
    author_role: string;
    content: string;
  }
> = {
  "art-1": {
    title:
      "Mengapa Bahan Baku Pasca-Industri Menjaga Stabilitas Aliran Lelehan pada Cetakan Dinding Tipis",
    excerpt:
      "Pelet daur ulang konvensional multi-siklus rentan mengalami pemutusan rantai termo-mekanis dan kontaminasi volatil. Mengulas bagaimana sisa produksi pasca-industri satu siklus panas dan filtrasi 100-120 mesh melindungi lini injeksi dan ekstrusi film.",
    category_name: "Rekayasa Polimer",
    author_role: "Direktur Utama & Pimpinan Kimia Mutu",
    content: `## Dilema Struktural pada Industri Konversi Plastik Indonesia

Resin polimer mentah umumnya menyumbang 60% hingga 70% dari total biaya produksi (HPP) pada industri konversi plastik (PlasticsEurope, 2023; Faqih et al., 2025). Di saat yang sama, sektor plastik nasional masih terpapar volatilitas petrokimia global karena 50% hingga 60% kebutuhan resin murni (virgin resin) domestik masih bergantung pada impor (INAPLAS, 2023).

Pabrik manufaktur skala menengah menghadapi dilema operasional: menyerap tingginya biaya resin murni impor demi menjaga toleransi dimensi, atau mencampur pelet daur ulang konvensional namun berisiko mengalami lonjakan tekanan lelehan, penyumbatan die-head, bintik hitam, dan produk yang getas.

## Mengapa Pelet Daur Ulang Konvensional Gagal pada Cetakan Presisi

Material daur ulang pasca-konsumsi standar umumnya telah melewati siklus pemrosesan termo-mekanis berulang serta terpapar limbah organik, deterjen, atau bahan kimia rumah tangga. Berdasarkan studi Ragaert et al. (2017) dan Schyns & Shaver (2021), terdapat dua mekanisme kegagalan utama:

1. **Kontaminasi Partikulat dan Silang Polimer**: Sisa perekat label, serat kertas, dan jejak PVC terdegradasi pada suhu ekstrusi, melepaskan gas asam klorida (HCl) yang korosif serta kerak karbon yang menyumbat lubang nozzle berukuran 100 mikron.
2. **Pemutusan Rantai Polimer dan Fluktuasi MFI**: Riwayat pemanasan berulang memutus rantai polipropilena dan polietilena, menyebabkan fluktuasi Melt Flow Index (MFI) antar-batch yang merusak keseragaman ketebalan dinding produk.

## Keunggulan Bahan Baku Pasca-Industri Satu Siklus Panas

Pada pabrik kemasan dan konversi plastik domestik, sisa produksi internal (sprue, runner, potongan tepi film, dan purge awal) mencakup 5% hingga 12% dari resin yang diproses, atau diperkirakan mencapai 300.000 hingga 600.000 ton per tahun di seluruh Indonesia.

Karena sisa produksi pasca-industri tidak pernah masuk ke tempat pembuangan sampah kota, material ini memiliki kontaminasi biologis maupun kimia eksternal yang sangat minim (BPOM, 2019). Evaluasi eksperimental pada potongan film pasca-industri satu siklus panas menunjukkan stabilitas Melt Flow Index di kisaran 2.17 g/10 menit (Marisma et al., 2021), menandakan bahwa tulang punggung makromolekul polimer masih terjaga utuh.

## Protokol Pemurnian 7 Tahap PrimeFlow

Untuk menjembatani kesenjangan antara sisa potongan pabrik dan bahan baku siap-mesin, PrimeFlow menerapkan alur pemurnian dan verifikasi tujuh tahap:

- **Tahap 1 (Kurasi NIR Ketat)**: Spektroskopi NIR genggam memverifikasi identitas polimer (PP, HDPE, LDPE) dan menerapkan ambang penolakan ketat terhadap kontaminasi PVC (<0.1%).
- **Tahap 2 (Pencucian Alkali Panas 70 hingga 80 C)**: Pencucian alkali panas dan surfaktan bertingkat mengangkat sisa oli permukaan dan perekat tanpa merusak rantai polimer.
- **Tahap 3 (Kontrol Kadar Air <0.05%)**: Pengeringan sentrifugal dan termal yang diverifikasi dengan penganalisis kelembapan halogen.
- **Tahap 4 (Formulasi Aditif Presisi)**: Pendosisan loss-in-weight untuk antioksidan primer/sekunder (0.1 hingga 0.3%), pengatur reologi peroksida organik untuk PP, pencerah optik, dan penetral bau.
- **Tahap 5 (Degassing Vakum Tiga Tahap & Filtrasi 100-120 Mesh)**: Ekstrusi sekrup tunggal berdaya tahan tinggi yang dipadukan dengan tiga zona vakum dan saringan lelehan <100 mikron.
- **Tahap 6 & 7 (QC Laboratorium & QR COA)**: Setiap batch diuji nilai MFI (ASTM D1238), kadar abu (<0.15%, ASTM D5630), kadar air (<0.05%), kekuatan tarik/impak (ISO 527 / ISO 179), dan penyusutan cetakan sebelum dikemas dalam karung 25 kg berpelapis inner-liner kedap udara.`,
  },
  "art-2": {
    title:
      "Mengatasi Penguncian Modal Kerja MOQ: Adaptive Locked-Supply bagi Pabrik Skala Menengah",
    excerpt:
      "Pemasok petrokimia besar menerapkan Minimum Order Quantity (MOQ) tinggi yang mengunci modal kerja dan membebani kapasitas gudang. Bagaimana penjadwalan pengiriman bertahap menyelaraskan pengadaan resin dengan arus kas pabrik.",
    category_name: "Strategi Rantai Pasok",
    author_role: "Manajer Operasi, Keuangan & Pasokan Strategis",
    content: `## Jebakan Modal Kerja dalam Pengadaan Resin

Bagi produsen injection molding, blow molding, dan kemasan skala menengah di koridor Jabodetabek dan Pulau Jawa, harga bahan baku hanyalah separuh dari tantangan pengadaan. Produsen resin murni dan importir utama umumnya mewajibkan Minimum Order Quantity (MOQ) yang tinggi serta jadwal pengiriman curah yang kaku.

Ketika pabrik skala menengah terpaksa membeli alokasi resin dalam jumlah besar di muka:
- Modal kerja terkunci di dalam stok bahan baku, bukan pada likuiditas operasional.
- Ruang lantai gudang menjadi penuh sesak, meningkatkan biaya penyimpanan dan penanganan.
- Ketika perusahaan beralih ke pengepul skrap informal demi membeli volume kecil, mereka menghadapi ketidakpastian ketersediaan stok dan fluktuasi kualitas antar-batch yang ekstrem.

## Cara Kerja Adaptive Locked-Supply

PrimeFlow merancang kemitraan komersial khusus bagi manufaktur skala menengah melalui skema kontrak **Adaptive Locked-Supply**:

1. **Kuota Bulanan Terkunci**: Pabrik mitra mengunci alokasi tonase bulanan yang terjamin (misalnya 10 hingga 30 ton per bulan) dengan klausul penyesuaian harga proporsional yang melindungi kedua belah pihak dari lonjakan tajam harga minyak mentah dunia.
2. **Pengiriman Bertahap Sesuai Kapasitas Gudang**: Alih-alih mengirim seluruh kuota bulanan sekaligus, PrimeFlow menjadwalkan pengiriman parsial mingguan atau dua mingguan yang disinkronkan dengan kapasitas fisik gudang dan siklus arus kas produksi klien.
3. **Konsistensi COA Antar-Batch**: Setiap pengiriman bertahap disertai Certificate of Analysis (COA) digital melalui kode QR, memastikan bahwa Lot A yang dikirim pada Minggu ke-1 dan Lot B pada Minggu ke-3 memiliki parameter aliran lelehan dan penyusutan yang konsisten.

## Integrasi Closed-Loop Toll-Recycling (Maklon Sirkular)

Bagi pabrik yang menghasilkan sisa potongan internal bersih seperti sprue, runner, atau produk rijek (umumnya 5% hingga 12% dari kapasitas produksi), PrimeFlow menyediakan layanan **Closed-Loop Toll-Recycling**. Sisa produksi klien dijemput, dimurnikan melalui lini pencucian alkali, degassing, dan filtrasi 100 hingga 120 mesh PrimeFlow, distabilkan kembali dengan antioksidan, lalu dikembalikan sebagai pelet bersertifikat yang siap dicetak ulang.`,
  },
  "art-3": {
    title:
      "Skrining PVC Toleransi-Nol dan Degassing Tiga Tahap dalam Pemulihan Poliolefin",
    excerpt:
      "Kontaminasi PVC sekecil apa pun (<0.1%) dalam aliran polipropilena atau polietilena dapat menghasilkan gas asam korosif dan bintik hitam pada suhu ekstrusi. Mengenal titik pemeriksaan NIR dan vakum degassing PrimeFlow.",
    category_name: "Jaminan Mutu (QA)",
    author_role: "Manajer Produksi, Logistik & Uji Coba Teknis",
    content: `## Kontaminasi Silang: Ancaman Tersembunyi bagi Barrel Ekstruder

Polipropilena (PP) dan Polietilena (PE) diproses pada suhu barrel antara 180 C hingga 250 C. Ketika polivinil klorida (PVC) atau polimer rekayasa yang tidak kompatibel masuk ke dalam aliran poliolefin, degradasi termal langsung terjadi jauh sebelum titik leleh optimal poliolefin tercapai.

PVC yang terdegradasi melepaskan gas asam klorida (HCl) yang mengkorosi sekrup ekstruder berlapis nitrida, merusak permukaan rongga cetakan presisi, dan meninggalkan bintik hitam karbon yang tertanam di dalam produk cetakan.

## Checkpoint Mutu 1: Spektroskopi NIR & Sortir Homogen

Arsitektur mutu PrimeFlow dimulai sebelum tahap pencacahan:
- Bal bahan baku pasca-industri yang masuk diperiksa berdasarkan riwayat manifes, keluarga polimer, dan proses konversi asalnya (injeksi, blow, atau film).
- Spektroskopi Near-Infrared (NIR) genggam memindai identitas polimer dan menerapkan aturan penolakan batch ketat apabila kontaminasi PVC melebihi 0.1%.
- Bahan baku dipisahkan berdasarkan warna dasar guna mempertahankan kejernihan translusen dan derajat keputihan alami tanpa ketergantungan berlebih pada pigmen penutup.

## Checkpoint Mutu 2 hingga 5: Cuci Alkali & Degassing Vakum Tiga Tahap

Setelah melewati detektor logam dan pencacahan basah (wet granulation), serpihan plastik masuk ke pencucian alkali panas 70 hingga 80 C dan surfaktan beserta pemisahan densitas sink-float. Setelah pengeringan sentrifugal dan termal hingga kadar air di bawah 0.05%, material diformulasikan dengan paket aditif terukur (0.1 hingga 0.3% antioksidan primer dan sekunder, pencerah optik, dan penetral bau).

Di dalam ekstruder, **degassing vakum tiga tahap** menarik keluar sisa senyawa organik volatil (VOC) dan uap air yang terperangkap sebelum lelehan melewati automatic screen changer berukuran 100 hingga 120 mesh (<100 mikron). Hasilnya adalah pelet padat bebas rongga dengan geometri seragam untuk pengumpanan hopper yang stabil.`,
  },
};

export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale !== "id") return product;
  const tr = PRODUCT_ID_TRANSLATIONS[product.id];
  if (!tr) return product;

  return {
    ...product,
    name: tr.name,
    short_description: tr.short_description,
    technical_overview: tr.technical_overview,
    feedstock_origin: tr.feedstock_origin,
    manufacturing_processes: tr.manufacturing_processes,
    recommended_applications: tr.recommended_applications,
    mfi_value: tr.mfi_value,
    density_value: tr.density_value,
    filtration_rating: tr.filtration_rating,
    color_profile: tr.color_profile,
    packaging_options: tr.packaging_options,
    food_contact_Execution: tr.food_contact_Execution,
    specifications: product.specifications.map((spec) => {
      const st = tr.specifications[spec.id];
      if (!st) return spec;
      return {
        ...spec,
        property_group: st.property_group || spec.property_group,
        property_name: st.property_name || spec.property_name,
        target_value: st.target_value || spec.target_value,
        qualification_note: st.qualification_note || spec.qualification_note,
      };
    }),
    documents: product.documents.map((doc) => {
      const dt = tr.documents[doc.id];
      if (!dt) return doc;
      return {
        ...doc,
        title: dt.title,
        qualification_note: dt.qualification_note,
      };
    }),
    gallery: product.gallery.map((img) => {
      const gt = tr.gallery[img.id];
      if (!gt) return img;
      return {
        ...img,
        alt_text: gt.alt_text,
        caption: gt.caption,
      };
    }),
  };
}

export function localizeProducts(products: Product[], locale: Locale): Product[] {
  return products.map((p) => localizeProduct(p, locale));
}

export function localizeArticle(article: Article, locale: Locale): Article {
  if (locale !== "id") return article;
  const tr = ARTICLE_ID_TRANSLATIONS[article.id];
  if (!tr) return article;

  return {
    ...article,
    title: tr.title,
    excerpt: tr.excerpt,
    category_name: tr.category_name,
    author_role: tr.author_role,
    content: tr.content,
  };
}

export function localizeArticles(articles: Article[], locale: Locale): Article[] {
  return articles.map((a) => localizeArticle(a, locale));
}

export function localizeSiteContent(
  blocks: SiteContentBlock[],
  locale: Locale
): SiteContentBlock[] {
  if (locale !== "id") return blocks;
  return blocks.map((b) => {
    if (b.page_key === "home" && b.section_key === "hero") {
      return {
        ...b,
        title: "Prime Quality. Consistent Flow.",
        subtitle:
          "Material PP dan PE daur ulang berfokus presisi untuk manufaktur industri yang andal.",
        body: "Pelet polipropilena dan polietilena pasca-industri terkurasi yang dimurnikan melalui pencucian alkali panas 70 hingga 80 C, degassing vakum tiga tahap, dan filtrasi lelehan 100 hingga 120 mesh (<100 mikron). Divalidasi per batch dengan Certificate of Analysis (COA) untuk melindungi mesin cetak sekaligus menghemat biaya bahan baku hingga 30% dibanding resin murni impor (bergantung pada grade dan indeks pasar).",
      };
    }
    if (b.page_key === "about" && b.section_key === "overview") {
      return {
        ...b,
        title:
          "Mendefinisikan Ulang Kualitas, Menciptakan Nilai dalam Pasokan Polimer Pasca-Industri.",
        subtitle:
          "PrimeFlow didirikan untuk menjawab dilema struktural antara efisiensi biaya dan konsistensi mutu yang dihadapi manufaktur plastik skala menengah di Indonesia.",
        body: "PrimeFlow memadukan disiplin kimia analitik dengan rekayasa rantai pasok sirkular. Alih-alih memperdagangkan skrap plastik campur tanpa verifikasi, kami berfokus khusus pada aliran PP dan PE pasca-industri bersih yang divalidasi per batch untuk Melt Flow Index, kadar air (<0.05%), dan kadar abu (<0.15%).",
      };
    }
    return b;
  });
}
