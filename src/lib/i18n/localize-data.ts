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
    name: "PrimeFlow PP 100 Biji Plastik Homopolimer Near-Virgin",
    short_description:
      "Biji plastik Polipropilena (PP) daur ulang pasca-industri (Lot Prototipe PF-11223) dengan aliran lelehan yang stabil untuk mesin injection molding dan produk kemasan kaku non-pangan.",
    technical_overview:
      "PrimeFlow PP 100 diolah dari sisa produksi pabrik (runner dan potongan cetak polipropilena pasca-industri) yang bersih dan baru melewati satu siklus pemanasan. Setiap bahan baku diseleksi ketat menggunakan spektroskopi NIR untuk memastikan bebas dari cemaran PVC (<0.1%). Proses pemurnian meliputi pencucian alkali panas bertingkat (70 hingga 80 C), takaran presisi antioksidan serta peroksida organik melalui loss-in-weight feeder, ekstraksi uap dan gas tiga tahap (triple-stage vacuum degassing), serta penyaringan lelehan 100 hingga 120 mesh (<100 mikron) agar nozzle mesin injeksi dan hot runner pabrik Anda tetap aman.",
    feedstock_origin:
      "Sisa produksi dan runner PP pasca-industri bersih (satu siklus pemanasan)",
    manufacturing_processes: [
      "Injection Molding (Cetak Injeksi)",
      "Ekstrusi Lembaran Kaku (Rigid Sheet)",
      "Thermoforming (Non-Pangan)",
    ],
    recommended_applications: [
      "Wadah penyimpanan rumah tangga, keranjang, dan laci susun",
      "Baki komponen industri, kotak perkakas, dan krat logistik",
      "Tutup botol non-pangan, cap kemasan, dan komponen dispenser",
      "Komponen utilitas peralatan rumah tangga dan casing non-struktural",
    ],
    mfi_value: "Target ~2.17 g/10 mnt (dapat disesuaikan kebutuhan cetakan)",
    density_value: "0.90 - 0.91 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Natural Bening / Warna Dasar Terang",
    packaging_options: [
      "Karung Woven PP 25 kg berlapis Inner Liner PE (Lot Prototipe PF-11223)",
      "Jumbo Bag 500 - 1.000 kg dengan pelindung lembap (untuk kontrak rutin)",
    ],
    food_contact_Execution:
      "Diperuntukkan khusus bagi produk industri dan perlengkapan rumah tangga non-pangan (non-food-grade). Istilah near-virgin mengacu pada kemurnian dan kestabilan alir saat diproses di mesin, bukan klaim setara bijih plastik murni bersertifikat pangan.",
    specifications: {
      "spec-pp-1": {
        property_group: "Sifat Alir & Termal",
        property_name: "Melt Flow Index (MFI)",
        target_value: "Acuan 2.17 (dapat disesuaikan spesifikasi cetakan)",
        qualification_note:
          "Target spesifikasi QC yang dikalibrasi dengan peroksida organik; nilai aktual setiap lot tercantum pada COA.",
      },
      "spec-pp-2": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note:
          "Target spesifikasi setelah pengeringan termal dan pengemasan kedap udara.",
      },
      "spec-pp-3": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Abu (Residu Anorganik)",
        target_value: "< 0.15",
        qualification_note: "Batas standar kelulusan QC laboratorium internal per batch.",
      },
      "spec-pp-4": {
        property_group: "Penyaringan Lelehan",
        property_name: "Kerapatan Filter Ekstrusi",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Menahan partikel tak meleleh agar tidak menyumbat nozzle mesin.",
      },
      "spec-pp-5": {
        property_group: "Penyaringan Lelehan",
        property_name: "Batas Cemaran Silang PVC",
        target_value: "< 0.1 (Lot langsung ditolak bila melebihi batas)",
        qualification_note:
          "Seleksi ketat pada Tahap QC 1 guna mencegah korosi asam pada barrel ekstruder.",
      },
      "spec-pp-6": {
        property_group: "Kekuatan Mekanis & Dimensi",
        property_name: "Kuat Tarik, Ketahanan Bentur & Susut Cetak (Shrinkage)",
        target_value: "Teruji pada setiap lot produksi",
        qualification_note:
          "Hasil uji dicantumkan pada dokumen COA berkode QR sebelum barang dikirim.",
      },
    },
    documents: {
      "doc-pp-1": {
        title: "Lembar Data Teknis (TDS) PrimeFlow PP 100 (Spesifikasi Prototipe)",
        qualification_note:
          "Acuan spesifikasi teknis berdasarkan standar proses PrimeFlow. Dokumen Certificate of Analysis (COA) per batch disertakan bersama pengiriman sampel maupun pesanan rutin.",
      },
      "doc-pp-2": {
        title: "Contoh Certificate of Analysis (COA) & Paspor Mutu QR Batch",
        qualification_note:
          "Menampilkan format laporan hasil uji laboratorium 6 parameter yang tertera pada setiap kemasan karung 25 kg.",
      },
    },
    gallery: {
      "img-pp-1": {
        alt_text: "Tampilan dekat biji plastik polipropilena natural bening",
        caption: "Visualisasi material: bentuk biji plastik PP natural yang seragam.",
      },
      "img-pp-2": {
        alt_text: "Kemasan karung 25 kg PrimeFlow PP 100 (Lot PF-11223)",
        caption:
          "Kemasan standar PrimeFlow 25 kg karung woven PP + inner liner PE (Grade PP 100, Lot PF-11223).",
      },
    },
  },
  "prod-hdpe-100": {
    name: "PrimeFlow HDPE 100 Biji Plastik Blow & Injection Molding",
    short_description:
      "Biji plastik daur ulang High-Density Polyethylene (Lot Prototipe PF-12345) dengan kekuatan dinding dan presisi dimensi tinggi untuk botol non-pangan, jerigen, serta wadah industri.",
    technical_overview:
      "PrimeFlow HDPE 100 merupakan varian Polietilena berdensitas tinggi yang diolah dari sisa potongan botol dan wadah HDPE pasca-industri yang telah dipisahkan berdasarkan warna dasar. Tahap pencucian alkali panas (70 hingga 80 C) membersihkan sisa minyak permukaan dan lem label secara tuntas tanpa merusak ikatan polimer. Ekstraksi vakum tiga tahap menghilangkan bau dan gas terperangkap, sementara penyaringan 100 hingga 120 mesh mencegah cacat garis parison (die-line) maupun bintik hitam pada dinding botol atau jerigen.",
    feedstock_origin:
      "Sisa potongan blow-molding dan trim wadah HDPE pasca-industri tersortir",
    manufacturing_processes: [
      "Extrusion Blow Molding (Cetak Tiup)",
      "Injection Molding (Cetak Injeksi)",
      "Ekstrusi Profil & Pipa Pelindung",
    ],
    recommended_applications: [
      "Botol cairan pembersih rumah tangga, deterjen, dan pelumas",
      "Jerigen industri 5L sampai 20L, dirigen kimia, dan ember",
      "Palet gudang, tatakan barang (dunnage), dan kotak logistik",
      "Pipa selubung kabel non-tekanan dan profil pelindung industri",
    ],
    mfi_value: "Disesuaikan spesifikasi mesin blow atau injeksi (tertera di COA)",
    density_value: "0.94 - 0.96 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Putih Natural / Warna Dasar Seragam",
    packaging_options: [
      "Karung Woven PP 25 kg berlapis Inner Liner PE (Lot Prototipe PF-12345)",
      "Jumbo Bag 500 - 1.000 kg (untuk jadwal kontrak rutin)",
    ],
    food_contact_Execution:
      "Khusus untuk produk kemasan industri dan rumah tangga non-pangan. Tidak diperuntukkan bagi kemasan makanan, minuman, atau farmasi.",
    specifications: {
      "spec-hdpe-1": {
        property_group: "Sifat Alir & Fisik",
        property_name: "Melt Flow Index (MFI)",
        target_value: "Disesuaikan kebutuhan mesin blow atau injeksi (terverifikasi COA)",
        qualification_note:
          "Kestabilan viskositas dijaga dengan tambahan antioksidan primer dan sekunder (0.1 hingga 0.3%).",
      },
      "spec-hdpe-2": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note: "Target spesifikasi sebelum dikemas rapat dengan inner-liner PE.",
      },
      "spec-hdpe-3": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Abu (Ash Content)",
        target_value: "< 0.15",
        qualification_note: "Batas kelulusan uji laboratorium internal.",
      },
      "spec-hdpe-4": {
        property_group: "Penyaringan Lelehan",
        property_name: "Kerapatan Filter Ekstrusi",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Mencegah partikel kotoran yang memicu garis cacat saat peniupan botol.",
      },
      "spec-hdpe-5": {
        property_group: "Kebersihan Visual & Bau",
        property_name: "Hasil Cuci Alkali Panas & Deodorisasi",
        target_value: "Bebas bintik hitam / Bebas bau menyengat",
        qualification_note: "Diperiksa ketat pada Tahap QC 2 dan Tahap QC 6.",
      },
    },
    documents: {
      "doc-hdpe-1": {
        title: "Lembar Data Teknis (TDS) PrimeFlow HDPE 100 (Spesifikasi Prototipe)",
        qualification_note:
          "Lembar acuan spesifikasi berdasarkan alur pemurnian 7 tahap PrimeFlow.",
      },
    },
    gallery: {
      "img-hdpe-1": {
        alt_text: "Biji plastik high-density polyethylene warna putih natural",
        caption: "Visualisasi material: biji plastik HDPE putih natural.",
      },
      "img-hdpe-2": {
        alt_text: "Kemasan karung 25 kg PrimeFlow HDPE 100 (Lot PF-12345)",
        caption:
          "Kemasan standar PrimeFlow 25 kg (Grade HDPE 100, Lot PF-12345).",
      },
    },
  },
  "prod-ldpe-200": {
    name: "PrimeFlow LDPE 200 Biji Plastik Grade Film & Liner",
    short_description:
      "Biji plastik LDPE pasca-industri bebas bintik gel (low-gel) dari sisa potongan plastik film pabrik yang bersih, menghasilkan ketebalan plastik film yang stabil.",
    technical_overview:
      "Tingkat daur ulang plastik film fleksibel seperti LDPE di Indonesia masih di bawah 10% karena sulitnya mengolah sampah film rumah tangga yang kotor. PrimeFlow LDPE 200 mengatasi kendala ini dengan hanya mengolah sisa potongan tepi (edge-trim) plastik film dari pabrik dan plastik wrapping logistik yang bersih. Berkat riwayat satu kali pemanasan (acuan MFI stabil ~2.17 g/10 mnt), penyaringan halus 100 hingga 120 mesh, dan ekstraksi gas tiga tahap, biji plastik LDPE 200 tidak mudah memicu balon film pecah (bubble tear), bebas bintik gel, dan menjaga ketebalan plastik tetap rata.",
    feedstock_origin:
      "Sisa potongan tepi film LDPE pabrik dan plastik stretch film logistik bersih",
    manufacturing_processes: [
      "Blown Film Extrusion (Ekstrusi Film Tiup)",
      "Cast Film Extrusion",
      "Bahan Pembawa Masterbatch (Carrier)",
    ],
    recommended_applications: [
      "Plastik pelapis dalam (inner liner) dan pelindung kemasan industri",
      "Kantong sampah komersial tebal (heavy-duty) dan kantong logistik",
      "Plastik pembungkus (shrink/stretch film) sekunder non-pangan",
      "Polibag tanaman dan plastik lembaran pertanian",
    ],
    mfi_value: "Acuan ~2.17 g/10 mnt dari bahan film pasca-industri satu siklus panas",
    density_value: "0.915 - 0.930 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Natural Semi-Transparan",
    packaging_options: [
      "Karung Woven PP 25 kg berlapis Inner Liner PE",
      "Jumbo Bag 500 - 1.000 kg",
    ],
    food_contact_Execution:
      "Khusus untuk produk plastik film industri dan pelapis kemasan non-pangan.",
    specifications: {
      "spec-ldpe-1": {
        property_group: "Sifat Alir & Kestabilan Balon Film",
        property_name: "Melt Flow Index (MFI)",
        target_value: "Acuan ~2.17 (bahan pasca-industri satu siklus panas)",
        qualification_note:
          "Menjaga keutuhan rantai molekul agar balon film stabil saat ditiup.",
      },
      "spec-ldpe-2": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note: "Mencegah gelembung uap dan bercak berlubang pada lembaran film tipis.",
      },
      "spec-ldpe-3": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Abu (Ash Content)",
        target_value: "< 0.15",
        qualification_note: "Batas kelulusan uji laboratorium internal.",
      },
      "spec-ldpe-4": {
        property_group: "Penyaringan Lelehan",
        property_name: "Kerapatan Mikro-Filtrasi",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Sangat penting untuk mencegah bintik gel (fisheye) pada plastik film.",
      },
    },
    documents: {
      "doc-ldpe-1": {
        title: "Lembar Data Teknis (TDS) PrimeFlow LDPE 200 (Spesifikasi Prototipe)",
        qualification_note:
          "Acuan spesifikasi teknis untuk pengujian mesin blown-film extrusion.",
      },
    },
    gallery: {
      "img-ldpe-1": {
        alt_text: "Biji plastik LDPE semi-transparan",
        caption: "Visualisasi material: biji plastik LDPE khusus ekstrusi film.",
      },
    },
  },
  "prod-pe-150": {
    name: "PrimeFlow PE 150 Biji Plastik Utilitas Industri",
    short_description:
      "Biji plastik Polietilena serbaguna yang dirancang bagi pabrik skala menengah yang membutuhkan bahan baku hemat biaya, bersih, dan aman untuk mesin cetak.",
    technical_overview:
      "PrimeFlow PE 150 adalah solusi bahan baku Polietilena (PE) yang jauh lebih terjamin dibanding membeli cacahan atau biji plastik daur ulang konvensional yang tidak jelas asal-usulnya. Bahan baku dipisahkan berdasarkan kelompok warna, distabilkan dengan aditif antioksidan serta pencerah warna terukur, sehingga mengisi rongga cetakan dengan lancar dan menghasilkan tingkat penyusutan dimensi (shrinkage) yang konsisten.",
    feedstock_origin: "Sisa produksi Polietilena pasca-industri pilihan yang bersih",
    manufacturing_processes: [
      "Injection Molding (Cetak Injeksi)",
      "Compression Molding",
      "Ekstrusi Umum",
    ],
    recommended_applications: [
      "Perabot rumah tangga plastik (ember, baskom, pengki, gantungan baju)",
      "Kotak sortir gudang dan sekat partisi logistik",
      "ganjal kemasan (dunnage) dan pelindung sudut kargo",
      "Peralatan bantu pertanian dan proyek konstruksi non-pangan",
    ],
    mfi_value: "Disesuaikan spesifikasi cetakan pelanggan (terverifikasi COA)",
    density_value: "0.92 - 0.95 g/cm3 (Spesifikasi target)",
    filtration_rating: "100 - 120 mesh (< 100 mikron)",
    color_profile: "Putih Susu / Netral Industri",
    packaging_options: [
      "Karung Woven PP 25 kg berlapis Inner Liner PE",
      "Jumbo Bag 500 - 1.000 kg",
    ],
    food_contact_Execution:
      "Khusus untuk pencetakan produk rumah tangga dan komponen industri non-pangan.",
    specifications: {
      "spec-pe-1": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Air (Moisture Content)",
        target_value: "< 0.05",
        qualification_note: "Standar kelulusan QC internal.",
      },
      "spec-pe-2": {
        property_group: "Kemurnian & Kadar Volatil",
        property_name: "Kadar Abu (Ash Content)",
        target_value: "< 0.15",
        qualification_note: "Standar kelulusan QC internal.",
      },
      "spec-pe-3": {
        property_group: "Penyaringan Lelehan",
        property_name: "Kerapatan Filter Ekstrusi",
        target_value: "100 - 120 mesh (< 100 mikron)",
        qualification_note: "Melindungi saluran hot runner dan mulut gate cetakan.",
      },
    },
    documents: {
      "doc-pe-1": {
        title: "Lembar Data Teknis (TDS) PrimeFlow PE 150 (Spesifikasi Prototipe)",
        qualification_note: "Lembar acuan spesifikasi teknis.",
      },
    },
    gallery: {
      "img-pe-1": {
        alt_text: "Biji plastik polietilena putih susu",
        caption: "Visualisasi material: biji plastik PE warna putih susu.",
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
      "Mengapa Biji Plastik Pasca-Industri Lebih Stabil untuk Cetakan Presisi dan Dinding Tipis",
    excerpt:
      "Biji plastik daur ulang konvensional yang sudah berkali-kali dilelehkan rentan mengalami kerusakan rantai polimer dan menyumbat mesin. Simak bagaimana bahan baku pasca-industri satu siklus panas dengan filtrasi 100-120 mesh menjaga kelancaran mesin injeksi dan ekstrusi Anda.",
    category_name: "Teknologi Polimer",
    author_role: "Direktur Utama & Pimpinan Laboratorium Mutu",
    content: `## Tantangan Biaya Bahan Baku di Industri Plastik Nasional

Bahan baku biji plastik menyumbang sekitar 60% hingga 70% dari total Harga Pokok Produksi (HPP) di pabrik pencetakan plastik (PlasticsEurope, 2023; Faqih et al., 2025). Di sisi lain, industri plastik di Indonesia masih sangat bergantung pada pasokan luar negeri, di mana 50% hingga 60% kebutuhan biji plastik murni (virgin resin) masih harus diimpor (INAPLAS, 2023).

Kondisi ini membuat pabrik skala menengah sering kali dihadapkan pada pilihan sulit: tetap membeli biji plastik murni impor yang mahal demi menjaga kualitas barang, atau beralih ke biji plastik daur ulang biasa dengan risiko tekanan mesin melonjak, saringan mampet, timbul bintik hitam, hingga hasil cetakan yang getas dan mudah pecah.

## Mengapa Biji Plastik Daur Ulang Biasa Sering Bermasalah di Mesin?

Bahan daur ulang konvensional yang berasal dari sampah rumah tangga (post-consumer) umumnya sudah melewati pemanasan berulang kali serta tercampur sisa makanan, minyak, deterjen, maupun jenis plastik lain. Berdasarkan kajian teknis Ragaert et al. (2017) dan Schyns & Shaver (2021), ada dua penyebab utama mengapa bahan tersebut sering merusak proses produksi:

1. **Kotoran Mikro dan Tercampurnya PVC**: Sisa lem label, serat kertas, serta cemaran plastik PVC akan hangus pada suhu leleh PP/PE, menghasilkan gas asam klorida (HCl) yang memicu karat pada ulir ekstruder serta kerak karbon yang menyumbat celah nozzle berukuran 100 mikron.
2. **Putusnya Rantai Polimer dan Nilai MFI yang Berubah-ubah**: Pemanasan berulang memutus ikatan molekul polipropilena dan polietilena. Akibatnya, nilai Melt Flow Index (MFI) berubah drastis dari satu karung ke karung berikutnya sehingga ketebalan produk menjadi tidak seragam.

## Keunggulan Bahan Baku Sisa Produksi Pabrik (Pasca-Industri)

Di pabrik kemasan dan pencetakan plastik domestik, sisa proses produksi internal seperti sprue, runner, potongan tepi film, dan bahan penyetelan awal mesin mencakup 5% hingga 12% dari total pemakaian resin, atau sekitar 300.000 hingga 600.000 ton per tahun di seluruh Indonesia.

Karena sisa produksi pabrik ini tidak pernah terbuang ke tempat sampah umum, bahan tersebut bebas dari pembusukan organik maupun kontaminasi kimia rumah tangga (BPOM, 2019). Hasil pengujian pada potongan film pasca-industri yang baru melewati satu kali pemanasan menunjukkan nilai Melt Flow Index yang stabil di kisaran 2.17 g/10 menit (Marisma et al., 2021), menandakan struktur rantai polimernya masih sangat prima.

## Standar Pemurnian 7 Tahap PrimeFlow

Agar sisa produksi pabrik tersebut siap langsung masuk ke mesin berpresisi tinggi, PrimeFlow menerapkan proses pemurnian dan pengujian tujuh tahap:

- **Tahap 1 (Seleksi Spektroskopi NIR)**: Alat pemindai NIR memastikan jenis plastik (PP, HDPE, LDPE) murni dan menolak tegas setiap bahan yang mengandung cemaran PVC di atas 0.1%.
- **Tahap 2 (Pencucian Alkali Panas 70 hingga 80 C)**: Pencucian air panas beralkali dan surfaktan khusus mengangkat tuntas sisa oli mesin dan perekat tanpa merusak struktur polimer.
- **Tahap 3 (Pengeringan hingga Kadar Air <0.05%)**: Pengeringan sentrifugal dan termal yang diuji langsung dengan alat Halogen Moisture Analyzer.
- **Tahap 4 (Takaran Aditif Presisi)**: Penambahan antioksidan primer dan sekunder (0.1 hingga 0.3%), peroksida organik pengatur alir untuk PP, pencerah warna, serta penetral bau menggunakan loss-in-weight feeder.
- **Tahap 5 (Degassing Vakum Tiga Tahap & Filter 100-120 Mesh)**: Ekstrusi dilengkapi tiga titik penghisapan uap/gas dan saringan lelehan di bawah 100 mikron.
- **Tahap 6 & 7 (Uji Lab & Paspor QR COA)**: Setiap lot produksi diuji nilai MFI (ASTM D1238), kadar abu (<0.15%, ASTM D5630), kadar air (<0.05%), kekuatan tarik dan bentur (ISO 527 / ISO 179), serta tingkat susut cetak sebelum dikemas ke dalam karung 25 kg berlapis inner-liner kedap udara.`,
  },
  "art-2": {
    title:
      "Solusi MOQ Tinggi yang Mengikat Modal Kerja: Skema Adaptive Locked-Supply untuk Pabrik Menengah",
    excerpt:
      "Pemasok resin murni umumnya mensyaratkan volume pembelian minimum (MOQ) besar yang menguras kas dan memenuhi gudang. Pelajari bagaimana sistem kontrak kuota dengan pengiriman bertahap membantu menjaga arus kas pabrik Anda.",
    category_name: "Strategi Pengadaan B2B",
    author_role: "Manajer Operasi, Keuangan & Kemitraan Pasokan",
    content: `## Kendala Modal Kerja dalam Pembelian Biji Plastik

Bagi pabrik injection molding, blow molding, dan kemasan plastik skala menengah di wilayah Jabodetabek dan Pulau Jawa, harga per kilogram bukan satu-satunya beban pengadaan. Produsen petrokimia dan distributor besar umumnya menerapkan batas Minimum Order Quantity (MOQ) yang tinggi dengan pengiriman sekaligus dalam jumlah besar.

Akibatnya, pabrik skala menengah sering mengalami tiga kendala utama:
- **Modal kerja tertahan di tumpukan stok bahan baku**, sehingga mengganggu perputaran kas untuk biaya operasional lainnya.
- **Kapasitas gudang cepat penuh**, menambah biaya sewa ruang dan risiko kerusakan kemasan.
- Saat beralih membeli eceran dari pedagang daur ulang konvensional, **stok sering kali tiba-tiba kosong** dan mutu barang berubah-ubah setiap pengiriman.

## Bagaimana Skema Adaptive Locked-Supply Bekerja?

PrimeFlow menghadirkan pola kemitraan pasokan yang dirancang mengikuti ritme operasional pabrik menengah melalui kontrak **Adaptive Locked-Supply**:

1. **Jaminan Kuota Tonase Bulanan**: Pabrik mitra mengunci jatah pasokan bulanan yang pasti (misalnya 10 hingga 30 ton per bulan) dengan kesepakatan penyesuaian harga yang adil dan terukur apabila terjadi gejolak harga minyak dunia.
2. **Pengiriman Bertahap Sesuai Ruang Gudang**: Kuota bulanan Anda tidak harus dikirim sekaligus. PrimeFlow menjadwalkan pengiriman bertahap setiap minggu atau dua minggu sekali, menyesuaikan ruang gudang yang tersedia dan jadwal produksi pabrik Anda.
3. **Mutu Konsisten Lengkap dengan COA**: Setiap pengiriman bertahap disertai lembar Certificate of Analysis (COA) berkode QR. Dengan demikian, bahan yang dikirim pada minggu pertama maupun minggu ketiga tetap memiliki sifat alir (MFI) dan penyusutan cetak yang seragam.

## Layanan Maklon Daur Ulang Tertutup (Closed-Loop Toll-Recycling)

Bagi pabrik yang menghasilkan sisa potongan produksi bersih seperti sprue, runner, atau produk gagal cetak (rata-rata 5% hingga 12% dari kapasitas produksi), PrimeFlow juga menyediakan layanan **Closed-Loop Toll-Recycling (Maklon)**. Sisa produksi bersih dari pabrik Anda kami jemput, kami cuci dengan alkali panas, kami saring pada 100 hingga 120 mesh, serta kami stabilkan kembali dengan aditif antioksidan untuk dikembalikan menjadi biji plastik siap pakai lengkap dengan COA.`,
  },
  "art-3": {
    title:
      "Pentingnya Seleksi Bebas PVC dan Ekstraksi Vakum Tiga Tahap pada Biji Plastik Daur Ulang",
    excerpt:
      "Tercampurnya sedikit saja plastik PVC (<0.1%) ke dalam bahan PP atau PE akan memicu gas asam korosif dan bintik hitam saat dilelehkan. Kenali cara kerja seleksi NIR dan degassing vakum tiga tahap di PrimeFlow.",
    category_name: "Jaminan Mutu (QA)",
    author_role: "Manajer Produksi, Logistik & Uji Coba Teknis",
    content: `## Bahaya Cemaran PVC bagi Ulir Ekstruder dan Cetakan

Polipropilena (PP) dan Polietilena (PE) umumnya diproses pada suhu barrel antara 180 C hingga 250 C. Apabila di dalam bahan baku terdapat cemaran Polivinil Klorida (PVC) atau jenis plastik lain yang tidak sejenis, plastik cemaran tersebut akan hangus terlebih dahulu sebelum suhu leleh optimal PP atau PE tercapai.

PVC yang terbakar di dalam barrel akan melepaskan gas asam klorida (HCl) yang bersifat korosif terhadap lapisan baja ulir ekstruder, merusak permukaan cetakan (mold cavity), dan menyisakan bintik-bintik hitam karbon pada produk jadi.

## Tahap QC 1: Pemindaian Spektroskopi NIR & Pemisahan Warna

Pengawasan mutu di PrimeFlow dimulai sejak bahan baku tiba sebelum digiling:
- Setiap partai bahan baku pasca-industri diperiksa asal-usul pabriknya, jenis polimernya, serta peruntukan awalnya (apakah eks-injeksi, blow molding, atau ekstrusi film).
- Alat pemindai Near-Infrared (NIR) memastikan kemurnian jenis polimer dan menolak lot bahan baku apabila terdeteksi kandungan PVC di atas 0.1%.
- Bahan dipisahkan secara disiplin berdasarkan warna dasar agar menghasilkan biji plastik berwarna cerah alami tanpa harus ditutup dengan pigmen pewarna berlebih.

## Tahap QC 2 hingga 5: Cuci Alkali Panas & Ekstraksi Vakum Tiga Tahap

Setelah melewati detektor logam dan pencacahan basah (wet granulation), serpihan plastik dicuci dalam larutan alkali panas bersuhu 70 hingga 80 C untuk meluruhkan sisa minyak dan lem, lalu dikeringkan hingga kadar air di bawah 0.05%. Selanjutnya, bahan dicampur dengan aditif antioksidan (0.1 hingga 0.3%), pencerah optik, dan penetral bau.

Di dalam mesin ekstruder, **sistem ekstraksi vakum tiga tahap (triple-stage vacuum degassing)** menyedot keluar sisa uap air dan gas senyawa volatil sebelum lelehan plastik melewati saringan halus 100 hingga 120 mesh (<100 mikron). Hasilnya adalah biji plastik yang padat, bebas gelembung udara di bagian dalam, serta berukuran seragam sehingga turun dengan lancar di corong hopper mesin Anda.`,
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
          "Pasokan biji plastik daur ulang PP dan PE berstandar presisi untuk kelancaran produksi industri manufaktur.",
        body: "Biji plastik Polipropilena (PP) dan Polietilena (PE) pasca-industri berkualitas mendekati murni (near-virgin) yang dimurnikan melalui pencucian alkali panas 70 hingga 80 C, ekstraksi vakum tiga tahap, dan penyaringan lelehan 100 hingga 120 mesh (<100 mikron). Setiap batch dilengkapi Certificate of Analysis (COA) terverifikasi untuk menjaga performa mesin cetak sekaligus menghemat biaya bahan baku hingga 30% dibanding bijih plastik murni impor.",
      };
    }
    if (b.page_key === "about" && b.section_key === "overview") {
      return {
        ...b,
        title:
          "Standar Baru Kualitas Biji Plastik Daur Ulang untuk Efisiensi Industri Manufaktur.",
        subtitle:
          "PrimeFlow hadir menjawab dilema antara mahalnya bahan baku murni impor dan tidak stabilnya mutu biji plastik daur ulang konvensional yang dihadapi pabrik plastik skala menengah di Indonesia.",
        body: "PrimeFlow memadukan ketelitian analisis laboratorium kimia dengan manajemen rantai pasok sirkular. Kami tidak memperjualbelikan cacahan plastik asalan, melainkan mengolah sisa produksi pabrik (pasca-industri) PP dan PE pilihan yang diuji per batch untuk memastikan kestabilan Melt Flow Index, kadar air (<0.05%), dan kadar abu (<0.15%).",
      };
    }
    return b;
  });
}
