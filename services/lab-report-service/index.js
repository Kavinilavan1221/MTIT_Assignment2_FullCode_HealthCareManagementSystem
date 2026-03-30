const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 5006;
const MONGO_URI = 'mongodb+srv://Kavin1221:Kavin%401221@cluster0.plkmhy9.mongodb.net/healthcare_db';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('[\x1b[32mlab-report-service\x1b[0m] Connected to MongoDB'))
    .catch(err => console.error('[\x1b[31mlab-report-service\x1b[0m] MongoDB Error:', err));

// Model
const Schema = new mongoose.Schema({ patientId: String, testName: String, result: String, date: String }, { timestamps: true });
const Model = mongoose.model('LabReport', Schema);

// Health check
app.get('/health', (req, res) => {
    res.json({ service: 'lab-report-service', status: 'UP', member: 'Member 6', db: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED' });
});

app.get('/', async (req, res) => {
    try {
        const items = await Model.find().sort({ createdAt: -1 });
        res.json({ message: 'Welcome to lab-report-service', member: 'Member 6', data: items });
    } catch (error) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/', async (req, res) => {
    try {
        const item = new Model(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

app.put('/:id', async (req, res) => {
    try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', '[lab-report-service] running on http://localhost:' + PORT);
});
