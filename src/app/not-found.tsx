import React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#101C2B] text-[#F3F5F6]">
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full border border-[#1E324A] bg-[#0B1420] p-10 space-y-6">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
            STATUS 404 | RESOURCE NOT LOCATED
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            The Requested Material Specification or Route Does Not Exist.
          </h1>
          <p className="text-sm text-[#F3F5F6]/75 leading-relaxed">
            Verify the grade slug or navigate back to the PrimeFlow Materials Library to inspect published Polypropylene (PP) and Polyethylene (PE, HDPE, LDPE) specifications.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/products"
              className="px-6 py-3 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-wider"
            >
              Open Materials Library
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-[#02BDEA] text-[#02BDEA] font-mono-tech text-xs uppercase tracking-wider"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
