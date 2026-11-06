"use client";

import React, { useMemo, useState } from "react";
import { calculateMaterialSavings } from "@/lib/utils/calculator";
import { submitQuoteRequestAction } from "@/actions/cms-actions";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function MaterialSavingsCalculator() {
  const { isId } = useLanguage();
  const [consumptionValue, setConsumptionValue] = useState<string>("15");
  const [consumptionUnit, setConsumptionUnit] = useState<"tons" | "kg">("tons");
  const [virginPrice, setVirginPrice] = useState<string>("24500");
  // Default PrimeFlow reference benchmark from business proposal: Rp 452,000 / 25 kg = Rp 18,080 / kg
  const [primeflowPrice, setPrimeflowPrice] = useState<string>("18080");

  // Optional embedded inquiry submission state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("PP 100");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    ok: boolean;
    message: string;
    referenceCode?: string;
  } | null>(null);

  const calculation = useMemo(() => {
    return calculateMaterialSavings({
      consumptionValue: Number(consumptionValue),
      consumptionUnit,
      virginPricePerKg: Number(virginPrice),
      primeflowPricePerKg: Number(primeflowPrice),
      currency: "IDR",
    });
  }, [consumptionValue, consumptionUnit, virginPrice, primeflowPrice]);

  const formatIdr = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  async function handleSubmitEstimate(e: React.FormEvent) {
    e.preventDefault();
    if (!calculation.valid || !calculation.snapshot) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await submitQuoteRequestAction({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        inquiry_type: "CALCULATOR_ESTIMATE",
        product_grade: selectedGrade,
        monthly_volume_kg: calculation.snapshot.monthlyVolumeKg,
        delivery_schedule_preference: "Adaptive Locked-Supply (Staggered Monthly Drops)",
        target_application: "Submitted via HPP Material Savings Calculator",
        message: `Estimated monthly volume: ${calculation.snapshot.monthlyVolumeKg.toLocaleString()} kg. Virgin benchmark: Rp ${calculation.snapshot.virginPricePerKg.toLocaleString()}/kg vs PrimeFlow estimate: Rp ${calculation.snapshot.primeflowPricePerKg.toLocaleString()}/kg. Estimated monthly difference: ${formatIdr(calculation.snapshot.monthlySavings)} (${calculation.snapshot.percentageDifference.toFixed(1)}%).`,
        calculator_snapshot: calculation.snapshot,
        honeypot: "",
      });

      if (response.ok) {
        setSubmitResult({
          ok: true,
          referenceCode: response.referenceCode,
          message: isId
            ? `Estimasi tercatat dengan kode referensi ${response.referenceCode}. Tim rekayasa komersial kami akan meninjau profil volume Anda.`
            : `Estimate logged under reference ${response.referenceCode}. Our commercial engineering desk will review your volume profile.`,
        });
        setCompanyName("");
        setContactName("");
        setEmail("");
        setPhone("");
      } else {
        setSubmitResult({
          ok: false,
          message:
            response.error ||
            (isId ? "Gagal mengirim estimasi." : "Unable to submit estimate."),
        });
      }
    } catch {
      setSubmitResult({
        ok: false,
        message: isId
          ? "Terjadi gangguan jaringan saat mengirim estimasi Anda."
          : "A network error occurred while submitting your estimate.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const snap = calculation.snapshot;

  return (
    <div className="border border-[#1E324A] bg-[#0B1420] text-[#F3F5F6]">
      {/* Header bar */}
      <div className="border-b border-[#1E324A] px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#101C2B]">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 bg-[#FFD71C]" />
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
            {isId
              ? "Simulator Interaktif Pengadaan HPP"
              : "Interactive HPP Procurement Simulator"}
          </span>
        </div>
        <span className="font-mono-tech text-xs text-[#F3F5F6]/65">
          {isId
            ? "ACUAN PROPOSAL: Rp 452.000 / KARUNG 25 KG (Rp 18.080 / KG)"
            : "PROPOSAL BENCHMARK: Rp 452,000 / 25 KG SACK (Rp 18,080 / KG)"}
        </span>
      </div>

      {/* Main calculator split */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#1E324A] space-y-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
              {isId
                ? "Konfigurasi Parameter Resin Bulanan"
                : "Configure Monthly Resin Parameters"}
            </h3>
            <p className="text-sm text-[#F3F5F6]/70 mt-1">
              {isId
                ? "Resin polimer mentah umumnya menyumbang 60% hingga 70% dari total biaya produksi plastik. Masukkan konsumsi pabrik dan harga acuan Anda di bawah ini."
                : "Raw polymer resin typically represents 60% to 70% of total plastic conversion cost. Enter your plant consumption and benchmark prices below."}
            </p>
          </div>

          {/* Input 1: Monthly Consumption + Unit Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="calc-consumption"
                className="font-mono-tech text-xs uppercase tracking-wider text-[#F3F5F6]/85"
              >
                {isId
                  ? "01 / Konsumsi Material Bulanan"
                  : "01 / Monthly Material Consumption"}
              </label>
              <div className="inline-flex border border-[#1E324A] bg-[#101C2B]">
                <button
                  type="button"
                  onClick={() => {
                    if (consumptionUnit === "kg") {
                      const num = Number(consumptionValue) || 0;
                      setConsumptionValue(String(Math.max(1, Math.round(num / 1000))));
                      setConsumptionUnit("tons");
                    }
                  }}
                  className={`px-3 py-1 font-mono-tech text-xs uppercase transition-colors ${
                    consumptionUnit === "tons"
                      ? "bg-[#02BDEA] text-[#101C2B] font-semibold"
                      : "text-[#F3F5F6]/70 hover:text-white"
                  }`}
                >
                  {isId ? "Ton Metrik" : "Metric Tons"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (consumptionUnit === "tons") {
                      const num = Number(consumptionValue) || 0;
                      setConsumptionValue(String(Math.round(num * 1000)));
                      setConsumptionUnit("kg");
                    }
                  }}
                  className={`px-3 py-1 font-mono-tech text-xs uppercase transition-colors ${
                    consumptionUnit === "kg"
                      ? "bg-[#02BDEA] text-[#101C2B] font-semibold"
                      : "text-[#F3F5F6]/70 hover:text-white"
                  }`}
                >
                  Kilogram (kg)
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                id="calc-consumption"
                type="number"
                min="0.1"
                step="any"
                value={consumptionValue}
                onChange={(e) => setConsumptionValue(e.target.value)}
                className="w-full bg-[#101C2B] border border-[#1E324A] focus:border-[#02BDEA] focus:outline-none px-4 py-3.5 text-lg font-mono-tech text-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono-tech text-xs uppercase text-[#02BDEA]">
                {consumptionUnit === "tons"
                  ? isId
                    ? "TON / BULAN"
                    : "TONS / MONTH"
                  : isId
                  ? "KG / BULAN"
                  : "KG / MONTH"}
              </span>
            </div>
            {snap && (
              <p className="font-mono-tech text-[11px] text-[#F3F5F6]/60">
                {isId
                  ? `Setara dengan ${snap.monthlyVolumeKg.toLocaleString("id-ID")} kg/bulan (${Math.ceil(snap.monthlyVolumeKg / 25).toLocaleString("id-ID")} karung standar 25 kg).`
                  : `Equivalent to ${snap.monthlyVolumeKg.toLocaleString("id-ID")} kg/month (${Math.ceil(snap.monthlyVolumeKg / 25).toLocaleString("id-ID")} standard 25 kg sacks).`}
              </p>
            )}
          </div>

          {/* Input 2: Current Virgin Resin Price */}
          <div className="space-y-2">
            <label
              htmlFor="calc-virgin-price"
              className="block font-mono-tech text-xs uppercase tracking-wider text-[#F3F5F6]/85"
            >
              {isId
                ? "02 / Harga Resin Murni (Virgin) Saat Ini per Kilogram (IDR)"
                : "02 / Current Virgin Resin Price per Kilogram (IDR)"}
            </label>
            <div className="relative">
              <input
                id="calc-virgin-price"
                type="number"
                min="1000"
                step="100"
                value={virginPrice}
                onChange={(e) => setVirginPrice(e.target.value)}
                className="w-full bg-[#101C2B] border border-[#1E324A] focus:border-[#02BDEA] focus:outline-none px-4 py-3.5 text-lg font-mono-tech text-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono-tech text-xs text-[#F3F5F6]/60">
                IDR / KG
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[22000, 24500, 26000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setVirginPrice(String(preset))}
                  className="px-2.5 py-1 text-[11px] font-mono-tech border border-[#1E324A] text-[#F3F5F6]/75 hover:border-[#02BDEA] hover:text-white"
                >
                  {isId ? "Pilih" : "Set"} Rp {preset.toLocaleString("id-ID")}/kg
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Estimated PrimeFlow Price */}
          <div className="space-y-2">
            <label
              htmlFor="calc-pf-price"
              className="block font-mono-tech text-xs uppercase tracking-wider text-[#F3F5F6]/85"
            >
              {isId
                ? "03 / Estimasi Harga Material PrimeFlow per Kilogram (IDR)"
                : "03 / Estimated PrimeFlow Material Price per Kilogram (IDR)"}
            </label>
            <div className="relative">
              <input
                id="calc-pf-price"
                type="number"
                min="1000"
                step="10"
                value={primeflowPrice}
                onChange={(e) => setPrimeflowPrice(e.target.value)}
                className="w-full bg-[#101C2B] border border-[#1E324A] focus:border-[#FFD71C] focus:outline-none px-4 py-3.5 text-lg font-mono-tech text-[#FFD71C]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono-tech text-xs text-[#FFD71C]/80">
                IDR / KG
              </span>
            </div>
            <p className="font-mono-tech text-[11px] text-[#F3F5F6]/60">
              {isId
                ? "Harga referensi proposal: Rp 18.080/kg (Rp 452.000 per karung woven PP 25 kg berpelapis inner-liner). Harga kontrak aktual bergantung pada grade polimer, paket aditif, dan volume bulanan."
                : "Proposal reference price: Rp 18,080/kg (Rp 452,000 per 25 kg woven PP inner-liner bag). Actual contract price depends on polymer grade, additive package, and monthly volume."}
            </p>
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#101C2B]/60 space-y-6">
          {!calculation.valid || !snap ? (
            <div className="border border-amber-400/40 bg-amber-950/20 p-6 text-amber-200 text-sm font-mono-tech">
              {calculation.error ||
                (isId
                  ? "Harap masukkan angka positif yang valid untuk menghitung estimasi Anda."
                  : "Please enter valid positive numbers to compute your estimate.")}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E324A] pb-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                    {isId ? "Hasil Simulasi" : "Simulation Readout"}
                  </span>
                  <h4 className="font-display text-lg font-semibold text-white mt-0.5">
                    {isId
                      ? "Perbandingan Estimasi Pengadaan"
                      : "Estimated Procurement Comparison"}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-mono-tech text-xs text-[#F3F5F6]/60 block">
                    {isId ? "SELISIH PER UNIT" : "UNIT DIFFERENCE"}
                  </span>
                  <span
                    className={`font-mono-tech text-xl font-bold ${
                      snap.percentageDifference >= 0
                        ? "text-[#FFD71C]"
                        : "text-rose-400"
                    }`}
                  >
                    {snap.percentageDifference.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-[#1E324A] bg-[#0B1420] p-4">
                  <span className="font-mono-tech text-[11px] uppercase text-[#F3F5F6]/60 block">
                    {isId
                      ? "Biaya Resin Murni Bulanan"
                      : "Monthly Virgin Resin Expenditure"}
                  </span>
                  <span className="font-mono-tech text-lg sm:text-xl font-semibold text-white mt-1.5 block">
                    {formatIdr(snap.monthlyVirginCost)}
                  </span>
                </div>
                <div className="border border-[#02BDEA]/50 bg-[#0B1420] p-4">
                  <span className="font-mono-tech text-[11px] uppercase text-[#02BDEA] block">
                    {isId
                      ? "Biaya PrimeFlow Bulanan"
                      : "Monthly PrimeFlow Expenditure"}
                  </span>
                  <span className="font-mono-tech text-lg sm:text-xl font-semibold text-[#02BDEA] mt-1.5 block">
                    {formatIdr(snap.monthlyPrimeflowCost)}
                  </span>
                </div>
              </div>

              <div className="border-l-4 border-[#FFD71C] bg-[#0B1420] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-[#F3F5F6]/80">
                    {isId
                      ? "Estimasi Penghematan Bulanan"
                      : "Monthly Estimated Savings"}
                  </span>
                  <span className="font-mono-tech text-2xl sm:text-3xl font-bold text-[#FFD71C]">
                    {formatIdr(snap.monthlySavings)}
                  </span>
                </div>
                <div className="border-t border-[#1E324A] pt-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-[#F3F5F6]/80">
                    {isId
                      ? "Estimasi Penghematan Tahunan (12 Bulan)"
                      : "Annual Estimated Savings (12 Months)"}
                  </span>
                  <span className="font-mono-tech text-xl sm:text-2xl font-semibold text-white">
                    {formatIdr(snap.annualSavings)}
                  </span>
                </div>
              </div>

              {/* Mandatory Qualification Disclaimer */}
              <div className="border border-[#1E324A] bg-[#0B1420]/90 p-4 text-xs text-[#F3F5F6]/70 leading-relaxed">
                <strong className="text-[#F3F5F6] font-mono-tech uppercase tracking-wider">
                  {isId ? "Catatan Estimasi:" : "Estimation Notice:"}
                </strong>{" "}
                {isId
                  ? "Perhitungan ini merupakan simulasi finansial indikatif untuk perencanaan pengadaan semata. Simulasi ini tidak menjamin persentase penghematan tetap dan tidak terhubung pada indeks bursa komoditas langsung. Harga komersial aktual bergantung pada spesifikasi grade, rasio substitusi, jadwal pengiriman, dan verifikasi uji coba batch."
                  : "This calculation is an indicative financial simulation for procurement planning only. It does not guarantee a fixed savings percentage and does not rely on live commodity exchange feeds. Actual commercial pricing depends on grade specification, substitution ratio, delivery schedule, and batch trial verification."}
              </div>
            </div>
          )}

          {/* Action to attach calculation to a business inquiry */}
          <div className="pt-2">
            {!showSubmitModal ? (
              <button
                type="button"
                disabled={!calculation.valid}
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-4 px-6 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe14f] transition-colors disabled:opacity-50"
              >
                {isId
                  ? "Kirim Estimasi untuk Evaluasi Komersial & COA"
                  : "Submit Estimate for Commercial & COA Evaluation"}{" "}
                &rarr;
              </button>
            ) : (
              <form
                onSubmit={handleSubmitEstimate}
                className="border border-[#02BDEA] bg-[#0B1420] p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-[#02BDEA]">
                    {isId
                      ? "Lampirkan Estimasi ke Permintaan Bisnis"
                      : "Attach Estimate to Business Inquiry"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="font-mono-tech text-xs text-[#F3F5F6]/60 hover:text-white"
                  >
                    {isId ? "TUTUP [X]" : "CLOSE [X]"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      {isId ? "Nama Perusahaan *" : "Company Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="PT ..."
                      className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm text-white focus:border-[#02BDEA] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      {isId ? "Nama Kontak *" : "Contact Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={
                        isId
                          ? "Manajer Purchasing / Pabrik"
                          : "Procurement / Plant Manager"
                      }
                      className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm text-white focus:border-[#02BDEA] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      {isId ? "Email Bisnis *" : "Business Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.co.id"
                      className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm text-white focus:border-[#02BDEA] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      {isId ? "Telepon / WhatsApp *" : "Phone / WhatsApp *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+62 812 ..."
                      className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm text-white focus:border-[#02BDEA] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                    {isId ? "Target Keluarga Grade Polimer" : "Target Polymer Grade Family"}
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm text-white focus:border-[#02BDEA] focus:outline-none"
                  >
                    <option value="PP 100">PrimeFlow PP 100 (Polypropylene)</option>
                    <option value="HDPE 100">PrimeFlow HDPE 100 (High-Density PE)</option>
                    <option value="LDPE 200">PrimeFlow LDPE 200 (Film Grade LDPE)</option>
                    <option value="PE 150">PrimeFlow PE 150 (Utility Polyethylene)</option>
                  </select>
                </div>

                {submitResult && (
                  <div
                    className={`p-3 text-xs font-mono-tech border ${
                      submitResult.ok
                        ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"
                        : "border-rose-500/50 bg-rose-950/30 text-rose-200"
                    }`}
                  >
                    {submitResult.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#02BDEA] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#35cef2] transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? isId
                      ? "Mengirim Kalkulasi ke Meja Sales..."
                      : "Transmitting Calculation to Sales Desk..."
                    : isId
                    ? "Kirim Kalkulasi & Minta Penawaran Khusus"
                    : "Transmit Calculation & Request Custom Quotation"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
