# Manus task — Chapter One V10.8 zero-cost Amharic AI routing

I uploaded the complete Chapter One project. Extract it and use these files as the source of truth. Do not redesign the UI, remove features, add demo data, replace Supabase, or create a duplicate Netlify site.

## Required behavior

1. Route Amharic Create a Book, Story / Movie Idea, outline, chapter writing/continuation and Amharic translation to Google Gemini Developer API Free Tier using the fixed model `gemini-3.8-flash`.
2. If Gemini errors, reaches quota, times out or returns output without sufficient Ethiopic script, try only OpenRouter `google/gemma-4-26b-a4b-it:free` when `OPENROUTER_API_KEY` exists. Do not use an unpinned model alias.
3. Amharic must NEVER call OpenAI or any paid model, even if both free providers fail. Return a useful quota/error message and preserve chapter drafts. No billing/credit purchase or auto-fallback.
4. English, Arabic and other non-Amharic languages keep the existing OpenAI route and existing key/model configuration. Do not run test calls against OpenAI.
5. Keep genre binding from outline through all chapter sections: fiction needs connected scenes, characters, dialogue, conflict and cause/effect; nonfiction needs structured, specific instructional content. No generic filler.
6. Four selectable cover concepts are locally generated with Canvas only. No image provider call. `/api/covers` remains disabled.
7. Keep Translator support for selectable/searchable PDF, DOCX, TXT and MD, sequential chunk processing and clear scanned-PDF OCR limitation.
8. Preserve all UI pages, logo, Supabase URL/key, Auth, RLS, existing cloud/local user books, section-level drafts/resume, PWA setup and existing features.

## API access protection

- Every POST to `/api/ai` must require a valid Supabase access token in `Authorization: Bearer <token>`; validate it against the existing Supabase Auth `/auth/v1/user` endpoint before any provider API request.
- Frontend `callAI()` must obtain the current session via `supabaseClient.auth.getSession()` and attach its access token.
- Use the existing public Supabase URL and publishable key from `index.html`; they may be optional Netlify overrides `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY`. Never use a service-role key. GET `/api/ai` may return configuration status only, never credentials.
- Do not expose provider keys or API responses containing secrets in logs or UI.

## Free-only rules

- Gemini Free Tier only; do not link paid billing.
- OpenRouter fixed `:free` variant only; user must not buy credits.
- Existing OpenAI route remains for non-Amharic languages as before; do not expand it to Amharic.
- Free quota failure means stop and explain; it never means spend money.

## Required Netlify Functions environment variables

- `GEMINI_API_KEY` — required for primary Amharic route.
- `OPENROUTER_API_KEY` — optional free Amharic backup; do not buy credits.
- `OPENAI_API_KEY` — preserve existing non-Amharic route.
- `OPENAI_TEXT_MODEL` — preserve existing setting; default `gpt-6-luna`.
- `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` — optional public-value overrides only; otherwise use the identical values in `index.html`.

Do not remove existing Netlify variables or add secrets to source, repository, frontend or ZIP. If the owner has not configured Gemini/OpenRouter keys, tell them; do not invent credentials.

## GitHub and Netlify

Use the GitHub account already connected to Manus. Push this project to the existing private `chapter-one` repository if it is the correct repo; otherwise create a private repository named `chapter-one`. Commit: `Add zero-cost Amharic AI routing and authenticated AI endpoint`. Push to `main`.

Connect the repository to the existing Netlify site `one-chapter` at `https://one-chapter.netlify.app`, not a duplicate site. Publish directory `.`, functions directory `netlify/functions`, no build command. Preserve all Netlify environment variables.

Never commit secrets or access tokens. If GitHub/Netlify authorization is missing, stop and tell the user to authorize it inside Manus.

## Tests and truthful report

Run static and mocked tests only; do not call live providers. Verify: both function syntax; Amharic Gemini then exact free Gemma; no Amharic OpenAI fallback; English/Arabic keep OpenAI; authenticated AI POST only; expired/absent token rejection; no paid cover endpoint; four local Canvas covers; genre passed to outline and chapter calls; PDF/DOCX/TXT/MD input; Supabase URL/key/table/RLS unchanged.

Do not claim live Amharic literary quality or real user API key operation passed unless actually tested by owner after deployment. Report GitHub repo URL, commit SHA, Netlify deploy status and every test not run.
