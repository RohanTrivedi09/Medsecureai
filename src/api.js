// src/api.js — All API calls for MedSecureAI
// axios.defaults.withCredentials = true is set in main.jsx
import axios from 'axios';

const api = axios.create({
    baseURL: '',
    withCredentials: true,
});

// ─── Auth ───────────────────────────────────────────────────
export const apiLogin = (username, password) =>
    api.post('/api/auth/login', { username, password }).then(r => r.data);

export const apiLogout = () =>
    api.post('/api/auth/logout').then(r => r.data);

export const apiGetMe = () =>
    api.get('/api/auth/me').then(r => r.data);

// ─── Patients ────────────────────────────────────────────────
export const getPatients = (search = '', sensitivityLevel = 'All') =>
    api.get('/api/patients', { params: { search, sensitivityLevel } }).then(r => r.data);

export const requestPatientAccess = (patientId, reason = 'Treatment') =>
    api.post(`/api/patients/access/${patientId}`, { reason }).then(r => r.data);

export const getPatient = (patientId) =>
    api.get(`/api/patients/${patientId}`).then(r => r.data);

export const addClinicalNote = (patientId, note) =>
    api.post(`/api/patients/${patientId}/notes`, { note }).then(r => r.data);

export const getClinicalNotes = (patientId) =>
    api.get(`/api/patients/${patientId}/notes`).then(r => r.data);

export const flagPatient = (patientId, reason) =>
    api.post(`/api/patients/${patientId}/flag`, { reason }).then(r => r.data);

export const createPatient = (data) =>
    api.post('/api/patients', data).then(r => r.data);

export const updatePatient = (patientId, data) =>
    api.patch(`/api/patients/${patientId}`, data).then(r => r.data);

export const deletePatient = (patientId) =>
    api.delete(`/api/patients/${patientId}`).then(r => r.data);

// ─── Doctor ──────────────────────────────────────────────────
export const getMyPatients = () =>
    api.get('/api/doctor/my-patients').then(r => r.data);

export const getMyActivity = () =>
    api.get('/api/doctor/my-activity').then(r => r.data);

// ─── Audit Logs ──────────────────────────────────────────────
export const getAuditLogs = (filters = {}) =>
    api.get('/api/audit/logs', { params: filters }).then(r => r.data);

export const exportAuditLogs = () => {
    api.get('/api/audit/logs/export', { responseType: 'blob' }).then(r => {
        const blobUrl = URL.createObjectURL(new Blob([r.data], { type: 'text/csv' }));
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'audit_logs.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    });
};

export const getAuditStats = () =>
    api.get('/api/audit/stats').then(r => r.data);

// ─── Notifications ───────────────────────────────────────────
export const getNotifications = () =>
    api.get('/api/notifications').then(r => r.data);

export const markNotificationRead = (id) =>
    api.patch(`/api/notifications/${id}/read`).then(r => r.data);

export const markAllNotificationsRead = () =>
    api.patch('/api/notifications/read-all').then(r => r.data);

// ─── Admin: Users ────────────────────────────────────────────
export const getAdminUsers = () =>
    api.get('/api/admin/users').then(r => r.data);

export const createAdminUser = (data) =>
    api.post('/api/admin/users', data).then(r => r.data);

export const updateAdminUser = (id, data) =>
    api.patch(`/api/admin/users/${id}`, data).then(r => r.data);

export const deleteAdminUser = (id) =>
    api.delete(`/api/admin/users/${id}`).then(r => r.data);

// ─── Admin: Activity Feed ────────────────────────────────────
export const getActivityFeed = () =>
    api.get('/api/admin/activity-feed').then(r => r.data);

export const getAdminClinicalNotes = (patientId) =>
    api.get(`/api/admin/patients/${patientId}/notes`).then(r => r.data);

export default api;
