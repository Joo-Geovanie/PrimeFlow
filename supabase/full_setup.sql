-- =============================================================================
-- PRIMEFLOW B2B INDUSTRIAL PLATFORM & CUSTOM CMS
-- Supabase PostgreSQL Schema & Row-Level Security (RLS)
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. ENUMS & TYPES
do $$ begin
  create type public.app_role as enum ('SUPER_ADMIN', 'ADMIN_CMS', 'SALES');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.operational_stage as enum ('PROTOTYPE_SPEC', 'LAB_VALIDATED', 'COMMERCIAL_SUPPLY');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.rfq_status as enum ('New', 'Reviewed', 'Contacted', 'Quoted', 'Negotiation', 'Won', 'Lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.sample_status as enum ('Pending', 'Approved', 'Dispatched', 'Trial Scheduled', 'Completed', 'Declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.priority_level as enum ('LOW', 'STANDARD', 'HIGH', 'CRITICAL');
exception when duplicate_object then null; end $$;

-- 2. TIMESTAMP TRIGGER HELPER
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- 3. PROFILES & USER ROLES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  title text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  role public.app_role not null default 'SALES',
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 4. RBAC HELPER FUNCTIONS (SECURITY DEFINER)
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select ur.role
  from public.user_roles ur
  join public.profiles p on p.id = ur.user_id
  where ur.user_id = auth.uid()
    and p.is_active = true
  limit 1;
$$;

create or replace function public.has_any_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = any(allowed_roles), false);
$$;

-- 5. PRODUCT CATALOG TABLES
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  code text not null,
  parent_family text not null,
  summary text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  grade_code text not null unique,
  category_id uuid references public.product_categories(id) on delete set null,
  polymer_family text not null check (polymer_family in ('Polypropylene', 'Polyethylene', 'HDPE', 'LDPE')),
  status public.product_status not null default 'DRAFT',
  operational_status public.operational_stage not null default 'PROTOTYPE_SPEC',
  short_description text not null,
  technical_overview text not null,
  feedstock_origin text not null,
  manufacturing_processes text[] not null default '{}',
  recommended_applications text[] not null default '{}',
  mfi_value text,
  mfi_test_condition text,
  density_value text,
  moisture_content text,
  ash_content text,
  filtration_rating text,
  color_profile text,
  packaging_options text[] not null default '{}',
  indicative_price_idr numeric(12, 2),
  primary_image_url text,
  featured boolean not null default false,
  food_contact_Execution text not null default 'Non-food-grade industrial applications only. Not certified for direct food contact.',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_family on public.products(polymer_family);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text not null,
  caption text,
  is_illustrative boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_specifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  property_group text not null default 'Physical & Rheological',
  property_name text not null,
  test_method text,
  unit text,
  target_value text not null,
  qualification_note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  document_type text not null check (document_type in ('TDS', 'COA_SAMPLE', 'PROCESSING_GUIDE', 'ESG_METHODOLOGY')),
  file_url text,
  version_label text not null default 'v1.0',
  is_verified boolean not null default false,
  requires_auth boolean not null default false,
  qualification_note text,
  created_at timestamptz not null default timezone('utc', now())
);

-- 6. COMMERCIAL INQUIRIES (RFQ, SAMPLE REQUESTS, INTERNAL NOTES)
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  industry_segment text,
  inquiry_type text not null default 'RFQ' check (inquiry_type in ('RFQ', 'ADAPTIVE_SUPPLY', 'TOLL_RECYCLING', 'CONSULTATION', 'CALCULATOR_ESTIMATE', 'GENERAL')),
  product_id uuid references public.products(id) on delete set null,
  product_grade text,
  monthly_volume_kg numeric(12, 2),
  delivery_schedule_preference text,
  target_application text,
  message text,
  calculator_snapshot jsonb,
  status public.rfq_status not null default 'New',
  priority public.priority_level not null default 'STANDARD',
  assigned_to uuid references public.profiles(id) on delete set null,
  follow_up_date date,
  source_ip_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_quote_requests_status on public.quote_requests(status);
create index if not exists idx_quote_requests_created_at on public.quote_requests(created_at desc);

create table if not exists public.sample_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  plant_city text not null,
  shipping_address text,
  product_id uuid references public.products(id) on delete set null,
  product_grade text not null,
  requested_kg numeric(6, 2) not null default 5 check (requested_kg > 0 and requested_kg <= 25),
  conversion_process text not null,
  machine_model text,
  requires_onsite_technician boolean not null default true,
  preferred_trial_window text,
  technical_notes text,
  status public.sample_status not null default 'Pending',
  fulfillment_notes text,
  assigned_to uuid references public.profiles(id) on delete set null,
  source_ip_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_sample_requests_status on public.sample_requests(status);

create table if not exists public.inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid references public.quote_requests(id) on delete cascade,
  sample_request_id uuid references public.sample_requests(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  author_role text not null,
  note text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint inquiry_note_target_check check (
    (quote_request_id is not null and sample_request_id is null) or
    (quote_request_id is null and sample_request_id is not null)
  )
);

-- 7. ARTICLES & INSIGHTS
create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  category_id uuid references public.article_categories(id) on delete set null,
  category_name text not null,
  cover_image_url text,
  author_name text not null,
  author_role text not null,
  reading_time_minutes integer not null default 5,
  published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_published on public.articles(published, published_at desc);

-- 8. SITE CONTENT, SETTINGS, MEDIA & AUDIT LOGS
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  locale text not null default 'en',
  title text not null,
  subtitle text,
  body text,
  structured_data jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (page_key, section_key, locale)
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_group text not null default 'general',
  label text not null,
  value text not null,
  is_public boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  public_url text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  alt_text text not null,
  category text not null default 'material',
  is_illustrative boolean not null default true,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  actor_role text,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

-- 9. UPDATED_AT TRIGGERS
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_user_roles_updated_at on public.user_roles;
create trigger trg_user_roles_updated_at before update on public.user_roles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists trg_quote_requests_updated_at on public.quote_requests;
create trigger trg_quote_requests_updated_at before update on public.quote_requests
for each row execute function public.touch_updated_at();

drop trigger if exists trg_sample_requests_updated_at on public.sample_requests;
create trigger trg_sample_requests_updated_at before update on public.sample_requests
for each row execute function public.touch_updated_at();

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at before update on public.articles
for each row execute function public.touch_updated_at();

-- 10. ROW-LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_specifications enable row level security;
alter table public.product_documents enable row level security;
alter table public.quote_requests enable row level security;
alter table public.sample_requests enable row level security;
alter table public.inquiry_notes enable row level security;
alter table public.article_categories enable row level security;
alter table public.articles enable row level security;
alter table public.site_content enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles & User Roles: Self read, Super Admin full control
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS', 'SALES']::public.app_role[]));

create policy "profiles_manage_super_admin" on public.profiles
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN']::public.app_role[]));

create policy "user_roles_select_authenticated" on public.user_roles
  for select to authenticated
  using (user_id = auth.uid() or public.has_any_role(array['SUPER_ADMIN']::public.app_role[]));

create policy "user_roles_manage_super_admin" on public.user_roles
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN']::public.app_role[]));

-- Product Categories & Products: Public can read published; SUPER_ADMIN and ADMIN_CMS manage
create policy "categories_public_read" on public.product_categories
  for select to anon, authenticated using (true);

create policy "categories_cms_write" on public.product_categories
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "products_public_read_published" on public.products
  for select to anon, authenticated
  using (status = 'PUBLISHED' or public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS', 'SALES']::public.app_role[]));

create policy "products_cms_write" on public.products
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "product_images_public_read" on public.product_images
  for select to anon, authenticated using (true);

create policy "product_images_cms_write" on public.product_images
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "product_specs_public_read" on public.product_specifications
  for select to anon, authenticated using (true);

create policy "product_specs_cms_write" on public.product_specifications
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "product_docs_public_read" on public.product_documents
  for select to anon, authenticated
  using (requires_auth = false or public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS', 'SALES']::public.app_role[]));

create policy "product_docs_cms_write" on public.product_documents
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

-- Quote Requests & Sample Requests:
-- Public visitors can INSERT only. They CANNOT select/read any submissions.
-- SUPER_ADMIN and SALES can read and update.
create policy "quote_requests_public_insert" on public.quote_requests
  for insert to anon, authenticated
  with check (status = 'New');

create policy "quote_requests_staff_read" on public.quote_requests
  for select to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'SALES', 'ADMIN_CMS']::public.app_role[]));

create policy "quote_requests_sales_update" on public.quote_requests
  for update to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'SALES']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'SALES']::public.app_role[]));

create policy "sample_requests_public_insert" on public.sample_requests
  for insert to anon, authenticated
  with check (status = 'Pending');

create policy "sample_requests_staff_read" on public.sample_requests
  for select to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'SALES', 'ADMIN_CMS']::public.app_role[]));

create policy "sample_requests_sales_update" on public.sample_requests
  for update to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'SALES']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'SALES']::public.app_role[]));

create policy "inquiry_notes_staff_all" on public.inquiry_notes
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'SALES']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'SALES']::public.app_role[]));

-- Articles & Content: Public reads published; SUPER_ADMIN and ADMIN_CMS write
create policy "article_categories_public_read" on public.article_categories
  for select to anon, authenticated using (true);

create policy "articles_public_read" on public.articles
  for select to anon, authenticated
  using (published = true or public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "articles_cms_write" on public.articles
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "site_content_public_read" on public.site_content
  for select to anon, authenticated using (true);

create policy "site_content_cms_write" on public.site_content
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "site_settings_public_read" on public.site_settings
  for select to anon, authenticated
  using (is_public = true or public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "site_settings_super_admin_write" on public.site_settings
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN']::public.app_role[]));

create policy "media_assets_public_read" on public.media_assets
  for select to anon, authenticated using (true);

create policy "media_assets_cms_write" on public.media_assets
  for all to authenticated
  using (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]))
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS']::public.app_role[]));

create policy "audit_logs_super_admin_read" on public.audit_logs
  for select to authenticated
  using (public.has_any_role(array['SUPER_ADMIN']::public.app_role[]));

create policy "audit_logs_staff_insert" on public.audit_logs
  for insert to authenticated
  with check (public.has_any_role(array['SUPER_ADMIN', 'ADMIN_CMS', 'SALES']::public.app_role[]));
-- =============================================================================
-- PRIMEFLOW SEED DATA (GROUNDED IN OFFICIAL BUSINESS PROPOSAL)
-- Note: Prototype grades and target QC specifications are clearly qualified.
-- =============================================================================

insert into public.product_categories (slug, name, code, parent_family, summary, sort_order)
values
  ('polypropylene', 'Polypropylene (PP)', 'PP', 'Polypropylene', 'Post-industrial recycled polypropylene engineered for stable melt flow in rigid non-food packaging and household molding.', 1),
  ('polyethylene', 'Polyethylene (PE Family)', 'PE', 'Polyethylene', 'Recycled polyethylene grades covering high-density and low-density industrial streams for containers, liners, and secondary films.', 2),
  ('hdpe', 'High-Density Polyethylene (HDPE)', 'HDPE', 'Polyethylene', 'High-stiffness post-industrial HDPE granules purified via hot alkaline washing and micro-filtration for blow and injection molding.', 3),
  ('ldpe', 'Low-Density Polyethylene (LDPE)', 'LDPE', 'Polyethylene', 'Flexible post-industrial LDPE resin processed from clean industrial film trimmings for non-food film extrusion and protective liners.', 4)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  sort_order = excluded.sort_order;

insert into public.products (
  slug, name, grade_code, polymer_family, status, operational_status,
  short_description, technical_overview, feedstock_origin,
  manufacturing_processes, recommended_applications,
  mfi_value, mfi_test_condition, density_value, moisture_content, ash_content, filtration_rating,
  color_profile, packaging_options, indicative_price_idr, primary_image_url, featured,
  seo_title, seo_description
)
values
  (
    'primeflow-pp-100',
    'PrimeFlow PP 100 Near-Virgin Homopolymer',
    'PP 100',
    'Polypropylene',
    'PUBLISHED',
    'PROTOTYPE_SPEC',
    'Post-industrial recycled Polypropylene pellet grade (Prototype Lot PF-11223) formulated for stable melt viscosity in injection molding and rigid non-food packaging.',
    'PrimeFlow PP 100 is produced from curated single-stream post-industrial polypropylene trimmings and off-spec industrial parts, with strict NIR screening to reject PVC contaminants (<0.1%). Processed through 70 to 80 C alkaline washing, controlled antioxidant and organic peroxide dosing, triple-stage vacuum degassing, and 100 to 120 mesh (<100 micron) melt filtration.',
    'Selected post-industrial PP conversion trimmings and runners (single-heat-history stream)',
    array['Injection Molding', 'Thermoforming (Non-Food)', 'Rigid Sheet Extrusion'],
    array['Household storage containers and organizers', 'Industrial component trays and crates', 'Non-food rigid closures and caps', 'Appliance utility casings'],
    'Target ~2.17 g/10 min (grade-tunable via peroxide dosing)',
    'ASTM D1238 (230 C / 2.16 kg)',
    '0.90 - 0.91 g/cm3 (Target specification)',
    '< 0.05%',
    '< 0.15%',
    '100 - 120 mesh (< 100 micron)',
    'Natural Translucent / Light Industrial',
    array['25 kg Woven PP Bag with PE Inner Liner (Lot PF-11223 prototype)', '500 - 1,000 kg Jumbo Bag (upon contract schedule)'],
    18080.00,
    '/images/materials/pp-natural.jpg',
    true,
    'PrimeFlow PP 100 | Recycled Polypropylene Resin Specification',
    'Technical specification for PrimeFlow PP 100 post-industrial recycled polypropylene pellets with target <0.05% moisture and 100-120 mesh melt filtration.'
  ),
  (
    'primeflow-hdpe-100',
    'PrimeFlow HDPE 100 Structural Blow & Injection Grade',
    'HDPE 100',
    'HDPE',
    'PUBLISHED',
    'PROTOTYPE_SPEC',
    'High-density polyethylene recycled resin (Prototype Lot PF-12345) engineered for dimensional accuracy in non-food bottles, jerrycans, and industrial containers.',
    'PrimeFlow HDPE 100 originates from clean post-industrial HDPE scrap sorted by processing application and base color. Hot alkaline washing removes surface oils and label adhesives without degrading the polymer backbone, while triple-stage vacuum degassing removes volatile organic compounds and residual moisture prior to precision pelletizing.',
    'Sorted post-industrial HDPE container trimmings and industrial flash',
    array['Blow Molding', 'Injection Molding', 'Profile Extrusion'],
    array['Household chemical and detergent bottles (non-food)', 'Industrial jerrycans and pails', 'Material handling pallets and dunnage', 'Utility piping and conduits'],
    'Grade-dependent per client molding specification (COA issued per batch)',
    'ASTM D1238 (190 C / 2.16 kg)',
    '0.94 - 0.96 g/cm3 (Target specification)',
    '< 0.05%',
    '< 0.15%',
    '100 - 120 mesh (< 100 micron)',
    'Natural White / Light Neutral',
    array['25 kg Woven PP Bag with PE Inner Liner (Lot PF-12345 prototype)', '500 - 1,000 kg Jumbo Bag (upon contract schedule)'],
    18080.00,
    '/images/materials/hdpe-pellets.jpg',
    true,
    'PrimeFlow HDPE 100 | Recycled High-Density Polyethylene Specification',
    'Technical data for PrimeFlow HDPE 100 post-industrial recycled high-density polyethylene resin for blow molding and rigid industrial applications.'
  ),
  (
    'primeflow-ldpe-film-200',
    'PrimeFlow LDPE 200 Flexible Film & Liner Grade',
    'LDPE 200',
    'LDPE',
    'PUBLISHED',
    'PROTOTYPE_SPEC',
    'Low-gel post-industrial LDPE resin formulated from clean factory film trimmings and distribution stretch wrap for consistent blown-film gauge stability.',
    'Addressing the under-recycled flexible film stream in Indonesia, PrimeFlow LDPE 200 processes uncontaminated post-industrial and post-commercial film cutoffs. Fine 100 to 120 mesh filtration and primary/secondary antioxidant stabilization prevent gel spots, die-head buildup, and film tearing during secondary blown-film extrusion.',
    'Post-industrial LDPE film edge trim and clean distribution stretch film',
    array['Blown Film Extrusion', 'Cast Film Extrusion', 'Masterbatch Carrier'],
    array['Industrial protective packaging liners', 'Heavy-duty refuse and utility bags', 'Secondary shrink and stretch wrap (non-food)', 'Agricultural polybags and sheeting'],
    '2.17 g/10 min reference stability on single-heat post-industrial film stream',
    'ASTM D1238 (190 C / 2.16 kg)',
    '0.915 - 0.930 g/cm3 (Target specification)',
    '< 0.05%',
    '< 0.15%',
    '100 - 120 mesh (< 100 micron)',
    'Semi-Translucent Natural',
    array['25 kg Woven PP Bag with PE Inner Liner', '500 - 1,000 kg Jumbo Bag'],
    18080.00,
    '/images/materials/ldpe-pellets.jpg',
    true,
    'PrimeFlow LDPE 200 | Recycled Low-Density Polyethylene Film Grade',
    'Low-gel recycled LDPE pellets from post-industrial film trimmings with <100 micron filtration for stable blown film extrusion.'
  ),
  (
    'primeflow-pe-blend-150',
    'PrimeFlow PE 150 Industrial Utility Compound',
    'PE 150',
    'Polyethylene',
    'PUBLISHED',
    'PROTOTYPE_SPEC',
    'Balanced Polyethylene utility grade designed for medium-sized manufacturers seeking cost-efficient, machine-safe feedstock for secondary molded goods.',
    'PrimeFlow PE 150 provides a consistent, deodorized, and thermally stabilized polyethylene stream for general-purpose non-food molding. Every batch undergoes internal laboratory verification for Melt Flow Index, moisture (<0.05%), ash content (<0.15%), and mold shrinkage prior to QR-coded Certificate of Analysis issuance.',
    'Curated post-industrial Polyethylene conversion scrap',
    array['Injection Molding', 'Compression Molding', 'Extrusion'],
    array['Household utility ware (buckets, basins, hangers)', 'Logistics bins and dividers', 'Non-load-bearing industrial spacers', 'Recycled-content packaging components'],
    'Configured per customer mold flow requirement (verified on batch COA)',
    'ASTM D1238',
    '0.92 - 0.95 g/cm3 (Target specification)',
    '< 0.05%',
    '< 0.15%',
    '100 - 120 mesh (< 100 micron)',
    'Light Industrial Neutral / Custom Base Sort',
    array['25 kg Woven PP Bag with PE Inner Liner'],
    18080.00,
    '/images/materials/pe-white.jpg',
    false,
    'PrimeFlow PE 150 | Recycled Polyethylene Utility Resin',
    'Post-industrial Polyethylene resin pellets with verified COA parameters for household and industrial molding.'
  )
on conflict (slug) do nothing;
