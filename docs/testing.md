# Opportunity Board — Testing Strategy

## Testing Framework
- **Unit/Integration:** Vitest + React Testing Library
- **API Testing:** Vitest with supertest
- **E2E:** Playwright (if time permits)
- **Coverage Target:** 70%+ on critical paths

---

## Hackathon Requirement Checklist

### Mandatory Requirements ✅

| # | Requirement | Test Type | Test Description | Priority |
|---|-----------|-----------|-----------------|----------|
| 1 | **Create** opportunity | API + UI | POST /api/opportunities returns 201, form submits successfully | 🔴 Critical |
| 2 | **Read** opportunities | API + UI | GET /api/opportunities returns list, cards render correctly | 🔴 Critical |
| 3 | **Update** opportunity | API + UI | PUT /api/opportunities/:id updates fields, form pre-fills | 🔴 Critical |
| 4 | **Delete** opportunity | API + UI | DELETE /api/opportunities/:id removes, confirmation modal works | 🔴 Critical |
| 5 | **Search** and filter | API + UI | Query params filter results, UI updates reactively | 🔴 Critical |
| 6 | **Auth** login/signup | API + UI | Registration, login, session persistence, logout | 🔴 Critical |

### Optional Enhancement Testing

| # | Feature | Test Description | Priority |
|---|---------|-----------------|----------|
| 1 | Category tagging | Filter by category returns correct results | 🟡 Medium |
| 2 | Deadline tracking | Urgency badges render for < 48h, < 7 day deadlines | 🟡 Medium |
| 3 | Bookmark/save | Toggle adds/removes, saved list shows bookmarks | 🟡 Medium |
| 4 | Application link | External link renders correctly, opens in new tab | 🟢 Low |
| 5 | Admin moderation | Approve/reject updates status, notification sent | 🟡 Medium |

---

## Unit Tests

### Utility Functions
- `formatDate()` — correct date formatting
- `getDeadlineUrgency()` — returns correct urgency level
- `truncateText()` — handles edge cases
- `validateOpportunityData()` — Zod schema validation

### Component Tests
```
components/
├── OpportunityCard.test.tsx     — renders all fields, bookmark toggle, urgency badge
├── FilterPanel.test.tsx         — filter selection, active count, clear all
├── DeadlineIndicator.test.tsx   — correct badge for each urgency level
├── BookmarkButton.test.tsx      — toggle states, loading state
├── OpportunityForm.test.tsx     — validation, submission, edit mode pre-fill
├── SearchBar.test.tsx           — input handling, debounce, submit
├── Badge.test.tsx               — variant rendering
├── Modal.test.tsx               — open/close, backdrop click, escape key
└── EmptyState.test.tsx          — renders message and action
```

---

## Integration Tests

### API Route Tests
```
api/
├── opportunities.test.ts
│   ├── GET / — returns paginated list
│   ├── GET / with filters — respects query params
│   ├── POST / — creates with valid data
│   ├── POST / — rejects invalid data (400)
│   ├── POST / — rejects unauthenticated (401)
│   ├── GET /:id — returns single opportunity
│   ├── PUT /:id — updates own opportunity
│   ├── PUT /:id — rejects non-owner (403)
│   ├── DELETE /:id — deletes own opportunity
│   └── DELETE /:id — rejects non-owner (403)
├── bookmarks.test.ts
│   ├── POST / — adds bookmark
│   ├── POST / — prevents duplicate bookmark
│   ├── DELETE /:id — removes bookmark
│   └── GET / — lists user bookmarks
├── auth.test.ts
│   ├── POST /register — creates account
│   ├── POST /register — rejects duplicate email
│   ├── POST /login — returns session
│   └── POST /login — rejects wrong password
└── admin.test.ts
    ├── GET /opportunities — returns pending for admin
    ├── GET /opportunities — rejects non-admin (403)
    └── PATCH /opportunities/:id — updates status
```

---

## Search & Filter Tests
- Full-text search returns relevant results
- Category filter returns only matching type
- Location filter works with partial text
- Deadline "urgent" filter returns only < 48h deadlines
- Workplace mode filter works correctly
- Combined filters intersect correctly
- Empty search returns all approved opportunities
- Pagination returns correct page and count

---

## Form Validation Tests
- Title required, min 5 chars, max 200 chars
- Organization name required
- Description required, min 50 chars
- URL fields validate format
- Deadline must be future date
- Email format validation on auth forms
- Password minimum length enforcement

---

## Responsive Tests (Manual)
- [ ] Mobile (375px) — single column, hamburger menu, bottom nav
- [ ] Tablet (768px) — two-column grid, drawer filters
- [ ] Desktop (1280px) — full sidebar, three-column grid
- [ ] Hero search responsive collapse
- [ ] Category chips horizontal scroll on mobile

---

## Accessibility Tests
- [ ] All images have alt text
- [ ] Icon buttons have aria-labels
- [ ] Form inputs have associated labels
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation through forms
- [ ] Modal trap focus and escape to close
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Screen reader announcements for dynamic content (toasts)
