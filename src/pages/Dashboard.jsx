import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Activity, ShieldAlert, Users, Database } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';

const Dashboard = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'doctor';

    return (
        <div className="space-y-10">
            {/* Header & Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
                <div>
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">
                        Welcome, <span className="text-[var(--accent-primary)]">{user?.name || 'User'}</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg">
                        {isDoctor ? 'Medical Staff Portal' : 'System Administration'}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--accent-success)]/30 flex items-center gap-3 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-success)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-success)]"></span>
                        </span>
                        <span className="text-sm font-semibold text-[var(--accent-success)] tracking-wide">AI MONITORING ACTIVE</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">System Context: Normal Operation</p>
                </div>
            </div>

            {/* Role-Based Content */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Medical Records - Primary Action for Doctors */}
                {isDoctor && (
                    <Link to="/records" className="block group h-full">
                        <Card className="h-full border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_0_30px_-10px_rgba(218,119,242,0.3)] bg-[var(--bg-card)]/40 backdrop-blur-sm">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="p-4 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-2xl w-fit mb-6 ring-1 ring-[var(--accent-primary)]/20 group-hover:scale-110 transition-transform duration-300">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Patient Records</h3>
                                <p className="text-[var(--text-secondary)] mb-6 flex-grow leading-relaxed">
                                    Access sensitive patient data. All queries are verified in real-time by the AI security layer.
                                </p>
                                <div className="text-[var(--accent-primary)] font-semibold flex items-center gap-2 mt-auto group-hover:translate-x-1 transition-transform">
                                    Open Database <span className="text-lg">→</span>
                                </div>
                            </div>
                            {/* Decorative background icon */}
                            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                                <FileText size={200} />
                            </div>
                        </Card>
                    </Link>
                )}

                {/* Audit Logs - For everyone but emphasized for Admins */}
                <Link to="/logs" className="block group h-full">
                    <Card className="h-full border-[var(--border-color)] group-hover:border-[var(--accent-secondary)] transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_0_30px_-10px_rgba(151,117,250,0.3)] bg-[var(--bg-card)]/40 backdrop-blur-sm">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="p-4 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] rounded-2xl w-fit mb-6 ring-1 ring-[var(--accent-secondary)]/20 group-hover:scale-110 transition-transform duration-300">
                                <Activity className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Access Logs</h3>
                            <p className="text-[var(--text-secondary)] mb-6 flex-grow leading-relaxed">
                                Review system-wide security audit trails and inspect AI decision history logs.
                            </p>
                            <div className="text-[var(--accent-secondary)] font-semibold flex items-center gap-2 mt-auto group-hover:translate-x-1 transition-transform">
                                View Activity Log <span className="text-lg">→</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                            <Activity size={200} />
                        </div>
                    </Card>
                </Link>

                {/* Status / Admin Card */}
                {isDoctor ? (
                    <Card className="h-full border-[var(--border-color)] relative overflow-hidden bg-[var(--bg-card)]/40 backdrop-blur-sm">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="p-4 bg-[var(--accent-success)]/10 text-[var(--accent-success)] rounded-2xl w-fit mb-6 ring-1 ring-[var(--accent-success)]/20">
                                <ShieldAlert className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Security Status</h3>
                            <div className="space-y-4 mb-6 flex-grow">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2 h-2 rounded-full bg-[var(--accent-success)]"></span>
                                    <span className="text-[var(--text-muted)]">Threat Level: <span className="text-[var(--text-primary)] font-medium">Low</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2 h-2 rounded-full bg-[var(--accent-success)]"></span>
                                    <span className="text-[var(--text-muted)]">AI Engine: <span className="text-[var(--text-primary)] font-medium">Online</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2 h-2 rounded-full bg-[var(--accent-success)]"></span>
                                    <span className="text-[var(--text-muted)]">Encryption: <span className="text-[var(--text-primary)] font-medium">Verified</span></span>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--accent-success)] font-medium mt-auto border-t border-[var(--border-color)] pt-4">
                                System operating normally.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <Card className="h-full border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-sm group hover:border-[var(--accent-warning)] transition-all">
                        <div className="flex flex-col h-full">
                            <div className="p-4 bg-[var(--accent-warning)]/10 text-[var(--accent-warning)] rounded-2xl w-fit mb-6 ring-1 ring-[var(--accent-warning)]/20">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">User Management</h3>
                            <p className="text-[var(--text-secondary)] mb-6 flex-grow">
                                Manage system access and roles. (Simulated functionality)
                            </p>
                            <div className="mt-auto">
                                <Badge variant="warning">Admin Access Only</Badge>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Info Banner */}
            <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)] flex items-start gap-4 max-w-3xl mx-auto mt-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-primary)]"></div>
                <Database className="h-6 w-6 text-[var(--accent-primary)] mt-1 shrink-0" />
                <div>
                    <h4 className="text-lg font-semibold mb-1">Prototype Environment</h4>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        User actions on this dashboard are monitored by a simulated AI security agent.
                        Data shown here is generated for academic demonstration and contains no real personal health information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
