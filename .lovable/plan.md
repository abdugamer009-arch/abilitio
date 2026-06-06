## Scope

Large feature set spanning navbar/dashboard reorg, a new Community system with auto-assignment + access control, real-time chat, admin role expansion, and analytics filtering. I'll ship it in one pass with sensible defaults to keep it cohesive.

## 1. Navbar + Dashboard restructure

- `src/components/Navbar.tsx`: remove ABBI AI, add Features + Community. Order: Home, Features, Roadmap, Community, Market, About.
- `src/routes/dashboard.tsx`: remove Roadmap tab; keep Assessment Results, My Stats, ABBI AI, Settings. Ensure ABBI AI tab is fully functional inside dashboard (reuse `AbbiChat`).

## 2. Database (one migration)

New tables:
- `communities` (id, slug, name, career_key, description, welcome_message, member_count cache, created_at) — seeded with ~12 careers.
- `community_members` (community_id, user_id, joined_at, PK composite).
- `community_messages` (id, community_id, user_id, content, is_pinned, created_at, deleted_at) + realtime publication.
- `community_daily_questions` (id, community_id, question, active_date) — one current question per community via view/order.

Role system (already exists: `user_roles`, `has_role`, `is_admin`). Add bootstrap for `umaraxmedov0175@gmail.com` in `handle_new_user` trigger (alongside existing admin email). Backfill role for any existing matching account.

RLS rules:
- `communities`: read = authenticated. No client writes.
- `community_members`: select own row or admin. Insert via SECURITY DEFINER only.
- `community_messages`: 
  - SELECT: `is_admin(auth.uid())` OR (`community_id` is one the user is a member of).
  - INSERT: same membership check + `content` not empty.
  - UPDATE (pin/unpin): admin only.
  - DELETE: admin only OR own message.
- `community_daily_questions`: read = members or admins; write = admins (via RPC).

SECURITY DEFINER functions:
- `assign_user_to_community(_career text)` — finds community by `career_key`, inserts membership for `auth.uid()`, bumps member_count.
- `is_community_member(_user uuid, _community uuid)` — used in policies (avoid recursion).
- `admin_pin_message(_msg uuid, _pin bool)`, `admin_delete_message(_msg uuid)`.

Realtime: `ALTER PUBLICATION supabase_realtime ADD TABLE community_messages;`

GRANTs on every new public table per project rules.

## 3. Auto-assignment

In `src/lib/assessment.ts` (or the server fn that saves results), after writing `assessment_results`, call `assign_user_to_community` with the top career's slug. Also add a one-shot "fix existing users" server fn that runs on dashboard mount if `assessment_results` exists but no membership.

## 4. Community UI (`src/routes/community.tsx` + `src/routes/community.$slug.tsx`)

- `/community` (under `_authenticated`): shows the user's assigned community card (single tile) — or admin sees a grid of ALL communities.
- `/community/$slug`: full chat page.
  - Header: community name, member count, online count (presence channel), pinned messages strip.
  - Welcome banner.
  - ABBI Daily Question card at top (purple glass).
  - Message list with avatar (from profiles avatar_url), name, ADMIN badge if applicable, timestamp, glass bubble.
  - Composer (text only). Realtime subscription to inserts/deletes/updates.
  - Admin controls: pin/unpin, delete (hover icons).
  - Access guard: if non-admin tries a slug not theirs → redirect to their own community with toast.

## 5. Admin extensions

- Existing `/admin` already has user mgmt + analytics. Update `getAdminAnalytics` to exclude admins from totals (filter via `user_roles` admin list).
- Add Community moderation tab: list communities, member counts, message counts, recent messages with delete/pin buttons.
- Add Daily Question editor per community.

## 6. Admin badge

`src/components/AdminBadge.tsx` — purple gradient pill with subtle glow. Server fn `getCommunityRoles(userIds[])` returns which IDs are admin, used in chat to render badge.

## 7. Files to create

- `src/routes/community.tsx`, `src/routes/community.$slug.tsx` (both under `_authenticated`).
- `src/components/community/CommunityChat.tsx`, `MessageBubble.tsx`, `DailyQuestionCard.tsx`, `AdminBadge.tsx`.
- `src/lib/community.functions.ts` — server fns: `getMyCommunity`, `getCommunityBySlug`, `listMessages`, `sendMessage`, `deleteMessage`, `togglePin`, `getDailyQuestion`, `setDailyQuestion` (admin), `listAllCommunities` (admin), `getMemberRoles`.
- `src/lib/assessment.functions.ts` patch — call assign RPC after results save.
- Migration SQL file (single).

## 8. Security findings (auto-fix)

Address all 3 listed Aura findings in the same migration:
- `aura_wallets`: drop `wallet_update_own` UPDATE policy.
- `aura_unlocks`: drop `unlock_insert_own` INSERT policy; require new SECURITY DEFINER `aura_unlock_feature(_key text, _cost int)` for unlocks. Update client unlock code path to use RPC.
- `aura_transactions`: ensure no INSERT policy exists for authenticated.

## 9. What I won't change

- Logo, language switcher, theme switcher positions.
- Existing routes/components beyond what's listed.
- Aura economy math.

## Open defaults (proceeding unless you object)

- Community list = 12 seed careers mapped from existing assessment career names. Unknown careers fall back to a generic "General Talent" community.
- One ABBI Daily Question per community, edited by admins; if none set, show a rotating built-in default.
- Online count = Supabase Realtime presence (no DB writes).
- Non-admin sees only their single community on `/community`.

Approve and I'll implement.