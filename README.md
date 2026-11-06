# PrimeFlow Industrial Materials | B2B Website, Materials Library & Custom CMS

**Tagline:** Prime Quality, Consistent Flow.

PrimeFlow is a sustainable industrial materials platform and custom CMS engineered for **PrimeFlow Industrial Materials** (grounded in the NUSC 2026 Business Proposal by Muhammad Zidan Nugroho, Audina Maharani, and Karim Abdul Azis).

The platform presents PrimeFlow's post-industrial recycled **Polypropylene (PP)** and **Polyethylene (PE, including HDPE and LDPE)** resin pellet grades, a 9-stage purification and laboratory QC narrative, an interactive **HPP Material Savings Calculator**, **RFQ and 5-10 kg Sample Trial** workflows, and a role-protected **Internal Operating Console (CMS)**.

---

## 1. Architecture & Technology Stack

- **Framework:** Next.js 16 (App Router) with TypeScript and React 19
- **Styling & Design System:** Tailwind CSS v4 with custom industrial tokens:
  - Midnight Navy (`#101C2B`), Deep Console (`#0B1420`), Industrial Blue (`#123A68`), Flow Cyan (`#02BDEA`), Prime Yellow (`#FFD71C`), Off White (`#F3F5F6`)
  - Typography: `Space Grotesk` (headings), `Inter` (body), `IBM Plex Mono` (technical specifications and telemetry)
- **Database, Auth & Storage:** Supabase PostgreSQL + Supabase Auth + Row-Level Security (`supabase/migrations/20261105000000_primeflow_schema.sql` and `supabase/seed.sql`), paired with an automatic persistent local data store (`.data/primeflow-store.json`) so every CRUD action, RFQ submission, and Sample Request persists out-of-the-box during local development or offline review.
- **Testing:** Vitest unit test suite (`src/tests/business-logic.test.ts`) covering the Material Savings Calculator, RBAC permission boundaries, and Zod form/spam validations.
- **Deployment:** Railway (`railway.json`).

---

## 2. Public Routes & Information Architecture

- `/` : **Homepage** (Commanding Hero, Industrial Positioning, 8-Parameter Comparative Matrix, Polymer Collection, QC & Prototype 25 kg Sack Display, 9-Stage Process Grid, Target Non-Food Applications, B2B Supply Models, Interactive Material Savings Calculator, Circular Economy & SDG 9/12/13, Final Dispatch CTA)
- `/about` : **About PrimeFlow** (Brand Etymology, Vision & 4 Missions, TAM/SAM/SOM Market Sizing, Two-Phase Operational Transparency & 5-Year Roadmap, Founding Team)
- `/products` : **Technical Materials Library** (Search, Polymer Family filter where PE includes HDPE and LDPE, Conversion Process filter, Technical Property filter)
- `/products/[slug]` : **Material Specification Dossier** (Gallery including official 25 kg prototype sacks Lot PF-11223 and Lot PF-12345, CMS-driven ASTM/ISO spec schedule, downloadable Preliminary TDS & COA Schema, RFQ & Sample CTAs)
- `/technology` : **9-Stage Purification & QC Protocol** (Vertical engineering schematic from NIR sorting `<0.1%` PVC and `70-80 C` alkaline washing to triple-stage vacuum degassing, `100-120 mesh` filtration, and QR COA verification)
- `/solutions` : **B2B Supply Solutions** (Industrial Resin Supply, Flexible Procurement, Staggered Delivery, Adaptive Locked-Supply, Closed-Loop Toll-Recycling, Material Consultation, 5-10 kg Sample Trial Program)
- `/sustainability` : **Circular Economy & SDG Alignment** (Post-industrial waste recovery context, 3 sustainability dimensions, closed-loop lifecycle)
- `/insights` & `/insights/[slug]` : **CMS-Driven Technical Journal**
- `/contact` : **RFQ & 5-10 kg Sample Trial Desk** (Direct verified proposal contacts, WhatsApp integration, persistent RFQ & Sample Request forms)

---

## 3. Authentication, RBAC & Custom CMS (`/login` & `/admin`)

Public visitor registration is disabled. Internal staff access is enforced on the server and in Supabase RLS across three roles:

| Role | Authorized Email (Seeded) | Permissions |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | `zidannnugroho@apps.ipb.ac.id` | Full access: Overview, Products CRUD, RFQ & Sample workflows, Content & Articles, RBAC User Management & Role Assignment, Global Settings |
| `ADMIN_CMS` | `audinamaharani225@gmail.com` | Manage public content, Products CRUD, Articles CRUD, and view inquiries. Cannot assign roles or grant itself `SUPER_ADMIN` |
| `SALES` | `karimabdulazis154@gmail.com` | Manage RFQ pipeline (`New` -> `Reviewed` -> `Contacted` -> `Quoted` -> `Negotiation` -> `Won` / `Lost`), Sample Requests, and internal sales notes. Cannot modify user roles or edit CMS catalog specs |

---

## 4. Local Setup Instructions

```bash
cd C:\Users\yosep\Documents\AUDINA\primeflow
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000` for the public website, or `http://localhost:3000/login` for the internal operating console (default local operator access key: `PRIMEFLOW-2026`).

---

## 5. Database Migration & Supabase Setup Instructions

1. Create a new project in Supabase.
2. Open the Supabase SQL Editor and run:
   - `supabase/migrations/20261105000000_primeflow_schema.sql` (creates enums, tables, indexes, triggers, `current_app_role()` security definer helpers, and Row-Level Security policies).
   - `supabase/seed.sql` (seeds product categories and initial prototype grades).
3. In **Supabase Storage**, create a bucket named `product-media` (public read for published catalog imagery, authenticated write for `SUPER_ADMIN` and `ADMIN_CMS` with a 10 MB file size limit) and a private bucket named `technical-documents` for restricted COA/TDS files.
4. To bootstrap your first `SUPER_ADMIN` in Supabase Auth:
   - Invite `zidannnugroho@apps.ipb.ac.id` in **Supabase Auth -> Users**.
   - Insert the corresponding row in `public.profiles` and `public.user_roles` with `role = 'SUPER_ADMIN'`.

---

## 6. Testing & Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

---

## 7. Railway Deployment Instructions

1. Push the repository to GitHub or connect the directory via the Railway CLI (`railway login && railway init`).
2. Railway automatically detects `railway.json` (`npm run build` and `npm run start`).
3. Configure the environment variables from `.env.example` in the Railway service **Variables** tab (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PRIMEFLOW_SESSION_SECRET`).
4. Trigger a deployment and assign a public Railway domain.
