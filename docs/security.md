# Opportunity Board — Security

## Password Security
| Control | Implementation |
|---------|---------------|
| Hashing algorithm | bcrypt (Supabase Auth default) |
| Minimum password length | 8 characters |
| Password visibility toggle | Client-side on login/signup forms |
| Password reset tokens | Time-limited (1 hour), single-use, secure random |

## Authentication & Session Security
| Control | Implementation |
|---------|---------------|
| Token type | JWT signed by Supabase |
| Token storage | HTTP-only, Secure, SameSite=Lax cookies |
| Access token TTL | 1 hour |
| Refresh token TTL | 7 days |
| Auto-refresh | Supabase client handles transparently |
| PKCE flow | Enabled for OAuth providers |

## Authorization
| Control | Implementation |
|---------|---------------|
| Role-based access | user / moderator / admin roles in users table |
| Route protection | Next.js middleware checks session + role |
| API protection | Auth helper verifies JWT on every protected endpoint |
| Ownership checks | user_id comparison before update/delete operations |
| Row Level Security | Supabase RLS policies enforce at database level |

## Input Validation
| Control | Implementation |
|---------|---------------|
| Schema validation | Zod schemas on all API inputs |
| Client-side validation | React Hook Form + Zod for instant feedback |
| Type safety | TypeScript types derived from Zod schemas |
| Length limits | Max lengths on all text fields |
| URL validation | Zod `.url()` validator for external links |

## Output Sanitization
| Control | Implementation |
|---------|---------------|
| XSS prevention | React auto-escapes JSX output |
| Markdown rendering | Sanitized with DOMPurify before render |
| CSP headers | Content-Security-Policy configured in Next.js |
| User content | No raw `dangerouslySetInnerHTML` without sanitization |

## Rate Limiting
| Control | Implementation |
|---------|---------------|
| API rate limiting | Vercel Edge middleware: 100 requests/min per IP |
| Auth rate limiting | Supabase built-in: 30 attempts/hour per email |
| Search rate limiting | Debounced (300ms) on frontend |

## CORS
| Control | Implementation |
|---------|---------------|
| Policy | Same-origin only (API routes on same domain) |
| Allowed origins | Only the app's own domain |

## Environment Variable Security
| Control | Implementation |
|---------|---------------|
| Storage | `.env.local` (gitignored) |
| Public exposure | Only `NEXT_PUBLIC_*` variables exposed to browser |
| Secrets | Never committed; stored in Vercel env config |

## File Upload Security (if applicable)
| Control | Implementation |
|---------|---------------|
| Storage | Supabase Storage with private buckets |
| Allowed types | Images only (jpg, png, webp) |
| Max size | 2MB per file |
| Filename sanitization | UUID-based rename |

## Admin Access Protection
| Control | Implementation |
|---------|---------------|
| Route guard | Middleware checks admin/moderator role |
| API guard | `requireAdmin()` helper on all admin endpoints |
| RLS | Database policies prevent non-admin queries on admin data |

## API Abuse Protection
| Control | Implementation |
|---------|---------------|
| Pagination limits | Max 50 items per page |
| Query complexity | Limited filter combinations |
| Bulk operations | Not exposed publicly |
| Error information | Generic error messages in production (no stack traces) |

## Security Headers (Next.js Config)
```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
];
```
