import { promises as fs, existsSync, readFileSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local if present
const envLocalPath = path.join(process.cwd(), ".env.local");
if (existsSync(envLocalPath)) {
  const lines = readFileSync(envLocalPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const STORE_FILE = path.join(process.cwd(), ".data", "primeflow-store.json");
const CLOUD_STATE_BUCKET = "primeflow-cms-state";
const CLOUD_STATE_OBJECT = "primeflow-store.json";

async function main() {
  console.log("Connecting to Supabase:", SUPABASE_URL);
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Ensure buckets exist
  const { data: buckets, error: listErr } = await admin.storage.listBuckets();
  if (listErr) {
    throw new Error(`Failed to list Supabase buckets: ${listErr.message}`);
  }

  if (!buckets.some((b) => b.name === CLOUD_STATE_BUCKET)) {
    const { error } = await admin.storage.createBucket(CLOUD_STATE_BUCKET, {
      public: false,
    });
    if (error) throw new Error(`Create bucket ${CLOUD_STATE_BUCKET}: ${error.message}`);
    console.log(`Created private bucket: ${CLOUD_STATE_BUCKET}`);
  } else {
    console.log(`Bucket ready: ${CLOUD_STATE_BUCKET}`);
  }

  if (!buckets.some((b) => b.name === "primeflow-media")) {
    const { error } = await admin.storage.createBucket("primeflow-media", {
      public: true,
    });
    if (error) throw new Error(`Create bucket primeflow-media: ${error.message}`);
    console.log("Created public bucket: primeflow-media");
  } else {
    console.log("Bucket ready: primeflow-media");
  }

  // 2. Read local store and sync to Supabase Cloud Storage
  const raw = await fs.readFile(STORE_FILE, "utf-8");
  const db = JSON.parse(raw);

  const { error: uploadErr } = await admin.storage
    .from(CLOUD_STATE_BUCKET)
    .upload(CLOUD_STATE_OBJECT, Buffer.from(raw, "utf-8"), {
      contentType: "application/json",
      upsert: true,
    });

  if (uploadErr) {
    throw new Error(`Upload state error: ${uploadErr.message}`);
  }
  console.log(
    `Uploaded runtime database to Supabase Storage (${CLOUD_STATE_BUCKET}/${CLOUD_STATE_OBJECT})`
  );

  // Verify download
  const { data: downloaded, error: downErr } = await admin.storage
    .from(CLOUD_STATE_BUCKET)
    .download(CLOUD_STATE_OBJECT);
  if (downErr || !downloaded) {
    throw new Error(`Download verification error: ${downErr?.message}`);
  }
  const verifiedJson = JSON.parse(await downloaded.text());
  console.log(
    `Verified cloud state: ${verifiedJson.products?.length || 0} products, ${
      verifiedJson.articles?.length || 0
    } articles, ${verifiedJson.quoteRequests?.length || 0} RFQs, ${
      verifiedJson.sampleRequests?.length || 0
    } sample requests.`
  );

  // 3. Check if PostgreSQL relational tables exist and sync if available
  const { error: tableCheckErr } = await admin
    .from("product_categories")
    .select("slug")
    .limit(1);

  if (tableCheckErr) {
    console.log(
      "Note: Relational SQL tables (public.products, etc.) are not yet created in Supabase SQL Editor."
    );
    console.log(
      "Cloud Storage persistence is ACTIVE and ready. Run supabase/full_setup.sql in Supabase SQL Editor (or provide DATABASE_URL) to also enable direct relational table rows."
    );
    return;
  }

  console.log("Relational SQL tables detected! Syncing rows to PostgreSQL...");

  if (Array.isArray(db.categories)) {
    for (const c of db.categories) {
      await admin.from("product_categories").upsert(
        {
          slug: c.slug,
          name: c.name,
          code: c.code,
          parent_family: c.parent_family,
          summary: c.summary,
          sort_order: c.sort_order,
        },
        { onConflict: "slug" }
      );
    }
    console.log(`Synced ${db.categories.length} product_categories.`);
  }

  if (Array.isArray(db.products)) {
    for (const p of db.products) {
      await admin.from("products").upsert(
        {
          slug: p.slug,
          name: p.name,
          grade_code: p.grade_code,
          polymer_family: p.polymer_family,
          status: p.status,
          operational_status: p.operational_status,
          short_description: p.short_description,
          technical_overview: p.technical_overview,
          feedstock_origin: p.feedstock_origin,
          manufacturing_processes: p.manufacturing_processes,
          recommended_applications: p.recommended_applications,
          mfi_value: p.mfi_value,
          mfi_test_condition: p.mfi_test_condition,
          density_value: p.density_value,
          moisture_content: p.moisture_content,
          ash_content: p.ash_content,
          filtration_rating: p.filtration_rating,
          color_profile: p.color_profile,
          packaging_options: p.packaging_options,
          indicative_price_idr: p.indicative_price_idr,
          primary_image_url: p.primary_image_url,
          featured: p.featured,
          seo_title: p.seo_title,
          seo_description: p.seo_description,
        },
        { onConflict: "slug" }
      );
    }
    console.log(`Synced ${db.products.length} products.`);
  }

  if (Array.isArray(db.articles)) {
    for (const a of db.articles) {
      await admin.from("articles").upsert(
        {
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          content: a.content,
          category_name: a.category_name,
          cover_image_url: a.cover_image_url,
          author_name: a.author_name,
          author_role: a.author_role,
          reading_time_minutes: a.reading_time_minutes,
          published: a.published,
          published_at: a.published_at,
          seo_title: a.seo_title,
          seo_description: a.seo_description,
        },
        { onConflict: "slug" }
      );
    }
    console.log(`Synced ${db.articles.length} articles.`);
  }

  if (Array.isArray(db.siteContent)) {
    for (const sc of db.siteContent) {
      await admin.from("site_content").upsert(
        {
          page_key: sc.page_key,
          section_key: sc.section_key,
          locale: sc.locale,
          title: sc.title,
          subtitle: sc.subtitle,
          body: sc.body,
          structured_data: sc.structured_data || {},
        },
        { onConflict: "page_key,section_key,locale" }
      );
    }
    console.log(`Synced ${db.siteContent.length} site_content blocks.`);
  }

  if (Array.isArray(db.siteSettings)) {
    for (const ss of db.siteSettings) {
      await admin.from("site_settings").upsert(
        {
          setting_key: ss.setting_key,
          setting_group: ss.setting_group,
          label: ss.label,
          value: ss.value,
          is_public: ss.is_public,
        },
        { onConflict: "setting_key" }
      );
    }
    console.log(`Synced ${db.siteSettings.length} site_settings.`);
  }

  if (Array.isArray(db.quoteRequests)) {
    for (const q of db.quoteRequests) {
      await admin.from("quote_requests").upsert(
        {
          reference_code: q.reference_code,
          company_name: q.company_name,
          contact_name: q.contact_name,
          email: q.email,
          phone: q.phone,
          industry_segment: q.industry_segment,
          inquiry_type: q.inquiry_type,
          product_grade: q.product_grade,
          monthly_volume_kg: q.monthly_volume_kg,
          delivery_schedule_preference: q.delivery_schedule_preference,
          target_application: q.target_application,
          message: q.message,
          calculator_snapshot: q.calculator_snapshot,
          status: q.status,
          priority: q.priority,
          follow_up_date: q.follow_up_date,
        },
        { onConflict: "reference_code" }
      );
    }
    console.log(`Synced ${db.quoteRequests.length} quote_requests.`);
  }

  if (Array.isArray(db.sampleRequests)) {
    for (const s of db.sampleRequests) {
      await admin.from("sample_requests").upsert(
        {
          reference_code: s.reference_code,
          company_name: s.company_name,
          contact_name: s.contact_name,
          email: s.email,
          phone: s.phone,
          plant_city: s.plant_city,
          shipping_address: s.shipping_address,
          product_grade: s.product_grade,
          requested_kg: s.requested_kg,
          conversion_process: s.conversion_process,
          machine_model: s.machine_model,
          requires_onsite_technician: s.requires_onsite_technician,
          preferred_trial_window: s.preferred_trial_window,
          technical_notes: s.technical_notes,
          status: s.status,
          fulfillment_notes: s.fulfillment_notes,
        },
        { onConflict: "reference_code" }
      );
    }
    console.log(`Synced ${db.sampleRequests.length} sample_requests.`);
  }

  console.log("Full Supabase sync complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
