# Opportunity Board — Components

> Reusable UI component architecture derived from the Stitch design system.

---

## Layout Components

### Navbar (`components/layout/Navbar.tsx`)
- **Purpose:** Top-level navigation bar, fixed, with backdrop blur
- **Props:** `user?: User`, `bookmarkCount?: number`
- **Contains:** Logo, nav links (Home, Opportunities, Saved, My Posts, Admin), search shortcut, notifications bell, Post Opportunity CTA, user avatar dropdown
- **Used on:** All `(main)` layout pages
- **Responsive:** Full nav on desktop, hamburger menu on mobile

### MobileNav (`components/layout/MobileNav.tsx`)
- **Purpose:** Bottom tab bar or slide-out drawer for mobile navigation
- **Props:** `activeTab`, `user`
- **Used on:** All `(main)` pages on mobile

### Footer (`components/layout/Footer.tsx`)
- **Purpose:** Page footer with links, copyright, social
- **Used on:** All pages

### Sidebar (`components/layout/Sidebar.tsx`)
- **Purpose:** Sticky left sidebar on Discover page for filter controls
- **Props:** `filters`, `onFilterChange`, `activeFilterCount`
- **Responsive:** Full sidebar on desktop → drawer on mobile

---

## Opportunity Components

### OpportunityCard (`components/opportunities/OpportunityCard.tsx`)
- **Purpose:** Card displaying an opportunity summary in the feed
- **Props:**
  ```typescript
  {
    id: string;
    title: string;
    organization: { name: string; logoUrl?: string; verified: boolean };
    type: string;
    location: string;
    workplaceMode: string;
    deadline?: Date;
    compensation?: { type: string; amount: string };
    shortSummary: string;
    isBookmarked: boolean;
    isUrgent: boolean;
    onBookmarkToggle: () => void;
  }
  ```
- **Features:** Org avatar, bookmark button, deadline badge, urgency indicator, hover lift animation, compensation badge
- **Used on:** Discover page, Saved page, My Posts page

### OpportunityGrid (`components/opportunities/OpportunityGrid.tsx`)
- **Purpose:** Grid container for multiple OpportunityCards with layout switching
- **Props:** `opportunities[]`, `layout: 'grid' | 'list'`, `loading`
- **Used on:** Discover page, Saved page

### OpportunityDetail (`components/opportunities/OpportunityDetail.tsx`)
- **Purpose:** Full opportunity detail view with all fields
- **Props:** `opportunity: OpportunityFull`
- **Sections:** Header + org info, description, requirements, timeline, compensation, skills, apply CTA, related opportunities
- **Used on:** `/opportunities/[id]` page

### HeroSearch (`components/opportunities/HeroSearch.tsx`)
- **Purpose:** Large search bar in the hero section with location and experience dropdowns
- **Props:** `onSearch`, `initialQuery`
- **Contains:** Text input, location selector, experience selector, search button
- **Used on:** Home page hero section

### SearchBar (`components/opportunities/SearchBar.tsx`)
- **Purpose:** Compact search bar in the navbar
- **Props:** `onSearch`, `value`
- **Features:** `⌘K` keyboard shortcut, search icon
- **Used on:** Navbar

### FilterPanel (`components/opportunities/FilterPanel.tsx`)
- **Purpose:** Left sidebar filter controls
- **Sections:** Opportunity Type (checkboxes), Workplace Mode (segmented), Location (text search), Application Deadline (radio), Field of Focus (chips), Perks & Support (checkboxes)
- **Props:** `filters`, `onFilterChange`, `counts`
- **Used on:** Discover page sidebar

### CategoryStrip (`components/opportunities/CategoryStrip.tsx`)
- **Purpose:** Horizontal scrollable row of category chips below the hero
- **Props:** `categories[]`, `activeCategory`, `onSelect`
- **Features:** Active state with primary fill, count badges, horizontal scroll
- **Used on:** Discover page

### DeadlineIndicator (`components/opportunities/DeadlineIndicator.tsx`)
- **Purpose:** Badge showing deadline urgency
- **Props:** `deadline: Date`, `size: 'sm' | 'md'`
- **Variants:**
  - 48h or less → Red/coral badge with alarm icon: "48 Hours Left"
  - 7 days or less → Amber badge with clock icon: "Closing in X days"
  - Normal → Default badge with date
- **Used on:** OpportunityCard, OpportunityDetail

### BookmarkButton (`components/opportunities/BookmarkButton.tsx`)
- **Purpose:** Toggle bookmark icon button with optimistic update
- **Props:** `isBookmarked`, `onToggle`, `size`
- **States:** Outline (unsaved) → Filled primary (saved) with micro-bounce animation
- **Used on:** OpportunityCard, OpportunityDetail

### SortDropdown (`components/opportunities/SortDropdown.tsx`)
- **Purpose:** Sort control for the feed
- **Options:** Deadline (Soonest), Newest First, Most Popular, Most Bookmarked
- **Used on:** Discover page feed controls

### Pagination (`components/opportunities/Pagination.tsx`)
- **Purpose:** Page navigation for the opportunity feed
- **Props:** `currentPage`, `totalPages`, `onPageChange`
- **Used on:** Discover page, Saved page, My Posts page, Admin page

---

## Form Components

### OpportunityForm (`components/forms/OpportunityForm.tsx`)
- **Purpose:** Multi-section form for creating/editing opportunities
- **Props:** `defaultValues?` (for edit mode), `onSubmit`, `isSubmitting`
- **Sections:** A) Basic Information, B) Location & Format, C) Timeline & Deadlines, D) Description & Details, E) Compensation & Perks, F) Skills & Eligibility, G) Application Details
- **Used on:** `/post-opportunity`, `/my-posts/[id]/edit`

### FormField (`components/forms/FormField.tsx`)
- **Purpose:** Reusable form field wrapper with label, input, error message
- **Props:** `label`, `name`, `error`, `required`, `helpText`, `children`

### TypeSelector (`components/forms/TypeSelector.tsx`)
- **Purpose:** Pill-button group for selecting opportunity type
- **Props:** `value`, `onChange`, `options`

### WorkplaceModeSelector (`components/forms/WorkplaceModeSelector.tsx`)
- **Purpose:** Radio card selector for Remote/Hybrid/On-site
- **Props:** `value`, `onChange`

### SkillTagInput (`components/forms/SkillTagInput.tsx`)
- **Purpose:** Tag input for adding required skills as chips
- **Props:** `tags[]`, `onAdd`, `onRemove`, `suggestions`

---

## Primitive UI Components

### Button (`components/ui/Button.tsx`)
- **Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`
- **Sizes:** `sm`, `md`, `lg`
- **Props:** `variant`, `size`, `loading`, `disabled`, `icon`, `children`

### Badge (`components/ui/Badge.tsx`)
- **Variants:** `success`, `warning`, `danger`, `info`, `primary`, `neutral`
- **Props:** `variant`, `children`, `icon`, `pulse`

### Chip (`components/ui/Chip.tsx`)
- **Props:** `label`, `selected`, `onSelect`, `removable`, `onRemove`

### Modal (`components/ui/Modal.tsx`)
- **Props:** `isOpen`, `onClose`, `title`, `children`, `actions`
- **Features:** Backdrop blur, escape key close, focus trap

### Toast (`components/ui/Toast.tsx`)
- **Variants:** `success`, `error`, `warning`, `info`
- **Props:** `message`, `type`, `duration`
- **Position:** Bottom-right, auto-dismiss

### Skeleton (`components/ui/Skeleton.tsx`)
- **Purpose:** Loading placeholder matching component shapes
- **Variants:** `card`, `text`, `avatar`, `button`

### EmptyState (`components/ui/EmptyState.tsx`)
- **Props:** `icon`, `title`, `description`, `action?: { label, href }`

### LoadingSpinner (`components/ui/LoadingSpinner.tsx`)
- **Props:** `size: 'sm' | 'md' | 'lg'`
