import { NextRequest, NextResponse } from "next/server";

const DOCUMENTS: Record<
  string,
  { title: string; filename: string; content: string }
> = {
  "primeflow-pp-100-tds": {
    title: "PrimeFlow PP 100 Preliminary Technical Data Sheet",
    filename: "PrimeFlow-PP-100-Preliminary-TDS.txt",
    content: [
      "PRIMEFLOW INDUSTRIAL MATERIALS",
      "PRELIMINARY TECHNICAL DATA SHEET (PROTOTYPE SPECIFICATION)",
      "====================================================================",
      "Product Name       : PrimeFlow PP 100 Near-Virgin Homopolymer",
      "Grade Identifier   : PP 100 (Prototype Lot Reference: PF-11223)",
      "Polymer Family     : Polypropylene (PP)",
      "Operational Status : Phase 1 Venture Prototype / Target QC Specification",
      "Feedstock Origin   : Selected Post-Industrial PP Conversion Trimmings",
      "",
      "1. TARGET TECHNICAL PARAMETERS (VALIDATED PER BATCH ON COA)",
      "--------------------------------------------------------------------",
      "Melt Flow Index (MFI)      : ~2.17 g/10 min reference (ASTM D1238, 230C/2.16kg)",
      "                             Grade-tunable via controlled organic peroxide dosing",
      "Density                    : 0.90 - 0.91 g/cm3 (Target specification)",
      "Moisture Content           : < 0.05% (Halogen Moisture Analyzer)",
      "Ash Content                : < 0.15% (ASTM D5630)",
      "Melt Filtration Screen     : 100 - 120 mesh (< 100 micron)",
      "PVC Contamination Limit    : < 0.1% (Strict NIR batch rejection threshold)",
      "Mechanical & Shrinkage     : ISO 527 / ISO 179 / Internal Mold Shrinkage Check",
      "",
      "2. PURIFICATION & COMPOUNDING PROTOCOL",
      "--------------------------------------------------------------------",
      "- Stage 1: Handheld NIR Spectroscopy & Homogeneous Base-Color Sorting",
      "- Stage 2: 70 - 80 C Multi-Stage Hot Alkaline & Surfactant Washing",
      "- Stage 3: Centrifugal & Thermal Drying (< 0.05% moisture verification)",
      "- Stage 4: Primary & Secondary Antioxidant (0.1 - 0.3%) + Deodorizer Dosing",
      "- Stage 5: Single-Screw Extrusion + Triple-Stage Vacuum Degassing + 100-120 Mesh Filter",
      "- Stage 6: Precision Pelletizing, Vibrating Sieve & 6-Parameter Lab QC",
      "- Stage 7: 25 kg Woven PP Bag with Sealed PE Inner Liner & QR COA Passport",
      "",
      "3. REGULATORY & APPLICATION QUALIFICATION",
      "--------------------------------------------------------------------",
      "Intended strictly for non-food-grade injection molding, thermoforming, and",
      "rigid utility packaging. Near-virgin denotes target rheological and visual",
      "consistency compared to conventional multi-cycle scrap; it does not represent",
      "certified virgin petrochemical resin or food-contact compliance.",
    ].join("\n"),
  },
  "primeflow-hdpe-100-tds": {
    title: "PrimeFlow HDPE 100 Preliminary Technical Data Sheet",
    filename: "PrimeFlow-HDPE-100-Preliminary-TDS.txt",
    content: [
      "PRIMEFLOW INDUSTRIAL MATERIALS",
      "PRELIMINARY TECHNICAL DATA SHEET (PROTOTYPE SPECIFICATION)",
      "====================================================================",
      "Product Name       : PrimeFlow HDPE 100 Structural Blow & Injection Grade",
      "Grade Identifier   : HDPE 100 (Prototype Lot Reference: PF-12345)",
      "Polymer Family     : High-Density Polyethylene (PE Family)",
      "Operational Status : Phase 1 Venture Prototype / Target QC Specification",
      "Feedstock Origin   : Sorted Post-Industrial HDPE Container Trimmings & Flash",
      "",
      "1. TARGET TECHNICAL PARAMETERS (VALIDATED PER BATCH ON COA)",
      "--------------------------------------------------------------------",
      "Melt Flow Index (MFI)      : Configured per blow/injection tooling (ASTM D1238)",
      "Density                    : 0.94 - 0.96 g/cm3 (Target specification)",
      "Moisture Content           : < 0.05% (Halogen Moisture Analyzer)",
      "Ash Content                : < 0.15% (ASTM D5630)",
      "Melt Filtration Screen     : 100 - 120 mesh (< 100 micron)",
      "PVC Contamination Limit    : < 0.1% (Strict NIR batch rejection threshold)",
      "",
      "2. PACKAGING & COMPLIANCE",
      "--------------------------------------------------------------------",
      "Standard Packaging : 25 kg Woven PP Bag with PE Inner Liner (or 500-1,000 kg Jumbo Bag)",
      "Compliance Notice  : Non-food-grade industrial and household applications only.",
    ].join("\n"),
  },
  "primeflow-ldpe-film-200-tds": {
    title: "PrimeFlow LDPE 200 Preliminary Technical Data Sheet",
    filename: "PrimeFlow-LDPE-200-Preliminary-TDS.txt",
    content: [
      "PRIMEFLOW INDUSTRIAL MATERIALS",
      "PRELIMINARY TECHNICAL DATA SHEET (PROTOTYPE SPECIFICATION)",
      "====================================================================",
      "Product Name       : PrimeFlow LDPE 200 Flexible Film & Liner Grade",
      "Grade Identifier   : LDPE 200",
      "Polymer Family     : Low-Density Polyethylene (PE Family)",
      "Operational Status : Phase 1 Venture Prototype / Target QC Specification",
      "Feedstock Origin   : Clean Post-Industrial LDPE Film Edge Trim & Stretch Wrap",
      "",
      "1. TARGET TECHNICAL PARAMETERS (VALIDATED PER BATCH ON COA)",
      "--------------------------------------------------------------------",
      "Melt Flow Index (MFI)      : ~2.17 g/10 min reference on single-heat film stream",
      "Density                    : 0.915 - 0.930 g/cm3 (Target specification)",
      "Moisture Content           : < 0.05%",
      "Ash Content                : < 0.15%",
      "Melt Filtration Screen     : 100 - 120 mesh (< 100 micron) for low-gel film gauge",
      "",
      "2. COMPLIANCE NOTICE",
      "--------------------------------------------------------------------",
      "Restricted to non-food-grade protective liners, refuse sacks, and secondary wraps.",
    ].join("\n"),
  },
  "primeflow-pe-blend-150-tds": {
    title: "PrimeFlow PE 150 Preliminary Technical Data Sheet",
    filename: "PrimeFlow-PE-150-Preliminary-TDS.txt",
    content: [
      "PRIMEFLOW INDUSTRIAL MATERIALS",
      "PRELIMINARY TECHNICAL DATA SHEET (PROTOTYPE SPECIFICATION)",
      "====================================================================",
      "Product Name       : PrimeFlow PE 150 Industrial Utility Compound",
      "Grade Identifier   : PE 150",
      "Polymer Family     : Polyethylene (PE)",
      "Operational Status : Phase 1 Venture Prototype / Target QC Specification",
      "Moisture Content   : < 0.05%",
      "Ash Content        : < 0.15%",
      "Melt Filtration    : 100 - 120 mesh (< 100 micron)",
      "Compliance Notice  : Non-food-grade utility molding applications only.",
    ].join("\n"),
  },
  "primeflow-coa-template": {
    title: "PrimeFlow Batch Certificate of Analysis (COA) Schema",
    filename: "PrimeFlow-COA-Digital-Passport-Schema.txt",
    content: [
      "PRIMEFLOW INTERNAL QC LABORATORY",
      "CERTIFICATE OF ANALYSIS (COA) & QR DIGITAL PRODUCT PASSPORT SCHEMA",
      "====================================================================",
      "Every shipped 25 kg bag or jumbo bag carries a batch QR code linking",
      "to the internal laboratory verification record covering 6 checkpoints:",
      "",
      "1. ASTM D1238 Melt Flow Index (MFI) Test (g/10 min)",
      "2. ASTM D5630 Ash Content / Inorganic Residue (< 0.15% target)",
      "3. Halogen Moisture Analyzer Verification (< 0.05% target)",
      "4. ISO 527 Tensile & ISO 179 Impact Verification",
      "5. Visual Black-Speck & Sensory Deodorization Inspection",
      "6. Internal Mold Shrinkage & Dimensional Tolerance Check",
      "",
      "Note: Batch COA values are issued upon physical sample kit dispatch or",
      "contract production lot release.",
    ].join("\n"),
  },
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ docSlug: string }> }
) {
  const { docSlug } = await context.params;
  const doc = DOCUMENTS[docSlug];
  if (!doc) {
    return NextResponse.json(
      { error: "Requested technical document specification was not found." },
      { status: 404 }
    );
  }

  return new NextResponse(doc.content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `inline; filename="${doc.filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
