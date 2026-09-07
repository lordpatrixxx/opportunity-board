# Opportunity Board — Authentication Architecture

## Strategy
**Supabase Auth** — handles registration, login, sessions, password reset, and OAuth providers. All auth state is managed via secure HTTP-only cookies with JWT tokens.

---

## User Roles

| Role | Capabilities |
|------|-------------|
| **Guest** (unauthenticated) | Browse opportunities, view details, search & filter |
| **User** (authenticated) | All Guest capabilities + Create/Edit/Delete own posts, Bookmark, Profile, Notifications |
| **Moderator** | All User capabilities + Review & moderate community submissions |
| **Admin** | All Moderator capabilities + Manage users, system settings, full moderation |

---

## Registration Flow
1. User fills sign-up form (full name, email, password)
2. Client-side validation (email format, password strength)
3. Call `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
4. Supabase creates `auth.users` record + sends confirmation email (optional)
5. Trigger creates corresponding `public.users` profile record
6. User redirected to `/onboarding` for profile setup
7. After onboarding, `onboarding_completed` flag set to `true`

## Login Flow
1. User fills sign-in form (email, password)
2. Call `supabase.auth.signInWithPassword({ email, password })`
3. Supabase validates credentials, returns session + JWT
4. Session stored in HTTP-only cookie via `@supabase/ssr`
5. User redirected to `/` (home) or previous protected page

## Social Auth (OAuth)
1. User clicks "Continue with Google" or "Continue with GitHub"
2. Call `supabase.auth.signInWithOAuth({ provider: 'google' })`
3. Redirect to provider's consent screen
4. After consent, redirect back with auth code
5. Supabase exchanges code for session
6. Profile record created/updated via database trigger

## Logout Flow
1. Call `supabase.auth.signOut()`
2. Session cookie cleared
3. Redirect to `/login`

## Password Reset Flow
1. User clicks "Forgot password?" → redirected to `/forgot-password`
2. Enter email → call `supabase.auth.resetPasswordForEmail(email)`
3. Supabase sends reset email with secure token link
4. User clicks link → redirected to `/reset-password?token=...`
5. Enter new password → call `supabase.auth.updateUser({ password })`

---

## Session Management

| Aspect | Implementation |
|--------|---------------|
| **Token type** | JWT (JSON Web Token) |
| **Storage** | HTTP-only, Secure, SameSite=Lax cookies |
| **Token lifetime** | 1 hour (access token), 7 days (refresh token) |
| **Auto-refresh** | Supabase client auto-refreshes before expiry |
| **Server-side** | `@supabase/ssr` package for server component auth |

---

## Protected Routes

### Frontend Protection (Middleware)
```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();
  
  const protectedPaths = ['/saved', '/my-posts', '/post-opportunity', '/profile', '/notifications'];
  const adminPaths = ['/admin'];
  const authPaths = ['/login', '/signup', '/forgot-password'];
  
  // Redirect unauthenticated users from protected routes
  if (protectedPaths.some(p => path.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url));
  }
  
  // Redirect authenticated users from auth routes
  if (authPaths.some(p => path.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Check admin role
  if (adminPaths.some(p => path.startsWith(p))) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}
```

### API Protection
Every protected API route starts with authentication check:
```typescript
const user = await getAuthUser(request); // throws 401 if no session
```

### Ownership Authorization
For update/delete operations:
```typescript
const opportunity = await getOpportunityById(id);
if (opportunity.user_id !== user.id && userRole !== 'admin') {
  return apiError('Forbidden', 403);
}
```

---

## Password Security

| Aspect | Implementation |
|--------|---------------|
| **Hashing** | bcrypt (handled by Supabase Auth) |
| **Min length** | 8 characters |
| **Strength indicator** | Client-side real-time feedback |
| **Breach check** | Optional HaveIBeenPwned API integration |
| **Reset tokens** | Time-limited (1 hour), single-use |

---

## Database Trigger for User Profile Sync

```sql
-- Automatically create public.users profile when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
