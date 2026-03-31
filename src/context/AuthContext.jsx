import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiLogout, apiGetMe } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [lastLogin, setLastLogin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    // Restore session from cookie on mount
    useEffect(() => {
        apiGetMe()
            .then(res => {
                if (res.success) {
                    setUser(res.data);
                    setLastLogin(res.data.lastLogin);
                }
            })
            .catch(() => {
                // No valid session — stay logged out
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        if (isLocked) return { success: false, message: 'Account locked' };
        try {
            const res = await apiLogin(username, password);
            if (res.success) {
                setUser(res.data);
                setLastLogin(res.data.lastLogin);
                setFailedAttempts(0);
                return { success: true };
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials';
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            if (newAttempts >= 3) setIsLocked(true);
            return { success: false, message: msg };
        }
        return { success: false, message: 'Login failed' };
    };

    const logout = async () => {
        try { await apiLogout(); } catch {}
        setUser(null);
        setLastLogin(null);
    };

    return (
        <AuthContext.Provider value={{ user, lastLogin, isLocked, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
