const WORK_SECONDS = 45;
const TRANSITION_SECONDS = 15;
const ROUND_REST_SECONDS = 60;
const PREP_SECONDS = 5;
const HISTORY_KEY = 'kbFocusHistory';
const VOICE_KEY = 'kbFocusVoice';

const APP_VERSION = '2026-07-04-ballistic-gorilla-rows-v1';

const exerciseImages = [
  [/swing/i, './assets/01_swing_focus.jpg'],
  [/around|halo|figure 8/i, './assets/08_around_the_world_focus.jpg'],
  [/clean & jerk|press/i, './assets/03_press_focus.jpg'],
  [/clean|rack/i, './assets/02_rack_focus.jpg'],
  [/snatch|overhead/i, './assets/09_overhead_hold_focus.jpg'],
  [/deadlift/i, './assets/05_deadlift_focus.jpg'],
  [/squat/i, './assets/06_goblet_squat_focus.jpg'],
  [/renegade|push-up|pushup/i, './assets/07_renegade_row_focus.jpg'],
  [/row/i, './assets/10_bent_over_row_focus.jpg'],
  [/windmill/i, './assets/04_windmill_focus.jpg']
];

const programs = [
  {
    id: 'balanced_full_body',
    name: 'Balanced Full Body',
    focus: 'Broad default full-body session without stacking grip or hinge',
    rounds: 2,
    exercises: [
      ex('Swings', '18-22', '24kg'),
      ex('Push-ups', '12-15', 'BW'),
      ex('Single-arm row — left', '10-12', '20kg volume / 24kg strength'),
      ex('Single-arm row — right', '10-12', '20kg volume / 24kg strength'),
      ex('Goblet squats', '10-12, knee-friendly depth', '20kg'),
      ex('Deadlifts / KB deadlifts', '8-10 controlled', '44kg'),
      ex('Clean & Jerk — left', '8-10 crisp reps', '20kg'),
      ex('Clean & Jerk — right', '8-10 crisp reps', '20kg'),
      ex('Windmills', '4-5 each side, slow', '16kg'),
      ex('Figure 8s', '12-16 alternating, easy rhythm', '20kg')
    ]
  },
  {
    id: 'back_sparing_upper_core',
    name: 'Back-Sparing Upper + Core',
    focus: 'Low hinge, low knee stress; recovery-compatible upper/core work',
    rounds: 2,
    exercises: [
      ex('Swings', '18-22', '24kg'),
      ex('Push-ups', '12-15', 'BW'),
      ex('Half-kneeling press — left', '8-10', '16kg'),
      ex('Half-kneeling press — right', '8-10', '16kg'),
      ex('Supported single-arm row — left', '10-12', '20kg'),
      ex('Supported single-arm row — right', '10-12', '20kg'),
      ex('Pullovers', '10-12', '16kg'),
      ex('Halos', '10 alternating', '20kg'),
      ex('Windmills', '4-5 each side, slow', '16kg'),
      ex('Goblet squats', '8-10 controlled', '20kg')
    ]
  },
  {
    id: 'controlled_ballistic',
    name: 'Controlled Ballistic',
    focus: 'Power work with capped back and hand fatigue',
    rounds: 3,
    exercises: [
      ex('Swings', '18-22, not max reps', '24kg'),
      ex('Push-ups', '12-15', 'BW'),
      ex('Snatches — left', '10-12', '16kg'),
      ex('Snatches — right', '10-12', '16kg'),
      ex('Halos', '10 alternating', '20kg'),
      ex('Gorilla rows', '8-10 each side, controlled', '16kg')
    ],
    finisher: [
      ex('Around the Worlds', 'easy controlled rhythm', '20-24kg'),
      ex('Gorilla rows', '8-10 each side, controlled', '16kg')
    ]
  },
  {
    id: 'knee_cautious_legs_core',
    name: 'Knee-Cautious Legs + Core',
    focus: 'Legs without making knees or low back the tax collector',
    rounds: 2,
    exercises: [
      ex('Light technique swings', '15-18 crisp reps', '16-20kg'),
      ex('Kettlebell racked lunge — left', '5-7', '16kg'),
      ex('Kettlebell racked lunge — right', '5-7', '16kg'),
      ex('Helicopters', '30-40 sec controlled', '12kg'),
      ex('Supported single-arm row — left', '10-12', '20kg'),
      ex('Supported single-arm row — right', '10-12', '20kg'),
      ex('Helicopters', '30-40 sec controlled', '12kg'),
      ex('Halos', '10 alternating', '20kg'),
      ex('Windmills', '4-5 each side, slow', '16kg'),
      ex('Figure 8s', '12-16 alternating, easy rhythm', '16-20kg')
    ]
  },
  {
    id: 'strength_bias_capped',
    name: 'Strength Bias, Capped',
    focus: 'Heavier strength exposure without enough hinge density to wreck the back',
    rounds: 3,
    exercises: [
      ex('Deadlifts / KB deadlifts', '8-10 controlled', '44kg'),
      ex('Push-ups', '12-15', 'BW'),
      ex('Goblet squats', '8-10, knee-friendly depth', '20kg'),
      ex('Dual kettlebell cleans', '6-8 crisp', '16kg + 16kg'),
      ex('Renegade rows', '4-6 each side, strict', '16kg + 16kg'),
      ex('Figure 8s', '12-16 alternating, easy rhythm', '16-20kg')
    ],
    finisher: [
      ex('Helicopters', '30-40 sec relaxed', '12kg'),
      ex('Goblet squats', '8-10 controlled', '20kg')
    ]
  },
  {
    id: 'athletic_power_capped',
    name: 'Athletic Power, Capped',
    focus: 'Hardest athletic option; use when back, knees and hands feel good',
    rounds: 2,
    exercises: [
      ex('Swings', '18-22', '24kg'),
      ex('Pullovers', '10-12', '16kg'),
      ex('Snatches — left', '8-10 crisp reps', '16kg'),
      ex('Snatches — right', '8-10 crisp reps', '16kg'),
      ex('Half-kneeling press — alternating', '6-8 each side', '16kg'),
      ex('Dual kettlebell cleans', '6-8', '16kg + 16kg'),
      ex('Helicopters', '30-40 sec reset', '12kg'),
      ex('Halos', '10 alternating', '20kg'),
      ex('Around the Worlds', 'controlled, not frantic', '20-24kg'),
      ex('Windmills', '4-5 each side, slow', '16kg')
    ]
  }
];

function ex(name, reps, weight) { return { name, reps, weight }; }
function $(id) { return document.getElementById(id); }

let selectedProgram = null;
let steps = [];
let currentIndex = 0;
let secondsLeft = WORK_SECONDS;
let interval = null;
let paused = false;
let awaitingNext = false;
let wakeLock = null;
let session = null;
let voiceEnabled = localStorage.getItem(VOICE_KEY) !== 'off';
let lastSpokenSecond = null;

const els = {
  status: $('status'), setup: $('setup'), workout: $('workout'), summary: $('summary'),
  generateBtn: $('generateBtn'), programSelect: $('programSelect'), preview: $('sessionPreview'), startRow: $('startRow'),
  startBtn: $('startBtn'), resetChoiceBtn: $('resetChoiceBtn'), stepLabel: $('stepLabel'), exerciseName: $('exerciseName'), exerciseArt: $('exerciseArt'), exerciseImage: $('exerciseImage'),
  phaseLabel: $('phaseLabel'), timer: $('timer'), elapsedTimer: $('elapsedTimer'), exerciseDetails: $('exerciseDetails'),
  pauseBtn: $('pauseBtn'), voiceBtn: $('voiceBtn'), nextBtn: $('nextBtn'), abortBtn: $('abortBtn'), summaryText: $('summaryText'), copyBtn: $('copyBtn'), newSessionBtn: $('newSessionBtn')
};

init();

function init() {
  document.documentElement.dataset.version = APP_VERSION;
  populateSelect();
  els.generateBtn.addEventListener('click', () => chooseProgram());
  els.programSelect.addEventListener('change', e => selectProgram(e.target.value));
  els.startBtn.addEventListener('click', startWorkout);
  els.resetChoiceBtn.addEventListener('click', clearChoice);
  els.pauseBtn.addEventListener('click', togglePause);
  els.voiceBtn.addEventListener('click', toggleVoice);
  els.nextBtn.addEventListener('click', advanceStep);
  els.abortBtn.addEventListener('click', () => finishWorkout(true));
  els.copyBtn.addEventListener('click', copySummary);
  els.newSessionBtn.addEventListener('click', newSession);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') requestWakeLock(); });
  updateVoiceButton();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => setStatus('Offline cache unavailable'));
}

function populateSelect() {
  for (const p of programs) {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = p.name;
    els.programSelect.appendChild(option);
  }
}

function chooseProgram() {
  const recent = getHistory().slice(-2).map(item => item.programId);
  const candidates = programs.filter(p => !recent.includes(p.id));
  const pool = candidates.length ? candidates : programs;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  selectProgram(pick.id);
}

function selectProgram(id) {
  selectedProgram = programs.find(p => p.id === id) || null;
  els.programSelect.value = selectedProgram?.id || '';
  if (!selectedProgram) return clearChoice();
  renderPreview();
  els.startRow.classList.remove('hidden');
  setStatus('Session loaded');
}

function clearChoice() {
  selectedProgram = null;
  els.programSelect.value = '';
  els.preview.innerHTML = '';
  els.startRow.classList.add('hidden');
  setStatus('Ready');
}

function renderPreview() {
  const totalBlocks = selectedProgram.rounds * selectedProgram.exercises.length + (selectedProgram.finisher?.length || 0);
  els.preview.innerHTML = `<div class="preview-card"><h3>${selectedProgram.name}</h3><p class="muted">${selectedProgram.focus}. ${selectedProgram.rounds} rounds, ${totalBlocks} work blocks.</p><ol class="exercise-list">${selectedProgram.exercises.map(e => `<li>${e.name} — ${e.reps}, ${e.weight}</li>`).join('')}</ol>${selectedProgram.finisher ? '<p class="muted">Includes 2-minute finisher.</p>' : ''}</div>`;
}

function buildSteps(program) {
  const list = [];
  for (let round = 1; round <= program.rounds; round++) {
    program.exercises.forEach((exercise, i) => {
      list.push({ type: 'work', round, exercise, seconds: WORK_SECONDS, label: `Round ${round} · ${i + 1}/${program.exercises.length}` });
      if (i < program.exercises.length - 1) list.push({ type: 'transition', round, seconds: TRANSITION_SECONDS, label: 'Transition' });
    });
    if (round < program.rounds) list.push({ type: 'roundRest', round, seconds: ROUND_REST_SECONDS, label: `Rest after round ${round}` });
  }
  if (program.finisher?.length) {
    program.finisher.forEach((exercise, i) => {
      list.push({ type: 'work', round: 'Finisher', exercise, seconds: WORK_SECONDS, label: `Finisher · ${i + 1}/${program.finisher.length}` });
      if (i < program.finisher.length - 1) list.push({ type: 'transition', round: 'Finisher', seconds: TRANSITION_SECONDS, label: 'Transition' });
    });
  }
  return list;
}

function startWorkout() {
  if (!selectedProgram) return;
  steps = buildSteps(selectedProgram);
  const firstWork = steps.find(step => step.type === 'work');
  if (firstWork) steps.unshift({ type: 'prep', seconds: PREP_SECONDS, label: 'Get ready', exercise: firstWork.exercise });
  currentIndex = 0;
  session = { program: selectedProgram, startedAt: new Date(), events: [], completed: false };
  els.setup.classList.add('hidden');
  els.summary.classList.add('hidden');
  els.workout.classList.remove('hidden');
  document.body.classList.add('is-working');
  requestWakeLock();
  showStep();
  startTimer();
}

function showStep() {
  const step = steps[currentIndex];
  if (!step) return finishWorkout(false);
  secondsLeft = step.seconds;
  const isWork = step.type === 'work';
  const isPrep = step.type === 'prep';
  awaitingNext = false;
  lastSpokenSecond = null;
  els.stepLabel.textContent = step.label;
  els.exerciseName.textContent = isWork ? step.exercise.name : isPrep ? 'Get ready' : step.type === 'roundRest' ? 'Rest' : 'Transition';
  els.exerciseDetails.textContent = isWork ? `${step.exercise.reps} · ${step.exercise.weight}` : isPrep ? `First: ${step.exercise.name} — ${step.exercise.reps}, ${step.exercise.weight}` : step.type === 'roundRest' ? '1 minute. Breathe. Do not negotiate with the bell.' : 'Set up the next movement.';
  updateExerciseImage(step);
  els.phaseLabel.textContent = isWork ? 'WORK' : isPrep ? 'STARTING' : 'REST';
  els.phaseLabel.classList.toggle('rest', !isWork && !isPrep);
  els.phaseLabel.classList.toggle('prep', isPrep);
  els.nextBtn.textContent = isWork ? 'Done / start rest' : isPrep ? 'Skip countdown' : currentIndex === steps.length - 1 ? 'Finish' : 'Skip rest / next';
  els.pauseBtn.disabled = isPrep;
  renderTimer();
  renderElapsedTimer();
  logEvent('step_start', step);
  speakStep(step);
}

function startTimer() {
  clearInterval(interval);
  paused = false;
  awaitingNext = false;
  els.pauseBtn.textContent = 'Pause';
  interval = setInterval(() => {
    renderElapsedTimer();
    if (paused || awaitingNext) return;
    secondsLeft -= 1;
    renderTimer();
    maybeSpeakCountdown();
    if (secondsLeft <= 0) {
      const step = steps[currentIndex];
      if (step?.type === 'work') waitForRestStart();
      else advanceStep(true);
    }
  }, 1000);
}

function renderTimer() { els.timer.textContent = String(Math.max(0, secondsLeft)); }
function renderElapsedTimer() {
  if (!els.elapsedTimer || !session?.startedAt) return;
  els.elapsedTimer.textContent = `Elapsed ${duration(session.startedAt, new Date())}`;
}

function waitForRestStart() {
  const step = steps[currentIndex];
  awaitingNext = true;
  clearInterval(interval);
  interval = null;
  secondsLeft = 0;
  renderTimer();
  els.nextBtn.textContent = currentIndex === steps.length - 1 ? 'Finish' : 'Start rest';
  els.pauseBtn.disabled = true;
  setStatus('Work done — click Next to start rest');
  logEvent('work_timer_done_waiting', step);
  speak('Work done. Click next for rest.', true);
}

function advanceStep(auto = false) {
  const step = steps[currentIndex];
  if (step) logEvent(auto ? 'step_auto_done' : 'step_manual_done', step);
  currentIndex += 1;
  if (currentIndex >= steps.length) return finishWorkout(false);
  showStep();
  if (!interval) startTimer();
}

function togglePause() {
  paused = !paused;
  els.pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  logEvent(paused ? 'pause' : 'resume', steps[currentIndex]);
  renderElapsedTimer();
  setStatus(paused ? 'Paused — elapsed time still running' : 'Resumed');
  speak(paused ? 'Paused' : 'Resume');
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  localStorage.setItem(VOICE_KEY, voiceEnabled ? 'on' : 'off');
  updateVoiceButton();
  speak(voiceEnabled ? 'Voice guidance on' : '');
}

function updateExerciseImage(step) {
  if (!els.exerciseImage || !els.exerciseArt) return;
  const nextWork = step.type === 'work' || step.type === 'prep' ? step : steps.slice(currentIndex + 1).find(s => s.type === 'work');
  const name = nextWork?.exercise?.name || '';
  const match = exerciseImages.find(([pattern]) => pattern.test(name));
  if (!match) {
    els.exerciseArt.classList.add('hidden');
    els.exerciseImage.removeAttribute('src');
    return;
  }
  els.exerciseImage.src = match[1];
  els.exerciseImage.alt = name;
  els.exerciseArt.classList.remove('hidden');
}

function updateVoiceButton() {
  if (!els.voiceBtn) return;
  els.voiceBtn.textContent = voiceEnabled ? 'Voice on' : 'Voice off';
  els.voiceBtn.setAttribute('aria-pressed', String(voiceEnabled));
}

function finishWorkout(early) {
  clearInterval(interval);
  if (!session) return;
  session.endedAt = new Date();
  session.completed = !early;
  window.speechSynthesis?.cancel?.();
  releaseWakeLock();
  addHistory({ programId: session.program.id, date: isoDate(session.startedAt) });
  els.workout.classList.add('hidden');
  document.body.classList.remove('is-working');
  els.summary.classList.remove('hidden');
  els.summaryText.value = makeSummary(session, early);
  setStatus(early ? 'Ended early' : 'Done');
}

function makeSummary(s, early) {
  const workEvents = s.events.filter(e => e.event === 'step_start' && e.step.type === 'work');
  const roundStarts = {};
  const roundEnds = {};
  for (const e of workEvents) {
    const r = String(e.step.round);
    roundStarts[r] ||= new Date(e.time);
    roundEnds[r] = new Date(e.time);
  }
  const doneEvents = s.events.filter(e => e.event.includes('done'));
  for (const e of doneEvents) {
    const r = e.step?.round == null ? null : String(e.step.round);
    if (r) roundEnds[r] = new Date(e.time);
  }
  const rounds = Object.keys(roundStarts).map(r => `- ${r === 'Finisher' ? 'Finisher' : `Round ${r}`}: ${duration(roundStarts[r], roundEnds[r] || s.endedAt)}`);
  const weights = uniqueExercises(s.program).map(e => `${e.name}: ${e.weight}`).join('; ');
  const pauseDuration = totalPauseDuration(s);
  const pauseLine = pauseDuration ? `Pauses: ${pauseDuration} included in elapsed timings` : null;
  return [
    'Kettlebell session done',
    `Date: ${isoDate(s.startedAt)}`,
    `Program: ${s.program.name} (${s.program.id})`,
    `Status: ${early ? 'ended early' : 'completed'}`,
    `Rounds: ${s.program.rounds}${s.program.finisher ? ' + finisher' : ''}`,
    `Total elapsed: ${duration(s.startedAt, s.endedAt)}`,
    pauseLine,
    'Timing:',
    ...rounds,
    `Weights: ${weights}`,
    'Notes: no issues reported'
  ].filter(Boolean).join('\n');
}

function totalPauseDuration(s) {
  let total = 0;
  let pauseStart = null;
  for (const e of s.events || []) {
    if (e.event === 'pause') pauseStart = new Date(e.time);
    if (e.event === 'resume' && pauseStart) {
      total += Math.max(0, new Date(e.time) - pauseStart);
      pauseStart = null;
    }
  }
  if (pauseStart) total += Math.max(0, new Date(s.endedAt || new Date()) - pauseStart);
  return total ? duration(0, total) : '';
}

function uniqueExercises(program) {
  const map = new Map();
  [...program.exercises, ...(program.finisher || [])].forEach(e => {
    const key = e.name.replace(/^Finisher: /, '');
    if (!map.has(key)) map.set(key, { ...e, name: key });
  });
  return [...map.values()];
}

function logEvent(event, step) { session?.events.push({ event, time: new Date().toISOString(), step }); }
function isoDate(d) { return d.toISOString().slice(0, 10); }
function duration(a, b) {
  const total = Math.max(0, Math.round((new Date(b) - new Date(a)) / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m ? `${m}m${String(s).padStart(2, '0')}s` : `${s}s`;
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(els.summaryText.value);
    setStatus('Copied');
    els.copyBtn.textContent = 'Copied';
    setTimeout(() => els.copyBtn.textContent = 'Copy summary', 1200);
  } catch {
    els.summaryText.select();
    document.execCommand('copy');
    setStatus('Copied-ish');
  }
}

function newSession() {
  session = null;
  document.body.classList.remove('is-working');
  els.summary.classList.add('hidden');
  els.setup.classList.remove('hidden');
  clearChoice();
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function addHistory(item) {
  const history = [...getHistory(), item].slice(-20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
function setStatus(text) { els.status.textContent = text; }

function speakStep(step) {
  if (step.type === 'prep') {
    const e = step.exercise;
    speak(`Get ready. First: ${cleanSpeech(e.name)}. Starting in five.`);
  } else if (step.type === 'work') {
    const e = step.exercise;
    speak(`${step.label}. ${cleanSpeech(e.name)}. ${e.reps}. ${cleanSpeech(e.weight)}.`);
  } else if (step.type === 'roundRest') {
    speak(`${step.label}. Rest one minute.`);
  } else {
    const next = steps[currentIndex + 1];
    if (next?.type === 'work') speak(`Transition. Next: ${cleanSpeech(next.exercise.name)}.`);
    else speak('Transition.');
  }
}

function maybeSpeakCountdown() {
  if (!voiceEnabled) return;
  if ([10, 5, 3, 2, 1].includes(secondsLeft) && secondsLeft !== lastSpokenSecond) {
    lastSpokenSecond = secondsLeft;
    speak(String(secondsLeft), true);
  }
}

function speak(text, interrupt = false) {
  if (!voiceEnabled || !text || !('speechSynthesis' in window)) return;
  if (interrupt) window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02;
  utterance.pitch = 0.92;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices?.() || [];
  const preferred = voices.find(v => /en-GB|en_US|en-US/.test(v.lang)) || voices[0];
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function cleanSpeech(text) {
  return String(text)
    .replace(/—/g, ' ')
    .replace(/\bBW\b/g, 'bodyweight')
    .replace(/\+/g, ' plus ')
    .replace(/kg/g, ' kilograms')
    .replace(/:/g, '.');
}

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) { setStatus('Wake lock unsupported'); return; }
  try { wakeLock = await navigator.wakeLock.request('screen'); setStatus('Screen awake'); }
  catch { setStatus('Wake lock blocked'); }
}
function releaseWakeLock() {
  if (wakeLock) wakeLock.release().catch(() => {});
  wakeLock = null;
}
