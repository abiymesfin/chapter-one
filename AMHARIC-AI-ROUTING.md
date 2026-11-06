# Amharic AI routing contract

- Primary: `gemini-3.8-flash` with a key created on Google AI Studio's Free Tier.
- Optional backup: `google/gemma-4-26b-a4b-it:free` on OpenRouter. Keep the `:free` suffix.
- The only permitted Amharic providers are those two. No OpenAI or paid model fallback exists in the Amharic path.
- If the primary and backup are missing, down, quota-limited, or fail the Ethiopic-script check, return an error. Never silently route Amharic to a paid model.
- English, Arabic and other non-Amharic languages keep the existing OpenAI configuration. These calls may still incur OpenAI API costs; the entire app is therefore not guaranteed to be $0 for every language.
- Do not send private/confidential manuscripts to free providers without checking their data-use/privacy terms. Gemini's Free Tier may use submitted content to improve Google products.

This is a quota-limited free configuration, not an unlimited or uptime-guaranteed service. The owner should check the current official rate limits and free-model status before increasing traffic.
