const questions = [
  {
    id: 'spot',
    title: 'What best describes the spot today?',
    helper: 'Choose the closest match. This guides the format, not a diagnosis.',
    options: [
      ['emerging', '◌', 'Emerging spot', 'Red, tender or just beginning'],
      ['whitehead', '●', 'Visible whitehead', 'Raised and ready to protect'],
      ['settled', '○', 'Spot has settled', 'The active spot is calming down'],
      ['many', '••', 'Several or painful spots', 'Deep, widespread, persistent or scarring']
    ]
  },
  {
    id: 'skin',
    title: 'How does your skin usually feel?',
    helper: 'Think about most days, not just immediately after washing.',
    options: [
      ['oily', '✦', 'Oily', 'Shine returns quickly'],
      ['combination', '◐', 'Combination', 'Oily in some areas, balanced in others'],
      ['dry', '◇', 'Dry', 'Often feels tight or flaky'],
      ['sensitive', '≈', 'Sensitive', 'Reacts easily or feels uncomfortable']
    ]
  },
  {
    id: 'frequency',
    title: 'How often do spots show up?',
    helper: 'This tells us whether you need one focused fix or a repeatable routine.',
    options: [
      ['first', '1', 'First or occasional', 'Only once in a while'],
      ['monthly', 'M', 'Around every month', 'A familiar monthly pattern'],
      ['weekly', 'W', 'Most weeks', 'New spots appear regularly'],
      ['persistent', '!', 'Almost always', 'Spots rarely fully settle']
    ]
  },
  {
    id: 'routine',
    title: 'What are you using right now?',
    helper: 'We will avoid adding more steps than your routine needs.',
    options: [
      ['none', '0', 'Nothing consistent', 'I start and stop products'],
      ['cleanser', 'C', 'A basic cleanser', 'One simple cleansing step'],
      ['treatment', 'Rx', 'An acne treatment', 'Recommended by a professional or bought myself'],
      ['full', '3+', 'A full routine', 'Cleanser plus multiple leave-on products']
    ]
  },
  {
    id: 'priority',
    title: 'What matters most right now?',
    helper: 'Your answer shapes the simplest recommendation for your day.',
    options: [
      ['fast', '→', 'A quick first action', 'I want to handle this spot today'],
      ['budget', '₹', 'Keep it affordable', 'Start small and build later'],
      ['discreet', '◉', 'Protection that fits my day', 'Low-fuss and easy to carry'],
      ['control', '✓', 'A routine I can repeat', 'Fewer surprises over time']
    ]
  }
];

const productData = {
  'Power Patch First Fix 6': { price: 99, short: 'First Fix 6' },
  'Bar for Acne': { price: 149, short: 'Bar for Acne' },
  'Foaming Cleanser': { price: 449, short: 'Foaming Cleanser' },
  'Power Patch Skin Restore': { price: 299, short: 'Skin Restore' }
};

const stage = document.querySelector('#finderStage');
const progressBar = document.querySelector('#progressBar');
const stepLabel = document.querySelector('#stepLabel');
const progressText = document.querySelector('#progressText');
let currentQuestion = 0;
let answers = {};
let bag = [];

function renderQuestion() {
  const question = questions[currentQuestion];
  const percent = (currentQuestion + 1) * 20;
  stepLabel.textContent = `Question ${currentQuestion + 1} of 5`;
  progressText.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  stage.innerHTML = `
    <div class="question-view">
      <h2>${question.title}</h2>
      <p>${question.helper}</p>
      <div class="option-grid">
        ${question.options.map(option => `
          <button class="finder-option" type="button" data-choice="${option[0]}">
            <span class="option-icon">${option[1]}</span>
            <span><b>${option[2]}</b><small>${option[3]}</small></span>
          </button>`).join('')}
      </div>
      <div class="question-actions">
        ${currentQuestion > 0 ? '<button class="back-button" id="finderBack" type="button">← Previous question</button>' : '<span></span>'}
        <span class="privacy-note">Answers stay on this page</span>
      </div>
    </div>`;

  stage.querySelectorAll('.finder-option').forEach(button => {
    button.addEventListener('click', () => {
      answers[question.id] = button.dataset.choice;
      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderQuestion();
      } else {
        renderResult();
      }
    });
  });

  const back = stage.querySelector('#finderBack');
  if (back) back.addEventListener('click', () => {
    currentQuestion -= 1;
    renderQuestion();
  });
}

function buildRecommendation() {
  const severe = answers.spot === 'many' || answers.frequency === 'persistent';
  if (severe) {
    return {
      severe: true,
      label: 'PROFESSIONAL-FIRST PATH',
      title: 'A dermatologist should be your first step',
      price: 'Before adding products',
      products: [],
      reasons: [
        'Your answers suggest repeated, widespread or painful acne.',
        'A patch-only answer may delay the support your skin needs.',
        'Pause picking and unfamiliar product combinations until you get guidance.'
      ]
    };
  }

  const primary = answers.spot === 'emerging' ? 'Power Patch First Fix 6' : 'Power Patch Skin Restore';
  const needsRoutine = answers.frequency !== 'first' && answers.routine !== 'full' && answers.routine !== 'treatment';
  const cleanser = answers.priority === 'budget' ? 'Bar for Acne' : 'Foaming Cleanser';
  const products = needsRoutine ? [primary, cleanser] : [primary];
  const total = products.reduce((sum, product) => sum + productData[product].price, 0);
  const skinNote = answers.skin === 'sensitive'
    ? 'Because your skin feels sensitive, keep the routine minimal and follow pack directions carefully.'
    : `Your ${answers.skin} skin preference points to a focused routine without unnecessary layers.`;
  const frequencyNote = answers.frequency === 'first'
    ? 'Occasional spots call for a focused product rather than a crowded daily routine.'
    : 'Recurring spots make one consistent cleansing step more useful than changing products often.';
  const priorityNote = {
    fast: 'The patch stays at the centre because you want a quick first action.',
    budget: 'The cleansing bar keeps the routine compact and affordable.',
    discreet: 'The patch-led format is easy to carry and fit into a normal day.',
    control: 'A repeatable cleanse-and-patch sequence gives the routine a clear rhythm.'
  }[answers.priority];

  return {
    severe: false,
    label: needsRoutine ? 'YOUR MATCHED ROUTINE' : 'YOUR FOCUSED FIRST FIX',
    title: products.map(product => productData[product].short).join(' + '),
    price: `₹${total}`,
    products,
    reasons: [skinNote, frequencyNote, priorityNote]
  };
}

function answerLabel(questionId, value) {
  const question = questions.find(item => item.id === questionId);
  const option = question.options.find(item => item[0] === value);
  return option ? option[2] : value;
}

function renderResult() {
  const recommendation = buildRecommendation();
  stepLabel.textContent = 'Your routine is ready';
  progressText.textContent = '✓';
  progressBar.style.width = '100%';
  const summary = Object.entries(answers).map(([key, value]) => `<span>${answerLabel(key, value)}</span>`).join('');
  const addButtons = recommendation.products.map(product => `<button type="button" class="secondary-button result-add" data-add="${product}">Add ${productData[product].short}</button>`).join('');

  stage.innerHTML = `
    <div class="result-view">
      <h2>${recommendation.severe ? 'Your safest next step is clear.' : 'Here is your simplest match.'}</h2>
      <div class="answer-summary">${summary}</div>
      <div class="recommendation">
        <div class="recommendation-head">
          <div><span class="tag">${recommendation.label}</span><h3>${recommendation.title}</h3></div>
          <span class="recommendation-price">${recommendation.price}</span>
        </div>
        <ul>${recommendation.reasons.map(reason => `<li>${reason}</li>`).join('')}</ul>
        <div class="result-buttons">
          ${recommendation.products.length ? `<button type="button" id="addRoutine">Add complete routine</button>${addButtons}` : '<a class="primary-button" href="#care">See the red-flag guide</a>'}
          <button type="button" class="secondary-button" id="restartFinder">Start again</button>
        </div>
      </div>
      <p class="result-alert"><b>Good to know:</b> This finder offers product guidance, not a diagnosis. Stop use if irritation occurs and seek professional advice for painful, deep, widespread, persistent or scarring acne.</p>
    </div>`;

  const restart = stage.querySelector('#restartFinder');
  restart.addEventListener('click', resetFinder);
  stage.querySelectorAll('.result-add').forEach(button => button.addEventListener('click', () => addToBag(button.dataset.add)));
  const addRoutine = stage.querySelector('#addRoutine');
  if (addRoutine) addRoutine.addEventListener('click', () => {
    recommendation.products.forEach(addToBag);
    openBag();
  });
}

function resetFinder() {
  currentQuestion = 0;
  answers = {};
  renderQuestion();
}

const stepCopy = {
  clean: ['Start gently.', 'Cleanse without scrubbing. Pat the area completely dry so the patch can adhere properly.', 'DO: clean hands and dry skin', 'AVOID: picking or toothpaste'],
  patch: ['Match the patch.', 'Use the patch matched to your spot and follow the directions on the approved pack.', 'DO: use on the right spot type', 'AVOID: layering on wet skin'],
  peel: ['Remove, then move on.', 'Peel at the directed time. Continue gentle care and ask for help when red flags appear.', 'DO: dispose responsibly', 'AVOID: repeated picking']
};

document.querySelectorAll('.step').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.step').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const copy = stepCopy[button.dataset.step];
  document.querySelector('#stepDetail').innerHTML = `<b>${copy[0]}</b><p>${copy[1]}</p><div class="do-dont"><span>${copy[2]}</span><span>${copy[3]}</span></div>`;
}));

const bagDrawer = document.querySelector('#bagDrawer');
const drawerBackdrop = document.querySelector('#drawerBackdrop');
const bagCount = document.querySelector('#bagCount');
const bagButton = document.querySelector('#bagButton');
const bagItems = document.querySelector('#bagItems');
const bagSubtotal = document.querySelector('#bagSubtotal');
const toast = document.querySelector('#toast');
let toastTimer;

function addToBag(product) {
  bag.push(product);
  updateBag();
  clearTimeout(toastTimer);
  toast.textContent = `${productData[product].short} added to your bag`;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function removeFromBag(index) {
  bag.splice(index, 1);
  updateBag();
}

function updateBag() {
  bagCount.textContent = bag.length;
  bagButton.setAttribute('aria-label', `Shopping bag, ${bag.length} ${bag.length === 1 ? 'item' : 'items'}`);
  const subtotal = bag.reduce((sum, product) => sum + productData[product].price, 0);
  bagSubtotal.textContent = `₹${subtotal}`;
  bagItems.innerHTML = bag.length ? bag.map((product, index) => `
    <div class="bag-item"><span><b>${productData[product].short}</b><small>₹${productData[product].price}</small></span><button type="button" data-remove="${index}" aria-label="Remove ${productData[product].short}">Remove</button></div>`).join('') : '<p>Your bag is empty. Use the finder or shop the range.</p>';
  bagItems.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => removeFromBag(Number(button.dataset.remove))));
}

function openBag() {
  bagDrawer.classList.add('open');
  drawerBackdrop.classList.add('open');
  bagDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  document.querySelector('#closeBag').focus();
}

function closeBag() {
  bagDrawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  bagDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
}

document.querySelectorAll('.add-button').forEach(button => button.addEventListener('click', () => addToBag(button.dataset.add)));
bagButton.addEventListener('click', openBag);
document.querySelector('#closeBag').addEventListener('click', closeBag);
drawerBackdrop.addEventListener('click', closeBag);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeBag(); });
document.querySelector('#checkoutButton').addEventListener('click', () => {
  clearTimeout(toastTimer);
  toast.textContent = bag.length ? 'Your selected routine is ready for launch checkout.' : 'Add a product before continuing.';
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
});

renderQuestion();
updateBag();
