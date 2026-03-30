const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 5001;
const MONGO_URI = 'mongodb+srv://Kavin1221:Kavin%401221@cluster0.plkmhy9.mongodb.net/healthcare_db';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('[\`x1b[32mPatient Service\`x1b[0m] Connected to MongoDB'))
    .catch(err => console.error('[\`x1b[31mPatient Service\`x1b[0m] MongoDB Error:', err));

// Patient Model
const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    detail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Patient = mongoose.model('Patient', PatientSchema);

// Health check
app.get('/health', (req, res) => {
    res.json({ service: 'patient-service', status: 'UP', member: 'Member 2', db: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED' });
});

app.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json({ message: 'Welcome to Patient Service', member: 'Member 2', data: patients });
    } catch (error) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.post('/', async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

app.put('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'DB Error' });
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log('\`x1b[32m%s\`x1b[0m', '[patient-service] running on http://localhost:' + PORT);
});
