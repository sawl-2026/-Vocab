const STORAGE_VERSION = "sawlVocabLab_v1";
const CHEERS = [
  "첫 별 획득! 오늘의 시작이 좋습니다. 🌟",
  "두 번째 별! 꾸준함이 실력이 됩니다. ✨",
  "세 번째 별! 독해 어휘력이 쌓이고 있어요. 💪",
  "네 번째 별! 문맥 속 단어 감각이 좋아지고 있습니다. 📘",
  "다섯 번째 별! 오답까지 복습하면 완벽합니다. 🚀",
  "멋져요! 별이 늘어날수록 자신감도 커집니다. 🏆",
  "계속 전진! 오늘의 10분이 다음 시험의 힘이 됩니다. 🔥"
];

let currentUser = null;
let calendarDate = new Date();
let currentQuiz = [];
let currentMode = "today";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function storageKey(user = currentUser) {
  return `${STORAGE_VERSION}:${user.id}:${user.name}`;
}

function loadProgress() {
  if (!currentUser) return {};
  try {
    return JSON.parse(localStorage.getItem(storageKey()) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(storageKey(), JSON.stringify(progress));
}

function todayRecord() {
  const progress = loadProgress();
  const today = localDateKey();
  if (!progress[today]) progress[today] = { attended: true, studied: false, completed: false, quizzes: [], wrongs: [] };
  if (!progress[today].wrongs) progress[today].wrongs = [];
  if (!progress[today].quizzes) progress[today].quizzes = [];
  progress[today].attended = true;
  saveProgress(progress);
  return progress[today];
}

function normalizeName(text) {
  return (text || "").trim().replace(/\s+/g, "");
}

function isValidStudent(id, name) {
  const cleanId = String(id || "").trim();
  const cleanName = normalizeName(name);
  return STUDENTS.find(s => String(s.id).trim() === cleanId && normalizeName(s.name) === cleanName);
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a,b)=>String(a).localeCompare(String(b), "ko", { numeric:true }));
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sample(array, count) {
  return shuffle(array).slice(0, count);
}

function fillSelectors() {
  const questionOptions = uniqueSorted(WORD_BANK.map(w => w.q));
  const posOptions = uniqueSorted(WORD_BANK.map(w => w.pos));
  const qFilter = $("#questionFilter");
  const qScope = $("#quizScope");
  questionOptions.forEach(q => {
    qFilter.insertAdjacentHTML("beforeend", `<option value="${q}">${q}번</option>`);
    qScope.insertAdjacentHTML("beforeend", `<option value="${q}">${q}번</option>`);
  });
  posOptions.forEach(pos => $("#posFilter").insertAdjacentHTML("beforeend", `<option value="${pos}">${pos}</option>`));
}

function showView(viewId) {
  $$(".view").forEach(v => v.classList.remove("active"));
  $(`#${viewId}`).classList.add("active");
  $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.target === viewId));
  if (viewId === "dashboard") renderDashboard();
  if (viewId === "study") renderWords();
  if (viewId === "quiz") renderQuizGate();
  if (viewId === "wrongnote") renderWrongNotes(currentMode);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDashboard() {
  const progress = loadProgress();
  const today = todayRecord();
  const stars = Object.values(progress).filter(r => r.completed).length + (today.completed && !progress[localDateKey()]?.completed ? 1 : 0);

  $("#welcomeText").textContent = `${currentUser.name} 학생, 오늘의 어휘 학습을 시작하세요.`;
  $("#attendState").textContent = today.attended ? "완료" : "대기";
  $("#studyState").textContent = today.studied ? "완료" : "대기";
  const lastQuiz = today.quizzes?.at(-1);
  $("#quizState").textContent = lastQuiz ? `${lastQuiz.score}/${lastQuiz.total}` : "대기";
  $("#starCount").textContent = `${Object.values(loadProgress()).filter(r => r.completed).length}개`;
  renderCalendar();
  updateCheer();
}

function renderCalendar() {
  const progress = loadProgress();
  const grid = $("#calendarGrid");
  grid.innerHTML = "";
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  $("#calendarTitle").textContent = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) grid.insertAdjacentHTML("beforeend", `<div class="day-cell empty"></div>`);

  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const key = localDateKey(date);
    const record = progress[key];
    const todayClass = key === localDateKey() ? " today" : "";
    const star = record?.completed ? `<span class="star" title="학습 완료">⭐</span>` : "";
    const dot = record?.attended && !record?.completed ? `<span class="attended-dot" title="출석 완료"></span>` : "";
    grid.insertAdjacentHTML("beforeend", `<button class="day-cell${todayClass}" data-date="${key}" type="button"><span class="day-num">${d}</span>${dot}${star}</button>`);
  }

  $$(".day-cell[data-date]").forEach(btn => {
    btn.addEventListener("click", () => {
      const rec = loadProgress()[btn.dataset.date];
      if (!rec) {
        $("#cheerBox").textContent = `${btn.dataset.date}: 아직 기록이 없습니다.`;
      } else if (rec.completed) {
        const score = rec.quizzes?.at(-1);
        $("#cheerBox").textContent = `${btn.dataset.date}: ⭐ 학습 완료! ${score ? `마지막 퀴즈 ${score.score}/${score.total}점` : ""}`;
      } else {
        $("#cheerBox").textContent = `${btn.dataset.date}: 출석 기록이 있습니다. 단어 학습과 퀴즈를 완료하면 별이 표시됩니다.`;
      }
    });
  });
}

function updateCheer() {
  const stars = Object.values(loadProgress()).filter(r => r.completed).length;
  const today = loadProgress()[localDateKey()];
  if (today?.completed) {
    $("#cheerBox").textContent = CHEERS[Math.min(stars - 1, CHEERS.length - 1)] || CHEERS[0];
  } else if (today?.studied) {
    $("#cheerBox").textContent = "단어 학습 완료! 이제 퀴즈를 풀면 오늘 날짜에 별이 생깁니다. ✨";
  } else {
    $("#cheerBox").textContent = "오늘 학습을 완료하면 달력에 별이 생깁니다. 🌟";
  }
}

function filteredWords() {
  const q = $("#questionFilter").value;
  const pos = $("#posFilter").value;
  const search = ($("#wordSearch").value || "").toLowerCase().trim();
  return WORD_BANK.filter(w => {
    const matchesQ = q === "all" || w.q === q;
    const matchesPos = pos === "all" || w.pos === pos;
    const hay = `${w.word} ${w.meaning} ${w.synonyms.join(" ")} ${w.antonyms.join(" ")}`.toLowerCase();
    const matchesSearch = !search || hay.includes(search);
    return matchesQ && matchesPos && matchesSearch;
  });
}

function renderWords() {
  const words = filteredWords();
  $("#wordCountText").textContent = `표시 단어 ${words.length}개 / 전체 ${WORD_BANK.length}개`;
  const list = $("#wordList");
  list.innerHTML = "";
  words.forEach(w => {
    list.insertAdjacentHTML("beforeend", `
      <article class="word-card">
        <div class="word-top">
          <div>
            <div class="word">${escapeHtml(w.word)}</div>
            <span class="pos-tag">${escapeHtml(w.pos)}</span>
          </div>
          <span class="qtag">${escapeHtml(w.q)}번</span>
        </div>
        <p class="meaning">${escapeHtml(w.meaning)}</p>
        <p class="meta"><strong>유의어</strong> ${escapeHtml(w.synonyms.join(", "))}</p>
        <p class="meta"><strong>반의어</strong> ${escapeHtml(w.antonyms.join(", "))}</p>
        <p class="example">${escapeHtml(w.example)}</p>
      </article>
    `);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}

function markStudyComplete() {
  const progress = loadProgress();
  const today = localDateKey();
  if (!progress[today]) progress[today] = { attended: true, studied: false, completed: false, quizzes: [], wrongs: [] };
  progress[today].studied = true;
  progress[today].attended = true;
  saveProgress(progress);
  alert("단어 학습 완료! 이제 퀴즈를 풀 수 있습니다. ✨");
  showView("quiz");
}

function renderQuizGate() {
  const studied = loadProgress()[localDateKey()]?.studied;
  $("#quizLock").classList.toggle("hidden", !!studied);
  $("#quizSetup").classList.toggle("hidden", !studied);
  $("#quizForm").classList.add("hidden");
  $("#quizResult").classList.add("hidden");
}

function wordsForQuiz() {
  const scope = $("#quizScope").value;
  return WORD_BANK.filter(w => scope === "all" || w.q === scope);
}

function makeMeaningQuestion(w, idx) {
  const distractors = sample(WORD_BANK.filter(x => x.word !== w.word).map(x => x.meaning), 3);
  const options = shuffle([w.meaning, ...distractors]);
  return { id: `${idx}-meaning-${w.word}`, type: "뜻", word: w.word, q: w.q, prompt: `<strong>${w.word}</strong>의 뜻으로 가장 알맞은 것은?`, options, answer: w.meaning, hint: `${w.word} = ${w.meaning}` };
}

function makeBlankQuestion(w, idx) {
  const pool = WORD_BANK.filter(x => x.word !== w.word && x.pos === w.pos);
  const source = pool.length >= 3 ? pool : WORD_BANK.filter(x => x.word !== w.word);
  const distractors = sample(source.map(x => x.word), 3);
  const options = shuffle([w.word, ...distractors]);
  return { id: `${idx}-blank-${w.word}`, type: "빈칸", word: w.word, q: w.q, prompt: `${escapeHtml(w.blank)}`, options, answer: w.word, hint: `문맥상 ${w.meaning}의 의미가 필요합니다.` };
}

function makeNotSynonymQuestion(w, idx) {
  const wrong = w.antonyms[0] || sample(WORD_BANK.filter(x => x.word !== w.word).map(x => x.word), 1)[0];
  let options = [...w.synonyms.slice(0,3), wrong];
  if (options.length < 4) options = [...options, ...sample(WORD_BANK.map(x => x.word), 4 - options.length)];
  options = shuffle(options.slice(0,4));
  return { id: `${idx}-notSyn-${w.word}`, type: "유의어 제외", word: w.word, q: w.q, prompt: `<strong>${w.word}</strong>의 유의어가 <u>아닌</u> 것은?`, options, answer: wrong, hint: `${w.word}의 유의어: ${w.synonyms.join(", ")}` };
}

function startQuiz() {
  const selectedTypes = $$(".quizType:checked").map(input => input.value);
  if (!selectedTypes.length) {
    alert("문제 유형을 1개 이상 선택하세요.");
    return;
  }

  let pool = wordsForQuiz();
  if ($("#shuffleMode").value === "yes") pool = shuffle(pool);
  const requested = $("#quizCount").value === "all" ? pool.length : Number($("#quizCount").value);
  const count = Math.min(requested, pool.length);
  pool = pool.slice(0, count);

  currentQuiz = pool.map((w, idx) => {
    const type = selectedTypes[idx % selectedTypes.length];
    if (type === "meaning") return makeMeaningQuestion(w, idx);
    if (type === "blank") return makeBlankQuestion(w, idx);
    return makeNotSynonymQuestion(w, idx);
  });
  renderQuizForm();
}

function renderQuizForm() {
  const form = $("#quizForm");
  form.innerHTML = "";
  currentQuiz.forEach((q, idx) => {
    const options = q.options.map((option, optIdx) => `
      <label class="option">
        <input type="radio" name="${q.id}" value="${escapeHtml(option)}" required />
        <span>${String.fromCharCode(9312 + optIdx)} ${escapeHtml(option)}</span>
      </label>
    `).join("");
    form.insertAdjacentHTML("beforeend", `
      <article class="question-card">
        <p class="question-title">${idx + 1}. <span class="qtag">${escapeHtml(q.q)}번</span> <span class="pos-tag">${escapeHtml(q.type)}</span></p>
        <p>${q.prompt}</p>
        <div class="options">${options}</div>
      </article>
    `);
  });
  form.insertAdjacentHTML("beforeend", `<div class="submit-row"><button class="primary-btn" type="submit">채점하고 오답노트 만들기</button></div>`);
  $("#quizSetup").classList.add("hidden");
  $("#quizResult").classList.add("hidden");
  form.classList.remove("hidden");
}

function gradeQuiz(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  let score = 0;
  const wrongs = [];
  const details = currentQuiz.map(q => {
    const studentAnswer = data.get(q.id);
    const correct = studentAnswer === q.answer;
    if (correct) score += 1;
    if (!correct) wrongs.push({
      date: localDateKey(),
      q: q.q,
      word: q.word,
      type: q.type,
      prompt: stripHtml(q.prompt),
      studentAnswer,
      answer: q.answer,
      hint: q.hint
    });
    return { word: q.word, type: q.type, studentAnswer, answer: q.answer, correct };
  });

  const progress = loadProgress();
  const today = localDateKey();
  if (!progress[today]) progress[today] = { attended: true, studied: true, completed: false, quizzes: [], wrongs: [] };
  progress[today].attended = true;
  progress[today].studied = true;
  progress[today].completed = true;
  progress[today].quizzes = progress[today].quizzes || [];
  progress[today].wrongs = progress[today].wrongs || [];
  progress[today].quizzes.push({ time: new Date().toLocaleString(), score, total: currentQuiz.length, details });
  progress[today].wrongs.push(...wrongs);
  saveProgress(progress);

  renderResult(score, currentQuiz.length, wrongs);
  renderDashboard();
}

function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

function renderResult(score, total, wrongs) {
  const percent = Math.round((score / total) * 100);
  const box = $("#quizResult");
  box.innerHTML = `
    <p class="score-big">${score}/${total}</p>
    <h3>${percent >= 80 ? "훌륭해요!" : percent >= 60 ? "좋아요, 오답을 복습해요." : "오답노트로 다시 정리해요."}</h3>
    <p>오늘 날짜에 학습 완료 별이 표시되었습니다. ⭐</p>
    <div class="button-row">
      <button class="secondary-btn" type="button" data-jump="wrongnote">오답노트 보기</button>
      <button class="outline-btn" type="button" id="retryQuizBtn">다시 풀기</button>
    </div>
  `;
  $("#quizForm").classList.add("hidden");
  box.classList.remove("hidden");
  $("#retryQuizBtn").addEventListener("click", () => {
    $("#quizResult").classList.add("hidden");
    $("#quizSetup").classList.remove("hidden");
  });
  $$('[data-jump="wrongnote"]').forEach(btn => btn.addEventListener("click", () => showView("wrongnote")));
}

function allWrongNotes() {
  const progress = loadProgress();
  return Object.entries(progress).flatMap(([date, record]) => (record.wrongs || []).map(w => ({ ...w, date })));
}

function renderWrongNotes(mode = "today") {
  currentMode = mode;
  const list = $("#wrongNoteList");
  const notes = mode === "today" ? (loadProgress()[localDateKey()]?.wrongs || []) : allWrongNotes();
  list.innerHTML = "";
  if (!notes.length) {
    list.innerHTML = `<div class="lock-card">아직 오답이 없습니다. 퀴즈를 풀면 자동으로 오답노트가 만들어집니다. 🙂</div>`;
    return;
  }
  notes.slice().reverse().forEach(n => {
    list.insertAdjacentHTML("beforeend", `
      <article class="wrong-card">
        <p class="wrong-meta">${escapeHtml(n.date)} · ${escapeHtml(n.q)}번 · ${escapeHtml(n.type)}</p>
        <h3>${escapeHtml(n.word)}</h3>
        <p><strong>문제</strong> ${escapeHtml(n.prompt)}</p>
        <p><span class="incorrect">내 답:</span> ${escapeHtml(n.studentAnswer || "미선택")}</p>
        <p><span class="correct">정답:</span> ${escapeHtml(n.answer)}</p>
        <p><strong>복습 힌트</strong> ${escapeHtml(n.hint)}</p>
        <div class="pill-row"><span class="pill">오답 복습</span><span class="pill">${escapeHtml(n.q)}번 지문</span></div>
      </article>
    `);
  });
}

function clearToday() {
  if (!confirm("오늘 기록을 삭제할까요? 출석, 학습 완료, 퀴즈, 오답이 모두 삭제됩니다.")) return;
  const progress = loadProgress();
  delete progress[localDateKey()];
  saveProgress(progress);
  todayRecord();
  renderDashboard();
  renderWrongNotes(currentMode);
}

function copyProgress() {
  const progress = loadProgress();
  const stars = Object.values(progress).filter(r => r.completed).length;
  const text = `[SAWL AI Vocab Lab 학습 기록]\n학생: ${currentUser.id} ${currentUser.name}\n누적 별: ${stars}개\n기록:\n${JSON.stringify(progress, null, 2)}`;
  navigator.clipboard?.writeText(text).then(() => alert("학습 기록이 복사되었습니다."), () => alert(text));
}

function bindEvents() {
  $("#loginBtn").addEventListener("click", () => {
    const student = isValidStudent($("#studentId").value, $("#studentName").value);
    if (!student) {
      $("#loginMsg").textContent = "학번 또는 이름이 명단과 일치하지 않습니다. 다시 확인하세요.";
      $("#loginMsg").className = "msg error";
      return;
    }
    currentUser = student;
    todayRecord();
    $("#loginView").classList.add("hidden");
    $("#appView").classList.remove("hidden");
    $("#loginMsg").textContent = "";
    showView("dashboard");
  });

  $("#studentName").addEventListener("keydown", e => { if (e.key === "Enter") $("#loginBtn").click(); });
  $("#studentId").addEventListener("keydown", e => { if (e.key === "Enter") $("#loginBtn").click(); });
  $("#logoutBtn").addEventListener("click", () => location.reload());
  $$(".tab").forEach(tab => tab.addEventListener("click", () => showView(tab.dataset.target)));
  $$('[data-jump]').forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.jump)));
  $("#prevMonth").addEventListener("click", () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1); renderCalendar(); });
  $("#nextMonth").addEventListener("click", () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1); renderCalendar(); });
  ["#questionFilter", "#posFilter", "#wordSearch"].forEach(sel => $(sel).addEventListener("input", renderWords));
  $("#completeStudyBtn").addEventListener("click", markStudyComplete);
  $("#startQuizBtn").addEventListener("click", startQuiz);
  $("#quizForm").addEventListener("submit", gradeQuiz);
  $("#showTodayWrong").addEventListener("click", () => renderWrongNotes("today"));
  $("#showAllWrong").addEventListener("click", () => renderWrongNotes("all"));
  $("#clearTodayBtn").addEventListener("click", clearToday);
  $("#copyProgressBtn").addEventListener("click", copyProgress);
}

function init() {
  fillSelectors();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);
