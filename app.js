const question=document.querySelector('#finderQuestion');
const contextPanel=document.querySelector('#finderContext');
const resultPanel=document.querySelector('#finderResult');
const progress=document.querySelector('#progressBar');
const stepLabel=document.querySelector('#stepLabel');
const progressText=document.querySelector('#progressText');
let spotChoice='';

document.querySelectorAll('.finder-option').forEach(button=>button.addEventListener('click',()=>{
  spotChoice=button.dataset.choice;
  if(spotChoice==='many') return showResult('many','today');
  question.classList.add('hidden');
  contextPanel.classList.remove('hidden');
  progress.style.width='100%'; stepLabel.textContent='STEP 2 OF 2'; progressText.textContent='100%';
}));
document.querySelectorAll('.context-option').forEach(button=>button.addEventListener('click',()=>showResult(spotChoice,button.dataset.context)));
document.querySelector('#backButton').addEventListener('click',resetFinder);

function showResult(spot,context){
  question.classList.add('hidden');contextPanel.classList.add('hidden');resultPanel.classList.remove('hidden');
  progress.style.width='100%';stepLabel.textContent='YOUR NEXT STEP';progressText.textContent='✓';
  const results={
    emerging:{tag:'FAST FIRST ACTION',name:'Power Patch “First Fix 6”',price:'PROPOSED ₹99 | 6 PATCHES',body:context==='today'?'A low-risk first action for an emerging spot when tomorrow matters.':'Start with visible patch proof, then build a simple cleanser-led routine.',steps:['Clean and dry','Apply as directed','Peel; assess routine'],note:'Use only on the spot type and for the duration stated on the approved pack.'},
    whitehead:{tag:'PROTECT + RESTORE',name:'Power Patch Skin Restore',price:'PROPOSED ₹299 | 18 PIECES',body:'Designed for a visible whitehead or “poppable” spot, following approved product directions.',steps:['Do not pick','Apply to dry skin','Remove as directed'],note:'If the area is painful, deep, spreading or repeatedly returns, seek professional advice.'},
    after:{tag:'POST-SPOT SUPPORT',name:'Skin Restore + gentle routine',price:'RETAIN AFTER THE SPOT',body:'Protect the settled area and keep the next step simple rather than adding a complicated routine.',steps:['Gentle cleanse','Protect the area','Avoid picking'],note:'Persistent marks or scarring concerns should be discussed with a dermatologist.'},
    many:{tag:'PROFESSIONAL GUIDANCE',name:'A dermatologist is the right first step',price:'DO NOT SELF-DIAGNOSE',body:'Painful, deep, widespread, persistent or scarring acne needs professional evaluation rather than a patch-only answer.',steps:['Pause experiments','Avoid picking','Book a consult'],note:'This experience does not diagnose or replace medical advice.'}
  };
  const r=results[spot];
  resultPanel.innerHTML=`<span class="result-tag">${r.tag}</span><h2>${r.name}</h2><span class="result-price">${r.price}</span><p>${r.body}</p><div class="result-steps">${r.steps.map(x=>`<span>${x}</span>`).join('')}</div><p class="${spot==='many'?'result-alert':''}"><b>Remember:</b> ${r.note}</p><button class="primary-button" id="restartButton">Start again</button>`;
  document.querySelector('#restartButton').addEventListener('click',resetFinder);
}
function resetFinder(){spotChoice='';resultPanel.classList.add('hidden');contextPanel.classList.add('hidden');question.classList.remove('hidden');progress.style.width='50%';stepLabel.textContent='STEP 1 OF 2';progressText.textContent='50%';}

const stepCopy={
  clean:['Start gently.','Cleanse without scrubbing. Pat the area completely dry so the patch can adhere properly.','DO: clean hands and dry skin','AVOID: picking or toothpaste'],
  patch:['Match the patch.','Use Fast Fix for an emerging spot or Skin Restore for a visible whitehead, only as directed on the approved pack.','DO: follow spot-type guidance','AVOID: layering on wet skin'],
  peel:['Remove, then move on.','Peel at the directed time. Continue gentle care and seek help for severe, painful, persistent or scarring acne.','DO: dispose responsibly','AVOID: repeated picking']
};
document.querySelectorAll('.step').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.step').forEach(x=>x.classList.remove('active'));button.classList.add('active');
  const c=stepCopy[button.dataset.step];document.querySelector('#stepDetail').innerHTML=`<b>${c[0]}</b><p>${c[1]}</p><div class="do-dont"><span>${c[2]}</span><span>${c[3]}</span></div>`;
}));
