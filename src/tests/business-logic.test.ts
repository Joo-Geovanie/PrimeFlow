import { describe, expect, it } from "vitest";
import { calculateMaterialSavings } from "@/lib/utils/calculator";
import { assertPermission, canAssignRole, hasPermission } from "@/lib/auth/rbac";
import {
  quoteRequestSchema,
  sampleRequestSchema,
} from "@/lib/validations/schemas";

describe("Material Savings Calculator (Section 10)", () => {
  it("computes accurate monthly and annual expenditure and savings for metric tons", () => {
    const res = calculateMaterialSavings({
      consumptionValue: 15,
      consumptionUnit: "tons",
      virginPricePerKg: 24500,
      primeflowPricePerKg: 18080,
      currency: "IDR",
    });

    expect(res.valid).toBe(true);
    expect(res.snapshot).toBeDefined();
    expect(res.snapshot!.monthlyVolumeKg).toBe(15000);
    expect(res.snapshot!.monthlyVirginCost).toBe(367500000);
    expect(res.snapshot!.monthlyPrimeflowCost).toBe(271200000);
    expect(res.snapshot!.monthlySavings).toBe(96300000);
    expect(res.snapshot!.annualSavings).toBe(1155600000);
    expect(res.snapshot!.percentageDifference).toBeCloseTo(26.2, 1);
  });

  it("computes accurate values when unit is kilograms", () => {
    const res = calculateMaterialSavings({
      consumptionValue: 5000,
      consumptionUnit: "kg",
      virginPricePerKg: 20000,
      primeflowPricePerKg: 15000,
    });

    expect(res.valid).toBe(true);
    expect(res.snapshot!.monthlyVolumeKg).toBe(5000);
    expect(res.snapshot!.monthlySavings).toBe(25000000);
    expect(res.snapshot!.annualSavings).toBe(300000000);
    expect(res.snapshot!.percentageDifference).toBe(25);
  });

  it("rejects zero or negative consumption or prices", () => {
    expect(
      calculateMaterialSavings({
        consumptionValue: 0,
        consumptionUnit: "tons",
        virginPricePerKg: 24000,
        primeflowPricePerKg: 18000,
      }).valid
    ).toBe(false);

    expect(
      calculateMaterialSavings({
        consumptionValue: 10,
        consumptionUnit: "tons",
        virginPricePerKg: -100,
        primeflowPricePerKg: 18000,
      }).valid
    ).toBe(false);
  });
});

describe("RBAC Authorization Matrix (Section 11)", () => {
  it("grants SUPER_ADMIN full permissions including role assignment and settings", () => {
    expect(hasPermission("SUPER_ADMIN", "users:manage")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "roles:assign")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "products:write")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "rfq:update")).toBe(true);
    expect(canAssignRole("SUPER_ADMIN", "SUPER_ADMIN")).toBe(true);
    expect(canAssignRole("SUPER_ADMIN", "ADMIN_CMS")).toBe(true);
    expect(canAssignRole("SUPER_ADMIN", "SALES")).toBe(true);
  });

  it("prevents ADMIN_CMS from granting itself SUPER_ADMIN or managing users", () => {
    expect(hasPermission("ADMIN_CMS", "products:write")).toBe(true);
    expect(hasPermission("ADMIN_CMS", "content:write")).toBe(true);
    expect(hasPermission("ADMIN_CMS", "users:manage")).toBe(false);
    expect(hasPermission("ADMIN_CMS", "roles:assign")).toBe(false);
    expect(canAssignRole("ADMIN_CMS", "SUPER_ADMIN")).toBe(false);
    expect(canAssignRole("ADMIN_CMS", "SALES")).toBe(false);
  });

  it("prevents SALES from modifying roles or editing CMS products while allowing RFQ and sample updates", () => {
    expect(hasPermission("SALES", "rfq:update")).toBe(true);
    expect(hasPermission("SALES", "samples:update")).toBe(true);
    expect(hasPermission("SALES", "notes:write")).toBe(true);
    expect(hasPermission("SALES", "products:write")).toBe(false);
    expect(hasPermission("SALES", "roles:assign")).toBe(false);
    expect(canAssignRole("SALES", "SALES")).toBe(false);
    expect(() => assertPermission("SALES", "roles:assign")).toThrow();
  });
});

describe("Public Form Validation & Spam Protection (Sections 13 & 23)", () => {
  it("validates a well-formed RFQ submission and blocks honeypot spam", () => {
    const validRfq = quoteRequestSchema.safeParse({
      company_name: "PT Maju Jaya Polimer",
      contact_name: "Andi Pratama",
      email: "andi@majujaya.co.id",
      phone: "+628123456789",
      inquiry_type: "ADAPTIVE_SUPPLY",
      product_grade: "PP 100",
      monthly_volume_kg: 12000,
      honeypot: "",
    });
    expect(validRfq.success).toBe(true);

    const spamRfq = quoteRequestSchema.safeParse({
      company_name: "Spam Bot Corp",
      contact_name: "Bot",
      email: "bot@example.com",
      phone: "+628123456789",
      honeypot: "http://spam-link.example",
    });
    expect(spamRfq.success).toBe(false);
  });

  it("enforces sample trial kit bounds (1 to 25 kg) and required plant fields", () => {
    const validSample = sampleRequestSchema.safeParse({
      company_name: "PT Kemasan Presisi",
      contact_name: "Siti Rahma",
      email: "siti@kemasanpresisi.co.id",
      phone: "+62811223344",
      plant_city: "Cikarang",
      product_grade: "HDPE 100",
      requested_kg: 10,
      conversion_process: "Extrusion Blow Molding",
      requires_onsite_technician: true,
    });
    expect(validSample.success).toBe(true);

    const excessiveSample = sampleRequestSchema.safeParse({
      company_name: "PT Kemasan Presisi",
      contact_name: "Siti Rahma",
      email: "siti@kemasanpresisi.co.id",
      phone: "+62811223344",
      plant_city: "Cikarang",
      product_grade: "HDPE 100",
      requested_kg: 500,
      conversion_process: "Extrusion Blow Molding",
    });
    expect(excessiveSample.success).toBe(false);
  });
});
