const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../js/logic.js');
const bank = require('../js/data.js').QUESTIONS;

test('el banco tiene 15 preguntas con 4 opciones y una correcta valida', () => {
  assert.equal(bank.length, 15);
  for (const q of bank) {
    assert.equal(q.options.length, 4, q.id);
    assert.ok(q.correct >= 0 && q.correct < 4, q.id);
    assert.ok(q.concept.length > 10, q.id);
    assert.ok(['publicada', 'reconstruida'].includes(q.source), q.id);
  }
  assert.equal(new Set(bank.map(q => q.id)).size, 15);
});

test('buildRound devuelve 10 preguntas distintas y conserva la opcion correcta', () => {
  const round = L.buildRound(bank, L.mulberry32(7));
  assert.equal(round.length, 10);
  assert.equal(new Set(round.map(q => q.id)).size, 10);
  for (const rq of round) {
    const orig = bank.find(q => q.id === rq.id);
    assert.equal(rq.options[rq.correct], orig.options[orig.correct]);
    assert.deepEqual([...rq.options].sort(), [...orig.options].sort());
  }
});

test('buildRound es reproducible con la misma semilla', () => {
  const a = L.buildRound(bank, L.mulberry32(3)).map(q => q.id + q.correct);
  const b = L.buildRound(bank, L.mulberry32(3)).map(q => q.id + q.correct);
  assert.deepEqual(a, b);
});

test('tiempo por nivel: facil 45 s, intermedio 20 s', () => {
  assert.equal(L.timeLimit('facil'), 45);
  assert.equal(L.timeLimit('intermedio'), 20);
  assert.throws(() => L.timeLimit('dificil'));
});

test('summarize cuenta aciertos, errores y sin responder', () => {
  const answers = [
    { chosen: 1, correct: 1 }, { chosen: 0, correct: 2 }, { chosen: null, correct: 3 }, { chosen: 2, correct: 2 }
  ];
  assert.deepEqual(L.summarize(answers), { correct: 2, errors: 1, unanswered: 1, total: 4 });
});

test('achievement por aciertos', () => {
  assert.equal(L.achievement(10, 10).title, 'Hígado de Acero');
  assert.equal(L.achievement(9, 10).title, 'Hígado de Acero');
  assert.equal(L.achievement(7, 10).title, 'Hígado Firme');
  assert.equal(L.achievement(3, 10).title, 'Recluta en entrenamiento');
});

test('ranking local: top 3 por puntos, empate gana menos tiempo', () => {
  let b = [];
  b = L.insertScore(b, { name: 'A', points: 10, seconds: 100 });
  b = L.insertScore(b, { name: 'B', points: 12, seconds: 300 });
  b = L.insertScore(b, { name: 'C', points: 12, seconds: 200 });
  b = L.insertScore(b, { name: 'D', points: 5, seconds: 50 });
  assert.deepEqual(b.map(e => e.name), ['C', 'B', 'A']);
});

test('pista del minijuego: determinista, saludables y daninos presentes, en orden de x', () => {
  const t1 = L.generateTrack(11);
  const t2 = L.generateTrack(11);
  assert.deepEqual(t1, t2);
  assert.ok(t1.items.length >= 14);
  assert.ok(t1.items.some(i => i.healthy) && t1.items.some(i => !i.healthy));
  for (let k = 1; k < t1.items.length; k++) assert.ok(t1.items[k].x > t1.items[k - 1].x);
  assert.ok(t1.items.every(i => i.lane >= 0 && i.lane < 3 && i.x < t1.length));
});

test('colision: solo en el mismo carril y cerca en x; puntaje minimo 0', () => {
  const item = { x: 100, lane: 1, healthy: true };
  assert.equal(L.collides({ x: 95, lane: 1 }, item, 20), true);
  assert.equal(L.collides({ x: 95, lane: 0 }, item, 20), false);
  assert.equal(L.collides({ x: 200, lane: 1 }, item, 20), false);
  assert.equal(L.applyItem(0, { healthy: false }), 0);
  assert.equal(L.applyItem(3, { healthy: false }), 2);
  assert.equal(L.applyItem(3, { healthy: true }), 4);
});

test('buildRound incluye siempre las 5 preguntas nucleo (una por tema del test)', () => {
  const core = bank.filter(q => q.core).map(q => q.id);
  assert.equal(core.length, 5);
  assert.deepEqual([...new Set(bank.filter(q => q.core).map(q => q.topic))].sort(),
    ['consecuencias', 'epidemiologia', 'fisiopatologia', 'prevencion', 'riesgo']);
  for (let seed = 1; seed <= 50; seed++) {
    const ids = L.buildRound(bank, L.mulberry32(seed)).map(q => q.id);
    assert.equal(ids.length, 10);
    assert.equal(new Set(ids).size, 10);
    core.forEach(id => assert.ok(ids.includes(id), 'semilla ' + seed + ' sin ' + id));
  }
});
