import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Activity, ShieldAlert, Bell, Search, Clock, ArrowRight, LayoutDashboard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getMyActivity, getMyPatients } from '../api';

const DoctorDashboard = () => {
    const { user, lastLogin } = useAuth();
    const navigate = useNavigate();
    const [myActivity, setMyActivity] = useState([]);
    const [myPatients, setMyPatients] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!user) return;
        getMyActivity()
            .then(res => {
                if (res.success) setMyActivity(res.data);
            })
            .catch(() => {});
            
        getMyPatients()
            .then(res => {
                if (res.success) setMyPatients(res.data);
            })
            .catch(() => {});
    }, [user]);

    const handlePatientClick = (patient) => {
        navigate('/records', { state: { autoRequestAccess: patient } });
    };

    return (
        <div className="flex gap-8 animate-fade-in">
            {/* Sidebar */}
            <div className="w-64 shrink-0 hidden lg:block">
                <div className="space-y-2 sticky top-24">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'overview' ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-white'}`}
                    >
                        <LayoutDashboard size={18} /> Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('my-patients')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'my-patients' ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-white'}`}
                    >
                        <Users size={18} /> My Patients
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow space-y-10">
            {/* Header section with badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-color)]">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">
                        Welcome, <span className="text-[var(--accent-primary)]">{user?.displayName || user?.name}</span>
                    </h1>
                    {lastLogin && (
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                           <Clock className="h-3 w-3" /> Last Session: {new Date(lastLogin).toLocaleString()}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="px-4 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--accent-success)]/20 flex items-center gap-3 shadow-[0_0_20px_rgba(74,222,128,0.1)] ring-1 ring-[var(--accent-success)]/10">
                        <span className="pulse-dot"></span>
                        <span className="text-xs font-black text-[var(--accent-success)] tracking-widest uppercase">AI Monitoring Active</span>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-3 shadow-lg">
                        <ShieldAlert className="h-4 w-4 text-[var(--accent-primary)]" />
                        <span className="text-xs font-black text-[var(--text-secondary)] tracking-widest uppercase">Encrypted Connection</span>
                    </div>
                </div>
            </div>

            {activeTab === 'overview' ? (
                <>
                    {/* Quick Actions / Stats */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Link to="/records" className="block group">
                            <Card className="h-full border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-all duration-500 bg-[var(--bg-card)]/40 backdrop-blur-xl relative overflow-hidden p-8 ring-1 ring-white/5">
                                <div className="relative z-10">
                                    <div className="p-4 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-2xl w-fit mb-6 ring-1 ring-[var(--accent-primary)]/20 group-hover:scale-110 transition-all duration-500 shadow-lg">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-3 italic tracking-tighter">Patient Records</h3>
                                    <p className="text-[var(--text-secondary)] mb-8 font-medium leading-relaxed">
                                        Access and manage patient medical history. All decryptions are logged and verified by the Zero-Trust agent.
                                    </p>
                                    <div className="flex items-center gap-2 text-[var(--accent-primary)] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                        Initialize Database Access <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:opacity-[0.1] transition-all rotate-12 group-hover:rotate-0">
                                    <FileText size={250} />
                                </div>
                            </Card>
                        </Link>

                        <Card className="border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-xl p-8 ring-1 ring-white/5">
                            <div className="p-4 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] rounded-2xl w-fit mb-6 ring-1 ring-[var(--accent-secondary)]/20">
                                <ShieldAlert className="h-8 w-8" />
                            </div>
                            <h3 className="text-3xl font-black mb-5 italic tracking-tighter">Security Posture</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-dark)]/50 border border-[var(--border-color)]">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Threat Level</span>
                                    <Badge variant="success" className="font-black">LOW-VERIFIED</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-dark)]/50 border border-[var(--border-color)]">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Session ID</span>
                                    <span className="font-mono text-[10px] text-[var(--accent-primary)] font-bold">AZT-882-110</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-dark)]/50 border border-[var(--border-color)]">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Auth Protocol</span>
                                    <span className="text-xs font-black text-white">NIST 800-207</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-xl p-8 ring-1 ring-white/5 flex flex-col justify-center items-center text-center">
                            <div className="bg-[var(--bg-dark)]/50 p-6 rounded-full border-4 border-dashed border-[var(--border-color)] mb-4">
                                <Search className="h-10 w-10 text-[var(--text-muted)]" />
                            </div>
                            <h4 className="text-xl font-black text-white mb-2">Advanced Search</h4>
                            <p className="text-xs text-[var(--text-muted)] font-medium mb-6">Filter records by genetic markers, risk scores, or history.</p>
                            <Button variant="secondary" className="w-full rounded-2xl border-[var(--border-color)] font-black text-xs uppercase tracking-widest">Open Filter Tools</Button>
                        </Card>
                    </div>

                    {/* My Recent Activity Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tighter italic flex items-center gap-3">
                                <Clock className="h-6 w-6 text-[var(--accent-primary)]" />
                                My Behavioral Logs
                            </h2>
                            <Link to="/logs" className="text-xs font-black text-[var(--accent-primary)] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                                View Full History →
                            </Link>
                        </div>

                        <Card className="overflow-hidden p-0 border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-xl ring-1 ring-white/5 w-full">
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <colgroup>
                                        <col style={{ width: '20%' }} />
                                        <col style={{ width: '20%' }} />
                                        <col style={{ width: '40%' }} />
                                        <col style={{ width: '20%' }} />
                                    </colgroup>
                                    <thead className="bg-[var(--bg-dark)]/50 border-b border-[var(--border-color)]">
                                        <tr>
                                            <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Timestamp</th>
                                            <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Patient ID</th>
                                            <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Action / Reason</th>
                                            <th className="px-2 py-3 pr-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-right overflow-hidden text-ellipsis whitespace-nowrap max-w-0">AI Decision</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]/30">
                                        {myActivity.length > 0 ? myActivity.map((log) => (
                                            <tr key={log.id} className="transition-colors even:bg-white/[0.02] hover:bg-[var(--bg-primary)]/30 group">
                                                <td className="px-2 py-3 text-sm font-medium text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </td>
                                                <td className="px-2 py-3 font-mono text-xs font-bold text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={log.patientId || 'N/A'}>{log.patientId || 'N/A'}</td>
                                                <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={`${log.action} - ${log.reason}`}>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white truncate">{log.action}</span>
                                                        <span className="text-[10px] text-[var(--text-muted)] font-medium italic truncate">{log.reason || 'Standard Query'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 pr-6 text-right overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                    <Badge variant={log.decision === 'Granted' || log.decision === 'GRANTED' ? 'success' : log.decision === 'Flagged' || log.decision === 'FLAGGED' ? 'warning' : 'danger'} className="px-3 py-1 font-black text-[10px]">
                                                        {(log.decision || log.status || '').toUpperCase()}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-2 py-3 text-center text-[var(--text-muted)] font-medium italic overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                    No recent access logs detected. Initialize a session to begin.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tighter italic flex items-center gap-3">
                            <Users className="h-6 w-6 text-[var(--accent-primary)]" />
                            My Assigned Patients
                        </h2>
                    </div>
                    <Card className="overflow-hidden p-0 border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-xl ring-1 ring-white/5 w-full">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse table-fixed">
                                <colgroup>
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '20%', minWidth: '100px' }} />
                                </colgroup>
                                <thead className="bg-[var(--bg-dark)]/50 border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Patient ID</th>
                                        <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Name</th>
                                        <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Condition</th>
                                        <th className="px-2 py-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Ward</th>
                                        <th className="px-2 py-3 pr-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-right overflow-visible whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]/30">
                                    {myPatients.length > 0 ? myPatients.map((patient) => (
                                        <tr key={patient.patientId} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handlePatientClick(patient)}>
                                            <td className="px-2 py-3 font-mono text-sm font-bold text-[var(--accent-primary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.patientId}>{patient.patientId}</td>
                                            <td className="px-2 py-3 text-sm font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.name}>{patient.name}</td>
                                            <td className="px-2 py-3 text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.condition}>{patient.condition}</td>
                                            <td className="px-2 py-3 text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">{patient.ward}</td>
                                            <td className="px-2 py-3 text-right overflow-visible whitespace-nowrap">
                                                <div className="flex flex-row gap-[6px] items-center justify-end whitespace-nowrap overflow-visible">
                                                    <Button size="sm" variant="ghost" className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] p-0">
                                                        <ArrowRight size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-2 py-3 text-center text-[var(--text-muted)] font-medium italic overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                No patients currently assigned to you.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
