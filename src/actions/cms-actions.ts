"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  articleEditorSchema,
  productEditorSchema,
  quoteRequestSchema,
  sampleRequestSchema,
} from "@/lib/validations/schemas";
import {
  createQuoteRequest,
  createSampleRequest,
  getAllProductsForAdmin,
  inviteInternalUser,
  updateInternalUserRole,
  updateProductStatus,
  updateQuoteRequestStatus,
  updateSampleRequestStatus,
  updateSiteContentBlock,
  updateSiteSettingsBatch,
  upsertArticle,
  upsertProduct,
} from "@/lib/data-store";
import {
  clearInternalSession,
  establishInternalSession,
  getCurrentSession,
} from "@/lib/auth/session";
import { assertPermission, canAssignRole } from "@/lib/auth/rbac";
import type { AppRole, Product, QuoteRequest, SampleRequest } from "@/types/domain";

// Simple in-memory rate limiter for public form submissions
const SUBMISSION_BUCKETS = new Map<string, number[]>();

async function checkPublicRateLimit(): Promise<boolean> {
  const hdrs = await headers();
  const forwarded = hdrs.get("x-forwarded-for") || "local-client";
  const ipKey = forwarded.split(",")[0].trim();
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxPerMinute = 8;

  const history = (SUBMISSION_BUCKETS.get(ipKey) ?? []).filter(
    (t) => now - t < windowMs
  );
  if (history.length >= maxPerMinute) {
    return false;
  }
  history.push(now);
  SUBMISSION_BUCKETS.set(ipKey, history);
  return true;
}

export async function submitQuoteRequestAction(input: unknown) {
  const allowed = await checkPublicRateLimit();
  if (!allowed) {
    return {
      ok: false,
      error: "Too many submissions in a short period. Please wait one minute and try again.",
    };
  }

  const parsed = quoteRequestSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: firstIssue?.message || "Please check your inquiry form fields.",
    };
  }

  const data = parsed.data;
  const created = await createQuoteRequest({
    company_name: data.company_name,
    contact_name: data.contact_name,
    email: data.email,
    phone: data.phone,
    industry_segment: data.industry_segment || null,
    inquiry_type: data.inquiry_type,
    product_id: data.product_id || null,
    product_grade: data.product_grade || null,
    monthly_volume_kg: data.monthly_volume_kg ?? null,
    delivery_schedule_preference: data.delivery_schedule_preference || null,
    target_application: data.target_application || null,
    message: data.message || null,
    calculator_snapshot: data.calculator_snapshot ?? null,
  });

  revalidatePath("/admin");
  return {
    ok: true,
    referenceCode: created.reference_code,
    record: created,
  };
}

export async function submitSampleRequestAction(input: unknown) {
  const allowed = await checkPublicRateLimit();
  if (!allowed) {
    return {
      ok: false,
      error: "Rate limit exceeded. Please wait one minute before submitting again.",
    };
  }

  const parsed = sampleRequestSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: firstIssue?.message || "Please verify your sample request details.",
    };
  }

  const data = parsed.data;
  const created = await createSampleRequest({
    company_name: data.company_name,
    contact_name: data.contact_name,
    email: data.email,
    phone: data.phone,
    plant_city: data.plant_city,
    shipping_address: data.shipping_address || null,
    product_id: data.product_id || null,
    product_grade: data.product_grade,
    requested_kg: data.requested_kg,
    conversion_process: data.conversion_process,
    machine_model: data.machine_model || null,
    requires_onsite_technician: data.requires_onsite_technician,
    preferred_trial_window: data.preferred_trial_window || null,
    technical_notes: data.technical_notes || null,
  });

  revalidatePath("/admin");
  return {
    ok: true,
    referenceCode: created.reference_code,
    record: created,
  };
}

export async function loginInternalAction(email: string, passwordOrCode: string) {
  const result = await establishInternalSession(email, passwordOrCode);
  if (result.ok) {
    revalidatePath("/admin");
  }
  return result;
}

export async function logoutInternalAction() {
  await clearInternalSession();
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveProductCmsAction(input: unknown) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "products:write");

  const parsed = productEditorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Invalid product specification fields.",
    };
  }

  const existingList = await getAllProductsForAdmin();
  const existing = existingList.find(
    (p) => p.id === parsed.data.id || p.slug === parsed.data.slug
  );

  const saved = await upsertProduct(
    {
      id: parsed.data.id,
      slug: parsed.data.slug,
      name: parsed.data.name,
      grade_code: parsed.data.grade_code,
      category_id: existing?.category_id ?? "cat-pp",
      polymer_family: parsed.data.polymer_family,
      status: parsed.data.status,
      operational_status: parsed.data.operational_status,
      short_description: parsed.data.short_description,
      technical_overview: parsed.data.technical_overview,
      feedstock_origin: parsed.data.feedstock_origin,
      manufacturing_processes: parsed.data.manufacturing_processes,
      recommended_applications: parsed.data.recommended_applications,
      mfi_value: parsed.data.mfi_value ?? null,
      mfi_test_condition: parsed.data.mfi_test_condition ?? "ASTM D1238",
      density_value: parsed.data.density_value ?? null,
      moisture_content: parsed.data.moisture_content ?? "< 0.05%",
      ash_content: parsed.data.ash_content ?? "< 0.15%",
      filtration_rating: parsed.data.filtration_rating ?? "100 - 120 mesh (< 100 micron)",
      color_profile: parsed.data.color_profile ?? null,
      packaging_options: parsed.data.packaging_options,
      indicative_price_idr: parsed.data.indicative_price_idr ?? null,
      primary_image_url: parsed.data.primary_image_url,
      secondary_image_url: existing?.secondary_image_url,
      featured: parsed.data.featured,
      food_contact_Execution:
        existing?.food_contact_Execution ??
        "Non-food-grade industrial applications only. Not certified for direct food contact.",
      seo_title: parsed.data.seo_title ?? null,
      seo_description: parsed.data.seo_description ?? null,
      specifications: existing?.specifications ?? [],
      documents: existing?.documents ?? [],
      gallery: existing?.gallery ?? [],
    },
    { email: session!.email, role: session!.role }
  );

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${saved.slug}`);
  revalidatePath("/admin");
  return { ok: true, product: saved };
}

export async function changeProductStatusCmsAction(
  productId: string,
  status: Product["status"]
) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "products:write");

  const updated = await updateProductStatus(productId, status, {
    email: session!.email,
    role: session!.role,
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  return { ok: Boolean(updated), product: updated };
}

export async function updateRfqWorkflowAction(payload: {
  id: string;
  status: QuoteRequest["status"];
  priority: QuoteRequest["priority"];
  follow_up_date: string | null;
  note?: string;
}) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "rfq:update");

  const updated = await updateQuoteRequestStatus(
    payload.id,
    {
      status: payload.status,
      priority: payload.priority,
      follow_up_date: payload.follow_up_date,
    },
    {
      email: session!.email,
      name: session!.fullName,
      role: session!.role,
    },
    payload.note
  );

  revalidatePath("/admin");
  return { ok: Boolean(updated), record: updated };
}

export async function updateSampleWorkflowAction(payload: {
  id: string;
  status: SampleRequest["status"];
  fulfillment_notes: string | null;
}) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "samples:update");

  const updated = await updateSampleRequestStatus(
    payload.id,
    {
      status: payload.status,
      fulfillment_notes: payload.fulfillment_notes,
    },
    { email: session!.email, role: session!.role }
  );

  revalidatePath("/admin");
  return { ok: Boolean(updated), record: updated };
}

export async function saveArticleCmsAction(input: unknown) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "articles:write");

  const parsed = articleEditorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Invalid article fields.",
    };
  }

  const saved = await upsertArticle(
    {
      id: parsed.data.id,
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      category_name: parsed.data.category_name,
      cover_image_url: parsed.data.cover_image_url,
      author_name: parsed.data.author_name,
      author_role: parsed.data.author_role,
      reading_time_minutes: parsed.data.reading_time_minutes,
      published: parsed.data.published,
      seo_title: parsed.data.seo_title ?? null,
      seo_description: parsed.data.seo_description ?? null,
    },
    { email: session!.email, role: session!.role }
  );

  revalidatePath("/insights");
  revalidatePath(`/insights/${saved.slug}`);
  revalidatePath("/admin");
  return { ok: true, article: saved };
}

export async function updateSiteContentCmsAction(payload: {
  id: string;
  title: string;
  subtitle: string;
  body: string;
}) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "content:write");

  const updated = await updateSiteContentBlock(
    payload.id,
    {
      title: payload.title.trim(),
      subtitle: payload.subtitle.trim(),
      body: payload.body.trim(),
    },
    { email: session!.email, role: session!.role }
  );

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");
  return { ok: Boolean(updated), block: updated };
}

export async function saveSiteSettingsCmsAction(updates: Record<string, string>) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "settings:write");

  const settings = await updateSiteSettingsBatch(updates, {
    email: session!.email,
    role: session!.role,
  });

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin");
  return { ok: true, settings };
}

export async function assignInternalUserRoleAction(payload: {
  userId: string;
  role: AppRole;
  isActive: boolean;
}) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "roles:assign");

  if (!canAssignRole(session?.role, payload.role)) {
    return {
      ok: false,
      error: "Only SUPER_ADMIN may assign or alter internal user roles.",
    };
  }

  const updated = await updateInternalUserRole(
    payload.userId,
    payload.role,
    payload.isActive,
    { email: session!.email, role: session!.role }
  );

  revalidatePath("/admin");
  return { ok: Boolean(updated), user: updated };
}

export async function inviteInternalUserAction(payload: {
  email: string;
  full_name: string;
  title: string;
  role: AppRole;
}) {
  const session = await getCurrentSession();
  assertPermission(session?.role, "users:manage");

  if (!canAssignRole(session?.role, payload.role)) {
    return {
      ok: false,
      error: "Only SUPER_ADMIN may invite internal staff and assign roles.",
    };
  }

  try {
    const created = await inviteInternalUser(payload, {
      email: session!.email,
      role: session!.role,
    });
    revalidatePath("/admin");
    return { ok: true, user: created };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to invite user.",
    };
  }
}
