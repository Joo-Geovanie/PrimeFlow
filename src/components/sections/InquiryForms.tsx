"use client";

import React, { useState } from "react";
import {
  submitQuoteRequestAction,
  submitSampleRequestAction,
} from "@/actions/cms-actions";
import type { InquiryType } from "@/types/domain";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface InquiryFormsProps {
  initialTab?: "rfq" | "sample";
  initialGrade?: string;
  initialInquiryType?: InquiryType;
}

export function InquiryForms({
  initialTab = "rfq",
  initialGrade = "PP 100",
  initialInquiryType = "RFQ",
}: InquiryFormsProps) {
  const { isId } = useLanguage();
  const [activeTab, setActiveTab] = useState<"rfq" | "sample">(initialTab);

  // RFQ State
  const [rfqCompany, setRfqCompany] = useState("");
  const [rfqContact, setRfqContact] = useState("");
  const [rfqEmail, setRfqEmail] = useState("");
  const [rfqPhone, setRfqPhone] = useState("");
  const [rfqSegment, setRfqSegment] = useState("Injection Molding");
  const [rfqType, setRfqType] = useState<InquiryType>(initialInquiryType);
  const [rfqGrade, setRfqGrade] = useState(initialGrade || "PP 100");
  const [rfqVolume, setRfqVolume] = useState("10000");
  const [rfqSchedule, setRfqSchedule] = useState(
    "Adaptive Locked-Supply (Staggered Bi-Weekly Drops)"
  );
  const [rfqApplication, setRfqApplication] = useState("");
  const [rfqMessage, setRfqMessage] = useState("");
  const [rfqSubmitting, setRfqSubmitting] = useState(false);
  const [rfqFeedback, setRfqFeedback] = useState<{
    ok: boolean;
    message: string;
    ref?: string;
  } | null>(null);

  // Sample Request State
  const [smpCompany, setSmpCompany] = useState("");
  const [smpContact, setSmpContact] = useState("");
  const [smpEmail, setSmpEmail] = useState("");
  const [smpPhone, setSmpPhone] = useState("");
  const [smpCity, setSmpCity] = useState("");
  const [smpAddress, setSmpAddress] = useState("");
  const [smpGrade, setSmpGrade] = useState(initialGrade || "PP 100");
  const [smpKg, setSmpKg] = useState("10");
  const [smpProcess, setSmpProcess] = useState("Injection Molding");
  const [smpMachine, setSmpMachine] = useState("");
  const [smpTechnician, setSmpTechnician] = useState(true);
  const [smpWindow, setSmpWindow] = useState("");
  const [smpNotes, setSmpNotes] = useState("");
  const [smpSubmitting, setSmpSubmitting] = useState(false);
  const [smpFeedback, setSmpFeedback] = useState<{
    ok: boolean;
    message: string;
    ref?: string;
  } | null>(null);

  async function handleRfqSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRfqSubmitting(true);
    setRfqFeedback(null);

    try {
      const res = await submitQuoteRequestAction({
        company_name: rfqCompany,
        contact_name: rfqContact,
        email: rfqEmail,
        phone: rfqPhone,
        industry_segment: rfqSegment,
        inquiry_type: rfqType,
        product_grade: rfqGrade,
        monthly_volume_kg: Number(rfqVolume) || undefined,
        delivery_schedule_preference: rfqSchedule,
        target_application: rfqApplication,
        message: rfqMessage,
        honeypot: "",
      });

      if (res.ok) {
        setRfqFeedback({
          ok: true,
          ref: res.referenceCode,
          message: isId
            ? `Permintaan penawaran (RFQ) terdaftar dengan referensi ${res.referenceCode}. Tim rekayasa komersial dan QC kami akan merespons dengan ketersediaan grade serta dokumentasi COA.`
            : `Quotation inquiry registered under reference ${res.referenceCode}. Our commercial and QC engineering desk will respond with grade availability and COA documentation.`,
        });
        setRfqCompany("");
        setRfqContact("");
        setRfqEmail("");
        setRfqPhone("");
        setRfqApplication("");
        setRfqMessage("");
      } else {
        setRfqFeedback({
          ok: false,
          message:
            res.error ||
            (isId
              ? "Gagal mengirim permintaan penawaran."
              : "Unable to submit quotation request."),
        });
      }
    } catch {
      setRfqFeedback({
        ok: false,
        message: isId
          ? "Terjadi kesalahan jaringan saat mengirim permintaan Anda."
          : "A network error occurred while submitting your inquiry.",
      });
    } finally {
      setRfqSubmitting(false);
    }
  }

  async function handleSampleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSmpSubmitting(true);
    setSmpFeedback(null);

    try {
      const res = await submitSampleRequestAction({
        company_name: smpCompany,
        contact_name: smpContact,
        email: smpEmail,
        phone: smpPhone,
        plant_city: smpCity,
        shipping_address: smpAddress,
        product_grade: smpGrade,
        requested_kg: Number(smpKg) || 10,
        conversion_process: smpProcess,
        machine_model: smpMachine,
        requires_onsite_technician: smpTechnician,
        preferred_trial_window: smpWindow,
        technical_notes: smpNotes,
        honeypot: "",
      });

      if (res.ok) {
        setSmpFeedback({
          ok: true,
          ref: res.referenceCode,
          message: isId
            ? `Permintaan uji coba sampel tercatat dengan referensi ${res.referenceCode}. Tim teknis kami akan mengoordinasikan pengiriman kit sampel 5 hingga 10 kg beserta COA batch.`
            : `Sample trial request logged under reference ${res.referenceCode}. Our technical team will coordinate dispatch of your 5 to 10 kg sample kit and batch COA.`,
        });
        setSmpCompany("");
        setSmpContact("");
        setSmpEmail("");
        setSmpPhone("");
        setSmpCity("");
        setSmpAddress("");
        setSmpMachine("");
        setSmpWindow("");
        setSmpNotes("");
      } else {
        setSmpFeedback({
          ok: false,
          message:
            res.error ||
            (isId
              ? "Gagal mengirim permintaan sampel."
              : "Unable to submit sample request."),
        });
      }
    } catch {
      setSmpFeedback({
        ok: false,
        message: isId
          ? "Terjadi kesalahan jaringan saat mengirim permintaan sampel Anda."
          : "A network error occurred while submitting your sample request.",
      });
    } finally {
      setSmpSubmitting(false);
    }
  }

  return (
    <div className="border border-[#101C2B]/20 bg-white">
      {/* Mode selector tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#101C2B]/15">
        <button
          type="button"
          onClick={() => setActiveTab("rfq")}
          className={`p-5 text-left transition-colors ${
            activeTab === "rfq"
              ? "bg-[#101C2B] text-white"
              : "bg-[#F3F5F6] text-[#101C2B] hover:bg-[#e7ebee]"
          }`}
        >
          <span
            className={`font-mono-tech text-xs uppercase tracking-widest block ${
              activeTab === "rfq" ? "text-[#FFD71C]" : "text-[#123A68]"
            }`}
          >
            {isId ? "Alur 01 / RFQ Komersial" : "Workflow 01 / Commercial RFQ"}
          </span>
          <span className="font-display text-lg font-bold mt-1 block">
            {isId
              ? "Minta Penawaran / Adaptive Supply / Toll-Recycling"
              : "Request Quotation / Adaptive Supply / Toll-Recycling"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sample")}
          className={`p-5 text-left transition-colors border-t sm:border-t-0 sm:border-l border-[#101C2B]/15 ${
            activeTab === "sample"
              ? "bg-[#101C2B] text-white"
              : "bg-[#F3F5F6] text-[#101C2B] hover:bg-[#e7ebee]"
          }`}
        >
          <span
            className={`font-mono-tech text-xs uppercase tracking-widest block ${
              activeTab === "sample" ? "text-[#02BDEA]" : "text-[#123A68]"
            }`}
          >
            {isId
              ? "Alur 02 / Validasi Teknis"
              : "Workflow 02 / Technical Validation"}
          </span>
          <span className="font-display text-lg font-bold mt-1 block">
            {isId
              ? "Minta Sampel Gratis 5-10 kg & Uji Coba di Pabrik"
              : "Request 5-10 kg Complimentary Sample & On-Site Trial"}
          </span>
        </button>
      </div>

      {/* Form 1: RFQ */}
      {activeTab === "rfq" ? (
        <form onSubmit={handleRfqSubmit} className="p-6 sm:p-10 space-y-6">
          <div className="border-b border-[#101C2B]/10 pb-4">
            <h3 className="font-display text-2xl font-bold text-[#101C2B]">
              {isId
                ? "Permintaan Penawaran Komersial & Kemitraan Pasokan"
                : "Commercial Quotation & Partnership Inquiry"}
            </h3>
            <p className="text-sm text-[#4B5B6E] mt-1">
              {isId
                ? "Kirimkan kebutuhan grade polimer, tonase bulanan, atau parameter maklon sirkular (closed-loop toll-recycling) Anda. Seluruh pengajuan tersimpan langsung ke kotak masuk Sales & Engineering PrimeFlow."
                : "Submit your polymer grade requirements, monthly tonnage, or closed-loop toll-recycling parameters. All submissions are persisted directly to the PrimeFlow Sales & Engineering inbox."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Nama Perusahaan Manufaktur *"
                  : "Manufacturing Company Name *"}
              </label>
              <input
                type="text"
                required
                value={rfqCompany}
                onChange={(e) => setRfqCompany(e.target.value)}
                placeholder="PT / CV ..."
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Nama Kontak & Jabatan *" : "Contact Person & Role *"}
              </label>
              <input
                type="text"
                required
                value={rfqContact}
                onChange={(e) => setRfqContact(e.target.value)}
                placeholder={
                  isId
                    ? "Nama (Purchasing / Manajer Pabrik)"
                    : "Name (Purchasing / Plant Manager)"
                }
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Email Bisnis *" : "Business Email *"}
              </label>
              <input
                type="email"
                required
                value={rfqEmail}
                onChange={(e) => setRfqEmail(e.target.value)}
                placeholder="procurement@company.co.id"
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Nomor Telepon / WhatsApp *"
                  : "Phone / WhatsApp Number *"}
              </label>
              <input
                type="tel"
                required
                value={rfqPhone}
                onChange={(e) => setRfqPhone(e.target.value)}
                placeholder="+62 812 ..."
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Jenis Program Komersial" : "Commercial Program Type"}
              </label>
              <select
                value={rfqType}
                onChange={(e) => setRfqType(e.target.value as InquiryType)}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-3.5 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              >
                <option value="RFQ">
                  {isId
                    ? "Penawaran Resin Standar (RFQ)"
                    : "Standard Resin Quotation (RFQ)"}
                </option>
                <option value="ADAPTIVE_SUPPLY">
                  {isId
                    ? "Kontrak Adaptive Locked-Supply"
                    : "Adaptive Locked-Supply Contract"}
                </option>
                <option value="TOLL_RECYCLING">
                  {isId
                    ? "Closed-Loop Toll-Recycling (Maklon)"
                    : "Closed-Loop Toll-Recycling (Maklon)"}
                </option>
                <option value="CONSULTATION">
                  {isId
                    ? "Konsultasi Substitusi Material"
                    : "Material Substitution Consultation"}
                </option>
              </select>
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Target Grade PrimeFlow" : "Target PrimeFlow Grade"}
              </label>
              <select
                value={rfqGrade}
                onChange={(e) => setRfqGrade(e.target.value)}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-3.5 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              >
                <option value="PP 100">PrimeFlow PP 100 (Polypropylene)</option>
                <option value="HDPE 100">PrimeFlow HDPE 100 (High-Density PE)</option>
                <option value="LDPE 200">PrimeFlow LDPE 200 (Film Grade LDPE)</option>
                <option value="PE 150">PrimeFlow PE 150 (Utility Polyethylene)</option>
                <option value="Custom / Multi-Grade">
                  {isId
                    ? "Kustom / Beberapa Grade Polimer"
                    : "Custom / Multiple Polymer Grades"}
                </option>
              </select>
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Estimasi Volume Bulanan (kg)"
                  : "Estimated Monthly Volume (kg)"}
              </label>
              <input
                type="number"
                min="25"
                step="25"
                value={rfqVolume}
                onChange={(e) => setRfqVolume(e.target.value)}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm font-mono-tech text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Segmen Konversi" : "Conversion Segment"}
              </label>
              <select
                value={rfqSegment}
                onChange={(e) => setRfqSegment(e.target.value)}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-3.5 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              >
                <option value="Injection Molding">Injection Molding</option>
                <option value="Blow Molding">Extrusion Blow Molding</option>
                <option value="Blown / Cast Film">Blown / Cast Film Extrusion</option>
                <option value="Thermoforming / Sheet">Thermoforming &amp; Sheet</option>
                <option value="Industrial Packaging">
                  {isId
                    ? "Kemasan Industri & Rumah Tangga"
                    : "Industrial & Household Packaging"}
                </option>
              </select>
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Preferensi Jadwal Pengiriman"
                  : "Preferred Delivery Cadence"}
              </label>
              <input
                type="text"
                value={rfqSchedule}
                onChange={(e) => setRfqSchedule(e.target.value)}
                placeholder={
                  isId
                    ? "mis. Pengiriman bertahap 2.5 ton/minggu sesuai kapasitas gudang"
                    : "e.g., Weekly 2.5-ton drops synced to warehouse space"
                }
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
              {isId
                ? "Aplikasi Produk Akhir (Non-Food Grade)"
                : "End-Product Application (Non-Food Grade)"}
            </label>
            <input
              type="text"
              value={rfqApplication}
              onChange={(e) => setRfqApplication(e.target.value)}
              placeholder={
                isId
                  ? "mis. Kontainer penyimpanan rumah tangga, jerigen deterjen 5L, inner liner"
                  : "e.g., Household storage crates, 5L detergent jerrycans, protective liner film"
              }
              className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
              {isId
                ? "Catatan Spesifikasi Teknis & Pengadaan"
                : "Technical Specification & Procurement Notes"}
            </label>
            <textarea
              rows={3}
              value={rfqMessage}
              onChange={(e) => setRfqMessage(e.target.value)}
              placeholder={
                isId
                  ? "Sebutkan target rentang MFI, kebutuhan warna, rasio campuran virgin saat ini, atau volume skrap internal untuk maklon..."
                  : "Specify target MFI range, color requirement, current virgin resin blend ratio, or internal scrap volume for toll-recycling..."
              }
              className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
            />
          </div>

          {rfqFeedback && (
            <div
              className={`p-4 border font-mono-tech text-xs leading-relaxed ${
                rfqFeedback.ok
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                  : "border-rose-600 bg-rose-50 text-rose-900"
              }`}
            >
              {rfqFeedback.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <span className="text-xs text-[#4B5B6E]">
              {isId
                ? "Dilindungi oleh validasi server dan kontrol akses RLS."
                : "Protected by server-side validation and RLS access controls."}
            </span>
            <button
              type="submit"
              disabled={rfqSubmitting}
              className="px-8 py-4 bg-[#101C2B] text-[#FFD71C] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#123A68] transition-colors disabled:opacity-50"
            >
              {rfqSubmitting
                ? isId
                  ? "Mengirim Permintaan Penawaran..."
                  : "Submitting Quotation Request..."
                : isId
                ? "Kirim RFQ Resmi"
                : "Submit Official RFQ"}
            </button>
          </div>
        </form>
      ) : (
        /* Form 2: Sample Request */
        <form onSubmit={handleSampleSubmit} className="p-6 sm:p-10 space-y-6">
          <div className="border-b border-[#101C2B]/10 pb-4">
            <h3 className="font-display text-2xl font-bold text-[#101C2B]">
              {isId
                ? "Permintaan Kit Sampel Gratis 5-10 kg & Uji Coba di Pabrik"
                : "Complimentary 5-10 kg Sample Kit & On-Site Trial Request"}
            </h3>
            <p className="text-sm text-[#4B5B6E] mt-1">
              {isId
                ? "Untuk menghilangkan keraguan teknis terhadap resin daur ulang, PrimeFlow menyediakan kit sampel gratis 5 hingga 10 kg disertai Certificate of Analysis (COA) batch dan pendampingan teknisi langsung saat kalibrasi mesin."
                : "To eliminate technical skepticism toward recycled resin, PrimeFlow provides a complimentary 5 to 10 kg sample kit accompanied by a batch Certificate of Analysis (COA) and optional on-site technician support during machine calibration."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Nama Perusahaan Manufaktur *"
                  : "Manufacturing Company Name *"}
              </label>
              <input
                type="text"
                required
                value={smpCompany}
                onChange={(e) => setSmpCompany(e.target.value)}
                placeholder="PT / CV ..."
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Kontak Engineer QA / Produksi *"
                  : "QA / Production Engineer Contact *"}
              </label>
              <input
                type="text"
                required
                value={smpContact}
                onChange={(e) => setSmpContact(e.target.value)}
                placeholder={isId ? "Nama Lengkap & Jabatan" : "Full Name & Title"}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Email Bisnis *" : "Business Email *"}
              </label>
              <input
                type="email"
                required
                value={smpEmail}
                onChange={(e) => setSmpEmail(e.target.value)}
                placeholder="qc@factory.co.id"
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Telepon / WhatsApp *" : "Phone / WhatsApp *"}
              </label>
              <input
                type="tel"
                required
                value={smpPhone}
                onChange={(e) => setSmpPhone(e.target.value)}
                placeholder="+62 812 ..."
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Grade yang Dievaluasi *" : "Grade to Evaluate *"}
              </label>
              <select
                value={smpGrade}
                onChange={(e) => setSmpGrade(e.target.value)}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-3.5 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              >
                <option value="PP 100">PrimeFlow PP 100 (Lot PF-11223)</option>
                <option value="HDPE 100">PrimeFlow HDPE 100 (Lot PF-12345)</option>
                <option value="LDPE 200">PrimeFlow LDPE 200 (Film Grade)</option>
                <option value="PE 150">PrimeFlow PE 150 (Utility PE)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Kuantitas Kit Sampel (kg) *" : "Sample Kit Quantity (kg) *"}
              </label>
              <select
                value={smpKg}
                onChange={(e) => setSmpKg(e.target.value)}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-3.5 py-3 text-sm font-mono-tech text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              >
                <option value="5">
                  {isId ? "5 kg Kit Uji Coba Gratis" : "5 kg Complimentary Trial Kit"}
                </option>
                <option value="10">
                  {isId
                    ? "10 kg Kit Uji Coba Gratis"
                    : "10 kg Complimentary Trial Kit"}
                </option>
                <option value="25">
                  {isId
                    ? "25 kg Karung Prototipe Penuh (PF-11223 / PF-12345)"
                    : "25 kg Full Prototype Sack (PF-11223 / PF-12345)"}
                </option>
              </select>
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Proses Konversi *" : "Conversion Process *"}
              </label>
              <select
                value={smpProcess}
                onChange={(e) => setSmpProcess(e.target.value)}
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-3.5 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              >
                <option value="Injection Molding">Injection Molding</option>
                <option value="Extrusion Blow Molding">Extrusion Blow Molding</option>
                <option value="Blown Film Extrusion">Blown Film Extrusion</option>
                <option value="Sheet / Profile Extrusion">Sheet / Profile Extrusion</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Kota Pabrik / Kawasan Industri *"
                  : "Plant City / Industrial Estate *"}
              </label>
              <input
                type="text"
                required
                value={smpCity}
                onChange={(e) => setSmpCity(e.target.value)}
                placeholder="e.g., Cikarang, Tangerang, Bogor, Karawang"
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId
                  ? "Tonase Mesin / Model Ekstruder"
                  : "Machine Tonnage / Extruder Model"}
              </label>
              <input
                type="text"
                value={smpMachine}
                onChange={(e) => setSmpMachine(e.target.value)}
                placeholder="e.g., 250T Injection Press / 55mm Blown Film Line"
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Alamat Pengiriman Pabrik" : "Factory Shipping Address"}
              </label>
              <input
                type="text"
                value={smpAddress}
                onChange={(e) => setSmpAddress(e.target.value)}
                placeholder={
                  isId
                    ? "Jalan / Blok Kawasan Industri untuk pengiriman sampel"
                    : "Street / Kawasan Industri block for sample dispatch"
                }
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
                {isId ? "Jadwal Uji Coba yang Diinginkan" : "Preferred Trial Window"}
              </label>
              <input
                type="text"
                value={smpWindow}
                onChange={(e) => setSmpWindow(e.target.value)}
                placeholder={
                  isId
                    ? "mis. Minggu depan, shift pagi"
                    : "e.g., Week of Nov 16, morning shift"
                }
                className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="border border-[#101C2B]/15 bg-[#F3F5F6]/60 p-4 flex items-start gap-3">
            <input
              id="onsite-tech-checkbox"
              type="checkbox"
              checked={smpTechnician}
              onChange={(e) => setSmpTechnician(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#101C2B]"
            />
            <label
              htmlFor="onsite-tech-checkbox"
              className="text-xs text-[#101C2B] leading-relaxed"
            >
              <strong className="font-mono-tech uppercase tracking-wider block">
                {isId
                  ? "Minta Pendampingan Teknisi Uji Coba di Lokasi (Koridor Jabodetabek)"
                  : "Request On-Site Technical Trial Accompaniment (Jabodetabek Corridor)"}
              </strong>
              {isId
                ? "Sertakan perwakilan teknis PrimeFlow selama uji coba mesin Anda untuk membantu pengaturan profil suhu barrel dan verifikasi penyusutan (shrinkage)."
                : "Include a PrimeFlow technical representative during your machine trial to assist with barrel temperature profiling and shrinkage verification."}
            </label>
          </div>

          <div>
            <label className="block font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] mb-1.5">
              {isId ? "Catatan Cetakan & Uji Coba" : "Tooling & Trial Notes"}
            </label>
            <textarea
              rows={2}
              value={smpNotes}
              onChange={(e) => setSmpNotes(e.target.value)}
              placeholder={
                isId
                  ? "Target cycle time, jumlah cavity, atau perhatian cacat tertentu (mis. die build-up, warpage)..."
                  : "Target cycle time, cavity count, or specific defect concerns (e.g., die build-up, warpage)..."
              }
              className="w-full border border-[#101C2B]/25 bg-[#F3F5F6]/40 px-4 py-3 text-sm text-[#101C2B] focus:border-[#123A68] focus:bg-white focus:outline-none"
            />
          </div>

          {smpFeedback && (
            <div
              className={`p-4 border font-mono-tech text-xs leading-relaxed ${
                smpFeedback.ok
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                  : "border-rose-600 bg-rose-50 text-rose-900"
              }`}
            >
              {smpFeedback.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <span className="text-xs text-[#4B5B6E]">
              {isId
                ? "Setiap kit sampel dikirim bersama Certificate of Analysis (COA) batch."
                : "Every sample kit ships with its batch Certificate of Analysis (COA)."}
            </span>
            <button
              type="submit"
              disabled={smpSubmitting}
              className="px-8 py-4 bg-[#02BDEA] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#35cef2] transition-colors disabled:opacity-50"
            >
              {smpSubmitting
                ? isId
                  ? "Mendaftarkan Uji Coba Sampel..."
                  : "Registering Sample Trial..."
                : isId
                ? "Minta Kit Sampel 5-10 kg"
                : "Request 5-10 kg Sample Kit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
