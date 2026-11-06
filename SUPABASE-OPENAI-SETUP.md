# Chapter One — Supabase and AI setup (V10.8)

## Supabase values

The existing project URL and public publishable key remain in `index.html`: `https://fahphfzhjfygmghfknpb.supabase.co`. Do not replace the publishable key with a service-role/secret key.

## Database

If the existing `public.user_books` table and RLS policies already work, keep them unchanged. Otherwise run `supabase-schema.sql` in Supabase SQL Editor. Each user may access only their own `user_id` rows.

## AI providers

- `GEMINI_API_KEY`: Gemini 3.8 Flash Free Tier for Amharic. Keep project on Free Tier; do not connect paid billing.
- `OPENROUTER_API_KEY`: optional explicit free Gemma fallback for Amharic. Do not buy credits.
- `OPENAI_API_KEY`: existing English/Arabic/other non-Amharic provider only. OpenAI API calls may be paid.
- `OPENAI_TEXT_MODEL`: optional existing model override.

Amharic never calls OpenAI. When both free providers are unavailable/quota-limited, the request stops.

## AI authentication protection

Frontend passes the signed-in Supabase access token to `/api/ai`. Netlify validates it via Supabase Auth before any provider API call. Optional `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` values can override the public values embedded in the frontend. Never configure `service_role` in a browser or use it for this user-token validation.

## Deploy

Deploy complete project to existing Netlify site. Publish directory `.`, functions directory `netlify/functions`, no build command. Keep all existing Netlify variables. After deployment, sign in and test. The public GET `/api/ai` reports provider readiness but does not reveal keys.
