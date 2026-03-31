import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    getNotifications as apiGetNotifications,
    markNotificationRead as apiMarkRead,
    markAllNotificationsRead as apiMarkAllRead,
    getAuditLogs as apiGetAuditLogs,
} from '../api';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    // Logs and notifications are fetched on demand by each component via api.js.
    // DataContext only provides stable callback wrappers so components that
    // already use useData() don't need to change their call-site.
    const [notifications, setNotifications] = useState([]);
    const [logs, setLogs] = useState([]);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await apiGetNotifications();
            if (res.success) setNotifications(res.data);
        } catch {}
    }, []);

    const fetchLogs = useCallback(async (filters = {}) => {
        try {
            const res = await apiGetAuditLogs(filters);
            if (res.success) setLogs(res.data);
        } catch {}
    }, []);

    const markAsRead = async (id) => {
        try {
            await apiMarkRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch {}
    };

    const markAllAsRead = async () => {
        try {
            await apiMarkAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch {}
    };

    // Kept for backward compat with any component that adds a log entry locally
    const addLog = (log) => {
        setLogs(prev => [{ id: Date.now(), timestamp: new Date().toISOString(), ...log }, ...prev]);
    };

    // Kept signature-compatible placeholder (no longer used — Records calls API directly)
    const simulateAIDecision = () => ({ decision: 'Granted', status: 'Allowed', riskScore: 10, message: 'N/A' });

    // Kept for AdminDashboard compat
    const getRealisticDoctorName = () => 'dr.smith';

    return (
        <DataContext.Provider value={{
            logs,
            notifications,
            fetchNotifications,
            fetchLogs,
            addLog,
            markAsRead,
            markAllAsRead,
            simulateAIDecision,
            getRealisticDoctorName,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
