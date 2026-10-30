(function () {
  'use strict';

  /* ================= Dati pubblici ================= */
  var PEOPLE = [
    { id: 'andrea', name: 'Andrea', char: 'gaspare' },
    { id: 'giulia', name: 'Giulia', char: 'vicky' },
    { id: 'danilo', name: 'Danilo', char: 'leone' },
    { id: 'marco', name: 'Marco', char: 'falchi' },
    { id: 'matteo', name: 'Matteo', char: 'tancredi' },
    { id: 'sara', name: 'Sara', char: 'beatrice' }
  ];
  var CHARS = {
    falchi: { name: 'Ispettore Corrado Falchi', role: 'L’investigatore', player: 'Marco', det: true,
      desc: 'Ispettore di polizia in pensione, amico di Ottavio dai tempi del liceo. Calmo, ironico, osserva tutto, mastica liquirizia e chiama tutti per cognome.',
      look: 'Impermeabile o cappotto lungo, cappello, taccuino e lente d’ingrandimento. Baffi disegnati, occhiaie, una vecchia cicatrice sul sopracciglio.',
      quote: 'Tutti mentono. Il trucco è capire su cosa.' },
    beatrice: { name: 'Beatrice Musagu', role: 'La nipote prediletta', player: 'Sara',
      desc: 'Nipote ed erede di Ottavio, moglie di Leone. Padrona di casa impeccabile, sorriso perfetto, controlla ogni dettaglio e adora i pettegolezzi, purché non riguardino lei.',
      look: 'Abito nero elegante, guanti di pizzo, perle, velo nero “da vedova in anticipo”. Pelle pallida, occhi fumé, rossetto bordeaux.',
      quote: 'In questa famiglia i segreti si servono a tavola.' },
    leone: { name: 'Leone Varani', role: 'Lo chef', player: 'Danilo',
      desc: 'Marito di Beatrice e chef del ristorante “Il Banchetto”. Stasera ha cucinato lui. Gioviale e goloso, si offende se qualcuno lascia qualcosa nel piatto.',
      look: 'Giacca da chef o grembiule macchiato di sangue finto, papillon, mannaia finta. Trucco da macellaio zombie con cicatrice cucita.',
      quote: 'Il segreto di un buon piatto? Non chiedere mai cosa c’è dentro.' },
    vicky: { name: 'Vicky Del Monte', role: 'La fidanzata', player: 'Giulia',
      desc: 'Ex ballerina, quarant’anni meno di Ottavio, il matrimonio è fissato per dicembre. Ride forte, chiama tutti “tesoro” e non perde mai di vista il suo bicchiere.',
      look: 'Abito anni ’20 nero e oro, piume o boa, anello a forma di serpente. Glitter dorati, labbra rosso scuro, mascara colato.',
      quote: 'Tesoro, io amavo Ottavio… e il suo conto in banca.' },
    tancredi: { name: 'Dottor Tancredi Lupo', role: 'Il medico di famiglia', player: 'Matteo',
      desc: 'Cura Ottavio da quindici anni. Affascinante, elegante e un po’ vanitoso, cita il latino e dà consigli di salute a chiunque.',
      look: 'Completo scuro, camice bianco macchiato di sangue, stetoscopio, gemelli d’oro. Volto pallido, punti di sutura finti.',
      quote: 'Primum non nocere… salvo eccezioni.' },
    gaspare: { name: 'Gaspare Musagu', role: 'Il fratello artista', player: 'Andrea',
      desc: 'Fratello minore di Ottavio, pittore bohémien sempre senza un soldo. Sarcastico e cinico, beve troppo vino rosso e critica l’arredamento.',
      look: 'Camicia bianca ampia, gilet di velluto, foulard, basco. Mani macchiate di colore, barba sfatta disegnata, una lacrima di sangue.',
      quote: 'L’arte è l’unica bugia che dice la verità.' }
  };
  var CAST_ORDER = ['falchi', 'beatrice', 'leone', 'vicky', 'tancredi', 'gaspare'];

  var CLUES = [
    { n: 1, room: 'Camera da letto', title: 'La scena' },
    { n: 2, room: 'Camera da letto', title: 'La tazza' },
    { n: 3, room: 'Camera da letto', title: 'Il cassetto' },
    { n: 4, room: 'Cucina', title: 'Il blister' },
    { n: 5, room: 'Cucina', title: 'Carta bruciata' },
    { n: 6, room: 'Bagno', title: 'Il cestino' },
    { n: 7, room: 'Bagno', title: 'In fondo alla cesta', sealed: true },
    { n: 8, room: 'Salotto', title: 'La maschera', sealed: true },
    { n: 9, room: 'Salotto', title: 'La busta di mezzanotte', sealed: true },
    { n: 10, room: 'Salotto', title: 'Le fotografie' }
  ];
  function clueMeta(n) { for (var i = 0; i < CLUES.length; i++) if (CLUES[i].n === n) return CLUES[i]; return null; }
  var PERQ = { perq1: { rooms: 'Camera da letto', clues: [1, 2, 3] }, perq2: { rooms: 'Cucina e bagno', clues: [4, 5, 6, 7] }, perq3: { rooms: 'Salotto', clues: [8, 9, 10] } };

  var RULES = [
    'Ognuno legge la propria scheda segreta da solo, sul proprio telefono.',
    'Si resta nel personaggio per tutta la cena.',
    'Gli innocenti possono mentire solo per proteggere il proprio segreto. Su cosa hanno visto o sentito tra le 20:00 e le 20:50 devono dire la verità, se glielo chiedono.',
    'L’assassino può mentire su tutto e non confessa mai.',
    'Domanda di Verità: a ogni perquisizione l’ispettore fa una domanda sì o no a un sospettato, che deve rispondere sinceramente. Anche l’assassino.',
    'Chi trova un indizio lo legge subito ad alta voce. Le buste sigillate si aprono solo quando vengono trovate.',
    'Al dolce l’ispettore ricostruisce il delitto, poi ognuno scrive chi ha ucciso, come e perché.'
  ];
  var SCORE = [
    ['Ispettore: hai indovinato l’assassino', '3'], ['Sospettati: avete indovinato l’assassino', '2'],
    ['Hai indovinato come ha ucciso', '1'], ['Hai indovinato perché', '1'],
    ['Ogni obiettivo personale completato', '1'], ['Ispettore: ogni segreto altrui smascherato', '1'],
    ['Assassino: l’ispettore accusa qualcun altro', '3'], ['Assassino: meno della metà degli ospiti lo accusa', '2']
  ];

  var PHASES = [
    { id: 'copertina', label: 'Copertina', hint: 'Mentre arrivano gli ospiti' },
    { id: 'prologo1', label: 'Prologo 1/3', hint: 'Marco legge' },
    { id: 'prologo2', label: 'Prologo 2/3', hint: 'Marco legge' },
    { id: 'prologo3', label: 'Prologo 3/3', hint: 'Marco legge' },
    { id: 'schede', label: 'Schede segrete', hint: 'Tutti sul telefono' },
    { id: 'personaggi', label: 'Presentazioni', hint: 'Un minuto a testa' },
    { id: 'regole', label: 'Regole', hint: 'Prima di sedersi' },
    { id: 'antipasto', label: 'Antipasto', hint: 'Si mangia e si indaga' },
    { id: 'perq1', label: 'Perquisizione I', hint: 'Camera da letto' },
    { id: 'primo', label: 'Primo', hint: 'Si mangia e si indaga' },
    { id: 'perq2', label: 'Perquisizione II', hint: 'Cucina e bagno' },
    { id: 'secondo', label: 'Secondo', hint: 'Si mangia e si indaga' },
    { id: 'perq3', label: 'Perquisizione III', hint: 'Salotto' },
    { id: 'dolce', label: 'Accusa finale', hint: 'Dolce e foglietti' },
    { id: 'soluzione', label: 'Soluzione', hint: 'Usa i tasti sotto' },
    { id: 'punteggio', label: 'Punteggio', hint: 'Si contano i punti' }
  ];
  function phaseIndex(id) { for (var i = 0; i < PHASES.length; i++) if (PHASES[i].id === id) return i; return 0; }

  var COURSE = {
    antipasto: { name: 'Antipasto', next: 'Camera da letto, la scena del delitto' },
    primo: { name: 'Primo', next: 'Cucina e bagno' },
    secondo: { name: 'Secondo', next: 'Salotto' }
  };

  // Testo breve per i telefoni
  var PHONE_NOW = {
    copertina: ['Benvenuti a Casa Musagu', 'Mettetevi comodi: tra poco Marco leggerà il prologo.'],
    prologo1: ['Il prologo', 'Ascoltate Marco e seguite la storia sulla TV.'],
    prologo2: ['Il prologo', 'Ascoltate Marco e seguite la storia sulla TV.'],
    prologo3: ['Il prologo', 'Ascoltate Marco e seguite la storia sulla TV.'],
    schede: ['Leggi la tua scheda segreta', 'Apri la scheda “Segreto” qui sopra, leggila da solo e poi nascondila.'],
    personaggi: ['Presentazioni', 'Presentati in personaggio: chi sei, cosa fai, una frase tipica. Un minuto.'],
    regole: ['Le regole', 'Le trovi anche nella scheda “Regole”.'],
    antipasto: ['Antipasto', 'Mangiate e interrogatevi: dove eravate tra le 20:00 e le 20:50?'],
    perq1: ['Perquisizione I', 'Tutti in camera da letto. Chi trova un indizio lo legge ad alta voce.'],
    primo: ['Primo', 'Discutete gli indizi trovati. Chi mente?'],
    perq2: ['Perquisizione II', 'Cucina e bagno. Le buste sigillate si aprono solo quando le trovate.'],
    secondo: ['Secondo', 'Ultime domande prima del salotto.'],
    perq3: ['Perquisizione III', 'Il salotto. Tra gli indizi c’è la busta di mezzanotte.'],
    dolce: ['L’accusa finale', 'Ascolta la ricostruzione di Marco, poi scrivi sul foglietto chi, come e perché.'],
    soluzione: ['La soluzione', 'Guardate la TV.'],
    punteggio: ['Il punteggio', 'Contate i vostri punti: vince chi ne ha di più.']
  };

  /* ================= Utilità ================= */
  var app = document.getElementById('app');
  var LS_ROLE = 'casa-musagu:ruolo';
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var DRIP = '<svg class="drip" viewBox="0 0 1080 90" preserveAspectRatio="none" aria-hidden="true"><path fill="#9B1119" d="M0,0 H1080 V22 C1060,22 1052,26 1048,36 C1044,48 1038,58 1032,58 C1026,58 1022,48 1018,36 C1014,26 1002,24 980,24 H900 C886,24 880,30 878,44 C876,66 870,82 860,82 C850,82 846,66 844,44 C842,30 836,26 820,26 H700 C690,26 686,30 684,36 C682,42 678,46 672,46 C666,46 662,42 660,36 C658,30 652,26 640,26 H520 C508,26 504,32 502,38 C500,44 496,48 490,48 C484,48 480,44 478,38 C476,32 470,26 458,26 H330 C320,26 316,30 314,40 C312,50 306,56 300,56 C294,56 290,50 288,40 C286,30 280,26 268,26 H190 C180,26 174,32 172,48 C170,72 164,86 156,86 C148,86 144,72 142,48 C140,32 134,24 120,24 H0 Z"/></svg>';
  var BAT = 'M50 18 C47 12 44 12 43 16 C38 8 26 4 14 8 C22 12 24 18 22 24 C16 20 8 22 2 28 C14 28 22 32 26 40 C32 34 40 34 46 40 L50 32 L54 40 C60 34 68 34 74 40 C78 32 86 28 98 28 C92 22 84 20 78 24 C76 18 78 12 86 8 C74 4 62 8 57 16 C56 12 53 12 50 18 Z';
  var MOON = '<svg class="cover-moon" viewBox="0 0 420 140" aria-hidden="true"><circle cx="210" cy="70" r="56" fill="#EDE3D1"/><circle cx="234" cy="56" r="52" fill="#0E0B0A"/><g fill="#EDE3D1" opacity=".9"><path transform="translate(40 40) scale(.7)" d="' + BAT + '"/><path transform="translate(300 18) scale(.55)" d="' + BAT + '"/><path transform="translate(330 84) scale(.4)" d="' + BAT + '"/></g></svg>';
  var LOCK = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#9B1119"/><circle cx="32" cy="32" r="22" fill="none" stroke="#EDE3D1" stroke-opacity=".5"/><text x="32" y="42" text-anchor="middle" font-family="Cinzel Decorative, serif" font-size="26" font-weight="700" fill="#EDE3D1">M</text></svg>';

  /* ================= Stato condiviso ================= */
  var S = null, offset = 0, lastVer = -1, pollT = null, netErr = '';
  function api(method, body) {
    return fetch('/api/state', {
      method: method, cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (s) { if (s.error) throw new Error(s.error); netErr = ''; offset = s.serverNow - Date.now(); return s; });
  }
  function now() { return Date.now() + offset; }
  function act(body) {
    return api('POST', body).then(function (s) { S = s; lastVer = -1; render(); }).catch(function (e) { netErr = e.message; render(); });
  }
  function startPolling(ms, onlyVisible) {
    function tick() {
      if (onlyVisible && document.hidden) { pollT = setTimeout(tick, ms); return; }
      api('GET').then(function (s) { S = s; if (s.ver !== lastVer) render(); })
        .catch(function (e) { netErr = e.message; render(); })
        .then(function () { pollT = setTimeout(tick, ms); });
    }
    tick();
  }
  function remaining() {
    if (!S || !S.timer) return null;
    return Math.max(0, S.timer.endsAt - now());
  }
  function fmt(ms) { var t = Math.ceil(ms / 1000), m = Math.floor(t / 60), s = t % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  setInterval(function () {
    var els = document.querySelectorAll('[data-timer]');
    if (!els.length) return;
    var r = remaining();
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = r === null ? '' : (r === 0 ? 'Tempo!' : fmt(r));
      els[i].classList.toggle('low', r !== null && r < 60000);
    }
  }, 250);

  /* ================= Router ================= */
  var role = lsGet(LS_ROLE);
  var entered = false, pickMuted = false, pending = null, tab = 'ora', secretOpen = false, secretHtml = null, tvStarted = false;

  function render() {
    var ae = document.activeElement;
    if (ae && ae.tagName === 'TEXTAREA' && role && role !== 'tv' && role !== 'regia') return;
    if (S) lastVer = S.ver;
    if (!role) return renderPick();
    if (role === 'tv') return renderTV();
    if (role === 'regia') return renderRegia();
    return renderPhone();
  }

  /* ---------- Scelta ---------- */
  function pickMusic(on) {
    var M = window.MusagMusic; if (!M) return;
    if (on) { M.start(); M.setVolume(0.6); M.setEnabled(!pickMuted); M.play('carillon'); }
    else M.play(null);
  }
  function renderPick() {
    document.body.className = '';
    var h = DRIP + '<div class="pick"><div class="pick-inner">';
    if (!entered) {
      h += '<div class="splash">' + MOON + '<p class="eyebrow">Cena con delitto · Notte di Halloween</p><h1>Il Mistero di <span>Casa Musagu</span></h1><p class="note" style="font-size:19px">Sabato 31 ottobre · ore 21:00</p>' +
        '<button class="btn enter" type="button" data-enter>Entra a Casa Musagu</button><p class="note">Alza il volume: la serata comincia con la musica.</p></div></div></div>';
      app.innerHTML = h; return;
    }
    h += '<button class="mute" type="button" data-mute aria-label="' + (pickMuted ? 'Attiva la musica' : 'Disattiva la musica') + '">' + (pickMuted ? 'Musica spenta' : 'Musica accesa') + '</button>';
    h += '<p class="eyebrow">Cena con delitto · Notte di Halloween</p><h1>Il Mistero di <span>Casa Musagu</span></h1>';
    if (!pending) {
      h += '<p class="q">Chi sei?</p><div class="names">';
      PEOPLE.forEach(function (p) { h += '<button class="btn" type="button" data-pick="' + p.id + '">' + p.name + '</button>'; });
      h += '</div><div class="devs"><button class="btn ghost" type="button" data-pick="regia">iPad · Regia</button><button class="btn ghost" type="button" data-pick="tv">Schermo TV</button></div>';
      h += '<p class="note">Scegli una sola volta: da quel momento questo dispositivo mostrerà solo le tue schermate.</p>';
    } else {
      var label = pending === 'regia' ? 'l’iPad della regia' : pending === 'tv' ? 'lo schermo della TV' : nameOf(pending);
      h += '<div class="confirm"><p class="eyebrow">Conferma</p><p class="big">' + (pending === 'regia' || pending === 'tv' ? 'Questo è ' + label + '?' : 'Sei ' + label + '?') + '</p>';
      h += '<p class="note">' + (pending === 'regia' ? 'Da qui comanderai quello che appare sulla TV.' : pending === 'tv' ? 'Questo schermo mostrerà quello che sceglie la regia.' : 'Da ora su questo telefono vedrai solo la tua scheda e quello che tutti possono vedere.') + '</p>';
      h += '<div class="row" style="justify-content:center"><button class="btn" type="button" data-confirm>Sì, confermo</button><button class="btn ghost" type="button" data-back>Indietro</button></div></div>';
    }
    h += '</div></div>';
    app.innerHTML = h;
  }
  function nameOf(id) { for (var i = 0; i < PEOPLE.length; i++) if (PEOPLE[i].id === id) return PEOPLE[i].name; return id; }
  function personOf(id) { for (var i = 0; i < PEOPLE.length; i++) if (PEOPLE[i].id === id) return PEOPLE[i]; return null; }

  /* ---------- Telefono ---------- */
  function renderPhone() {
    document.body.className = '';
    var p = personOf(role); if (!p) { lsDel(LS_ROLE); role = null; return renderPick(); }
    var c = CHARS[p.char];
    var tabs = [['ora', 'Ora'], ['segreto', 'Segreto'], ['personaggio', 'Personaggio'], ['indizi', 'Indizi'], ['regole', 'Regole']];
    if (p.id === 'marco') tabs.splice(2, 0, ['taccuino', 'Taccuino']);
    var h = DRIP + '<div class="phone"><div class="ph-head"><p class="eyebrow">Casa Musagu</p><h1>' + esc(c.name) + '</h1><p class="who">Ciao ' + p.name + ' · ' + esc(c.role) + '</p></div>';
    h += '<div class="alert" role="note"><span class="alert-t">Attenzione</span><p>Ogni personaggio deve mantenere rigorosamente riservata la propria identità per garantire il divertimento e la naturalezza del gioco.</p></div>';
    h += '<div class="tabs" role="tablist">';
    tabs.forEach(function (t) { h += '<button class="btn ghost' + (tab === t[0] ? ' on' : '') + '" type="button" role="tab" aria-selected="' + (tab === t[0]) + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; });
    h += '</div>';

    if (tab === 'ora') {
      var ph = S ? S.phase : 'copertina', info = PHONE_NOW[ph] || ['', ''];
      h += '<div class="panel"><p class="eyebrow">Adesso</p><p class="now-title">' + info[0] + '</p><p>' + info[1] + '</p>';
      if (S && S.timer) h += '<p class="timer-sm" data-timer></p>';
      if (S && S.solution) {
        h += '<div class="clue-card"><span class="tag">L’assassino</span><p class="kill">' + esc(S.solution.name) + '</p>' + (S.solution.html || '') + '</div>';
      }
      h += '</div>';
      if (S && S.clues && S.clues.length) h += '<p class="note">Indizi trovati finora: ' + S.clues.length + ' su 10. Li trovi nella scheda “Indizi”.</p>';
      if (netErr) h += '<p class="note" style="color:var(--blood)">Connessione assente: riprovo da solo.</p>';
    } else if (tab === 'segreto') {
      if (!secretOpen) {
        h += '<div class="panel lock">' + LOCK + '<p class="now-title" style="font-size:24px">La tua scheda segreta</p><p class="note">Controlla che nessuno guardi lo schermo.</p><button class="btn" type="button" data-open-secret>Leggi la mia scheda</button></div>';
      } else {
        h += '<div class="panel"><p class="eyebrow">Solo per ' + p.name + '</p><h2>' + esc(c.name) + '</h2>' + (secretHtml || '<p class="note">Carico la scheda…</p>') + '<button class="btn ghost" type="button" data-close-secret>Nascondi la scheda</button></div>';
      }
    } else if (tab === 'taccuino') {
      h += notebook();
    } else if (tab === 'personaggio') {
      h += '<div class="panel profile"><p class="eyebrow">Il tuo personaggio · pubblico</p><h2>' + esc(c.name) + '</h2><p class="who" style="color:var(--gold);font-style:italic">' + esc(c.role) + '</p><p>' + esc(c.desc) + '</p><div class="block"><span class="tag">Costume e trucco</span><p>' + esc(c.look) + '</p></div><p class="quote">«' + esc(c.quote) + '»</p></div>';
      h += '<div class="panel"><p class="eyebrow">Gli altri a tavola</p>';
      CAST_ORDER.forEach(function (k) { if (k === p.char) return; var o = CHARS[k]; h += '<div class="clue-card"><h3>' + esc(o.name) + '</h3><p class="room">' + esc(o.role) + ' · ' + o.player + '</p><p style="font-size:17px">' + esc(o.desc) + '</p></div>'; });
      h += '</div>';
    } else if (tab === 'indizi') {
      h += '<div class="panel"><p class="eyebrow">Indizi trovati</p>';
      if (!S || !S.clues || !S.clues.length) h += '<p class="note">Nessun indizio ancora. Si comincia dopo l’antipasto, in camera da letto.</p>';
      else S.clues.slice().sort(function (a, b) { return a.n - b.n; }).forEach(function (k) { var m = clueMeta(k.n); h += '<div class="clue-card"><span class="tag">Indizio ' + k.n + '</span><h3>' + m.title + '</h3><p class="room">' + m.room + '</p>' + k.html + '</div>'; });
      h += '</div>';
    } else if (tab === 'regole') {
      h += '<div class="panel"><p class="eyebrow">Le regole</p><div class="block"><ul>' + RULES.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div></div>';
    }
    h += '</div>' + holdChange();
    app.innerHTML = h;
    if (tab === 'taccuino') bindNotebook();
  }
  function notebook() {
    var sus = ['Beatrice', 'Leone', 'Vicky', 'Lupo', 'Gaspare'];
    var h = '<div class="panel"><p class="eyebrow">Il taccuino dell’ispettore</p><p class="note">Le note restano solo su questo telefono.</p><div class="notebook"><table><thead><tr><th>Ora</th>';
    sus.forEach(function (s) { h += '<th>' + s + '</th>'; });
    h += '</tr></thead><tbody>';
    for (var m = 0; m <= 50; m += 5) {
      var t = '20:' + (m < 10 ? '0' : '') + m;
      h += '<tr><td class="t">' + t + '</td>';
      sus.forEach(function (s, i) { var id = 'nb-' + m + '-' + i; h += '<td><textarea id="' + id + '" aria-label="' + s + ' alle ' + t + '">' + esc(lsGet('casa-musagu:' + id) || '') + '</textarea></td>'; });
      h += '</tr>';
    }
    h += '</tbody></table></div><label class="tag" for="nb-free">Appunti liberi</label><div class="notebook"><textarea id="nb-free" style="min-height:140px" aria-label="Appunti liberi">' + esc(lsGet('casa-musagu:nb-free') || '') + '</textarea></div></div>';
    return h;
  }
  function bindNotebook() {
    var tas = document.querySelectorAll('.notebook textarea');
    for (var i = 0; i < tas.length; i++) tas[i].addEventListener('input', function (e) { lsSet('casa-musagu:' + e.target.id, e.target.value); });
  }
  function holdChange() {
    return '<div class="change"><button class="hold" type="button" data-hold>Non sei tu? Tieni premuto 3 secondi<i></i></button></div>';
  }

  /* ---------- Regia ---------- */
  var solArm = false;
  function renderRegia() {
    document.body.className = '';
    if (!S) { app.innerHTML = '<div class="regia"><p class="note">Collegamento alla serata…</p></div>'; return; }
    var cur = PHASES[phaseIndex(S.phase)];
    var onTv = cur.label + (S.overlay === 'clue' ? ' + Indizio ' + S.clue : S.overlay === 'board' ? ' + Bacheca indizi' : S.overlay === 'verita' ? ' + Domanda di Verità' : '');
    var dotc = netErr ? 'bad' : (S.sync === 'redis' ? '' : 'warn');
    var h = '<div class="regia"><div class="rg-head"><div><p class="eyebrow">Regia · iPad</p><h1>Casa Musagu</h1></div><div class="status"><span class="dot ' + dotc + '"></span>' +
      (netErr ? 'Connessione persa: riprovo' : S.sync === 'redis' ? 'Sincronizzato' : 'Sincronizzazione non configurata: vedi istruzioni') + '<br>Sulla TV ora: <b>' + esc(onTv) + '</b></div></div>';

    h += '<div class="rg-grid"><div style="display:flex;flex-direction:column;gap:18px">';
    h += '<div class="rg-box"><h2>Fasi della serata</h2><div class="row"><button class="btn ghost" type="button" data-step="-1">‹ Indietro</button><button class="btn grow" type="button" data-step="1">Avanti ›</button></div><div class="phases">';
    PHASES.forEach(function (p) { h += '<button class="btn' + (p.id === S.phase ? ' on' : '') + '" type="button" data-phase="' + p.id + '">' + p.label + '<small>' + p.hint + '</small></button>'; });
    h += '</div></div>';

    h += '<div class="rg-box"><h2>Indizi da mostrare sulla TV</h2><p class="note">Tocca un indizio quando qualcuno lo trova: compare in grande sulla TV e finisce nella bacheca. Le buste sigillate mostrano qui solo il titolo.</p><div class="clue-btns">';
    var lastRoom = '';
    CLUES.forEach(function (c) {
      if (c.room !== lastRoom) { h += '<p class="clue-room">' + c.room + '</p>'; lastRoom = c.room; }
      var f = S.found.indexOf(c.n) >= 0;
      h += '<div class="clue-btn"><button class="btn' + (f ? ' found' : '') + '" type="button" data-clue="' + c.n + '">' + (f ? '✓ ' : '') + c.n + ' · ' + c.title + (c.sealed ? ' (sigillata)' : '') + '</button>' +
        (f ? '<button class="btn ghost x" type="button" data-unfind="' + c.n + '" aria-label="Togli l’indizio ' + c.n + ' dai trovati">×</button>' : '') + '</div>';
    });
    h += '</div></div></div>';

    h += '<div style="display:flex;flex-direction:column;gap:18px">';
    h += '<div class="rg-box"><h2>Sovrimpressioni</h2><div class="row"><button class="btn ghost grow" type="button" data-close-ov' + (S.overlay ? '' : ' disabled') + '>Torna alla fase</button><button class="btn ghost grow" type="button" data-board>Bacheca indizi</button></div>' +
      '<div class="row"><button class="btn grow" type="button" data-verita' + (S.verita >= 3 ? ' disabled' : '') + '>Domanda di Verità (' + S.verita + '/3)</button><button class="btn ghost" type="button" data-verita-undo' + (S.verita ? '' : ' disabled') + '>−1</button></div></div>';
    var mu = S.music || { on: true, vol: 70 }, MM = window.MusagMusic, tk = trackFor(S);
    var tl = MM && MM.tracks[tk] ? MM.tracks[tk].label : tk;
    h += '<div class="rg-box"><h2>Musica sulla TV</h2><p class="status">' + (mu.on ? 'In riproduzione: <b>' + esc(tl) + '</b>' : 'Musica spenta') + '</p><p class="note">Cambia da sola a ogni fase. Ogni indizio mostrato ha il suo colpo di scena sonoro.</p>' +
      '<div class="row"><button class="btn' + (mu.on ? ' ghost' : '') + ' grow" type="button" data-music>' + (mu.on ? 'Spegni la musica' : 'Accendi la musica') + '</button>' +
      '<button class="btn ghost" type="button" data-vol="-10" aria-label="Abbassa il volume"' + (mu.vol <= 0 ? ' disabled' : '') + '>−</button><span class="big-timer" style="font-size:22px;min-width:64px;text-align:center">' + mu.vol + '%</span><button class="btn ghost" type="button" data-vol="10" aria-label="Alza il volume"' + (mu.vol >= 100 ? ' disabled' : '') + '>+</button></div></div>';
    h += '<div class="rg-box"><h2>Timer</h2><p class="big-timer" data-timer></p>' + (S.timer ? '' : '<p class="note">Nessun timer attivo.</p>') +
      '<div class="row"><button class="btn grow" type="button" data-timer-start="10">10 minuti</button><button class="btn grow" type="button" data-timer-start="5">5 minuti</button></div>' +
      '<div class="row"><button class="btn ghost grow" type="button" data-timer-add' + (S.timer ? '' : ' disabled') + '>+1 minuto</button><button class="btn ghost grow" type="button" data-timer-stop' + (S.timer ? '' : ' disabled') + '>Ferma</button></div></div>';
    var st = S.phase === 'soluzione' ? S.solStep : -1;
    h += '<div class="rg-box"><h2>La soluzione</h2><p class="note">Sulla TV, in tre tempi. Qui non viene mai mostrata.</p>' +
      '<button class="btn ghost" type="button" data-sol="0">1 · Schermata d’attesa “L’assassino è…”</button>' +
      '<button class="btn" type="button" data-sol="1"' + (st < 0 ? ' disabled' : '') + '>' + (solArm ? 'Tocca di nuovo per svelare il nome' : '2 · Svela il nome') + '</button>' +
      '<button class="btn" type="button" data-sol="2"' + (st < 1 ? ' disabled' : '') + '>3 · Mostra la spiegazione</button></div>';
    h += '<div class="rg-box"><h2>Nuova partita</h2><p class="note">Azzera fasi, indizi trovati e timer. Fallo prima che arrivino gli ospiti.</p><button class="hold" type="button" data-hold-reset>Tieni premuto 3 secondi per azzerare<i></i></button></div>';
    h += '</div></div></div>' + holdChange();
    app.innerHTML = h;
  }

  /* ---------- TV ---------- */
  function renderTV() {
    document.body.className = '';
    var h = '<div class="tv"><div class="frame"></div>';
    if (!tvStarted) {
      h += '<div class="start">' + MOON + '<p class="t-title">Schermo TV</p><button class="btn" type="button" data-tv-start>Avvia schermo e musica</button><p class="t-sub" style="font-size:1.3vw">Un solo clic: attiva lo schermo intero e l’audio. Da qui in poi comanda l’iPad.</p></div></div>';
      app.innerHTML = h; return;
    }
    if (!S) { app.innerHTML = h + '<div class="stage"><p class="t-sub pulse">Collegamento alla regia…</p></div></div>'; return; }
    h += '<div class="stage">' + tvStage() + '</div>';
    if (S.timer && S.phase.indexOf('perq') !== 0 && ['dolce','soluzione','punteggio'].indexOf(S.phase) < 0) h += '<div class="clock-mini" data-timer></div>';
    if (S.overlay) h += '<div class="overlay">' + tvOverlay() + '</div>';
    if (netErr) h += '<p class="err">Connessione persa, riprovo…</p>';
    h += '</div>';
    app.innerHTML = h;
    syncMusic();
  }
  function tvStage() {
    var ph = S.phase;
    if (ph === 'copertina') return '<div class="cover" style="display:flex;flex-direction:column;align-items:center;gap:2vh">' + MOON + '<p class="t-eyebrow">Cena con delitto · Notte di Halloween</p><h1>Il Mistero di<span>Casa Musagu</span></h1><p class="t-sub">Sabato 31 ottobre · Ore 21:00</p><p class="t-text" style="font-size:1.6vw;color:var(--gold);margin-top:2vh">Aprite il link sul telefono e scegliete chi siete</p></div>';
    if (ph === 'prologo1') return '<p class="t-eyebrow">Prologo · 1 di 3</p><p class="t-text">Ogni anno, la notte di Halloween, Ottavio Musagu riunisce la famiglia per la sua <em>Cena delle Maschere</em>.</p><p class="t-text">Collezionista famoso, sessantotto anni, custodisce in salotto la sua maschera più preziosa: la <strong>Bauta d’oro</strong>, una maschera veneziana del Settecento.</p>';
    if (ph === 'prologo2') return '<p class="t-eyebrow">Prologo · 2 di 3</p><p class="t-text">Stasera, alle 20:00, durante l’aperitivo, Ottavio ha alzato il bicchiere e ha mostrato a tutti una busta chiusa:</p><p class="t-quote">«A mezzanotte aprirò questa busta davanti a voi.<br>Dentro c’è il nome di chi mi tradisce da anni.»</p><p class="t-text">Poi, lamentando un mal di testa, si è ritirato in camera da letto.</p>';
    if (ph === 'prologo3') return '<p class="t-eyebrow">Prologo · 3 di 3</p><p class="t-text">Alle 20:50 un grido attraversa la casa: il Dottor Lupo ha trovato Ottavio morto nel suo letto. In quel momento suona il campanello: è l’Ispettore Falchi, in ritardo per la cena.</p><p class="t-text">La porta era chiusa a chiave dalle 20:00. Nessuno è entrato, nessuno è uscito. La busta di mezzanotte è sparita.</p><p class="t-title red" style="font-size:3.6vw">L’assassino è seduto a questa tavola.</p>';
    if (ph === 'schede') return '<p class="t-eyebrow">Prima di cominciare</p><p class="t-title">Aprite la vostra<br>scheda segreta</p><p class="t-sub">Sul vostro telefono, da soli. Leggetela con calma, poi nascondetela.</p>' + LOCK.replace('viewBox', 'style="width:7vw;height:7vw" viewBox');
    if (ph === 'personaggi') {
      var g = '<p class="t-eyebrow">Le presentazioni · un minuto a testa</p><div class="cast">';
      CAST_ORDER.forEach(function (k) { var c = CHARS[k]; g += '<div class="c' + (c.det ? ' det' : '') + '"><span class="p">' + c.player + '</span><h3>' + esc(c.name) + '</h3><p class="r">' + esc(c.role) + '</p><p class="q">«' + esc(c.quote) + '»</p></div>'; });
      return g + '</div>';
    }
    if (ph === 'regole') return '<p class="t-eyebrow">Da leggere a tutti</p><p class="t-title" style="font-size:3.4vw">Le regole</p><ul class="rules">' + RULES.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>';
    if (COURSE[ph]) { var c2 = COURSE[ph]; return '<p class="t-eyebrow">Si mangia · si indaga</p><p class="t-title">' + c2.name + '</p><p class="t-sub">Dove eravate tra le 20:00 e le 20:50? Chi ha visto chi? Chi mente?</p><p class="t-text" style="font-size:1.8vw;color:var(--gold)">Prossima perquisizione: ' + c2.next + '</p>' + foundLine(); }
    if (PERQ[ph]) {
      var pq = PERQ[ph], t = '<p class="t-eyebrow">' + PHASES[phaseIndex(ph)].label + '</p><p class="t-title">' + pq.rooms + '</p>';
      t += S.timer ? '<p class="clock" data-timer></p>' : '<p class="t-sub">Cercate ovunque. Chi trova un indizio lo legge ad alta voce.</p>';
      t += '<div class="tiles">';
      pq.clues.forEach(function (n) { var f = S.found.indexOf(n) >= 0, m = clueMeta(n); t += '<div class="tile' + (f ? ' found' : '') + '"><span class="n">' + n + '</span><span class="ti">' + (f ? m.title : (m.sealed ? 'Busta sigillata' : 'Da trovare')) + '</span></div>'; });
      return t + '</div>';
    }
    if (ph === 'dolce') return '<p class="t-eyebrow">Al dolce</p><p class="t-title">L’accusa finale</p><p class="t-text" style="font-size:2vw">L’ispettore ricostruisce il delitto. Poi ognuno scrive sul foglietto <strong>chi</strong> ha ucciso Ottavio, <strong>come</strong> e <strong>perché</strong>.</p>' + (S.timer ? '<p class="clock" data-timer></p>' : '');
    if (ph === 'soluzione') {
      if (!S.solution) return '<p class="t-eyebrow">La verità</p><p class="t-title pulse">L’assassino è…</p>';
      var o = '<p class="t-eyebrow">L’assassino è</p><p class="sol-name">' + esc(S.solution.name) + '</p><p class="t-sub">interpretato da ' + esc(S.solution.player) + '</p>';
      if (S.solution.html) o = '<p class="t-eyebrow">L’assassino è</p><p class="sol-name" style="font-size:4.6vw">' + esc(S.solution.name) + '</p><div class="sol-text">' + S.solution.html + '</div>';
      return o;
    }
    if (ph === 'punteggio') { var sc = '<p class="t-eyebrow">Fine della partita</p><p class="t-title" style="font-size:3.6vw">Il punteggio</p><div class="score">'; SCORE.forEach(function (r) { sc += '<div>' + r[0] + '</div><div class="pt">' + r[1] + ' punt' + (r[1] === '1' ? 'o' : 'i') + '</div>'; }); return sc + '</div>'; }
    return '';
  }
  function trackFor(st) {
    if (!st) return 'carillon';
    if (st.overlay === 'verita') return 'verita';
    var p = st.phase;
    if (p === 'copertina') return 'carillon';
    if (p.indexOf('prologo') === 0) return 'prologo';
    if (p === 'schede' || p === 'dolce') return 'tensione';
    if (p === 'personaggi' || p === 'punteggio') return 'valzer';
    if (PERQ[p]) return 'caccia';
    if (p === 'soluzione') return ['attesa', 'rivelazione', 'requiem'][st.solStep] || 'attesa';
    return 'cena';
  }
  var lastSting = null;
  function syncMusic() {
    var M = window.MusagMusic; if (!M || !tvStarted) return;
    var mu = (S && S.music) || { on: true, vol: 70 };
    M.setEnabled(mu.on); M.setVolume(mu.vol / 100);
    M.play(mu.on ? trackFor(S) : null);
    if (S && S.overlay === 'clue') { if (S.clue !== lastSting) { lastSting = S.clue; if (mu.on) M.sting(); } }
    else lastSting = null;
  }
  function foundLine() { return S.found.length ? '<p class="t-sub" style="font-size:1.4vw">Indizi trovati: ' + S.found.length + ' su 10</p>' : ''; }
  function tvOverlay() {
    if (S.overlay === 'clue') {
      var k = null; for (var i = 0; i < S.clues.length; i++) if (S.clues[i].n === S.clue) k = S.clues[i];
      var m = clueMeta(S.clue); if (!k || !m) return '';
      return '<div class="clue-big"><div class="hd"><span>Indizio n. ' + m.n + '</span><span>' + m.room + '</span></div><h2>' + m.title + '</h2><div class="bd">' + k.html + '</div><span class="num">' + m.n + '</span></div>';
    }
    if (S.overlay === 'board') {
      if (!S.clues.length) return '<div class="stage" style="position:static"><p class="t-title" style="font-size:3vw">Bacheca indizi</p><p class="t-sub">Nessun indizio trovato.</p></div>';
      var b = '<div style="display:flex;flex-direction:column;align-items:center;gap:2vh;width:100%"><p class="t-eyebrow">Bacheca indizi · ' + S.clues.length + ' su 10</p><div class="board">';
      S.clues.slice().sort(function (a, c) { return a.n - c.n; }).forEach(function (k2) { var m2 = clueMeta(k2.n); b += '<div class="b"><h4>' + k2.n + ' · ' + m2.title + '</h4><div class="bd">' + k2.html + '</div></div>'; });
      return b + '</div></div>';
    }
    if (S.overlay === 'verita') return '<div style="display:flex;flex-direction:column;align-items:center;gap:3vh;text-align:center"><p class="t-eyebrow">L’ispettore Falchi chiede</p><p class="t-title red">Domanda di Verità</p><p class="t-text">Una domanda, una risposta: sì o no. Chi risponde deve dire la verità, anche l’assassino.</p><p class="t-sub">Domanda ' + S.verita + ' di 3</p></div>';
    return '';
  }

  /* ================= Eventi ================= */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var d = t.dataset;
    if (d.pick) { pending = d.pick; render(); return; }
    if ('back' in d) { pending = null; render(); return; }
    if ('enter' in d) { entered = true; pickMusic(true); render(); return; }
    if ('mute' in d) { pickMuted = !pickMuted; if (window.MusagMusic) window.MusagMusic.setEnabled(!pickMuted); render(); return; }
    if ('confirm' in d) { role = pending; pending = null; lsSet(LS_ROLE, role); if (role !== 'tv') pickMusic(false); boot(); return; }
    if (d.tab) { tab = d.tab; secretOpen = false; render(); window.scrollTo(0, 0); return; }
    if ('openSecret' in d) {
      secretOpen = true; render();
      var p = personOf(role);
      fetch('/api/me?char=' + encodeURIComponent(p.char), { cache: 'no-store' }).then(function (r) { return r.json(); })
        .then(function (j) { secretHtml = j.html || '<p class="note">Scheda non trovata.</p>'; if (secretOpen) render(); })
        .catch(function () { secretHtml = '<p class="note">Non riesco a caricare la scheda: controlla la connessione e riprova.</p>'; render(); });
      return;
    }
    if ('closeSecret' in d) { secretOpen = false; render(); return; }
    if ('tvStart' in d) {
      tvStarted = true;
      try { if (window.MusagMusic) window.MusagMusic.start(); } catch (err) {}
      var el = document.documentElement;
      try { (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el); } catch (err) {}
      try { if (navigator.wakeLock) navigator.wakeLock.request('screen').catch(function () {}); } catch (err) {}
      render(); return;
    }
    // Regia
    if (d.step) { var i = phaseIndex(S.phase) + Number(d.step); if (i >= 0 && i < PHASES.length) act({ action: 'phase', phase: PHASES[i].id }); return; }
    if (d.phase) { act({ action: 'phase', phase: d.phase }); return; }
    if (d.clue) { act({ action: 'clue', n: Number(d.clue) }); return; }
    if (d.unfind) { act({ action: 'unfind', n: Number(d.unfind) }); return; }
    if ('closeOv' in d) { act({ action: 'close' }); return; }
    if ('board' in d) { act({ action: 'board' }); return; }
    if ('verita' in d) { act({ action: 'verita' }); return; }
    if ('veritaUndo' in d) { act({ action: 'veritaUndo' }); return; }
    if ('music' in d) { act({ action: 'music', on: !(S.music ? S.music.on : true) }); return; }
    if (d.vol) { act({ action: 'vol', delta: Number(d.vol) }); return; }
    if (d.timerStart) { act({ action: 'timer', minutes: Number(d.timerStart) }); return; }
    if ('timerAdd' in d) { act({ action: 'timerAdd' }); return; }
    if ('timerStop' in d) { act({ action: 'timerStop' }); return; }
    if (d.sol !== undefined) {
      var step = Number(d.sol);
      if (step === 1 && !solArm) { solArm = true; render(); setTimeout(function () { solArm = false; if (role === 'regia') render(); }, 4000); return; }
      solArm = false; act({ action: 'sol', step: step }); return;
    }
  });

  // Pressione prolungata (cambio identità, azzeramento)
  var holdT = null;
  function holdStart(e) {
    var t = e.target.closest('[data-hold],[data-hold-reset]'); if (!t) return;
    e.preventDefault(); t.classList.add('holding');
    holdT = setTimeout(function () {
      t.classList.remove('holding');
      if ('holdReset' in t.dataset) { act({ action: 'reset' }); return; }
      lsDel(LS_ROLE); role = null; tab = 'ora'; secretOpen = false; secretHtml = null; tvStarted = false;
      if (entered) pickMusic(true);
      if (pollT) clearTimeout(pollT); render();
    }, 3000);
  }
  function holdEnd() { if (holdT) { clearTimeout(holdT); holdT = null; } var h = document.querySelectorAll('.holding'); for (var i = 0; i < h.length; i++) h[i].classList.remove('holding'); }
  document.addEventListener('pointerdown', holdStart);
  document.addEventListener('pointerup', holdEnd);
  document.addEventListener('pointercancel', holdEnd);
  document.addEventListener('pointerleave', holdEnd);
  document.addEventListener('contextmenu', function (e) { if (e.target.closest('.hold')) e.preventDefault(); });

  // La scheda segreta si richiude quando il telefono va in background
  document.addEventListener('visibilitychange', function () { if (document.hidden && secretOpen) { secretOpen = false; render(); } });

  function boot() {
    if (pollT) clearTimeout(pollT);
    render();
    if (!role) return;
    if (role === 'tv') startPolling(1500, false);
    else if (role === 'regia') startPolling(3000, false);
    else startPolling(6000, true);
  }
  boot();
})();
