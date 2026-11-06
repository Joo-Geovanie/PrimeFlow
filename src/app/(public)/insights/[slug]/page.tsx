import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/data-store";
import { getServerLocale } from "@/lib/i18n/locale-server";
import { localizeArticle, localizeArticles } from "@/lib/i18n/localize-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: "Technical Brief Not Found" };
  }
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, rawArticle, rawAllArticles] = await Promise.all([
    getServerLocale(),
    getArticleBySlug(slug),
    getPublishedArticles(),
  ]);

  if (!rawArticle) {
    notFound();
  }

  const isId = locale === "id";
  const article = localizeArticle(rawArticle, locale);
  const allArticles = localizeArticles(rawAllArticles, locale);

  const related = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  // Split markdown-style blocks cleanly
  const blocks = article.content.split("\n\n");

  return (
    <div>
      {/* Header */}
      <section className="bg-[#101C2B] text-[#F3F5F6] border-b border-[#1E324A] py-16 lg:py-24">
        <div className="mx-auto max-w-[1050px] px-6 lg:px-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono-tech text-xs text-[#F3F5F6]/70">
            <Link href="/insights" className="text-[#02BDEA] hover:underline">
              &larr;{" "}
              {isId ? "SEMUA WAWASAN TEKNIS" : "ALL TECHNICAL INSIGHTS"}
            </Link>
            <span>|</span>
            <span className="text-[#FFD71C] uppercase">
              {article.category_name}
            </span>
            <span>|</span>
            <span>
              {article.reading_time_minutes} {isId ? "MNT BACA" : "MIN READ"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#F3F5F6]/85 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="pt-4 border-t border-[#1E324A] flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs text-[#F3F5F6]/70">
            <div>
              {isId ? "PENULIS:" : "AUTHOR:"}{" "}
              <strong className="text-white">{article.author_name}</strong> (
              {article.author_role})
            </div>
            <div>
              {isId ? "DITERBITKAN:" : "PUBLISHED:"}{" "}
              {new Date(article.published_at).toLocaleDateString(
                isId ? "id-ID" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 bg-white border-b border-[#101C2B]/15">
        <div className="mx-auto max-w-[1050px] px-6 lg:px-10 space-y-10">
          <div className="relative h-72 sm:h-96 border border-[#101C2B]/20 bg-[#101C2B] overflow-hidden">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 1050px) 100vw, 1050px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6 text-[#101C2B] leading-relaxed">
            {blocks.map((block, index) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="font-display text-2xl sm:text-3xl font-bold text-[#101C2B] pt-4 border-t border-[#101C2B]/10"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
                const lines = trimmed.split("\n");
                return (
                  <ul
                    key={index}
                    className="space-y-2.5 bg-[#F3F5F6] p-6 border-l-4 border-[#123A68] text-sm sm:text-base"
                  >
                    {lines.map((line, i) => (
                      <li key={i} className="leading-relaxed">
                        {line.replace(/^(-|\d+\.)\s*/, "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={index}
                  className="text-base sm:text-lg text-[#101C2B]/90 leading-relaxed"
                >
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 bg-[#F3F5F6]">
          <div className="mx-auto max-w-[1050px] px-6 lg:px-10 space-y-8">
            <h2 className="font-display text-2xl font-bold text-[#101C2B]">
              {isId ? "Artikel Teknis Terkait" : "Related Technical Briefs"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="border border-[#101C2B]/15 bg-white p-6 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="font-mono-tech text-xs text-[#123A68] uppercase">
                      {rel.category_name}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#101C2B]">
                      <Link
                        href={`/insights/${rel.slug}`}
                        className="hover:text-[#123A68]"
                      >
                        {rel.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#4B5B6E] line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/insights/${rel.slug}`}
                    className="font-mono-tech text-xs uppercase tracking-wider text-[#101C2B] hover:text-[#123A68] pt-3 border-t border-[#101C2B]/10 flex justify-between"
                  >
                    <span>
                      {isId ? "Baca Artikel Teknis" : "Read Technical Brief"}
                    </span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
