import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import {
  getAllArticlesForAdmin,
  getAllProductsForAdmin,
  getAuditLogs,
  getInquiryNotes,
  getInternalUsers,
  getQuoteRequests,
  getSampleRequests,
  getSiteContent,
  getSiteSettings,
} from "@/lib/data-store";
import { AdminConsole } from "@/components/admin/AdminConsole";

export const metadata: Metadata = {
  title: "CMS & Commercial Operating Console",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const [
    products,
    quoteRequests,
    sampleRequests,
    inquiryNotes,
    articles,
    siteContent,
    siteSettings,
    internalUsers,
    auditLogs,
  ] = await Promise.all([
    getAllProductsForAdmin(),
    getQuoteRequests(),
    getSampleRequests(),
    getInquiryNotes(),
    getAllArticlesForAdmin(),
    getSiteContent(),
    getSiteSettings(),
    getInternalUsers(),
    getAuditLogs(),
  ]);

  return (
    <AdminConsole
      session={session}
      products={products}
      quoteRequests={quoteRequests}
      sampleRequests={sampleRequests}
      inquiryNotes={inquiryNotes}
      articles={articles}
      siteContent={siteContent}
      siteSettings={siteSettings}
      internalUsers={internalUsers}
      auditLogs={auditLogs}
    />
  );
}
