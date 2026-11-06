"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type {
  AppRole,
  Article,
  AuditLogEntry,
  InquiryNote,
  InternalUser,
  OperationalStage,
  PolymerFamily,
  Product,
  ProductStatus,
  QuoteRequest,
  SampleRequest,
  SiteContentBlock,
  SiteSetting,
} from "@/types/domain";
import type { AuthenticatedSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { LanguageToggle, useLanguage } from "@/lib/i18n/LanguageContext";
import {
  assignInternalUserRoleAction,
  changeProductStatusCmsAction,
  inviteInternalUserAction,
  logoutInternalAction,
  saveArticleCmsAction,
  saveProductCmsAction,
  saveSiteSettingsCmsAction,
  updateRfqWorkflowAction,
  updateSampleWorkflowAction,
  updateSiteContentCmsAction,
} from "@/actions/cms-actions";

interface AdminConsoleProps {
  session: AuthenticatedSession;
  products: Product[];
  quoteRequests: QuoteRequest[];
  sampleRequests: SampleRequest[];
  inquiryNotes: InquiryNote[];
  articles: Article[];
  siteContent: SiteContentBlock[];
  siteSettings: SiteSetting[];
  internalUsers: InternalUser[];
  auditLogs: AuditLogEntry[];
}

type ModuleTab =
  | "overview"
  | "products"
  | "rfq"
  | "samples"
  | "content"
  | "users"
  | "settings";

const RFQ_STATUSES: QuoteRequest["status"][] = [
  "New",
  "Reviewed",
  "Contacted",
  "Quoted",
  "Negotiation",
  "Won",
  "Lost",
];

const SAMPLE_STATUSES: SampleRequest["status"][] = [
  "Pending",
  "Approved",
  "Dispatched",
  "Trial Scheduled",
  "Completed",
  "Declined",
];

export function AdminConsole({
  session,
  products,
  quoteRequests,
  sampleRequests,
  inquiryNotes,
  articles,
  siteContent,
  siteSettings,
  internalUsers,
  auditLogs,
}: AdminConsoleProps) {
  const router = useRouter();
  const { isId } = useLanguage();
  const [activeTab, setActiveTab] = useState<ModuleTab>("overview");
  const [statusBanner, setStatusBanner] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  // Permissions for current session role
  const canWriteProducts = hasPermission(session.role, "products:write");
  const canUpdateRfq = hasPermission(session.role, "rfq:update");
  const canUpdateSamples = hasPermission(session.role, "samples:update");
  const canWriteContent = hasPermission(session.role, "content:write");
  const canManageUsers = hasPermission(session.role, "users:manage");
  const canWriteSettings = hasPermission(session.role, "settings:write");

  // Product Editor state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null
  );
  const [procText, setProcText] = useState("");
  const [appText, setAppText] = useState("");
  const [pkgText, setPkgText] = useState("");

  // Selected RFQ & Note state
  const [selectedRfqId, setSelectedRfqId] = useState<string>(
    quoteRequests[0]?.id || ""
  );
  const [rfqNoteInput, setRfqNoteInput] = useState("");

  // Article Editor state
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(
    null
  );

  // User Invitation state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteTitle, setInviteTitle] = useState("");
  const [inviteRole, setInviteRole] = useState<AppRole>("SALES");

  // Content blocks draft state
  const [contentDrafts, setContentDrafts] = useState<
    Record<string, { title: string; subtitle: string; body: string }>
  >(() => {
    const map: Record<string, { title: string; subtitle: string; body: string }> = {};
    for (const block of siteContent) {
      map[block.id] = {
        title: block.title,
        subtitle: block.subtitle,
        body: block.body,
      };
    }
    return map;
  });

  // Settings map state
  const [settingsDraft, setSettingsDraft] = useState<Record<string, string>>(
    () => {
      const map: Record<string, string> = {};
      for (const s of siteSettings) {
        map[s.setting_key] = s.value;
      }
      return map;
    }
  );

  function startEditProduct(prod?: Product) {
    if (prod) {
      setEditingProduct({ ...prod });
      setProcText(prod.manufacturing_processes.join(", "));
      setAppText(prod.recommended_applications.join(", "));
      setPkgText(prod.packaging_options.join(", "));
    } else {
      setEditingProduct({
        slug: "",
        name: "",
        grade_code: "",
        polymer_family: "Polypropylene",
        status: "DRAFT",
        operational_status: "PROTOTYPE_SPEC",
        short_description: "",
        technical_overview: "",
        feedstock_origin:
          "Selected post-industrial conversion trimmings (single-heat stream)",
        mfi_value: "Target ~2.17 g/10 min",
        mfi_test_condition: "ASTM D1238",
        density_value: "0.90 - 0.91 g/cm3",
        moisture_content: "< 0.05%",
        ash_content: "< 0.15%",
        filtration_rating: "100 - 120 mesh (< 100 micron)",
        color_profile: "Natural Industrial Base",
        indicative_price_idr: 18080,
        primary_image_url: "/images/materials/pp-natural.jpg",
        featured: false,
        seo_title: "",
        seo_description: "",
      });
      setProcText("Injection Molding, Extrusion");
      setAppText("Household storage containers, Industrial utility crates");
      setPkgText("25 kg Woven PP Bag with PE Inner Liner");
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setStatusBanner(null);

    const res = await saveProductCmsAction({
      ...editingProduct,
      manufacturing_processes: procText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      recommended_applications: appText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      packaging_options: pkgText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });

    if (res.ok) {
      setStatusBanner({
        ok: true,
        text: `Saved product specification ${res.product?.grade_code}. Public catalog updated.`,
      });
      setEditingProduct(null);
      router.refresh();
    } else {
      setStatusBanner({
        ok: false,
        text: res.error || "Failed to save product.",
      });
    }
  }

  async function handleStatusToggle(productId: string, status: ProductStatus) {
    setStatusBanner(null);
    const res = await changeProductStatusCmsAction(productId, status);
    if (res.ok) {
      setStatusBanner({
        ok: true,
        text: `Updated product status to ${status}.`,
      });
      router.refresh();
    }
  }

  async function handleRfqUpdate(
    rfq: QuoteRequest,
    newStatus: QuoteRequest["status"],
    newPriority: QuoteRequest["priority"],
    followUpDate: string | null
  ) {
    setStatusBanner(null);
    const res = await updateRfqWorkflowAction({
      id: rfq.id,
      status: newStatus,
      priority: newPriority,
      follow_up_date: followUpDate,
      note: rfqNoteInput,
    });
    if (res.ok) {
      setRfqNoteInput("");
      setStatusBanner({
        ok: true,
        text: `Updated RFQ ${rfq.reference_code} to status [${newStatus}].`,
      });
      router.refresh();
    }
  }

  async function handleSampleUpdate(
    smp: SampleRequest,
    newStatus: SampleRequest["status"],
    notes: string | null
  ) {
    setStatusBanner(null);
    const res = await updateSampleWorkflowAction({
      id: smp.id,
      status: newStatus,
      fulfillment_notes: notes,
    });
    if (res.ok) {
      setStatusBanner({
        ok: true,
        text: `Updated Sample Request ${smp.reference_code} to [${newStatus}].`,
      });
      router.refresh();
    }
  }

  async function handleSaveArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!editingArticle) return;
    setStatusBanner(null);

    const res = await saveArticleCmsAction({
      ...editingArticle,
      reading_time_minutes: Number(editingArticle.reading_time_minutes) || 5,
    });
    if (res.ok) {
      setStatusBanner({
        ok: true,
        text: `Saved article "${res.article?.title}".`,
      });
      setEditingArticle(null);
      router.refresh();
    } else {
      setStatusBanner({
        ok: false,
        text: res.error || "Unable to save article.",
      });
    }
  }

  async function handleUpdateContentBlock(block: SiteContentBlock) {
    setStatusBanner(null);
    const res = await updateSiteContentCmsAction({
      id: block.id,
      title: block.title,
      subtitle: block.subtitle,
      body: block.body,
    });
    if (res.ok) {
      setStatusBanner({
        ok: true,
        text: `Updated public content block [${block.page_key}.${block.section_key}].`,
      });
      router.refresh();
    }
  }

  async function handleInviteUser(e: React.FormEvent) {
    e.preventDefault();
    setStatusBanner(null);
    const res = await inviteInternalUserAction({
      email: inviteEmail,
      full_name: inviteName,
      title: inviteTitle,
      role: inviteRole,
    });
    if (res.ok) {
      setInviteEmail("");
      setInviteName("");
      setInviteTitle("");
      setStatusBanner({
        ok: true,
        text: `Authorized internal user ${res.user?.email} with role ${res.user?.role}.`,
      });
      router.refresh();
    } else {
      setStatusBanner({
        ok: false,
        text: res.error || "Failed to invite user.",
      });
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setStatusBanner(null);
    const res = await saveSiteSettingsCmsAction(settingsDraft);
    if (res.ok) {
      setStatusBanner({
        ok: true,
        text: "Updated global company & contact settings.",
      });
      router.refresh();
    }
  }

  const selectedRfq =
    quoteRequests.find((q) => q.id === selectedRfqId) || quoteRequests[0];

  const publishedCount = products.filter(
    (p) => p.status === "PUBLISHED"
  ).length;
  const pendingSampleCount = sampleRequests.filter(
    (s) => s.status === "Pending" || s.status === "Trial Scheduled"
  ).length;

  return (
    <div className="min-h-screen bg-[#0B1420] text-[#F3F5F6] flex flex-col">
      {/* Top Industrial Operating Console Bar */}
      <header className="border-b border-[#1E324A] bg-[#101C2B] sticky top-0 z-40">
        <div className="mx-auto max-w-[1500px] px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo/logo-symbol.png"
                alt="PrimeFlow symbol"
                width={38}
                height={30}
                className="object-contain h-7 w-auto"
              />
              <span className="font-display font-bold text-base tracking-tight">
                <span className="text-[#FFD71C]">PRIME</span>
                <span className="text-[#02BDEA]">FLOW</span>
              </span>
            </Link>
            <span className="text-[#1E324A]">|</span>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
              {isId ? "KONSOL OPERASIONAL CMS & KOMERSIAL" : "CMS & COMMERCIAL OPERATING CONSOLE"}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono-tech text-xs">
            <LanguageToggle compact />
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[#1E324A] bg-[#0B1420]">
              <span className="h-2 w-2 bg-emerald-400" />
              <span className="text-white">{session.fullName}</span>
              <span className="px-2 py-0.5 bg-[#123A68] text-[#FFD71C] text-[10px]">
                {session.role}
              </span>
            </div>
            <Link
              href="/"
              className="px-3 py-1.5 border border-[#1E324A] text-[#F3F5F6]/80 hover:border-[#02BDEA] hover:text-white"
            >
              {isId ? "Situs Publik" : "Public Site"} &nearr;
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logoutInternalAction();
                router.push("/login");
                router.refresh();
              }}
              className="px-3 py-1.5 border border-rose-500/40 text-rose-300 hover:bg-rose-950/50"
            >
              {isId ? "Keluar" : "Sign Out"}
            </button>
          </div>
        </div>

        {/* Compact horizontal module command strip (No bloated permanent sidebar) */}
        <div className="border-t border-[#1E324A] bg-[#080F18]">
          <div className="mx-auto max-w-[1500px] px-6 flex items-center gap-1 overflow-x-auto">
            {[
              { id: "overview", label: isId ? "01 / Ringkasan Konsol" : "01 / Console Overview", show: true },
              {
                id: "products",
                label: isId ? `02 / Produk (${products.length})` : `02 / Products (${products.length})`,
                show: true,
              },
              {
                id: "rfq",
                label: isId ? `03 / Kotak Masuk RFQ (${quoteRequests.length})` : `03 / RFQ Inbox (${quoteRequests.length})`,
                show: true,
              },
              {
                id: "samples",
                label: isId ? `04 / Uji Coba Sampel (${sampleRequests.length})` : `04 / Sample Trials (${sampleRequests.length})`,
                show: true,
              },
              {
                id: "content",
                label: isId ? `05 / Konten & Artikel (${articles.length})` : `05 / Content & Insights (${articles.length})`,
                show: true,
              },
              {
                id: "users",
                label: isId ? `06 / Pengguna RBAC (${internalUsers.length})` : `06 / RBAC Users (${internalUsers.length})`,
                show: session.role === "SUPER_ADMIN",
              },
              {
                id: "settings",
                label: isId ? "07 / Pengaturan Situs" : "07 / Site Settings",
                show: session.role === "SUPER_ADMIN" || session.role === "ADMIN_CMS",
              },
            ]
              .filter((t) => t.show)
              .map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as ModuleTab)}
                    className={`px-4 py-3 font-mono-tech text-xs uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                      active
                        ? "border-[#FFD71C] text-[#FFD71C] bg-[#101C2B]"
                        : "border-transparent text-[#F3F5F6]/70 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="mx-auto max-w-[1500px] w-full px-6 py-8 flex-1 space-y-6">
        {statusBanner && (
          <div
            className={`p-4 border font-mono-tech text-xs flex items-center justify-between ${
              statusBanner.ok
                ? "border-emerald-500/60 bg-emerald-950/30 text-emerald-200"
                : "border-rose-500/60 bg-rose-950/30 text-rose-200"
            }`}
          >
            <span>{statusBanner.text}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="underline ml-4"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* ===================================================================
            MODULE 1: DASHBOARD OVERVIEW (Real Database-Derived Values Only)
        ==================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Telemetry Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#1E324A] bg-[#101C2B] divide-y sm:divide-y-0 sm:divide-x divide-[#1E324A]">
              <div className="p-6 space-y-1">
                <span className="font-mono-tech text-[11px] uppercase text-[#02BDEA]">
                  CATALOG GRADES (PUBLISHED / TOTAL)
                </span>
                <div className="font-mono-tech text-3xl font-bold text-white">
                  {publishedCount} / {products.length}
                </div>
                <span className="font-mono-tech text-[11px] text-[#F3F5F6]/60">
                  PP, PE, HDPE, LDPE database records
                </span>
              </div>

              <div className="p-6 space-y-1">
                <span className="font-mono-tech text-[11px] uppercase text-[#FFD71C]">
                  TOTAL RFQ SUBMISSIONS
                </span>
                <div className="font-mono-tech text-3xl font-bold text-white">
                  {quoteRequests.length}
                </div>
                <span className="font-mono-tech text-[11px] text-[#F3F5F6]/60">
                  {quoteRequests.filter((q) => q.status === "New").length} awaiting initial review
                </span>
              </div>

              <div className="p-6 space-y-1">
                <span className="font-mono-tech text-[11px] uppercase text-[#02BDEA]">
                  ACTIVE SAMPLE TRIAL REQUESTS
                </span>
                <div className="font-mono-tech text-3xl font-bold text-white">
                  {pendingSampleCount}
                </div>
                <span className="font-mono-tech text-[11px] text-[#F3F5F6]/60">
                  {sampleRequests.length} total 5-10 kg sample requests
                </span>
              </div>

              <div className="p-6 space-y-1">
                <span className="font-mono-tech text-[11px] uppercase text-[#F3F5F6]/70">
                  PUBLISHED TECHNICAL ARTICLES
                </span>
                <div className="font-mono-tech text-3xl font-bold text-white">
                  {articles.filter((a) => a.published).length}
                </div>
                <span className="font-mono-tech text-[11px] text-[#F3F5F6]/60">
                  Active role: {session.role}
                </span>
              </div>
            </div>

            {/* Split: Recent RFQs + Recent Audit Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 border border-[#1E324A] bg-[#101C2B]">
                <div className="px-6 py-4 border-b border-[#1E324A] flex items-center justify-between">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                    RECENT COMMERCIAL INQUIRIES (RFQ)
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("rfq")}
                    className="font-mono-tech text-xs text-[#02BDEA] hover:underline"
                  >
                    Open RFQ Inbox &rarr;
                  </button>
                </div>
                <div className="divide-y divide-[#1E324A]">
                  {quoteRequests.slice(0, 5).map((rfq) => (
                    <div
                      key={rfq.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 font-mono-tech text-xs">
                          <span className="text-[#02BDEA] font-bold">
                            {rfq.reference_code}
                          </span>
                          <span className="px-2 py-0.5 bg-[#0B1420] border border-[#1E324A] text-[#FFD71C]">
                            {rfq.status}
                          </span>
                          <span className="text-[#F3F5F6]/60">
                            {rfq.inquiry_type}
                          </span>
                        </div>
                        <div className="font-display font-semibold text-white">
                          {rfq.company_name} ({rfq.contact_name})
                        </div>
                        <div className="font-mono-tech text-xs text-[#F3F5F6]/65">
                          Grade: {rfq.product_grade || "General"} | Volume:{" "}
                          {rfq.monthly_volume_kg
                            ? `${rfq.monthly_volume_kg.toLocaleString()} kg/mo`
                            : "TBD"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRfqId(rfq.id);
                          setActiveTab("rfq");
                        }}
                        className="px-3.5 py-2 border border-[#1E324A] font-mono-tech text-xs text-[#02BDEA] hover:border-[#02BDEA] shrink-0"
                      >
                        Inspect &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 border border-[#1E324A] bg-[#101C2B]">
                <div className="px-6 py-4 border-b border-[#1E324A] flex items-center justify-between">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                    RECENT ADMINISTRATIVE AUDIT LOG
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#F3F5F6]/60">
                    REAL-TIME EVENTS
                  </span>
                </div>
                <div className="divide-y divide-[#1E324A] max-h-[420px] overflow-y-auto">
                  {auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-4 space-y-1 font-mono-tech text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#FFD71C] font-semibold">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-[#F3F5F6]/50">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[#F3F5F6]/80">
                        Entity: {log.entity_type} ({log.entity_id})
                      </div>
                      <div className="text-[11px] text-[#02BDEA]">
                        Actor: {log.actor_email} [{log.actor_role}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 2: PRODUCT MANAGEMENT (Full CRUD)
        ==================================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#1E324A] bg-[#101C2B] p-6">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                  CMS PRODUCT SPECIFICATION MANAGER
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1">
                  Manage Polymer Grades, Status &amp; Technical Specifications
                </h2>
              </div>
              {canWriteProducts ? (
                <button
                  type="button"
                  onClick={() => startEditProduct()}
                  className="px-5 py-3 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest hover:bg-[#ffe14f]"
                >
                  + Create New Polymer Grade
                </button>
              ) : (
                <span className="font-mono-tech text-xs text-amber-300 border border-amber-400/40 px-3 py-1.5">
                  READ-ONLY MODE FOR ROLE [{session.role}]
                </span>
              )}
            </div>

            {/* Product Editor Drawer/Form */}
            {editingProduct && canWriteProducts && (
              <form
                onSubmit={handleSaveProduct}
                className="border-2 border-[#02BDEA] bg-[#101C2B] p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#1E324A] pb-4">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                    {editingProduct.id
                      ? `EDITING GRADE | ${editingProduct.grade_code}`
                      : "NEW POLYMER GRADE SPECIFICATION"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="font-mono-tech text-xs text-[#F3F5F6]/70 hover:text-white"
                  >
                    CANCEL [X]
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Grade Identifier *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., PP 100"
                      value={editingProduct.grade_code || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          grade_code: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm font-mono-tech text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="primeflow-pp-100"
                      value={editingProduct.slug || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm font-mono-tech text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Polymer Family *
                    </label>
                    <select
                      value={editingProduct.polymer_family || "Polypropylene"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          polymer_family: e.target.value as PolymerFamily,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                    >
                      <option value="Polypropylene">Polypropylene</option>
                      <option value="Polyethylene">Polyethylene</option>
                      <option value="HDPE">HDPE</option>
                      <option value="LDPE">LDPE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={editingProduct.status || "PUBLISHED"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          status: e.target.value as ProductStatus,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Operational Stage
                    </label>
                    <select
                      value={
                        editingProduct.operational_status || "PROTOTYPE_SPEC"
                      }
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          operational_status: e.target.value as OperationalStage,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                    >
                      <option value="PROTOTYPE_SPEC">
                        PROTOTYPE_SPEC (Target QC)
                      </option>
                      <option value="LAB_VALIDATED">LAB_VALIDATED</option>
                      <option value="COMMERCIAL_SUPPLY">
                        COMMERCIAL_SUPPLY
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Indicative Price (IDR / kg)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.indicative_price_idr ?? 18080}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          indicative_price_idr: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm font-mono-tech text-white"
                    />
                  </div>
                </div>

                {/* Technical Specs Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Melt Flow Index (MFI)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.mfi_value || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          mfi_value: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-xs font-mono-tech text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Density Range
                    </label>
                    <input
                      type="text"
                      value={editingProduct.density_value || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          density_value: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-xs font-mono-tech text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Moisture Content
                    </label>
                    <input
                      type="text"
                      value={editingProduct.moisture_content || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          moisture_content: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-xs font-mono-tech text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Primary Image Path
                    </label>
                    <select
                      value={
                        editingProduct.primary_image_url ||
                        "/images/materials/pp-natural.jpg"
                      }
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          primary_image_url: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-xs font-mono-tech text-white"
                    >
                      <option value="/images/materials/pp-natural.jpg">
                        /images/materials/pp-natural.jpg
                      </option>
                      <option value="/images/materials/hdpe-pellets.jpg">
                        /images/materials/hdpe-pellets.jpg
                      </option>
                      <option value="/images/materials/ldpe-pellets.jpg">
                        /images/materials/ldpe-pellets.jpg
                      </option>
                      <option value="/images/materials/pe-white.jpg">
                        /images/materials/pe-white.jpg
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                    Short Summary Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingProduct.short_description || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        short_description: e.target.value,
                      })
                    }
                    className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                    Technical Overview *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingProduct.technical_overview || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        technical_overview: e.target.value,
                      })
                    }
                    className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Processes (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={procText}
                      onChange={(e) => setProcText(e.target.value)}
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Recommended Applications (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={appText}
                      onChange={(e) => setAppText(e.target.value)}
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Packaging Options (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={pkgText}
                      onChange={(e) => setPkgText(e.target.value)}
                      className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-2.5 border border-[#1E324A] font-mono-tech text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#02BDEA] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest"
                  >
                    Save Product Specification
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="border border-[#1E324A] bg-[#101C2B] overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#1E324A] bg-[#080F18] font-mono-tech text-[11px] uppercase text-[#F3F5F6]/65">
                    <th className="p-4">Grade</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Polymer Family</th>
                    <th className="p-4">Key QC Specs</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E324A] text-sm">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#0B1420]/60">
                      <td className="p-4 font-mono-tech font-bold text-[#FFD71C]">
                        {prod.grade_code}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">
                          {prod.name}
                        </div>
                        <div className="font-mono-tech text-xs text-[#F3F5F6]/55">
                          /products/{prod.slug}
                        </div>
                      </td>
                      <td className="p-4 font-mono-tech text-xs text-[#02BDEA]">
                        {prod.polymer_family}
                      </td>
                      <td className="p-4 font-mono-tech text-xs text-[#F3F5F6]/80">
                        Moisture: {prod.moisture_content} | Filter:{" "}
                        {prod.filtration_rating}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-mono-tech text-[11px] px-2.5 py-1 ${
                            prod.status === "PUBLISHED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : prod.status === "DRAFT"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                              : "bg-slate-900 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2 font-mono-tech text-xs">
                        {canWriteProducts && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditProduct(prod)}
                              className="px-3 py-1.5 border border-[#02BDEA] text-[#02BDEA] hover:bg-[#02BDEA] hover:text-[#101C2B]"
                            >
                              Edit
                            </button>
                            {prod.status !== "PUBLISHED" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusToggle(prod.id, "PUBLISHED")
                                }
                                className="px-3 py-1.5 border border-emerald-500/50 text-emerald-300"
                              >
                                Publish
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusToggle(prod.id, "DRAFT")
                                }
                                className="px-3 py-1.5 border border-amber-500/50 text-amber-300"
                              >
                                Unpublish
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 3: RFQ MANAGEMENT (Status Workflow & Internal Notes)
        ==================================================================== */}
        {activeTab === "rfq" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 5 cols: RFQ Inbox List */}
            <div className="lg:col-span-5 border border-[#1E324A] bg-[#101C2B]">
              <div className="p-5 border-b border-[#1E324A] flex items-center justify-between">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                  RFQ INBOX ({quoteRequests.length})
                </span>
                <span className="font-mono-tech text-[11px] text-[#02BDEA]">
                  CLICK TO INSPECT
                </span>
              </div>
              <div className="divide-y divide-[#1E324A]">
                {quoteRequests.map((rfq) => {
                  const selected = selectedRfq?.id === rfq.id;
                  return (
                    <button
                      key={rfq.id}
                      type="button"
                      onClick={() => setSelectedRfqId(rfq.id)}
                      className={`w-full text-left p-5 transition-colors ${
                        selected
                          ? "bg-[#0B1420] border-l-4 border-l-[#FFD71C]"
                          : "hover:bg-[#0B1420]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono-tech text-xs">
                        <span className="text-[#02BDEA] font-bold">
                          {rfq.reference_code}
                        </span>
                        <span className="px-2 py-0.5 bg-[#123A68] text-[#FFD71C] text-[10px]">
                          {rfq.status}
                        </span>
                      </div>
                      <div className="font-display font-bold text-white mt-1">
                        {rfq.company_name}
                      </div>
                      <div className="font-mono-tech text-xs text-[#F3F5F6]/65 mt-1">
                        {rfq.product_grade || "Multi-Grade"} |{" "}
                        {rfq.monthly_volume_kg
                          ? `${rfq.monthly_volume_kg.toLocaleString()} kg/mo`
                          : "Volume TBD"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 7 cols: Detailed RFQ Dossier & Workflow Controls */}
            <div className="lg:col-span-7 border border-[#1E324A] bg-[#101C2B] p-6 sm:p-8 space-y-6">
              {selectedRfq ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E324A] pb-5">
                    <div>
                      <span className="font-mono-tech text-xs text-[#02BDEA]">
                        {selectedRfq.reference_code} | {selectedRfq.inquiry_type}
                      </span>
                      <h2 className="font-display text-2xl font-bold text-white mt-1">
                        {selectedRfq.company_name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 font-mono-tech text-xs">
                      <span className="px-3 py-1 bg-[#0B1420] border border-[#1E324A] text-[#FFD71C]">
                        STATUS: {selectedRfq.status}
                      </span>
                      <span className="px-3 py-1 bg-[#0B1420] border border-[#1E324A] text-[#02BDEA]">
                        PRIORITY: {selectedRfq.priority}
                      </span>
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs bg-[#0B1420] p-5 border border-[#1E324A]">
                    <div>
                      <dt className="text-[#F3F5F6]/55 uppercase text-[10px]">
                        Contact Person
                      </dt>
                      <dd className="text-white font-semibold mt-0.5">
                        {selectedRfq.contact_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#F3F5F6]/55 uppercase text-[10px]">
                        Email &amp; Phone
                      </dt>
                      <dd className="text-[#02BDEA] mt-0.5">
                        {selectedRfq.email} | {selectedRfq.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#F3F5F6]/55 uppercase text-[10px]">
                        Requested Grade &amp; Monthly Volume
                      </dt>
                      <dd className="text-[#FFD71C] font-semibold mt-0.5">
                        {selectedRfq.product_grade || "General"} (
                        {selectedRfq.monthly_volume_kg
                          ? `${selectedRfq.monthly_volume_kg.toLocaleString()} kg/month`
                          : "Not specified"}
                        )
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#F3F5F6]/55 uppercase text-[10px]">
                        Delivery Schedule Preference
                      </dt>
                      <dd className="text-white mt-0.5">
                        {selectedRfq.delivery_schedule_preference || "Standard"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-[#F3F5F6]/55 uppercase text-[10px]">
                        Target Application &amp; Inquiry Message
                      </dt>
                      <dd className="text-[#F3F5F6]/85 mt-1 leading-relaxed font-sans text-sm">
                        {selectedRfq.target_application
                          ? `[Application: ${selectedRfq.target_application}] `
                          : ""}
                        {selectedRfq.message || "No additional notes provided."}
                      </dd>
                    </div>
                  </dl>

                  {selectedRfq.calculator_snapshot && (
                    <div className="border border-[#02BDEA]/40 bg-[#0B1420] p-4 font-mono-tech text-xs space-y-1">
                      <div className="text-[#02BDEA] uppercase">
                        Attached HPP Savings Calculator Snapshot
                      </div>
                      <div>
                        Virgin: Rp{" "}
                        {selectedRfq.calculator_snapshot.virginPricePerKg.toLocaleString()}
                        /kg vs PrimeFlow: Rp{" "}
                        {selectedRfq.calculator_snapshot.primeflowPricePerKg.toLocaleString()}
                        /kg | Est. Monthly Savings: Rp{" "}
                        {selectedRfq.calculator_snapshot.monthlySavings.toLocaleString()}{" "}
                        ({selectedRfq.calculator_snapshot.percentageDifference}%)
                      </div>
                    </div>
                  )}

                  {/* Workflow Update Controls (SUPER_ADMIN & SALES) */}
                  {canUpdateRfq ? (
                    <div className="border-t border-[#1E324A] pt-5 space-y-4">
                      <div className="font-mono-tech text-xs uppercase tracking-wider text-[#FFD71C]">
                        Update RFQ Pipeline Stage &amp; Log Internal Sales Note
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {RFQ_STATUSES.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              handleRfqUpdate(
                                selectedRfq,
                                st,
                                selectedRfq.priority,
                                selectedRfq.follow_up_date
                              )
                            }
                            className={`px-3 py-1.5 font-mono-tech text-xs border ${
                              selectedRfq.status === st
                                ? "bg-[#FFD71C] text-[#101C2B] border-[#FFD71C] font-bold"
                                : "bg-[#0B1420] text-[#F3F5F6]/80 border-[#1E324A] hover:border-[#02BDEA]"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={rfqNoteInput}
                          onChange={(e) => setRfqNoteInput(e.target.value)}
                          placeholder="Add internal sales or QC follow-up note..."
                          className="flex-1 bg-[#0B1420] border border-[#1E324A] px-3.5 py-2.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRfqUpdate(
                              selectedRfq,
                              selectedRfq.status,
                              selectedRfq.priority,
                              selectedRfq.follow_up_date
                            )
                          }
                          className="px-5 py-2.5 bg-[#02BDEA] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="font-mono-tech text-xs text-amber-300">
                      Role [{session.role}] has read-only visibility on RFQ workflow.
                    </div>
                  )}

                  {/* Internal Notes History */}
                  <div className="border-t border-[#1E324A] pt-4 space-y-3">
                    <div className="font-mono-tech text-xs uppercase text-[#F3F5F6]/70">
                      Internal Inquiry Notes
                    </div>
                    {inquiryNotes
                      .filter((n) => n.quote_request_id === selectedRfq.id)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="border border-[#1E324A] bg-[#0B1420] p-3.5 text-xs space-y-1"
                        >
                          <div className="flex justify-between font-mono-tech text-[11px] text-[#02BDEA]">
                            <span>
                              {note.author_name} [{note.author_role}]
                            </span>
                            <span>
                              {new Date(note.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[#F3F5F6]/90">{note.note}</p>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <p className="font-mono-tech text-xs text-[#F3F5F6]/60">
                  Select an RFQ from the inbox to inspect details.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 4: SAMPLE REQUEST MANAGEMENT (5-10 kg Trial Kits)
        ==================================================================== */}
        {activeTab === "samples" && (
          <div className="border border-[#1E324A] bg-[#101C2B]">
            <div className="p-6 border-b border-[#1E324A] flex items-center justify-between">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                  5-10 KG SAMPLE TRIAL &amp; ON-SITE TECHNICIAN DISPATCH
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1">
                  Incoming Sample Evaluation Requests
                </h2>
              </div>
              <span className="font-mono-tech text-xs text-[#FFD71C]">
                {sampleRequests.length} TOTAL REQUESTS
              </span>
            </div>

            <div className="divide-y divide-[#1E324A]">
              {sampleRequests.map((smp) => (
                <div key={smp.id} className="p-6 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3 font-mono-tech text-xs">
                        <span className="text-[#02BDEA] font-bold">
                          {smp.reference_code}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#123A68] text-[#FFD71C]">
                          {smp.status}
                        </span>
                        <span className="text-white font-semibold">
                          GRADE: {smp.product_grade} ({smp.requested_kg} kg Kit)
                        </span>
                        {smp.requires_onsite_technician && (
                          <span className="px-2 py-0.5 border border-[#02BDEA] text-[#02BDEA]">
                            + ON-SITE TECHNICIAN REQUESTED
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-bold text-white">
                        {smp.company_name} ({smp.contact_name})
                      </h3>
                      <div className="font-mono-tech text-xs text-[#F3F5F6]/70">
                        Plant: {smp.plant_city} | Process:{" "}
                        {smp.conversion_process} | Machine:{" "}
                        {smp.machine_model || "TBD"} | Contact: {smp.email} (
                        {smp.phone})
                      </div>
                    </div>

                    {canUpdateSamples && (
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_STATUSES.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              handleSampleUpdate(
                                smp,
                                st,
                                smp.fulfillment_notes
                              )
                            }
                            className={`px-2.5 py-1.5 font-mono-tech text-[11px] border ${
                              smp.status === st
                                ? "bg-[#FFD71C] text-[#101C2B] border-[#FFD71C] font-bold"
                                : "bg-[#0B1420] text-[#F3F5F6]/75 border-[#1E324A] hover:border-[#02BDEA]"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {smp.technical_notes && (
                    <p className="text-xs text-[#F3F5F6]/80 bg-[#0B1420] p-3.5 border border-[#1E324A]">
                      <strong className="font-mono-tech text-[#02BDEA] uppercase mr-2">
                        Client Trial Notes:
                      </strong>
                      {smp.technical_notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 5: CONTENT & INSIGHTS MANAGEMENT
        ==================================================================== */}
        {activeTab === "content" && (
          <div className="space-y-8">
            {/* Editorial Page Content Blocks */}
            <div className="border border-[#1E324A] bg-[#101C2B] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E324A] pb-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                    PUBLIC PAGE COPYWRITING BLOCKS
                  </span>
                  <h2 className="font-display text-xl font-bold text-white mt-1">
                    Homepage &amp; About Narrative Blocks
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {siteContent.map((block) => {
                  const draft = contentDrafts[block.id] || {
                    title: block.title,
                    subtitle: block.subtitle,
                    body: block.body,
                  };
                  return (
                    <div
                      key={block.id}
                      className="border border-[#1E324A] bg-[#0B1420] p-5 space-y-3"
                    >
                      <div className="font-mono-tech text-xs text-[#FFD71C] uppercase">
                        SECTION : {block.page_key}.{block.section_key}
                      </div>
                      <input
                        type="text"
                        disabled={!canWriteContent}
                        value={draft.title}
                        onChange={(e) =>
                          setContentDrafts({
                            ...contentDrafts,
                            [block.id]: { ...draft, title: e.target.value },
                          })
                        }
                        className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm font-semibold text-white"
                      />
                      <input
                        type="text"
                        disabled={!canWriteContent}
                        value={draft.subtitle}
                        onChange={(e) =>
                          setContentDrafts({
                            ...contentDrafts,
                            [block.id]: { ...draft, subtitle: e.target.value },
                          })
                        }
                        className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-xs text-[#F3F5F6]/90"
                      />
                      <textarea
                        rows={3}
                        disabled={!canWriteContent}
                        value={draft.body}
                        onChange={(e) =>
                          setContentDrafts({
                            ...contentDrafts,
                            [block.id]: { ...draft, body: e.target.value },
                          })
                        }
                        className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-xs text-[#F3F5F6]/80"
                      />
                      {canWriteContent && (
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateContentBlock({
                              ...block,
                              ...draft,
                            })
                          }
                          className="px-4 py-2 bg-[#02BDEA] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase"
                        >
                          Publish Section Copy
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Articles CMS */}
            <div className="border border-[#1E324A] bg-[#101C2B] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E324A] pb-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                    INSIGHTS JOURNAL MANAGER
                  </span>
                  <h2 className="font-display text-xl font-bold text-white mt-1">
                    Technical Articles &amp; Engineering Briefs
                  </h2>
                </div>
                {canWriteContent && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingArticle({
                        slug: "",
                        title: "",
                        excerpt: "",
                        content: "",
                        category_name: "Polymer Engineering",
                        cover_image_url: "/images/materials/hero-pellets.jpg",
                        author_name: session.fullName,
                        author_role: session.title,
                        reading_time_minutes: 5,
                        published: true,
                      })
                    }
                    className="px-4 py-2.5 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase"
                  >
                    + New Technical Article
                  </button>
                )}
              </div>

              {editingArticle && canWriteContent && (
                <form
                  onSubmit={handleSaveArticle}
                  className="border border-[#02BDEA] bg-[#0B1420] p-6 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle.title || ""}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            title: e.target.value,
                          })
                        }
                        className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                        Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle.slug || ""}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]+/g, "-"),
                          })
                        }
                        className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm font-mono-tech text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle.category_name || ""}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            category_name: e.target.value,
                          })
                        }
                        className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Excerpt *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingArticle.excerpt || ""}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          excerpt: e.target.value,
                        })
                      }
                      className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] uppercase text-[#F3F5F6]/75 mb-1">
                      Article Body *
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={editingArticle.content || ""}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          content: e.target.value,
                        })
                      }
                      className="w-full bg-[#101C2B] border border-[#1E324A] px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingArticle(null)}
                      className="px-4 py-2 border border-[#1E324A] font-mono-tech text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#02BDEA] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase"
                    >
                      Save Article
                    </button>
                  </div>
                </form>
              )}

              <div className="divide-y divide-[#1E324A]">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-mono-tech text-xs text-[#02BDEA]">
                        {art.category_name} | /insights/{art.slug}
                      </div>
                      <h3 className="font-display font-bold text-white">
                        {art.title}
                      </h3>
                    </div>
                    {canWriteContent && (
                      <button
                        type="button"
                        onClick={() => setEditingArticle({ ...art })}
                        className="px-3.5 py-1.5 border border-[#02BDEA] text-[#02BDEA] font-mono-tech text-xs shrink-0"
                      >
                        Edit Article
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 6: USER MANAGEMENT (SUPER_ADMIN ONLY)
        ==================================================================== */}
        {activeTab === "users" && session.role === "SUPER_ADMIN" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 border border-[#1E324A] bg-[#101C2B] p-6 space-y-5">
              <div className="border-b border-[#1E324A] pb-4">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#FFD71C]">
                  RBAC DIRECTORY | SUPER_ADMIN EXCLUSIVE
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1">
                  Authorized Internal Staff &amp; Role Assignments
                </h2>
              </div>

              <div className="divide-y divide-[#1E324A]">
                {internalUsers.map((u) => (
                  <div
                    key={u.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-display font-bold text-white">
                        {u.full_name}
                      </div>
                      <div className="font-mono-tech text-xs text-[#02BDEA]">
                        {u.email}
                      </div>
                      <div className="text-xs text-[#F3F5F6]/60">{u.title}</div>
                    </div>

                    {canManageUsers && (
                      <div className="flex items-center gap-2 font-mono-tech text-xs">
                        <select
                          value={u.role}
                          onChange={async (e) => {
                            const res = await assignInternalUserRoleAction({
                              userId: u.id,
                              role: e.target.value as AppRole,
                              isActive: u.is_active,
                            });
                            if (res.ok) {
                              setStatusBanner({
                                ok: true,
                                text: `Updated role for ${u.email} to ${e.target.value}.`,
                              });
                              router.refresh();
                            }
                          }}
                          className="bg-[#0B1420] border border-[#1E324A] px-3 py-1.5 text-[#FFD71C]"
                        >
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          <option value="ADMIN_CMS">ADMIN_CMS</option>
                          <option value="SALES">SALES</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleInviteUser}
              className="lg:col-span-5 border border-[#1E324A] bg-[#101C2B] p-6 space-y-4"
            >
              <div className="border-b border-[#1E324A] pb-3">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                  AUTHORIZE NEW INTERNAL USER
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  Invite Staff Member
                </h3>
              </div>

              <div>
                <label className="block font-mono-tech text-xs uppercase text-[#F3F5F6]/75 mb-1">
                  Staff Email *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block font-mono-tech text-xs uppercase text-[#F3F5F6]/75 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block font-mono-tech text-xs uppercase text-[#F3F5F6]/75 mb-1">
                  Job Title / Function *
                </label>
                <input
                  type="text"
                  required
                  value={inviteTitle}
                  onChange={(e) => setInviteTitle(e.target.value)}
                  className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block font-mono-tech text-xs uppercase text-[#F3F5F6]/75 mb-1">
                  Assigned RBAC Role *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AppRole)}
                  className="w-full bg-[#0B1420] border border-[#1E324A] px-3 py-2 text-sm text-[#FFD71C] font-mono-tech"
                >
                  <option value="SALES">SALES</option>
                  <option value="ADMIN_CMS">ADMIN_CMS</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest"
              >
                Authorize Internal Account
              </button>
            </form>
          </div>
        )}

        {/* ===================================================================
            MODULE 7: SETTINGS
        ==================================================================== */}
        {activeTab === "settings" && (
          <form
            onSubmit={handleSaveSettings}
            className="border border-[#1E324A] bg-[#101C2B] p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#1E324A] pb-4">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#02BDEA]">
                  GLOBAL PLATFORM CONFIGURATION
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1">
                  Company Information, Verified Contacts &amp; Benchmarks
                </h2>
              </div>
              {!canWriteSettings && (
                <span className="font-mono-tech text-xs text-amber-300">
                  SUPER_ADMIN REQUIRED TO SAVE GLOBAL SETTINGS
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {siteSettings.map((setting) => (
                <div key={setting.id}>
                  <label className="block font-mono-tech text-xs uppercase text-[#F3F5F6]/80 mb-1.5">
                    {setting.label} ({setting.setting_key})
                  </label>
                  <input
                    type="text"
                    disabled={!canWriteSettings}
                    value={settingsDraft[setting.setting_key] ?? setting.value}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        [setting.setting_key]: e.target.value,
                      })
                    }
                    className="w-full bg-[#0B1420] border border-[#1E324A] px-4 py-2.5 text-sm text-white disabled:opacity-60"
                  />
                </div>
              ))}
            </div>

            {canWriteSettings && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FFD71C] text-[#101C2B] font-mono-tech text-xs font-semibold uppercase tracking-widest"
                >
                  Save Global Settings
                </button>
              </div>
            )}
          </form>
        )}
      </main>
    </div>
  );
}
