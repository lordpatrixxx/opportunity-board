# Opportunity Board — Stitch Screen Integration Matrix

This document maps each of the **18 Stitch screens and visual assets** in the "Opportunity Board UI/UX Design" project directly to its application route, page component, reusable design components, API endpoints, database entities, and authentication/authorization requirements.

---

## Screen-by-Screen Mapping

| # | Stitch Screen | Route | Page Component | Reusable Components | API Endpoints | Database Entities | Auth / Access Control |
|---|---------------|-------|----------------|---------------------|---------------|-------------------|----------------------|
| 1 | **Dashboard / Opportunity Discovery** (`6a216ded9ba54d1b9c1a983dc0a7e17a`) | `/` and `/opportunities` | `src/app/(main)/page.tsx` | `HeroSearch`, `CategoryStrip`, `FilterPanel`, `OpportunityCard`, `DeadlineIndicator`, `BookmarkButton`, `SortDropdown`, `Pagination` | `GET /api/opportunities`, `GET /api/categories`, `POST /api/bookmarks` | `opportunities`, `categories`, `bookmarks`, `users` | **Public** (Read)<br/>**User** (Bookmark toggle) |
| 2 | **Sign In** (`174ab32be6bc4349a386870f48af674a`) | `/login` | `src/app/(auth)/login/page.tsx` | `AuthLayout`, `Input`, `Button`, `SocialAuthButtons` | `POST /api/auth/login` | `users`, `profiles` | **Guest Only** (Redirects authenticated users to `/`) |
| 3 | **Sign Up** (`c3e6e36cfdee4b71822ec6649dee8222`) | `/signup` | `src/app/(auth)/signup/page.tsx` | `AuthLayout`, `Input`, `Button`, `SocialAuthButtons` | `POST /api/auth/register` | `users`, `profiles`, `notifications` | **Guest Only** (Redirects to `/onboarding` after register) |
| 4 | **Password Recovery & Reset** (`492cf6c01da74252b7b71ff25232b19e`) | `/forgot-password`<br/>`/reset-password` | `src/app/(auth)/forgot-password/page.tsx`<br/>`src/app/(auth)/reset-password/page.tsx` | `AuthLayout`, `Input`, `Button` | `POST /api/auth/forgot-password`<br/>`POST /api/auth/reset-password` | `users` | **Guest Only** (Password reset token verification) |
| 5 | **First-Time Onboarding (Steps 1-3)** (`891cbfef70874976ae6ed86f9f06f644`) | `/onboarding` | `src/app/onboarding/page.tsx` | `StepProgress`, `CategorySelector`, `WorkModeSelector`, `LocationInput`, `Button` | `PUT /api/profile/onboarding` | `users`, `profiles` | **Authenticated User** (Step wizard for education, interests, work mode) |
| 6 | **Onboarding Complete** (`9fe67a56ecfa47899c9077110c1cb576`) | `/onboarding/complete` | `src/app/onboarding/complete/page.tsx` | `SuccessHero`, `RecommendedCardMini`, `Button` | `GET /api/opportunities/recommended` | `opportunities`, `profiles` | **Authenticated User** (Celebration + direct route to dashboard) |
| 7 | **Opportunity Details** (`76f77bceb1bb4e75931a4a4566d731ec`) | `/opportunities/[id]` | `src/app/(main)/opportunities/[id]/page.tsx` | `OrgHeader`, `DeadlineCountdown`, `CompensationBadge`, `ApplyInterstitialModal`, `BookmarkButton`, `RelatedOpportunities` | `GET /api/opportunities/:id`, `POST /api/bookmarks` | `opportunities`, `categories`, `bookmarks`, `users` | **Public** (Read)<br/>**User** (Bookmark, external apply track) |
| 8 | **Post an Opportunity** (`de21dc4ecbf945e3955c579cc62f92d3`) | `/post-opportunity` | `src/app/(main)/post-opportunity/page.tsx` | `OpportunityForm`, `FormField`, `TypeSelector`, `WorkplaceModeSelector`, `SkillTagInput`, `DateInput` | `POST /api/opportunities` | `opportunities`, `categories`, `tags`, `opportunity_tags`, `notifications` | **Authenticated User** (Creates opportunity with pending/approved status) |
| 9 | **My Posts & Listing Manager** (`ac72ec98306c43829e645dad0d05fa80`) | `/my-posts` | `src/app/(main)/my-posts/page.tsx` | `ListingManagerTable`, `StatusBadge`, `ActionMenu`, `DeleteConfirmModal`, `EmptyState` | `GET /api/my-posts`, `DELETE /api/opportunities/:id` | `opportunities`, `users` | **Authenticated Owner** (Server-side ownership verification) |
| 10 | **Edit Opportunity** (`395f79af879b48cdb8ffbe41f11a5bcb`) | `/my-posts/[id]/edit` | `src/app/(main)/my-posts/[id]/edit/page.tsx` | `OpportunityForm` (pre-filled), `RevisionNotesBanner`, `Button` | `GET /api/opportunities/:id`, `PUT /api/opportunities/:id` | `opportunities`, `tags`, `moderation_records` | **Authenticated Owner / Admin** (Only creator or admin may edit) |
| 11 | **Saved Opportunities** (`5d38c389ecc449d6a0d3fffbb83b7b6a`) | `/saved` | `src/app/(main)/saved/page.tsx` | `SavedOpportunityCard`, `SavedCategoryFilter`, `LayoutSwitcher`, `BookmarkButton` | `GET /api/bookmarks`, `DELETE /api/bookmarks/:opportunityId` | `bookmarks`, `opportunities` | **Authenticated User** (Scoped to current user identity) |
| 12 | **Admin Moderation Center** (`7469f5aa34394ccea854ade3964c0c72`) | `/admin` | `src/app/admin/page.tsx` | `AdminMetricsBar`, `ModerationQueueCard`, `QualityAuditList`, `RejectDialogModal`, `StatusTabs` | `GET /api/admin/opportunities`, `PATCH /api/admin/opportunities/:id`, `GET /api/admin/reports` | `opportunities`, `reports`, `moderation_records`, `notifications` | **Admin / Moderator Role Required** (Strict server-side 403 guard) |
| 13 | **My Profile & Settings** (`08546d645da34b369d1e917e0848bfcd`) | `/profile` | `src/app/(main)/profile/page.tsx` | `ProfileHeroCard`, `ProfileSectionNav`, `PreferenceCheckboxes`, `DeleteAccountModal`, `ToastPreview` | `GET /api/profile`, `PUT /api/profile`, `DELETE /api/profile` | `users`, `profiles` | **Authenticated User** (View and update personal profile/preferences) |
| 14 | **Notifications Center** (`690c82214b1b44c88dc6378981500fd7`) | `/notifications` | `src/app/(main)/notifications/page.tsx` | `NotificationItem`, `NotificationFilterTabs`, `MarkAllAsReadButton`, `EmptyNotifications` | `GET /api/notifications`, `PATCH /api/notifications/:id`, `PATCH /api/notifications/read-all` | `notifications` | **Authenticated User** (Personal notification inbox) |
| 15 | **Global System States & Feedback Matrix** (`df0f466e6c154fb39cf7bb64a0ec09b3`) | Reusable system components | Global components in `src/components/ui/` and `src/components/feedback/` | `EmptyState` (4 types), `Skeleton` (cards, tables, banners), `NetworkError`, `NotFound404`, `ApplyModal`, `DeleteModal`, `ToastStack` (6 types) | Used across all routes | Global state handlers | All roles |
| 16 | **Opportunity Board User Flow** (`3ee03caeb2dc419abf4b1c4572e335a9`) | Documentation & Navigation | Integrated into routing architecture | Global Router & Middleware navigation guards | Flow across all endpoints | All entities | Standard application navigation |
| 17 | **Opportunity Board Logo** (`9691b1d7f8234068bd8f9ce411d46b8a`) | `/public/brand/logo.svg` | `src/components/layout/Navbar.tsx` | Brand identity emblem with electric indigo / cyan upward arrow card | N/A | N/A | Displayed across all headers and footers |
| 18 | **Portrait Avatar Headshot** (`9358edb3135b4de09fa9c4a206a3772f`) | `/public/avatars/user-avatar.png` | User profile, Navbar, Cards | Default demo student profile image | N/A | `users.avatar_url` | Rendered for default user session |

---

## Detailed Data & State Transitions

### 1. Opportunity Lifecycle
```
[User Submits Form] (/post-opportunity)
        ↓
Status: 'pending' (Auto-published in demo or queued for audit)
        ↓
[Admin Reviews] (/admin)
   ├── Approve → Status: 'approved' → Visible on public Discover feed (/)
   ├── Request Changes → Status: 'flagged' → Notified poster, editable in (/my-posts/[id]/edit)
   └── Reject → Status: 'rejected' → Notified poster with review notes
```

### 2. Bookmark Persistence
```
[User Clicks Bookmark on Card]
        ↓
Optimistic UI: Icon fills with micro-bounce
        ↓
API Call: POST /api/bookmarks
        ↓
Database: INSERT INTO bookmarks (user_id, opportunity_id)
        ↓
Navbar: Counter increments "Saved (N)"
        ↓
Visible on: /saved page
```

### 3. Application Handoff
```
[User Clicks "Apply" or "View Opportunity"]
        ↓
Detail Page: (/opportunities/[id])
        ↓
Clicks "Apply on [Org]"
        ↓
Interstitual Modal: "Ready to apply?" (Preview destination link + tips)
        ↓
New Tab Opens external application URL
```
