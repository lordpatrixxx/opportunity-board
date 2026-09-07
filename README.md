# Opportunity Board

A full-stack web platform designed to centralize and democratize opportunity discovery for students, early-career researchers, and builders. Discover, share, track, and moderate high-impact internships, hackathons, fellowships, research programs, scholarships, and grants.

---

## Problem Statement

Students and young professionals often miss out on high-impact internships, hackathons, research fellowships, workshops, and grant opportunities because information is fragmented across disparate platforms, Discord servers, private newsletters, LinkedIn posts, and informal channels. 

Key challenges include:
- **Scattered Information:** Opportunities are spread across dozens of portals without standardized schemas or verification.
- **Missed Deadlines:** Students lack centralized deadline tracking and personalized bookmarking.
- **Unverified Listings:** Spam and outdated postings waste student time and compromise trust.
- **No Community Contribution:** Students and campus organizers have few frictionless platforms to post verified listings directly to peers.

---

## Solution

**Opportunity Board** solves this problem by providing a unified, centralized web hub where students and builders can:
1. **Discover & Search:** Browse structured, verified listings with real-time multi-dimensional filtering (category, workplace mode, compensation, urgency, and deadline).
2. **Post & Manage:** Directly publish new opportunities with markdown summaries, application URLs, deadlines, and compensation tags with immediate ownership editing/deletion.
3. **Save & Track:** Bookmark opportunities to track deadlines with color-coded badges and notification alerts.
4. **Moderation & Trust:** Protect the ecosystem through role-based access control (RBAC), community reporting, and a dedicated admin moderation center.

---

## Key Features

- **Authentication & Security:** Secure JWT session authentication using HTTP-only cookies, password hashing with bcrypt, and role-based authorization (`USER`, `ADMIN`).
- **Opportunity Discovery:** High-density discovery feed with featured spotlight carousels, category badges, and quick stats.
- **Search & Multi-Dimensional Filtering:** Real-time query search across titles, organizations, and descriptions, combined with category, workplace mode (`remote`, `onsite`, `hybrid`), and sort ordering.
- **Opportunity Details:** Comprehensive single opportunity view featuring full markdown job descriptions, eligibility criteria, compensation badges, deadlines, organizational metadata, and external application redirection.
- **Create Opportunity:** Multi-step styled form for posting new listings with category assignment, tags, workplace preferences, compensation ranges, and direct application URLs.
- **Edit Opportunity:** Inline post editor allowing original authors or administrators to update listings.
- **Delete Opportunity:** Secure confirmation dialog allowing post owners or admins to permanently retire listings.
- **Saved Opportunities (Bookmarks):** One-click toggle to save opportunities to a personalized bookmark list with instant status counters.
- **Profile & Onboarding:** Comprehensive student profile setup with academic degree, graduation year, bio, skills, and work mode preferences.
- **Notifications Center:** Activity and deadline alert center categorized by system notices, upcoming application deadlines, and moderation status updates.
- **Admin Moderation Panel:** Dedicated administrative dashboard for reviewing reported or pending posts, with approve, reject, flag, and remove actions.

---

## Mandatory Requirement Mapping

| Requirement | Implementation Details | Status |
|:---|:---|:---:|
| **Create** | `POST /api/opportunities` and `/post-opportunity` interactive form. Creates opportunity record linked to user, tags, category, and organization. | ✅ **Complete** |
| **Read** | `GET /api/opportunities`, `GET /api/opportunities/:id`, `/opportunities`, and `/opportunities/[id]` dynamic route. Paginated, categorized, and full-detail views. | ✅ **Complete** |
| **Update** | `PUT /api/opportunities/:id` and `/my-posts/[id]/edit`. Verified ownership check ensuring only authors or administrators can modify listings. | ✅ **Complete** |
| **Delete** | `DELETE /api/opportunities/:id`. Verified ownership check with cascade cleanup across bookmarks, tags, reports, and moderation logs. | ✅ **Complete** |
| **Search & Filter** | Full-text query searching (`q`), category filters, workplace mode selector (`remote`, `onsite`, `hybrid`), type tags, and sorting (`newest`, `deadline`, `popular`). | ✅ **Complete** |
| **Authentication** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. HTTP-only JWT cookies (`auth-token`), bcrypt hashing, middleware protected routes. | ✅ **Complete** |

---

## Optional Features

- **Category Tagging:** 8 specialized categories with color-coded badge indicators (Internships, Hackathons, Fellowships, Workshops, Competitions, Scholarships, Early Jobs, Conferences).
- **Deadline Tracking:** Real-time deadline calculation displaying "Closing Soon" / urgent countdown badges.
- **Bookmarking:** One-click optimistic bookmarking with database persistence and dedicated `/saved` collection.
- **Direct Application Link:** Verified external application links with click tracking and external redirection safeguards.
- **Admin Moderation:** `/admin` portal displaying flagged and pending listings with approval/rejection audit logging.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components & Client Components)
- **Language:** TypeScript 5.6
- **Database ORM:** Prisma ORM 5.22
- **Database Engine:** SQLite (configured for local dev and Vercel serverless `/tmp` replication)
- **Authentication:** Custom JWT authentication using `jose` and `bcryptjs` with HTTP-only cookie transport
- **Validation:** Zod 3.23 schema validation
- **Styling:** Tailwind CSS 3.4 with custom Google Stitch color tokens, animations, and typography
- **Icons & Typography:** Google Material Symbols Outlined, Inter & Outfit font styling

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│   (Next.js 14 App Router, React 18, Tailwind CSS, Stitch)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON & Cookies
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                       │
│  - /api/auth/*          (Login, Register, Logout, Session)  │
│  - /api/opportunities/* (CRUD, Search, Filter)              │
│  - /api/bookmarks/*     (Save, Remove, List)                │
│  - /api/profile/*       (Student profile, Onboarding)       │
│  - /api/notifications/* (Alerts, Read states)               │
│  - /api/admin/*         (Moderation actions & reports)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma Client 5.22
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Storage                          │
│   Prisma ORM with SQLite DB (Serverless /tmp sync layer)    │
│   10 Relations: Users, Profiles, Opportunities, Tags, etc.   │
└─────────────────────────────────────────────────────────────┘
```

---

## Local Development

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lordpatrixxx/opportunity-board.git
   cd opportunity-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Initialize database & seed data:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Refer to `.env.example` for all configurable variables:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="opportunity_board_super_secret_jwt_key_2026_hackathon"
NEXT_PUBLIC_APP_NAME="Opportunity Board"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Deployment

The application is architected for deployment on **Vercel** connected to this **GitHub** repository:
- **Continuous Deployment:** Every push to the `main` branch triggers an automated Vercel build and preview/production deployment.
- **Serverless SQLite Compatibility:** `src/lib/db.ts` dynamically mirrors the bundled database to `/tmp/dev.db` in serverless lambda environments, enabling read and write operations on Vercel without requiring external database provisioning.

---

## Screens / UI

The frontend design precisely follows the Google Stitch Opportunity Board UI specifications:
1. **Home / Discovery Feed:** Dynamic hero banner, category chips, featured opportunities, deadline alerts, and newsletter CTA.
2. **Opportunities Directory (`/opportunities`):** Search input, facet filters, results count, sorting, and responsive grid.
3. **Opportunity Details (`/opportunities/[id]`):** Organization info, compensation tag, deadline meter, full markdown content, eligibility bullet list, and direct apply link.
4. **Post Opportunity (`/post-opportunity`):** High-converting posting form with validation and instant preview.
5. **My Posts (`/my-posts`):** Author dashboard displaying published listings with direct Edit and Delete capabilities.
6. **Saved Listings (`/saved`):** Personal bookmark manager with quick unbookmarking and direct application navigation.
7. **Authentication Pages (`/login`, `/signup`, `/forgot-password`):** Polished glassmorphism auth modals with instant validation.
8. **Onboarding (`/onboarding`, `/onboarding/complete`):** Student university, skills, and work preference setup.
9. **Admin Moderation (`/admin`):** Moderation queue with approval, flagging, and dismissal workflows.

---

## Demo Credentials & Flow

### Evaluator Demo Accounts

| Role | Email | Password |
|:---|:---|:---|
| **Student (User)** | `student@stanford.edu` | `Password123!` |
| **Administrator** | `admin@opportunityboard.org` | `AdminSecure2026!` |

### Recommended Evaluation Flow
1. **Explore Discovery Feed:** Browse the homepage at `/` to see featured listings and category chips.
2. **Filter & Search:** Click on `/opportunities`, search for *"AI"* or filter by *"Remote"* or *"Hackathons"*.
3. **Sign In:** Click "Sign In" in the navigation bar and log in as `student@stanford.edu`.
4. **Bookmark an Opportunity:** Click the bookmark icon on any card; visit `/saved` to confirm it appears in your collection.
5. **Post an Opportunity:** Visit `/post-opportunity`, fill in an opportunity listing, and publish.
6. **Edit & Delete:** Go to `/my-posts`, view your published opportunity, click Edit to update details, or Delete to remove it.
7. **Admin Moderation:** Log out and log in as `admin@opportunityboard.org`; visit `/admin` to inspect the moderation queue.

---

## License
MIT License. Built for the 2026 Agentic Development Hackathon.
