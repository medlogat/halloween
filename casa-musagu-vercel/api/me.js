import { CHARS, SECRETS } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ch = String((req.query && req.query.char) || '');
  if (!CHARS.includes(ch)) return res.status(404).json({ error: 'Personaggio sconosciuto' });
  res.status(200).json({ html: SECRETS[ch] });
}
