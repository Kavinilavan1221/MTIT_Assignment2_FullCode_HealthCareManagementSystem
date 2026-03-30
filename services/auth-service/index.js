const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 5007;
const JWT_SECRET = 'mtit_secret_key_2026';
const MONGO_URI = 'mongodb+srv://Kavin1221:Kavin%401221@cluster0.plkmhy9.mongodb.net/healthcare_db';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('[\`x1b[32mAuth Service\`x1b[0m] Connected to MongoDB'))
    .catch(err => console.error('[\`x1b[31mAuth Service\`x1b[0m] MongoDB Error:', err));

// User Model
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // 'user' or 'admin'
});
const User = mongoose.model('User', UserSchema);

// Routes
app.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Email already exists or invalid data' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, fullName: user.fullName, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Mocking email sent
    res.json({ message: 'Password reset instructions sent to ' + email });
});

app.get('/health', (req, res) => {
    res.json({ service: 'auth-service', status: 'UP', db: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED' });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log('\`x1b[32m%s\`x1b[0m', '[Auth Service] running on http://localhost:' + PORT);
});
