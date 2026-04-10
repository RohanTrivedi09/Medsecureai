import React, { useState, useEffect } from 'react';
import {
    Users, ShieldAlert, ArrowUpRight, ArrowDownRight, Activity, Zap
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import AdminSidebar from '../components/AdminSidebar';
import { getActivityFeed, getAuditStats } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
    const [realTimeLogs, setRealTimeLogs] = useState([]);
    const [stats, setStats] = useState([
        { label: 'Active Users', value: '4', icon: Users, color: 'text-[var(--accent-primary)]', trend: '+0%', up: true },
        { label: 'Records Accessed', value: '0', icon: Activity, color: 'text-[var(--accent-secondary)]', trend: '+0%', up: true },
        { label: 'Security Alerts', value: '0', icon: ShieldAlert, color: 'text-[var(--accent-danger)]', trend: '—', up: false },
        { label: 'AI Accuracy', value: '—', icon: Zap, color: 'text-[var(--accent-success)]', trend: '—', up: true },
    ]);

    // Fetch activity feed on mount
    useEffect(() => {
        getActivityFeed()
            .then(res => { if (res.success) setRealTimeLogs(res.data.slice(0, 8)); })
            .catch(() => {});

        getAuditStats()
            .then(res => {
                if (res.success) {
                    const { granted, flagged, restricted, total } = res.data;
                    setStats([
                        { label: 'Active Users', value: '4', icon: Users, color: 'text-[var(--accent-primary)]', trend: '+0%', up: true },
                        { label: 'Records Accessed', value: String(total), icon: Activity, color: 'text-[var(--accent-secondary)]', trend: total > 0 ? `+${total}` : '—', up: true },
                        { label: 'Security Alerts', value: String(flagged + restricted), icon: ShieldAlert, color: 'text-[var(--accent-danger)]', trend: flagged + restricted > 0 ? 'ACTIVE' : 'CLEAR', up: false },
                        { label: 'AI Decisions', value: total > 0 ? `${Math.round((granted / total) * 100)}%` : '—', icon: Zap, color: 'text-[var(--accent-success)]', trend: 'Granted Rate', up: true },
                    ]);
                }
            })
            .catch(() => {});
    }, []);

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Access Anomalies',
            data: [12, 19, 3, 5, 2, 3, 9],
            borderColor: '#da77f2',
            backgroundColor: 'rgba(218, 119, 242, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#da77f2',
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1f1f3a',
                titleColor: '#fff',
                bodyColor: '#b3b3b3',
                borderColor: '#2e2e4a',
                borderWidth: 1,
            }
        },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#6c757d', font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: '#6c757d', font: { size: 10 } } }
        }
    };

    return (
        <div className="flex min-h-[80vh] gap-8 animate-fade-in">
            <AdminSidebar />

            <div className="flex-grow space-y-8 overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Admin Overview</p>
                        <h1 className="mt-2 text-4xl font-black tracking-tight italic">Operational Security Dashboard</h1>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">Live snapshot of access volume, risk signals, and simulated AI activity.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/35 px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Mode</p>
                            <p className="mt-1 text-sm font-semibold text-white">Academic Prototype</p>
                        </div>
                        <div className="rounded-2xl border border-[var(--accent-success)]/25 bg-[var(--accent-success)]/10 px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-success)]">Status</p>
                            <p className="mt-1 text-sm font-semibold text-white">Monitoring Active</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <Card key={i} className="p-6 border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-xl ring-1 ring-white/5 relative overflow-hidden group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-[var(--bg-dark)] border border-[var(--border-color)] ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.up ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.trend}
                                </div>
                            </div>
                            <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--text-muted)] mb-1">{stat.label}</h4>
                            <p className="text-3xl font-black italic tracking-tighter text-white">{stat.value}</p>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
                                <Activity className="text-[var(--accent-primary)]" />
                                Real-Time Intelligence Feed
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[var(--accent-success)] animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Live Feed</span>
                            </div>
                        </div>

                        <Card className="p-0 border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-xl overflow-hidden ring-1 ring-white/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <colgroup>
                                        <col style={{ width: '15%' }} />
                                        <col style={{ width: '25%' }} />
                                        <col style={{ width: '30%' }} />
                                        <col style={{ width: '15%' }} />
                                        <col style={{ width: '15%' }} />
                                    </colgroup>
                                    <thead className="bg-[var(--bg-dark)]/50 border-b border-[var(--border-color)]">
                                        <tr>
                                            <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Time</th>
                                            <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">User</th>
                                            <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Action</th>
                                            <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">AI Decision</th>
                                            <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Risk</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]/30">
                                        {realTimeLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-2 py-3 text-center text-[var(--text-muted)] font-medium italic text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                    No activity yet. Access attempts will appear here.
                                                </td>
                                            </tr>
                                        ) : realTimeLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-white/5 transition-all">
                                                <td className="px-2 py-3 text-xs font-bold text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">{new Date(log.timestamp).toLocaleString()}</td>
                                                <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-black text-white truncate" title={log.user || log.username}>{log.user || log.username}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] truncate">{log.displayName || 'Authenticated User'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 text-xs font-medium text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={log.action}>{log.action}</td>
                                                <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                    <Badge variant={log.decision === 'Granted' || log.decision === 'GRANTED' ? 'success' : log.decision === 'Flagged' || log.decision === 'FLAGGED' ? 'warning' : 'danger'} className="text-[9px] font-black">
                                                        {(log.decision || '').toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                    <div className="w-full h-1 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${log.risk > 40 ? 'bg-[var(--accent-warning)]' : 'bg-[var(--accent-success)]'}`}
                                                            style={{ width: `${log.risk || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                                <Zap className="text-[var(--accent-warning)] h-4 w-4" /> Access Anomalies
                            </h3>
                            <Card className="p-6 border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-xl ring-1 ring-white/5">
                                <Line data={chartData} options={chartOptions} />
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                                <ShieldAlert className="text-[var(--accent-danger)] h-4 w-4" /> Dept Risk Levels
                            </h3>
                            <Card className="p-6 border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-xl ring-1 ring-white/5 space-y-4">
                                {[
                                    { dept: 'Cardiology', risk: 'HIGH', color: 'text-[var(--accent-danger)]' },
                                    { dept: 'Oncology', risk: 'MEDIUM', color: 'text-[var(--accent-warning)]' },
                                    { dept: 'General', risk: 'LOW', color: 'text-[var(--accent-success)]' },
                                    { dept: 'Radiology', risk: 'NORMAL', color: 'text-[var(--text-muted)]' },
                                ].map((d, i) => (
                                    <div key={i} className="flex justify-between items-center bg-[var(--bg-dark)]/50 p-3 rounded-xl border border-[var(--border-color)]/50">
                                        <span className="text-xs font-bold text-white">{d.dept}</span>
                                        <span className={`text-[10px] font-black ${d.color}`}>{d.risk}</span>
                                    </div>
                                ))}
                            </Card>
                            <Card className="p-6 border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-xl ring-1 ring-white/5">
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--text-muted)]">Review Guidance</p>
                                <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">Use Audit Logs for full event detail, Security Alerts for triage, and Settings for prototype-level behavior switches.</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
