# Opportunity Board — API Contract

## Base URL
```
Development: http://localhost:3000/api
Production:  https://opportunity-board.vercel.app/api
```

## Authentication
All protected endpoints require a Supabase JWT token passed via cookie (`sb-access-token`) or `Authorization: Bearer <token>` header.

## Response Format
All responses use consistent JSON structure:
```json
{
  "data": {},       // Response payload
  "error": null,    // Error object if failed
  "message": ""     // Human-readable message
}
```

---

## AUTH Endpoints

### POST `/api/auth/register`
Create a new user account.

| Field | Details |
|-------|---------|
| **Method** | POST |
| **Auth** | None |
| **Request Body** | `{ email, password, full_name }` |
| **Response** | `201` — `{ user, session }` |
| **Validation** | Email format, password min 8 chars, name required |
| **Errors** | `400` Invalid input, `409` Email already exists |

### POST `/api/auth/login`
Sign in with email and password.

| Field | Details |
|-------|---------|
| **Method** | POST |
| **Auth** | None |
| **Request Body** | `{ email, password }` |
| **Response** | `200` — `{ user, session }` |
| **Validation** | Email & password required |
| **Errors** | `401` Invalid credentials |

### POST `/api/auth/logout`
Sign out and invalidate session.

| Field | Details |
|-------|---------|
| **Method** | POST |
| **Auth** | Required |
| **Response** | `200` — `{ message: "Logged out" }` |

### POST `/api/auth/forgot-password`
Send password reset email.

| Field | Details |
|-------|---------|
| **Method** | POST |
| **Auth** | None |
| **Request Body** | `{ email }` |
| **Response** | `200` — `{ message: "Reset email sent" }` |
| **Errors** | `404` Email not found |

### POST `/api/auth/reset-password`
Reset password with token.

| Field | Details |
|-------|---------|
| **Method** | POST |
| **Auth** | None (uses reset token) |
| **Request Body** | `{ token, new_password }` |
| **Response** | `200` — `{ message: "Password reset" }` |
| **Errors** | `400` Invalid/expired token |

---

## OPPORTUNITIES Endpoints

### GET `/api/opportunities`
List opportunities with search, filter, sort, and pagination.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | None (public) |
| **Query Params** | See filter table below |
| **Response** | `200` — `{ data: Opportunity[], count, page, pageSize }` |

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Full-text keyword search |
| `category` | string | — | Category slug filter |
| `type` | string | — | Opportunity type filter |
| `workplace_mode` | string | — | 'remote', 'onsite', 'hybrid' |
| `location` | string | — | Location keyword |
| `deadline` | string | — | 'urgent' (48h), 'this_week', 'this_month', 'rolling' |
| `compensation` | string | — | 'paid', 'unpaid', 'prize', 'scholarship' |
| `skills` | string | — | Comma-separated skill tags |
| `sort` | string | 'deadline_asc' | 'deadline_asc', 'newest', 'popular', 'bookmarks' |
| `page` | number | 1 | Page number |
| `pageSize` | number | 12 | Items per page |
| `status` | string | 'approved' | Only admins can filter by other statuses |

### GET `/api/opportunities/:id`
Get full details of a single opportunity.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | None (public for approved) |
| **Response** | `200` — `{ data: OpportunityDetail }` |
| **Side Effect** | Increments `view_count` |
| **Errors** | `404` Not found |

### POST `/api/opportunities`
Create a new opportunity.

| Field | Details |
|-------|---------|
| **Method** | POST |
| **Auth** | Required |
| **Request Body** | See opportunity creation schema below |
| **Response** | `201` — `{ data: Opportunity }` |
| **Validation** | Title, org_name, type, description required |
| **Errors** | `400` Validation error, `401` Unauthorized |

**Request Body Schema:**
```typescript
{
  title: string;              // Required, 5-200 chars
  organization_name: string;  // Required
  organization_url?: string;
  category_id?: string;       // UUID
  opportunity_type: string;   // Required
  description: string;        // Required, 50-5000 chars
  short_summary?: string;     // Max 160 chars
  location?: string;
  workplace_mode: string;     // 'remote' | 'onsite' | 'hybrid'
  eligible_regions?: string;
  application_deadline?: string; // ISO date
  start_date?: string;
  end_date?: string;
  duration?: string;
  compensation_type?: string;
  compensation_amount?: string;
  skills_required?: string[];
  eligibility?: string;
  application_url?: string;
  contact_email?: string;
}
```

### PUT `/api/opportunities/:id`
Update an existing opportunity.

| Field | Details |
|-------|---------|
| **Method** | PUT |
| **Auth** | Required (owner only) |
| **Request Body** | Same as create (partial updates allowed) |
| **Response** | `200` — `{ data: Opportunity }` |
| **Errors** | `400` Validation, `401` Unauthorized, `403` Not owner, `404` Not found |

### DELETE `/api/opportunities/:id`
Delete an opportunity.

| Field | Details |
|-------|---------|
| **Method** | DELETE |
| **Auth** | Required (owner or admin) |
| **Response** | `200` — `{ message: "Deleted" }` |
| **Errors** | `401` Unauthorized, `403` Not owner, `404` Not found |

---

## BOOKMARKS Endpoints

### GET `/api/bookmarks`
List user's saved opportunities.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | Required |
| **Query Params** | `page`, `pageSize` |
| **Response** | `200` — `{ data: BookmarkedOpportunity[], count }` |

### POST `/api/bookmarks`
Save an opportunity.

| Field | Details |
|-------|---------|
| **Method** | POST |
| **Auth** | Required |
| **Request Body** | `{ opportunity_id: string }` |
| **Response** | `201` — `{ data: Bookmark }` |
| **Errors** | `400` Already bookmarked, `404` Opportunity not found |

### DELETE `/api/bookmarks/:opportunity_id`
Remove a saved opportunity.

| Field | Details |
|-------|---------|
| **Method** | DELETE |
| **Auth** | Required |
| **Response** | `200` — `{ message: "Removed" }` |
| **Errors** | `404` Bookmark not found |

---

## PROFILE Endpoints

### GET `/api/profile`
Get current user's profile.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | Required |
| **Response** | `200` — `{ data: UserProfile }` |

### PUT `/api/profile`
Update current user's profile.

| Field | Details |
|-------|---------|
| **Method** | PUT |
| **Auth** | Required |
| **Request Body** | `{ full_name, university, field_of_study, graduation_year, bio, linkedin_url, github_url, interests }` |
| **Response** | `200` — `{ data: UserProfile }` |

---

## NOTIFICATIONS Endpoints

### GET `/api/notifications`
List user's notifications.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | Required |
| **Query Params** | `page`, `pageSize`, `unread_only` |
| **Response** | `200` — `{ data: Notification[], unread_count }` |

### PATCH `/api/notifications/:id`
Mark a notification as read.

| Field | Details |
|-------|---------|
| **Method** | PATCH |
| **Auth** | Required |
| **Response** | `200` — `{ data: Notification }` |

### PATCH `/api/notifications/read-all`
Mark all notifications as read.

| Field | Details |
|-------|---------|
| **Method** | PATCH |
| **Auth** | Required |
| **Response** | `200` — `{ message: "All marked read" }` |

---

## ADMIN Endpoints

### GET `/api/admin/opportunities`
List opportunities for moderation.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | Required (admin/moderator only) |
| **Query Params** | `status` ('pending', 'flagged', 'all'), `page`, `pageSize` |
| **Response** | `200` — `{ data: Opportunity[], count }` |
| **Errors** | `403` Not admin |

### PATCH `/api/admin/opportunities/:id`
Moderate an opportunity (approve, reject, flag).

| Field | Details |
|-------|---------|
| **Method** | PATCH |
| **Auth** | Required (admin/moderator only) |
| **Request Body** | `{ status: 'approved' | 'rejected' | 'flagged', review_notes?: string }` |
| **Response** | `200` — `{ data: Opportunity }` |
| **Side Effect** | Creates notification for opportunity poster |
| **Errors** | `403` Not admin, `404` Not found |

### GET `/api/admin/reports`
List user-submitted reports.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | Required (admin only) |
| **Response** | `200` — `{ data: Report[] }` |

### PATCH `/api/admin/reports/:id`
Review a report.

| Field | Details |
|-------|---------|
| **Method** | PATCH |
| **Auth** | Required (admin only) |
| **Request Body** | `{ status: 'reviewed' | 'dismissed' | 'actioned', review_notes }` |
| **Response** | `200` — `{ data: Report }` |

---

## CATEGORIES Endpoints

### GET `/api/categories`
List all categories.

| Field | Details |
|-------|---------|
| **Method** | GET |
| **Auth** | None (public) |
| **Response** | `200` — `{ data: Category[] }` |
| **Caching** | Cache for 1 hour (static data) |
