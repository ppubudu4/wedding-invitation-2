# Pubudu & Chaya — Wedding Invitation

An elegant wedding-invitation website with an RSVP form and a private admin dashboard.

- **Public page** (`/`) — animated invitation: hero, live countdown, poruwa timeline, venue + map, RSVP form, background music.
- **Admin panel** (`/admin`) — Supabase-Auth-protected dashboard to view every guest response, headcount stats, and export to CSV.

Built with **Next.js (App Router, TypeScript)** + **Supabase** (Postgres + Auth).

---

## 1. Prerequisites

- Node.js 18.18+ (or 20+)
- A free [Supabase](https://supabase.com) project

## 2. Install

```bash
npm install
```

## 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the `rsvps` table and its row-level-security policies (public can submit, only logged-in admins can read).
3. Create the admin account: **Authentication → Users → Add user** → enter an email + password and tick **Auto Confirm User**. (There is no public sign-up.)
4. Copy your API keys: **Project Settings → API** → `Project URL` and `anon public` key.

## 4. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=https://your-wedding-site.com
```

`NEXT_PUBLIC_SITE_URL` is your deployed public URL — set it in production so link previews (WhatsApp, etc.) resolve the preview image correctly. Locally it can stay `http://localhost:3000`.

## 5. Add background music & photos

- **Music:** drop your track at `public/music.mp3` (replace the placeholder). Only use audio you have the right to. Browsers block autoplay, so it starts when a guest taps the floating music button.
- **Gallery photos:** put images in `public/gallery/` (e.g. `1.jpg`) and set their `src` in the `gallery` array in [`src/lib/wedding.ts`](src/lib/wedding.ts). Any entry with an empty `src` shows an elegant placeholder frame.

## 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the invitation, and [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard (you'll be redirected to the login page).

---

## Updating wedding details

All copy lives in [`src/lib/wedding.ts`](src/lib/wedding.ts) — names, families, date, timeline, and venue. Edit that one file to change any detail across the whole site.

## How RSVPs flow

Guest submits the form → a Next.js Server Action validates it (zod) → inserted into the Supabase `rsvps` table → the couple sees it in `/admin`. Responses are private: RLS blocks anonymous reads, so only a signed-in admin can see them.

## Inviting guests (personalized links)

From the admin dashboard you can create a personalized invitation for each guest and share its unique link (`/i/<code>`). Pick one of three types — the greeting on the invitation adapts automatically:

| Type | You enter | Invitation shows |
| --- | --- | --- |
| **Single** | Guest name | the guest's name (e.g. *Nimal Perera*) |
| **Couple** | Surname | *Mr & Mrs Silva* |
| **Family** | Title + first name + surname | *Mr. Kamal Fernando & Family* |

- The link opens the full invitation with a personalized *"Dear …"* greeting and the RSVP pre-filled with the guest's name.
- **Single** invites don't ask for a headcount; **couple** and **family** invites show a "number of guests attending" field (couple defaults to 2).
- Each invitation row in the dashboard shows its response status (Pending / Accepted / Declined), the headcount, a **Copy link** button, and Delete.

Invitations are stored in the `invitations` table (admin-only) and read on the public page through a `get_invitation(code)` security-definer function — so the guest list is never publicly enumerable.

### Link previews (WhatsApp sneak peek)

When an invite link is shared on WhatsApp (or any chat/social app), it shows a rich preview card — a generated image with the couple's names, date, and venue, plus a personalized *"You're invited — Dear …"* line for that guest. This is powered by Open Graph metadata and an auto-generated image (`app/opengraph-image.tsx` and `app/i/[code]/opengraph-image.tsx`).

For the preview to appear, the site must be **publicly deployed** with `NEXT_PUBLIC_SITE_URL` set to its real URL (chat apps can't reach `localhost`). WhatsApp caches previews per link, so if you tweak the design, test with a fresh code or clear the cache via [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Wishes wall

There's a single form on the site — the **RSVP form**. When a guest fills in the optional "wish for the couple" field, that message is published to the public `wishes` table (name + message only) and shown in the wishes carousel. Their private RSVP details (attending, party size, dietary) stay in the `rsvps` table, readable only by the signed-in admin.

Wishes are **meant to be shared**, so RLS on the `wishes` table allows anyone to read them. There's no moderation step; to add approval-before-display later, add an `approved boolean` column to `wishes` and filter on it in `WishesWall.tsx`.

## Deploy

Deploy to any Next.js host (e.g. Vercel). Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables in the host's project settings. No other server secrets are required.
