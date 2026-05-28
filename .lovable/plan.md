# Access Request & Approval Flow

## What you'll get
- User clicks **Contact Admin** → request is sent to all admins.
- Admins see a **notification bell** (with unread count) in the header.
- Clicking an access-request notification opens a modal listing all dashboards with checkboxes; admin picks which to grant and confirms.
- The requesting user gets a notification: "You've been granted access to X, Y, Z."
- Those dashboards now appear on the user's home page.

## Backend (Lovable Cloud)
New tables (with RLS + grants):
- `profiles` — id (= auth.users.id), first_name, last_name, email, country, location.
  Trigger: on `auth.users` insert → create profile + assign role from signup metadata.
- `app_role` enum (`admin`, `user`) + `user_roles(user_id, role)` + `has_role(uid, role)` security-definer function.
- `dashboards` — owner_id, name, slug, coordinates, country, location, created_at. (Seeded with mock dashboards on first admin signup is out of scope — admins create them via existing UI.)
- `dashboard_access` — (dashboard_id, user_id) pairs. Unique. Read by owner user or admin.
- `access_requests` — user_id, message, status (`pending`|`approved`|`denied`), created_at, resolved_at, resolved_by.
- `notifications` — user_id (recipient), type (`access_request`|`access_granted`), payload jsonb, read_at, created_at.

RLS summary:
- profiles: user reads/updates own; admins read all.
- user_roles: user reads own; admins read all. Inserted by trigger / admin only.
- dashboards: admins read all; users read only ones in `dashboard_access`.
- dashboard_access: user reads own rows; admins read/write all.
- access_requests: user reads/creates own; admins read all + update status.
- notifications: recipient reads/updates own; admins can insert for any user (or done via trigger).

Triggers:
- `handle_new_user` — creates profile + user_role row from `raw_user_meta_data`.
- `on_access_request_insert` — fan-out a notification to every admin.
- `on_dashboard_access_grant` — create `access_granted` notification for the user.

## Frontend
- **AuthContext** — rewritten to use `supabase.auth` (`onAuthStateChange` + `getSession`), pulls role from `user_roles`. Removes mock users.
- **Auth.tsx** — wires sign up (passes role + name + country/location in metadata) and sign in to Supabase. Email confirmation disabled for dev convenience.
- **GlobalHeader** — adds `NotificationBell` (Popover) with realtime subscription on `notifications`. Admin notifications of type `access_request` open the **GrantAccessDialog**; user notifications of type `access_granted` just mark read on click.
- **DashboardViews** — loads dashboards from DB (admin: all; user: joined via `dashboard_access`). "Contact Admin" button → inserts an `access_request` (toast on success; disabled while a pending one exists).
- **GrantAccessDialog** — lists all dashboards with checkboxes (pre-checked = already granted), Confirm inserts missing `dashboard_access` rows and marks request approved.
- Mock files (`mockDashboards.ts`, mock users in AuthContext) kept only for `DashboardDetail`/`CreateDashboard` which already use them — they'll continue to work with whatever rows exist; wiring those to the DB is out of scope for this change.

## Out of scope (call out)
- Migrating `DashboardDetail` and `CreateDashboard` to the real `dashboards` table. They'll keep using the existing UI; only the dashboard list + access flow becomes real. Say the word and I'll wire them next.

## Files touched
Migration (new tables/policies/triggers), `src/contexts/AuthContext.tsx`, `src/pages/Auth.tsx`, `src/components/GlobalHeader.tsx`, `src/components/DashboardViews.tsx`, new `src/components/NotificationBell.tsx`, new `src/components/GrantAccessDialog.tsx`, new `src/services/accessService.ts`.
