# Portfolio Backend API

A full backend for a developer portfolio, built with **NestJS + TypeScript**, **PostgreSQL (Prisma)**, **Cloudinary** for media, and **email notifications** (nodemailer).

## What's included

| Resource | Public | Admin (JWT required) |
|---|---|---|
| **What I Do** | `GET /api/what-i-do`, `GET /api/what-i-do/:id` | full CRUD |
| **Projects** | `GET /api/projects` (published only), `GET /api/projects/:id` | full CRUD + `PATCH /api/projects/:id/publish` |
| **Skills & Tools** | `GET /api/skills-tools`, `GET /api/skills-tools/:id` | full CRUD |
| **Contact Messages** | `POST /api/contact` (visitors submit) | list, mark read, delete |
| **Subscribers** | `POST /api/subscribers` (subscribe), `DELETE /api/subscribers/unsubscribe/:email` | list, delete |
| **Upload** | — | `POST /api/upload?type=image\|video` (Cloudinary) |
| **Auth** | — | `POST /api/auth/login` |

Swagger docs (with a "Try it out" UI and bearer-token auth) are served at `/api/docs` once the server is running.

## How the pieces you asked about work

- **Projects are drafts by default.** Create one with `published` unset (or `false`) and nothing gets emailed. Either:
  - pass `published: true` when creating it, or
  - call `PATCH /api/projects/:id/publish` later
  
  Either path notifies every subscriber by email, once, on the draft → published transition. Publishing an already-published project is a no-op (no duplicate email).

- **Contact phone number** accepts plain local numbers, not just `+countrycode` format — e.g. `08012345678` or `(555) 123-4567` are both valid (7–20 chars, digits/spaces/dashes/parentheses, optional leading `+`).

- **Admin account** is created via a seed script from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your `.env` — no admin signup endpoint exists on purpose (single-admin setup, as agreed). Re-running the seed is safe — it upserts, so it won't duplicate or error if the admin already exists.

- **Media uploads**: your admin dashboard should call `POST /api/upload?type=image` (or `type=video`) with the file as multipart form-data, get back a Cloudinary URL, then use that URL in the `icon`/`thumbnail`/`mobileVideoUrl`/etc. fields when creating or updating a What I Do / Project / Skill entry.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Then fill in `.env`:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your login credentials (used once by the seed script)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard (free tier is fine)
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` / `ADMIN_NOTIFY_EMAIL` — your email provider's SMTP details (Gmail app password, SendGrid, Mailgun, etc.)

### 3. Set up the database
```bash
npx prisma migrate dev --name init
```
This creates all tables in your PostgreSQL database.

### 4. Create your admin account
```bash
npm run seed
```

### 5. Run the server
```bash
npm run start:dev
```

The API is now at **http://localhost:3000/api**, docs at **http://localhost:3000/api/docs**.

## Getting an admin token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"ChangeMe123!"}'
```

Copy the `accessToken` from the response and send it as `Authorization: Bearer <token>` on any admin-only route (or paste it into the "Authorize" button in Swagger at `/api/docs`).

## Example: creating a project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Shop",
    "overview": "A full-featured e-commerce store",
    "category": "e-commerce",
    "aim": "Build a fast, accessible storefront",
    "objective": "Practice payments integration",
    "technologyUsed": ["Next.js", "Stripe", "PostgreSQL"],
    "mobileVideoUrl": "https://res.cloudinary.com/.../mobile.mp4",
    "tabVideoUrl": "https://res.cloudinary.com/.../tab.mp4",
    "laptopVideoUrl": "https://res.cloudinary.com/.../laptop.mp4",
    "desktopVideoUrl": "https://res.cloudinary.com/.../desktop.mp4",
    "isTeamWork": true,
    "myRole": "Lead frontend developer",
    "keyFeatures": ["Cart", "Checkout", "Order tracking"],
    "description": "Full case study text...",
    "published": false
  }'
```

Then when ready to go live:
```bash
curl -X PATCH http://localhost:3000/api/projects/<id>/publish \
  -H "Authorization: Bearer <token>"
```

## Production notes

- Run `npx prisma migrate deploy` (not `migrate dev`) on your production database.
- Set all `.env` values as real environment variables on your host (Railway, Render, Fly.io, a VPS, etc.) — never commit `.env`.
- `npm run build` then `npm run start:prod` to run the compiled build.
- Consider adding rate limiting (`@nestjs/throttler`) on public POST routes (`/contact`, `/subscribers`) if this goes live publicly, to prevent spam submissions.
