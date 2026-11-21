const storageKey = 'study-sprint-v1';
const list = document.querySelector('ul');
const form = document.querySelector('form');
const filters = [...document.querySelectorAll('[data-filter]')];
const examples = [
  {id:'sample-1', task:'Review CSS selectors', subject:'Web development', done:false},
  {id:'sample-2', task:'Practice Fibonacci', subject:'Python', done:true},
];
let tasks;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  tasks = Array.isArray(saved) ? saved : examples;
} catch { tasks = examples; }
let filter = 'all';
function render() {
  const done = tasks.filter(task => task.done).length;
  document.querySelector('#summary').textContent = `${done} / ${tasks.length} completed`;
  const progress = document.querySelector('progress');
  progress.max = Math.max(tasks.length,1);
  progress.value = done;
  const shown = tasks.filter(task => filter === 'all' || task.done === (filter === 'completed'));
  document.querySelector('#empty').hidden = shown.length !== 0;
  list.replaceChildren();
  for (const item of shown) {
    const row = document.createElement('li');
    const label = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = item.done;
    check.onchange = () => { item.done = check.checked; save(); };
    label.append(check, ` ${item.task} · ${item.subject}`);
    const remove = document.createElement('button');
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label','Delete '+item.task);
    remove.onclick = () => { tasks = tasks.filter(task => task.id !== item.id); save(); };
    row.append(label,remove);
    list.append(row);
  }
}
function save() { localStorage.setItem(storageKey,JSON.stringify(tasks)); render(); }
form.onsubmit = event => {
  event.preventDefault();
  const data = new FormData(form);
  const task = data.get('task').trim(), subject = data.get('subject').trim();
  if (!task || !subject) return;
  tasks.push({id:crypto.randomUUID(),task,subject,done:false});
  save();
  form.reset();
};
for (const button of filters) button.onclick = () => {
  filter = button.dataset.filter;
  for (const option of filters) option.setAttribute('aria-pressed',String(option===button));
  render();
};
render();
