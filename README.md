# Healthcare Management System - Microservices Architecture
**MTIT Group Assignment**

- **Database:** MongoDB Atlas (Persistent)
- **Authentication:** JWT-based Login/Signup

## 📂 Project Structure
- `api-gateway/`: Central entry point (Express, Port 8080)
- `services/`:
  - `patient-service`: Member 1 (Port 5001)
  - `doctor-service`: Member 2 (Port 5002)
  - `appointment-service`: Member 3 (Port 5003)
  - `prescription-service`: Member 4 (Port 5004)
  - `billing-service`: Member 5 (Port 5005)
  - `lab-report-service`: Member 6 (Port 5006)
- `client/`: React + Tailwind React Frontend (Vite, Port 5173)

---

## 🚀 How to Run the System

### Option A: Consolidated Command (Recommended)
Open a terminal in the project root and run:
```bash
npm run start:backend
```
*This will start all 6 services and the API Gateway in a single terminal window using `concurrently`.*

To start **everything** (including the Frontend) in one command:
```bash
npm run start:all
```

### Option B: Separate Windows (Best for Demos)
Run the master script:
```powershell
./run_system.ps1
```
*Note: If you get a permission error, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first.*

---

## 📸 Capture These Screenshots for your Slide Deck

### 1. API Gateway Routing
- Open `http://localhost:8080` in your browser.
- This shows the list of available service endpoints via the Gateway.

### 2. Swagger Documentation (Native vs Gateway)
For each service, capture:
- **Native:** `http://localhost:5001/api-docs` (e.g., for Patient Service)
- **Gateway:** `http://localhost:8080/patient/api-docs`
*This demonstrates that the Gateway successfully proxies the documentation as well.*

### 3. Frontend Dashboard
- Open `http://localhost:5173`.
- Interact with each service (Add a record, Refresh list).
- Show the "Operational" status icons for all 6 services.

### 4. Code Structure
- Screenshot the folder structure to show `services/`, `api-gateway/`, and `client/`.

---

## 📝 Slide Deck Content (Suggested)
I have provided a [slide_deck_content.md](file:///c:/Users/Kavin SLIIT/OneDrive/Desktop/MTIT/slide_deck_content.md) file with the text for your presentation.
