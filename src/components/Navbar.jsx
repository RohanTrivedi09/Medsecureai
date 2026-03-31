import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Bell, Zap, ShieldCheck, Stethoscope } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Fetch notifications whenever user is set or location changes
    useEffect(() => {
        if (!user) return;
        getNotifications()
            .then(res => { if (res.success) setNotifications(res.data); })
            .catch(() => {});
    }, [user, location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch {}
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch {}
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <nav className="bg-[var(--bg-dark)]/80 backdrop-blur-xl border-b border-[var(--border-color)] sticky top-0 z-[100] ring-1 ring-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 py-3">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_15px_rgba(218,119,242,0.4)] transition-transform group-hover:scale-105">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter text-white">
                                MedSecure<span className="text-[var(--accent-primary)]">AI</span>
                            </span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center gap-1">
                                <Link to="/dashboard" className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/dashboard' ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[var(--text-muted)] hover:text-white'}`}>Dashboard</Link>
                                {user.role === 'doctor' && <Link to="/records" className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/records' ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[var(--text-muted)] hover:text-white'}`}>Records</Link>}
                                <Link to="/logs" className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/logs' ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[var(--text-muted)] hover:text-white'}`}>Audit Logs</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                                    <div className={`p-1.5 rounded-lg ${user.role === 'admin' ? 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]' : 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'}`}>
                                        {user.role === 'admin' ? <ShieldCheck size={14} /> : <Stethoscope size={14} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] leading-tight">{user.role}</span>
                                        <span className="text-xs font-bold text-white leading-tight">{user.displayName || user.name}</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/50 transition-all relative"
                                    >
                                        <Bell size={20} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-danger)] text-[8px] font-black text-white ring-2 ring-[var(--bg-dark)]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute top-full right-0 mt-4 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-4 animate-fade-in-up ring-1 ring-white/5 z-[200]">
                                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-color)]">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-white italic">Protocol Alerts</h4>
                                                <button
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-[9px] font-bold text-[var(--accent-primary)] uppercase hover:underline"
                                                >
                                                    Mark all read
                                                </button>
                                            </div>
                                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                                {notifications.length === 0 && (
                                                    <p className="text-xs text-[var(--text-muted)] text-center py-4">No alerts</p>
                                                )}
                                                {notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => handleMarkAsRead(n.id)}
                                                        className={`flex gap-3 p-3 rounded-xl bg-[var(--bg-dark)]/50 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 transition-all cursor-pointer ${n.read ? 'opacity-50' : ''}`}
                                                    >
                                                        <div className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${n.read ? 'bg-grey-400' : n.type === 'danger' ? 'bg-[var(--accent-danger)] shadow-[0_0_8px_rgba(248,113,113,0.5)]' : n.type === 'warning' ? 'bg-[var(--accent-warning)]' : 'bg-[var(--accent-success)]'}`}></div>
                                                        <div className="flex-grow">
                                                            <p className={`text-xs font-bold leading-snug ${n.read ? 'text-[var(--text-muted)]' : 'text-white'}`}>{n.text}</p>
                                                            <span className="text-[9px] font-bold text-[var(--text-muted)]">{n.time}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button onClick={handleLogout} className="p-2.5 rounded-xl bg-[var(--bg-dark)] border border-[var(--accent-danger)]/20 text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/10 transition-all shadow-lg" title="Terminate Session">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" className="px-8 font-black uppercase tracking-widest text-xs italic">Initiate Session</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
