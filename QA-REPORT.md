# Chapter One V10.8 QA report

## Passed — static checks

- `node --check netlify/functions/ai.mjs`
- `node --check netlify/functions/covers.mjs`
- Extracted inline JavaScript from `index.html` and passed `node --check`.
- `netlify.toml` still publishes `.` and uses `netlify/functions`.
- Translator file picker still accepts `.pdf`, `.docx`, `.txt`, `.md`; PDF.js and Mammoth extraction paths remain.
- The Canvas cover source defines exactly four 672×1008 portrait designs and returns JPEG data URLs; the cover picker uses this local function. The design logic was statically checked, not visually browser-tested.
- Browser source does not call `/api/covers`; the legacy Netlify cover function returns HTTP 410 to prevent accidental paid image generation.
- Selected genre is passed to Create outline, Story outline, chapter writing and chapter continuation.
- Existing Supabase project URL, publishable key and `supabase-schema.sql` were preserved.

## Passed — mocked endpoint tests

Run with `node tests/ai-routing.test.mjs`.

- AI POST without an access token returns HTTP 401 before any provider request.
- AI POST with an invalid Supabase token returns HTTP 401 before any provider request.
- Signed-in Amharic request uses Gemini Free Tier first.
- Gemini quota response triggers only the pinned OpenRouter Gemma `:free` variant when the optional backup key is configured.
- Amharic never calls OpenAI, including when an OpenAI key is present but free Amharic keys are missing or both free providers return quota errors.
- English and Arabic continue to use the existing OpenAI route.
- Genre is included in Amharic outline/chapter prompts.
- Public GET status does not reveal configured API key values.

## Not tested — must be reported honestly

- No live Gemini or OpenRouter API request was made; real account keys, free-tier quota, regional availability and Amharic literary quality must be tested by the owner after deployment.
- No OpenAI request was made in QA, to avoid spending existing API credits.
- No live Supabase Auth call was made; auth tests used a mocked `/auth/v1/user` response. The production session validation must be checked after deployment.
- No real Android device file-picker / PDF / DOCX UI test was performed.
- Scanned image-only PDFs still need OCR; this release extracts selectable text only.
- No GitHub repository creation, push, or Netlify deployment was performed by the package builder. Manus must report actual repo URL, commit SHA and deployment result if it performs them.
