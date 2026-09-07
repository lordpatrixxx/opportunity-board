# Opportunity Board — Frontend Architecture

## Framework
**Next.js 14** with App Router, React 18, TypeScript, Tailwind CSS 3

## Folder Structure
```
src/
├── app/                              # Next.js App Router pages
│   ├── (auth)/                       # Auth route group (no navbar)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── layout.tsx                # Auth layout (centered, split-screen)
│   ├── (main)/                       # Main app route group (with navbar)
│   │   ├── page.tsx                  # Home / Discover dashboard
│   │   ├── opportunities/
│   │   │   └── [id]/page.tsx         # Opportunity details
│   │   ├── saved/page.tsx            # Saved/bookmarked opportunities
│   │   ├── my-posts/
│   │   │   ├── page.tsx              # My posted opportunities
│   │   │   └── [id]/edit/page.tsx    # Edit opportunity
│   │   ├── post-opportunity/page.tsx # Create new opportunity
│   │   ├── profile/page.tsx          # User profile
│   │   ├── notifications/page.tsx    # Notifications list
│   │   └── layout.tsx                # Main layout (Navbar + Footer)
│   ├── onboarding/
│   │   ├── page.tsx                  # Onboarding wizard (3 steps)
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── opportunities/
│   │   │   └── [id]/page.tsx         # Review opportunity
│   │   └── layout.tsx                # Admin layout
│   ├── api/                          # API routes
│   ├── layout.tsx                    # Root layout (providers, fonts)
│   ├── globals.css                   # Global styles + Tailwind
│   └── not-found.tsx                 # 404 page
├── components/
│   ├── ui/                           # Primitive design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Chip.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── opportunities/
│   │   ├── OpportunityCard.tsx
│   │   ├── OpportunityGrid.tsx
│   │   ├── OpportunityDetail.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── FilterChips.tsx
│   │   ├── SearchBar.tsx
│   │   ├── HeroSearch.tsx
│   │   ├── CategoryStrip.tsx
│   │   ├── DeadlineIndicator.tsx
│   │   ├── BookmarkButton.tsx
│   │   ├── SortDropdown.tsx
│   │   └── Pagination.tsx
│   ├── forms/
│   │   ├── OpportunityForm.tsx
│   │   ├── FormField.tsx
│   │   ├── TypeSelector.tsx
│   │   ├── WorkplaceModeSelector.tsx
│   │   └── SkillTagInput.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       ├── SocialAuthButtons.tsx
│       └── ForgotPasswordForm.tsx
├── hooks/
│   ├── useOpportunities.ts
│   ├── useBookmarks.ts
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server Supabase client
│   │   └── middleware.ts             # Auth middleware helper
│   ├── validations/
│   │   ├── opportunity.ts            # Zod schemas
│   │   ├── auth.ts
│   │   └── profile.ts
│   └── utils.ts                      # formatDate, truncate, etc.
├── types/
│   ├── opportunity.ts
│   ├── user.ts
│   ├── bookmark.ts
│   └── notification.ts
└── constants/
    ├── categories.ts
    ├── routes.ts
    └── seed-data.ts
```

---

## Route Map

| Route | Page Component | Auth | Description |
|-------|---------------|------|-------------|
| `/` | `(main)/page.tsx` | Public | Home / Discover dashboard with hero, search, filters, feed |
| `/opportunities/[id]` | `(main)/opportunities/[id]/page.tsx` | Public | Full opportunity details |
| `/saved` | `(main)/saved/page.tsx` | Protected | User's bookmarked opportunities |
| `/my-posts` | `(main)/my-posts/page.tsx` | Protected | User's posted opportunities |
| `/my-posts/[id]/edit` | `(main)/my-posts/[id]/edit/page.tsx` | Protected (owner) | Edit opportunity form |
| `/post-opportunity` | `(main)/post-opportunity/page.tsx` | Protected | Create new opportunity form |
| `/profile` | `(main)/profile/page.tsx` | Protected | User profile settings |
| `/notifications` | `(main)/notifications/page.tsx` | Protected | Notification inbox |
| `/login` | `(auth)/login/page.tsx` | Guest only | Sign in page |
| `/signup` | `(auth)/signup/page.tsx` | Guest only | Registration page |
| `/forgot-password` | `(auth)/forgot-password/page.tsx` | Guest only | Password recovery |
| `/reset-password` | `(auth)/reset-password/page.tsx` | Guest only | Password reset |
| `/onboarding` | `onboarding/page.tsx` | Protected | First-time user onboarding |
| `/admin` | `admin/page.tsx` | Admin only | Moderation dashboard |
| `/admin/opportunities/[id]` | `admin/opportunities/[id]/page.tsx` | Admin only | Review opportunity |

---

## State Management

### Server State (React Query / TanStack Query)
- **Opportunities list** — cached, paginated, filterable
- **Opportunity detail** — cached by ID
- **Bookmarks list** — per-user cache
- **Notifications** — polled or real-time
- **Categories** — cached globally (rarely changes)
- **User profile** — cached per session

### Client State (React Context)
- **Auth context** — current user, session, role
- **Filter context** — active search/filter state for the discover page
- **Toast context** — global toast notification queue

---

## Form Handling
- **Library:** React Hook Form + Zod validation
- **Pattern:** Controlled forms with optimistic submission
- **Validation:** Client-side (instant feedback) + server-side (security)

---

## API Integration Pattern
```typescript
// hooks/useOpportunities.ts
export function useOpportunities(filters: FilterParams) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => fetchOpportunities(filters),
    staleTime: 30_000,      // 30s cache
    keepPreviousData: true,  // Smooth pagination
  });
}
```

---

## Responsive Strategy
1. **Mobile-first** design approach
2. Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
3. **Breakpoints:** 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
4. Filter panel: sidebar on desktop → slide-over drawer on tablet/mobile
5. Cards: 2-col grid on desktop/tablet → single column on mobile
6. Category chips: horizontal scroll on mobile
7. Navbar: full nav on desktop → hamburger menu on mobile

---

## Loading States
- **Skeleton loaders** for opportunity cards (gray pulsing rectangles matching card layout)
- **Spinner** for form submissions
- **Progressive loading** — show cached data while fetching fresh

## Error States
- **Network error** — toast notification + retry button
- **404** — custom not-found page with illustration
- **403** — redirect to login with return URL
- **Form validation** — inline error messages below each field

## Empty States
- **No results** — illustration + "Try adjusting your filters" message
- **No saved opportunities** — illustration + "Browse opportunities" CTA
- **No posts** — illustration + "Post your first opportunity" CTA
