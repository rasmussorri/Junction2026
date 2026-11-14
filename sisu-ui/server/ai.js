export function parseResponse(body) {
  const candidate = body.candidates?.[0];
  let text = candidate?.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('') || '';
  if (!text.trim()) throw new Error('The assistant returned no answer. Please try again.');
  const meta = candidate.groundingMetadata || {};
  const chunks = meta.groundingChunks || [];
  const sources = chunks.map((c, i) => ({ id: i + 1, title: c.web?.title, url: c.web?.uri })).filter(s => s.url?.startsWith('https://'));
  // API offsets are UTF-8 byte offsets; insert citations from the end.
  let bytes = Buffer.from(text);
  const inserts = new Map();
  for (const support of meta.groundingSupports || []) {
    const end = support.segment?.endIndex;
    const refs = (support.groundingChunkIndices || []).map(i => sources.find(s => s.id === i + 1)).filter(Boolean);
    if (Number.isInteger(end) && end <= bytes.length && refs.length) {
      const existing = inserts.get(end) || new Map();
      refs.forEach(s => existing.set(s.id, s));
      inserts.set(end, existing);
    }
  }
  for (const [end, refs] of [...inserts].sort((a, b) => b[0] - a[0])) {
    const citation = ' ' + [...refs.values()].map(s => `[[${s.id}]](${s.url})`).join(' ');
    bytes = Buffer.concat([bytes.subarray(0, end), Buffer.from(citation), bytes.subarray(end)]);
  }
  return { text: bytes.toString(), sources, searched: (meta.webSearchQueries || []).length > 0, searchEntryPoint: meta.searchEntryPoint?.renderedContent || null };
}

export async function askGemini({ system, messages, web }) {
  if (!process.env.GEMINI_API_KEY) throw Object.assign(new Error('Add GEMINI_API_KEY to .env and restart the server to enable chat and web research.'), { status: 503 });
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
      ...(web ? { tools: [{ google_search: {} }] } : {}), generationConfig: { maxOutputTokens: 6000 } }),
    signal: AbortSignal.timeout(90000)
  });
  if (!response.ok) {
    const status = response.status;
    throw Object.assign(new Error(status === 402 ? 'Gemini prepaid credits are depleted. Top up the project in Google AI Studio, or update GEMINI_API_KEY in .env with a funded key and restart the server. The dashboard still works.' : status === 429 ? 'Gemini quota is currently exhausted. Try again later or check the API project’s quota.' : status === 401 || status === 403 ? 'Gemini rejected the API key. Check its permissions and billing.' : `Gemini request failed (${status}). Check GEMINI_MODEL or try again.`), { status: status === 429 ? 429 : status === 402 ? 402 : 502 });
  }
  return { ...parseResponse(await response.json()), model, generatedAt: new Date().toISOString() };
}
