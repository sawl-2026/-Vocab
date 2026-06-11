const STORAGE_KEY = 'sawl-reading-blog-page86-no4';
const GPT_LINK = 'https://chatgpt.com/g/g-6a2a4fd3ad708191b90fcbc0bdd982e8-sawl-feedback';
const CORRECT_CHOICE = '4';

const segments = [
  {
    label: '주제',
    text: 'Although technology has the potential to increase productivity, it can also have a negative impact on productivity.'
  },
  {
    label: '예시',
    text: 'For example, in many office environments workers sit at desks with computers and have access to the internet.'
  },
  {
    label: '예시',
    text: '① They are able to check their personal e-mails and use social media whenever they want to.'
  },
  {
    label: '결과',
    text: '② This can stop them from doing their work and make them less productive.'
  },
  {
    label: '추가',
    text: '③ Introducing new technology can also have a negative impact on production when it causes a change to the production process or requires workers to learn a new system.'
  },
  {
    label: '결과',
    text: '④ Using technology can enable businesses to produce more goods and to get more out of the other factors of production.'
  },
  {
    label: '결과',
    text: '⑤ Learning to use new technology can be time consuming and stressful for workers and this can cause a decline in productivity.'
  }
];

let state = loadState();
let selectedChoice = state.selectedChoice || '';

function loadState(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }catch(e){
    return {};
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateBadges();
}

function renderAnalysisCards(){
  const container = document.getElementById('analysisList');
  container.innerHTML = segments.map((item, index)=>{
    const k1 = state[`keyword_${index}_1`] || '';
    const k2 = state[`keyword_${index}_2`] || '';
    return `
      <article class="analysis-card">
        <div class="flow-tag">${item.label}</div>
        <div>
          <p class="analysis-text">${item.text}</p>
          <div class="keyword-row">
            <input data-field="keyword_${index}_1" value="${escapeAttr(k1)}" placeholder="핵심어 1" aria-label="${item.label} 핵심어 1" />
            <input data-field="keyword_${index}_2" value="${escapeAttr(k2)}" placeholder="핵심어 2" aria-label="${item.label} 핵심어 2" />
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function escapeAttr(value){
  return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function restoreInputs(){
  document.querySelectorAll('[data-save]').forEach(el=>{
    const key = el.dataset.save;
    if(state[key]) el.value = state[key];
    el.addEventListener('input',()=>{
      state[key] = el.value;
      saveState();
    });
  });
  document.querySelectorAll('[data-field]').forEach(el=>{
    el.addEventListener('input',()=>{
      state[el.dataset.field] = el.value;
      saveState();
    });
  });
  document.getElementById('classroomSubmitted').checked = !!state.classroomSubmitted;
  document.getElementById('classroomSubmitted').addEventListener('change',e=>{
    state.classroomSubmitted = e.target.checked;
    saveState();
  });
}

function setupChoices(){
  document.querySelectorAll('.choice').forEach(btn=>{
    btn.addEventListener('click',()=>{
      selectedChoice = btn.dataset.choice;
      state.selectedChoice = selectedChoice;
      document.querySelectorAll('.choice').forEach(b=>b.classList.remove('selected','wrong','ok'));
      btn.classList.add('selected');
      saveState();
    });
    if(btn.dataset.choice === selectedChoice){
      btn.classList.add('selected');
    }
  });

  document.getElementById('checkAnswer').addEventListener('click',()=>{
    const box = document.getElementById('feedbackBox');
    box.className = 'feedback-box show';
    document.querySelectorAll('.choice').forEach(b=>b.classList.remove('wrong','ok'));

    if(!selectedChoice){
      box.classList.add('red');
      box.textContent = '🔴 먼저 문장을 선택하세요.';
      return;
    }

    const selectedBtn = document.querySelector(`.choice[data-choice="${selectedChoice}"]`);
    state.checkedAnalysis = true;
    if(selectedChoice === CORRECT_CHOICE){
      selectedBtn.classList.add('ok');
      box.classList.add('green');
      box.textContent = '🟢 좋아요. 근거를 들어 설명할 수 있는지 확인하세요.';
    }else{
      selectedBtn.classList.add('wrong');
      box.classList.add('red');
      box.textContent = '🔴 다시 생각해 보세요. 앞뒤 흐름과 같은 방향인지 확인하세요.';
    }
    document.getElementById('flowGuide').classList.remove('hidden');
    saveState();
  });

  if(state.checkedAnalysis){
    document.getElementById('flowGuide').classList.remove('hidden');
  }
}

function updateBadges(){
  const keywordFilled = segments.some((_,i)=>(state[`keyword_${i}_1`]||state[`keyword_${i}_2`]));
  const summaryFilled = ['cause','example','additional','result','topicSentence'].some(k=>state[k]);
  const aiFilled = !!(state.aiHelpful || state.revisedTopic);
  setBadge('badgeAnalyze', !!state.checkedAnalysis || keywordFilled);
  setBadge('badgeNote', !!state.classroomSubmitted);
  setBadge('badgeSummary', summaryFilled);
  setBadge('badgeAI', aiFilled);

  const count = [!!(state.checkedAnalysis || keywordFilled), !!state.classroomSubmitted, summaryFilled, aiFilled].filter(Boolean).length;
  const messages = [
    '하나씩 완성해 보세요. 정답보다 중요한 것은 근거입니다.',
    '좋아요. 지문을 그냥 읽는 것이 아니라 흐름으로 보고 있어요.',
    '두 단계 완료! 수업 필기와 자기 분석이 연결되고 있어요.',
    '거의 다 왔어요. AI 피드백을 내 문장 수정에 활용해 보세요.',
    '완료! 오늘의 독해 과정을 스스로 정리했습니다. ⭐'
  ];
  document.getElementById('encourage').textContent = messages[count];
}
function setBadge(id,on){
  document.getElementById(id).classList.toggle('on',on);
}

function setupSaveReset(){
  document.getElementById('saveAll').addEventListener('click',()=>{
    document.querySelectorAll('[data-save]').forEach(el=>state[el.dataset.save]=el.value);
    document.querySelectorAll('[data-field]').forEach(el=>state[el.dataset.field]=el.value);
    saveState();
    alert('저장되었습니다. 이 기기에서 다시 열면 이어서 볼 수 있습니다.');
  });
  document.getElementById('resetAll').addEventListener('click',()=>{
    if(confirm('이 기기에 저장된 학습 기록을 초기화할까요?')){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
}

renderAnalysisCards();
restoreInputs();
setupChoices();
setupSaveReset();
updateBadges();
