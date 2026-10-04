import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GAME, questions } from './questions';
import { answerWords, revealRandomLetter } from './answerHints';
import Crossword from './Crossword';
import './styles.css';

function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal(); ref.current.focus();
    return () => previous?.focus();
  }, []);
  return <dialog ref={ref} tabIndex={-1} className={wide ? 'modal wide' : 'modal'} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }}><div className="modal-top"><span className="eyebrow">{title}</span><button className="close" aria-label="Đóng" onClick={onClose}>×</button></div>{children}</dialog>;
}

function Question({ question, hints, seenAnswer, onAnswer, onHint, onClose }) {
  const [remaining, setRemaining] = useState(GAME.seconds * 1000);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  const seconds = Math.ceil(remaining / 1000);
  const words = answerWords(question.answer, seenAnswer);
  const allRevealed = seenAnswer || hints.length === words.flat().length;
  function toggleTimer() {
    if (seenAnswer) return;
    if (running) { setRemaining(Math.max(0, deadline.current - Date.now())); setRunning(false); }
    else if (remaining > 0) { deadline.current = Date.now() + remaining; setRunning(true); }
  }
  function reveal() { setRunning(false); setRemaining(running ? Math.max(0, deadline.current - Date.now()) : remaining); onAnswer(); }
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => { const left = Math.max(0, deadline.current - Date.now()); setRemaining(left); if (!left) setRunning(false); }, 80);
    return () => clearInterval(interval);
  }, [running]);
  useEffect(() => {
    function onKey(e) {
      if (e.target.closest('button, input')) return;
      if (e.code === 'Space') { e.preventDefault(); toggleTimer(); }
      if (e.key === 'Enter') { e.preventDefault(); reveal(); }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });
  return <Modal title={`CÂU ${question.id} / 09`} wide onClose={onClose}>
    <div className="question-layout"><div><p className="eyebrow muted">CÙNG SUY NGHĨ VÀ TRẢ LỜI</p><h2 className="question-text">{question.question}</h2></div><div className={`timer ${seconds <= 5 ? 'urgent' : ''} ${running ? 'running' : ''}`} role="timer" aria-label={`Còn ${seconds} giây`}><span>{String(seconds).padStart(2, '0')}</span><small>{seconds === 0 ? 'HẾT GIỜ!' : running ? 'ĐANG ĐẾM NGƯỢC' : 'GIÂY'}</small></div></div>
    <div className={`answer ${seenAnswer ? 'shown' : ''}`}><span className="eyebrow">ĐÁP ÁN</span><span className="sr-only" role="status">{words.map(word => word.map(cell => seenAnswer || hints.includes(cell.id) ? cell.letter : 'ô trống').join(', ')).join(' / ')}</span><div className="answer-words" aria-hidden="true">{words.map((word, i) => <div className="answer-word" key={i}>{word.map(({ letter, id }) => <span className={`answer-cell ${seenAnswer || hints.includes(id) ? 'revealed' : ''}`} key={id}>{seenAnswer || hints.includes(id) ? letter : ''}</span>)}</div>)}</div></div>
    <div className="question-actions"><button className="primary" disabled={seconds === 0 || seenAnswer} onClick={toggleTimer}>{running ? 'Ⅱ Tạm dừng' : remaining < GAME.seconds * 1000 && remaining > 0 ? '▶ Tiếp tục' : `▶ Bắt đầu ${GAME.seconds} giây`}</button><button className="secondary" onClick={reveal} disabled={seenAnswer}>Hiện đáp án</button><button className="gold" disabled={allRevealed} onClick={onHint}>{allRevealed ? '✓ Đã mở hết chữ' : 'Mở chữ cái ngẫu nhiên'}</button><button className="text-button" onClick={onClose}>← Quay lại</button></div>
    <p className="shortcut">Khi không chọn nút: <kbd>Space</kbd> bắt đầu / dừng · <kbd>Enter</kbd> hiện đáp án · <kbd>Esc</kbd> quay lại</p>
  </Modal>;
}

function App() {
  const [visited, setVisited] = useState([]);
  const [opened, setOpened] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [hints, setHints] = useState({});
  const [active, setActive] = useState(null);
  const [modal, setModal] = useState(null);
  const [solved, setSolved] = useState(false);
  const complete = solved;
  const add = (setter, id) => setter(items => items.includes(id) ? items : [...items, id]);
  function choose(q) { add(setVisited, q.id); setActive(q); }
  function revealAnswer(q) { add(setAnswers, q.id); add(setOpened, q.id); }
  function hint(q) { setHints(current => ({ ...current, [q.id]: revealRandomLetter(q.answer, current[q.id] || []) })); }
  function reset() { setVisited([]); setOpened([]); setAnswers([]); setHints({}); setActive(null); setModal(null); setSolved(false); }
  return <main className="app">
    <header className="topbar"><div className="brand"><span className="flag">★</span><span>TRIẾT HỌC MÁC – LÊNIN</span></div><div><a className="text-button" style={{ textDecoration: 'none' }} href="../../index.html">← Home</a><button className="text-button" onClick={() => setModal('reset')}>↻ Chơi lại</button></div></header>
    <section className="intro"><p className="eyebrow">9 NHÓM · 9 CÂU HỎI · 1 TỪ KHÓA</p><h1>Ô CHỮ <span>BÍ MẬT</span></h1><p className="subtitle">Mối quan hệ giữa tồn tại xã hội và ý thức xã hội</p></section>
    <div className="play-area"><section className="board" aria-label="Bảng câu hỏi"><div className="section-top"><p><span className="step">01</span> Chọn một câu hỏi bất kỳ</p><div className="legend"><span><i />Chưa chọn</span><span><i className="visited-dot" />Đã chọn</span><span><i className="done-dot" />Đã mở chữ</span></div></div><div className="grid">{questions.map(q => <button key={q.id} className={`question-card ${opened.includes(q.id) ? 'done' : visited.includes(q.id) ? 'visited' : ''}`} onClick={() => choose(q)}><span className="card-label">Câu {q.id}<small>{opened.includes(q.id) ? 'Đã mở chữ' : visited.includes(q.id) ? 'Đã chọn · Xem lại' : 'Khám phá câu hỏi'}</small></span><span className="card-arrow">{opened.includes(q.id) ? '✓' : '↗'}</span></button>)}</div></section>
    <Crossword questions={questions} answers={answers} hints={hints} opened={opened} solved={solved} onChoose={choose}>
      <section className={`keyword-panel ${complete ? 'complete' : ''}`} aria-label="Từ khóa bí mật"><div className="keyword-heading"><div><p className="eyebrow">MẢNH GHÉP CUỐI CÙNG</p><h2>{complete ? 'CHÍNH XÁC!' : 'Từ khóa bí mật'}</h2></div><span className="progress">{complete ? 'Đã hiện đáp án' : '9 chữ cái'}</span></div>
        <div className="letters" aria-label="Các chữ cái từ khóa">{GAME.groups.map((count, group) => { const start = GAME.groups.slice(0, group).reduce((a, b) => a + b, 0); return <div className="word" key={group}>{questions.slice(start, start + count).map(q => <div key={q.id} className={`letter ${complete ? 'revealed' : ''}`} aria-label={`Chữ ${q.id}: ${complete ? q.letter : 'chưa mở'}`}><span>{complete ? q.letter : ''}</span><small>{q.id}</small></div>)}</div>; })}</div>
        {complete ? <div className="victory" aria-live="polite"><span>★</span> {GAME.keyword} <span>★</span><p>Chín mảnh ghép · Một tinh thần Việt Nam</p></div> : <div className="keyword-bottom"><p>Bạn đã tìm ra thông điệp hôm nay?</p><button className="primary" onClick={() => setSolved(true)}>Hiện đáp án</button></div>}
      </section>
    </Crossword></div>
    <div className="bottom-note"><span>CÙNG HỌC · CÙNG KHÁM PHÁ</span><span>15 giây cho mỗi câu trả lời</span></div>
    {active && <Question key={active.id} question={active} hints={hints[active.id] || []} seenAnswer={answers.includes(active.id)} onAnswer={() => revealAnswer(active)} onHint={() => hint(active)} onClose={() => setActive(null)} />}
    {modal === 'reset' && <Modal title="BẮT ĐẦU LƯỢT CHƠI MỚI" onClose={() => setModal(null)}><h2 className="modal-title">Bạn có chắc muốn bắt đầu lại trò chơi?</h2><p className="muted">Tất cả câu hỏi và chữ cái sẽ được đặt lại từ đầu.</p><div className="reset-actions"><button className="secondary" onClick={() => setModal(null)}>Tiếp tục chơi</button><button className="primary" onClick={reset}>Chơi lại</button></div></Modal>}
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
