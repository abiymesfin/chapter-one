# Chapter One V10.8 — ለManus AI መመሪያ (አማርኛ)

1. V10.8 ZIP ፋይሉን Manus AI ውስጥ Upload አድርግ።
2. `MANUS-PROMPT.md` ክፈትና ውስጡን ሙሉ በሙሉ Copy/Paste አድርግ።
3. Manus ከGitHub/Netlify ጋር ካልተገናኘ Authorize አድርግ። GitHub Token ወይም API Key በChat ውስጥ አትላክ።
4. ነባሩን private `chapter-one` repository እንዲጠቀም ወይም ካልኖረ እንዲፈጥር፣ `main` ላይ Push እንዲያደርግ መመሪያው ይነግረዋል።
5. ነባሩን `one-chapter` Netlify site ብቻ እንዲጠቀም ይመራዋል። አዲስ duplicate site አይፍጠር።

## የAI Keys ማስገባት

- Gemini ነፃ API Key: https://aistudio.google.com/ ላይ በFree Tier ፍጠር። Paid billing አታገናኝ።
- አማራጭ OpenRouter Free backup key: https://openrouter.ai/settings/keys ላይ ፍጠር፤ credits አትግዛ።
- Netlify → Site configuration → Environment variables → Functions scope ውስጥ `GEMINI_API_KEY` እና ካለ `OPENROUTER_API_KEY` ጨምር።
- ነባሩ `OPENAI_API_KEY` ለEnglish/Arabic ብቻ ይቆይ። እነዚህ የOpenAI API ጥሪዎች ክፍያ ሊያስከትሉ ይችላሉ። Amharic በOpenAI ፈጽሞ አይሄድም።
- `SUPABASE_URL` እና `SUPABASE_PUBLISHABLE_KEY` በsource ውስጥ ያሉ የpublic client values ናቸው፤ Manus ከindex.html እንዳሉ ያረጋግጥ። Optional Netlify override አድርጎ ማስገባት ይችላል። `service_role` key በፍጹም አይጠቀም።

## ዜሮ ወጪ ደንብ

Gemini እና OpenRouter የነፃ ገደባቸው ሲያልቅ Amharic generation ይቆማል። ወደ Paid fallback አይሄድም። OpenAI ለEnglish/Arabic ብቻ ነው እና ክፍያ ሊኖረው ይችላል።

በManus ሪፖርት የGitHub URL፣ Commit SHA፣ Netlify Deploy status እና ያልተፈጸሙ ሙከራዎችን ጠይቅ።
