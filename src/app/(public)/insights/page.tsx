import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedArticles } from "@/lib/data-store";
import { getServerLocale } from "@/lib/i18n/locale-server";
import { localizeArticles } from "@/lib/i18n/localize-data";

export const metadata: Metadata = {
  title: "Technical Insights | Polymer Rheology, QC & B2B Supply Strategy",
  description:
    "Engineering articles and technical notes from PrimeFlow covering post-industrial polyolefin rheology, NIR sorting, vacuum degassing, and Adaptive Locked-Supply.",
};

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, rawArticles, locale] = await Promise.all([
    searchParams,
    getPublishedArticles(),
    getServerLocale(),
  ]);

  const isId = locale === "id";
  const articles = localizeArticles(rawArticles, locale);

  const categories = Array.from(
    new Set(articles.map((a) => a.category_name))
  );

  const visibleArticles =
    category && category !== "ALL"
      ? articles.filter((a) => a.category_name === category)
      : articles;

  return (
    <div>
      {/* Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-5">
          <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#02BDEA]">
            {isId
              ? "JURNAL TEKNIS TERHUBUNG CMS"
              : "CMS-DRIVEN TECHNICAL JOURNAL"}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white max-w-4xl leading-[1.03]">
            {isId
              ? "Wawasan Rekayasa Polimer & Rantai Pasok."
              : "Polymer Engineering & Supply Chain Insights."}
          </h1>
          <p className="text-base sm:text-lg text-[#F3F5F6]/80 max-w-2xl leading-relaxed">
            {isId
              ? "Catatan riset, metodologi kontrol kualitas, dan kerangka pengadaan bagi praktisi kemasan plastik, injection molding, serta blow molding."
              : "Research notes, quality control methodologies, and procurement frameworks for plastic packaging, injection molding, and blow molding professionals."}
          </p>
        </div>
      </section>

      {/* Category filter + Article list */}
      <section className="py-16 lg:py-20 bg-[#F3F5F6]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 space-y-10">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#101C2B]/15 pb-6">
            <Link
              href="/insights"
              className={`px-4 py-2 font-mono-tech text-xs uppercase tracking-wider border ${
                !category || category === "ALL"
                  ? "bg-[#101C2B] text-[#FFD71C] border-[#101C2B]"
                  : "bg-white text-[#101C2B] border-[#101C2B]/20 hover:border-[#101C2B]"
              }`}
            >
              {isId
                ? `Semua Artikel Teknis (${articles.length})`
                : `All Technical Briefs (${articles.length})`}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/insights?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 font-mono-tech text-xs uppercase tracking-wider border ${
                  category === cat
                    ? "bg-[#101C2B] text-[#FFD71C] border-[#101C2B]"
                    : "bg-white text-[#101C2B] border-[#101C2B]/20 hover:border-[#101C2B]"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {visibleArticles.map((article, idx) => (
              <article
                key={article.id}
                className="border border-[#101C2B]/20 bg-white flex flex-col justify-between group hover:border-[#101C2B] transition-colors"
              >
                <div>
                  <div className="px-6 py-3.5 bg-[#101C2B] text-[#F3F5F6] flex items-center justify-between font-mono-tech text-xs">
                    <span className="text-[#02BDEA]">
                      {article.category_name.toUpperCase()}
                    </span>
                    <span className="text-[#F3F5F6]/70">
                      {article.reading_time_minutes}{" "}
                      {isId ? "MNT BACA" : "MIN READ"}
                    </span>
                  </div>

                  <div className="relative h-56 bg-[#101C2B] overflow-hidden border-b border-[#101C2B]/10">
                    <Image
                      src={article.cover_image_url}
                      alt={article.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B1420]/85 px-2.5 py-1 font-mono-tech text-[10px] text-[#FFD71C]">
                      BRIEF 0{idx + 1}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="font-mono-tech text-[11px] text-[#4B5B6E]">
                      {isId ? "DITERBITKAN " : "PUBLISHED "}
                      {new Date(article.published_at).toLocaleDateString(
                        isId ? "id-ID" : "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <h2 className="font-display text-xl font-bold text-[#101C2B] group-hover:text-[#123A68] leading-snug">
                      <Link href={`/insights/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-[#4B5B6E] leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#101C2B]/10 bg-[#F3F5F6]/60 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-semibold text-[#101C2B]">
                      {article.author_name}
                    </div>
                    <div className="font-mono-tech text-[10px] text-[#4B5B6E]">
                      {article.author_role}
                    </div>
                  </div>
                  <Link
                    href={`/insights/${article.slug}`}
                    className="font-mono-tech text-xs font-semibold uppercase tracking-wider text-[#123A68] hover:underline"
                  >
                    {isId ? "Baca" : "Read"} &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
