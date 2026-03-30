Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "   HEALTHCARE SYSTEM - MASTER START SCRIPT      " -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

$services = @(
    "services/patient-service",
    "services/doctor-service",
    "services/appointment-service",
    "services/prescription-service",
    "services/billing-service",
    "services/lab-report-service",
    "api-gateway"
)

foreach ($svc in $services) {
    Write-Host "Starting $svc..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $svc; npm start"
}

Write-Host "Starting Frontend (Client)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "All systems are starting in separate windows." -ForegroundColor Magenta
Write-Host "1. Frontend: http://localhost:5173"
Write-Host "2. API Gateway: http://localhost:8080"
Write-Host "3. Swagger Docs: http://localhost:8080/{service-name}/api-docs"
Write-Host "--------------------------------------------------"
