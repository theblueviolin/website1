const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Map<YYYY-MM, Array<expense>>
const spendingDB = new Map();

function getYearMonth(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Add expense
app.post('/api/add', (req, res) => {
  const { name, amount, category, date } = req.body;
  const month = getYearMonth(new Date(date));

  if (!spendingDB.has(month)) spendingDB.set(month, []);

  spendingDB.get(month).push({
    name,
    category,
    amount: Number(amount),
    date
  });

  res.json({ success: true });
});

// Get data for a specific month
app.get('/api/data/:month', (req, res) => {
  const month = req.params.month;
  res.json(spendingDB.get(month) || []);
});

// Get projections
app.get('/api/projection', (req, res) => {
  const totals = {};

  spendingDB.forEach(entries => {
    entries.forEach(e => {
      if (!totals[e.category]) totals[e.category] = [];
      totals[e.category].push(e.amount);
    });
  });

  const projection = {};
  for (const cat in totals) {
    projection[cat] =
      totals[cat].reduce((a, b) => a + b, 0) / totals[cat].length;
  }

  res.json(projection);
});

app.listen(3000, () =>
  console.log('Running at http://localhost:3000')
);
