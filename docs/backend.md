# Opportunity Board — Backend Architecture

## Framework
**Next.js 14 API Routes** — co-located with the frontend for zero-latency server calls, no separate backend deployment needed.

## Architecture Pattern
**Layered Architecture** — Routes → Services → Database (via Supabase client)

```
API Route Handler (validation, auth check)
    └── Service Layer (business logic)
        └── Supabase Client (database operations)
```

---

## Server Architecture

### API Routes (`src/app/api/`)
Each route file handles HTTP methods via exported functions:

```typescript
// src/app/api/opportunities/route.ts
export async function GET(request: NextRequest) { ... }
export async function POST(request: NextRequest) { ... }

// src/app/api/opportunities/[id]/route.ts
export async function GET(request: NextRequest, { params }) { ... }
export async function PUT(request: NextRequest, { params }) { ... }
export async function DELETE(request: NextRequest, { params }) { ... }
```

### Route Structure
```
src/app/api/
├── auth/
│   ├── register/route.ts
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── forgot-password/route.ts
│   └── reset-password/route.ts
├── opportunities/
│   ├── route.ts              # GET (list + search), POST (create)
│   └── [id]/route.ts         # GET (detail), PUT (update), DELETE
├── bookmarks/
│   ├── route.ts              # GET (list), POST (add)
│   └── [opportunityId]/route.ts  # DELETE (remove)
├── profile/route.ts          # GET, PUT
├── notifications/
│   ├── route.ts              # GET (list)
│   ├── [id]/route.ts         # PATCH (mark read)
│   └── read-all/route.ts     # PATCH (mark all read)
├── admin/
│   ├── opportunities/
│   │   ├── route.ts          # GET (list pending)
│   │   └── [id]/route.ts     # PATCH (approve/reject)
│   └── reports/
│       ├── route.ts          # GET (list)
│       └── [id]/route.ts     # PATCH (review)
└── categories/route.ts       # GET (list)
```

---

## Middleware

### Authentication Middleware
```typescript
// src/middleware.ts (Next.js middleware)
// Runs on every request to protected routes
// - Checks for valid Supabase session cookie
// - Redirects unauthenticated users to /login
// - Redirects non-admin users from /admin/* routes

export const config = {
  matcher: ['/saved/:path*', '/my-posts/:path*', '/post-opportunity/:path*',
            '/profile/:path*', '/notifications/:path*', '/admin/:path*',
            '/api/bookmarks/:path*', '/api/profile/:path*',
            '/api/notifications/:path*', '/api/admin/:path*']
};
```

### API Auth Helper
```typescript
// lib/supabase/server.ts
export async function getAuthUser(request: NextRequest) {
  const supabase = createServerClient(cookies());
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AuthError('Unauthorized');
  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await getAuthUser(request);
  const { data: profile } = await supabase
    .from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new AuthError('Forbidden');
  return user;
}
```

---

## Service Layer

Each domain has a dedicated service module with business logic:

### `services/opportunities.ts`
| Function | Description |
|----------|-------------|
| `listOpportunities(filters)` | Query with full-text search, filters, pagination, sorting |
| `getOpportunityById(id)` | Fetch single + increment view_count |
| `createOpportunity(data, userId)` | Insert with status 'pending', sanitize HTML |
| `updateOpportunity(id, data, userId)` | Verify ownership, update fields |
| `deleteOpportunity(id, userId)` | Verify ownership, soft or hard delete |
| `getUserOpportunities(userId)` | All statuses for the owner's "My Posts" |

### `services/bookmarks.ts`
| Function | Description |
|----------|-------------|
| `getUserBookmarks(userId)` | List with joined opportunity data |
| `addBookmark(userId, opportunityId)` | Insert + increment bookmark_count |
| `removeBookmark(userId, opportunityId)` | Delete + decrement bookmark_count |
| `isBookmarked(userId, opportunityId)` | Check existence |

### `services/notifications.ts`
| Function | Description |
|----------|-------------|
| `getUserNotifications(userId)` | List sorted by date, unread first |
| `markAsRead(notificationId, userId)` | Set is_read = true |
| `markAllAsRead(userId)` | Bulk update |
| `createNotification(userId, type, data)` | Insert notification |

### `services/admin.ts`
| Function | Description |
|----------|-------------|
| `getPendingOpportunities()` | List where status = 'pending' or 'flagged' |
| `moderateOpportunity(id, status, notes, adminId)` | Update status + notify poster |
| `getReports()` | List pending reports with opportunity data |
| `reviewReport(id, status, notes, adminId)` | Update report status |

---

## Validation (Zod Schemas)

```typescript
// lib/validations/opportunity.ts
export const createOpportunitySchema = z.object({
  title: z.string().min(5).max(200),
  organization_name: z.string().min(1).max(200),
  organization_url: z.string().url().optional().or(z.literal('')),
  opportunity_type: z.enum(['Internship', 'Hackathon', 'Workshop', ...]),
  description: z.string().min(50).max(5000),
  short_summary: z.string().max(160).optional(),
  location: z.string().max(200).optional(),
  workplace_mode: z.enum(['remote', 'onsite', 'hybrid']),
  application_deadline: z.string().datetime().optional(),
  compensation_type: z.enum(['paid', 'unpaid', 'stipend', ...]).optional(),
  application_url: z.string().url().optional().or(z.literal('')),
  // ... more fields
});
```

---

## Error Handling

### Standardized Error Response
```typescript
export function apiError(message: string, status: number, details?: any) {
  return NextResponse.json(
    { data: null, error: { message, details }, message },
    { status }
  );
}

// Usage in route handler
try {
  const data = createOpportunitySchema.parse(body);
  const result = await createOpportunity(data, user.id);
  return NextResponse.json({ data: result, error: null, message: 'Created' }, { status: 201 });
} catch (error) {
  if (error instanceof z.ZodError) {
    return apiError('Validation failed', 400, error.errors);
  }
  return apiError('Internal server error', 500);
}
```

---

## Search & Filter Implementation

### Full-Text Search (PostgreSQL)
```sql
-- Using tsvector for fast full-text search
SELECT * FROM opportunities
WHERE to_tsvector('english', title || ' ' || organization_name || ' ' || coalesce(description, ''))
  @@ plainto_tsquery('english', :searchQuery)
  AND status = 'approved'
ORDER BY ts_rank(...) DESC;
```

### Supabase Client Query Builder
```typescript
let query = supabase.from('opportunities').select('*', { count: 'exact' })
  .eq('status', 'approved');

if (filters.q) query = query.textSearch('search_vector', filters.q);
if (filters.type) query = query.eq('opportunity_type', filters.type);
if (filters.workplace_mode) query = query.eq('workplace_mode', filters.workplace_mode);
if (filters.category) query = query.eq('categories.slug', filters.category);
if (filters.deadline === 'urgent') {
  query = query.lte('application_deadline', addDays(new Date(), 2).toISOString());
}

// Pagination
query = query.range((page - 1) * pageSize, page * pageSize - 1);

// Sorting
if (filters.sort === 'deadline_asc') query = query.order('application_deadline', { ascending: true });
```

---

## Security Controls

| Control | Implementation |
|---------|---------------|
| **Input validation** | Zod schemas on every POST/PUT endpoint |
| **Output sanitization** | DOMPurify for any user-generated HTML/markdown |
| **Rate limiting** | Vercel Edge middleware (100 req/min per IP) |
| **CORS** | Next.js built-in same-origin, API routes same domain |
| **SQL injection** | Supabase parameterized queries (no raw SQL) |
| **XSS** | React auto-escapes, CSP headers |
| **CSRF** | SameSite cookies, Supabase PKCE flow |
| **Auth** | Supabase JWT with RLS enforcement at database level |
