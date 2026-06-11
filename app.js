const STORAGE_KEY = 'sawl-reading-blog-page86-no4-v2';
const state = loadState();
let currentStep = state.currentStep || 1;

const segments = [
  {
    label: 'Topic',
    text: 'Although technology has the potential to increase productivity, it can also have a negative impact on productivity.',
    answers: [
      ['technology'],
      ['negative productivity','negative impact','negative impact on productivity','less productivity']
    ]
  },
  {
    label: 'Example',
    text: 'For example, in many office environments workers sit at desks with computers and have access to the internet.',
    answers: [
      ['computers','computer'],
      ['internet','access to the internet']
    ]
  },
  {
    label: 'Example',
    text: '① They are able to check their personal e-mails and use social media whenever they want to.',
    answers: [
      ['personal emails','personal e-mails','emails','e-mails'],
      ['social media']
    ]
  },
  {
    label: 'Result',
    text: '② This can stop them from doing their work and make them less productive.',
    answers: [
      ['stop','stop doing work','stop them'],
      ['less productive','less productivity']
    ]
  },
  {
    label: 'Add',
    text: '③ Introducing new technology can also have a negative impact on production when it causes a change to the production process or requires workers to learn a new system.',
    answers: [
      ['new technology','introducing new technology'],
      ['change learn','change','learn','new system','production process','requires workers to learn']
    ]
  },
  {
    label: 'Result',
    text: '④ Using technology can enable businesses to produce more goods and to get more out of the other factors of production.',
    answers: [
      ['technology','using technology','new technology'],
      ['more goods','produce more goods','get more out','factors of production']
    ]
  },
  {
    label: 'Result',
    text: '⑤ Learning to use new technology can be time consuming and stressful for workers and this can cause a decline in productivity.',
    answers: [
      ['new technology','learning to use new technology','time consuming','time-consuming'],
      ['decline in productivity','decline','stressful','time consuming stressful']
    ]
  }
];

const words = [
  {word:'potential', pos:'n./adj.', meaning:'가능성 / 잠재적인'},
  {word:'productivity', pos:'n.', meaning:'생산성'},
  {word:'impact', pos:'n./v.', meaning:'영향 / 영향을 주다'},
  {word:'environment', pos:'n.', meaning:'환경'},
  {word:'access', pos:'n./v.', meaning:'접근 / 접근하다'},
  {word:'personal', pos:'adj.', meaning:'개인적인'},
  {word:'introduce', pos:'v.', meaning:'도입하다'},
  {word:'require', pos:'v.', meaning:'요구하다'},
  {word:'time-consuming', pos:'adj.', meaning:'시간이 많이 걸리는'},
  {word:'decline', pos:'n./v.', meaning:'감소 / 감소하다'}
];

function loadState(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {completed:{}};}catch(e){return {completed:{}};}
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateSteps();
}
function normalize(v){
  return String(v || '').toLowerCase().replace(/[‐‑‒–—]/g,'-').replace(/[^a-z0-9가-힣\s-]/g,' ').replace(/\s+/g,' ').trim();
}
function matches(value, accepted){
  const v = normalize(value);
  if(!v) return false;
  return accepted.some(a=>{
    const aa = normalize(a);
    return v === aa || v.includes(aa) || aa.includes(v);
  });
}
function escapeAttr(value){
  return String(value || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderAnalysis(){
  const box = document.getElementById('analysisList');
  box.innerHTML = segments.map((seg, i)=>{
    const v1 = state[`kw_${i}_1`] || '';
    const v2 = state[`kw_${i}_2`] || '';
    return `
      <article class="analysis-card">
        <span class="flow-chip">${seg.label}</span>
        <p class="sentence-text">${seg.text}</p>
        <div class="keyword-row">
          <input data-kw="kw_${i}_1" value="${escapeAttr(v1)}" placeholder="keyword 1" aria-label="${seg.label} keyword 1" />
          <input data-kw="kw_${i}_2" value="${escapeAttr(v2)}" placeholder="keyword 2" aria-label="${seg.label} keyword 2" />
        </div>
      </article>`;
  }).join('');
  document.querySelectorAll('[data-kw]').forEach(input=>{
    input.addEventListener('input',()=>{
      state[input.dataset.kw] = input.value;
      input.classList.remove('correct','incorrect');
      state.completed.step1 = false;
      saveState();
    });
  });
}

function renderWords(){
  const box = document.getElementById('wordGrid');
  box.innerHTML = words.map((w,i)=>`
    <label class="word-card">
      <input type="checkbox" class="word-check" data-word="${i}" ${state[`word_${i}`]?'checked':''}/>
      <span><b>${w.word}</b><small>${w.pos}</small><p>${w.meaning}</p></span>
    </label>`).join('');
  document.querySelectorAll('.word-check').forEach(cb=>{
    cb.addEventListener('change',()=>{
      state[`word_${cb.dataset.word}`] = cb.checked;
      saveState();
    });
  });
}

function checkKeywords(){
  let allCorrect = true;
  let filled = true;
  segments.forEach((seg,i)=>{
    [1,2].forEach((num,idx)=>{
      const key = `kw_${i}_${num}`;
      const input = document.querySelector(`[data-kw="${key}"]`);
      const ok = matches(input.value, seg.answers[idx]);
      input.classList.toggle('correct', ok);
      input.classList.toggle('incorrect', !ok);
      if(!input.value.trim()) filled = false;
      if(!ok) allCorrect = false;
    });
  });
  const feedback = document.getElementById('keywordFeedback');
  feedback.className = 'feedback show';
  if(!filled){
    feedback.classList.add('bad');
    feedback.textContent = '🔴 모든 칸에 keyword를 2개씩 입력한 뒤 다시 CHECK 하세요.';
    state.completed.step1 = false;
  }else if(allCorrect){
    feedback.classList.add('good');
    feedback.textContent = '🟢 좋아요. 근거를 들어 설명할 수 있는지 확인하세요.';
    state.completed.step1 = true;
    state.currentStep = Math.max(state.currentStep || 1, 2);
  }else{
    feedback.classList.add('bad');
    feedback.textContent = '🔴 다시 생각해 보세요. 앞뒤 흐름과 같은 방향인지 확인하세요.';
    state.completed.step1 = false;
  }
  saveState();
}

function bindTextSaves(){
  document.querySelectorAll('[data-save]').forEach(el=>{
    const key = el.dataset.save;
    if(state[key]) el.value = state[key];
    el.addEventListener('input',()=>{
      state[key] = el.value;
      saveState();
    });
  });
}
function bindStepNav(){
  document.querySelectorAll('.step-item').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const step = Number(btn.dataset.step);
      if(!canOpen(step)){
        flashMessage(step);
        return;
      }
      showStep(step);
    });
  });
  document.querySelector('.todo-toggle').addEventListener('click',()=>{
    const list = document.querySelector('.step-list');
    const hidden = list.style.display === 'none';
    list.style.display = hidden ? 'grid' : 'none';
    document.querySelector('.todo-toggle').setAttribute('aria-expanded', String(hidden));
  });
}
function canOpen(step){
  if(step === 1) return true;
  if(step === 2) return !!state.completed.step1;
  if(step === 3) return !!state.completed.step1 && !!state.completed.step2;
  if(step === 4) return !!state.completed.step1 && !!state.completed.step2 && !!state.completed.step3;
  return false;
}
function flashMessage(step){
  const note = document.getElementById('sideNote');
  note.textContent = `${step-1}단계를 먼저 완료하세요.`;
  note.style.color = '#ffd36a';
  setTimeout(()=>{note.textContent='순서대로 완성하면 별표가 표시됩니다.'; note.style.color='#dfeeff';},1800);
}
function showStep(step){
  currentStep = step;
  state.currentStep = step;
  document.querySelectorAll('.step-page').forEach(page=>page.classList.remove('current'));
  document.getElementById(`step${step}`).classList.add('current');
  document.querySelectorAll('.step-item').forEach(btn=>btn.classList.toggle('active', Number(btn.dataset.step) === step));
  saveState();
  window.scrollTo({top:0,behavior:'smooth'});
}
function updateSteps(){
  document.querySelectorAll('.step-item').forEach(btn=>{
    const step = Number(btn.dataset.step);
    btn.classList.toggle('locked', !canOpen(step));
    btn.classList.toggle('active', step === currentStep);
  });
  for(let i=1;i<=4;i++){
    const star = document.getElementById(`star${i}`);
    const done = !!state.completed[`step${i}`];
    star.textContent = done ? '★' : '☆';
  }
}
function bindCompleteButtons(){
  document.getElementById('checkKeywords').addEventListener('click',checkKeywords);
  document.getElementById('completeNote').addEventListener('click',()=>{
    state.completed.step2 = true;
    state.currentStep = Math.max(state.currentStep || 1, 3);
    saveState();
    showStep(3);
  });
  document.getElementById('completeStructure').addEventListener('click',()=>{
    const required = ['mapExample','mapResult1','mapAdd','mapCause','mapResult2','topicSentence'];
    const missing = required.some(k=>!String(state[k] || '').trim());
    if(missing){
      alert('지문 구조 정리와 주제문을 먼저 작성하세요.');
      return;
    }
    state.completed.step3 = true;
    state.currentStep = Math.max(state.currentStep || 1, 4);
    saveState();
    showStep(4);
  });
  document.getElementById('completeWords').addEventListener('click',()=>{
    const checked = words.filter((_,i)=>state[`word_${i}`]).length;
    if(checked < 10){
      alert('오늘의 단어 10개를 모두 확인하세요.');
      return;
    }
    state.completed.step4 = true;
    saveState();
    alert('완료! 오늘의 Reading Blog를 마쳤습니다. ★');
  });
  document.getElementById('resetAll').addEventListener('click',()=>{
    if(confirm('이 기기에 저장된 기록을 초기화할까요?')){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
}

renderAnalysis();
renderWords();
bindTextSaves();
bindStepNav();
bindCompleteButtons();
if(!canOpen(currentStep)) currentStep = 1;
showStep(currentStep);
updateSteps();
