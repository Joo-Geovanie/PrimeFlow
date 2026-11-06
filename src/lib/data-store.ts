import { promises as fs } from "fs";
import path from "path";
import type {
  AppRole,
  Article,
  AuditLogEntry,
  InquiryNote,
  InternalUser,
  Product,
  ProductCategory,
  QuoteRequest,
  SampleRequest,
  SiteContentBlock,
  SiteSetting,
} from "@/types/domain";
import {
  INITIAL_ARTICLES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CATEGORIES,
  INITIAL_INQUIRY_NOTES,
  INITIAL_INTERNAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_QUOTE_REQUESTS,
  INITIAL_SAMPLE_REQUESTS,
  INITIAL_SITE_CONTENT,
  INITIAL_SITE_SETTINGS,
} from "@/data/initial-seed";
import {
  createAdminSupabaseClient,
  createPublicSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export interface RuntimeDatabase {
  categories: ProductCategory[];
  products: Product[];
  articles: Article[];
  quoteRequests: QuoteRequest[];
  sampleRequests: SampleRequest[];
  inquiryNotes: InquiryNote[];
  internalUsers: InternalUser[];
  siteContent: SiteContentBlock[];
  siteSettings: SiteSetting[];
  auditLogs: AuditLogEntry[];
}

const STORE_FILE = path.join(process.cwd(), ".data", "primeflow-store.json");
const CLOUD_STATE_BUCKET = "primeflow-cms-state";
const CLOUD_STATE_OBJECT = "primeflow-store.json";

let bucketInitialized = false;

function getDefaultDatabase(): RuntimeDatabase {
  return {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    articles: INITIAL_ARTICLES,
    quoteRequests: INITIAL_QUOTE_REQUESTS,
    sampleRequests: INITIAL_SAMPLE_REQUESTS,
    inquiryNotes: INITIAL_INQUIRY_NOTES,
    internalUsers: INITIAL_INTERNAL_USERS,
    siteContent: INITIAL_SITE_CONTENT,
    siteSettings: INITIAL_SITE_SETTINGS,
    auditLogs: INITIAL_AUDIT_LOGS,
  };
}

function normalizeDatabase(parsed: Partial<RuntimeDatabase>): RuntimeDatabase {
  return {
    categories: parsed.categories ?? INITIAL_CATEGORIES,
    products: parsed.products ?? INITIAL_PRODUCTS,
    articles: parsed.articles ?? INITIAL_ARTICLES,
    quoteRequests: parsed.quoteRequests ?? INITIAL_QUOTE_REQUESTS,
    sampleRequests: parsed.sampleRequests ?? INITIAL_SAMPLE_REQUESTS,
    inquiryNotes: parsed.inquiryNotes ?? INITIAL_INQUIRY_NOTES,
    internalUsers: parsed.internalUsers ?? INITIAL_INTERNAL_USERS,
    siteContent: parsed.siteContent ?? INITIAL_SITE_CONTENT,
    siteSettings: parsed.siteSettings ?? INITIAL_SITE_SETTINGS,
    auditLogs: parsed.auditLogs ?? INITIAL_AUDIT_LOGS,
  };
}

async function ensureCloudBucket() {
  const admin = createAdminSupabaseClient();
  if (!admin) return null;
  if (!bucketInitialized) {
    try {
      const { data: buckets } = await admin.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === CLOUD_STATE_BUCKET);
      if (!exists) {
        await admin.storage.createBucket(CLOUD_STATE_BUCKET, {
          public: false,
        });
      }
      const mediaExists = buckets?.some((b) => b.name === "primeflow-media");
      if (!mediaExists) {
        await admin.storage.createBucket("primeflow-media", {
          public: true,
        });
      }
      bucketInitialized = true;
    } catch {
      // Ignore bucket creation race conditions
    }
  }
  return admin;
}

async function readLocalDiskFallback(): Promise<RuntimeDatabase> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<RuntimeDatabase>;
    return normalizeDatabase(parsed);
  } catch {
    const initial = getDefaultDatabase();
    try {
      const dir = path.dirname(STORE_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
    } catch {
      // Ignore read-only filesystem errors in serverless/container environments
    }
    return initial;
  }
}

async function writeLocalDiskFallback(data: RuntimeDatabase): Promise<void> {
  try {
    const dir = path.dirname(STORE_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Ignore read-only filesystem errors
  }
}

async function readStore(): Promise<RuntimeDatabase> {
  const admin = await ensureCloudBucket();
  if (admin) {
    try {
      const { data, error } = await admin.storage
        .from(CLOUD_STATE_BUCKET)
        .download(CLOUD_STATE_OBJECT);
      if (!error && data) {
        const text = await data.text();
        const parsed = JSON.parse(text) as Partial<RuntimeDatabase>;
        return normalizeDatabase(parsed);
      }
      // Seed cloud state from local or initial seed on first connect
      const initial = await readLocalDiskFallback();
      await writeStore(initial);
      return initial;
    } catch {
      return readLocalDiskFallback();
    }
  }
  return readLocalDiskFallback();
}

async function writeStore(data: RuntimeDatabase): Promise<void> {
  await writeLocalDiskFallback(data);
  const admin = await ensureCloudBucket();
  if (admin) {
    try {
      const payload = Buffer.from(JSON.stringify(data, null, 2), "utf-8");
      await admin.storage
        .from(CLOUD_STATE_BUCKET)
        .upload(CLOUD_STATE_OBJECT, payload, {
          contentType: "application/json",
          upsert: true,
        });
    } catch {
      // Ignore network hiccup; local fallback already updated
    }
  }
}

export async function getCategories(): Promise<ProductCategory[]> {
  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient() ?? createPublicSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as ProductCategory[];
      }
    }
  }
  const db = await readStore();
  return [...db.categories].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getPublishedProducts(): Promise<Product[]> {
  const db = await readStore();
  if (isSupabaseConfigured()) {
    const supabase = createPublicSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "PUBLISHED")
        .order("featured", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((row) => {
          const fallback = db.products.find((p) => p.slug === row.slug);
          return {
            ...(fallback ?? db.products[0]),
            ...row,
            specifications: fallback?.specifications ?? [],
            documents: fallback?.documents ?? [],
            gallery: fallback?.gallery ?? [],
          } as Product;
        });
      }
    }
  }
  return db.products.filter((p) => p.status === "PUBLISHED");
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const db = await readStore();
  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("updated_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((row) => {
          const fallback = db.products.find((p) => p.slug === row.slug);
          return {
            ...(fallback ?? db.products[0]),
            ...row,
            specifications: fallback?.specifications ?? [],
            documents: fallback?.documents ?? [],
            gallery: fallback?.gallery ?? [],
          } as Product;
        });
      }
    }
  }
  return db.products;
}

export async function getProductBySlug(
  slug: string,
  includeUnpublished = false
): Promise<Product | null> {
  const db = await readStore();
  const found = db.products.find((p) => p.slug === slug);
  if (isSupabaseConfigured()) {
    const supabase = includeUnpublished
      ? createAdminSupabaseClient() ?? createPublicSupabaseClient()
      : createPublicSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) {
        if (!includeUnpublished && data.status !== "PUBLISHED") return null;
        return {
          ...(found ?? db.products[0]),
          ...data,
          specifications: found?.specifications ?? [],
          documents: found?.documents ?? [],
          gallery: found?.gallery ?? [],
        } as Product;
      }
    }
  }
  if (!found) return null;
  if (!includeUnpublished && found.status !== "PUBLISHED") return null;
  return found;
}

export async function upsertProduct(
  productInput: Omit<Product, "id" | "created_at" | "updated_at"> & {
    id?: string;
  },
  actor: { email: string; role: AppRole }
): Promise<Product> {
  const db = await readStore();
  const now = new Date().toISOString();
  const existingIdx = db.products.findIndex(
    (p) => (productInput.id && p.id === productInput.id) || p.slug === productInput.slug
  );

  let saved: Product;
  if (existingIdx >= 0) {
    const prev = db.products[existingIdx];
    saved = {
      ...prev,
      ...productInput,
      id: prev.id,
      updated_at: now,
    };
    db.products[existingIdx] = saved;
  } else {
    saved = {
      ...productInput,
      id: productInput.id || `prod-${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    db.products.unshift(saved);
  }

  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: existingIdx >= 0 ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
    entity_type: "product",
    entity_id: saved.slug,
    metadata: { grade_code: saved.grade_code, status: saved.status },
    created_at: now,
  };
  db.auditLogs.unshift(auditEntry);

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase.from("products").upsert(
      {
        slug: saved.slug,
        name: saved.name,
        grade_code: saved.grade_code,
        polymer_family: saved.polymer_family,
        status: saved.status,
        operational_status: saved.operational_status,
        short_description: saved.short_description,
        technical_overview: saved.technical_overview,
        feedstock_origin: saved.feedstock_origin,
        manufacturing_processes: saved.manufacturing_processes,
        recommended_applications: saved.recommended_applications,
        mfi_value: saved.mfi_value,
        mfi_test_condition: saved.mfi_test_condition,
        density_value: saved.density_value,
        moisture_content: saved.moisture_content,
        ash_content: saved.ash_content,
        filtration_rating: saved.filtration_rating,
        color_profile: saved.color_profile,
        packaging_options: saved.packaging_options,
        indicative_price_idr: saved.indicative_price_idr,
        primary_image_url: saved.primary_image_url,
        featured: saved.featured,
        seo_title: saved.seo_title,
        seo_description: saved.seo_description,
      },
      { onConflict: "slug" }
    );
    await supabase.from("audit_logs").insert({
      actor_email: auditEntry.actor_email,
      actor_role: auditEntry.actor_role,
      action: auditEntry.action,
      entity_type: auditEntry.entity_type,
      entity_id: auditEntry.entity_id,
      metadata: auditEntry.metadata,
    });
  }

  await writeStore(db);
  return saved;
}

export async function updateProductStatus(
  productId: string,
  status: Product["status"],
  actor: { email: string; role: AppRole }
): Promise<Product | null> {
  const db = await readStore();
  const target = db.products.find((p) => p.id === productId || p.slug === productId);
  if (!target) return null;
  target.status = status;
  target.updated_at = new Date().toISOString();

  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: `PRODUCT_STATUS_${status}`,
    entity_type: "product",
    entity_id: target.slug,
    metadata: { grade_code: target.grade_code },
    created_at: target.updated_at,
  };
  db.auditLogs.unshift(auditEntry);

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase
      .from("products")
      .update({ status, updated_at: target.updated_at })
      .eq("slug", target.slug);
    await supabase.from("audit_logs").insert({
      actor_email: auditEntry.actor_email,
      actor_role: auditEntry.actor_role,
      action: auditEntry.action,
      entity_type: auditEntry.entity_type,
      entity_id: auditEntry.entity_id,
      metadata: auditEntry.metadata,
    });
  }

  await writeStore(db);
  return target;
}

export async function createQuoteRequest(
  payload: Omit<
    QuoteRequest,
    "id" | "reference_code" | "status" | "priority" | "assigned_to" | "follow_up_date" | "created_at" | "updated_at"
  >
): Promise<QuoteRequest> {
  const db = await readStore();
  const now = new Date().toISOString();
  const seq = String(db.quoteRequests.length + 101).padStart(4, "0");
  const record: QuoteRequest = {
    ...payload,
    id: `rfq-${Date.now()}`,
    reference_code: `PF-RFQ-2026-${seq}`,
    status: "New",
    priority:
      payload.monthly_volume_kg && payload.monthly_volume_kg >= 10000
        ? "HIGH"
        : "STANDARD",
    assigned_to: "user-sales-1",
    follow_up_date: null,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient() ?? createPublicSupabaseClient();
    if (supabase) {
      await supabase.from("quote_requests").insert({
        reference_code: record.reference_code,
        company_name: record.company_name,
        contact_name: record.contact_name,
        email: record.email,
        phone: record.phone,
        industry_segment: record.industry_segment,
        inquiry_type: record.inquiry_type,
        product_grade: record.product_grade,
        monthly_volume_kg: record.monthly_volume_kg,
        delivery_schedule_preference: record.delivery_schedule_preference,
        target_application: record.target_application,
        message: record.message,
        calculator_snapshot: record.calculator_snapshot,
      });
    }
  }

  db.quoteRequests.unshift(record);
  await writeStore(db);
  return record;
}

export async function createSampleRequest(
  payload: Omit<
    SampleRequest,
    "id" | "reference_code" | "status" | "fulfillment_notes" | "assigned_to" | "created_at" | "updated_at"
  >
): Promise<SampleRequest> {
  const db = await readStore();
  const now = new Date().toISOString();
  const seq = String(db.sampleRequests.length + 41).padStart(4, "0");
  const record: SampleRequest = {
    ...payload,
    id: `smp-${Date.now()}`,
    reference_code: `PF-SMP-2026-${seq}`,
    status: "Pending",
    fulfillment_notes: null,
    assigned_to: "user-sales-1",
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient() ?? createPublicSupabaseClient();
    if (supabase) {
      await supabase.from("sample_requests").insert({
        reference_code: record.reference_code,
        company_name: record.company_name,
        contact_name: record.contact_name,
        email: record.email,
        phone: record.phone,
        plant_city: record.plant_city,
        shipping_address: record.shipping_address,
        product_grade: record.product_grade,
        requested_kg: record.requested_kg,
        conversion_process: record.conversion_process,
        machine_model: record.machine_model,
        requires_onsite_technician: record.requires_onsite_technician,
        preferred_trial_window: record.preferred_trial_window,
        technical_notes: record.technical_notes,
      });
    }
  }

  db.sampleRequests.unshift(record);
  await writeStore(db);
  return record;
}

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as QuoteRequest[];
      }
    }
  }
  const db = await readStore();
  return db.quoteRequests;
}

export async function updateQuoteRequestStatus(
  id: string,
  updates: {
    status?: QuoteRequest["status"];
    priority?: QuoteRequest["priority"];
    follow_up_date?: string | null;
  },
  actor: { email: string; name: string; role: AppRole },
  noteText?: string
): Promise<QuoteRequest | null> {
  const db = await readStore();
  const item = db.quoteRequests.find((q) => q.id === id || q.reference_code === id);
  if (!item) return null;
  const now = new Date().toISOString();
  if (updates.status) item.status = updates.status;
  if (updates.priority) item.priority = updates.priority;
  if (updates.follow_up_date !== undefined) {
    item.follow_up_date = updates.follow_up_date;
  }
  item.updated_at = now;

  if (noteText && noteText.trim().length > 0) {
    db.inquiryNotes.unshift({
      id: `note-${Date.now()}`,
      quote_request_id: item.id,
      sample_request_id: null,
      author_id: null,
      author_name: actor.name,
      author_role: actor.role,
      note: noteText.trim(),
      created_at: now,
    });
  }

  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: "RFQ_UPDATED",
    entity_type: "quote_request",
    entity_id: item.reference_code,
    metadata: { status: item.status, priority: item.priority },
    created_at: now,
  };
  db.auditLogs.unshift(auditEntry);

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase
      .from("quote_requests")
      .update({
        status: item.status,
        priority: item.priority,
        follow_up_date: item.follow_up_date,
        updated_at: now,
      })
      .eq("reference_code", item.reference_code);
    await supabase.from("audit_logs").insert({
      actor_email: auditEntry.actor_email,
      actor_role: auditEntry.actor_role,
      action: auditEntry.action,
      entity_type: auditEntry.entity_type,
      entity_id: auditEntry.entity_id,
      metadata: auditEntry.metadata,
    });
  }

  await writeStore(db);
  return item;
}

export async function getSampleRequests(): Promise<SampleRequest[]> {
  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("sample_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as SampleRequest[];
      }
    }
  }
  const db = await readStore();
  return db.sampleRequests;
}

export async function updateSampleRequestStatus(
  id: string,
  updates: {
    status?: SampleRequest["status"];
    fulfillment_notes?: string | null;
  },
  actor: { email: string; role: AppRole }
): Promise<SampleRequest | null> {
  const db = await readStore();
  const item = db.sampleRequests.find((s) => s.id === id || s.reference_code === id);
  if (!item) return null;
  const now = new Date().toISOString();
  if (updates.status) item.status = updates.status;
  if (updates.fulfillment_notes !== undefined) {
    item.fulfillment_notes = updates.fulfillment_notes;
  }
  item.updated_at = now;

  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: "SAMPLE_REQUEST_UPDATED",
    entity_type: "sample_request",
    entity_id: item.reference_code,
    metadata: { status: item.status },
    created_at: now,
  };
  db.auditLogs.unshift(auditEntry);

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase
      .from("sample_requests")
      .update({
        status: item.status,
        fulfillment_notes: item.fulfillment_notes,
        updated_at: now,
      })
      .eq("reference_code", item.reference_code);
    await supabase.from("audit_logs").insert({
      actor_email: auditEntry.actor_email,
      actor_role: auditEntry.actor_role,
      action: auditEntry.action,
      entity_type: auditEntry.entity_type,
      entity_id: auditEntry.entity_id,
      metadata: auditEntry.metadata,
    });
  }

  await writeStore(db);
  return item;
}

export async function getInquiryNotes(): Promise<InquiryNote[]> {
  const db = await readStore();
  return db.inquiryNotes;
}

export async function getPublishedArticles(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    const supabase = createPublicSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Article[];
      }
    }
  }
  const db = await readStore();
  return db.articles.filter((a) => a.published);
}

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("updated_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Article[];
      }
    }
  }
  const db = await readStore();
  return db.articles;
}

export async function getArticleBySlug(
  slug: string,
  includeUnpublished = false
): Promise<Article | null> {
  if (isSupabaseConfigured()) {
    const supabase = includeUnpublished
      ? createAdminSupabaseClient() ?? createPublicSupabaseClient()
      : createPublicSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) {
        if (!includeUnpublished && !data.published) return null;
        return data as Article;
      }
    }
  }
  const db = await readStore();
  const article = db.articles.find((a) => a.slug === slug);
  if (!article) return null;
  if (!includeUnpublished && !article.published) return null;
  return article;
}

export async function upsertArticle(
  input: Omit<Article, "id" | "created_at" | "updated_at" | "published_at"> & {
    id?: string;
  },
  actor: { email: string; role: AppRole }
): Promise<Article> {
  const db = await readStore();
  const now = new Date().toISOString();
  const idx = db.articles.findIndex(
    (a) => (input.id && a.id === input.id) || a.slug === input.slug
  );
  let saved: Article;
  if (idx >= 0) {
    const prev = db.articles[idx];
    saved = {
      ...prev,
      ...input,
      id: prev.id,
      updated_at: now,
    };
    db.articles[idx] = saved;
  } else {
    saved = {
      ...input,
      id: input.id || `art-${Date.now()}`,
      published_at: now,
      created_at: now,
      updated_at: now,
    };
    db.articles.unshift(saved);
  }

  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: idx >= 0 ? "ARTICLE_UPDATED" : "ARTICLE_CREATED",
    entity_type: "article",
    entity_id: saved.slug,
    metadata: { published: saved.published },
    created_at: now,
  };
  db.auditLogs.unshift(auditEntry);

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase.from("articles").upsert(
      {
        slug: saved.slug,
        title: saved.title,
        excerpt: saved.excerpt,
        content: saved.content,
        category_name: saved.category_name,
        cover_image_url: saved.cover_image_url,
        author_name: saved.author_name,
        author_role: saved.author_role,
        reading_time_minutes: saved.reading_time_minutes,
        published: saved.published,
        published_at: saved.published_at,
        seo_title: saved.seo_title,
        seo_description: saved.seo_description,
      },
      { onConflict: "slug" }
    );
    await supabase.from("audit_logs").insert({
      actor_email: auditEntry.actor_email,
      actor_role: auditEntry.actor_role,
      action: auditEntry.action,
      entity_type: auditEntry.entity_type,
      entity_id: auditEntry.entity_id,
      metadata: auditEntry.metadata,
    });
  }

  await writeStore(db);
  return saved;
}

export async function getSiteContent(): Promise<SiteContentBlock[]> {
  if (isSupabaseConfigured()) {
    const supabase = createPublicSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("site_content").select("*");
      if (!error && data && data.length > 0) {
        return data as SiteContentBlock[];
      }
    }
  }
  const db = await readStore();
  return db.siteContent;
}

export async function updateSiteContentBlock(
  id: string,
  updates: Pick<SiteContentBlock, "title" | "subtitle" | "body">,
  actor: { email: string; role: AppRole }
): Promise<SiteContentBlock | null> {
  const db = await readStore();
  const block = db.siteContent.find((c) => c.id === id);
  if (!block) return null;
  const now = new Date().toISOString();
  block.title = updates.title;
  block.subtitle = updates.subtitle;
  block.body = updates.body;
  block.updated_at = now;

  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: "SITE_CONTENT_UPDATED",
    entity_type: "site_content",
    entity_id: `${block.page_key}.${block.section_key}`,
    metadata: {},
    created_at: now,
  };
  db.auditLogs.unshift(auditEntry);

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase.from("site_content").upsert(
      {
        page_key: block.page_key,
        section_key: block.section_key,
        locale: block.locale,
        title: block.title,
        subtitle: block.subtitle,
        body: block.body,
        structured_data: block.structured_data,
        updated_at: now,
      },
      { onConflict: "page_key,section_key,locale" }
    );
    await supabase.from("audit_logs").insert({
      actor_email: auditEntry.actor_email,
      actor_role: auditEntry.actor_role,
      action: auditEntry.action,
      entity_type: auditEntry.entity_type,
      entity_id: auditEntry.entity_id,
      metadata: auditEntry.metadata,
    });
  }

  await writeStore(db);
  return block;
}

export async function getSiteSettings(): Promise<SiteSetting[]> {
  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient() ?? createPublicSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (!error && data && data.length > 0) {
        return data as SiteSetting[];
      }
    }
  }
  const db = await readStore();
  return db.siteSettings;
}

export async function updateSiteSettingsBatch(
  updates: Record<string, string>,
  actor: { email: string; role: AppRole }
): Promise<SiteSetting[]> {
  const db = await readStore();
  const now = new Date().toISOString();
  for (const setting of db.siteSettings) {
    if (Object.prototype.hasOwnProperty.call(updates, setting.setting_key)) {
      setting.value = updates[setting.setting_key];
      setting.updated_at = now;
    }
  }
  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: "SITE_SETTINGS_UPDATED",
    entity_type: "site_settings",
    entity_id: "global",
    metadata: { keys: Object.keys(updates) },
    created_at: now,
  };
  db.auditLogs.unshift(auditEntry);

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    for (const setting of db.siteSettings) {
      if (Object.prototype.hasOwnProperty.call(updates, setting.setting_key)) {
        await supabase.from("site_settings").upsert(
          {
            setting_key: setting.setting_key,
            setting_group: setting.setting_group,
            label: setting.label,
            value: setting.value,
            is_public: setting.is_public,
            updated_at: now,
          },
          { onConflict: "setting_key" }
        );
      }
    }
    await supabase.from("audit_logs").insert({
      actor_email: auditEntry.actor_email,
      actor_role: auditEntry.actor_role,
      action: auditEntry.action,
      entity_type: auditEntry.entity_type,
      entity_id: auditEntry.entity_id,
      metadata: auditEntry.metadata,
    });
  }

  await writeStore(db);
  return db.siteSettings;
}

export async function getInternalUsers(): Promise<InternalUser[]> {
  const db = await readStore();
  return db.internalUsers;
}

export async function updateInternalUserRole(
  userId: string,
  newRole: AppRole,
  isActive: boolean,
  actor: { email: string; role: AppRole }
): Promise<InternalUser | null> {
  const db = await readStore();
  const target = db.internalUsers.find((u) => u.id === userId);
  if (!target) return null;
  target.role = newRole;
  target.is_active = isActive;

  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: "USER_ROLE_UPDATED",
    entity_type: "internal_user",
    entity_id: target.email,
    metadata: { newRole, isActive },
    created_at: new Date().toISOString(),
  });

  await writeStore(db);
  return target;
}

export async function inviteInternalUser(
  payload: { email: string; full_name: string; title: string; role: AppRole },
  actor: { email: string; role: AppRole }
): Promise<InternalUser> {
  const db = await readStore();
  const now = new Date().toISOString();
  const existing = db.internalUsers.find(
    (u) => u.email.toLowerCase() === payload.email.toLowerCase()
  );
  if (existing) {
    throw new Error("An internal user with this email already exists.");
  }
  const created: InternalUser = {
    id: `user-${Date.now()}`,
    email: payload.email.trim().toLowerCase(),
    full_name: payload.full_name.trim(),
    title: payload.title.trim(),
    role: payload.role,
    is_active: true,
    created_at: now,
  };
  db.internalUsers.push(created);
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    actor_email: actor.email,
    actor_role: actor.role,
    action: "USER_INVITED",
    entity_type: "internal_user",
    entity_id: created.email,
    metadata: { role: created.role },
    created_at: now,
  });
  await writeStore(db);
  return created;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  if (isSupabaseConfigured()) {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40);
      if (!error && data && data.length > 0) {
        return data as AuditLogEntry[];
      }
    }
  }
  const db = await readStore();
  return db.auditLogs.slice(0, 40);
}
