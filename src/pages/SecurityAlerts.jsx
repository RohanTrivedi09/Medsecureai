import React, { useState, useMemo, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, LucideHistory } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getAuditLogs } from '../api';

const SecurityAlerts = () => {
    const [logs, setLogs] = useState([]);
    const [timeFilter, setTimeFilter] = useState('All Time');
    const [resolvedIds, setResolvedIds] = useState(new Set());

    useEffect(() => {
        // Fetch only flagged & restricted logs from backend
        getAuditLogs({ decision: 'Flagged' })
            .then(res => { if (res.success) setLogs(prev => [...prev, ...res.data]); })
            .catch(() => {});
        getAuditLogs({ decision: 'Restricted' })
            .then(res => { if (res.success) setLogs(prev => [...prev, ...res.data]); })
            .catch(() => {});
    }, []);

    const filteredLogs = useMemo(() => {
        let base = [...logs];
        const now = new Date();
        if (timeFilter === 'Today') {
            base = base.filter(l => new Date(l.timestamp).toDateString() === now.toDateString());
        } else if (timeFilter === 'This Week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            base = base.filter(l => new Date(l.timestamp) >= oneWeekAgo);
        }
        return base;
    }, [logs, timeFilter]);

    const summary = {
        total: filteredLogs.length,
        restricted: filteredLogs.filter(log => log.decision === 'Restricted').length,
        flagged: filteredLogs.filter(log => log.decision === 'Flagged').length,
        resolved: filteredLogs.filter(log => resolvedIds.has(log.id)).length,
    };

    const handleResolve = (id) => {
        setResolvedIds(prev => new Set([...prev, id]));
    };

    return (
        <div className="flex min-h-[80vh] gap-8 animate-fade-in">
            <AdminSidebar />

            <div className="flex-grow space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Alert Triage</p>
                        <h1 className="mt-2 text-4xl font-black tracking-tight italic flex items-center gap-3">
                        <ShieldAlert className="text-[var(--accent-danger)]" />
                        Security Intelligence Alerts
                        </h1>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">Review flagged and restricted access attempts, then mark them resolved for presentation flow.</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['Today', 'This Week', 'All Time'].map(f => (
                            <button
                                key={f}
                                onClick={() => setTimeFilter(f)}
                                className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${timeFilter === f ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-lg' : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Visible Alerts', value: summary.total, tone: 'text-white' },
                        { label: 'Restricted', value: summary.restricted, tone: 'text-[var(--accent-danger)]' },
                        { label: 'Flagged', value: summary.flagged, tone: 'text-[var(--accent-warning)]' },
                        { label: 'Resolved', value: summary.resolved, tone: 'text-[var(--accent-success)]' },
                    ].map(item => (
                        <Card key={item.label} className="p-5 border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-xl ring-1 ring-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--text-muted)]">{item.label}</p>
                            <p className={`mt-2 text-3xl font-black italic tracking-tight ${item.tone}`}>{item.value}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredLogs.length > 0 ? filteredLogs.map((log) => {
                        const isResolved = resolvedIds.has(log.id);
                        return (
                            <Card key={log.id} className={`p-6 border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-xl ring-1 ring-white/5 transition-all ${isResolved ? 'opacity-40' : ''}`}>
                                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                                    <div className="flex items-start gap-4 min-w-0">
                                        <div className={`p-4 rounded-2xl ${isResolved ? 'bg-grey-500/20 text-grey-500' : log.decision === 'Restricted' ? 'bg-[var(--accent-danger)]/20 text-[var(--accent-danger)]' : 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]'}`}>
                                            <ShieldAlert size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <Badge variant={isResolved ? 'secondary' : log.decision === 'Restricted' ? 'danger' : 'warning'}>
                                                    {isResolved ? 'RESOLVED' : log.decision.toUpperCase()}
                                                </Badge>
                                                <span className="text-xs font-black text-white">{log.user || log.username}</span>
                                                <span className="text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-1">
                                                    <LucideHistory size={10} /> {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-white truncate">{log.action}</p>
                                            <p className="mt-1 text-xs text-[var(--text-secondary)]">{log.riskReason || log.details || 'Behavioral anomaly detected by simulated monitoring.'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between xl:justify-end gap-4">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Risk Score</p>
                                            <p className={`text-xl font-black ${isResolved ? 'text-[var(--text-muted)]' : log.risk > 75 ? 'text-[var(--accent-danger)]' : 'text-[var(--accent-warning)]'}`}>{log.risk}%</p>
                                        </div>
                                        {!isResolved && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="rounded-xl border-[var(--border-color)] hover:border-[var(--accent-success)] hover:text-[var(--accent-success)]"
                                                onClick={() => handleResolve(log.id)}
                                            >
                                                <CheckCircle2 size={16} className="mr-2" /> Resolve
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    }) : (
                        <Card className="p-12 text-center border-[var(--border-color)] bg-[var(--bg-card)]/20 ring-1 ring-white/5">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--accent-success)] mb-4 opacity-20" />
                            <h3 className="text-lg font-black uppercase tracking-widest text-white/20 italic">No Active Threats Found</h3>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityAlerts;
