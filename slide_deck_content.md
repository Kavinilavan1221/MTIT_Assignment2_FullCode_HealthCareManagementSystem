# MTIT Assignment - Slide Deck Content

## Slide 1: Project Title
- **Title:** Healthcare Management System using Microservices Architecture
- **Subject:** Modern Trends in Information Technology (MTIT)
- **Group Members:** [Names of all 6 members]

## Slide 2: Introduction to Business Domain
- **Domain:** Healthcare
- **Goal:** To modernize hospital management using a distributed architecture that ensures scalability and independent development.
- **Why Microservices?** Each module (Doctor, Patient, Billing, etc.) can be developed and deployed independently by team members.

## Slide 3: Identified Microservices (Individual Contribution)
- **Patient Service** (Member 1): Manages patient records and medical history.
- **Doctor Service** (Member 2): Manages doctor profiles and specializations.
- **Appointment Service** (Member 3): Handles scheduling and visit tracking.
- **Prescription Service** (Member 4): Manages digital prescriptions.
- **Billing Service** (Member 5): Handles invoices and payments.
- **Lab Report Service** (Member 6): Manages diagnostic test results.

## Slide 4: Real-world Scenario & API Documentation
- Each service exposes a RESTful API.
- Integrated **Swagger/OpenAPI** documentation for every service.
- [Insert Screenshot: Swagger UI of any service]

## Slide 5: The Role of API Gateway
- **Central Entry Point:** All frontend requests go through Port 8080.
- **Request Routing:** Gateway proxies `/patient` to Port 5001, `/doctor` to Port 5002, etc.
- **Uniformity:** Provides a single base URL for the frontend, avoiding CORS issues and port confusion.
- [Insert Screenshot: API Gateway response at http://localhost:8080]

## Slide 6: System Folder Structure
- Clear separation between `api-gateway`, `services`, and `client`.
- Standard project structure for industrial-grade development.

## Slide 7: Frontend Integration
- **Tech Stack:** React, Vite, Tailwind CSS, Lucide Icons.
- **Functionality:** Real-time health monitoring of all services and CRUD operations via the Gateway.
- [Insert Screenshot: Frontend Dashboard]

## Slide 8: Conclusion & Learning Outcomes
- Understanding of distributed systems.
- Hands-on experience with API Gateways and Swagger.
- Collaborative development using microservices.
