"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginInternalAction } from "@/actions/cms-actions";
import { LanguageToggle, useLanguage } from "@/lib/i18n/LanguageContext";

const AUTHORIZED_STAFF_PROFILES = [
  {
    email: "zidannnugroho@apps.ipb.ac.id",
    name: "Muhammad Zidan Nugroho",
    role: "SUPER_ADMIN",
    scopeEn:
      "Full internal control, RBAC user management, settings, products & inquiries",
    scopeId:
      "Kontrol internal penuh, manajemen pengguna RBAC, pengaturan, produk & permintaan RFQ/sampel",
  },
  {
    email: "audinamaharani225@gmail.com",
    name: "Audina Maharani",
    role: "ADMIN_CMS",
    scopeEn:
      "Manage public content, product catalog, articles, documents & SEO metadata",
    scopeId:
      "Kelola konten publik, katalog produk, artikel, dokumen & metadata SEO",
  },
  {
    email: "karimabdulazis154@gmail.com",
    name: "Karim Abdul Azis",
    role: "SALES",
    scopeEn:
      "Manage RFQ inbox, sample trial requests, inquiry status & internal sales notes",
    scopeId:
      "Kelola kotak masuk RFQ, permintaan uji coba sampel, status prospek & catatan internal sales",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { isId } = useLanguage();
  const [email, setEmail] = useState("zidannnugroho@apps.ipb.ac.id");
  const [passcode, setPasscode] = useState("PRIMEFLOW-2026");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginInternalAction(email, passcode);
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg(
          res.error ||
            (isId ? "Autentikasi ditolak." : "Authentication rejected.")
        );
      }
    } catch {
      setErrorMsg(
        isId
          ? "Terjadi kesalahan saat proses autentikasi."
          : "An unexpected error occurred during authentication."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-industrial-grid-dark text-[#F3F5F6] flex flex-col justify-between">
      {/* Top bar */}
      <header className="border-b border-[#1E324A] bg-[#0B1420]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/logo-symbol.png"
              alt="PrimeFlow symbol"
              width={40}
              height={32}
              className="object-contain h-8 w-auto"
            />
            <span className="font-display font-bold text-lg tracking-tight">
              <span className="text-[#FFD71C]">PRIME</span>
              <span className="text-[#02BDEA]">FLOW</span>
              <span className="font-mono-tech text-xs text-[#F3F5F6]/60 ml-2.5 uppercase hidden sm:inline">
                |{" "}
                {isId
                  ? "KONSOL OPERASIONAL INTERNAL"
                  : "INTERNAL OPERATING CONSOLE"}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle compact />
            <Link
              href="/"
              className="font-mono-tech text-xs uppercase tracking-wider text-[#02BDEA] hover:underline"
            >
              &larr; {isId ? "Kembali ke Website Publik" : "Return to Public Website"}
            </Link>
          </div>
        </div>
      </header>

      {/* Main auth split */}
      <main className="mx-auto max-w-[1150px] w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 cols: Login Form */}
        <div className="lg:col-span-6 border border-[#1E324A] bg-[#0B1420] p-8 sm:p-10 space-y-6">
          <div className="space-y-2 border-b border-[#1E324A] pb-5">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
              {isId
                ? "GERBANG AUTENTIKASI RBAC"
                : "RBAC AUTHENTICATION GATEWAY"}
            </span>
            <h1 className="font-display text-3xl font-bold text-white">
              {isId ? "Masuk Staf Internal" : "Staff Sign-In"}
            </h1>
            <p className="text-xs text-[#F3F5F6]/70 leading-relaxed">
              {isId
                ? "Pendaftaran publik dinonaktifkan. Hanya pengguna internal PrimeFlow yang diundang (SUPER_ADMIN, ADMIN_CMS, SALES) yang dapat masuk."
                : "Public registration is disabled. Only invited PrimeFlow internal users (SUPER_ADMIN, ADMIN_CMS, SALES) may authenticate."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block font-mono-tech text-xs uppercase tracking-wider text-[#F3F5F6]/85 mb-1.5"
              >
                {isId ? "Email Staf Terotorisasi" : "Authorized Staff Email"}
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#101C2B] border border-[#1E324A] px-4 py-3 text-sm font-mono-tech text-white focus:border-[#02BDEA] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="login-passcode"
                className="block font-mono-tech text-xs uppercase tracking-wider text-[#F3F5F6]/85 mb-1.5"
              >
                {isId
                  ? "Kata Sandi / Kunci Akses Operator"
                  : "Password / Operator Access Key"}
              </label>
              <input
                id="login-passcode"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#101C2B] border border-[#1E324A] px-4 py-3 text-sm font-mono-tech text-white focus:border-[#02BDEA] focus:outline-none"
              />
              <p className="font-mono-tech text-[11px] text-[#F3F5F6]/55 mt-1.5">
                {isId ? (
                  <>
                    Saat variabel lingkungan Supabase Auth dikonfigurasi, masukkan kata sandi Supabase Anda. Pada mode konsol pengembangan lokal, kunci akses bawaan adalah{" "}
                    <code className="text-[#FFD71C]">PRIMEFLOW-2026</code>.
                  </>
                ) : (
                  <>
                    When Supabase Auth env variables are configured, enter your Supabase password. In local development console mode, default access key is{" "}
                    <code className="text-[#FFD71C]">PRIMEFLOW-2026</code>.
                  </>
                )}
              </p>
            </div>

            {errorMsg && (
              <div className="border border-rose-500/60 bg-rose-950/40 p-3.5 font-mono-tech text-xs text-rose-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe14f] transition-colors disabled:opacity-50"
            >
              {loading
                ? isId
                  ? "Memverifikasi Peran & Membuka Sesi..."
                  : "Verifying Role & Establishing Session..."
                : isId
                ? "Masuk ke Konsol Operasional"
                : "Authenticate to Operating Console"}
            </button>
          </form>
        </div>

        {/* Right 6 cols: Role Switcher Quick-Fill for QA Verification */}
        <div className="lg:col-span-6 border border-[#1E324A] bg-[#0B1420]/90 p-8 sm:p-10 space-y-6">
          <div className="space-y-2 border-b border-[#1E324A] pb-4">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
              {isId
                ? "MATRIKS KONTROL AKSES BERBASIS PERAN (RBAC)"
                : "ROLE-BASED ACCESS CONTROL (RBAC) MATRIX"}
            </span>
            <h2 className="font-display text-xl font-bold text-white">
              {isId
                ? "Pilih Profil Staf Terotorisasi untuk Menguji Hak Akses"
                : "Select an Authorized Staff Profile to Test Permissions"}
            </h2>
            <p className="text-xs text-[#F3F5F6]/70">
              {isId
                ? "Klik salah satu profil di bawah ini untuk mengisi kredensial secara otomatis dan memverifikasi batasan otorisasi server untuk SUPER_ADMIN, ADMIN_CMS, dan SALES."
                : "Click any profile below to pre-fill credentials and verify server-enforced authorization boundaries for SUPER_ADMIN, ADMIN_CMS, and SALES."}
            </p>
          </div>

          <div className="space-y-3">
            {AUTHORIZED_STAFF_PROFILES.map((prof) => {
              const selected =
                email.toLowerCase() === prof.email.toLowerCase();
              return (
                <button
                  key={prof.email}
                  type="button"
                  onClick={() => {
                    setEmail(prof.email);
                    setPasscode("PRIMEFLOW-2026");
                  }}
                  className={`w-full text-left p-4 border transition-colors ${
                    selected
                      ? "border-[#02BDEA] bg-[#101C2B]"
                      : "border-[#1E324A] bg-[#0B1420] hover:border-[#02BDEA]/50"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono-tech text-xs">
                    <span className="font-bold text-white">{prof.name}</span>
                    <span className="px-2 py-0.5 bg-[#123A68] text-[#FFD71C]">
                      {prof.role}
                    </span>
                  </div>
                  <div className="font-mono-tech text-xs text-[#02BDEA] mt-1">
                    {prof.email}
                  </div>
                  <p className="text-xs text-[#F3F5F6]/65 mt-2 leading-relaxed">
                    {isId ? prof.scopeId : prof.scopeEn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1E324A] bg-[#080F18] py-4 px-6 text-center font-mono-tech text-xs text-[#F3F5F6]/50">
        {isId
          ? "KEAMANAN & PENEGAKAN RBAC PRIMEFLOW | TANPA REGISTRASI ADMIN PUBLIK"
          : "PRIMEFLOW SECURITY & RBAC ENFORCEMENT | NO PUBLIC ADMIN REGISTRATION"}
      </footer>
    </div>
  );
}
