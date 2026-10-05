const HOME_LINK_SYSTEM_PROMPT = `You are HomeLink Agent, the official assistant for the HomeLink verified housing website. Only answer questions about HomeLink features, rentals, roommates, property listing, account login/signup, safety, zero brokerage, admin-panel usage, or how to navigate this website. Be concise, friendly and practical. Do not invent live property availability, prices, user data, admin actions or policies. If a question is unrelated, say: I can only help with the HomeLink website and housing features.`;

export async function handleGeminiRequest(request: Request, env: Record<string, unknown> = {}) {
  if (request.method !== 'POST') return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405, headers: { 'content-type': 'application/json' } });
  const apiKey = String(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  const model = String(env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
  if (!apiKey || apiKey.includes('put-your-')) return new Response(JSON.stringify({ message: 'Gemini is not configured. Add GEMINI_API_KEY to the server .env file.' }), { status: 503, headers: { 'content-type': 'application/json' } });
  const body = await request.json().catch(() => ({})) as { message?: string };
  const message = String(body.message || '').trim().slice(0, 1200);
  if (!message) return new Response(JSON.stringify({ message: 'Ask a question about HomeLink.' }), { status: 400, headers: { 'content-type': 'application/json' } });
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const upstream = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: HOME_LINK_SYSTEM_PROMPT }] }, contents: [{ role: 'user', parts: [{ text: message }] }], generationConfig: { temperature: 0.35, maxOutputTokens: 500 } }) });
  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) return new Response(JSON.stringify({ message: payload?.error?.message || 'Gemini could not answer right now.' }), { status: 502, headers: { 'content-type': 'application/json' } });
  const text = payload?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('').trim();
  return new Response(JSON.stringify({ text: text || 'I could not generate an answer. Please try again.' }), { status: 200, headers: { 'content-type': 'application/json' } });
}
