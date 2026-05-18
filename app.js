const WORK_SECONDS = 45;
const TRANSITION_SECONDS = 15;
const ROUND_REST_SECONDS = 60;
const HISTORY_KEY = 'kbFocusHistory';
const VOICE_KEY = 'kbFocusVoice';

const APP_VERSION = '2026-05-18-pace-voice-v4';

const exerciseImages = {
  swing: './assets/01_swing_focus.jpg',
  rack: './assets/02_rack_focus.jpg',
  press: './assets/03_press_focus.jpg',
  windmill: './assets/04_windmill_focus.jpg',
  deadlift: './assets/05_deadlift_focus.jpg',
  squat: './assets/06_goblet_squat_focus.jpg',
  renegade: './assets/07_renegade_row_focus.jpg',
  around: './assets/08_around_the_world_focus.jpg',
  overhead: './assets/09_overhead_hold_focus.jpg',
  row: './assets/10_bent_over_row_focus.jpg',
  halo: './assets/11_halos_focus.jpg'
};

function imageForExercise(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('halo')) return exerciseImages.halo;
  if (n.includes('windmill')) return exerciseImages.windmill;
  if (n.includes('deadlift')) return exerciseImages.deadlift;
  if (n.includes('squat')) return exerciseImages.squat;
  if (n.includes('renegade') || n.includes('push-up') || n.includes('pushup')) return exerciseImages.renegade;
  if (n.includes('row')) return exerciseImages.row;
  if (n.includes('around') || n.includes('figure 8')) return exerciseImages.around;
  if (n.includes('snatch') || n.includes('overhead')) return exerciseImages.overhead;
  if (n.includes('clean & jerk') || n.includes('press')) return exerciseImages.press;
  if (n.includes('clean') || n.includes('rack')) return exerciseImages.rack;
  if (n.includes('swing')) return exerciseImages.swing;
  return exerciseImages.swing;
}

const programs = [
  {
    id: 'full_circuit',
    name: 'Full Body Circuit',
    focus: 'Broad full-body flow',
    rounds: 2,
    exercises: [
      ex('Swings', '20-25', '24kg'),
      ex('Around the Worlds', '10 each direction', '24kg'),
      ex('Cleans — right', '15', '20kg'),
      ex('Cleans — left', '15', '20kg'),
      ex('Halos', '12 alternating', '20kg'),
      ex('Clean & Jerk — left', '12', '16kg'),
      ex('Clean & Jerk — right', '12', '16kg'),
      ex('Figure 8s', '16 alternating', '20kg'),
      ex('Snatches — left', '16', '16kg'),
      ex('Snatches — right', '16', '16kg')
    ]
  },
  {
    id: 'push_pull',
    name: 'Push & Pull',
    focus: 'Balanced push, pull, squat and ballistic work',
    rounds: 2,
    exercises: [
      ex('Swings', '20-25', '24kg'),
      ex('Single-arm Rows — left', '12', '20kg'),
      ex('Single-arm Rows — right', '12', '20kg'),
      ex('Clean & Jerk — left', '12', '16kg'),
      ex('Clean & Jerk — right', '12', '16kg'),
      ex('Around the Worlds', '10 each direction', '24kg'),
      ex('Goblet Squats', '14', '20kg'),
      ex('Halos', '12 alternating', '20kg'),
      ex('Figure 8s', '16 alternating', '20kg'),
      ex('Push-ups', '15', 'BW')
    ]
  },
  {
    id: 'snatch_ballistic',
    name: 'Snatch & Ballistic',
    focus: 'Power, speed and ballistic movement',
    rounds: 3,
    exercises: [
      ex('Swings', '20-25', '24kg'),
      ex('Snatches — left', '14', '16kg'),
      ex('Snatches — right', '14', '16kg'),
      ex('Around the Worlds', '10 each direction', '24kg'),
      ex('Cleans — left', '12', '20kg'),
      ex('Cleans — right', '12', '20kg')
    ]
  },
  {
    id: 'press_focus',
    name: 'Auxiliary Kettlebell Circuit',
    focus: 'Less-used movements and balancing work',
    rounds: 3,
    exercises: [
      ex('Swings', '20-25', '24kg'),
      ex('Dual kettlebell cleans', '8-10', '16kg + 16kg'),
      ex('Deadlifts', '10', '44kg (24kg + 20kg)'),
      ex('Renegade rows', '6 each side', '16kg + 16kg'),
      ex('Windmills — alternating', '5 each side', '16kg'),
      ex('Push-ups', '12-15', 'BW')
    ],
    finisher: [ex('Finisher: Swings', '20-25', '24kg'), ex('Finisher: Push-ups', '12-15', 'BW')]
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
let wakeLock = null;
let session = null;
let voiceEnabled = localStorage.getItem(VOICE_KEY) !== 'off';
let lastSpokenSecond = null;

const els = {
  status: $('status'), setup: $('setup'), workout: $('workout'), summary: $('summary'),
  generateBtn: $('generateBtn'), programSelect: $('programSelect'), preview: $('sessionPreview'), startRow: $('startRow'),
  startBtn: $('startBtn'), resetChoiceBtn: $('resetChoiceBtn'), stepLabel: $('stepLabel'), exerciseName: $('exerciseName'), exerciseArt: $('exerciseArt'), exerciseImage: $('exerciseImage'),
  phaseLabel: $('phaseLabel'), timer: $('timer'), exerciseDetails: $('exerciseDetails'), progressText: $('progressText'),
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
  currentIndex = 0;
  session = { program: selectedProgram, startedAt: new Date(), events: [], completed: false };
  els.setup.classList.add('hidden');
  els.summary.classList.add('hidden');
  els.workout.classList.remove('hidden');
  requestWakeLock();
  showStep();
  startTimer();
}

function showStep() {
  const step = steps[currentIndex];
  if (!step) return finishWorkout(false);
  secondsLeft = step.seconds;
  const isWork = step.type === 'work';
  lastSpokenSecond = null;
  els.stepLabel.textContent = step.label;
  els.exerciseName.textContent = isWork ? step.exercise.name : step.type === 'roundRest' ? 'Rest' : 'Transition';
  els.exerciseDetails.textContent = isWork ? `${step.exercise.reps} · ${step.exercise.weight}` : step.type === 'roundRest' ? '1 minute. Breathe. Do not negotiate with the bell.' : 'Set up the next movement.';
  updateExerciseImage(step);
  els.phaseLabel.textContent = isWork ? 'WORK' : 'REST';
  els.phaseLabel.classList.toggle('rest', !isWork);
  els.progressText.textContent = `${currentIndex + 1} / ${steps.length}`;
  els.nextBtn.textContent = currentIndex === steps.length - 1 ? 'Finish' : 'Skip / next';
  els.pauseBtn.disabled = false;
  renderTimer();
  logEvent('step_start', step);
  speakStep(step);
}

function startTimer() {
  clearInterval(interval);
  paused = false;
  els.pauseBtn.textContent = 'Pause';
  interval = setInterval(() => {
    if (paused) return;
    secondsLeft -= 1;
    renderTimer();
    maybeSpeakCountdown();
    if (secondsLeft <= 0) advanceStep(true);
  }, 1000);
}

function renderTimer() { els.timer.textContent = String(Math.max(0, secondsLeft)); }

function advanceStep(auto = false) {
  const step = steps[currentIndex];
  if (step) logEvent(auto ? 'step_auto_done' : 'step_manual_done', step);
  currentIndex += 1;
  if (currentIndex >= steps.length) return finishWorkout(false);
  showStep();
}

function togglePause() {
  paused = !paused;
  els.pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  logEvent(paused ? 'pause' : 'resume', steps[currentIndex]);
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
  const activeWork = step.type === 'work' ? step : null;
  const upcomingWork = activeWork || steps.slice(currentIndex + 1).find(s => s.type === 'work');
  const name = upcomingWork?.exercise?.name || 'Kettlebell exercise';
  const src = imageForExercise(name);
  els.exerciseImage.src = src;
  els.exerciseImage.alt = name;
  els.exerciseArt.classList.toggle('rest-preview', !activeWork);
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
  const doneEvents = s.events.filter(e => e.event.includes('done') && e.step?.type === 'work');
  for (const e of doneEvents) {
    const r = e.step?.round == null ? null : String(e.step.round);
    if (r) roundEnds[r] = new Date(e.time);
  }
  const rounds = Object.keys(roundStarts).map(r => `- ${r === 'Finisher' ? 'Finisher' : `Round ${r}`}: ${duration(roundStarts[r], roundEnds[r] || s.endedAt)}`);
  const weights = uniqueExercises(s.program).map(e => `${e.name}: ${e.weight}`).join('; ');
  return [
    'Kettlebell session done',
    `Date: ${isoDate(s.startedAt)}`,
    `Program: ${s.program.name} (${s.program.id})`,
    `Status: ${early ? 'ended early' : 'completed'}`,
    `Rounds: ${s.program.rounds}${s.program.finisher ? ' + finisher' : ''}`,
    `Total elapsed: ${duration(s.startedAt, s.endedAt)}`,
    'Timing:',
    ...rounds,
    `Weights: ${weights}`,
    'Notes: no issues reported'
  ].join('\n');
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
  if (step.type === 'work') {
    speak(`${cleanSpeech(step.exercise.name)}. ${step.seconds} seconds.`);
  } else if (step.type === 'roundRest') {
    speak(`Rest. ${step.seconds} seconds.`);
  } else {
    const next = steps[currentIndex + 1];
    if (next?.type === 'work') speak(`Rest. ${step.seconds} seconds. Next: ${cleanSpeech(next.exercise.name)}.`);
    else speak(`Rest. ${step.seconds} seconds.`);
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
