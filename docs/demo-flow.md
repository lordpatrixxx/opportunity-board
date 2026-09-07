# Opportunity Board — Evaluator Demo Flow

This guide outlines the recommended **14-step evaluator walkthrough** to demonstrate the Opportunity Board application from start to finish in **3 to 5 minutes**, covering all 6 mandatory requirements, 5 optional enhancements, and supporting Stitch screens.

---

## Pre-requisites & Quick Start

```bash
# 1. Start application
npm run dev

# 2. Open browser
http://localhost:3000
```

### Pre-seeded Demo Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Student User** | `student@stanford.edu` | `Password123!` | Standard applicant & poster experience |
| **Platform Admin** | `admin@opportunityboard.org` | `AdminSecure2026!` | Admin Moderation Center & Audit log access |

---

## 14-Step Demo Sequence

### Step 1: Discover Feed & Hero Search (READ + SEARCH)
- **Route:** `http://localhost:3000/`
- **What to observe:**
  - Electric indigo brand theme, Plus Jakarta Sans typography, clean 8-point spatial grid matching Stitch design.
  - Hero section: "Discover your next opportunity with absolute deadline clarity."
  - Search bar with `⌘K` keyboard shortcut trigger.
  - Active urgency indicators: **"Closing in 48h"** (Coral pulsing pill) and **"Expiring this week"** (Amber pill).

### Step 2: Live Search & Filter Execution (SEARCH)
- Type `"AI"` or `"Research"` into the hero search input.
- Observe live debounced filtering without page reload.
- Click **"Remote"** in the Workplace Mode segmented button on the left sidebar.
- Click **"Internships"** in the category chip strip.
- Notice the active filters row (`Remote ✕`, `Internships ✕`) and the live count update (`Showing N Curated Listings`).

### Step 3: View Opportunity Details (READ + DIRECT LINK)
- Click on the **"Collegiate AI Residency & Research Fellow 2026"** card (OpenAI).
- **Route:** `/opportunities/[id]`
- **Observe:**
  - Full company banner with verified badge and compensation `$9,500/mo + Housing`.
  - Detailed timeline, eligibility guidelines, required skills, and host lab information.
  - Click the **"Apply on OpenAI"** CTA button.
  - Notice the **"Ready to apply?" interstitial modal** previewing the external URL (`jobs.lever.co/openai/...`), estimated intake time (~10 min), and verified partner trust badge.

### Step 4: Bookmark an Opportunity (BOOKMARK / SAVE)
- On the detail page or directly from the card stream, click the circular **Bookmark** toggle button.
- Notice the micro-bounce animation and color shift from slate outline to solid indigo fill.
- Look at the top navigation bar: the **"Saved (1)"** count badge increments immediately.
- A toast alert pops up in the bottom-right corner: *"Saved to your Watchlist"*.

### Step 5: Saved Opportunities View (BOOKMARK)
- Click **"Saved"** in the top navbar.
- **Route:** `/saved`
- **Observe:**
  - Your bookmarked opportunities neatly organized.
  - Filter chips: *All Saved (1)*, *Internships (1)*.
  - Layout switcher: toggle between **Grid View** and **List View**.
  - Unsave test: clicking the bookmark button removes it with confirmation toast.

### Step 6: User Authentication (AUTH - Sign In / Sign Up)
- Click the **"Sign In"** button in the header.
- **Route:** `/login`
- Notice the split-screen design from Stitch with student quotes and clean input fields.
- Enter credentials:
  - Email: `student@stanford.edu`
  - Password: `Password123!`
- Click **"Sign in to Opportunity Board"**.
- Successfully authenticated: header avatar appears, and role is active.

### Step 7: Post a New Opportunity (CREATE)
- Click the primary **"+ Post Opportunity"** button in the top navbar.
- **Route:** `/post-opportunity`
- Complete the multi-section form:
  - **Title:** `Frontier Robotics Research Fellowship 2026`
  - **Organization:** `Boston Dynamics AI Institute`
  - **Type:** `Fellowship`
  - **Workplace Mode:** `Hybrid` (Cambridge, MA)
  - **Application Deadline:** `2026-11-15`
  - **Compensation:** `$8,000/mo + Lab Relocation`
  - **Description:** *"Investigating humanoid manipulation benchmarks, zero-shot grasp generation, and multimodal visual feedback policies."*
  - **Skills:** `PyTorch`, `ROS2`, `Reinforcement Learning`
  - **Application URL:** `https://bdaie.org/fellowships/apply`
- Click **"Publish Opportunity"**.
- Toast pops up: *"Opportunity published live"*. You are redirected to **My Posts**.

### Step 8: Listing Manager & My Posts (READ + OWNERSHIP)
- **Route:** `/my-posts`
- **Observe:**
  - Your newly submitted opportunity appears in your personal listings table.
  - Status shows **"Approved & Live"** (or **"Pending Review"**).
  - View count, bookmark count, and creation date are tracked.

### Step 9: Edit Your Opportunity (UPDATE)
- In the My Posts row, click the **"Edit"** action button.
- **Route:** `/my-posts/[id]/edit`
- Form loads with all existing values pre-filled.
- Change the compensation from `$8,000/mo` to `$8,500/mo + Housing Bonus`.
- Click **"Save Changes"**.
- Toast: *"Listing changes saved successfully"*. Revisit details to confirm updated data.

### Step 10: Delete Your Opportunity (DELETE)
- Back on `/my-posts`, click the **"Delete"** action button on a post.
- Notice the **Delete Confirmation Modal** prompting: *"Are you sure you want to remove this opportunity? This cannot be undone."*
- Click **"Confirm Delete"**.
- Opportunity is removed from the database and vanishes from the list with toast feedback: *"Opportunity permanently deleted"*.

### Step 11: First-Time Onboarding Experience (ONBOARDING)
- Navigate to `/onboarding`.
- Experience the 3-step profile onboarding wizard:
  - Step 1: Educational background (Institution & Degree).
  - Step 2: Opportunity interests (Select *AI & Machine Learning*, *Software Engineering*).
  - Step 3: Preferred work mode (*Remote* & *Hybrid*).
- Click **"Complete Onboarding"**.
- Celebrate at `/onboarding/complete` with instant recommendations matched to selected interests.

### Step 12: Notifications Center (NOTIFICATIONS)
- Click the **bell icon** in the top navbar.
- **Route:** `/notifications`
- View in-app notifications:
  - Deadline alert: *"Application Closing in 48 Hours: Collegiate AI Residency"*
  - High match recommendation: *"New High-Match Opportunity (98% Match)"*
  - Status update: *"Your listing was approved by admin"*
- Click **"Mark as read"** on a notification or click **"Mark all as read"**.

### Step 13: My Profile & Preferences (PROFILE)
- Click your avatar in the navbar → select **"Profile & Settings"**.
- **Route:** `/profile`
- View student profile, university credentials, skills tags, and notification preferences.
- Toggle work preferences and click **"Save Preferences"**.

### Step 14: Admin Moderation Center (ADMIN MODERATION)
- Switch to Admin account (`admin@opportunityboard.org` / `AdminSecure2026!`) or click the **"Admin"** nav link.
- **Route:** `/admin`
- **Observe:**
  - Executive telemetry: Total Listings (2,418), Pending Review, Flagged Submissions, Avg Moderation Time.
  - Status tabs: *Pending Review*, *Flagged & Reported*, *Approved & Live*, *Rejected*.
  - Expanded review panel showing the **Automated Quality Audit (6/6 Passed)**:
    - Domain SPF/DKIM verification
    - Live HTTP 200 check
    - Transparent compensation confirmation
    - No pay-to-apply fee guarantee
  - Click **"Approve & Publish"** to immediately approve a pending opportunity.
  - Click **"Reject"** to test the modal reason dialog.

---

## Verification Summary

By completing these 14 steps, you have verified:
- [x] **Create** — Posted new opportunity with full validation
- [x] **Read** — Explored catalog, card streams, and detail pages
- [x] **Update** — Pre-filled edit form with saved mutations
- [x] **Delete** — Removed listing with confirmation dialog
- [x] **Search** — Multi-facet live query with category & workplace filters
- [x] **Auth** — Registration, login, session persistence, role guards
- [x] **Enhancements** — Category tags, 48h deadline alerts, bookmarks, direct apply modal, admin moderation panel
- [x] **Stitch Design Alignment** — High-fidelity replication of all Stitch screens
