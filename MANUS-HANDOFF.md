# Chapter One V10.8 — Manus handoff

**Production site:** https://one-chapter.netlify.app  
**Target GitHub repository:** private `chapter-one` on the connected owner's account  
**Branch:** `main`  
**Deploy:** existing Netlify site `one-chapter`; do not make a second site.

## Preserve

Preserve current UI, logo, all pages, local books, Supabase URL/public publishable key, auth, RLS schema, cloud library, reader, translator, PWA assets and all current product features. No demo data.

## Change

1. Amharic Create/Story/chapters/continuations/translations → Gemini Free `gemini-3.8-flash` primary.
2. Free fallback only: OpenRouter `google/gemma-4-26b-a4b-it:free`.
3. Never send Amharic to OpenAI/paid model. If free quota ends, stop, return a clear error and keep drafts.
4. English, Arabic and other languages continue on existing OpenAI integration. Do not invoke OpenAI during QA.
5. Apply book genre consistently to outline and every chapter call.
6. Four book cover options are local Canvas designs; no paid image request. Disable legacy `/api/covers`.
7. Keep PDF/DOCX/TXT/MD file import and translation. Searchable PDFs only; no OCR for scans.
8. Protect AI endpoint: frontend attaches Supabase session bearer token; function validates with `/auth/v1/user` before any provider request.

## Environment variables (Functions scope)

Keep existing values. Required for new Amharic route: `GEMINI_API_KEY`. Optional free backup: `OPENROUTER_API_KEY`. Existing non-Amharic route: `OPENAI_API_KEY`, optional `OPENAI_TEXT_MODEL`. Optional Supabase public-value overrides: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`. No secrets in repo. Never set a service-role key.

## QA and delivery

Run syntax and mocked tests. Test auth rejection and success; Amharic provider order and no-paid fallback; non-Amharic OpenAI route; genre continuity; local covers; file types; Supabase preservation. Do not call live provider APIs or spend user credits.

Push commit `Add zero-cost Amharic AI routing and authenticated AI endpoint` to private `chapter-one` `main`. Deploy to the existing Netlify site, keeping its existing environment variables. Report repo URL, commit SHA, deploy status and tests not run. Do not claim deployment if not actually completed.
