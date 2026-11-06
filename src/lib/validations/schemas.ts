import { z } from "zod";

export const quoteRequestSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Company name must contain at least 2 characters.")
    .max(140, "Company name must not exceed 140 characters."),
  contact_name: z
    .string()
    .trim()
    .min(2, "Contact person name is required.")
    .max(120, "Contact name must not exceed 120 characters."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid business email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Please provide a valid phone or WhatsApp contact number.")
    .max(32, "Phone number is too long."),
  industry_segment: z.string().trim().max(100).optional().or(z.literal("")),
  inquiry_type: z
    .enum([
      "RFQ",
      "ADAPTIVE_SUPPLY",
      "TOLL_RECYCLING",
      "CONSULTATION",
      "CALCULATOR_ESTIMATE",
      "GENERAL",
    ])
    .default("RFQ"),
  product_id: z.string().trim().optional().or(z.literal("")),
  product_grade: z.string().trim().max(80).optional().or(z.literal("")),
  monthly_volume_kg: z
    .preprocess(
      (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
      z.number().positive("Monthly volume must be positive.").max(5000000).optional()
    ),
  delivery_schedule_preference: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal("")),
  target_application: z.string().trim().max(200).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Inquiry notes must be under 2,000 characters.")
    .optional()
    .or(z.literal("")),
  calculator_snapshot: z.any().optional(),
  honeypot: z.string().max(0, "Spam check triggered.").optional().or(z.literal("")),
});

export const sampleRequestSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Manufacturing company name is required.")
    .max(140),
  contact_name: z
    .string()
    .trim()
    .min(2, "Engineer or procurement contact name is required.")
    .max(120),
  email: z.string().trim().email("Please enter a valid business email."),
  phone: z.string().trim().min(7, "Please provide a valid phone number.").max(32),
  plant_city: z
    .string()
    .trim()
    .min(2, "Factory city or industrial estate location is required.")
    .max(120),
  shipping_address: z.string().trim().max(400).optional().or(z.literal("")),
  product_id: z.string().trim().optional().or(z.literal("")),
  product_grade: z
    .string()
    .trim()
    .min(2, "Please select a PrimeFlow grade for sample evaluation.")
    .max(80),
  requested_kg: z.preprocess(
    (v) => Number(v),
    z
      .number()
      .min(1, "Minimum sample trial kit is 1 kg.")
      .max(25, "Standard complimentary sample trial kit is 5 to 10 kg (up to 25 kg single sack).")
  ),
  conversion_process: z
    .string()
    .trim()
    .min(2, "Please specify your conversion process (e.g., Injection Molding, Blow Molding, Film Extrusion).")
    .max(100),
  machine_model: z.string().trim().max(120).optional().or(z.literal("")),
  requires_onsite_technician: z.boolean().default(true),
  preferred_trial_window: z.string().trim().max(120).optional().or(z.literal("")),
  technical_notes: z.string().trim().max(1500).optional().or(z.literal("")),
  honeypot: z.string().max(0, "Spam check triggered.").optional().or(z.literal("")),
});

export const productEditorSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only."),
  name: z.string().trim().min(3, "Product name is required.").max(140),
  grade_code: z.string().trim().min(2, "Grade identifier is required.").max(40),
  polymer_family: z.enum(["Polypropylene", "Polyethylene", "HDPE", "LDPE"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  operational_status: z.enum([
    "PROTOTYPE_SPEC",
    "LAB_VALIDATED",
    "COMMERCIAL_SUPPLY",
  ]),
  short_description: z.string().trim().min(10).max(400),
  technical_overview: z.string().trim().min(20).max(3000),
  feedstock_origin: z.string().trim().min(5).max(300),
  manufacturing_processes: z.array(z.string().trim().min(2)).min(1),
  recommended_applications: z.array(z.string().trim().min(2)).min(1),
  mfi_value: z.string().trim().max(120).nullable().optional(),
  mfi_test_condition: z.string().trim().max(120).nullable().optional(),
  density_value: z.string().trim().max(120).nullable().optional(),
  moisture_content: z.string().trim().max(80).nullable().optional(),
  ash_content: z.string().trim().max(80).nullable().optional(),
  filtration_rating: z.string().trim().max(80).nullable().optional(),
  color_profile: z.string().trim().max(120).nullable().optional(),
  packaging_options: z.array(z.string().trim().min(2)).min(1),
  indicative_price_idr: z
    .preprocess(
      (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
      z.number().positive().nullable()
    )
    .optional(),
  primary_image_url: z.string().trim().min(1),
  featured: z.boolean().default(false),
  seo_title: z.string().trim().max(140).nullable().optional(),
  seo_description: z.string().trim().max(300).nullable().optional(),
});

export const articleEditorSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens."),
  title: z.string().trim().min(5).max(180),
  excerpt: z.string().trim().min(15).max(400),
  content: z.string().trim().min(40),
  category_name: z.string().trim().min(2).max(80),
  cover_image_url: z.string().trim().min(1),
  author_name: z.string().trim().min(2).max(100),
  author_role: z.string().trim().min(2).max(100),
  reading_time_minutes: z.number().int().min(1).max(60).default(5),
  published: z.boolean().default(true),
  seo_title: z.string().trim().max(140).nullable().optional(),
  seo_description: z.string().trim().max(300).nullable().optional(),
});
