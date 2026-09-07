# Opportunity Board — Environment Configuration

> **⚠️ Security Notice:** Real secrets must NEVER be committed to Git. All values in this document and `.env.example` are templates.

---

## Required Environment Variables

| Variable | Description | Example / Target Value | Environments |
|:---|:---|:---|:---|
| `DATABASE_URL` | Prisma SQLite connection string | `file:./dev.db` | Production, Preview, Development |
| `JWT_SECRET` | 256-bit cryptographically secure secret for signing session tokens | `opportunity_board_super_secret_jwt_key_2026_hackathon` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | Public branding name across pages and meta tags | `Opportunity Board` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Public base URL for canonical tags and sharing | `https://opportunity-board-seven.vercel.app` | Production, Preview, Development |

---

## Vercel Project Environment Setup

Environment variables are configured in the Vercel project dashboard under **Project Settings → Environment Variables**:

- **Production Scope:** `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`
- **Preview Scope:** `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`
- **Development Scope:** `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`

---

## Local Development Template (`.env.example`)

```env
# Database connection URL
DATABASE_URL="file:./dev.db"

# Secret key used for signing JWT authentication tokens
JWT_SECRET="opportunity_board_super_secret_jwt_key_2026_hackathon"

# Application metadata and base URLs
NEXT_PUBLIC_APP_NAME="Opportunity Board"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
