import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, List, ShieldAlert, Settings, FileText
} from 'lucide-react';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
        { id: 'patients', label: 'Patient Management', icon: FileText, path: '/admin/patients' },
        { id: 'logs', label: 'Audit Logs', icon: List, path: '/logs' },
        { id: 'security', label: 'Security Alerts', icon: ShieldAlert, path: '/admin/alerts' },
    ];

    return (
        <div className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/30 p-4 ring-1 ring-white/5">
                <div className="mb-4 px-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Admin Console</p>
                    <p className="mt-1 text-sm font-semibold text-white">Oversight, audit, and configuration</p>
                </div>
                <div className="space-y-2">
                {menuItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${location.pathname === item.path ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-white'}`}
                    >
                        <item.icon size={18} /> {item.label}
                    </button>
                ))}
                <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
                    <button 
                        onClick={() => navigate('/admin/settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${location.pathname === '/admin/settings' ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-white'}`}
                    >
                        <Settings size={18} /> Settings
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
