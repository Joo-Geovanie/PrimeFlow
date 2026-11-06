export type AppRole = "SUPER_ADMIN" | "ADMIN_CMS" | "SALES";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type OperationalStage =
  | "PROTOTYPE_SPEC"
  | "LAB_VALIDATED"
  | "COMMERCIAL_SUPPLY";

export type PolymerFamily =
  | "Polypropylene"
  | "Polyethylene"
  | "HDPE"
  | "LDPE";

export type RfqStatus =
  | "New"
  | "Reviewed"
  | "Contacted"
  | "Quoted"
  | "Negotiation"
  | "Won"
  | "Lost";

export type SampleStatus =
  | "Pending"
  | "Approved"
  | "Dispatched"
  | "Trial Scheduled"
  | "Completed"
  | "Declined";

export type PriorityLevel = "LOW" | "STANDARD" | "HIGH" | "CRITICAL";

export type InquiryType =
  | "RFQ"
  | "ADAPTIVE_SUPPLY"
  | "TOLL_RECYCLING"
  | "CONSULTATION"
  | "CALCULATOR_ESTIMATE"
  | "GENERAL";

export interface ProductSpecification {
  id: string;
  product_id: string;
  property_group: string;
  property_name: string;
  test_method: string | null;
  unit: string | null;
  target_value: string;
  qualification_note: string | null;
  sort_order: number;
}

export interface ProductDocument {
  id: string;
  product_id: string;
  title: string;
  document_type: "TDS" | "COA_SAMPLE" | "PROCESSING_GUIDE" | "ESG_METHODOLOGY";
  file_url: string | null;
  version_label: string;
  is_verified: boolean;
  requires_auth: boolean;
  qualification_note: string | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  caption: string | null;
  is_illustrative: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  grade_code: string;
  category_id: string | null;
  polymer_family: PolymerFamily;
  status: ProductStatus;
  operational_status: OperationalStage;
  short_description: string;
  technical_overview: string;
  feedstock_origin: string;
  manufacturing_processes: string[];
  recommended_applications: string[];
  mfi_value: string | null;
  mfi_test_condition: string | null;
  density_value: string | null;
  moisture_content: string | null;
  ash_content: string | null;
  filtration_rating: string | null;
  color_profile: string | null;
  packaging_options: string[];
  indicative_price_idr: number | null;
  primary_image_url: string;
  secondary_image_url?: string;
  featured: boolean;
  food_contact_Execution: string;
  seo_title: string | null;
  seo_description: string | null;
  specifications: ProductSpecification[];
  documents: ProductDocument[];
  gallery: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  code: string;
  parent_family: string;
  summary: string;
  sort_order: number;
}

export interface CalculatorSnapshot {
  consumptionUnit: "kg" | "tons";
  monthlyVolumeKg: number;
  virginPricePerKg: number;
  primeflowPricePerKg: number;
  monthlyVirginCost: number;
  monthlyPrimeflowCost: number;
  monthlySavings: number;
  annualSavings: number;
  percentageDifference: number;
  currency: "IDR" | "USD";
}

export interface QuoteRequest {
  id: string;
  reference_code: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  industry_segment: string | null;
  inquiry_type: InquiryType;
  product_id: string | null;
  product_grade: string | null;
  monthly_volume_kg: number | null;
  delivery_schedule_preference: string | null;
  target_application: string | null;
  message: string | null;
  calculator_snapshot: CalculatorSnapshot | null;
  status: RfqStatus;
  priority: PriorityLevel;
  assigned_to: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SampleRequest {
  id: string;
  reference_code: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  plant_city: string;
  shipping_address: string | null;
  product_id: string | null;
  product_grade: string;
  requested_kg: number;
  conversion_process: string;
  machine_model: string | null;
  requires_onsite_technician: boolean;
  preferred_trial_window: string | null;
  technical_notes: string | null;
  status: SampleStatus;
  fulfillment_notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryNote {
  id: string;
  quote_request_id: string | null;
  sample_request_id: string | null;
  author_id: string | null;
  author_name: string;
  author_role: AppRole;
  note: string;
  created_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_name: string;
  cover_image_url: string;
  author_name: string;
  author_role: string;
  reading_time_minutes: number;
  published: boolean;
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface InternalUser {
  id: string;
  email: string;
  full_name: string;
  title: string;
  role: AppRole;
  is_active: boolean;
  created_at: string;
}

export interface SiteContentBlock {
  id: string;
  page_key: string;
  section_key: string;
  locale: "en" | "id";
  title: string;
  subtitle: string;
  body: string;
  structured_data: Record<string, unknown>;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_group: "company" | "contact" | "metadata" | "operations";
  label: string;
  value: string;
  is_public: boolean;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor_email: string;
  actor_role: AppRole;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
