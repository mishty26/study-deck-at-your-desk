 /*
Student Productivity Dashboard - script.js

Plain Vanilla JavaScript. No frameworks, no libraries.

Sections:
1. Tiny helpers
2. Theme toggle
3. To-do list
4. Pomodoro timer
5. Study progress tracker
6. Motivational quotes
7. Init
*/
   
/* ---------- 1. HELPERS ------------------------------------------- */

// Short helper so we write $("#id") instead of document.querySelector("#id")
const $ = (selector) => document.querySelector(selector);

// Save any value as JSON in Local Storage (survives page refresh)
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Read a value back. If nothing is stored, return the fallback.
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn("Could not read", key, error);
    return fallback;
  }
}

/* ---------- 2. THEME TOGGLE -------------------------------------- */

const themeToggle = $("#themeToggle");

// Apply a theme by setting an attribute on <html>; CSS does the rest.
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  save("spd-theme", theme);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ---------- 3. TO-DO LIST ---------------------------------------- */

const taskForm = $("#taskForm");
const taskInput = $("#taskInput");
const taskList = $("#taskList");
const taskEmpty = $("#taskEmpty");
const taskCounter = $("#taskCounter");

// Each task looks like: { id: 1712..., text: "Read notes", done: false }
let tasks = load("spd-tasks", []);

// Draw the whole list from the `tasks` array (simple and easy to follow).
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");

    // Complete / uncomplete button
    const check = document.createElement("button");
    check.className = "check";
    check.type = "button";
    check.textContent = task.done ? "✓" : "";
    check.setAttribute("aria-label", task.done ? "Mark as not done" : "Mark as done");
    check.addEventListener("click", () => toggleTask(task.id));

    // Task text
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Delete button
    const del = document.createElement("button");
    del.className = "delete";
    del.type = "button";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(check, span, del);
    taskList.appendChild(li);
  });

  // Empty state + counters
  const done = tasks.filter((t) => t.done).length;
  taskEmpty.style.display = tasks.length ? "none" : "block";
  taskCounter.textContent = `${done} / ${tasks.length}`;
  $("#statOpen").textContent = tasks.length - done;
  $("#statDone").textContent = done;

  save("spd-tasks", tasks);
}

function addTask(text) {
  tasks.unshift({ id: Date.now(), text, done: false });
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = "";
});

/* ---------- 4. POMODORO TIMER ------------------------------------ */

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;
const RING_LENGTH = 326.7; // circumference of the SVG circle (2 * PI * 52)

let isBreak = false;
let secondsLeft = FOCUS_MINUTES * 60;
let round = 1;
let intervalId = null; // holds setInterval so we can pause

const timerDisplay = $("#timerDisplay");
const ringFill = $("#ringFill");
const modeLabel = $("#modeLabel");
const cycleLabel = $("#cycleLabel");

// Turn 90 seconds into "01:30"
function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderTimer() {
  const total = (isBreak ? BREAK_MINUTES : FOCUS_MINUTES) * 60;
  timerDisplay.textContent = formatTime(secondsLeft);
  modeLabel.textContent = isBreak ? "Break" : "Focus";
  cycleLabel.textContent = `Round ${round}`;
  document.body.classList.toggle("break-mode", isBreak);
  // The ring empties as time runs out
  ringFill.style.strokeDashoffset = RING_LENGTH * (1 - secondsLeft / total);
}

// Called when a focus or break block finishes
function switchMode() {
  if (!isBreak) round += 1; // a full focus block was completed
  isBreak = !isBreak;
  secondsLeft = (isBreak ? BREAK_MINUTES : FOCUS_MINUTES) * 60;
  renderTimer();
}

function startTimer() {
  if (intervalId) return; // already running
  intervalId = setInterval(() => {
    secondsLeft -= 1;
    if (secondsLeft <= 0) switchMode();
    else renderTimer();
  }, 1000);
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

function resetTimer() {
  pauseTimer();
  isBreak = false;
  round = 1;
  secondsLeft = FOCUS_MINUTES * 60;
  renderTimer();
}

$("#startBtn").addEventListener("click", startTimer);
$("#pauseBtn").addEventListener("click", pauseTimer);
$("#resetBtn").addEventListener("click", resetTimer);

/* ---------- 5. STUDY PROGRESS TRACKER ---------------------------- */

const progressForm = $("#progressForm");
const hoursInput = $("#hoursInput");
const goalInput = $("#goalInput");
const barFill = $("#barFill");
const barRoot = $("#barRoot");
const progressText = $("#progressText");
const goalPill = $("#goalPill");

// Stored shape: { hours: 2.5, goal: 6 }
let study = load("spd-study", { hours: 0, goal: 6 });

function renderProgress() {
  const percent = Math.min(100, Math.round((study.hours / study.goal) * 100)) || 0;

  hoursInput.value = study.hours;
  goalInput.value = study.goal;
  barFill.style.width = percent + "%";
  barRoot.setAttribute("aria-valuenow", percent);
  goalPill.textContent = `Goal: ${study.goal}h`;
  $("#statHours").textContent = study.hours + "h";

  progressText.textContent =
    percent >= 100
      ? `${study.hours}h of ${study.goal}h — goal smashed. Take a break!`
      : `${study.hours}h of ${study.goal}h — ${percent}% done.`;

  save("spd-study", study);
}

progressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  study = {
    hours: Math.max(0, Number(hoursInput.value) || 0),
    goal: Math.max(1, Number(goalInput.value) || 1),
  };
  renderProgress();
});

/* ---------- 6. MOTIVATIONAL QUOTES ------------------------------- */

const quotes = [
  { text: "Small steps every day beat big steps once a month.", author: "Unknown" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
];

const quoteText = $("#quoteText");
const quoteAuthor = $("#quoteAuthor");

function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.textContent = `“${quote.text}”`;
  quoteAuthor.textContent = `— ${quote.author}`;
  // Restart the fade-in animation
  quoteText.style.animation = "none";
  void quoteText.offsetWidth; // forces the browser to notice the change
  quoteText.style.animation = "";
}

$("#quoteBtn").addEventListener("click", showRandomQuote);

/* ---------- 7. INIT ---------------------------------------------- */

applyTheme(load("spd-theme", "dark"));
renderTasks();
renderTimer();
renderProgress();
showRandomQuote();
