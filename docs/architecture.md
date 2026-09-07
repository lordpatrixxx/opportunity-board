# Opportunity Board — Architecture

## System Architecture Overview

```mermaid
graph TD
    U["👤 User (Browser)"] --> FE["Frontend (Next.js 14 App Router)"]
    FE --> API["API Routes (/api/*)"]
    API --> AUTH["Auth Middleware (NextAuth.js)"]
    AUTH --> SVC["Service Layer"]
    SVC --> DB["Database (Supabase PostgreSQL)"]
    SVC --> STORE["File Storage (Supabase Storage)"]
    
    ADMIN["👮 Admin"] --> FE
    
    subgraph "Frontend Layer"
        FE --> PAGES["Pages & Layouts"]
        FE --> COMP["React Components"]
        FE --> STATE["State (React Query + Context)"]
    end
    
    subgraph "Backend Layer"
        API --> CRUD["CRUD Operations"]
        API --> SEARCH["Search & Filter Engine"]
        API --> BOOK["Bookmark Service"]
        API --> MOD["Moderation Service"]
        API --> NOTIF["Notification Service"]
    end
    
    subgraph "Data Layer"
        DB --> USERS["users"]
        DB --> OPPS["opportunities"]
        DB --> CATS["categories"]
        DB --> BOOKS["bookmarks"]
        DB --> NOTIFS["notifications"]
        DB --> REPORTS["reports"]
    end
```

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework with API routes, SSR, file-based routing |
| **Language** | TypeScript | Type safety, better DX, catch errors at compile time |
| **Styling** | Tailwind CSS 3 | Matches Stitch output (Stitch generates Tailwind), rapid development |
| **Database** | Supabase (PostgreSQL) | Free tier, real-time, built-in auth, instant API, hosted |
| **Auth** | Supabase Auth | Email/password + OAuth (Google, GitHub), JWT tokens, RLS |
| **State** | React Query + React Context | Server state caching, optimistic updates, minimal boilerplate |
| **Icons** | Material Symbols Outlined | Matches Stitch design exactly |
| **Font** | Plus Jakarta Sans (Google Fonts) | Stitch design system font |
| **Deployment** | Vercel | Zero-config Next.js deployment, free tier |

## Why This Stack?

1. **Next.js 14** — Stitch already generates Tailwind HTML; Next.js App Router gives us file-based routing, API routes (no separate backend), and server components for performance
2. **Supabase** — Eliminates backend complexity: hosted PostgreSQL + built-in auth + row-level security + real-time subscriptions + file storage, all with a generous free tier
3. **Tailwind CSS** — The Stitch project outputs Tailwind utility classes directly, so using Tailwind means near-1:1 translation of the design
4. **TypeScript** — Catches data shape issues between frontend/backend early, better maintainability

---

## Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS as Next.js Server
    participant Supabase as Supabase
    
    User->>Browser: Navigate to /opportunities
    Browser->>NextJS: GET /opportunities (SSR)
    NextJS->>Supabase: Query opportunities table
    Supabase-->>NextJS: Opportunity data (JSON)
    NextJS-->>Browser: Rendered HTML + hydration data
    Browser-->>User: Display opportunity feed
    
    User->>Browser: Click "Bookmark"
    Browser->>NextJS: POST /api/bookmarks
    NextJS->>Supabase: Check auth (JWT)
    Supabase-->>NextJS: User verified
    NextJS->>Supabase: INSERT bookmark
    Supabase-->>NextJS: Success
    NextJS-->>Browser: 201 Created
    Browser-->>User: Bookmark icon filled
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App as Next.js App
    participant Auth as Supabase Auth
    participant DB as Supabase DB
    
    User->>App: Fill sign-up form
    App->>Auth: signUp(email, password)
    Auth->>Auth: Hash password (bcrypt)
    Auth->>DB: Create user record
    Auth-->>App: Session + JWT token
    App->>App: Set cookie, redirect to /onboarding
    
    Note over User,DB: Subsequent requests
    User->>App: Access protected route
    App->>Auth: Verify JWT from cookie
    Auth-->>App: User identity + role
    App->>DB: Query with user context (RLS)
    DB-->>App: Filtered data (user-scoped)
```

## Opportunity Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant Form as Post Form
    participant API as /api/opportunities
    participant Auth as Auth Check
    participant DB as Database
    
    User->>Form: Fill opportunity details
    Form->>Form: Client-side validation
    Form->>API: POST /api/opportunities
    API->>Auth: Verify authenticated user
    Auth-->>API: user_id confirmed
    API->>API: Server-side validation & sanitize
    API->>DB: INSERT opportunity (status: pending)
    DB-->>API: Created opportunity
    API-->>Form: 201 + opportunity data
    Form-->>User: Success toast + redirect to My Posts
```

## Bookmark Flow

```mermaid
sequenceDiagram
    participant User
    participant Card as Opportunity Card
    participant API as /api/bookmarks
    participant DB as Database
    
    User->>Card: Click bookmark icon
    Card->>Card: Optimistic UI update (filled icon)
    Card->>API: POST /api/bookmarks {opportunity_id}
    API->>API: Check auth + check not already bookmarked
    API->>DB: INSERT INTO bookmarks
    DB-->>API: Success
    API-->>Card: 201 Created
    
    Note over User,DB: Unbookmark
    User->>Card: Click filled bookmark icon
    Card->>Card: Optimistic UI update (outline icon)
    Card->>API: DELETE /api/bookmarks/{opportunity_id}
    API->>DB: DELETE FROM bookmarks WHERE user+opp
    DB-->>API: Success
```

## Admin Moderation Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Panel as Admin Panel
    participant API as /api/admin
    participant DB as Database
    participant Notif as Notifications
    
    Admin->>Panel: View pending opportunities
    Panel->>API: GET /api/admin/opportunities?status=pending
    API->>API: Verify admin role
    API->>DB: SELECT WHERE status = 'pending'
    DB-->>API: Pending opportunities
    API-->>Panel: List of pending items
    
    Admin->>Panel: Click "Approve"
    Panel->>API: PATCH /api/admin/opportunities/{id} {status: approved}
    API->>DB: UPDATE status = 'approved'
    API->>Notif: Create notification for poster
    API-->>Panel: Success
```

## Folder Structure

```
opportunity-board/
├── docs/                          # Project documentation
├── public/                        # Static assets
│   ├── icons/
│   └── images/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth route group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (main)/                # Main app route group
│   │   │   ├── page.tsx           # Home / Discover
│   │   │   ├── opportunities/
│   │   │   │   └── [id]/
│   │   │   ├── saved/
│   │   │   ├── my-posts/
│   │   │   │   └── [id]/edit/
│   │   │   ├── post-opportunity/
│   │   │   ├── profile/
│   │   │   └── notifications/
│   │   ├── admin/                 # Admin route group
│   │   │   └── opportunities/
│   │   ├── onboarding/
│   │   ├── api/                   # API routes
│   │   │   ├── auth/
│   │   │   ├── opportunities/
│   │   │   ├── bookmarks/
│   │   │   ├── profile/
│   │   │   ├── notifications/
│   │   │   └── admin/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # Primitive UI (Button, Input, Badge)
│   │   ├── layout/                # Navbar, Footer, Sidebar
│   │   ├── opportunities/         # OpportunityCard, FilterPanel
│   │   └── forms/                 # FormField, OpportunityForm
│   ├── lib/                       # Utilities
│   │   ├── supabase/              # Supabase client config
│   │   ├── validations/           # Zod schemas
│   │   └── utils.ts               # Helper functions
│   ├── hooks/                     # Custom React hooks
│   ├── types/                     # TypeScript type definitions
│   └── constants/                 # App constants, seed data
├── supabase/
│   └── migrations/                # Database migrations
├── .env.local                     # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
