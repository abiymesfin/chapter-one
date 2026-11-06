# Chapter One V10.8 — Zero-cost Amharic setup

## 1. Primary: Google Gemini Free Tier

1. Open https://aistudio.google.com/ and sign in.
2. Create/select a Google AI Studio project and create an API key.
3. Keep the project on Free Tier. Do not connect paid billing.
4. In Netlify → Site configuration → Environment variables, add `GEMINI_API_KEY`, available to Functions.

The app pins Amharic requests to `gemini-3.8-flash`. Google lists Free Tier input and output tokens at no charge, subject to rate limits. Review the current pricing and rate-limit pages before use: https://ai.google.dev/gemini-api/docs/pricing and https://ai.google.dev/gemini-api/docs/rate-limits.

## 2. Optional backup: OpenRouter free Gemma

1. Create an OpenRouter account at https://openrouter.ai/.
2. Create a key at https://openrouter.ai/settings/keys. Do not purchase credits.
3. Add `OPENROUTER_API_KEY` to Netlify Functions environment variables.

The backend is pinned to `google/gemma-4-26b-a4b-it:free`. OpenRouter currently lists $0 input/output pricing for this exact free variant, but applies request limits. Free limits may change: https://openrouter.ai/google/gemma-4-26b-a4b-it:free and https://openrouter.ai/collections/free-models.

## 3. Existing OpenAI route

Keep the existing `OPENAI_API_KEY` and optional `OPENAI_TEXT_MODEL` only if you still want English, Arabic and other non-Amharic languages to use OpenAI. Those requests may incur OpenAI API charges. Amharic never calls OpenAI, including when Gemini/Gemma fail.

## 4. Protect provider keys and user quotas

- The frontend sends the current Supabase sign-in access token with every AI POST request.
- The Netlify function validates that token with Supabase before contacting Gemini, OpenRouter or OpenAI. Anonymous requests are rejected.
- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are optional Netlify overrides. If omitted, the function uses the same public Supabase URL and publishable key already embedded in `index.html`. These are public client values, not a service-role secret.
- Never add the Supabase service-role key to the browser or this project. Never commit provider API keys.

## 5. What the app does

- Amharic Create a Book, Story / Movie Idea, chapter continuation and Amharic translation use Gemini Free Tier first.
- If Gemini returns quota/availability errors or non-Amharic output, the backend may try only the explicit `:free` Gemma backup.
- If the free backup is missing or rate-limited, generation stops. It never uses OpenAI as an Amharic fallback.
- English, Arabic and other languages continue to use the existing OpenAI route.
- Four cover thumbnails use local Canvas and do not make image API calls. The legacy paid `/api/covers` function is disabled.
- Chapter drafts are saved section-by-section; use **Write remaining** to resume after a quota reset.

## 6. Privacy and limits

Gemini Free Tier content may be used to improve Google products. OpenRouter requests are sent to third-party inference providers. Do not upload confidential manuscripts or sensitive personal data without reviewing their terms. Free tier is not unlimited; when limits are reached, generation stops without switching to paid models.

## 7. Verify after deploy

Open `https://one-chapter.netlify.app/api/ai` to see key-free provider configuration status. Then sign in and test one short Amharic outline and one chapter. Static/mocked tests cannot prove live provider availability or literary quality.
