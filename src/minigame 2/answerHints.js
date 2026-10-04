export function answerWords(answer, withAccents = false) {
  const text = withAccents ? answer.normalize('NFC') : answer.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'D');
  return text.toUpperCase().trim().split(/\s+/).map((word, wordIndex) => Array.from(word, (letter, letterIndex) => ({ letter, id: `${wordIndex}-${letterIndex}` })));
}
export function revealRandomLetter(answer, revealed, random = Math.random) {
  const hidden = answerWords(answer).flat().filter(cell => !revealed.includes(cell.id));
  return hidden.length ? [...revealed, hidden[Math.floor(random() * hidden.length)].id] : revealed;
}
