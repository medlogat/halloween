// Stato condiviso della serata. Usa Upstash Redis (Vercel Marketplace) se configurato,
// altrimenti la memoria della funzione (solo per prove: su Vercel non è affidabile).

const KEY = 'casa-musagu:state';

export const INITIAL = {
  phase: 'copertina',
  overlay: null, // null | 'clue' | 'board' | 'verita'
  clue: null,
  found: [],
  timer: null, // { endsAt: ms, minutes }
  verita: 0,
  solStep: 0,
  music: { on: true, vol: 70 },
  ver: 1,
};

function creds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(cmd) {
  const c = creds();
  const r = await fetch(c.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error('Redis ' + r.status);
  const j = await r.json();
  return j.result;
}

export function syncMode() {
  return creds() ? 'redis' : 'memoria';
}

export async function getState() {
  if (creds()) {
    const raw = await redis(['GET', KEY]);
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : { ...INITIAL };
  }
  globalThis.__musagu = globalThis.__musagu || { ...INITIAL };
  return { ...globalThis.__musagu };
}

export async function setState(s) {
  if (creds()) {
    await redis(['SET', KEY, JSON.stringify(s)]);
    return;
  }
  globalThis.__musagu = s;
}
