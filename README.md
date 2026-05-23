# Premium B2B Rice Distribution Platform

A premium digital showroom and B2B enquiry platform for Telangana wholesale rice distribution. Built with Next.js 14, Supabase, and WhatsApp-led conversion.

## Features

- **Premium marketing site** — cinematic hero, product showcase, 3D rice bag preview, district coverage map, gallery, testimonials
- **WhatsApp enquiry flow** — prefilled messages per product with analytics tracking
- **Enquiry forms** — validated submissions stored for admin follow-up
- **Admin panel** — products, brands, enquiries, districts, content CMS, media, analytics
- **No payments** — B2B enquiry only, no checkout

## Tech Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Framer Motion
- React Three Fiber + Three.js (lazy-loaded 3D)
- Supabase (Postgres, Auth, Storage, RLS)
- Vercel deployment

## Quick Start (Demo Mode)

Works without Supabase using in-memory mock data.

```bash
cd rice-distribution
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin login (demo):**
- URL: `/admin/login`
- Email: `admin@example.com`
- Password: `admin123`

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service role |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | E.164 number (e.g. 919876543210) |
| `NEXT_PUBLIC_BUSINESS_NAME` | Business display name |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Contact phone |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Contact email |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Google Maps embed URL |

## Supabase Setup (Rice Platform)

**Project:** `https://bdyjuvaqvljzviqpdgpv.supabase.co`

Schema, seed data, and storage buckets are already applied via migrations.

### Environment (`.env.local`)

| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | **You must add** from Dashboard → Settings → API |

### Create admin user

1. Supabase Dashboard → **Authentication** → **Users** → **Add user** (email + password)
2. SQL Editor → run (replace `YOUR_USER_UUID` with the new user's UUID):

```sql
INSERT INTO profiles (id, role, full_name)
VALUES ('YOUR_USER_UUID', 'admin', 'Admin');
```

3. Log in at `/admin/login` with that email/password (demo login disabled when Supabase is configured)

### Re-seed locally

Run `supabase/seed_full.sql` in SQL Editor if you need to reset demo content.

## Deploy to Vercel

1. Push repo to GitHub
2. Import in Vercel
3. Add all environment variables
4. Deploy

## Project Structure

```
app/
  (marketing)/     # Public site
  admin/           # Admin panel
  api/             # Enquiries, analytics
components/
  marketing/       # Hero, products, forms
  three/           # 3D showcase
  admin/           # Admin UI
lib/               # Data, WhatsApp, Supabase
supabase/          # Migrations & seed
```

## Future Roadmap

See `lib/features.ts` for planned Phase 2 features: retailer portal, payments, inventory, Telugu voice ordering.
