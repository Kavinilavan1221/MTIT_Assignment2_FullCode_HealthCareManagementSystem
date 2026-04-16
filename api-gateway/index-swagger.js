const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Serve combined Swagger UI
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../combined-swagger.json')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes to microservices
app.use('/auth', proxy('http://localhost:5007'));
app.use('/patient', proxy('http://localhost:5001', { proxyReqPathResolver: req => req.url }));
app.use('/doctor', proxy('http://localhost:5002', { proxyReqPathResolver: req => req.url }));
app.use('/appointment', proxy('http://localhost:5003', { proxyReqPathResolver: req => req.url }));
app.use('/prescription', proxy('http://localhost:5004', { proxyReqPathResolver: req => req.url }));
app.use('/billing', proxy('http://localhost:5005', { proxyReqPathResolver: req => req.url }));
app.use('/lab-report', proxy('http://localhost:5006', { proxyReqPathResolver: req => req.url }));

app.get('/', (req, res) => {
    res.json({ 
        message: 'Healthcare System API Gateway',
        endpoints: {
            patient: 'http://localhost:8080/patient',
            doctor: 'http://localhost:8080/doctor',
            appointment: 'http://localhost:8080/appointment',
            prescription: 'http://localhost:8080/prescription',
            billing: 'http://localhost:8080/billing',
            labReport: 'http://localhost:8080/lab-report'
        }
    });
});

app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', '[API Gateway] running on http://localhost:' + PORT);
    console.log('Swagger UI available at http://localhost:' + PORT + '/docs');
});
