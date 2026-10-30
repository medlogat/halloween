// Pagina principale con le anteprime per WhatsApp: l'immagine deve avere un indirizzo assoluto,
// quindi la pagina viene servita da qui usando il dominio da cui arriva la richiesta.
export default function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const origin = `${proto}://${host}`;
  const title = 'Il Mistero di Casa Musagu';
  const desc = 'Cena con delitto · Sabato 31 ottobre, ore 21:00. Apri il link e scegli chi sei.';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(`<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0E0B0A">
<meta name="robots" content="noindex">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Casa Musagu">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${origin}/">
<meta property="og:image" content="${origin}/og.jpg">
<meta property="og:image:secure_url" content="${origin}/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Il Mistero di Casa Musagu: luna, pipistrelli e sangue che cola">
<meta property="og:locale" content="it_IT">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${origin}/og.jpg">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Caveat:wght@500&display=swap">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div id="app" aria-live="polite"></div>
<script src="/music.js"></script>
<script src="/app.js"></script>
</body>
</html>`);
}
