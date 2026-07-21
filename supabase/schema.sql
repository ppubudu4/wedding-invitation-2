-- ============================================================
-- Wedding Invitation — Supabase schema
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- ============================================================

-- RSVP responses
create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  attending   boolean not null,
  party_size  int not null default 1 check (party_size between 1 and 20),
  dietary     text,
  message     text
);

-- Newest first when reading in the dashboard
create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.rsvps enable row level security;

-- Anyone with the link (anon role) may submit an RSVP...
drop policy if exists "public can insert rsvp" on public.rsvps;
create policy "public can insert rsvp"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

-- ...but only authenticated admins (logged in via Supabase Auth) may read them.
drop policy if exists "authenticated can read rsvps" on public.rsvps;
create policy "authenticated can read rsvps"
  on public.rsvps
  for select
  to authenticated
  using (true);

-- Note: no update/delete policies -> those actions are denied for everyone
-- (except the service_role key, which bypasses RLS and is not used by this app).

-- ============================================================
-- Invitations (admin-created, one personalized link per guest)
-- ============================================================
create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  code        text not null unique,
  invite_type text not null check (invite_type in ('single', 'couple', 'family')),
  guest_name  text,            -- single: the guest's full name
  title       text,            -- family: 'Mr' | 'Mrs'
  first_name  text,            -- family: head-of-family first name
  last_name   text,            -- couple / family: surname
  max_party   int not null default 1 check (max_party between 1 and 30)
);

create index if not exists invitations_code_idx on public.invitations (code);

alter table public.invitations enable row level security;

-- Only signed-in admins can create / list / delete invitations.
drop policy if exists "authenticated manage invitations" on public.invitations;
create policy "authenticated manage invitations"
  on public.invitations
  for all
  to authenticated
  using (true)
  with check (true);

-- Guests read their own invitation by code through a security-definer function,
-- so the table itself is never publicly enumerable.
create or replace function public.get_invitation(p_code text)
returns public.invitations
language sql
security definer
set search_path = public
as $$
  select * from public.invitations where code = p_code limit 1;
$$;

grant execute on function public.get_invitation(text) to anon, authenticated;

-- Link a response to its invitation (nullable — generic RSVPs have none).
alter table public.rsvps
  add column if not exists invitation_id uuid
  references public.invitations(id) on delete set null;

-- ============================================================
-- Wishes wall (public guestbook)
-- ============================================================
create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  message     text not null,
  -- Moderation gate: wishes are hidden from the public wall until an admin
  -- approves them, so spam that slips past the form filters never goes live.
  approved    boolean not null default false
);

-- For existing databases created before moderation was added:
alter table public.wishes
  add column if not exists approved boolean not null default false;

create index if not exists wishes_created_at_idx on public.wishes (created_at desc);

alter table public.wishes enable row level security;

-- Anyone may leave a wish (it lands unapproved by default)...
drop policy if exists "public can insert wish" on public.wishes;
create policy "public can insert wish"
  on public.wishes
  for insert
  to anon, authenticated
  with check (char_length(name) between 1 and 120
              and char_length(message) between 1 and 1000);

-- ...but the public may only READ wishes that have been approved.
drop policy if exists "public can read wishes" on public.wishes;
drop policy if exists "public can read approved wishes" on public.wishes;
create policy "public can read approved wishes"
  on public.wishes
  for select
  to anon, authenticated
  using (approved = true);

-- Signed-in admins may read every wish (approved or pending) for moderation.
drop policy if exists "authenticated read all wishes" on public.wishes;
create policy "authenticated read all wishes"
  on public.wishes
  for select
  to authenticated
  using (true);

-- Signed-in admins may approve (update) and remove (delete) wishes.
drop policy if exists "authenticated update wishes" on public.wishes;
create policy "authenticated update wishes"
  on public.wishes
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated delete wishes" on public.wishes;
create policy "authenticated delete wishes"
  on public.wishes
  for delete
  to authenticated
  using (true);

-- ============================================================
-- Admin user
-- ------------------------------------------------------------
-- This app has NO public sign-up. Create the couple's admin account manually:
--   Supabase Dashboard -> Authentication -> Users -> "Add user"
--   -> enter an email + password, and tick "Auto Confirm User".
-- Then sign in at /admin/login with those credentials.
-- ============================================================
