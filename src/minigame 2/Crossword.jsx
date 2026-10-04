import React from 'react';
import { answerWords } from './answerHints';

export default function Crossword({ questions, answers, hints, opened, solved, onChoose, children }) {
  const highlightKeyword = solved || new Set(opened).size >= 5;
  const rows = questions.map(q => {
    const cells = answerWords(q.answer).flat();
    return { ...q, cells, keyIndex: cells.findIndex(cell => cell.letter === q.letter) };
  });
  const anchor = Math.max(...rows.map(row => row.keyIndex));
  const columns = Math.max(...rows.map(row => anchor - Math.max(0, row.keyIndex) + row.cells.length));
  return <section className="crossword-panel" aria-label="Bảng ô chữ đáp án">
    <div className="section-top"><p><span className="step">02</span> Giải mã ô chữ</p>{highlightKeyword && <span className="crossword-key"><i /> Cột từ khóa</span>}</div>
    <div className="crossword-scroll"><div className="crossword-grid" style={{ '--columns': columns }}>
      {rows.map((row, index) => <React.Fragment key={row.id}>
        <button className="crossword-number" style={{ gridRow: index + 1, gridColumn: 1 }} onClick={() => onChoose(row)} aria-label={`Mở câu ${row.id}`}>{row.id}</button>
        {row.cells.map((cell, cellIndex) => {
          const key = cellIndex === row.keyIndex;
          const visible = answers.includes(row.id) || (hints[row.id] || []).includes(cell.id) || (key && (opened.includes(row.id) || solved));
          return <span key={cell.id} className={`crossword-cell ${key && highlightKeyword ? 'key-cell' : ''} ${visible ? 'filled' : ''}`} style={{ gridRow: index + 1, gridColumn: 2 + anchor - Math.max(0, row.keyIndex) + cellIndex }} aria-label={`Câu ${row.id}, ô ${cellIndex + 1}: ${visible ? cell.letter : 'chưa mở'}`}>{visible ? cell.letter : ''}</span>;
        })}
      </React.Fragment>)}
    </div></div>
    <p className="crossword-note">Chọn số hàng để xem câu hỏi. Hiện đáp án sẽ điền cả hàng.</p>
    {children}
  </section>;
}
