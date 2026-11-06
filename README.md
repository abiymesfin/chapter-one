# Chapter One — V10.8 Free Amharic AI

This release preserves the existing mobile-first book creation/reading app, Supabase authentication and cloud library, PDF/DOCX/TXT/MD Translator, local chapter drafts and free Canvas cover options.

## AI routing

- Amharic: Gemini Developer API Free Tier (`gemini-3.8-flash`) first; optional OpenRouter Gemma `google/gemma-4-26b-a4b-it:free` backup. Never uses OpenAI or a paid provider for Amharic.
- English, Arabic and other languages: retain the existing OpenAI route; these requests may incur API charges.
- When free Amharic quotas are exhausted, requests stop without paid fallback.

## Security

AI POST requests require an active Supabase session. The Netlify function validates the bearer token through Supabase Auth before using provider keys. Only the existing public Supabase URL and publishable key are used; never use a service-role key.

## Setup and deployment

Read `MANUS-START-HERE-AM.md`, `MANUS-PROMPT.md` and `ZERO-COST-AMHARIC-SETUP.md`. Existing Netlify site: https://one-chapter.netlify.app. No build command; publish `.`; functions `netlify/functions`.
