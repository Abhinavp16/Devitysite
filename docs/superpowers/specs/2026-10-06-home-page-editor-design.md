# Home page editor — design

Date: 2026-10-06 · Status: approved

## Goal
Let admins change the public home (hero) section from the admin panel instead of editing code:
headline, subtitle, the 4 strip photos, the centre logo video, and the "Our speakers come from" company names.

## Data model (MongoDB)
- `MediaAsset` — one uploaded file: `data` (Buffer), `content_type`, `size`, `filename`, `created_by`.
- `SiteContent` — single document with `key: 'home'`:
  - `headline` (string), `headline_highlight` (string, rendered italic), `subtitle` (string)
  - `photos`: exactly 4 slots, in strip order `[outer-left, inner-left, inner-right, outer-right]`,
    each `{ media: ObjectId|null, alt: string }`
  - `video`: ObjectId|null
  - `speaker_companies`: [string]
  - `updated_by`
- Any unset field / empty slot means "use the built-in default".

## API
Public (no auth, existing public rate limiter):
- `GET /api/public/home` → `{ headline, headline_highlight, subtitle, speaker_companies, photos: [{ media_id|null, alt }], video_id|null }`,
  or `data: null` if nothing has been customised. Unset text fields are `null`. Media are returned as ids because the
  frontend and API are on different domains; the frontend builds `${API_BASE}/public/media/${id}`.
- `GET /api/public/media/:id` → raw bytes with the stored `Content-Type` and
  `Cache-Control: public, max-age=31536000, immutable` (replacing a file always creates a new id).

Admin (JWT required, activity-logged under `site_content`):
- `GET /api/home` → same shape as public, plus raw ids.
- `PUT /api/home` → text fields, photo `alt`s, `speaker_companies` (Joi-validated; empty string resets a text field to default).
- `PUT /api/home/photos/:slot` (slot 0–3) → raw image body (`image/jpeg|png|webp`, ≤ 2 MB); replaces slot, deletes old asset.
- `DELETE /api/home/photos/:slot` → reset slot to default, deletes asset.
- `PUT /api/home/video` → raw video body (`video/mp4|webm`, ≤ 4 MB — under Vercel's 4.5 MB request cap); replaces, deletes old asset.
- `DELETE /api/home/video` → reset to default, deletes asset.
- Uploads use `express.raw` on these routes only (not base64 JSON).

## Admin UI — new "Home Page" tab
- Text card: headline, highlighted part, subtitle → **Save** button.
- Photos: 4 slots in strip order with preview, Upload/Replace (browser-compressed to WebP ≤ 900 px), alt text (saved with Save), Reset to default.
- Video: preview player, Upload/Replace, Reset to default; shows size limit and rejects larger files before upload.
- Company names: removable chips + add field (saved with Save).
- Uploads and resets apply immediately; toasts report success/failure.

## Public hero
- Fetch `/public/home` on mount. Until it resolves, headline and photo tiles show shimmer skeletons (no default→custom flash).
- Per field: custom value if set, otherwise the current built-in default. On error or after a 3 s timeout, fall back to all defaults.
- Double-click on "Our speakers come from" still opens `/login`.

## Testing
- Backend integration tests against a throwaway local MongoDB: auth required on admin routes, upload → served bytes/headers,
  replace deletes old asset, reset, wrong type and oversize rejected, public endpoint shape with and without custom content.
- Browser check of the admin tab (upload, reset, save) and the hero (custom content, fallback).

## Out of scope
Moving existing Memories/Team/Speaker images off base64 (separate task; this introduces the `MediaAsset` pattern it can reuse).
