const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const mongoURI = 'mongodb+srv://blueviolin2002_db_user:JM5TzjcCtEXRewss@spendings.z3h3kcc.mongodb.net/?appName=Spendings'; 

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Vault"))
    .catch(err => console.error("Database connection error:", err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    expenses: [{ name: String, category: String, amount: Number, date: Date }]
});

const User = mongoose.model('User', UserSchema);

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password, expenses: [] });
        await newUser.save();
        res.json({ success: true, username });
    } catch (err) { res.status(400).json({ message: "User exists" }); }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) res.json({ success: true, username: user.username });
    else res.status(401).json({ message: "Invalid login" });
});

app.get('/api/expenses/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    res.json(user ? user.expenses : []);
});

app.post('/api/expenses', async (req, res) => {
    const { username, expense } = req.body;
    await User.findOneAndUpdate({ username }, { $push: { expenses: expense } });
    res.json({ success: true });
});

app.delete('/api/expenses/:username/:index', async (req, res) => {
    const { username, index } = req.params;
    const user = await User.findOne({ username });
    if (user) {
        user.expenses.splice(index, 1);
        await user.save();
        res.json({ success: true });
    }
});

app.put('/api/expenses/:username/:index', async (req, res) => {
    const { username, index } = req.params;
    const { updatedExpense } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        // Correctly update the specific entry in the array
        user.expenses[index] = updatedExpense;
        await user.save();
        res.json({ success: true });
    }
});

app.listen(3000, () => console.log('Server running: http://localhost:3000'));