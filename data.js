// data.js — In-memory seed data for MedSecureAI prototype
// All four arrays are exported; server.js imports and uses them as the live store.
// Data resets on server restart (by design for a prototype).

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// ─────────────────────────────────────────────────────────────────────────────
// 1. USERS  (8 total: 6 doctors + 2 admins)
// ─────────────────────────────────────────────────────────────────────────────
export const users = [
  {
    id: 1, username: 'dr.smith', displayName: 'Dr. Arjun Smith',
    role: 'doctor', department: 'Cardiology',
    passwordHash: bcrypt.hashSync('doctor123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-17T09:12:00.000Z',
  },
  {
    id: 2, username: 'dr.patel', displayName: 'Dr. Priya Patel',
    role: 'doctor', department: 'Neurology',
    passwordHash: bcrypt.hashSync('doctor123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-18T07:45:00.000Z',
  },
  {
    id: 3, username: 'dr.jones', displayName: 'Dr. Kavya Jones',
    role: 'doctor', department: 'Oncology',
    passwordHash: bcrypt.hashSync('doctor123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-16T14:30:00.000Z',
  },
  {
    id: 4, username: 'dr.williams', displayName: 'Dr. Rohit Williams',
    role: 'doctor', department: 'Cardiology',
    passwordHash: bcrypt.hashSync('doctor123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-18T11:00:00.000Z',
  },
  {
    id: 5, username: 'dr.mehta', displayName: 'Dr. Sneha Mehta',
    role: 'doctor', department: 'Orthopaedics',
    passwordHash: bcrypt.hashSync('doctor123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-17T16:50:00.000Z',
  },
  {
    id: 6, username: 'dr.chen', displayName: 'Dr. Anika Chen',
    role: 'doctor', department: 'Neurology',
    passwordHash: bcrypt.hashSync('doctor123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-15T08:20:00.000Z',
  },
  {
    id: 7, username: 'admin', displayName: 'System Administrator',
    role: 'admin', department: 'Administration',
    passwordHash: bcrypt.hashSync('admin123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-18T06:00:00.000Z',
  },
  {
    id: 8, username: 'sysadmin', displayName: 'IT Security Admin',
    role: 'admin', department: 'Administration',
    passwordHash: bcrypt.hashSync('admin123', SALT_ROUNDS),
    isActive: true, lastLogin: '2026-03-17T22:15:00.000Z',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATIENTS  (55 total — realistic Indian hospital data)
// ─────────────────────────────────────────────────────────────────────────────
export const patients = [
  // ── Cardiology ──────────────────────────────────────────────────────────
  { patientId: 'P-1001', name: 'Ramesh Kumar',      age: 58, condition: 'Hypertension',           sensitivityLevel: 'Low',    department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'B+',  admissionDate: '2025-11-10', ward: 'General' },
  { patientId: 'P-1002', name: 'Sunita Devi',       age: 62, condition: 'Coronary Artery Disease', sensitivityLevel: 'High',   department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'O+',  admissionDate: '2026-01-05', ward: 'ICU' },
  { patientId: 'P-1003', name: 'Anil Sharma',       age: 45, condition: 'Cardiac Arrhythmia',      sensitivityLevel: 'Medium', department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'A+',  admissionDate: '2026-02-14', ward: 'Private' },
  { patientId: 'P-1004', name: 'Meena Krishnan',    age: 70, condition: 'Coronary Artery Disease', sensitivityLevel: 'High',   department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'AB+', admissionDate: '2025-12-20', ward: 'ICU' },
  { patientId: 'P-1005', name: 'Vikram Nair',       age: 52, condition: 'Hypertension',            sensitivityLevel: 'Low',    department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'O-',  admissionDate: '2026-01-18', ward: 'General' },
  { patientId: 'P-1006', name: 'Geeta Reddy',       age: 48, condition: 'Cardiac Arrhythmia',      sensitivityLevel: 'Medium', department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'B-',  admissionDate: '2026-03-01', ward: 'Semi-Private' },
  { patientId: 'P-1007', name: 'Harish Gupta',      age: 65, condition: 'Coronary Artery Disease', sensitivityLevel: 'High',   department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'A+',  admissionDate: '2026-02-28', ward: 'ICU' },
  { patientId: 'P-1008', name: 'Lalitha Iyer',      age: 55, condition: 'Hypertension',            sensitivityLevel: 'Low',    department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'O+',  admissionDate: '2026-01-30', ward: 'General' },
  { patientId: 'P-1009', name: 'Deepak Malhotra',   age: 60, condition: 'Cardiac Arrhythmia',      sensitivityLevel: 'Medium', department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'B+',  admissionDate: '2025-10-15', ward: 'Semi-Private' },

  // ── Neurology ────────────────────────────────────────────────────────────
  { patientId: 'P-1010', name: 'Rekha Pillai',      age: 34, condition: 'Migraine',                sensitivityLevel: 'Low',    department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'A-',  admissionDate: '2026-03-05', ward: 'General' },
  { patientId: 'P-1011', name: 'Suresh Menon',      age: 42, condition: 'Epilepsy',                sensitivityLevel: 'Medium', department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'O+',  admissionDate: '2026-02-10', ward: 'Semi-Private' },
  { patientId: 'P-1012', name: 'Ananya Bose',       age: 29, condition: 'Migraine',                sensitivityLevel: 'Low',    department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'B+',  admissionDate: '2026-01-22', ward: 'General' },
  { patientId: 'P-1013', name: 'Rajan Srinivasan',  age: 68, condition: 'Stroke',                  sensitivityLevel: 'High',   department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'AB+', admissionDate: '2025-12-08', ward: 'ICU' },
  { patientId: 'P-1014', name: 'Preethi Naidu',     age: 37, condition: 'Epilepsy',                sensitivityLevel: 'Medium', department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'A+',  admissionDate: '2026-02-25', ward: 'Private' },
  { patientId: 'P-1015', name: 'Arvind Das',        age: 75, condition: 'Stroke',                  sensitivityLevel: 'High',   department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'O-',  admissionDate: '2026-01-12', ward: 'ICU' },
  { patientId: 'P-1016', name: 'Swati Joshi',       age: 26, condition: 'Migraine',                sensitivityLevel: 'Low',    department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'B-',  admissionDate: '2026-03-10', ward: 'General' },
  { patientId: 'P-1017', name: 'Naresh Varma',      age: 54, condition: 'Epilepsy',                sensitivityLevel: 'Medium', department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'O+',  admissionDate: '2025-11-28', ward: 'Semi-Private' },
  { patientId: 'P-1018', name: 'Chithra Balaji',    age: 61, condition: 'Stroke',                  sensitivityLevel: 'High',   department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'A+',  admissionDate: '2026-02-03', ward: 'ICU' },

  // ── Oncology ─────────────────────────────────────────────────────────────
  { patientId: 'P-1019', name: 'Kavitha Rajan',     age: 46, condition: 'Lung Cancer',             sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'B+',  admissionDate: '2025-09-15', ward: 'Private' },
  { patientId: 'P-1020', name: 'Sanjay Aggarwal',   age: 53, condition: 'Brain Tumour',            sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'O+',  admissionDate: '2025-10-20', ward: 'ICU' },
  { patientId: 'P-1021', name: 'Usha Krishnamurthy',age: 67, condition: 'Lung Cancer',             sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'AB+', admissionDate: '2025-08-04', ward: 'Private' },
  { patientId: 'P-1022', name: 'Mohan Lal',         age: 72, condition: 'Brain Tumour',            sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'A-',  admissionDate: '2025-11-30', ward: 'ICU' },
  { patientId: 'P-1023', name: 'Padmini Venkat',    age: 59, condition: 'Lung Cancer',             sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'O-',  admissionDate: '2026-01-08', ward: 'Private' },
  { patientId: 'P-1024', name: 'Ajay Bhattacharya', age: 44, condition: 'Brain Tumour',            sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'B+',  admissionDate: '2025-12-14', ward: 'ICU' },

  // ── Orthopaedics ─────────────────────────────────────────────────────────
  { patientId: 'P-1025', name: 'Leela Shankar',     age: 74, condition: 'Osteoporosis',            sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'O+',  admissionDate: '2026-02-20', ward: 'General' },
  { patientId: 'P-1026', name: 'Dinesh Tiwari',     age: 32, condition: 'Fracture',                sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'A+',  admissionDate: '2026-03-07', ward: 'Semi-Private' },
  { patientId: 'P-1027', name: 'Asha Mishra',       age: 66, condition: 'Osteoporosis',            sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'B+',  admissionDate: '2026-01-27', ward: 'General' },
  { patientId: 'P-1028', name: 'Ravi Chandran',     age: 19, condition: 'Fracture',                sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'O-',  admissionDate: '2026-03-12', ward: 'General' },
  { patientId: 'P-1029', name: 'Nalini Murthy',     age: 78, condition: 'Osteoporosis',            sensitivityLevel: 'Medium', department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'AB+', admissionDate: '2025-12-01', ward: 'Private' },
  { patientId: 'P-1030', name: 'Gopal Rao',         age: 25, condition: 'Fracture',                sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'B-',  admissionDate: '2026-02-15', ward: 'Semi-Private' },

  // ── Mixed conditions (continued) ─────────────────────────────────────────
  { patientId: 'P-1031', name: 'Savitha Kumar',     age: 40, condition: 'Diabetes Type 2',         sensitivityLevel: 'Low',    department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'A+',  admissionDate: '2026-02-05', ward: 'General' },
  { patientId: 'P-1032', name: 'Balaji Iyer',       age: 56, condition: 'Kidney Stones',           sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'O+',  admissionDate: '2026-01-14', ward: 'Semi-Private' },
  { patientId: 'P-1033', name: 'Meenakshi Pillai',  age: 33, condition: 'Anaemia',                 sensitivityLevel: 'Low',    department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'B+',  admissionDate: '2026-03-03', ward: 'General' },
  { patientId: 'P-1034', name: 'Sudhir Prasad',     age: 47, condition: 'Appendicitis',            sensitivityLevel: 'Medium', department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'A-',  admissionDate: '2026-02-18', ward: 'Semi-Private' },
  { patientId: 'P-1035', name: 'Renuka Bhat',       age: 51, condition: 'Diabetes Type 2',         sensitivityLevel: 'Medium', department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'O+',  admissionDate: '2026-01-09', ward: 'General' },
  { patientId: 'P-1036', name: 'Prakash Nambiar',   age: 63, condition: 'Pneumonia',               sensitivityLevel: 'Medium', department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'AB+', admissionDate: '2026-03-08', ward: 'Semi-Private' },
  { patientId: 'P-1037', name: 'Jaya Sankaran',     age: 38, condition: 'Kidney Stones',           sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'B+',  admissionDate: '2026-02-22', ward: 'General' },
  { patientId: 'P-1038', name: 'Vinod Chawla',      age: 57, condition: 'Hypertension',            sensitivityLevel: 'Low',    department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'O-',  admissionDate: '2026-01-20', ward: 'General' },
  { patientId: 'P-1039', name: 'Saranya Venkatesh', age: 23, condition: 'Anaemia',                 sensitivityLevel: 'Low',    department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'A+',  admissionDate: '2026-03-14', ward: 'General' },
  { patientId: 'P-1040', name: 'Rajendra Shetty',   age: 69, condition: 'Stroke',                  sensitivityLevel: 'High',   department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'O+',  admissionDate: '2025-11-15', ward: 'ICU' },
  { patientId: 'P-1041', name: 'Kamala Subramaniam',age: 76, condition: 'Coronary Artery Disease', sensitivityLevel: 'High',   department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'B-',  admissionDate: '2025-10-28', ward: 'ICU' },
  { patientId: 'P-1042', name: 'Arjun Menon',       age: 35, condition: 'Epilepsy',                sensitivityLevel: 'Medium', department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'A+',  admissionDate: '2026-02-08', ward: 'Semi-Private' },
  { patientId: 'P-1043', name: 'Nirmala Choudhary', age: 58, condition: 'Diabetes Type 2',         sensitivityLevel: 'Medium', department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'O+',  admissionDate: '2026-01-25', ward: 'General' },
  { patientId: 'P-1044', name: 'Sathish Babu',      age: 43, condition: 'Appendicitis',            sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'B+',  admissionDate: '2026-03-11', ward: 'Semi-Private' },
  { patientId: 'P-1045', name: 'Vimala Rajan',      age: 64, condition: 'Pneumonia',               sensitivityLevel: 'Medium', department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'AB-', admissionDate: '2026-02-28', ward: 'Private' },
  { patientId: 'P-1046', name: 'Chandrasekhar Dev', age: 80, condition: 'Brain Tumour',            sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'O+',  admissionDate: '2025-09-01', ward: 'ICU' },
  { patientId: 'P-1047', name: 'Nalini Kapoor',     age: 27, condition: 'Kidney Stones',           sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'A+',  admissionDate: '2026-03-15', ward: 'General' },
  { patientId: 'P-1048', name: 'Mohan Krishnan',    age: 50, condition: 'Hypertension',            sensitivityLevel: 'Low',    department: 'Cardiology',    assignedDoctor: 'dr.smith',    bloodGroup: 'B+',  admissionDate: '2026-02-12', ward: 'General' },
  { patientId: 'P-1049', name: 'Parvati Singh',     age: 41, condition: 'Cardiac Arrhythmia',      sensitivityLevel: 'Medium', department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'O+',  admissionDate: '2026-01-31', ward: 'Semi-Private' },
  { patientId: 'P-1050', name: 'Rajan Pillai',      age: 73, condition: 'Lung Cancer',             sensitivityLevel: 'High',   department: 'Oncology',      assignedDoctor: 'dr.jones',    bloodGroup: 'A-',  admissionDate: '2025-07-22', ward: 'ICU' },
  { patientId: 'P-1051', name: 'Kamini Nair',       age: 36, condition: 'Migraine',                sensitivityLevel: 'Low',    department: 'Neurology',     assignedDoctor: 'dr.chen',     bloodGroup: 'B+',  admissionDate: '2026-03-06', ward: 'General' },
  { patientId: 'P-1052', name: 'Suresh Kulkarni',   age: 49, condition: 'Diabetes Type 2',         sensitivityLevel: 'Low',    department: 'Cardiology',    assignedDoctor: 'dr.williams', bloodGroup: 'O+',  admissionDate: '2026-02-17', ward: 'General' },
  { patientId: 'P-1053', name: 'Sheela Menon',      age: 55, condition: 'Osteoporosis',            sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'A+',  admissionDate: '2025-12-25', ward: 'Semi-Private' },
  { patientId: 'P-1054', name: 'Abhishek Tomar',    age: 18, condition: 'Fracture',                sensitivityLevel: 'Low',    department: 'Orthopaedics',  assignedDoctor: 'dr.mehta',    bloodGroup: 'B-',  admissionDate: '2026-03-16', ward: 'General' },
  { patientId: 'P-1055', name: 'Vasantha Raju',     age: 77, condition: 'Stroke',                  sensitivityLevel: 'High',   department: 'Neurology',     assignedDoctor: 'dr.patel',    bloodGroup: 'O+',  admissionDate: '2025-10-05', ward: 'ICU' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers for seeding logs — timestamps spread over the last 30 days
// ─────────────────────────────────────────────────────────────────────────────
function daysAgo(d, h = 10, m = 0) {
  const t = new Date('2026-03-18T00:00:00.000Z');
  t.setDate(t.getDate() - d);
  t.setHours(h, m, 0, 0);
  return t.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. AUDIT LOGS  (40 pre-existing entries)
//    ~70% Granted, ~20% Flagged, ~10% Restricted  →  28 G / 8 F / 4 R
// ─────────────────────────────────────────────────────────────────────────────
export let auditLogs = [
  // ── Granted (28) ──────────────────────────────────────────────────────
  { id:  1, timestamp: daysAgo(30,  9,  5), username: 'dr.smith',    displayName: 'Dr. Arjun Smith',    user: 'dr.smith',    action: 'Access Attempt: P-1001', patientId: 'P-1001', patientName: 'Ramesh Kumar',        reason: 'Routine checkup',    decision: 'Granted',    confidenceScore: 95, riskReason: 'Standard access — no anomalies detected',              risk:  5, status: 'Allowed' },
  { id:  2, timestamp: daysAgo(29, 10, 30), username: 'dr.patel',    displayName: 'Dr. Priya Patel',    user: 'dr.patel',    action: 'Access Attempt: P-1010', patientId: 'P-1010', patientName: 'Rekha Pillai',        reason: 'Follow-up visit',    decision: 'Granted',    confidenceScore: 91, riskReason: 'Standard access — no anomalies detected',              risk:  9, status: 'Allowed' },
  { id:  3, timestamp: daysAgo(28, 11, 15), username: 'dr.jones',    displayName: 'Dr. Kavya Jones',    user: 'dr.jones',    action: 'Access Attempt: P-1019', patientId: 'P-1019', patientName: 'Kavitha Rajan',       reason: 'Chemotherapy review', decision: 'Granted',   confidenceScore: 88, riskReason: 'Standard access — no anomalies detected',              risk: 12, status: 'Allowed' },
  { id:  4, timestamp: daysAgo(27,  8, 45), username: 'dr.williams', displayName: 'Dr. Rohit Williams', user: 'dr.williams', action: 'Access Attempt: P-1002', patientId: 'P-1002', patientName: 'Sunita Devi',         reason: 'Post-surgery review', decision: 'Granted',   confidenceScore: 93, riskReason: 'Standard access — no anomalies detected',              risk:  7, status: 'Allowed' },
  { id:  5, timestamp: daysAgo(26, 14, 20), username: 'dr.mehta',    displayName: 'Dr. Sneha Mehta',    user: 'dr.mehta',    action: 'Access Attempt: P-1025', patientId: 'P-1025', patientName: 'Leela Shankar',       reason: 'X-ray review',       decision: 'Granted',    confidenceScore: 97, riskReason: 'Low-sensitivity patient; standard access',             risk:  3, status: 'Allowed' },
  { id:  6, timestamp: daysAgo(25, 15, 10), username: 'dr.chen',     displayName: 'Dr. Anika Chen',     user: 'dr.chen',     action: 'Access Attempt: P-1011', patientId: 'P-1011', patientName: 'Suresh Menon',        reason: 'EEG result review',  decision: 'Granted',    confidenceScore: 90, riskReason: 'Standard access — no anomalies detected',              risk: 10, status: 'Allowed' },
  { id:  7, timestamp: daysAgo(24,  9, 50), username: 'dr.smith',    displayName: 'Dr. Arjun Smith',    user: 'dr.smith',    action: 'Access Attempt: P-1003', patientId: 'P-1003', patientName: 'Anil Sharma',         reason: 'ECG follow-up',      decision: 'Granted',    confidenceScore: 92, riskReason: 'Standard access — no anomalies detected',              risk:  8, status: 'Allowed' },
  { id:  8, timestamp: daysAgo(23, 11,  5), username: 'dr.patel',    displayName: 'Dr. Priya Patel',    user: 'dr.patel',    action: 'Access Attempt: P-1012', patientId: 'P-1012', patientName: 'Ananya Bose',         reason: 'Medication review',  decision: 'Granted',    confidenceScore: 96, riskReason: 'Low-sensitivity patient; standard access',             risk:  4, status: 'Allowed' },
  { id:  9, timestamp: daysAgo(22, 13, 30), username: 'dr.jones',    displayName: 'Dr. Kavya Jones',    user: 'dr.jones',    action: 'Access Attempt: P-1020', patientId: 'P-1020', patientName: 'Sanjay Aggarwal',     reason: 'MRI interpretation', decision: 'Granted',    confidenceScore: 87, riskReason: 'Standard access — no anomalies detected',              risk: 13, status: 'Allowed' },
  { id: 10, timestamp: daysAgo(21, 10, 15), username: 'dr.williams', displayName: 'Dr. Rohit Williams', user: 'dr.williams', action: 'Access Attempt: P-1035', patientId: 'P-1035', patientName: 'Renuka Bhat',         reason: 'Diabetes management', decision: 'Granted',   confidenceScore: 94, riskReason: 'Standard access — no anomalies detected',              risk:  6, status: 'Allowed' },
  { id: 11, timestamp: daysAgo(20,  9, 40), username: 'dr.mehta',    displayName: 'Dr. Sneha Mehta',    user: 'dr.mehta',    action: 'Access Attempt: P-1026', patientId: 'P-1026', patientName: 'Dinesh Tiwari',       reason: 'Fracture assessment', decision: 'Granted',   confidenceScore: 98, riskReason: 'Low-sensitivity patient; standard access',             risk:  2, status: 'Allowed' },
  { id: 12, timestamp: daysAgo(19, 14, 55), username: 'dr.chen',     displayName: 'Dr. Anika Chen',     user: 'dr.chen',     action: 'Access Attempt: P-1016', patientId: 'P-1016', patientName: 'Swati Joshi',         reason: 'Migraine therapy',   decision: 'Granted',    confidenceScore: 95, riskReason: 'Low-sensitivity patient; standard access',             risk:  5, status: 'Allowed' },
  { id: 13, timestamp: daysAgo(18, 10, 20), username: 'dr.smith',    displayName: 'Dr. Arjun Smith',    user: 'dr.smith',    action: 'Access Attempt: P-1005', patientId: 'P-1005', patientName: 'Vikram Nair',         reason: 'BP monitoring',      decision: 'Granted',    confidenceScore: 97, riskReason: 'Low-sensitivity patient; standard access',             risk:  3, status: 'Allowed' },
  { id: 14, timestamp: daysAgo(17, 12, 45), username: 'dr.patel',    displayName: 'Dr. Priya Patel',    user: 'dr.patel',    action: 'Access Attempt: P-1014', patientId: 'P-1014', patientName: 'Preethi Naidu',       reason: 'Anti-epileptic dose', decision: 'Granted',   confidenceScore: 89, riskReason: 'Standard access — no anomalies detected',              risk: 11, status: 'Allowed' },
  { id: 15, timestamp: daysAgo(16,  8, 35), username: 'dr.jones',    displayName: 'Dr. Kavya Jones',    user: 'dr.jones',    action: 'Access Attempt: P-1021', patientId: 'P-1021', patientName: 'Usha Krishnamurthy',  reason: 'Radiation planning', decision: 'Granted',    confidenceScore: 86, riskReason: 'Standard access — no anomalies detected',              risk: 14, status: 'Allowed' },
  { id: 16, timestamp: daysAgo(15, 15, 30), username: 'dr.williams', displayName: 'Dr. Rohit Williams', user: 'dr.williams', action: 'Access Attempt: P-1041', patientId: 'P-1041', patientName: 'Kamala Subramaniam',  reason: 'Cardiac monitoring', decision: 'Granted',    confidenceScore: 85, riskReason: 'Standard access — no anomalies detected',              risk: 15, status: 'Allowed' },
  { id: 17, timestamp: daysAgo(14, 11, 10), username: 'dr.mehta',    displayName: 'Dr. Sneha Mehta',    user: 'dr.mehta',    action: 'Access Attempt: P-1029', patientId: 'P-1029', patientName: 'Nalini Murthy',       reason: 'Physio referral',    decision: 'Granted',    confidenceScore: 91, riskReason: 'Standard access — no anomalies detected',              risk:  9, status: 'Allowed' },
  { id: 18, timestamp: daysAgo(13, 13,  5), username: 'dr.chen',     displayName: 'Dr. Anika Chen',     user: 'dr.chen',     action: 'Access Attempt: P-1033', patientId: 'P-1033', patientName: 'Meenakshi Pillai',    reason: 'Anaemia treatment',  decision: 'Granted',    confidenceScore: 96, riskReason: 'Low-sensitivity patient; standard access',             risk:  4, status: 'Allowed' },
  { id: 19, timestamp: daysAgo(12,  9, 25), username: 'dr.smith',    displayName: 'Dr. Arjun Smith',    user: 'dr.smith',    action: 'Access Attempt: P-1031', patientId: 'P-1031', patientName: 'Savitha Kumar',       reason: 'Blood sugar control', decision: 'Granted',   confidenceScore: 93, riskReason: 'Low-sensitivity patient; standard access',             risk:  7, status: 'Allowed' },
  { id: 20, timestamp: daysAgo(11, 10, 40), username: 'dr.patel',    displayName: 'Dr. Priya Patel',    user: 'dr.patel',    action: 'Access Attempt: P-1036', patientId: 'P-1036', patientName: 'Prakash Nambiar',     reason: 'Pneumonia follow-up', decision: 'Granted',   confidenceScore: 90, riskReason: 'Standard access — no anomalies detected',              risk: 10, status: 'Allowed' },
  { id: 21, timestamp: daysAgo(10, 14, 50), username: 'dr.jones',    displayName: 'Dr. Kavya Jones',    user: 'dr.jones',    action: 'Access Attempt: P-1022', patientId: 'P-1022', patientName: 'Mohan Lal',           reason: 'PET scan review',    decision: 'Granted',    confidenceScore: 88, riskReason: 'Standard access — no anomalies detected',              risk: 12, status: 'Allowed' },
  { id: 22, timestamp: daysAgo( 9, 11, 20), username: 'dr.williams', displayName: 'Dr. Rohit Williams', user: 'dr.williams', action: 'Access Attempt: P-1006', patientId: 'P-1006', patientName: 'Geeta Reddy',         reason: 'Holter monitor',     decision: 'Granted',    confidenceScore: 94, riskReason: 'Standard access — no anomalies detected',              risk:  6, status: 'Allowed' },
  { id: 23, timestamp: daysAgo( 8, 10,  5), username: 'dr.mehta',    displayName: 'Dr. Sneha Mehta',    user: 'dr.mehta',    action: 'Access Attempt: P-1030', patientId: 'P-1030', patientName: 'Gopal Rao',           reason: 'Cast removal',       decision: 'Granted',    confidenceScore: 99, riskReason: 'Low-sensitivity patient; standard access',             risk:  1, status: 'Allowed' },
  { id: 24, timestamp: daysAgo( 7, 15, 40), username: 'dr.chen',     displayName: 'Dr. Anika Chen',     user: 'dr.chen',     action: 'Access Attempt: P-1017', patientId: 'P-1017', patientName: 'Naresh Varma',        reason: 'Seizure medication', decision: 'Granted',    confidenceScore: 88, riskReason: 'Standard access — no anomalies detected',              risk: 12, status: 'Allowed' },
  { id: 25, timestamp: daysAgo( 6,  8, 55), username: 'dr.smith',    displayName: 'Dr. Arjun Smith',    user: 'dr.smith',    action: 'Access Attempt: P-1038', patientId: 'P-1038', patientName: 'Vinod Chawla',        reason: 'Hypertension review', decision: 'Granted',   confidenceScore: 95, riskReason: 'Low-sensitivity patient; standard access',             risk:  5, status: 'Allowed' },
  { id: 26, timestamp: daysAgo( 5, 12, 30), username: 'dr.patel',    displayName: 'Dr. Priya Patel',    user: 'dr.patel',    action: 'Access Attempt: P-1045', patientId: 'P-1045', patientName: 'Vimala Rajan',        reason: 'Pneumonia discharge', decision: 'Granted',   confidenceScore: 91, riskReason: 'Standard access — no anomalies detected',              risk:  9, status: 'Allowed' },
  { id: 27, timestamp: daysAgo( 4, 13, 15), username: 'dr.mehta',    displayName: 'Dr. Sneha Mehta',    user: 'dr.mehta',    action: 'Access Attempt: P-1044', patientId: 'P-1044', patientName: 'Sathish Babu',        reason: 'Post-op assessment', decision: 'Granted',    confidenceScore: 97, riskReason: 'Low-sensitivity patient; standard access',             risk:  3, status: 'Allowed' },
  { id: 28, timestamp: daysAgo( 3, 10, 45), username: 'dr.chen',     displayName: 'Dr. Anika Chen',     user: 'dr.chen',     action: 'Access Attempt: P-1051', patientId: 'P-1051', patientName: 'Kamini Nair',         reason: 'Migraine prevention', decision: 'Granted',   confidenceScore: 96, riskReason: 'Low-sensitivity patient; standard access',             risk:  4, status: 'Allowed' },

  // ── Flagged (8) ───────────────────────────────────────────────────────
  { id: 29, timestamp: daysAgo(28,  7, 30), username: 'dr.jones',    displayName: 'Dr. Kavya Jones',    user: 'dr.jones',    action: 'Access Attempt: P-1023', patientId: 'P-1023', patientName: 'Padmini Venkat',      reason: 'Night duty check',   decision: 'Flagged',    confidenceScore: 68, riskReason: 'Access outside normal hours (6am–10pm); High-sensitivity patient record', risk: 32, status: 'Warning' },
  { id: 30, timestamp: daysAgo(22, 19,  5), username: 'dr.smith',    displayName: 'Dr. Arjun Smith',    user: 'dr.smith',    action: 'Access Attempt: P-1007', patientId: 'P-1007', patientName: 'Harish Gupta',        reason: 'Emergency consult',  decision: 'Flagged',    confidenceScore: 64, riskReason: 'High-sensitivity patient record; unusual access velocity',        risk: 36, status: 'Warning' },
  { id: 31, timestamp: daysAgo(18, 20, 45), username: 'dr.patel',    displayName: 'Dr. Priya Patel',    user: 'dr.patel',    action: 'Access Attempt: P-1013', patientId: 'P-1013', patientName: 'Rajan Srinivasan',    reason: 'Stroke monitoring',  decision: 'Flagged',    confidenceScore: 71, riskReason: 'High-sensitivity patient record; access near non-working hours',    risk: 29, status: 'Warning' },
  { id: 32, timestamp: daysAgo(14, 21, 20), username: 'dr.williams', displayName: 'Dr. Rohit Williams', user: 'dr.williams', action: 'Access Attempt: P-1004', patientId: 'P-1004', patientName: 'Meena Krishnan',      reason: 'ICU night round',    decision: 'Flagged',    confidenceScore: 65, riskReason: 'Access outside normal hours (6am–10pm); High-sensitivity patient record', risk: 35, status: 'Warning' },
  { id: 33, timestamp: daysAgo(11, 18, 50), username: 'dr.jones',    displayName: 'Dr. Kavya Jones',    user: 'dr.jones',    action: 'Access Attempt: P-1024', patientId: 'P-1024', patientName: 'Ajay Bhattacharya',   reason: 'Tumour response',    decision: 'Flagged',    confidenceScore: 70, riskReason: 'High-sensitivity patient record; above-average access frequency',   risk: 30, status: 'Warning' },
  { id: 34, timestamp: daysAgo( 8, 19, 35), username: 'dr.chen',     displayName: 'Dr. Anika Chen',     user: 'dr.chen',     action: 'Access Attempt: P-1015', patientId: 'P-1015', patientName: 'Arvind Das',          reason: 'Critical care visit', decision: 'Flagged',   confidenceScore: 66, riskReason: 'High-sensitivity patient; access outside normal hours',             risk: 34, status: 'Warning' },
  { id: 35, timestamp: daysAgo( 5, 20, 10), username: 'dr.smith',    displayName: 'Dr. Arjun Smith',    user: 'dr.smith',    action: 'Access Attempt: P-1018', patientId: 'P-1018', patientName: 'Chithra Balaji',      reason: 'Stroke overnight',   decision: 'Flagged',    confidenceScore: 63, riskReason: 'Access outside normal hours (6am–10pm); High-sensitivity patient record', risk: 37, status: 'Warning' },
  { id: 36, timestamp: daysAgo( 2, 19, 55), username: 'dr.patel',    displayName: 'Dr. Priya Patel',    user: 'dr.patel',    action: 'Access Attempt: P-1040', patientId: 'P-1040', patientName: 'Rajendra Shetty',     reason: 'Night stroke check', decision: 'Flagged',    confidenceScore: 67, riskReason: 'High-sensitivity record; access outside normal hours',              risk: 33, status: 'Warning' },

  // ── Restricted (4) ───────────────────────────────────────────────────
  { id: 37, timestamp: daysAgo(25,  2, 45), username: 'dr.mehta',    displayName: 'Dr. Sneha Mehta',    user: 'dr.mehta',    action: 'Access Attempt: P-1046', patientId: 'P-1046', patientName: 'Chandrasekhar Dev',   reason: 'Cross-dept access',  decision: 'Restricted', confidenceScore: 42, riskReason: 'Access at 2:45 AM; High-sensitivity patient; excessive access velocity — 12 records this hour', risk: 58, status: 'Blocked' },
  { id: 38, timestamp: daysAgo(17,  3, 10), username: 'dr.williams', displayName: 'Dr. Rohit Williams', user: 'dr.williams', action: 'Access Attempt: P-1050', patientId: 'P-1050', patientName: 'Rajan Pillai',        reason: 'Unscheduled access', decision: 'Restricted', confidenceScore: 45, riskReason: 'Access at 3:10 AM; High-sensitivity patient; outside normal hours',        risk: 55, status: 'Blocked' },
  { id: 39, timestamp: daysAgo( 9,  1, 20), username: 'dr.jones',    displayName: 'Dr. Kavya Jones',    user: 'dr.jones',    action: 'Access Attempt: P-1022', patientId: 'P-1022', patientName: 'Mohan Lal',           reason: 'Unverified request', decision: 'Restricted', confidenceScore: 40, riskReason: 'Access at 1:20 AM; High-sensitivity patient; 14 accesses in the last hour',     risk: 60, status: 'Blocked' },
  { id: 40, timestamp: daysAgo( 1,  4,  5), username: 'dr.chen',     displayName: 'Dr. Anika Chen',     user: 'dr.chen',     action: 'Access Attempt: P-1055', patientId: 'P-1055', patientName: 'Vasantha Raju',       reason: 'Unauthorised query', decision: 'Restricted', confidenceScore: 44, riskReason: 'Access at 4:05 AM; High-sensitivity patient; extreme off-hours access',        risk: 56, status: 'Blocked' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. NOTIFICATIONS  (10 pre-existing — linked to Flagged/Restricted entries)
// ─────────────────────────────────────────────────────────────────────────────
export let notifications = [
  { id:  1, type: 'danger',  text: 'RESTRICTED: dr.mehta attempted off-hours access to Chandrasekhar Dev (P-1046) at 2:45 AM',     time: '25 days ago', timestamp: daysAgo(25, 2, 45), read: true  },
  { id:  2, type: 'warning', text: 'FLAGGED: dr.jones accessed high-sensitivity record Padmini Venkat (P-1023) outside working hours', time: '28 days ago', timestamp: daysAgo(28, 7, 30), read: true  },
  { id:  3, type: 'warning', text: 'FLAGGED: dr.smith accessed Harish Gupta (P-1007) with unusual access velocity detected',         time: '22 days ago', timestamp: daysAgo(22,19,  5), read: true  },
  { id:  4, type: 'danger',  text: 'RESTRICTED: dr.williams accessed Rajan Pillai (P-1050) at 3:10 AM — high-risk off-hours access', time: '17 days ago', timestamp: daysAgo(17, 3, 10), read: true  },
  { id:  5, type: 'warning', text: 'FLAGGED: dr.patel accessed ICU patient Rajan Srinivasan (P-1013) near non-working hours',        time: '18 days ago', timestamp: daysAgo(18,20, 45), read: false },
  { id:  6, type: 'warning', text: 'FLAGGED: dr.williams accessed ICU patient Meena Krishnan (P-1004) during night round',           time: '14 days ago', timestamp: daysAgo(14,21, 20), read: false },
  { id:  7, type: 'danger',  text: 'RESTRICTED: dr.jones attempted access to Mohan Lal (P-1022) at 1:20 AM — 14 accesses/hour',     time: '9 days ago',  timestamp: daysAgo( 9, 1, 20), read: false },
  { id:  8, type: 'warning', text: 'FLAGGED: dr.jones – high-sensitivity patient Ajay Bhattacharya (P-1024) accessed above frequency', time: '11 days ago', timestamp: daysAgo(11,18, 50), read: false },
  { id:  9, type: 'warning', text: 'FLAGGED: dr.smith accessed Chithra Balaji (P-1018) after 8 PM — off-hours check detected',       time: '5 days ago',  timestamp: daysAgo( 5,20, 10), read: false },
  { id: 10, type: 'danger',  text: 'RESTRICTED: dr.chen attempted access to Vasantha Raju (P-1055) at 4:05 AM — extreme off-hours',  time: '1 day ago',   timestamp: daysAgo( 1, 4,  5), read: false },
];

// Counters so server.js can keep IDs unique after seeding
export let nextLogId = 41;
export let nextNotifId = 11;
