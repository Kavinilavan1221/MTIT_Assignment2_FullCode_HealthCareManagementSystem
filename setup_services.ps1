$services = @(
    @{ name = "patient-service"; port = 5001; member = "Member 1"; desc = "Patient records and profile management" },
    @{ name = "doctor-service"; port = 5002; member = "Member 2"; desc = "Doctor directory and specialization management" },
    @{ name = "appointment-service"; port = 5003; member = "Member 3"; desc = "Appointment scheduling and tracking" },
    @{ name = "prescription-service"; port = 5004; member = "Member 4"; desc = "Digital prescriptions and medication history" },
    @{ name = "billing-service"; port = 5005; member = "Member 5"; desc = "Invoices and payment processing" },
    @{ name = "lab-report-service"; port = 5006; member = "Member 6"; desc = "Diagnostic tests and lab report management" }
)

foreach ($svc in $services) {
    $dir = "services/$($svc.name)"
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }

    # package.json
    $packageJson = @{
        name = $svc.name
        version = "1.0.0"
        main = "index.js"
        scripts = @{
            start = "node index.js"
        }
        dependencies = @{
            express = "^4.18.2"
            cors = "^2.8.5"
            "swagger-ui-express" = "^5.0.0"
        }
    } | ConvertTo-Json -Depth 10
    $packageJson | Out-File -FilePath "$dir/package.json" -Encoding utf8

    # index.js
    $indexJs = @"
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = $($svc.port);

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ service: '$($svc.name)', status: 'UP', member: '$($svc.member)' });
});

// Mock Data
let data = [
    { id: 1, name: 'Sample Item 1', detail: 'This is mock data from $($svc.name)' },
    { id: 2, name: 'Sample Item 2', detail: 'Managed by $($svc.member)' }
];

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to $($svc.name)', member: '$($svc.member)', data });
});

app.post('/', (req, res) => {
    const newItem = { id: data.length + 1, ...req.body };
    data.push(newItem);
    res.status(201).json(newItem);
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log('\`x1b[32m%s\`x1b[0m', '[$($svc.name)] running on http://localhost:' + PORT);
    console.log('\`x1b[36m%s\`x1b[0m', '[$($svc.name)] Swagger docs: http://localhost:' + PORT + '/api-docs');
});
"@
    $indexJs | Out-File -FilePath "$dir/index.js" -Encoding utf8

    # swagger.json
    $swaggerJson = @{
        openapi = "3.0.0"
        info = @{
            title = "$($svc.name) API"
            version = "1.0.0"
            description = "$($svc.desc) - Developed by $($svc.member)"
        }
        paths = @{
            "/" = @{
                get = @{
                    summary = "Get all items"
                    responses = @{ "200" = @{ description = "Success" } }
                }
                post = @{
                    summary = "Create new item"
                    responses = @{ "201" = @{ description = "Created" } }
                }
            }
            "/health" = @{
                get = @{
                    summary = "Health check"
                    responses = @{ "200" = @{ description = "Service is UP" } }
                }
            }
        }
    } | ConvertTo-Json -Depth 10
    $swaggerJson | Out-File -FilePath "$dir/swagger.json" -Encoding utf8
}

# Setup Gateway
$gwDir = "api-gateway"
if (!(Test-Path $gwDir)) { New-Item -ItemType Directory -Path $gwDir -Force }

$gwPackage = @{
    name = "api-gateway"
    version = "1.0.0"
    main = "index.js"
    scripts = @{
        start = "node index.js"
    }
    dependencies = @{
        express = "^4.18.2"
        cors = "^2.8.5"
        "express-http-proxy" = "^2.0.0"
    }
} | ConvertTo-Json -Depth 10
$gwPackage | Out-File -FilePath "$gwDir/package.json" -Encoding utf8

$gwIndex = @"
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Routes to microservices
app.use('/patient', proxy('http://localhost:5001'));
app.use('/doctor', proxy('http://localhost:5002'));
app.use('/appointment', proxy('http://localhost:5003'));
app.use('/prescription', proxy('http://localhost:5004'));
app.use('/billing', proxy('http://localhost:5005'));
app.use('/lab-report', proxy('http://localhost:5006'));

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
    console.log('\`x1b[32m%s\`x1b[0m', '[API Gateway] running on http://localhost:' + PORT);
});
"@
$gwIndex | Out-File -FilePath "$gwDir/index.js" -Encoding utf8
