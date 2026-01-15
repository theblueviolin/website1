const API_URL = "https://costly-emilie-blueviolin-d88ed85a.koyeb.app";

const yearSelect = document.getElementById('year-select');
const monthsEl = document.getElementById('months');
const rowsEl = document.getElementById('rows');
const weeklyRowsEl = document.getElementById('weekly-rows');
const authBtn = document.getElementById('auth-btn');
const welcomeMsg = document.getElementById('welcome-msg');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

let userAccount = JSON.parse(localStorage.getItem('userAccount')) || null;

const startYear = 2026;
const currentRealDate = new Date();
const currentRealYear = currentRealDate.getFullYear();
const endYear = Math.max(startYear + 5, currentRealYear);

let currentYear = currentRealYear < startYear ? startYear.toString() : currentRealYear.toString();
let currentMonthNum = String(currentRealDate.getMonth() + 1).padStart(2, '0');
let currentMonthKey = `${currentYear}-${currentMonthNum}`;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function openAuth() {
    if (userAccount) { if(confirm("Logout?")) logout(); return; }
    showLoginForm();
    modalOverlay.style.display = 'flex';
}

function showLoginForm(error = "") {
    modalContent.innerHTML = `<h2>Login</h2>${error ? `<p style="color:red; font-size:14px;">${error}</p>` : ''}<input type="text" id="l-name" placeholder="Username"><input type="password" id="l-pass" placeholder="Password"><button onclick="handleLogin()">Login</button><span class="modal-link" onclick="showRegisterForm()">Create Account</span>`;
}

function showRegisterForm(error = "") {
    modalContent.innerHTML = `<h2>Create Account</h2>${error ? `<p style="color:red; font-size:14px;">${error}</p>` : ''}<input type="text" id="r-name" placeholder="Username"><input type="password" id="r-pass" placeholder="Password"><input type="password" id="r-conf" placeholder="Confirm Password"><button onclick="handleRegister()">Create</button><span class="modal-link" onclick="showLoginForm()">Back</span>`;
}

async function handleLogin() {
    const u = document.getElementById('l-name').value;
    const p = document.getElementById('l-pass').value;
    const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });
    const data = await res.json();
    if (res.ok) {
        userAccount = { username: data.username };
        localStorage.setItem('userAccount', JSON.stringify(userAccount));
        updateAuthUI(); loadMonth(currentMonthKey); modalOverlay.style.display = 'none';
    } else { showLoginForm(data.message); }
}

async function handleRegister() {
    const u = document.getElementById('r-name').value;
    const p = document.getElementById('r-pass').value;
    const c = document.getElementById('r-conf').value;
    if (p !== c) return showRegisterForm("Passwords don't match");
    const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });
    const data = await res.json();
    if (res.ok) {
        userAccount = { username: data.username };
        localStorage.setItem('userAccount', JSON.stringify(userAccount));
        updateAuthUI(); loadMonth(currentMonthKey); modalOverlay.style.display = 'none';
    } else { showRegisterForm(data.message); }
}

function logout() { userAccount = null; localStorage.removeItem('userAccount'); updateAuthUI(); loadMonth(currentMonthKey); }
function updateAuthUI() { authBtn.innerText = userAccount ? "Logout" : "Login"; welcomeMsg.innerText = userAccount ? `Welcome, ${userAccount.username}` : ""; }

function initYearDropdown() {
    yearSelect.innerHTML = '';
    for (let y = startYear; y <= endYear; y++) {
        const opt = document.createElement('option'); opt.value = y; opt.textContent = y;
        if (y.toString() === currentYear) opt.selected = true;
        yearSelect.appendChild(opt);
    }
}

function changeYear(y) { currentYear = y; currentMonthKey = `${y}-${currentMonthNum}`; buildMonthButtons(); loadMonth(currentMonthKey); }

function buildMonthButtons() {
    monthsEl.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const m = `${currentYear}-${String(i + 1).padStart(2,'0')}`;
        const b = document.createElement('button'); b.textContent = monthNames[i].substring(0,3);
        b.onclick = () => loadMonth(m, b);
        if (m === currentMonthKey) b.classList.add('active');
        monthsEl.appendChild(b);
    }
}

async function submitExpense() {
    if (!userAccount) { openAuth(); return; }
    const name = document.getElementById('name').value || '(no name)';
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    if (amount <= 0) return;
    const [y, m] = currentMonthKey.split('-');
    const date = new Date(y, m - 1, 15, 12, 0, 0);
    await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userAccount.username, expense: { name, category, amount, date } })
    });
    loadMonth(currentMonthKey);
    document.getElementById('amount').value = ''; document.getElementById('name').value = '';
}

async function loadMonth(key, btn) {
    currentMonthKey = key;
    const [y, m] = key.split('-');
    currentMonthNum = m;
    document.getElementById('title').textContent = `${monthNames[parseInt(m)-1]} ${y}`;
    document.querySelectorAll('aside button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (!userAccount) { rowsEl.innerHTML = '<tr><td colspan="6" style="text-align:center;">Login required</td></tr>'; return; }
    const res = await fetch(`${API_URL}/api/expenses/${userAccount.username}`);
    const expenses = await res.json();
    const filtered = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === parseInt(y) && (d.getMonth() + 1) === parseInt(m);
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    rowsEl.innerHTML = filtered.length ? '' : '<tr><td colspan="6" style="text-align:center;">No entries</td></tr>';
    filtered.forEach((e) => {
        const realIndex = expenses.indexOf(e);
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', realIndex);
        tr.innerHTML = `
            <td><button class="action-btn edit-btn" onclick='editRow(${realIndex}, ${JSON.stringify(e)})'>Edit</button></td>
            <td>${new Date(e.date).toLocaleDateString([], {month:'numeric', day:'numeric'})}</td>
            <td><div class="wrap-text">${e.name}</div></td>
            <td>${e.category}</td>
            <td style="text-align:right; font-weight:700;">$${e.amount.toFixed(2)}</td>
            <td style="text-align:center;"><button class="action-btn remove-btn" onclick="removeExpense(${realIndex})">×</button></td>
        `;
        rowsEl.appendChild(tr);
    });
    updateWeeklyStats(filtered);
}

function editRow(index, e) {
    const tr = document.querySelector(`tr[data-id="${index}"]`);
    const dateVal = new Date(e.date).toISOString().split('T')[0];
    tr.innerHTML = `
        <td><button class="action-btn save-btn" onclick="saveRow(${index})">Save</button></td>
        <td><input type="date" class="edit-input" id="edit-date-${index}" value="${dateVal}"></td>
        <td><input type="text" class="edit-input" id="edit-name-${index}" maxlength="20" value="${e.name}"></td>
        <td><select class="edit-input" id="edit-cat-${index}"><option ${e.category==='Grocery'?'selected':''}>Grocery</option><option ${e.category==='Eating Out'?'selected':''}>Eating Out</option><option ${e.category==='Object'?'selected':''}>Object</option><option ${e.category==='Gas'?'selected':''}>Gas</option><option ${e.category==='Bills'?'selected':''}>Bills</option></select></td>
        <td><input type="number" class="edit-input" id="edit-amt-${index}" value="${e.amount}"></td>
        <td></td>
    `;
}

async function saveRow(index) {
    const dateInput = document.getElementById(`edit-date-${index}`).value;
    const [y, m, d] = dateInput.split('-').map(Number);
    const updated = {
        name: document.getElementById(`edit-name-${index}`).value,
        category: document.getElementById(`edit-cat-${index}`).value,
        amount: parseFloat(document.getElementById(`edit-amt-${index}`).value),
        date: new Date(y, m - 1, d, 12, 0, 0)
    };
    await fetch(`${API_URL}/api/expenses/${userAccount.username}/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedExpense: updated })
    });
    loadMonth(currentMonthKey);
}

async function removeExpense(idx) {
    if (confirm("Delete?")) {
        await fetch(`${API_URL}/api/expenses/${userAccount.username}/${idx}`, { method: 'DELETE' });
        loadMonth(currentMonthKey);
    }
}

function updateWeeklyStats(data) {
    const weeks = [0,0,0,0];
    data.forEach(e => {
        const d = new Date(e.date).getDate();
        if (d <= 8) weeks[0] += e.amount; else if (d <= 16) weeks[1] += e.amount; else if (d <= 24) weeks[2] += e.amount; else weeks[3] += e.amount;
    });
    weeklyRowsEl.innerHTML = '';
    ["Week 1", "Week 2", "Week 3", "Week 4"].forEach((l, i) => {
        weeklyRowsEl.innerHTML += `<tr><td>${l}</td><td style="text-align:right; font-weight:700;">$${weeks[i].toFixed(2)}</td></tr>`;
    });
}

setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
updateAuthUI(); initYearDropdown(); buildMonthButtons(); loadMonth(currentMonthKey);
window.onclick = (e) => { if (e.target == modalOverlay) modalOverlay.style.display = 'none'; }