import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Shield, Clock, AlertTriangle, CheckCircle, XCircle,
    Filter, Search, Download, ChevronDown, ChevronUp,
    Terminal, Lock, Fingerprint, Eye, FileText
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuditLogs, exportAuditLogs, getAdminClinicalNotes } from '../api';

const Logs = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDecision, setFilterDecision] = useState('All');
    const [expandedRow, setExpandedRow] = useState(null);
    const [notesModal, setNotesModal] = useState({ show: false, notes: [], patientId: '', loading: false });

    const handleViewNotes = async (patientId) => {
        setNotesModal({ show: true, notes: [], patientId, loading: true });
        try {
            const res = await getAdminClinicalNotes(patientId);
            if (res.success) {
                setNotesModal({ show: true, notes: res.data, patientId, loading: false });
            } else {
                setNotesModal({ show: true, notes: [], patientId, loading: false });
            }
        } catch {
            setNotesModal({ show: true, notes: [], patientId, loading: false });
        }
    };

    const fetchLogs = useCallback(() => {
        const filters = {};
        if (filterDecision !== 'All') filters.decision = filterDecision;
        if (searchTerm) filters.username = searchTerm;
        getAuditLogs(filters)
            .then(res => { if (res.success) setLogs(res.data); })
            .catch(() => {});
    }, [filterDecision, searchTerm]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight italic">Security Audit Intelligence</h1>
                    <p className="text-[var(--text-muted)] text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[var(--accent-primary)]" />
                        Complete immutable record of Zero-Trust access and AI decisions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="rounded-xl border-[var(--border-color)] text-xs font-black uppercase tracking-widest px-6" onClick={exportAuditLogs}>
                        <Download className="h-4 w-4 mr-2" /> Export Audit
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by identity, patient ID, or action..."
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-[var(--accent-primary)] transition-all font-bold placeholder:text-[var(--text-muted)] shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <select
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--accent-primary)] transition-all font-black text-xs uppercase tracking-widest shadow-lg appearance-none cursor-pointer"
                        value={filterDecision}
                        onChange={(e) => setFilterDecision(e.target.value)}
                    >
                        <option value="All">All Decisions</option>
                        <option value="Granted">Granted</option>
                        <option value="Flagged">Flagged</option>
                        <option value="Restricted">Restricted</option>
                    </select>
                </div>
            </div>

            <Card className="overflow-hidden p-0 border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl w-full">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse table-fixed">
                        <colgroup>
                            <col style={{ width: '5%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '35%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '15%' }} />
                        </colgroup>
                        <thead className="bg-[var(--bg-dark)]/50 border-b border-[var(--border-color)]">
                            <tr>
                                <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-0"></th>
                                <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Identity Stream</th>
                                <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Operation performed</th>
                                <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">AI Resolution</th>
                                <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Risk Level</th>
                                <th className="px-2 py-3 pr-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-right overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/30">
                            {logs.map((log) => (
                                <React.Fragment key={log.id}>
                                    <tr
                                        className={`transition-colors cursor-pointer group ${expandedRow === log.id ? 'bg-[var(--accent-primary)]/5' : 'hover:bg-white/5'}`}
                                        onClick={() => toggleRow(log.id)}
                                    >
                                        <td className="px-2 py-3 text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                            {expandedRow === log.id ? <ChevronUp className="h-4 w-4 text-[var(--accent-primary)] mx-auto" /> : <ChevronDown className="h-4 w-4 text-[var(--text-muted)] group-hover:text-white mx-auto" />}
                                        </td>
                                        <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-[var(--bg-dark)] border border-[var(--border-color)]">
                                                    <Fingerprint className="h-4 w-4 text-[var(--accent-primary)]" />
                                                </div>
                                                <span className="font-black text-white text-sm truncate" title={log.user || log.username}>{log.user || log.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={log.action}>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white truncate">{log.action}</span>
                                                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest truncate">{log.patientId || 'SYSTEM'}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                            <Badge variant={log.decision === 'Granted' || log.decision === 'GRANTED' ? 'success' : log.decision === 'Flagged' || log.decision === 'FLAGGED' ? 'warning' : 'danger'} className="px-3 py-1 font-black text-[10px]">
                                                {(log.decision || log.status || '').toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-grow max-w-[80px] h-1.5 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${log.risk > 70 ? 'bg-[var(--accent-danger)]' : log.risk > 40 ? 'bg-[var(--accent-warning)]' : 'bg-[var(--accent-success)]'}`}
                                                        style={{ width: `${log.risk || 5}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] font-black text-[var(--text-muted)]">{log.risk || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 pr-6 text-right font-mono text-xs text-[var(--text-secondary)] font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                    <AnimatePresence>
                                        {expandedRow === log.id && (
                                            <tr>
                                                <td colSpan="6" className="p-0">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-[var(--bg-dark)]/40"
                                                    >
                                                        <div className="p-8 grid md:grid-cols-2 gap-8 border-b border-[var(--border-color)]">
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] flex items-center gap-2">
                                                                    <Terminal size={14} /> AI Decision Reasoning
                                                                </h4>
                                                                <p className="text-sm text-white font-medium leading-relaxed bg-[var(--bg-card)]/50 p-4 rounded-2xl border border-[var(--border-color)]">
                                                                    {log.riskReason || log.details || 'System metadata synced without behavioral anomaly detected. Zero-Trust protocol applied.'}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black text-[var(--accent-secondary)] uppercase tracking-[0.3em] flex items-center gap-2">
                                                                    <Shield size={14} /> Protocol Compliance
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div className="p-3 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)] text-center">
                                                                        <span className="block text-[8px] font-black text-[var(--text-muted)] uppercase mb-1">Standard</span>
                                                                        <span className="text-[10px] font-bold text-white">NIST SP 800-207</span>
                                                                    </div>
                                                                    <div className="p-3 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)] text-center">
                                                                        <span className="block text-[8px] font-black text-[var(--text-muted)] uppercase mb-1">Enc Type</span>
                                                                        <span className="text-[10px] font-bold text-white">AES-256-GCM</span>
                                                                    </div>
                                                                    <div className="p-3 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)] text-center">
                                                                        <span className="block text-[8px] font-black text-[var(--text-muted)] uppercase mb-1">Auth Type</span>
                                                                        <span className="text-[10px] font-bold text-white">MFA-Biometric</span>
                                                                    </div>
                                                                    <div className="p-3 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)] text-center">
                                                                        <span className="block text-[8px] font-black text-[var(--text-muted)] uppercase mb-1">Confidence</span>
                                                                        <span className="text-[8px] font-mono text-[var(--accent-primary)] truncate">{log.confidenceScore ? `${log.confidenceScore}%` : 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {user?.role === 'admin' && (log.decision === 'Granted' || log.decision === 'GRANTED') && (
                                                                    <div className="pt-4 mt-2 border-t border-[var(--border-color)]">
                                                                        <Button variant="secondary" size="sm" className="w-full rounded-xl border-[var(--border-color)] font-black uppercase tracking-widest text-[10px]" onClick={() => handleViewNotes(log.patientId)}>
                                                                            View Clinical Notes
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}

                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-6 rounded-full bg-[var(--bg-dark)] border-4 border-dashed border-[var(--border-color)]">
                                                <Eye className="h-10 w-10 text-[var(--text-muted)]" />
                                            </div>
                                            <p className="text-[var(--text-muted)] font-black text-xs uppercase tracking-widest italic">
                                                No intelligence matches found in current temporal stream.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Notes Modal */}
            {notesModal.show && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <Card className="max-w-2xl w-full p-8 border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-color)]">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                <FileText className="text-[var(--accent-primary)]" />
                                Clinical Notes Repository
                            </h3>
                            <Badge variant="primary" className="font-mono text-[10px]">{notesModal.patientId}</Badge>
                        </div>
                        
                        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                            {notesModal.loading ? (
                                <div className="p-8 text-center text-white/50 animate-pulse font-medium text-sm">
                                    Decrypting clinical logs...
                                </div>
                            ) : notesModal.notes.length > 0 ? (
                                notesModal.notes.map((note, idx) => (
                                    <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-dark)]/50 border border-[var(--border-color)]">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-black text-[var(--accent-secondary)] uppercase tracking-widest bg-[var(--accent-secondary)]/10 px-3 py-1 rounded-full">
                                                {note.doctorUsername || note.doctorName}
                                            </span>
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] font-mono">
                                                {new Date(note.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white leading-relaxed font-medium pl-2 border-l-2 border-[var(--border-color)]">
                                            {note.note}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center flex flex-col items-center gap-3">
                                    <div className="p-4 rounded-full bg-white/5 border border-white/10 text-white/20">
                                        <FileText size={32} />
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)] font-medium">No clinical notes strictly affiliated with this identity string.</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 mt-4 border-t border-[var(--border-color)]">
                            <Button variant="primary" className="w-full rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={() => setNotesModal({ ...notesModal, show: false })}>
                                Close Viewer
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Logs;
