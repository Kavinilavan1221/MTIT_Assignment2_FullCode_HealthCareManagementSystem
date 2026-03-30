const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Kavin1221:Kavin%401221@cluster0.plkmhy9.mongodb.net/healthcare_db';
const HASHED_PASSWORD = '$2a$10$6i7K535d4q2C9u.v7d5O9.v2c7lV/G9yqO.u.m.g.H.o.g'; // password123

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Users
    const User = mongoose.model('User', new mongoose.Schema({ fullName: String, email: String, password: String }));
    await User.deleteMany({});
    const users = Array.from({ length: 10 }).map((_, i) => ({
      fullName: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: HASHED_PASSWORD
    }));
    await User.insertMany(users);

    // 2. Patients
    const Patient = mongoose.model('Patient', new mongoose.Schema({ name: String, detail: String }));
    await Patient.deleteMany({});
    const patients = [
      { name: "John Doe", detail: "General checkup and mild fever." },
      { name: "Sarah Smith", detail: "Post-surgery recovery consultation." },
      { name: "Michael Johnson", detail: "Diabetes management and insulin review." },
      { name: "Emily Davis", detail: "Annual physical exam and blood work." },
      { name: "Robert Wilson", detail: "Cardiology follow-up for hypertension." },
      { name: "Jessica Brown", detail: "Dermatology consultation for skin rash." },
      { name: "David Miller", detail: "Orthopedic review for knee pain." },
      { name: "Laura Taylor", detail: "Neurology screening for migraine issues." },
      { name: "Kevin Lanil", detail: "Pediatric checkup for group assignment." },
      { name: "Anna White", detail: "Nutrition and diet planning session." }
    ];
    await Patient.insertMany(patients);

    // 3. Doctors
    const Doctor = mongoose.model('Doctor', new mongoose.Schema({ name: String, specialty: String, available: Boolean }));
    await Doctor.deleteMany({});
    const doctors = [
      { name: "Dr. James Smith", specialty: "Cardiology", available: true },
      { name: "Dr. Mary Brown", specialty: "Neurology", available: true },
      { name: "Dr. Robert Wilson", specialty: "Pediatrics", available: false },
      { name: "Dr. Linda Taylor", specialty: "Orthopedics", available: true },
      { name: "Dr. William Miller", specialty: "General Surgery", available: true },
      { name: "Dr. Elizabeth Davis", specialty: "Dermatology", available: true },
      { name: "Dr. Richard Garcia", specialty: "Oncology", available: true },
      { name: "Dr. Susan Martinez", specialty: "Gastroenterology", available: false },
      { name: "Dr. Joseph Clark", specialty: "Psychiatry", available: true },
      { name: "Dr. Margaret Lewis", specialty: "Endocrinology", available: true }
    ];
    await Doctor.insertMany(doctors);

    // 4. Appointments
    const Appointment = mongoose.model('Appointment', new mongoose.Schema({ patientId: String, doctorId: String, date: String, status: String }));
    await Appointment.deleteMany({});
    const appointments = Array.from({ length: 10 }).map((_, i) => ({
      patientId: patients[i % 10].name,
      doctorId: doctors[i % 10].name,
      date: `2026-03-${10 + i}`,
      status: i % 2 === 0 ? "Confirmed" : "Scheduled"
    }));
    await Appointment.insertMany(appointments);

    // 5. Prescriptions
    const Prescription = mongoose.model('Prescription', new mongoose.Schema({ patientId: String, medication: String, dosage: String, date: String }));
    await Prescription.deleteMany({});
    const prescriptions = Array.from({ length: 10 }).map((_, i) => ({
      patientId: patients[i % 10].name,
      medication: `${['Amoxicillin', 'Lisinopril', 'Metformin', 'Lipitor', 'Zoloft'][i % 5]}`,
      dosage: `${(i + 1) * 10}mg once daily`,
      date: "2026-03-26"
    }));
    await Prescription.insertMany(prescriptions);

    // 6. Bills
    const Bill = mongoose.model('Bill', new mongoose.Schema({ patientId: String, amount: Number, status: String, date: String }));
    await Bill.deleteMany({});
    const bills = Array.from({ length: 10 }).map((_, i) => ({
      patientId: patients[i % 10].name,
      amount: 450.00 + (i * 125.50),
      status: i % 3 === 0 ? "Paid" : "Pending",
      date: "2026-03-25"
    }));
    await Bill.insertMany(bills);

    // 7. Lab Reports
    const LabReport = mongoose.model('LabReport', new mongoose.Schema({ patientId: String, testName: String, result: String, date: String }));
    await LabReport.deleteMany({});
    const reports = Array.from({ length: 10 }).map((_, i) => ({
      patientId: patients[i % 10].name,
      testName: `${['Blood Panel', 'MRI Scan', 'Chest X-Ray', 'Urine Analysis', 'ECG'][i % 5]}`,
      result: i % 4 === 0 ? "Critical" : "Normal",
      date: "2026-03-24"
    }));
    await LabReport.insertMany(reports);

    console.log('Rich sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
