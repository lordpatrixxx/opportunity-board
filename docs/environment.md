# Opportunity Board — Environment Variables

> **⚠️ NEVER commit real secrets. All values below are placeholders.**

---

## Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` | ✅ Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJI...` | ✅ Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGciOiJI...` | ✅ Required |

## Optional Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` | 🟡 Optional |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Opportunity Board` | 🟡 Optional |

## OAuth Provider Keys (Optional)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxxx.apps.googleusercontent.com` | 🟡 Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-xxxx` | 🟡 Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `Iv1.xxxx` | 🟡 Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `ghp_xxxx` | 🟡 Optional |

---

## Environment File Template

### `.env.local` (Development)
```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Opportunity Board

# OAuth Providers (OPTIONAL — configured in Supabase Dashboard)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=
```

### Production Environment (Vercel Dashboard)
```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=https://opportunity-board.vercel.app
NEXT_PUBLIC_APP_NAME=Opportunity Board
```

---

## Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser client bundle — ONLY use for non-secret public values
- `SUPABASE_SERVICE_ROLE_KEY` has FULL database access — NEVER expose to the client
- OAuth provider keys are configured in the Supabase Dashboard Auth settings, not directly in the app
- For local development, create a free Supabase project at https://supabase.com
- The `.env.local` file is included in `.gitignore` by default in Next.js projects
