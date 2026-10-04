'use strict';

const GAME_SECONDS = 15;
const MAX_ATTEMPTS = 2;
const $ = id => document.getElementById(id);
const state = { opened: new Set(), records: {}, activeId: null, finished: false };
let interval = null;
let deadline = 0;
let confirmation = null;
const tiles = new Map();

function recordFor(id) {
  return state.records[id] || (state.records[id] = { selected: null, checked: false, correct: false, attempts: 0, remaining: GAME_SECONDS * 1000 });
}

function buildBoard() {
  questions.forEach(question => {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.innerHTML = `<span class="tile-star" aria-hidden="true">✦</span><strong>${question.id}</strong><small>MẢNH GHÉP</small>`;
    tile.addEventListener('click', () => openQuestion(question.id));
    $('tiles').append(tile);
    tiles.set(question.id, tile);
  });
  renderBoard();
}

function renderBoard() {
  questions.forEach(question => {
    const opened = state.opened.has(question.id);
    const tried = (state.records[question.id]?.attempts || 0) > 0;
    const tile = tiles.get(question.id);
    tile.classList.toggle('open', opened);
    tile.disabled = opened || state.finished;
    tile.setAttribute('aria-label', `Mảnh ${question.id}${opened ? ', đã mở' : ', chọn câu hỏi'}`);
    tile.classList.toggle('tried', tried && !opened);
    tile.querySelector('small').textContent = tried ? state.records[question.id].correct ? 'ĐÃ ĐÚNG · LẬT MẢNH' : state.records[question.id].attempts >= MAX_ATTEMPTS ? 'HẾT 2 LƯỢT · XEM LẠI' : 'CÒN 1 LƯỢT' : 'CHỌN CÂU HỎI';
  });
  $('progress').textContent = `${state.opened.size} / 9 mảnh đã mở`;
  $('guess-panel').hidden = state.finished;
  document.querySelector('.game-layout').classList.toggle('finished', state.finished);
  $('result-panel').hidden = !state.finished;
  $('secret-image').alt = state.finished ? 'Bức ảnh sự kiện ngày 2 tháng 9 năm 1945 tại Quảng trường Ba Đình' : 'Bức ảnh bí mật được mở dần';
}

function openDialog(dialog) { dialog.showModal(); dialog.focus(); }

function openQuestion(id) {
  if (state.finished || document.querySelector('dialog[open]')) return;
  const question = questions.find(item => item.id === id);
  if (!question) return;
  state.activeId = id;
  recordFor(id);
  $('question-label').textContent = `CÂU ${id} / 9`;
  $('question-text').textContent = question.question;
  $('question-text').classList.toggle('long-question', question.question.length > 130);
  $('options').replaceChildren();
  Object.entries(question.options).forEach(([key, text]) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.dataset.key = key;
    const letter = document.createElement('b');
    letter.textContent = key;
    const label = document.createElement('span');
    label.textContent = text;
    const mark = document.createElement('span');
    mark.className = 'option-mark';
    button.append(letter, label, mark);
    button.addEventListener('click', () => {
      const record = recordFor(id);
      if (record.checked || state.opened.has(id)) return;
      record.selected = key;
      renderQuestion();
    });
    $('options').append(button);
  });
  renderQuestion();
  openDialog($('question-dialog'));
}

function renderQuestion() {
  if (!state.activeId) return;
  const question = questions.find(q => q.id === state.activeId);
  const record = recordFor(state.activeId);
  const opened = state.opened.has(state.activeId);
  const revealAnswer = record.checked && (record.correct || record.attempts >= MAX_ATTEMPTS);
  $('attempt-status').textContent = `Lượt trả lời ${Math.min(record.attempts + (record.checked ? 0 : 1), MAX_ATTEMPTS)} / ${MAX_ATTEMPTS}`;
  $('options').querySelectorAll('button').forEach(button => {
    const key = button.dataset.key;
    button.classList.toggle('selected', record.selected === key);
    button.classList.toggle('correct', revealAnswer && key === question.correct);
    button.classList.toggle('incorrect', record.checked && record.selected === key && !record.correct);
    button.setAttribute('aria-pressed', String(record.selected === key));
    button.disabled = record.checked || opened;
    button.querySelector('.option-mark').textContent = revealAnswer && key === question.correct ? '✓' : record.checked && record.selected === key && !record.correct ? '×' : '';
  });
  const feedback = $('answer-feedback');
  feedback.className = `answer-feedback${record.checked ? record.correct ? ' success' : ' error' : ''}`;
  feedback.textContent = record.checked ? revealAnswer ? `${record.correct ? 'CHÍNH XÁC!' : 'HẾT 2 LƯỢT! Mảnh ảnh vẫn bị che.'} Đáp án ${question.correct}: ${question.options[question.correct]}.` : 'CHƯA CHÍNH XÁC! Mời đội khác trả lời lượt thứ 2.' : opened ? 'Mảnh này đã được mở.' : record.attempts === 1 ? 'Lượt 2: đội tiếp theo chọn phương án và kiểm tra đáp án.' : 'Chọn một phương án, sau đó bấm “Kiểm tra đáp án”.';
  $('answer-explanation').hidden = !revealAnswer;
  $('explanation-text').textContent = revealAnswer ? question.explanation : '';
  $('explanation-note').textContent = revealAnswer ? question.explanationNote : '';
  $('explanation-note').hidden = !revealAnswer || !question.explanationNote;
  $('start-timer').hidden = record.checked || opened;
  $('check-answer').hidden = record.checked || opened;
  $('check-answer').disabled = !record.selected;
  $('flip-piece').hidden = !record.checked || !record.correct || opened;
  $('close-question').hidden = !record.checked && !opened;
  $('next-attempt').hidden = !record.checked || record.correct || record.attempts >= MAX_ATTEMPTS || opened;
  renderTimer();
}

function renderTimer() {
  if (!state.activeId) return;
  const record = recordFor(state.activeId);
  const seconds = Math.ceil(record.remaining / 1000);
  $('timer-number').textContent = String(seconds).padStart(2, '0');
  $('timer-number').setAttribute('aria-label', `Còn ${seconds} giây`);
  $('timer-status').textContent = seconds === 0 ? 'HẾT GIỜ!' : interval ? 'ĐANG ĐẾM' : record.remaining < GAME_SECONDS * 1000 ? 'TẠM DỪNG' : 'GIÂY';
  $('timer').classList.toggle('urgent', seconds <= 5);
  $('timer').classList.toggle('running', !!interval);
  $('start-timer').textContent = interval ? 'Ⅱ Tạm dừng' : record.remaining < GAME_SECONDS * 1000 && seconds > 0 ? '▶ Tiếp tục' : '▶ Bắt đầu';
  $('start-timer').disabled = seconds === 0;
}

function stopTimer() {
  if (interval && state.activeId) recordFor(state.activeId).remaining = Math.max(0, deadline - Date.now());
  clearInterval(interval);
  interval = null;
  renderTimer();
}

function toggleTimer() {
  if (!$('question-dialog').open || !state.activeId) return;
  const record = recordFor(state.activeId);
  if (record.checked || state.opened.has(state.activeId) || record.remaining <= 0) return;
  if (interval) { stopTimer(); return; }
  deadline = Date.now() + record.remaining;
  interval = setInterval(() => {
    record.remaining = Math.max(0, deadline - Date.now());
    if (record.remaining === 0) { clearInterval(interval); interval = null; }
    renderTimer();
  }, 80);
  renderTimer();
}

function checkAnswer() {
  if (!$('question-dialog').open || !state.activeId) return;
  const record = recordFor(state.activeId);
  if (!record.selected || record.checked || record.attempts >= MAX_ATTEMPTS || state.opened.has(state.activeId)) return;
  stopTimer();
  record.attempts += 1;
  record.checked = true;
  record.correct = record.selected === questions.find(q => q.id === state.activeId).correct;
  renderQuestion();
  renderBoard();
}

function closeDialog(id) {
  if (id === 'question-dialog') { stopTimer(); state.activeId = null; }
  $(id).close();
}

function nextAttempt() {
  if (!state.activeId || !$('question-dialog').open) return;
  const record = recordFor(state.activeId);
  if (!record.checked || record.correct || record.attempts >= MAX_ATTEMPTS || state.opened.has(state.activeId)) return;
  stopTimer();
  record.selected = null;
  record.checked = false;
  record.remaining = GAME_SECONDS * 1000;
  renderQuestion();
  renderBoard();
}

function flipPiece() {
  if (!state.activeId) return;
  const record = recordFor(state.activeId);
  if (!record.checked || !record.correct) return;
  state.opened.add(state.activeId);
  closeDialog('question-dialog');
  renderBoard();
}

function revealAll(finished) {
  stopTimer();
  questions.forEach(question => state.opened.add(question.id));
  state.finished = finished;
  renderBoard();
}

function resetGame() {
  stopTimer();
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  state.activeId = null;
  state.opened.clear();
  state.records = {};
  state.finished = false;
  confirmation = null;
  renderBoard();
}

function askConfirmation(type) {
  confirmation = type;
  $('confirm-title').textContent = type === 'reset' ? 'Bạn có chắc muốn bắt đầu lại trò chơi?' : 'Bạn có chắc muốn lật toàn bộ bức ảnh?';
  $('confirm-description').textContent = type === 'reset' ? 'Che lại 9 mảnh, xóa các lựa chọn và đưa đồng hồ về 15 giây.' : 'Cả 9 mảnh sẽ được mở. Bạn vẫn có thể bấm “Đoán bức ảnh” để công bố sự kiện.';
  $('confirm-action').textContent = type === 'reset' ? 'Chơi lại' : 'Lật toàn bộ';
  openDialog($('confirm-dialog'));
}

$('start-timer').addEventListener('click', toggleTimer);
$('check-answer').addEventListener('click', checkAnswer);
$('flip-piece').addEventListener('click', () => flipPiece());
$('next-attempt').addEventListener('click', nextAttempt);
$('close-question').addEventListener('click', () => closeDialog('question-dialog'));
$('guess').addEventListener('click', () => openDialog($('guess-dialog')));
$('guess-wrong').addEventListener('click', () => closeDialog('guess-dialog'));
$('guess-correct').addEventListener('click', () => { closeDialog('guess-dialog'); revealAll(true); });
$('reveal-all').addEventListener('click', () => askConfirmation('reveal'));
$('reset').addEventListener('click', () => askConfirmation('reset'));
$('result-reset').addEventListener('click', () => askConfirmation('reset'));
$('confirm-action').addEventListener('click', () => {
  const action = confirmation;
  closeDialog('confirm-dialog');
  confirmation = null;
  if (action === 'reset') resetGame();
  else if (action === 'reveal') revealAll(state.finished);
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(button.dataset.close)));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog.id); }));
document.addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || !$('question-dialog').open) return;
  if (event.target.closest('input, textarea, select')) return;
  // These shortcuts control the question even when an answer button has focus.
  if (event.code === 'Space') { event.preventDefault(); toggleTimer(); }
  if (event.key === 'Enter') { event.preventDefault(); checkAnswer(); }
});

function reportMissingImage() { $('missing-image').hidden = false; $('image-warning').hidden = false; $('secret-image').hidden = true; }
function fitImageFrame() {
  const image = $('secret-image');
  if (image.naturalWidth && image.naturalHeight) {
    $('picture-stage').style.setProperty('--image-ratio', image.naturalWidth / image.naturalHeight);
  }
}
$('secret-image').addEventListener('load', fitImageFrame);
$('secret-image').addEventListener('error', reportMissingImage);
if ($('secret-image').complete && !$('secret-image').naturalWidth) reportMissingImage();
fitImageFrame();
buildBoard();
