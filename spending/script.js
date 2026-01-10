const monthsEl = document.getElementById('months');
const rowsEl = document.getElementById('rows');
const weeklyRowsEl = document.getElementById('weekly-rows');
let currentMonth = new Date().toISOString().slice(0,7); // YYYY-MM

// Build month buttons
for (let i = 0; i < 12; i++) {
  const d = new Date(2026, i);
  const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
  const btn = document.createElement('button');
  btn.textContent = d.toLocaleString('default', { month: 'short' });
  btn.onclick = () => loadMonth(monthStr, btn);
  if (monthStr === currentMonth) btn.classList.add('active');
  monthsEl.appendChild(btn);
}

// Simulated database
const spendingDB = new Map();

function submitExpense() {
  const nameValue = document.getElementById('name').value || '(no name)';
  const categoryValue = document.getElementById('category').value;
  const amountValue = parseFloat(document.getElementById('amount').value) || 0;

  const [year, month] = currentMonth.split('-');
  const today = new Date();
  const dateValue = new Date(year, month-1, today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()).toISOString();

  if (!spendingDB.has(currentMonth)) spendingDB.set(currentMonth, []);
  spendingDB.get(currentMonth).push({
    name: nameValue,
    category: categoryValue,
    amount: amountValue,
    date: dateValue
  });

  loadMonth(currentMonth);

  document.getElementById('name').value = '';
  document.getElementById('amount').value = '';
}

function loadMonth(month, btn) {
  currentMonth = month;

  document.querySelectorAll('aside button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  rowsEl.innerHTML = '';
  const data = spendingDB.get(month) || [];

  data.forEach((e, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><button class="remove-btn" onclick="removeExpense(${index})">-</button></td>
      <td>${new Date(e.date).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</td>
      <td>${e.name}</td>
      <td>${e.category}</td>
      <td>$${e.amount.toFixed(2)}</td>
    `;
    rowsEl.appendChild(tr);
  });

  const [year, monthNum] = month.split('-');
  const titleDate = new Date(year, monthNum - 1);
  document.getElementById('title').innerText =
    titleDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  updateWeeklyStats(month);
}

function removeExpense(index) {
  const data = spendingDB.get(currentMonth);
  if (!data) return;
  data.splice(index, 1);
  loadMonth(currentMonth);
}

function updateWeeklyStats(month) {
  const data = spendingDB.get(month) || [];
  const weeks = [0,0,0,0];

  data.forEach(e => {
    const day = new Date(e.date).getDate();
    if (day >= 1 && day <= 8) weeks[0] += e.amount;
    else if (day >= 9 && day <= 16) weeks[1] += e.amount;
    else if (day >= 17 && day <= 24) weeks[2] += e.amount;
    else weeks[3] += e.amount;
  });

  weeklyRowsEl.innerHTML = '';
  weeks.forEach((total, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Week ${i+1}</td>
      <td>$${total.toFixed(2)}</td>
    `;
    weeklyRowsEl.appendChild(tr);
  });
}

// Live clock
setInterval(() => {
  document.getElementById('clock').innerText =
    new Date().toLocaleString([], { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
}, 1000);

loadMonth(currentMonth);
