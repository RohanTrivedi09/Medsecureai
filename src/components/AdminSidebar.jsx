import React, { useState } from 'react';
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
            <div className="space-y-2 sticky top-24">
                {menuItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${location.pathname === item.path ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-white'}`}
                    >
                        <item.icon size={18} /> {item.label}
                    </button>
                ))}
                <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
                    <button 
                        onClick={() => navigate('/admin/settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${location.pathname === '/admin/settings' ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-white'}`}
                    >
                        <Settings size={18} /> Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
