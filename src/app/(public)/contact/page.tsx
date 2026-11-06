import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data-store";
import { InquiryForms } from "@/components/sections/InquiryForms";
import type { InquiryType } from "@/types/domain";
import { getServerLocale } from "@/lib/i18n/locale-server";

export const metadata: Metadata = {
  title: "Contact & RFQ Desk | Request Quotation or 5-10 kg Sample Kit",
  description:
    "Submit an industrial resin quotation request (RFQ), schedule a 5-10 kg complimentary sample trial, or connect with PrimeFlow's commercial engineering desk.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; grade?: string; type?: string }>;
}) {
  const [{ tab, grade, type }, settings, locale] = await Promise.all([
    searchParams,
    getSiteSettings(),
    getServerLocale(),
  ]);

  const isId = locale === "id";

  const getSetting = (key: string, fallback: string) =>
    settings.find((s) => s.setting_key === key)?.value || fallback;

  const primaryEmail = getSetting(
    "primary_contact_email",
    "zidannnugroho@apps.ipb.ac.id"
  );
  const operationsEmail = getSetting(
    "operations_contact_email",
    "audinamaharani225@gmail.com"
  );
  const logisticsEmail = getSetting(
    "logistics_contact_email",
    "karimabdulazis154@gmail.com"
  );
  const whatsappNumber = getSetting("whatsapp_business_number", "6285695704397");
  const serviceRegion = getSetting(
    "service_region",
    "Bogor & Greater Jakarta (Jabodetabek) Industrial Corridors, West Java, Indonesia"
  );

  const initialTab = tab === "sample" ? "sample" : "rfq";
  const allowedTypes: InquiryType[] = [
    "RFQ",
    "ADAPTIVE_SUPPLY",
    "TOLL_RECYCLING",
    "CONSULTATION",
    "CALCULATOR_ESTIMATE",
    "GENERAL",
  ];
  const initialInquiryType: InquiryType = allowedTypes.includes(
    type as InquiryType
  )
    ? (type as InquiryType)
    : "RFQ";

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    isId
      ? "Halo Tim Komersial PrimeFlow, kami ingin menanyakan spesifikasi resin daur ulang PP/PE serta ketersediaan sampel uji coba."
      : "Hello PrimeFlow Commercial Desk, we would like to inquire about recycled PP/PE resin specifications and sample trial availability."
  )}`;

  return (
    <div>
      {/* Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-5">
          <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
            {isId
              ? "MEJA LAYANAN KOMERSIAL & TEKNIS"
              : "COMMERCIAL & TECHNICAL DISPATCH DESK"}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white max-w-4xl leading-[1.03]">
            {isId
              ? "Minta Penawaran Harga atau Jadwalkan Uji Coba Sampel 5-10 kg di Pabrik."
              : "Request a Quotation or Schedule a 5-10 kg On-Site Sample Trial."}
          </h1>
          <p className="text-base sm:text-lg text-[#F3F5F6]/80 max-w-2xl leading-relaxed">
            {isId
              ? "Hubungi langsung tim rekayasa komersial dan mutu PrimeFlow untuk Certificate of Analysis (COA) batch, penjadwalan Adaptive Locked-Supply, atau evaluasi Closed-Loop Toll-Recycling."
              : "Connect directly with PrimeFlow's commercial and quality engineering team for batch Certificates of Analysis (COA), Adaptive Locked-Supply scheduling, or Closed-Loop Toll-Recycling evaluations."}
          </p>
        </div>
      </section>

      {/* Main Content Split */}
      <section className="py-16 lg:py-20 bg-[#F3F5F6]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 4 columns: Verified Contact Information & WhatsApp Integration */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-[#101C2B] bg-[#101C2B] text-[#F3F5F6] p-7 space-y-6">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                  {isId
                    ? "KANAL KOMERSIAL LANGSUNG"
                    : "DIRECT COMMERCIAL CHANNELS"}
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1">
                  {isId ? "Kontak Resmi Proposal" : "Verified Proposal Contacts"}
                </h2>
              </div>

              <div className="space-y-4 font-mono-tech text-xs border-t border-[#1E324A] pt-5">
                <div>
                  <span className="text-[#02BDEA] block text-[10px] uppercase">
                    {isId
                      ? "DIREKTUR UTAMA & LAB QC (M. ZIDAN NUGROHO)"
                      : "CHIEF EXECUTIVE & QC LAB DESK (M. ZIDAN NUGROHO)"}
                  </span>
                  <a
                    href={`mailto:${primaryEmail}`}
                    className="text-white hover:text-[#FFD71C] break-all mt-0.5 block"
                  >
                    {primaryEmail}
                  </a>
                </div>

                <div>
                  <span className="text-[#02BDEA] block text-[10px] uppercase">
                    {isId
                      ? "KEUANGAN & ADAPTIVE SUPPLY (AUDINA MAHARANI)"
                      : "FINANCE & ADAPTIVE SUPPLY DESK (AUDINA MAHARANI)"}
                  </span>
                  <a
                    href={`mailto:${operationsEmail}`}
                    className="text-white hover:text-[#FFD71C] break-all mt-0.5 block"
                  >
                    {operationsEmail}
                  </a>
                </div>

                <div>
                  <span className="text-[#02BDEA] block text-[10px] uppercase">
                    {isId
                      ? "LOGISTIK & UJI COBA SAMPEL (KARIM ABDUL AZIS)"
                      : "LOGISTICS & SAMPLE TRIAL DESK (KARIM ABDUL AZIS)"}
                  </span>
                  <a
                    href={`mailto:${logisticsEmail}`}
                    className="text-white hover:text-[#FFD71C] break-all mt-0.5 block"
                  >
                    {logisticsEmail}
                  </a>
                </div>

                <div className="pt-2 border-t border-[#1E324A]">
                  <span className="text-[#FFD71C] block text-[10px] uppercase">
                    {isId
                      ? "WILAYAH LAYANAN & SASARAN SOM"
                      : "SERVICE & SOM TARGET CORRIDOR"}
                  </span>
                  <p className="text-[#F3F5F6]/80 font-sans text-xs mt-1 leading-relaxed">
                    {serviceRegion}
                  </p>
                </div>
              </div>

              {/* Approved WhatsApp Business Integration */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-4 px-5 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe14f] transition-colors"
                >
                  WhatsApp Direct Desk (+62 856-9570-4397) &rarr;
                </a>
              </div>
            </div>

            <div className="border border-[#101C2B]/15 bg-white p-6 space-y-3">
              <div className="font-mono-tech text-xs uppercase tracking-wider text-[#123A68] font-semibold">
                {isId
                  ? "Apa yang Terjadi Setelah Anda Mengirim Formulir?"
                  : "What Happens After You Submit?"}
              </div>
              <ol className="space-y-2.5 text-xs text-[#4B5B6E] leading-relaxed">
                <li>
                  <strong className="text-[#101C2B]">
                    {isId ? "1. Kode Referensi:" : "1. Reference Assignment:"}
                  </strong>{" "}
                  {isId
                    ? "Permintaan RFQ atau Sampel Anda menerima kode pelacakan unik di kotak masuk CMS kami."
                    : "Your RFQ or Sample Request receives a unique tracking code in our CMS inbox."}
                </li>
                <li>
                  <strong className="text-[#101C2B]">
                    {isId ? "2. Pencocokan Reologi & COA:" : "2. Rheology & COA Match:"}
                  </strong>{" "}
                  {isId
                    ? "Tim kami meninjau proses konversi Anda (injeksi, blow, atau film) dan mencocokkan grade PP atau PE yang tepat."
                    : "Our team reviews your conversion process (injection, blow, or film) and matches the appropriate PP or PE grade."}
                </li>
                <li>
                  <strong className="text-[#101C2B]">
                    {isId
                      ? "3. Pengiriman Sampel 5-10 kg:"
                      : "3. 5-10 kg Sample Dispatch:"}
                  </strong>{" "}
                  {isId
                    ? "Kit uji coba gratis dikirim bersama verifikasi COA batch serta opsi pendampingan teknisi di pabrik."
                    : "Complimentary trial kits ship with batch COA verification and optional on-site technician accompaniment."}
                </li>
              </ol>
            </div>
          </div>

          {/* Right 8 columns: Interactive RFQ & Sample Request Forms */}
          <div className="lg:col-span-8">
            <InquiryForms
              initialTab={initialTab}
              initialGrade={grade || "PP 100"}
              initialInquiryType={initialInquiryType}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
