(function () {
  'use strict';
  var L = window.FLAGLogic;
  var BANK = window.FLAGData.QUESTIONS;
  var STORE_BOARD = 'flag.leaderboard.v1';
  var STORE_NAME = 'flag.player.v1';
  var MG_AFTER_QUESTION = 5; // el minijuego aparece como pausa tras la pregunta 5

  var $ = function (id) { return document.getElementById(id); };
  var state = null;
  var ticker = null;
  var pendingRoomMode = false;

  /* ---------- utilidades ---------- */
  function show(name) {
    document.querySelectorAll('.screen').forEach(function (s) { s.hidden = s.dataset.screen !== name; });
    window.scrollTo(0, 0);
  }
  function mmss(sec) {
    sec = Math.max(0, Math.round(sec));
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }
  function loadBoard() {
    try { return JSON.parse(localStorage.getItem(STORE_BOARD)) || []; } catch (e) { return []; }
  }
  function saveBoard(b) { try { localStorage.setItem(STORE_BOARD, JSON.stringify(b)); } catch (e) { /* sin almacenamiento */ } }
  function dialog(title, body) {
    $('dlg-title').textContent = title;
    $('dlg-body').textContent = body;
    $('dlg').showModal();
  }
  function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null; } }

  /* ---------- 4.1 bienvenida ---------- */
  function renderBoard() {
    var ol = $('leaderboard');
    ol.innerHTML = '';
    var b = loadBoard();
    if (!b.length) {
      var li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'Aún no hay puntajes. Sé el primero.';
      ol.appendChild(li);
      return;
    }
    b.forEach(function (e) {
      var li = document.createElement('li');
      var left = document.createElement('span');
      left.textContent = e.name + ' · ' + mmss(e.seconds);
      var right = document.createElement('b');
      right.textContent = e.points + ' pts';
      li.appendChild(left); li.appendChild(right);
      ol.appendChild(li);
    });
  }
  function goWelcome() { stopTicker(); renderBoard(); show('welcome'); }

  /* ---------- 4.2 pantalla previa ---------- */
  function goPregame(roomMode) {
    pendingRoomMode = roomMode;
    $('room-field').hidden = !roomMode;
    $('pregame-error').textContent = '';
    try { $('inp-name').value = localStorage.getItem(STORE_NAME) || ''; } catch (e) { /* ignorar */ }
    show('pregame');
    $('inp-name').focus();
  }
  function startGame(level) {
    var name = $('inp-name').value.trim().toUpperCase();
    var room = pendingRoomMode ? $('inp-room').value.trim().toUpperCase() : 'General';
    if (!name) { $('pregame-error').textContent = 'Escribe tu nombre de soldado.'; return; }
    if (pendingRoomMode && !room) { $('pregame-error').textContent = 'Escribe el código de sala.'; return; }
    try { localStorage.setItem(STORE_NAME, name); } catch (e) { /* ignorar */ }
    var seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0;
    state = {
      name: name, room: room, level: level,
      round: L.buildRound(BANK, L.mulberry32(seed)),
      idx: 0, answers: [], quizPoints: 0, mgPoints: 0, startMs: Date.now(),
      chosen: null, deadline: 0, mgDone: false
    };
    showQuestion();
  }

  /* ---------- 4.3 pregunta ---------- */
  function totalPoints() { return state.quizPoints + state.mgPoints; }

  function showQuestion() {
    var q = state.round[state.idx];
    state.chosen = null;
    $('hud-q').textContent = 'Pregunta ' + (state.idx + 1) + ' de ' + state.round.length;
    $('hud-points').textContent = totalPoints();
    $('hud-room').textContent = q.room === 'General' ? state.room : state.room + ' · ' + q.room;
    $('q-text').textContent = q.text;
    $('btn-answer').disabled = true;
    var ul = $('q-options');
    ul.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var li = document.createElement('li');
      li.tabIndex = 0;
      li.setAttribute('role', 'radio');
      li.setAttribute('aria-checked', 'false');
      var letter = document.createElement('span');
      letter.className = 'letter';
      letter.textContent = 'ABCD'[i] + ':';
      var txt = document.createElement('span');
      txt.textContent = opt;
      li.appendChild(letter); li.appendChild(txt);
      var pick = function () { choose(i); };
      li.addEventListener('click', pick);
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
      });
      ul.appendChild(li);
    });
    show('question');
    startQuestionTimer();
  }
  function choose(i) {
    state.chosen = i;
    Array.prototype.forEach.call($('q-options').children, function (li, k) {
      li.setAttribute('aria-checked', k === i ? 'true' : 'false');
    });
    $('btn-answer').disabled = false;
  }
  function startQuestionTimer() {
    stopTicker();
    var limit = L.timeLimit(state.level);
    state.deadline = Date.now() + limit * 1000;
    var tick = function () {
      var left = Math.ceil((state.deadline - Date.now()) / 1000);
      $('hud-timer').textContent = mmss(left);
      $('hud-timer').classList.toggle('low', left <= 5);
      if (left <= 0) { stopTicker(); submit(true); }
    };
    tick();
    ticker = setInterval(tick, 250);
  }

  /* ---------- 4.4 retroalimentación ---------- */
  function submit(timedOut) {
    stopTicker();
    var q = state.round[state.idx];
    var chosen = timedOut ? null : state.chosen;
    state.answers.push({ id: q.id, text: q.text, options: q.options, chosen: chosen, correct: q.correct, concept: q.concept });
    var ok = chosen === q.correct;
    if (ok) state.quizPoints += 1;
    var panel = $('fb-panel');
    panel.className = 'panel feedback ' + (ok ? 'ok' : 'bad');
    if (ok) {
      $('fb-title').textContent = '¡Bien hecho! +1 punto';
      $('fb-body').textContent = 'Respuesta correcta.';
      $('fb-concept').textContent = '';
    } else {
      $('fb-title').textContent = '¡Alerta roja!';
      $('fb-body').textContent = (timedOut ? 'Se acabó el tiempo. ' : 'Respuesta incorrecta. ') +
        'La correcta era ' + 'ABCD'[q.correct] + ': ' + q.options[q.correct] + '.';
      $('fb-concept').textContent = 'Concepto correcto: ' + q.concept;
    }
    $('fb-q').textContent = 'Pregunta ' + (state.idx + 1) + ' de ' + state.round.length;
    $('fb-points').textContent = totalPoints();
    $('fb-room').textContent = state.room;
    $('fb-timer').textContent = '';
    $('btn-next').textContent = state.idx + 1 >= state.round.length ? 'Ver resultados' : 'Continuar';
    show('feedback');
  }
  function next() {
    state.idx += 1;
    if (state.idx >= state.round.length) return finish();
    if (state.idx === MG_AFTER_QUESTION && !state.mgDone) return startMinigame();
    showQuestion();
  }
  function endMission() {
    stopTicker();
    var q;
    while (state.answers.length < state.round.length) {
      q = state.round[state.answers.length];
      state.answers.push({ id: q.id, text: q.text, options: q.options, chosen: null, correct: q.correct, concept: q.concept });
    }
    finish();
  }

  /* ---------- 4.5 minijuego recolector ---------- */
  var mg = null;
  var LANES_Y = [60, 150, 240];
  function startMinigame() {
    state.mgDone = true;
    var track = L.generateTrack((Date.now() >>> 0) % 100000);
    mg = { track: track, heart: { x: 0, lane: 1 }, targetLane: 1, y: LANES_Y[1], score: 0, taken: {}, last: 0, t0: 0, over: false, raf: 0 };
    $('mg-points').textContent = '0';
    $('mg-timer').textContent = '00:00';
    $('mg-finish').hidden = true;
    show('minigame');
    mg.t0 = performance.now();
    mg.last = mg.t0;
    mg.raf = requestAnimationFrame(mgLoop);
  }
  function mgMove(d) {
    if (!mg || mg.over) return;
    mg.targetLane = Math.min(2, Math.max(0, mg.targetLane + d));
    mg.heart.lane = mg.targetLane;
  }
  function mgLoop(now) {
    if (!mg) return;
    var dt = Math.min(0.05, (now - mg.last) / 1000);
    mg.last = now;
    if (!mg.over) {
      mg.heart.x += 150 * dt;
      mg.y += (LANES_Y[mg.targetLane] - mg.y) * Math.min(1, dt * 12);
      mg.track.items.forEach(function (it, k) {
        if (!mg.taken[k] && L.collides(mg.heart, it, 22)) {
          mg.taken[k] = true;
          mg.score = L.applyItem(mg.score, it);
          $('mg-points').textContent = mg.score;
        }
      });
      $('mg-timer').textContent = mmss((now - mg.t0) / 1000);
      if (mg.heart.x >= mg.track.length) { mg.over = true; $('mg-finish').hidden = false; $('mg-finish').focus(); }
    }
    mgDraw(now);
    mg.raf = requestAnimationFrame(mgLoop);
  }
  function mgDraw(now) {
    var c = $('mg-canvas'), g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    LANES_Y.forEach(function (y) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, y - 28, c.width, 56); });
    var cam = mg.heart.x - 120;
    g.fillStyle = '#ffffff';
    g.font = '30px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    mg.track.items.forEach(function (it, k) {
      if (mg.taken[k]) return;
      var sx = it.x - cam;
      if (sx < -30 || sx > c.width + 30) return;
      g.fillText(it.emoji, sx, LANES_Y[it.lane]);
    });
    var fx = mg.track.length - cam;
    if (fx < c.width + 20) { g.fillStyle = '#22c55e'; g.fillRect(fx, 0, 6, c.height); }
    var bounce = Math.sin(now / 120) * 4;
    g.font = '36px serif';
    g.fillStyle = '#ffffff';
    g.fillText('🫀', 120, mg.y + bounce);
  }
  function mgFinish() {
    cancelAnimationFrame(mg.raf);
    state.mgPoints += mg.score;
    mg = null;
    showQuestion();
  }

  /* ---------- 4.6 pantallas finales ---------- */
  function finish() {
    stopTicker();
    var sum = L.summarize(state.answers);
    var seconds = Math.round((Date.now() - state.startMs) / 1000);
    var ach = L.achievement(sum.correct, sum.total);
    $('end-name').textContent = state.name;
    $('end-score').textContent = totalPoints();
    $('end-ok').textContent = sum.correct;
    $('end-err').textContent = sum.errors;
    $('end-un').textContent = sum.unanswered;
    $('end-breakdown').textContent = 'Preguntas: ' + state.quizPoints + ' puntos. Minijuego: ' + state.mgPoints +
      ' puntos. Tiempo: ' + mmss(seconds) + '. Sala: ' + state.room + '. Nivel: ' + state.level + '.';
    $('ach-title').textContent = ach.title;
    $('ach-text').textContent = ach.text;
    saveBoard(L.insertScore(loadBoard(), { name: state.name, points: totalPoints(), seconds: seconds }));
    show('end');
  }
  function renderReport() {
    var ol = $('report-list');
    ol.innerHTML = '';
    state.answers.forEach(function (a) {
      var li = document.createElement('li');
      var status = a.chosen === null ? 'un' : (a.chosen === a.correct ? 'ok' : 'bad');
      var label = a.chosen === null ? 'Sin responder' : (a.chosen === a.correct ? 'Correcta' : 'Incorrecta');
      var head = document.createElement('div');
      head.textContent = a.text;
      var st = document.createElement('div');
      st.className = status;
      st.textContent = label + (a.chosen === null ? '' : '. Tu respuesta: ' + 'ABCD'[a.chosen] + '. ') +
        ' Correcta: ' + 'ABCD'[a.correct] + ': ' + a.options[a.correct];
      var cc = document.createElement('div');
      cc.className = 'muted';
      cc.textContent = 'Concepto correcto: ' + a.concept;
      li.appendChild(head); li.appendChild(st); li.appendChild(cc);
      ol.appendChild(li);
    });
    show('report');
  }

  /* ---------- eventos ---------- */
  $('btn-start').addEventListener('click', function () { goPregame(false); });
  $('btn-room').addEventListener('click', function () { goPregame(true); });
  $('btn-how').addEventListener('click', function () {
    dialog('Cómo jugar', 'Responde 10 preguntas sobre el hígado graso. Cada acierto suma 1 punto. A mitad de camino hay un minijuego donde recoges comida saludable. Al final recibes un reporte con los conceptos correctos.');
  });
  $('btn-intro').addEventListener('click', function () {
    dialog('Introducción', 'El hígado graso no alcohólico (NAFLD) es muy común y suele no dar síntomas al inicio. Prevenirlo depende de la alimentación, la actividad física y los controles de salud. Tu misión es aprender a protegerlo.');
  });
  $('dlg-close').addEventListener('click', function () { $('dlg').close(); });
  $('btn-back-welcome').addEventListener('click', goWelcome);
  document.querySelectorAll('[data-level]').forEach(function (b) {
    b.addEventListener('click', function () { startGame(b.dataset.level); });
  });
  $('btn-answer').addEventListener('click', function () { if (state.chosen !== null) submit(false); });
  $('btn-end').addEventListener('click', endMission);
  $('btn-next').addEventListener('click', next);
  $('mg-up').addEventListener('click', function () { mgMove(-1); });
  $('mg-down').addEventListener('click', function () { mgMove(1); });
  $('mg-finish').addEventListener('click', mgFinish);
  document.addEventListener('keydown', function (e) {
    if (!mg) return;
    if (e.key === 'ArrowUp') { e.preventDefault(); mgMove(-1); }
    if (e.key === 'ArrowDown') { e.preventDefault(); mgMove(1); }
  });
  $('btn-home').addEventListener('click', goWelcome);
  $('btn-review').addEventListener('click', renderReport);
  $('btn-report-back').addEventListener('click', function () { show('end'); });

  goWelcome();
  window.__flag = { getState: function () { return state; }, getMinigame: function () { return mg; } };
})();
