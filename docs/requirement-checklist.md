# Opportunity Board — Requirement Checklist & Audit Matrix

This checklist provides a comprehensive audit of all **Mandatory Product Requirements** and **Optional Enhancements** as defined in the Hackathon Specification.

---

## 1. Mandatory Requirements

| # | Requirement | Implementation Details | Route | Backend / API | Database Entity | Authentication / Authorization | Tested | Status |
|---|-------------|------------------------|-------|---------------|-----------------|--------------------------------|--------|--------|
| **M1** | **CREATE**<br/>Post an opportunity | Multi-section submission form including title, organization name/url, category, workplace mode, location, deadline, compensation, description, skills required, external application link. Validated client-side and server-side. | `/post-opportunity` | `POST /api/opportunities` | `opportunities`, `opportunity_tags`, `tags` | Authenticated User required. Creator identity bound to listing. | Automated E2E test passed | 🟢 Complete |
| **M2** | **READ**<br/>Browse opportunities | Public catalog feed showing rich opportunity cards, deadline urgency badges, category filters, quick stats, and pagination. Full detail page showing all attributes, requirements, organization profile, and external application trigger. | `/`<br/>`/opportunities`<br/>`/opportunities/[id]` | `GET /api/opportunities`<br/>`GET /api/opportunities/:id` | `opportunities`, `categories`, `bookmarks` | Public access for approved listings. Owner/Admin access for drafts or pending. | Automated E2E test passed | 🟢 Complete |
| **M3** | **UPDATE**<br/>Edit your own opportunity | Pre-filled form allowing creators to update opportunity metadata, deadlines, compensation, requirements, and links. Enforces ownership authorization checks server-side. | `/my-posts/[id]/edit` | `PUT /api/opportunities/:id` | `opportunities`, `tags` | Authenticated Creator or Admin. Rejects non-owners with 403 Forbidden. | Automated E2E test passed | 🟢 Complete |
| **M4** | **DELETE**<br/>Remove your own opportunity | Secure deletion flow from My Posts listing manager with confirmation modal. Removes opportunity and associated bookmarks/tags. | `/my-posts` | `DELETE /api/opportunities/:id` | `opportunities`, `bookmarks`, `opportunity_tags` | Authenticated Creator or Admin. Server-side ownership verification. | Automated E2E test passed | 🟢 Complete |
| **M5** | **SEARCH**<br/>Search and filter opportunities | Multi-attribute search engine querying title, organization, description keywords, category slugs, workplace mode (remote/hybrid/onsite), deadline urgency (<48h, this week, month), and compensation types. Debounced input with live results. | `/`<br/>`/opportunities` | `GET /api/opportunities?q=...&category=...` | `opportunities` (indexed search fields) | Public access. | Automated E2E test passed | 🟢 Complete |
| **M6** | **AUTH**<br/>User authentication | Complete authentication suite: Sign Up with password validation, Sign In with credential verification, Sign Out, Password Recovery/Reset flow, session persistence via HTTP-only JWT cookies, user roles (USER, ADMIN, MODERATOR), and protected route enforcement. | `/login`<br/>`/signup`<br/>`/forgot-password`<br/>`/reset-password` | `POST /api/auth/register`<br/>`POST /api/auth/login`<br/>`POST /api/auth/logout`<br/>`POST /api/auth/forgot-password` | `users`, `profiles` | Password hashing with bcrypt. Secure JWT session tokens. Server-side middleware route guards. | Automated E2E test passed | 🟢 Complete |

---

## 2. Optional & Enhancement Features

| # | Enhancement | Implementation Details | Route | Backend / API | Database Entity | Authentication / Authorization | Status |
|---|-------------|------------------------|-------|---------------|-----------------|--------------------------------|--------|
| **E1** | **Category Tagging** | 8 primary opportunity categories (Internships, Hackathons, Workshops, Competitions, Scholarships, Early Jobs, Conferences, Fellowships) with icon chips, count badges, and multi-skill tagging. | `/`<br/>`/post-opportunity` | `GET /api/categories` | `categories`, `tags`, `opportunity_tags` | Public read; Poster tags. | 🟢 Complete |
| **E2** | **Application Deadline Tracking** | Visual urgency status indicators: "Closing in 48 Hours" (Coral pulsing badge), "Closing in 7 Days" (Amber badge), and "Rolling Admissions" pill. Filter listings by deadline urgency. | `/`<br/>`/saved`<br/>`/opportunities/[id]` | Computed in queries and utility helpers | `opportunities.applicationDeadline` | Public. | 🟢 Complete |
| **E3** | **Bookmark / Save Opportunity** | Toggle bookmark button on every card and detail page with micro-bounce animation. Dedicated "Saved Opportunities" page with category filtering and layout switching. Navbar counter badge. | `/saved`<br/>All cards | `GET /api/bookmarks`<br/>`POST /api/bookmarks`<br/>`DELETE /api/bookmarks/:id` | `bookmarks` | Authenticated User. Duplicate bookmarks prevented by unique constraint. | 🟢 Complete |
| **E4** | **Direct Application Link** | Verified external destination link on Opportunity Details with "Ready to apply?" interstitial modal previewing the target domain, duration, and safety checklist. | `/opportunities/[id]` | `opportunities.applicationUrl` | `opportunities` | Public view; Direct partner hand-off interstitial. | 🟢 Complete |
| **E5** | **Admin Moderation Center** | Dedicated administrative dashboard with review queue for pending/flagged submissions, automated quality audit metrics, approve & publish, request revisions, and reject with reason dialog. | `/admin` | `GET /api/admin/opportunities`<br/>`PATCH /api/admin/opportunities/:id` | `opportunities`, `moderation_records`, `reports` | Strict Admin/Moderator role enforcement. 403 for regular users. | 🟢 Complete |

---

## 3. Stitch Supporting Features

| # | Feature | Description | Route | Status |
|---|---------|-------------|-------|--------|
| **S1** | **First-Time Onboarding** | 3-step wizard capturing university, field of study, opportunity preferences, and workplace mode. | `/onboarding` | 🟢 Complete |
| **S2** | **Onboarding Complete** | Celebration milestone and instant personalized opportunity recommendation feed. | `/onboarding/complete` | 🟢 Complete |
| **S3** | **My Profile & Settings** | Personal info, educational background, skills, work mode preferences, notification toggles, and sign out. | `/profile` | 🟢 Complete |
| **S4** | **Notifications Center** | In-app notification feed categorized by Deadlines, Updates, and System announcements with unread indicators and mark-all-as-read. | `/notifications` | 🟢 Complete |
| **S5** | **Global System States** | 4 Canonical Empty States (No Search Results, No Saved, No Posts, Queue Empty), Skeleton Shimmers (Cards, Tables, Urgency Banners), 404 Not Found, Modals, 7 Toast notifications. | Global | 🟢 Complete |
| **S6** | **Responsive Mobile UI** | Fluid layouts across Desktop (1280px+), Tablet (768px-1024px), and Mobile (<768px) with mobile drawer navigation, horizontal filter chips, and touch-optimized action targets. | Global | 🟢 Complete |
