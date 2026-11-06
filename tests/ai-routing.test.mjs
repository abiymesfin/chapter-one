import assert from 'node:assert/strict';
import { handler } from '../netlify/functions/ai.mjs';

const savedEnv = { ...process.env };
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const request = (body, token = 'valid-test-token') => ({
  httpMethod: 'POST',
  headers: token ? { authorization: `Bearer ${token}` } : {},
  body: JSON.stringify(body)
});
const amharicResponse = 'የታሪኩ ጀግና በአንድ ዝናባማ ምሽት ወደ ከተማው ተመለሰ።';

function cleanEnv() {
  for (const key of ['OPENAI_API_KEY', 'GEMINI_API_KEY', 'OPENROUTER_API_KEY', 'OPENAI_TEXT_MODEL']) delete process.env[key];
}

try {
  cleanEnv();
  let calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/auth/v1/user')) return json(200, { id: 'test-user' });
    throw new Error(`Unexpected provider request: ${url}`);
  };

  // No bearer token: reject before any AI provider is contacted.
  let response = await handler(request({ mode: 'outline', topic: 'ምስጢር', language: 'Amharic' }, null));
  assert.equal(response.statusCode, 401);
  assert.equal(calls.length, 0);

  // Invalid Supabase session: reject before provider call.
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/auth/v1/user')) return json(401, { message: 'invalid token' });
    throw new Error(`Provider must not be called: ${url}`);
  };
  response = await handler(request({ mode: 'outline', topic: 'Mystery', language: 'Amharic' }));
  assert.equal(response.statusCode, 401);

  // Gemini is the Amharic primary and receives the selected genre.
  cleanEnv(); process.env.GEMINI_API_KEY = 'mock-gemini-key'; calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/auth/v1/user')) return json(200, { id: 'test-user' });
    if (String(url).includes('generativelanguage.googleapis.com')) return json(200, {
      candidates: [{ content: { parts: [{ text: amharicResponse }] }, finishReason: 'STOP' }]
    });
    throw new Error(`Unexpected provider request: ${url}`);
  };
  response = await handler(request({ mode: 'outline', topic: 'የምስጢር ታሪክ', language: 'Amharic', genre: 'Mystery', chapters: 3, pages: 5 }));
  assert.equal(response.statusCode, 200);
  assert.equal(JSON.parse(response.body).provider, 'Google Gemini');
  const geminiRequest = calls.find(c => c.url.includes('generativelanguage.googleapis.com'));
  assert.ok(geminiRequest);
  assert.match(JSON.parse(geminiRequest.options.body).contents[0].parts[0].text, /Selected genre: Mystery/);

  // Every Amharic AI mode is routed through Gemini, not just the outline.
  for (const body of [
    { mode: 'story-outline', idea: 'በአንድ ከተማ የሚከሰት ምስጢር', language: 'Amharic', genre: 'Mystery', chapters: 3, pages: 5 },
    { mode: 'chapter', title: 'የምስጢር መንገድ', chapterTitle: 'የመጀመሪያው ምልክት', chapterNumber: 1, language: 'Amharic', genre: 'Mystery', chapters: 3, pages: 5, targetWords: 100, outline: 'ምዕራፍ 1', isLastPart: true },
    { mode: 'continue-chapter', title: 'የምስጢር መንገድ', chapterTitle: 'የመጀመሪያው ምልክት', chapterNumber: 1, language: 'Amharic', genre: 'Mystery', targetWords: 100, existingContent: 'የታሪኩ ጀግና በዝናብ ውስጥ ቆመ።', isLastPart: true },
    { mode: 'translate', text: 'This is a short test paragraph.', from: 'English', to: 'Amharic' }
  ]) {
    cleanEnv(); process.env.GEMINI_API_KEY = 'mock-gemini-key'; calls = [];
    let capturedPrompt = '';
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url: String(url), options });
      if (String(url).includes('/auth/v1/user')) return json(200, { id: 'test-user' });
      if (String(url).includes('generativelanguage.googleapis.com')) {
        const payload = JSON.parse(options.body);
        capturedPrompt = payload.contents[0].parts[0].text;
        return json(200, { candidates: [{ content: { parts: [{ text: amharicResponse }] }, finishReason: 'STOP' }] });
      }
      throw new Error(`Unexpected provider request for ${body.mode}: ${url}`);
    };
    response = await handler(request(body));
    assert.equal(response.statusCode, 200, `${body.mode} should use Gemini for Amharic`);
    assert.equal(JSON.parse(response.body).provider, 'Google Gemini');
    assert.equal(calls.filter(c => c.url.includes('generativelanguage.googleapis.com')).length, 1);
    assert.equal(calls.some(c => c.url.includes('api.openai.com')), false);
    if (body.genre) assert.match(capturedPrompt, /MYSTERY\/CRIME|MYSTERY/);
  }

  // Gemini quota -> exact free Gemma backup; OpenAI is never contacted.
  cleanEnv(); process.env.GEMINI_API_KEY = 'mock-gemini-key'; process.env.OPENROUTER_API_KEY = 'mock-openrouter-key'; calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/auth/v1/user')) return json(200, { id: 'test-user' });
    if (String(url).includes('generativelanguage.googleapis.com')) return json(429, { error: { message: 'quota exceeded' } });
    if (String(url).includes('openrouter.ai')) {
      const payload = JSON.parse(options.body);
      assert.equal(payload.model, 'google/gemma-4-26b-a4b-it:free');
      assert.match(payload.messages[1].content, /Selected genre: Mystery/);
      return json(200, { choices: [{ message: { content: amharicResponse }, finish_reason: 'stop' }] });
    }
    throw new Error(`Paid provider must not be called for Amharic: ${url}`);
  };
  response = await handler(request({ mode: 'outline', topic: 'ምስጢር', language: 'Amharic', genre: 'Mystery', chapters: 3, pages: 5 }));
  assert.equal(response.statusCode, 200);
  assert.equal(JSON.parse(response.body).provider, 'OpenRouter free Gemma');
  assert.equal(JSON.parse(response.body).paidFallback, false);
  assert.equal(calls.some(c => c.url.includes('api.openai.com')), false);

  // No free key: Amharic stops even when an OpenAI key exists.
  cleanEnv(); process.env.OPENAI_API_KEY = 'mock-openai-key'; calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/auth/v1/user')) return json(200, { id: 'test-user' });
    throw new Error(`Amharic must not call paid provider: ${url}`);
  };
  response = await handler(request({ mode: 'outline', topic: 'ልብወለድ', language: 'Amharic' }));
  assert.equal(response.statusCode, 503);
  assert.equal(calls.some(c => c.url.includes('api.openai.com')), false);

  // English and Arabic preserve the existing OpenAI route.
  for (const language of ['English', 'Arabic']) {
    cleanEnv(); process.env.OPENAI_API_KEY = 'mock-openai-key'; calls = [];
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url: String(url), options });
      if (String(url).includes('/auth/v1/user')) return json(200, { id: 'test-user' });
      if (String(url).includes('api.openai.com')) return json(200, { choices: [{ message: { content: 'A book outline in the requested language.' }, finish_reason: 'stop' }] });
      throw new Error(`Unexpected provider: ${url}`);
    };
    response = await handler(request({ mode: 'outline', topic: 'A novel', language, genre: 'Fiction', chapters: 3, pages: 5 }));
    assert.equal(response.statusCode, 200, `${language} should remain on OpenAI`);
    assert.equal(JSON.parse(response.body).provider, 'OpenAI');
    assert.equal(calls.filter(c => c.url.includes('api.openai.com')).length, 1);
  }

  // Public status endpoint reveals configuration state only, not credentials.
  cleanEnv(); process.env.GEMINI_API_KEY = 'must-not-leak';
  response = await handler({ httpMethod: 'GET', headers: {} });
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.includes('must-not-leak'), false);

  // Both free providers exhausted -> return a no-paid-fallback response.
  cleanEnv(); process.env.GEMINI_API_KEY = 'mock-gemini'; process.env.OPENROUTER_API_KEY = 'mock-free'; process.env.OPENAI_API_KEY = 'must-not-call'; calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/auth/v1/user')) return json(200, { id: 'test-user' });
    if (String(url).includes('generativelanguage.googleapis.com')) return json(429, { error: { message: 'quota exceeded' } });
    if (String(url).includes('openrouter.ai')) return json(429, { error: { message: 'free quota exceeded' } });
    throw new Error(`Must not spend paid credits: ${url}`);
  };
  response = await handler(request({ mode: 'outline', topic: 'ልብወለድ', language: 'Amharic' }));
  assert.equal(response.statusCode, 429);
  assert.equal(JSON.parse(response.body).paidFallback, false);
  assert.equal(calls.some(c => c.url.includes('api.openai.com')), false);

  console.log('PASS: Supabase authentication; Gemini primary; exact free Gemma backup; Amharic never calls OpenAI; English/Arabic retain OpenAI; genre propagation; API status hides keys; free-quota stop without paid fallback.');
} finally {
  cleanEnv();
  for (const [key, value] of Object.entries(savedEnv)) process.env[key] = value;
}
