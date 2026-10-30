/* Colonna sonora di Casa Musagu: musica generata dal vivo con Web Audio.
   Nessun file audio e nessun diritto d'autore: ogni brano è scritto qui sotto, nota per nota. */
(function () {
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master = null, bus = null, rev = null, noiseBuf = null;
  var active = [], timer = null, volume = 0.7, enabled = true, currentName = null;

  var NAMES = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  function hz(n) {
    if (typeof n === 'number') return n;
    var m = /^([A-G][b#]?)(-?\d)$/.exec(n);
    return 440 * Math.pow(2, ((Number(m[2]) + 1) * 12 + NAMES[m[1]] - 69) / 12);
  }

  function init() {
    ctx = new AC();
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    master = ctx.createGain(); master.gain.value = enabled ? volume : 0;
    master.connect(comp); comp.connect(ctx.destination);
    bus = ctx.createGain(); bus.connect(master);
    rev = ctx.createConvolver(); rev.buffer = impulse(3.8, 2.6);
    var rg = ctx.createGain(); rg.gain.value = 0.42; rev.connect(rg); rg.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  function impulse(sec, decay) {
    var len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }

  /* ---------- Strumenti ---------- */
  function voiceOut(out, wet) {
    var g = ctx.createGain(); g.connect(out.dry);
    if (wet) { var s = ctx.createGain(); s.gain.value = wet; g.connect(s); s.connect(out.wet); }
    return g;
  }
  function decayEnv(g, t, peak, dec, att) {
    att = att || 0.005;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + att + dec);
  }
  function osc(type, f, t, stop, dest) {
    var o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.connect(dest); o.start(t); o.stop(stop); return o;
  }
  // Carillon / celesta
  function musicbox(out, t, n, v) {
    var f = hz(n), parts = [[1, 1], [3, 0.22], [5.4, 0.09]];
    parts.forEach(function (p) { var g = voiceOut(out, 0.7); decayEnv(g, t, v * p[1], 1.9 / p[0] + 0.3); osc('sine', f * p[0], t, t + 2.6, g); });
  }
  // Clavicembalo / pizzicato
  function pluck(out, t, n, v, dec) {
    var f = hz(n), g = voiceOut(out, 0.35), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(4200, t); lp.frequency.exponentialRampToValueAtTime(500, t + (dec || 0.3));
    lp.connect(g); decayEnv(g, t, v, dec || 0.3);
    osc('sawtooth', f, t, t + (dec || 0.3) + 0.1, lp);
  }
  function piano(out, t, n, v, dec) {
    var f = hz(n), g = voiceOut(out, 0.5); decayEnv(g, t, v, dec || 2.4, 0.004);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.connect(g);
    osc('triangle', f, t, t + (dec || 2.4) + 0.1, lp);
    var g2 = voiceOut(out, 0.5); decayEnv(g2, t, v * 0.3, (dec || 2.4) * 0.5); osc('sine', f * 2, t, t + (dec || 2.4), g2);
  }
  function pad(out, t, notes, dur, v, cutoff) {
    notes.forEach(function (n) {
      var f = hz(n), g = voiceOut(out, 0.9), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = cutoff || 900; lp.connect(g);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + Math.min(1.8, dur / 3));
      g.gain.setValueAtTime(v, t + dur - Math.min(1.8, dur / 3)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      [-7, 7].forEach(function (c) { var o = osc('sawtooth', f, t, t + dur + 0.05, lp); o.detune.value = c; });
    });
  }
  function organ(out, t, notes, dur, v) {
    notes.forEach(function (n) {
      var f = hz(n);
      [[1, 0.6], [2, 0.3], [3, 0.16], [4, 0.1], [0.5, 0.25]].forEach(function (p) {
        var g = voiceOut(out, 0.9);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * p[1], t + 0.08);
        g.gain.setValueAtTime(v * p[1], t + dur - 0.6); g.gain.linearRampToValueAtTime(0.0001, t + dur);
        osc('sine', f * p[0], t, t + dur + 0.05, g);
      });
    });
  }
  function drone(out, t, n, dur, v, toN) {
    var f = hz(n), g = voiceOut(out, 0.8), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 380; lp.Q.value = 3; lp.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 2.5);
    g.gain.setValueAtTime(v, t + dur - 2.5); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    [1, 1.004, 0.5].forEach(function (m, i) {
      var o = osc(i === 2 ? 'sine' : 'sawtooth', f * m, t, t + dur + 0.05, lp);
      if (toN) o.frequency.exponentialRampToValueAtTime(hz(toN) * m, t + dur);
    });
  }
  function noise(out, t, dur, v, type, freq, wet) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = type || 'highpass'; f.frequency.value = freq || 3000;
    var g = voiceOut(out, wet || 0); s.connect(f); f.connect(g);
    s.start(t); s.stop(t + dur + 0.05); return g;
  }
  function tick(out, t, v, hi) { var g = noise(out, t, 0.04, v, 'bandpass', hi ? 3800 : 2400, 0.3); decayEnv(g, t, v, 0.035, 0.001); }
  function heart(out, t, v) {
    [0, 0.24].forEach(function (d, i) {
      var g = voiceOut(out, 0.15), tt = t + d; decayEnv(g, tt, v * (i ? 0.7 : 1), 0.16, 0.004);
      var o = osc('sine', 75, tt, tt + 0.25, g); o.frequency.exponentialRampToValueAtTime(38, tt + 0.16);
    });
  }
  function boom(out, t, v) {
    var g = voiceOut(out, 0.6); decayEnv(g, t, v, 2.2, 0.01);
    var o = osc('sine', 90, t, t + 2.4, g); o.frequency.exponentialRampToValueAtTime(28, t + 1.8);
    var n = noise(out, t, 1.2, v, 'lowpass', 260, 0.6); decayEnv(n, t, v * 0.8, 1.0, 0.01);
  }
  function bell(out, t, n, v) {
    var f = hz(n);
    [[1, 1, 4], [2.76, 0.4, 2.5], [5.4, 0.22, 1.6], [8.9, 0.1, 1]].forEach(function (p) {
      var g = voiceOut(out, 0.9); decayEnv(g, t, v * p[1], p[2], 0.003); osc('sine', f * p[0], t, t + p[2] + 0.2, g);
    });
  }
  function wind(out, t, dur, v) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 6;
    bp.frequency.setValueAtTime(300, t); bp.frequency.linearRampToValueAtTime(900, t + dur / 2); bp.frequency.linearRampToValueAtTime(250, t + dur);
    var g = voiceOut(out, 0.5); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + dur / 2); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    s.connect(bp); bp.connect(g); s.start(t); s.stop(t + dur + 0.05);
  }

  /* ---------- Brani ---------- */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var TRACKS = {
    // Copertina e scelta del personaggio: carillon stregato in re minore, tempo di valzer
    carillon: {
      label: 'Il carillon di Ottavio', bpm: 84, spb: 1,
      mel: ['D5', 'F5', 'A5', 'G5', 'F5', 'E5', 'F5', 'D5', 'A4', 'C#5', 'E5', 'A4', 'D5', 'F5', 'A5', 'Bb5', 'A5', 'G5', 'F5', 'E5', 'C#5', 'D5', null, null],
      bass: ['D3', 'C3', 'Bb2', 'A2', 'D3', 'G2', 'A2', 'D3'],
      step: function (o, i, t, b) {
        var k = i % 24, n = this.mel[k];
        if (n) musicbox(o, t, n, 0.32);
        if (k % 3 === 0) piano(o, t, this.bass[k / 3], 0.14, 2.2);
        if (i % 48 === 0) drone(o, t, 'D2', 48 * b, 0.05);
        if (i % 96 === 24) wind(o, t, 14, 0.05);
      }
    },
    // Prologo: archi scuri, vento, note sparse di pianoforte
    prologo: {
      label: 'La notte della cena', bpm: 60, spb: 1,
      ch: [['D2', 'D3', 'F3', 'A3'], ['Bb1', 'Bb2', 'D3', 'F3'], ['G1', 'G2', 'Bb2', 'D3'], ['A1', 'A2', 'C#3', 'E3']],
      step: function (o, i, t, b) {
        var c = this.ch[Math.floor(i / 8) % 4];
        if (i % 8 === 0) { drone(o, t, c[0], 8.6 * b, 0.07); pad(o, t, c.slice(1), 8.6 * b, 0.035, 700); }
        if (i % 8 === 3 || i % 8 === 6) piano(o, t, c[1 + (i % 3)].replace(/\d/, function (d) { return String(Number(d) + 2); }), 0.13, 3);
        if (i % 32 === 0) wind(o, t, 16, 0.06);
      }
    },
    // Schede segrete e accusa: orologio, battito, tensione
    tensione: {
      label: 'L’orologio della camera', bpm: 60, spb: 2,
      step: function (o, i, t, b) {
        if (i % 2 === 0) tick(o, t, 0.22, (i / 2) % 2 === 0);
        if (i % 8 === 0) heart(o, t, 0.4);
        if (i % 32 === 0) { drone(o, t, 'D2', 16.5 * b, 0.06); pad(o, t, ['D3', 'Eb3', 'A3'], 16.5 * b, 0.025, 600); }
        if (i % 64 === 40) bell(o, t, 'A5', 0.06);
      }
    },
    // Presentazioni e punteggio: danza macabra al clavicembalo
    valzer: {
      label: 'Danza delle maschere', bpm: 132, spb: 1,
      prog: [['A2', ['A3', 'C4', 'E4']], ['E2', ['G#3', 'B3', 'E4']], ['A2', ['A3', 'C4', 'E4']], ['E2', ['G#3', 'B3', 'D4']], ['F2', ['A3', 'C4', 'F4']], ['C3', ['G3', 'C4', 'E4']], ['D2', ['F3', 'A3', 'D4']], ['E2', ['G#3', 'B3', 'E4']]],
      mel: ['A4', 'C5', 'E5', 'G#4', 'B4', 'E5', 'A4', 'C5', 'E5', 'B4', null, null, 'A4', 'C5', 'F5', 'G4', 'C5', 'E5', 'F4', 'A4', 'D5', 'E5', 'D5', 'B4'],
      step: function (o, i, t) {
        var k = i % 24, bar = this.prog[Math.floor(k / 3)];
        if (k % 3 === 0) pluck(o, t, bar[0], 0.22, 0.5);
        else bar[1].forEach(function (n) { pluck(o, t, n, 0.06, 0.22); });
        var m = this.mel[k]; if (m && i >= 24) { pluck(o, t, m, 0.16, 0.4); if (i >= 48) musicbox(o, t, m.replace(/\d/, function (d) { return String(Number(d) + 1); }), 0.07); }
      }
    },
    // Cena: pianoforte da salotto, morbido sotto le chiacchiere
    cena: {
      label: 'Cena a lume di candela', bpm: 66, spb: 2,
      ch: [['A2', 'E3', 'G3', 'B3', 'C4', 'E4'], ['F2', 'C3', 'E3', 'A3', 'C4', 'G4'], ['D2', 'A2', 'C3', 'F3', 'A3', 'E4'], ['E2', 'B2', 'D3', 'G#3', 'B3', 'F4']],
      step: function (o, i, t, b) {
        var c = this.ch[Math.floor(i / 8) % 4], k = i % 8;
        if (k === 0) { piano(o, t, c[0], 0.2, 3.5); pad(o, t, c.slice(2, 5), 4.2 * b, 0.018, 800); }
        else piano(o, t, c[1 + ((k - 1) % 5)], 0.1, 1.8);
        if (i % 32 === 6) musicbox(o, t, pick(['E5', 'A5', 'C6']), 0.07);
      }
    },
    // Perquisizioni: ostinato di archi pizzicati, battito, ticchettio
    caccia: {
      label: 'La perquisizione', bpm: 112, spb: 4,
      pat: ['D3', 'F3', 'A3', 'F3', 'D3', 'F3', 'A3', 'F3', 'Eb3', 'G3', 'Bb3', 'G3', 'D3', 'F3', 'A3', 'C#4', 'Bb2', 'D3', 'F3', 'D3', 'Bb2', 'D3', 'F3', 'D3', 'A2', 'C#3', 'E3', 'G3', 'A2', 'C#3', 'E3', 'A3'],
      step: function (o, i, t, b) {
        pluck(o, t, this.pat[i % 32], i % 4 === 0 ? 0.2 : 0.12, 0.13);
        if (i % 8 === 0) heart(o, t, 0.32);
        if (i % 4 === 2) tick(o, t, 0.08, true);
        if (i % 64 === 0) drone(o, t, 'D2', 16.2 * b, 0.06);
        if (i % 128 === 96) pad(o, t, ['D4', 'Eb4', 'A4'], 8 * b, 0.02, 1400);
      }
    },
    // Domanda di Verità: rintocchi di campana
    verita: {
      label: 'La Domanda di Verità', bpm: 40, spb: 1,
      step: function (o, i, t, b) {
        if (i % 2 === 0) bell(o, t, i % 8 === 6 ? 'A2' : 'D3', 0.34);
        if (i % 8 === 0) drone(o, t, 'D2', 8.3 * b, 0.06);
        if (i % 2 === 1) heart(o, t, 0.22);
      }
    },
    // Attesa della soluzione: battito che accelera, nota che sale
    attesa: {
      label: 'L’attesa', bpm: 66, spb: 1,
      start: function (o, t) { drone(o, t, 'D2', 60, 0.08, 'D3'); pad(o, t, ['D3', 'Ab3'], 60, 0.02, 500); },
      step: function (o, i, t) {
        var v = Math.min(0.6, 0.25 + i * 0.008); heart(o, t, v);
        if (i > 20) tick(o, t + 0.45, 0.12, true);
        if (i > 40 && i % 2 === 0) tick(o, t + 0.2, 0.1, false);
      }
    },
    // Il nome: colpo e organo
    rivelazione: {
      label: 'La rivelazione', bpm: 30, spb: 1,
      start: function (o, t) { boom(o, t, 0.7); organ(o, t, ['D2', 'D3', 'F3', 'A3', 'D4'], 7, 0.07); },
      ch: [['D3', 'F3', 'A3'], ['G2', 'Bb2', 'D3'], ['A2', 'C#3', 'E3'], ['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['G2', 'Bb2', 'D3'], ['A2', 'C#3', 'E3'], ['D3', 'F#3', 'A3']],
      step: function (o, i, t, b) { if (i >= 4 && i % 2 === 0) organ(o, t, this.ch[((i - 4) / 2) % 8], 2.2 * b, 0.045); }
    },
    // La spiegazione: corale d'organo con campane
    requiem: {
      label: 'Requiem per Ottavio', bpm: 30, spb: 1,
      ch: [['D3', 'F3', 'A3'], ['G2', 'Bb2', 'D3'], ['A2', 'C#3', 'E3'], ['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['G2', 'Bb2', 'D3'], ['A2', 'C#3', 'E3'], ['D3', 'F#3', 'A3']],
      step: function (o, i, t, b) {
        if (i % 2 === 0) organ(o, t, this.ch[(i / 2) % 8], 2.2 * b, 0.035);
        if (i % 16 === 0) bell(o, t, 'D4', 0.08);
      }
    }
  };

  /* ---------- Motore ---------- */
  function startTrack(name) {
    var tr = TRACKS[name]; if (!tr) return;
    var dry = ctx.createGain(), wet = ctx.createGain(), wg = ctx.createGain(), t0 = ctx.currentTime + 0.1;
    dry.connect(bus); wet.connect(wg); wg.connect(rev);
    [dry.gain, wg.gain].forEach(function (g) { g.setValueAtTime(0.0001, ctx.currentTime); g.linearRampToValueAtTime(1, t0 + 1.5); });
    var o = { name: name, tr: tr, dry: dry, wet: wet, fadeWet: wg, next: t0, i: 0, stopAt: null };
    if (tr.start) tr.start(o, t0);
    active.push(o);
  }
  function stopTrack(o, fade) {
    var t = ctx.currentTime; o.stopAt = t + fade;
    [o.dry.gain, o.fadeWet.gain].forEach(function (g) { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + fade); });
    setTimeout(function () { try { o.dry.disconnect(); o.fadeWet.disconnect(); } catch (e) {} }, (fade + 5) * 1000);
  }
  function loop() {
    if (!ctx) return;
    var horizon = ctx.currentTime + 0.2;
    active = active.filter(function (o) { return !(o.stopAt && ctx.currentTime > o.stopAt + 0.1); });
    active.forEach(function (o) {
      if (o.stopAt) return;
      var beat = 60 / o.tr.bpm, step = beat / o.tr.spb;
      while (o.next < horizon) { o.tr.step(o, o.i, o.next, beat); o.next += step; o.i++; }
    });
  }

  window.MusagMusic = {
    tracks: TRACKS,
    start: function () {
      if (!AC) return false;
      if (!ctx) init();
      if (ctx.state === 'suspended') ctx.resume();
      if (!timer) timer = setInterval(loop, 40);
      return true;
    },
    ready: function () { return !!ctx && ctx.state === 'running'; },
    play: function (name) {
      if (!ctx || name === currentName) return;
      currentName = name;
      active.forEach(function (o) { if (!o.stopAt) stopTrack(o, 2); });
      if (name) startTrack(name);
    },
    current: function () { return currentName; },
    sting: function () {
      if (!ctx || !enabled) return;
      var t = ctx.currentTime + 0.02, o = { dry: master, wet: rev };
      bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(bus.gain.value, t);
      bus.gain.linearRampToValueAtTime(0.35, t + 0.1); bus.gain.setValueAtTime(0.35, t + 2.2); bus.gain.linearRampToValueAtTime(1, t + 3.5);
      boom(o, t, 0.45); pad(o, t, ['D4', 'Eb4', 'Ab4'], 2.4, 0.03, 2200); bell(o, t + 0.05, 'D5', 0.12);
    },
    setVolume: function (v) { volume = Math.max(0, Math.min(1, v)); if (master && enabled) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.2); },
    setEnabled: function (b) { enabled = !!b; if (master) master.gain.setTargetAtTime(enabled ? volume : 0, ctx.currentTime, 0.3); }
  };
})();
