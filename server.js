import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { users, patients, auditLogs, notifications, nextLogId as _nextLogId, nextNotifId as _nextNotifId } from './data.js';
const app = express();
const PORT = Number(process.env.PORT || 5001);
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_medsecureai_secret_change_me';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:5173']);
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

function getCookieOptions() {
    return {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 8 * 60 * 60 * 1000,
    };
}

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors({
    origin(origin, callback) {
        if (!origin || CLIENT_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
});

// ─────────────────────────────────────────────
// In-Memory Store (imported from data.js)
// ─────────────────────────────────────────────
// users, patients, auditLogs, notifications are live mutable arrays.
// Counters start after the seeded entries.
let nextLogId = _nextLogId;
let nextNotifId = _nextNotifId;

// ─────────────────────────────────────────────
// AI Decision Engine
// ─────────────────────────────────────────────
function aiDecisionEngine(patient, username) {
    const now = new Date();
    const hour = now.getHours();

    // Base weights
    let weights = { Granted: 70, Flagged: 20, Restricted: 10 };
    const reasons = [];

    // Modifier: outside 6am–10pm
    if (hour < 6 || hour >= 22) {
        weights.Restricted += 25;
        reasons.push('Access outside normal hours (6am–10pm)');
    }

    // Modifier: High sensitivity
    if (patient.sensitivityLevel === 'High') {
        weights.Flagged += 15;
        reasons.push('High-sensitivity patient record');
    }

    // Modifier: Low sensitivity
    if (patient.sensitivityLevel === 'Low') {
        weights.Granted += 10;
    }

    // Modifier: 10+ accesses in last hour by same user
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentCount = auditLogs.filter(
        l => l.username === username && new Date(l.timestamp) >= oneHourAgo
    ).length;
    if (recentCount >= 10) {
        weights.Restricted += 20;
        reasons.push('Excessive access velocity (10+ records/hour)');
    }

    // Normalize
    const total = weights.Granted + weights.Flagged + weights.Restricted;
    const grantedP = weights.Granted / total;
    const flaggedP = weights.Flagged / total;

    // Weighted random
    const rand = Math.random();
    let decision;
    if (rand < grantedP) {
        decision = 'Granted';
    } else if (rand < grantedP + flaggedP) {
        decision = 'Flagged';
    } else {
        decision = 'Restricted';
    }

    // Confidence score
    let confidenceScore;
    if (decision === 'Granted')    confidenceScore = Math.floor(Math.random() * 15) + 85; // 85–99
    else if (decision === 'Flagged') confidenceScore = Math.floor(Math.random() * 20) + 60; // 60–79
    else                             confidenceScore = Math.floor(Math.random() * 26) + 40; // 40–65

    // Risk reason string
    const riskReason = reasons.length > 0
        ? reasons.join('; ')
        : decision === 'Granted'
            ? 'Standard access — no anomalies detected'
            : 'Behavioral pattern anomaly detected';

    return { decision, confidenceScore, riskReason };
}

// ─────────────────────────────────────────────
// Auth Middleware
// ─────────────────────────────────────────────
function authMiddleware(req, res, next) {
    const cookieToken = req.cookies.token;
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

function roleMiddleware(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
        }
        next();
    };
}

// ─────────────────────────────────────────────
// Auth Routes
// ─────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'Username, password, and role are required' });
    }

    const user = users.find(u => u.username === username.toLowerCase().trim() && u.isActive);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role !== role) {
        return res.status(403).json({ success: false, message: `Selected role does not match this account. Sign in as ${user.role}.` });
    }

    const validPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();

    const token = jwt.sign(
        { id: user.id, username: user.username, displayName: user.displayName, role: user.role },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.cookie('token', token, getCookieOptions());

    return res.json({
        success: true,
        data: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            name: user.username,
            role: user.role,
            lastLogin: user.lastLogin,
        },
        token,
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', getCookieOptions());
    return res.json({ success: true, data: null });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user || !user.isActive) {
        res.clearCookie('token', getCookieOptions());
        return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }
    return res.json({
        success: true,
        data: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            name: user.username,
            role: user.role,
            lastLogin: user.lastLogin,
        }
    });
});

// ─────────────────────────────────────────────
// Patient Routes
// ─────────────────────────────────────────────
app.get('/api/patients', authMiddleware, (req, res) => {
    const { search, sensitivityLevel } = req.query;
    let result = [...patients];

    if (search) {
        const s = search.toLowerCase();
        result = result.filter(p =>
            p.name.toLowerCase().includes(s) ||
            p.patientId.toLowerCase().includes(s)
        );
    }
    if (sensitivityLevel && sensitivityLevel !== 'All') {
        result = result.filter(p => p.sensitivityLevel === sensitivityLevel);
    }

    return res.json({ success: true, data: result });
});

app.post('/api/patients/access/:patientId', authMiddleware, (req, res) => {
    const { patientId } = req.params;
    const { reason } = req.body;

    const patient = patients.find(p => p.patientId === patientId);
    if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const { decision, confidenceScore, riskReason } = aiDecisionEngine(patient, req.user.username);

    const logEntry = {
        id: nextLogId++,
        timestamp: new Date().toISOString(),
        username: req.user.username,
        displayName: req.user.displayName,
        user: req.user.username,
        action: `Access Attempt: ${patientId}`,
        patientId,
        patientName: patient.name,
        reason: reason || 'Treatment',
        decision,
        confidenceScore,
        riskReason,
        risk: 100 - confidenceScore,
        status: decision === 'Granted' ? 'Allowed' : decision === 'Flagged' ? 'Warning' : 'Blocked',
        details: riskReason,
    };
    auditLogs.unshift(logEntry);

    // Create notification for Flagged or Restricted
    if (decision === 'Flagged' || decision === 'Restricted') {
        notifications.unshift({
            id: nextNotifId++,
            type: decision === 'Restricted' ? 'danger' : 'warning',
            text: `${decision} access attempt by ${req.user.displayName} on ${patient.name}`,
            time: 'just now',
            timestamp: new Date().toISOString(),
            read: false,
        });
    }

    return res.json({ success: true, data: { decision, confidenceScore, riskReason, logId: logEntry.id } });
});

app.get('/api/patients/:patientId', authMiddleware, (req, res) => {
    const { patientId } = req.params;
    const patient = patients.find(p => p.patientId === patientId);
    if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Only return data if last decision for this user+patient was Granted within 5 mins
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const lastLog = auditLogs.find(
        l => l.patientId === patientId &&
             l.username === req.user.username &&
             l.decision === 'Granted' &&
             new Date(l.timestamp) >= fiveMinAgo
    );

    if (!lastLog) {
        return res.status(403).json({ success: false, message: 'Access not granted. Request access first.' });
    }

    return res.json({ success: true, data: patient });
});

// ─────────────────────────────────────────────
// Audit Routes (admin only)
// ─────────────────────────────────────────────
app.get('/api/audit/logs', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const { decision, username, date } = req.query;
    let result = [...auditLogs];

    if (decision && decision !== 'All') {
        result = result.filter(l => l.decision === decision);
    }
    if (username) {
        result = result.filter(l => l.username.toLowerCase().includes(username.toLowerCase()));
    }
    if (date) {
        result = result.filter(l => new Date(l.timestamp).toDateString() === new Date(date).toDateString());
    }

    return res.json({ success: true, data: result });
});

app.get('/api/audit/logs/export', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const headers = ['ID', 'Timestamp', 'Username', 'Patient ID', 'Patient Name', 'Action', 'Reason', 'Decision', 'Confidence Score', 'Risk Reason'];
    const rows = auditLogs.map(l => [
        l.id,
        l.timestamp,
        l.username,
        l.patientId || '',
        l.patientName || '',
        l.action,
        l.reason || '',
        l.decision,
        l.confidenceScore || '',
        `"${(l.riskReason || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.csv"');
    return res.send(csv);
});

app.get('/api/audit/stats', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const today = new Date().toDateString();
    const todayLogs = auditLogs.filter(l => new Date(l.timestamp).toDateString() === today);

    return res.json({
        success: true,
        data: {
            granted:    todayLogs.filter(l => l.decision === 'Granted').length,
            flagged:    todayLogs.filter(l => l.decision === 'Flagged').length,
            restricted: todayLogs.filter(l => l.decision === 'Restricted').length,
            total:      todayLogs.length,
        }
    });
});

// ─────────────────────────────────────────────
// Notification Routes
// ─────────────────────────────────────────────
app.get('/api/notifications', authMiddleware, (req, res) => {
    return res.json({ success: true, data: notifications });
});

app.patch('/api/notifications/:id/read', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const notif = notifications.find(n => n.id === id);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    notif.read = true;
    return res.json({ success: true, data: notif });
});

app.patch('/api/notifications/read-all', authMiddleware, (req, res) => {
    notifications.forEach(n => { n.read = true; });
    return res.json({ success: true, data: notifications });
});

// ─────────────────────────────────────────────
// Admin Routes
// ─────────────────────────────────────────────
app.get('/api/admin/users', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const safeUsers = users.map(user => {
        const safeUser = { ...user };
        delete safeUser.passwordHash;
        return safeUser;
    });
    return res.json({ success: true, data: safeUsers });
});

app.post('/api/admin/users', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const { username, displayName, role, password } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'username, password, role are required' });
    }
    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    const newUser = {
        id: users.length + 1,
        username,
        displayName: displayName || username,
        role,
        passwordHash: bcrypt.hashSync(password, SALT_ROUNDS),
        isActive: true,
        lastLogin: null,
    };
    users.push(newUser);
    const safeUser = { ...newUser };
    delete safeUser.passwordHash;
    return res.status(201).json({ success: true, data: safeUser });
});

app.patch('/api/admin/users/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { displayName, role, isActive, password } = req.body;
    if (displayName !== undefined) user.displayName = displayName;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return res.json({ success: true, data: safeUser });
});

app.delete('/api/admin/users/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = false;
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return res.json({ success: true, data: safeUser });
});

app.get('/api/admin/activity-feed', authMiddleware, roleMiddleware('admin'), (req, res) => {
    return res.json({ success: true, data: auditLogs.slice(0, 50) });
});

// ─────────────────────────────────────────────
// Clinical Notes  (Doctor)
// ─────────────────────────────────────────────
let notes = [];
let nextNoteId = 1;

function hasActiveAccess(patientId, username, windowMs = 30 * 60 * 1000) {
    const cutoff = new Date(Date.now() - windowMs);
    return auditLogs.some(
        l => l.patientId === patientId &&
             l.username === username &&
             l.decision === 'Granted' &&
             new Date(l.timestamp) >= cutoff
    );
}

app.post('/api/patients/:patientId/notes', authMiddleware, (req, res) => {
    const { patientId } = req.params;
    const { note } = req.body;
    if (!note || !note.trim()) return res.status(400).json({ success: false, message: 'Note text is required' });

    const patient = patients.find(p => p.patientId === patientId && p.isActive !== false);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    if (!hasActiveAccess(patientId, req.user.username)) {
        return res.status(403).json({ success: false, message: 'Active Granted access required within the last 30 minutes' });
    }

    const newNote = {
        id: nextNoteId++,
        patientId,
        doctorUsername: req.user.username,
        doctorName: req.user.displayName,
        note: note.trim(),
        timestamp: new Date().toISOString(),
    };
    notes.push(newNote);

    // Audit log
    auditLogs.unshift({
        id: nextLogId++,
        timestamp: newNote.timestamp,
        username: req.user.username,
        displayName: req.user.displayName,
        user: req.user.username,
        action: `Clinical Note Added: ${patientId}`,
        patientId, patientName: patient.name,
        reason: 'Clinical documentation',
        decision: 'Granted', confidenceScore: 100,
        riskReason: 'Routine clinical note — access pre-authenticated',
        risk: 0, status: 'Allowed',
    });

    return res.status(201).json({ success: true, data: newNote });
});

app.get('/api/patients/:patientId/notes', authMiddleware, (req, res) => {
    const { patientId } = req.params;
    const patient = patients.find(p => p.patientId === patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    if (req.user.role !== 'admin' && !hasActiveAccess(patientId, req.user.username)) {
        return res.status(403).json({ success: false, message: 'Active Granted access required' });
    }

    const patientNotes = notes.filter(n => n.patientId === patientId);
    return res.json({ success: true, data: patientNotes });
});

// ─────────────────────────────────────────────
// Patient Flags  (Doctor)
// ─────────────────────────────────────────────
let flags = [];
let nextFlagId = 1;

app.post('/api/patients/:patientId/flag', authMiddleware, (req, res) => {
    const { patientId } = req.params;
    const { reason } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ success: false, message: 'Reason is required' });

    const patient = patients.find(p => p.patientId === patientId && p.isActive !== false);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const flag = {
        id: nextFlagId++,
        patientId, patientName: patient.name,
        doctorUsername: req.user.username,
        doctorName: req.user.displayName,
        reason: reason.trim(),
        timestamp: new Date().toISOString(),
        resolved: false,
    };
    flags.push(flag);

    // Notify admin
    notifications.unshift({
        id: nextNotifId++,
        type: 'warning',
        text: `${req.user.displayName} flagged patient ${patient.name} (${patientId}) for admin review: "${reason.trim()}"`,
        time: 'just now',
        timestamp: flag.timestamp,
        read: false,
    });

    return res.status(201).json({ success: true, data: flag });
});

// ─────────────────────────────────────────────
// Doctor: My Patients & My Activity
// ─────────────────────────────────────────────
app.get('/api/doctor/my-patients', authMiddleware, (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).json({ success: false, message: 'Doctor role required' });
    const myPatients = patients.filter(
        p => p.assignedDoctor === req.user.username && p.isActive !== false
    );
    return res.json({ success: true, data: myPatients });
});

app.get('/api/doctor/my-activity', authMiddleware, (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).json({ success: false, message: 'Doctor role required' });
    const myLogs = auditLogs
        .filter(l => l.username === req.user.username)
        .slice(0, 30);
    return res.json({ success: true, data: myLogs });
});

// ─────────────────────────────────────────────
// Admin: Patient CRUD
// ─────────────────────────────────────────────
let nextPatientNum = 1056;

app.post('/api/patients', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const { name, age, condition, sensitivityLevel, department, assignedDoctor, bloodGroup, admissionDate, ward } = req.body;
    if (!name || !age || !condition || !sensitivityLevel || !department || !assignedDoctor) {
        return res.status(400).json({ success: false, message: 'name, age, condition, sensitivityLevel, department, assignedDoctor are required' });
    }
    const newPatient = {
        patientId: `P-${nextPatientNum++}`,
        name, age: Number(age), condition, sensitivityLevel, department, assignedDoctor,
        bloodGroup: bloodGroup || 'O+',
        admissionDate: admissionDate || new Date().toISOString().split('T')[0],
        ward: ward || 'General',
        isActive: true,
    };
    patients.push(newPatient);

    auditLogs.unshift({
        id: nextLogId++,
        timestamp: new Date().toISOString(),
        username: req.user.username, displayName: req.user.displayName, user: req.user.username,
        action: 'Patient Record Created by admin',
        patientId: newPatient.patientId, patientName: newPatient.name,
        reason: 'Admin patient registration',
        decision: 'Granted', confidenceScore: 100, riskReason: 'Admin operation',
        risk: 0, status: 'Allowed',
    });

    return res.status(201).json({ success: true, data: newPatient });
});

app.patch('/api/patients/:patientId', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const { patientId } = req.params;
    const patient = patients.find(p => p.patientId === patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const allowed = ['condition', 'sensitivityLevel', 'department', 'assignedDoctor', 'ward', 'bloodGroup', 'age'];
    allowed.forEach(field => { if (req.body[field] !== undefined) patient[field] = req.body[field]; });

    auditLogs.unshift({
        id: nextLogId++,
        timestamp: new Date().toISOString(),
        username: req.user.username, displayName: req.user.displayName, user: req.user.username,
        action: 'Patient Record Updated by admin',
        patientId, patientName: patient.name,
        reason: 'Admin record update',
        decision: 'Granted', confidenceScore: 100, riskReason: 'Admin operation',
        risk: 0, status: 'Allowed',
    });

    return res.json({ success: true, data: patient });
});

app.delete('/api/patients/:patientId', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const { patientId } = req.params;
    const patient = patients.find(p => p.patientId === patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    patient.isActive = false;

    auditLogs.unshift({
        id: nextLogId++,
        timestamp: new Date().toISOString(),
        username: req.user.username, displayName: req.user.displayName, user: req.user.username,
        action: 'Patient Record Deactivated by admin',
        patientId, patientName: patient.name,
        reason: 'Admin deactivation',
        decision: 'Granted', confidenceScore: 100, riskReason: 'Admin operation',
        risk: 0, status: 'Allowed',
    });

    return res.json({ success: true, data: { patientId, isActive: false } });
});

app.get('/api/admin/patients/:patientId/notes', authMiddleware, roleMiddleware('admin'), (req, res) => {
    const { patientId } = req.params;
    const patientNotes = notes.filter(n => n.patientId === patientId);
    res.json({ success: true, data: patientNotes });
});


// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`MedSecureAI server running on port ${PORT}`);
});
