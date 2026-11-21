const themeButton = document.querySelector('#theme');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.textContent = dark ? 'Light mode' : 'Dark mode';
  themeButton.setAttribute('aria-pressed', String(dark));
}
setTheme(localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light');
themeButton.onclick = () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  localStorage.setItem('portfolio-theme', theme);
};
const questions = [
  ['Which language structures a webpage?', ['HTML','CSS','SQL'], 0],
  ['Which CSS property changes text color?', ['background','color','padding'], 1],
  ['Which event handles a button activation?', ['load','resize','click'], 2],
  ['What keeps preferences after a reload?', ['localStorage','console.log','document.title'], 0],
  ['Which element represents the main content?', ['footer','main','aside'], 1],
];
const el = id => document.getElementById(id);
let index = 0, score = 0, answered = false;
function render() {
  answered = false;
  el('answers').replaceChildren();
  el('feedback').textContent = '';
  el('next').hidden = true;
  if (index === questions.length) {
    el('progress').textContent = 'Quiz complete';
    el('question').textContent = `Score: ${score}/${questions.length}`;
    el('next').textContent = 'Try again';
    el('next').hidden = false;
    return;
  }
  const [question, options, correct] = questions[index];
  el('progress').textContent = `Question ${index + 1} of ${questions.length}`;
  el('question').textContent = question;
  options.forEach((option, choice) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => {
      if (answered) return;
      answered = true;
      if (choice === correct) score++;
      el('feedback').textContent = choice === correct ? 'Correct!' : `Correct answer: ${options[correct]}.`;
      for (const answer of el('answers').children) answer.disabled = true;
      el('next').textContent = index === questions.length - 1 ? 'Show score' : 'Next question';
      el('next').hidden = false;
      el('next').focus();
    };
    el('answers').append(button);
  });
}
el('next').onclick = () => {
  if (index === questions.length) { index = 0; score = 0; }
  else if (answered) index++;
  render();
  const heading = el('question');
  heading.tabIndex = -1;
  heading.focus();
};
render();
