import { getState, setState, syncMode, INITIAL } from './_store.js';
import { CLUE_TEXT, SOLUTION } from './_data.js';

const PHASES = ['copertina', 'prologo1', 'prologo2', 'prologo3', 'schede', 'personaggi', 'regole',
  'antipasto', 'perq1', 'primo', 'perq2', 'secondo', 'perq3', 'dolce', 'soluzione', 'punteggio'];

function reduce(s, a, now) {
  const n = { ...s, found: [...s.found] };
  switch (a.action) {
    case 'phase':
      if (!PHASES.includes(a.phase)) return s;
      n.phase = a.phase; n.overlay = null;
      if (a.phase === 'soluzione' && n.solStep === 0) n.solStep = 0;
      break;
    case 'clue': {
      const c = Number(a.n);
      if (!CLUE_TEXT[c]) return s;
      n.overlay = 'clue'; n.clue = c;
      if (!n.found.includes(c)) n.found.push(c);
      break;
    }
    case 'unfind':
      n.found = n.found.filter((x) => x !== Number(a.n));
      if (n.clue === Number(a.n)) { n.overlay = null; n.clue = null; }
      break;
    case 'board': n.overlay = 'board'; break;
    case 'verita': n.verita = Math.min(3, n.verita + 1); n.overlay = 'verita'; break;
    case 'veritaUndo': n.verita = Math.max(0, n.verita - 1); break;
    case 'close': n.overlay = null; break;
    case 'timer': n.timer = { endsAt: now + Number(a.minutes) * 60000, minutes: Number(a.minutes) }; break;
    case 'timerAdd': if (n.timer) n.timer = { ...n.timer, endsAt: Math.max(n.timer.endsAt, now) + 60000 }; break;
    case 'timerStop': n.timer = null; break;
    case 'sol': n.phase = 'soluzione'; n.overlay = null; n.solStep = Math.max(0, Math.min(2, Number(a.step))); break;
    case 'music': n.music = { ...(s.music || INITIAL.music), on: !!a.on }; break;
    case 'vol': { const m = s.music || INITIAL.music; n.music = { ...m, vol: Math.max(0, Math.min(100, m.vol + Number(a.delta || 0))) }; break; }
    case 'reset': return { ...INITIAL, music: s.music || INITIAL.music, ver: s.ver + 1 };
    default: return s;
  }
  n.ver = s.ver + 1;
  return n;
}

function view(s) {
  const out = { ...s, serverNow: Date.now(), sync: syncMode() };
  out.clues = s.found.map((n) => ({ n, html: CLUE_TEXT[n] }));
  if (s.phase === 'soluzione' || s.phase === 'punteggio') {
    if (s.solStep >= 1 || s.phase === 'punteggio') out.solution = { name: SOLUTION.name, player: SOLUTION.player };
    if (s.solStep >= 2 || s.phase === 'punteggio') out.solution.html = SOLUTION.html;
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    let s = await getState();
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const next = reduce(s, body, Date.now());
      if (next !== s) { await setState(next); s = next; }
    }
    res.status(200).json(view(s));
  } catch (e) {
    res.status(500).json({ error: 'Stato non disponibile: ' + e.message });
  }
}
