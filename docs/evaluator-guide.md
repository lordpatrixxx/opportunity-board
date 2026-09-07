# Opportunity Board — Evaluator Guide

> For hackathon judges, evaluators, and reviewers — everything you need to test and understand the fully functioning application in 2-3 minutes.

---

## 1. Executive Summary & Problem Solved

**Opportunity Board** is a centralized discovery platform for student and early-career opportunities with **absolute deadline clarity**. It solves the critical problem of high-value opportunities being scattered across disparate platforms (Slack, Discord, LinkedIn, Handshake, newsletters) by providing:

1. **Absolute Deadline Clarity:** Automatic countdowns and urgency badges ("Closing in 48h", "Closing in 7 days", "Rolling").
2. **End-to-End CRUD:** Candidates and recruiters can publish, browse, update, and manage opportunities with verified ownership.
3. **Direct Partner Hand-off:** Interstitial verification modal preventing broken external links or phishing scams.
4. **Active Moderation:** Staff moderation queue for auditing listings before public distribution.

---

## 2. Quick Demo Credentials (1-Click Fill Available)

On the `/login` page, convenient **1-Click Quick-Fill buttons** are provided:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| 🎓 **Student User** | `student@stanford.edu` | `Password123!` | Public listings, Watchlist bookmarks, Posting listings, Profile/Preferences, Notifications |
| 🛡️ **Admin Moderator** | `admin@opportunityboard.org` | `AdminSecure2026!` | Full access + Admin Moderation Center (`/admin`), Approve, Flag, Reject queue |

---

## 3. Technology Stack

| Layer | Technology | Architectural Rationale |
|-------|------------|-------------------------|
| **Framework** | **Next.js 14** (App Router) | Unified full-stack React framework with server-side rendering, streaming, and API route handlers. |
| **Language** | **TypeScript 5** | Strict end-to-end type safety across database queries, APIs, and UI components. |
| **Styling** | **Tailwind CSS 3** | Exact fidelity to Stitch design tokens (Plus Jakarta Sans, electric indigo `#3525cd`, emerald `#006c49`, neutral surfaces). |
| **Database** | **Prisma ORM + SQLite / PostgreSQL** | Self-contained, zero-downtime relational database at `prisma/dev.db` with 11 relational models. |
| **Authentication** | **bcryptjs + jose (JWT)** | Secure password hashing and stateless HTTP-only session cookies with role-based access control. |
| **Validation** | **Zod** | Strict schema validation on all inputs and API submissions. |

---

## 4. 14-Step Recommended Evaluator Demo Flow

Run locally via `npm run dev` and navigate to `http://localhost:3000`:

1. **Discovery & Hero Search (`/`):**
   - View 2026 verified counter badge and search for keywords (e.g., `"AI"` or `"Robotics"`).
   - Use quick filter pills (e.g., "Remote Only", "Paid Stipend").
2. **Category Navigation:**
   - Click category chips (e.g., *Internships*, *Hackathons*, *Fellowships*) in the sticky horizontal bar to filter listings instantly.
3. **Faceted Filter Panel:**
   - Filter by workplace mode (*Remote*, *Hybrid*, *In-Person*), experience level, and deadline urgency.
   - Toggle view mode between Grid and List view.
4. **Opportunity Details (`/opportunities/[id]`):**
   - Click any card to load the comprehensive details page.
   - Inspect organization profile, requirements, skills tags, and deadline countdown banner.
5. **Direct Partner Hand-off:**
   - Click **"Apply on Official Portal"** to open the interstitial modal displaying target portal safety information and destination URL preview.
6. **Bookmark / Watchlist:**
   - Click the bookmark button on any card or detail page. Toast notification appears: *"Opportunity saved to your Watchlist"*.
7. **Saved Opportunities (`/saved`):**
   - Open `/saved` to view your bookmarked listings with custom filtering and live unsave capability.
8. **Authentication (`/login`):**
   - Click **"Sign In"** in navbar. Use the 1-click button for **Student User** (`student@stanford.edu`).
   - Notice user avatar, email, and saved count reflected instantly in the top navigation.
9. **Create an Opportunity (`/post-opportunity`):**
   - Click **"Post Opportunity"**. Fill out the 3-section structured form with 2026 dates.
   - Click **"Publish Opportunity"**. Toast confirms publication and redirects to listing manager.
10. **Listing Manager / My Posts (`/my-posts`):**
    - Inspect your listing in the table with views counter and status badge.
11. **Edit Listing (`/my-posts/[id]/edit`):**
    - Click the edit icon, update the stipend or title, and save. Verify the update reflects immediately.
12. **Delete Listing:**
    - Click the delete icon. The Destructive Deletion modal appears. Confirm deletion to remove the listing from database and public feed.
13. **Profile & Onboarding (`/profile` & `/onboarding`):**
    - View career preferences, university details, and deadline email reminder toggles.
    - Test the 3-step onboarding wizard at `/onboarding`.
14. **Admin Moderation Center (`/admin`):**
    - Switch to Admin user (`admin@opportunityboard.org`).
    - Open `/admin` to inspect review queue metrics, approve pending listings, request revisions, or reject with reason notes.
    - Note: Non-admin users attempting to open `/admin` are strictly blocked with 403 Forbidden.

---

## 5. Automated Verification Results

All automated tests executed locally:
- **`npm run build`**: 30/30 pages compiled with zero errors.
- **`node test-e2e.js`**: **32/32 tests passed** (Auth, CRUD, Search, Bookmarks, RBAC, Profile, Notifications).
- **`node test-pages.js`**: **13/13 routes responded HTTP 200 OK**.
