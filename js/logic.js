/* Logica pura del juego (sin DOM) para poder probarla con Node.
   Se usa en el navegador como window.FLAGLogic y en Node con require. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FLAGLogic = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Una ronda: 10 preguntas del banco, en orden aleatorio y con opciones barajadas. */
  function buildRound(bank, rng, n) {
    const size = n || 10;
    return shuffle(bank, rng).slice(0, size).map(function (q) {
      const idx = shuffle([0, 1, 2, 3], rng);
      return {
        id: q.id, room: q.room, text: q.text, concept: q.concept, source: q.source,
        options: idx.map(function (i) { return q.options[i]; }),
        correct: idx.indexOf(q.correct)
      };
    });
  }

  /* Supuesto propio: el articulo muestra un temporizador pero no publica el limite por nivel. */
  function timeLimit(level) {
    if (level === 'facil') return 45;
    if (level === 'intermedio') return 20;
    throw new Error('Nivel desconocido: ' + level);
  }

  function summarize(answers) {
    let correct = 0, errors = 0, unanswered = 0;
    answers.forEach(function (a) {
      if (a.chosen === null || a.chosen === undefined) unanswered++;
      else if (a.chosen === a.correct) correct++;
      else errors++;
    });
    return { correct: correct, errors: errors, unanswered: unanswered, total: answers.length };
  }

  /* "Hígado de Acero" para 9 aciertos es el unico titulo publicado (Fig. 8a). Los otros son propios. */
  function achievement(correct, total) {
    const ratio = total ? correct / total : 0;
    if (ratio >= 0.9) return { title: 'Hígado de Acero', text: 'Excelente inicio de soldado' };
    if (ratio >= 0.6) return { title: 'Hígado Firme', text: 'Vas por buen camino, soldado' };
    return { title: 'Recluta en entrenamiento', text: 'Repasa los conceptos y vuelve a la misión' };
  }

  function insertScore(board, entry, max) {
    const list = board.concat([entry]);
    list.sort(function (a, b) { return b.points - a.points || a.seconds - b.seconds; });
    return list.slice(0, max || 3);
  }

  /* Minijuego "Recolector de comida saludable": pista determinista por semilla. */
  const HEALTHY = ['🍎', '🥦', '🍌', '🥕', '🍇', '🍓'];
  const HARMFUL = ['🍔', '🍟', '🍺', '🍩'];

  function generateTrack(seed) {
    const rng = mulberry32(seed);
    const items = [];
    let x = 300;
    const length = 3000;
    while (x < length - 200) {
      const healthy = rng() < 0.55;
      const pool = healthy ? HEALTHY : HARMFUL;
      items.push({
        x: Math.round(x),
        lane: Math.floor(rng() * 3),
        healthy: healthy,
        emoji: pool[Math.floor(rng() * pool.length)]
      });
      x += 120 + Math.floor(rng() * 80);
    }
    return { length: length, items: items };
  }

  function collides(heart, item, radius) {
    return heart.lane === item.lane && Math.abs(heart.x - item.x) <= radius;
  }

  function applyItem(score, item) {
    return item.healthy ? score + 1 : Math.max(0, score - 1);
  }

  return {
    mulberry32: mulberry32, shuffle: shuffle, buildRound: buildRound, timeLimit: timeLimit,
    summarize: summarize, achievement: achievement, insertScore: insertScore,
    generateTrack: generateTrack, collides: collides, applyItem: applyItem,
    HEALTHY: HEALTHY, HARMFUL: HARMFUL
  };
});
