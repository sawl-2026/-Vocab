const STORAGE_KEY = "sawlReadingCompletedV11";
const ATTEMPT_KEY = "sawlReadingAttemptsV11";
const FORM_KEY = "sawlReadingFormV11";
const META_KEY = "sawlReadingMetaV15";

const sentences = [
  {no:"",label:"주제",text:"Although technology has the potential to increase productivity, it can also have a negative impact on productivity.",hint:"impact을 기준으로 앞에서 원인의 어구를, 뒤에서 결과의 어구를 찾아보세요.",allowed:["technology","negative","impact","productivity"],reveal:"technology"},
  {no:"",label:"예시",text:"For example, in many office environments workers sit at desks with computers and have access to the internet.",hint:"technology의 예시 단어들을 찾아보세요.",allowed:["computers","internet"],reveal:"computers"},
  {no:"①",label:"예시",text:"They are able to check their personal e-mails and use social media whenever they want to.",hint:"internet의 예시 단어들을 찾아보세요.",allowed:["e-mails","social media"],reveal:"e-mails"},
  {no:"②",label:"결과",text:"This can stop them from doing their work and make them less productive.",hint:"negative impact을 나타내는 같은 맥락의 단어들을 찾아보세요.",allowed:["stop","less","productive"],reveal:"stop"},
  {no:"③",label:"추가",text:"Introducing new technology can also have a negative impact on production when it causes a change to the production process or requires workers to learn a new system.",hint:"cause를 기준으로 앞에서 원인의 어구를, 뒤에서 결과의 어구를 찾아보세요.",allowed:["technology","change","learn"],reveal:"technology"},
  {no:"④",label:"결과",text:"Using technology can enable businesses to produce more goods and to get more out of the other factors of production.",hint:"enable를 기준으로 앞에서 원인의 어구를, 뒤에서 결과의 어구를 찾아보세요.",allowed:["technology","more"],reveal:"more"},
  {no:"⑤",label:"결과",text:"Learning to use new technology can be time consuming and stressful for workers and this can cause a decline in productivity.",hint:"negative impact을 나타내는 같은 맥락의 단어들을 찾아보세요.",allowed:["time","consuming","stressful","decline","productivity"],reveal:"stressful"}
];

const words = [{"word": "potential", "meaning": "가능성, 잠재적인", "pos": [["명사", "potential", "가능성"], ["동사", "-", "-"], ["형용사", "potential", "잠재적인"], ["부사", "potentially", "잠재적으로"]], "syn": [["possibility", "가능성", "실현될 수 있는 가능성"], ["capacity", "수용력, 능력", "어떤 일을 해낼 수 있는 능력"], ["capability", "능력", "기술·조건상 가능한 능력"], ["promise", "장래성", "앞으로 성공할 가능성"], ["likelihood", "가능성", "어떤 일이 일어날 확률"]], "similar": [["possible", "가능한", "실제로 가능함"], ["potent", "강력한", "효력이 강함"], ["possibly", "아마", "가능성을 나타내는 부사"], ["potentially", "잠재적으로", "아직 드러나지 않은 가능성"]]}, {"word": "productivity", "meaning": "생산성", "pos": [["명사", "productivity", "생산성"], ["동사", "produce", "생산하다"], ["형용사", "productive", "생산적인"], ["부사", "productively", "생산적으로"]], "syn": [["efficiency", "효율성", "시간·노력 대비 성과"], ["output", "산출량", "실제로 만들어진 양"], ["performance", "성과", "수행 결과"], ["yield", "생산량", "농업·산업 산출량"], ["effectiveness", "효과성", "목표 달성 정도"]], "similar": [["production", "생산", "생산하는 과정"], ["product", "제품", "생산된 물건"], ["productive", "생산적인", "성과를 내는"], ["producer", "생산자", "만드는 사람·회사"]]}, {"word": "impact", "meaning": "영향", "pos": [["명사", "impact", "영향"], ["동사", "impact", "영향을 주다"], ["형용사", "impactful", "영향력이 큰"], ["부사", "impactfully", "강한 영향을 주며"]], "syn": [["effect", "영향, 결과", "결과로 나타난 영향"], ["influence", "영향", "서서히 미치는 영향"], ["consequence", "결과", "어떤 일 뒤에 생기는 결과"], ["result", "결과", "직접적인 결과"], ["outcome", "결과", "최종적으로 나타난 결과"]], "similar": [["affect", "영향을 미치다", "동사로 주로 사용"], ["effect", "영향, 결과", "명사로 주로 사용"], ["infect", "감염시키다", "발음·철자 혼동 주의"], ["compact", "촘촘한", "-pact가 같지만 뜻 다름"]]}, {"word": "environment", "meaning": "환경", "pos": [["명사", "environment", "환경"], ["동사", "-", "-"], ["형용사", "environmental", "환경의"], ["부사", "environmentally", "환경적으로"]], "syn": [["surroundings", "주변 환경", "주변에 있는 것들"], ["setting", "환경, 배경", "상황이 놓인 배경"], ["condition", "조건", "영향을 주는 상태"], ["context", "맥락", "이해에 필요한 배경"], ["atmosphere", "분위기", "공간의 느낌"]], "similar": [["environmental", "환경의", "형용사"], ["envelope", "봉투", "철자 혼동"], ["involvement", "관여", "철자 길이 혼동"], ["element", "요소", "뜻 다름"]]}, {"word": "access", "meaning": "접근, 이용", "pos": [["명사", "access", "접근, 이용"], ["동사", "access", "접근하다, 이용하다"], ["형용사", "accessible", "접근 가능한"], ["부사", "accessibly", "접근하기 쉽게"]], "syn": [["entry", "입장, 접근", "안으로 들어감"], ["availability", "이용 가능성", "사용할 수 있는 상태"], ["approach", "접근", "가까이 가는 방법"], ["admission", "입장 허가", "들어갈 수 있는 허가"], ["use", "이용", "실제로 사용함"]], "similar": [["assess", "평가하다", "철자 혼동"], ["excess", "과잉", "발음 유사"], ["accessible", "접근 가능한", "형용사"], ["accessory", "부속품", "뜻 다름"]]}, {"word": "introduce", "meaning": "도입하다", "pos": [["명사", "introduction", "도입"], ["동사", "introduce", "도입하다"], ["형용사", "introductory", "도입의"], ["부사", "-", "-"]], "syn": [["bring in", "도입하다", "새 제도·기술을 들여옴"], ["present", "제시하다", "사람들에게 보여 줌"], ["launch", "시작하다", "새 제품·서비스를 시작함"], ["start", "시작하다", "일반적인 시작"], ["initiate", "개시하다", "공식적으로 시작함"]], "similar": [["produce", "생산하다", "철자 일부 유사"], ["reduce", "줄이다", "-duce 형태"], ["induce", "유발하다", "-duce 형태"], ["introduction", "도입", "명사형"]]}, {"word": "process", "meaning": "과정", "pos": [["명사", "process", "과정"], ["동사", "process", "처리하다"], ["형용사", "processed", "처리된"], ["부사", "-", "-"]], "syn": [["procedure", "절차", "정해진 순서"], ["method", "방법", "어떤 일을 하는 방식"], ["operation", "작업, 운용", "실제 작동 과정"], ["system", "체계", "연결된 구조"], ["course", "진행 과정", "시간에 따른 흐름"]], "similar": [["progress", "진전", "앞으로 나아감"], ["proceed", "진행하다", "계속하다"], ["processor", "처리 장치", "컴퓨터 관련"], ["processed", "가공된", "형용사"]]}, {"word": "require", "meaning": "요구하다", "pos": [["명사", "requirement", "요구 사항"], ["동사", "require", "요구하다"], ["형용사", "required", "필수의"], ["부사", "-", "-"]], "syn": [["need", "필요로 하다", "필요성 강조"], ["demand", "강하게 요구하다", "강한 요구"], ["call for", "필요로 하다", "상황상 요구됨"], ["involve", "수반하다", "함께 필요함"], ["necessitate", "필요하게 만들다", "공식적 표현"]], "similar": [["request", "요청하다", "부탁의 의미"], ["acquire", "획득하다", "철자 혼동"], ["inquire", "문의하다", "-quire 형태"], ["requirement", "요구 사항", "명사형"]]}, {"word": "enable", "meaning": "가능하게 하다", "pos": [["명사", "enablement", "가능하게 함"], ["동사", "enable", "가능하게 하다"], ["형용사", "enabled", "가능해진"], ["부사", "-", "-"]], "syn": [["allow", "허용하다", "할 수 있게 허락함"], ["permit", "허가하다", "공식적으로 허용함"], ["help", "돕다", "가능하도록 도움"], ["make possible", "가능하게 만들다", "결과적으로 가능하게 함"], ["empower", "힘을 주다", "할 능력을 부여함"]], "similar": [["unable", "할 수 없는", "반대 의미"], ["ability", "능력", "관련 명사"], ["enablement", "가능하게 함", "명사형"], ["enlarge", "확대하다", "en-으로 시작하지만 뜻 다름"]]}, {"word": "decline", "meaning": "감소, 감소하다", "pos": [["명사", "decline", "감소"], ["동사", "decline", "감소하다, 거절하다"], ["형용사", "declining", "감소하는"], ["부사", "-", "-"]], "syn": [["decrease", "감소하다", "양이 줄어듦"], ["drop", "떨어지다", "갑자기 줄어듦"], ["fall", "하락하다", "수치가 내려감"], ["reduction", "감소", "줄어든 결과"], ["downturn", "하락세", "경제·상황의 악화"]], "similar": [["decrease", "감소하다", "dec-로 시작"], ["declare", "선언하다", "decl-로 시작"], ["decorate", "장식하다", "dec-로 시작"], ["decide", "결정하다", "dec-로 시작"]]}];

const state = {
  completed: JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
  attempts: JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "{}"),
  selected: [],
  cardIndex: 0,
  quizQuestions: [],
  meta: JSON.parse(localStorage.getItem(META_KEY) || "{}")
};

const analysisList = document.getElementById("analysisList");
const afterFeedback = document.getElementById("afterFeedback");

function normalize(str){
  return (str || "").toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, " ").replace(/\s+/g, " ").trim();
}
function getMatched(value, allowed){
  const v = normalize(value);
  if(!v) return "";
  return allowed.find(term=>{
    const t = normalize(term);
    return v === t || v.split(" ").includes(t);
  }) || "";
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.completed));
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(state.attempts));
  localStorage.setItem(META_KEY, JSON.stringify(state.meta));
}
function saveFormData(){
  const items = [...document.querySelectorAll("input, textarea")].map(el => ({
    type: el.type,
    value: el.value,
    checked: el.checked
  }));
  localStorage.setItem(FORM_KEY, JSON.stringify(items));
  saveState();
}
function loadFormData(){
  const saved = JSON.parse(localStorage.getItem(FORM_KEY) || "[]");
  const elements = [...document.querySelectorAll("input, textarea")];
  saved.forEach((item, i)=>{
    const el = elements[i];
    if(!el) return;
    if(el.type === "checkbox" || el.type === "radio") el.checked = !!item.checked;
    else el.value = item.value || "";
  });
  if(state.meta.aiOpened) afterFeedback.hidden = false;
  updateSelectedWords();
}
function resetState(){
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ATTEMPT_KEY);
  localStorage.removeItem(FORM_KEY);
  localStorage.removeItem(META_KEY);
  location.reload();
}

function renderAnalysis(){
  analysisList.innerHTML = sentences.map((s,idx)=>`<article class="sentence-card" data-idx="${idx}">
    <div class="sentence-head"><span class="flow-label">${s.label}</span><span class="sentence-no ${s.no?'':'empty'}">${s.no}</span></div>
    <p class="sentence-text">${s.text}</p>
    <div class="keyword-row">
      <input class="keyword-input" type="text" placeholder="keyword 1" />
      <input class="keyword-input" type="text" placeholder="keyword 2" />
      <button class="check-btn" type="button">CHECK</button>
    </div>
    <div class="hint"></div>
  </article>`).join("");
  document.querySelectorAll(".sentence-card").forEach(card=>card.querySelector(".check-btn").addEventListener("click",()=>checkSentence(card)));
}

function setHint(hintBox, hint, reveal){
  const revealLine = reveal ? `<br><span class="red-check">✓</span> ${reveal}과 관련된 키워드를 한 개 더 찾아보세요.` : "";
  hintBox.innerHTML = `<span class="red-check">✓</span> ${hint}${revealLine}`;
}

function checkSentence(card){
  const idx = Number(card.dataset.idx);
  const data = sentences[idx];
  const inputs = [...card.querySelectorAll(".keyword-input")];
  const hintBox = card.querySelector(".hint");
  const values = inputs.map(i=>normalize(i.value));
  const matches = values.map(v=>getMatched(v, data.allowed));
  const bothCorrect = matches.every(Boolean) && values[0] !== values[1];

  inputs.forEach((input,i)=>{
    input.classList.remove("correct","wrong");
    if(matches[i]) input.classList.add("correct");
    else if(values[i]) input.classList.add("wrong");
  });

  if(bothCorrect){
    hintBox.classList.remove("show");
    hintBox.textContent = "";
    saveFormData();
    return;
  }

  state.attempts[idx] = (state.attempts[idx] || 0) + 1;
  saveState();
  hintBox.classList.add("show");
  setHint(hintBox, data.hint, state.attempts[idx] >= 2 ? data.reveal : "");
  saveFormData();
}

function currentUnlockedMax(){
  let max=1;
  if(state.completed[1]) max=2;
  if(state.completed[2]) max=3;
  if(state.completed[3]) max=4;
  return max;
}
function updateTodo(){
  const unlockedMax = currentUnlockedMax();
  document.querySelectorAll(".todo-item").forEach(btn=>{
    const step = Number(btn.dataset.step);
    btn.classList.toggle("done", !!state.completed[step]);
    btn.classList.toggle("locked", step > unlockedMax);
    btn.disabled = step > unlockedMax;
  });
}
function showStep(step){
  document.querySelectorAll(".step-page").forEach(p=>p.classList.remove("active"));
  document.getElementById(`step-${step}`).classList.add("active");
  document.querySelectorAll(".todo-item").forEach(b=>b.classList.remove("active"));
  document.querySelector(`.todo-item[data-step="${step}"]`).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

function validateStep1(){
  const inputs = [...document.querySelectorAll('#step-1 .keyword-input')];
  const ok = inputs.every(input => input.value.trim().length > 0);
  if(!ok){
    alert("1단계의 모든 keyword 칸을 채워 주세요.");
    return false;
  }
  return true;
}

function validateStep2(){
  if(!state.meta.uploadClicked){
    alert("UPLOAD를 먼저 눌러 주세요.");
    return false;
  }
  return true;
}
function validateStep3(){
  if(afterFeedback.hidden){
    alert("AI FEEDBACK 버튼을 먼저 눌러 주세요.");
    return false;
  }
  const fields = [...document.querySelectorAll('#step-3 textarea')];
  const ok = fields.every(el => el.value.trim().length > 0);
  if(!ok){
    alert("모든 칸에 내용을 써 주세요.");
    return false;
  }
  return true;
}
function quizAllAnswered(){
  if(!state.quizQuestions.length) return false;
  return state.quizQuestions.every((q,idx)=> !!document.querySelector(`input[name="quiz${idx}"]:checked`));
}

function completeStep(step){
  state.completed[step] = true;
  saveFormData();
  updateTodo();
  if(step < 4) showStep(step+1);
}

document.querySelectorAll(".todo-item").forEach(btn=>btn.addEventListener("click",()=>{
  const step = Number(btn.dataset.step);
  if(btn.disabled) return;
  showStep(step);
}));
document.getElementById("finishStep1").addEventListener("click",()=>{ if(validateStep1()) completeStep(1); });
document.getElementById("finishStep2").addEventListener("click",()=>{ if(validateStep2()) completeStep(2); });
document.getElementById("finishStep3").addEventListener("click",()=>{ if(validateStep3()) completeStep(3); });
document.getElementById("saveProgress").addEventListener("click",()=>{saveFormData();alert("저장되었습니다.");});
document.getElementById("resetProgress").addEventListener("click",()=>{if(confirm("초기화하시겠습니까?")) resetState();});
document.getElementById("uploadBtn").addEventListener("click",()=>{ state.meta.uploadClicked = true; saveState(); });
document.getElementById("aiFeedbackBtn").addEventListener("click",()=>{ afterFeedback.hidden = false; state.meta.aiOpened = true; saveState(); setTimeout(saveFormData, 100); });

function renderWordSelect(){
  document.getElementById("wordSelect").innerHTML = words.map((w,idx)=>`<label><input type="checkbox" data-idx="${idx}" /> ${w.word}</label>`).join("");
  document.querySelectorAll('#wordSelect input').forEach(input=>input.addEventListener('change',()=>{
    updateSelectedWords();
    saveFormData();
  }));
}
function updateSelectedWords(){
  state.selected = [...document.querySelectorAll('#wordSelect input:checked')].map(box=>words[Number(box.dataset.idx)]);
  if(state.selected.length){
    document.getElementById('wordStudy').hidden = false;
    if(state.cardIndex >= state.selected.length) state.cardIndex = 0;
    renderCard();
  }else{
    document.getElementById('wordStudy').hidden = true;
  }
}
function tableFromRows(headers, rows){
  return `<table class="word-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}
function posRows(rows){
  return rows.map(row => [row[1], row[2], row[0]]);
}
function similarPartOfSpeech(word){
  const map = {
    possible:"형용사", potent:"형용사", possibly:"부사", potentially:"부사",
    production:"명사", product:"명사", productive:"형용사", producer:"명사",
    affect:"동사", effect:"명사", infect:"동사", compact:"형용사",
    environmental:"형용사", envelope:"명사", involvement:"명사", element:"명사",
    assess:"동사", excess:"명사", accessible:"형용사", accessory:"명사",
    produce:"동사", reduce:"동사", induce:"동사", introduction:"명사",
    progress:"명사", proceed:"동사", processor:"명사", processed:"형용사",
    request:"동사", acquire:"동사", inquire:"동사", requirement:"명사",
    unable:"형용사", ability:"명사", enablement:"명사", enlarge:"동사",
    decrease:"동사", declare:"동사", decorate:"동사", decide:"동사"
  };
  return map[word] || "";
}
function similarRows(rows){
  return rows.map(row => [row[0], row[1], similarPartOfSpeech(row[0])]);
}
function renderCard(){
  const list = state.selected.length ? state.selected : words;
  const item = list[state.cardIndex % list.length];
  document.getElementById('cardWord').textContent = item.word;
  document.getElementById('cardMeaning').textContent = item.meaning;
  document.getElementById('cardBack').innerHTML = `
    <section class="info-section"><h4>&lt;품사별&gt;</h4>${tableFromRows(["단어","뜻","품사"], posRows(item.pos))}</section>
    <section class="info-section"><h4>&lt;동의어&gt;</h4>${tableFromRows(["단어","뜻","차이"], item.syn)}</section>
    <section class="info-section"><h4>&lt;비슷한&gt;</h4>${tableFromRows(["단어","뜻","품사"], similarRows(item.similar))}</section>`;
  document.getElementById('flipCard').classList.remove('flipped');
}
document.getElementById('flipCard').addEventListener('click',()=>document.getElementById('flipCard').classList.toggle('flipped'));
document.getElementById('prevCard').addEventListener('click',()=>{
  const list=state.selected.length?state.selected:words;
  state.cardIndex=(state.cardIndex-1+list.length)%list.length;
  renderCard();
});
document.getElementById('nextCard').addEventListener('click',()=>{
  const list=state.selected.length?state.selected:words;
  state.cardIndex=(state.cardIndex+1)%list.length;
  renderCard();
});

function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]); }
function choiceQuestion(q, options, answer){
  return {q, options: shuffle(options), answer};
}
function makeQuestions(){
  const pool = state.selected.length >= 6 ? state.selected : words;
  return [
    choiceQuestion(`${pool[0].word}의 뜻으로 알맞은 것은?`, [pool[0].meaning, "도입하다", "과정", "접근"], pool[0].meaning),
    choiceQuestion(`${pool[1].word}의 뜻으로 알맞은 것은?`, [pool[1].meaning, "환경", "감소", "가능하게 하다"], pool[1].meaning),
    choiceQuestion(`impact와 가장 가까운 뜻의 단어는?`, ["effect", "request", "entry", "method"], "effect"),
    choiceQuestion(`decline과 가장 가까운 뜻의 단어는?`, ["decrease", "permit", "setting", "capacity"], "decrease"),
    choiceQuestion(`Technology has the ______ to increase productivity.`, ["potential", "productive", "decline", "access"], "potential"),
    choiceQuestion(`This can cause a ______ in productivity.`, ["decline", "declining", "declined", "declines"], "decline")
  ];
}
function renderQuiz(){
  state.quizQuestions = makeQuestions();
  state.meta.quizMade = true;
  saveState();
  document.getElementById('quizResult').hidden = true;
  document.getElementById('quizArea').innerHTML = state.quizQuestions.map((q,idx)=>`
    <div class="quiz-item" data-q="${idx}">
      <p class="quiz-question">${idx+1}. ${q.q}</p>
      <div class="quiz-options">
        ${q.options.map((opt,oIdx)=>`<label><input type="radio" name="quiz${idx}" value="${opt}"> ${opt}</label>`).join('')}
      </div>
    </div>`).join('');
  saveFormData();
}
function gradeQuiz(){
  if(!state.quizQuestions.length){
    alert("단어 퀴즈를 먼저 만들어 주세요.");
    return;
  }
  if(!quizAllAnswered()){
    alert("단어 퀴즈를 모두 풀어 주세요.");
    return;
  }
  let score = 0;
  state.quizQuestions.forEach((q,idx)=>{
    const selected = document.querySelector(`input[name="quiz${idx}"]:checked`);
    const labels = [...document.querySelectorAll(`.quiz-item[data-q="${idx}"] .quiz-options label`)];
    labels.forEach(label=>{
      const input = label.querySelector('input');
      label.classList.remove('correct','wrong');
      if(input.value === q.answer) label.classList.add('correct');
      if(selected && input === selected && input.value !== q.answer) label.classList.add('wrong');
    });
    if(selected && selected.value === q.answer) score++;
  });
  const result = document.getElementById('quizResult');
  result.hidden = false;
  result.textContent = `점수: ${score} / ${state.quizQuestions.length}`;
  completeStep(4);
}
document.getElementById('makeQuiz').addEventListener('click',renderQuiz);
document.getElementById("finishStep4").addEventListener("click",gradeQuiz);

renderAnalysis();
renderWordSelect();
updateTodo();
loadFormData();
document.addEventListener("input",()=>saveFormData());
document.addEventListener("change",()=>saveFormData());
