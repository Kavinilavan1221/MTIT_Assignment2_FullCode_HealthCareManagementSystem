const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Routes to microservices
app.use('/auth', proxy('http://localhost:5007'));
app.use('/patient', proxy('http://localhost:5001', { proxyReqPathResolver: req => req.url }));
app.use('/doctor', proxy('http://localhost:5002', { proxyReqPathResolver: req => req.url }));
app.use('/appointment', proxy('http://localhost:5003', { proxyReqPathResolver: req => req.url }));
app.use('/billing', proxy('http://localhost:5005', { proxyReqPathResolver: req => req.url }));

app.get('/', (req, res) => {
    res.json({ 
        message: 'Healthcare System API Gateway',
        endpoints: {
            patient: 'http://localhost:8080/patient',
            doctor: 'http://localhost:8080/doctor',
            appointment: 'http://localhost:8080/appointment',
            billing: 'http://localhost:8080/billing'
        }
    });
});

app.get('/api-docs', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Gateway - Swagger Documentation</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 40px; color: #3b4151; }
                .swagger-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #eaeaea; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #2c3e50; margin: 0; font-size: 28px; }
                .info { margin-bottom: 30px; font-size: 15px; color: #555; text-align: center; }
                .service-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; }
                .service-card { background: #fdfdfd; border: 1px solid #e1e1e1; border-radius: 6px; padding: 20px; text-align: center; text-decoration: none; color: #333; font-weight: 600; font-size: 16px; transition: all 0.2s ease; display: block; cursor: pointer; }
                .service-card:hover { border-color: #4990e2; box-shadow: 0 4px 12px rgba(73, 144, 226, 0.15); transform: translateY(-2px); color: #4990e2; background: #f8fbff; }
            </style>
        </head>
        <body>
            <div class="swagger-container">
                <div class="header">
                    <h1>Healthcare Microservices API Gateway</h1>
                </div>
                <div class="info">
                    Centralized access to Swagger APIs. Select a service below to view its OpenAPI 3.0 specification.
                </div>
                
                <div class="service-list">
                    <a class="service-card" href="/patient/api-docs/" target="_blank">🧑‍⚕️ Patient API</a>
                    <a class="service-card" href="/doctor/api-docs/" target="_blank">🩺 Doctor API</a>
                    <a class="service-card" href="/appointment/api-docs/" target="_blank">📅 Appointment API</a>
                    <a class="service-card" href="/billing/api-docs/" target="_blank">💳 Billing API</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', '[API Gateway] running on http://localhost:' + PORT);
});
