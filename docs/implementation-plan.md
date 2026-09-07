# Opportunity Board — Implementation Plan

## Goal
Build the **Opportunity Board** full-stack web application based on the authoritative **Stitch UI/UX Design project** (`projects/5803818303126980802`). The application delivers all 6 mandatory requirements (CREATE, READ, UPDATE, DELETE, SEARCH, AUTH) and 5 optional enhancements (Category Tagging, Application Deadline Tracking, Bookmarks / Saved, Direct Application Link, Admin Moderation Center) along with complete supporting Stitch screens (Profile, Onboarding, Notifications, Global UI States).

---

## Execution Phases & Milestones

### Milestone 1: Project Scaffolding & Design System
- Initialize Next.js 14 with TypeScript, Tailwind CSS, App Router.
- Configure Tailwind theme tokens directly matching the Stitch Design System:
  - Colors: `primary` (#3525CD), `primary-container` (#4F46E5), `secondary` (#006C49), `secondary-container` (#6CF8BB), `surface` (#FAF8FF), `surface-container-lowest` (#FFFFFF), `error` (#BA1A1A), `error-container` (#FFDAD6).
  - Typography: Plus Jakarta Sans with defined scales (`display-hero`, `headline-xl`, `headline-md`, `body-md`, `label-caps`, etc.).
  - Spacing & Radii: 8-point spatial grid (`space-xs`, `space-md`, `space-lg`, etc.), `rounded-xl`, `rounded-2xl`.
  - Elevation: L0 through L4 soft ambient shadows.
- Include Google Fonts link for Plus Jakarta Sans and Google Material Symbols Outlined.

### Milestone 2: Database Setup & Seed Data
- Initialize Prisma with SQLite (with PostgreSQL/Supabase compatibility).
- Define 10 relational models: `User`, `Profile`, `Organization`, `Category`, `Opportunity`, `Tag`, `OpportunityTag`, `Bookmark`, `Notification`, `Report`, `ModerationRecord`.
- Run Prisma migrations to generate the database schema and client.
- Create `prisma/seed.ts` containing realistic 2026 data:
  - 8 Opportunity Categories (Internships, Hackathons, Fellowships, Workshops, Competitions, Scholarships, Early Jobs, Conferences).
  - Top Host Organizations (OpenAI, Google DeepMind, IBM Research Labs, Figma, Stripe, MIT Media Lab).
  - 10+ Curated Opportunities with realistic 2026 deadlines, compensation, requirements, and tags.
  - Pre-seeded student and admin demo user accounts.

### Milestone 3: Authentication & Security Engine
- Implement bcrypt password hashing.
- Implement JWT session tokens via HTTP-only secure cookies (`auth-token`).
- Implement API auth helpers:
  - `getCurrentUser()` — reads and verifies session token.
  - `requireAuth()` — returns authenticated user or throws 401.
  - `requireAdmin()` — verifies ADMIN or MODERATOR role or throws 403.
- Build auth API routes:
  - `POST /api/auth/register` — validates email/password and creates user + profile.
  - `POST /api/auth/login` — verifies credentials and issues cookie.
  - `POST /api/auth/logout` — clears cookie.
  - `GET /api/auth/me` — returns current authenticated user profile.
- Build auth pages matching Stitch:
  - `/login` (Sign In with student quotes and split-screen layout).
  - `/signup` (Sign Up with institution/name/email/password).
  - `/forgot-password` & `/reset-password`.

### Milestone 4: Core Layout & Navigation
- Build `Navbar` matching Stitch:
  - Brand Logo + Title.
  - Links: Home, Opportunities, Saved (with active count pill), My Posts, Admin (with admin pill).
  - Quick search shortcut (`⌘K`).
  - Notification bell with unread indicator dot.
  - `+ Post Opportunity` CTA button.
  - User avatar dropdown with profile and sign out.
- Build `MobileNav` for touch devices.
- Build `Footer` with links and legal disclaimers.

### Milestone 5: Opportunity Discovery (READ & SEARCH)
- Build `/` and `/opportunities` matching Stitch:
  - Hero banner with headline, value prop, and large hero search bar.
  - Horizontal scrollable `CategoryStrip` with category icons and active states.
  - Sticky left `FilterPanel` (Workplace mode, Opportunity type checkboxes, Application deadline radio, Field of focus tags, Compensation filters).
  - Card stream feed with `Showing N Curated Listings`, Live Sync badge, and layout switcher (Grid / List).
  - Section 1: "Closing Soon & Urgent Deadlines" spotlight banner cards with red/amber badges.
  - Section 2: "Recommended For You" curated opportunity cards.
  - Rich `OpportunityCard` with org logo, title, tags, compensation, deadline, bookmark button, and view CTA.
- Build `GET /api/opportunities` endpoint with comprehensive search, filters, sorting, and pagination.

### Milestone 6: Opportunity Details (READ & APPLY)
- Build `/opportunities/[id]` matching Stitch:
  - Full company header with verified badge and social links.
  - Urgent countdown banner (hours/days remaining).
  - Key parameters grid (compensation, deadline, location, eligibility, candidate level).
  - Comprehensive markdown description and requirements.
  - Required skills tag row.
  - Sticky bottom action bar with `Bookmark` toggle and `Apply Now` CTA.
  - "Ready to apply?" interstitial modal previewing target application link.
  - Related opportunities stream.

### Milestone 7: Opportunity CRUD (CREATE, UPDATE, DELETE)
- **CREATE:**
  - Build `/post-opportunity` with the complete Stitch multi-section form: Basic Info, Organization Details, Location & Workplace Mode, Timeline & Deadlines, Compensation & Benefits, Skills & Eligibility, Application URL.
  - Server-side validation via `POST /api/opportunities`.
  - Toast confirmation: *"Opportunity published live"*.
- **LISTING MANAGER:**
  - Build `/my-posts` listing manager with data table, status badges ("Approved & Live", "Pending Review", "Flagged"), view counts, edit action, and delete action.
- **UPDATE:**
  - Build `/my-posts/[id]/edit` pre-filling existing opportunity data.
  - Server-side ownership verification in `PUT /api/opportunities/:id`.
  - Toast confirmation: *"Listing changes saved"*.
- **DELETE:**
  - Implement confirmation modal on `/my-posts`.
  - Server-side ownership verification in `DELETE /api/opportunities/:id`.
  - Toast confirmation: *"Opportunity permanently deleted"*.

### Milestone 8: Bookmarks / Saved Opportunities
- Implement `POST /api/bookmarks` and `DELETE /api/bookmarks/:opportunityId`.
- Connect optimistic UI updates to bookmark buttons on cards and details.
- Build `/saved` page with category tabs, layout switcher, and empty saved state.

### Milestone 9: Admin Moderation Center
- Build `/admin` matching Stitch:
  - Operational metrics bar (Total Listings, Pending Review, Flagged Submissions, Avg Moderation Time).
  - Status tabs (Pending Review, Flagged & Reported, Approved & Live, Rejected).
  - Expanded review panel with **Automated Quality Audit (6/6 Passed checklist)**.
  - Action buttons: "Approve & Publish", "Request Revisions", "Reject" (with reason dialog), "Flag Listing".
  - Strict server-side authorization (`requireAdmin`).

### Milestone 10: Profile, Onboarding & Notifications
- **Onboarding:**
  - Build `/onboarding` 3-step preference wizard.
  - Build `/onboarding/complete` celebration screen with instant matched recommendations.
- **Profile:**
  - Build `/profile` with personal information, university SSO status, skill tags, opportunity preferences, and account deletion confirmation modal.
- **Notifications:**
  - Build `/notifications` with Deadline reminders, High-match alerts, Post approvals, filter tabs, and mark-as-read API.

### Milestone 11: Global System States & Feedback
- Build reusable state components based on Stitch Global System States matrix:
  - 4 Empty States (No Search Results, No Saved Opportunities, No Posts Yet, Moderation Queue Empty).
  - Skeleton Shimmer Loaders (Card skeleton, Table row skeleton, Countdown banner skeleton).
  - Error 503 Network Outage card with retry.
  - 404 Not Found card with return navigation.
  - Toast notification system supporting all 6 canonical alerts.

### Milestone 12: Testing, Security & Evaluator Readiness
- Automated unit/integration tests for Auth, CRUD, Search, and Bookmarks.
- Verify zero console errors and clean build with `npm run build`.
- Execute full 14-step evaluator walkthrough.
