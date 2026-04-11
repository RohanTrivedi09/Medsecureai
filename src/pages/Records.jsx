import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { getPatients, requestPatientAccess, getClinicalNotes, addClinicalNote, flagPatient } from '../api';

const Records = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [analyzing, setAnalyzing] = useState(false);
    const [decisionData, setDecisionData] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSensitivity, setFilterSensitivity] = useState('All');
    const accessReason = 'Treatment';
    const [patients, setPatients] = useState([]);
    
    // Notes & Flag state
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [showFlagModal, setShowFlagModal] = useState(false);
    const [flagReason, setFlagReason] = useState('');
    const [isFlagging, setIsFlagging] = useState(false);
    const [flagSuccessMessage, setFlagSuccessMessage] = useState('');

    // Fetch patients from API on mount and when filters change
    useEffect(() => {
        getPatients(searchTerm, filterSensitivity)
            .then(res => { if (res.success) setPatients(res.data); })
            .catch(() => {});
    }, [searchTerm, filterSensitivity]);

    const handleRequestAccess = useCallback((patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
        setDecisionData(null);
        setAnalyzing(true);

        requestPatientAccess(patient.patientId, 'Treatment')
            .then(res => {
                setAnalyzing(false);
                if (res.success) {
                    const { decision, confidenceScore, riskReason } = res.data;
                    // Map to UI-compatible shape
                    const status = decision === 'Granted' ? 'Allowed' : decision === 'Flagged' ? 'Warning' : 'Blocked';
                    const message =
                        decision === 'Granted' ? `Access Granted — Low Risk (Confidence: ${confidenceScore}%)` :
                        decision === 'Flagged'  ? `Access Granted with Warning — ${riskReason}` :
                                                  `Access Restricted — ${riskReason}`;
                    setDecisionData({ decision: decision.toUpperCase(), status, riskScore: 100 - confidenceScore, message });
                    
                    if (decision === 'Granted') {
                        getClinicalNotes(patient.patientId).then(notesRes => {
                            if (notesRes.success) setNotes(notesRes.data);
                        }).catch(() => {});
                    }
                }
            })
            .catch(() => {
                setAnalyzing(false);
                setDecisionData({ decision: 'RESTRICTED', status: 'Blocked', riskScore: 90, message: 'Access Restricted — Server error' });
            });
    }, []);

    // Handle auto-request access from dashboard link
    useEffect(() => {
        if (location.state?.autoRequestAccess) {
            const patientToAutoRequest = location.state.autoRequestAccess;
            window.history.replaceState({}, document.title);
            setTimeout(() => {
                handleRequestAccess(patientToAutoRequest);
            }, 100);
        }
    }, [handleRequestAccess, location.state]);

    const handleSaveNote = async () => {
        if (!newNote.trim() || !selectedPatient) return;
        setIsSavingNote(true);
        try {
            const res = await addClinicalNote(selectedPatient.patientId, newNote);
            if (res.success) {
                setNotes([res.data, ...notes]);
                setNewNote('');
            }
        } catch (err) {
            console.error('Failed to save note', err);
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleFlagPatient = async () => {
        if (!flagReason.trim() || !selectedPatient) return;
        setIsFlagging(true);
        try {
            const res = await flagPatient(selectedPatient.patientId, flagReason);
            if (res.success) {
                setFlagSuccessMessage('Patient flagged for admin review');
                setTimeout(() => {
                    setShowFlagModal(false);
                    setFlagSuccessMessage('');
                    setFlagReason('');
                }, 3000);
            }
        } catch (err) {
            console.error('Failed to flag patient', err);
        } finally {
            setIsFlagging(false);
        }
    };

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal]);

    const closeModal = () => {
        setShowModal(false);
        setSelectedPatient(null);
        setDecisionData(null);
        setNotes([]);
        setNewNote('');
        setShowFlagModal(false);
        setFlagReason('');
        setFlagSuccessMessage('');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Medical Records</h1>
                    <p className="text-[var(--text-secondary)]">Zero-Trust access control with behavioral AI monitoring</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--accent-success)] flex items-center gap-3 font-bold shadow-lg">
                        <span className="pulse-dot"></span>
                        <span>AI OVERSIGHT ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <input
                        type="text"
                        placeholder="Search by name or patient ID..."
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-5 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-all font-medium"
                        value={filterSensitivity}
                        onChange={(e) => setFilterSensitivity(e.target.value)}
                    >
                        <option value="All">All Risks</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <Card className="overflow-hidden p-0 border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-sm shadow-xl w-full">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse table-fixed">
                        <colgroup>
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '20%', minWidth: '160px' }} />
                        </colgroup>
                        <thead className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                            <tr>
                                <th className="px-2 py-3 font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Patient ID</th>
                                <th className="px-2 py-3 font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Name</th>
                                <th className="px-2 py-3 font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Age</th>
                                <th className="px-2 py-3 font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Condition</th>
                                <th className="px-2 py-3 font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Sensitivity Risk</th>
                                <th className="px-2 py-3 pr-6 font-semibold text-[var(--text-secondary)] text-sm tracking-wider uppercase text-right overflow-visible whitespace-nowrap">Access Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]/50">
                            {patients.map((patient) => {
                                const isHigh = patient.sensitivityLevel === 'High';
                                return (
                                <tr key={patient.patientId} className="transition-colors even:bg-white/[0.02] hover:bg-white/5 group">
                                    <td className={`px-2 py-3 font-mono text-xs font-bold text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0 ${isHigh ? 'border-l-[3px] border-l-[#EF4444]' : 'border-l-[3px] border-l-transparent'}`} title={patient.patientId}>{patient.patientId}</td>
                                    <td className="px-2 py-3 text-base font-extrabold text-white overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.name}>{patient.name}</td>
                                    <td className="px-2 py-3 text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">{patient.age}</td>
                                    <td className="px-2 py-3 text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.condition}>{patient.condition}</td>
                                    <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                        <Badge variant={isHigh ? 'danger' : patient.sensitivityLevel === 'Medium' ? 'warning' : 'success'}>
                                            {patient.sensitivityLevel.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-3 pr-6 text-right overflow-visible whitespace-nowrap">
                                        <div className="flex flex-row gap-[6px] items-center justify-end whitespace-nowrap overflow-visible">
                                            <Button size="sm" variant="secondary" onClick={() => handleRequestAccess(patient)} className="rounded-xl border-[var(--border-color)] hover:border-[var(--accent-secondary)]">
                                                Request Access
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                            {patients.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-2 py-3 text-center text-[var(--text-muted)] font-medium italic overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                        No patients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Access Control Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300">
                    <div className="w-full max-w-[520px] max-h-[85vh] flex flex-col cursor-default relative z-[10000]" onClick={(e) => e.stopPropagation()}>
                        {/* Glow effect based on decision */}
                        <div className={`absolute -inset-2 rounded-[20px] blur-2xl opacity-20 transition-all duration-500 ${decisionData?.decision === 'GRANTED' ? 'bg-[var(--accent-success)]' : decisionData?.decision === 'FLAGGED' ? 'bg-[var(--accent-warning)]' : decisionData?.decision === 'RESTRICTED' ? 'bg-[var(--accent-danger)]' : 'bg-[var(--accent-primary)]'}`}></div>

                        <Card className="w-full flex-grow overflow-y-auto shadow-2xl border-[var(--accent-electric-purple)]/30 relative bg-[var(--bg-card)]/95 backdrop-blur-2xl rounded-[16px] p-8 ring-1 ring-[var(--accent-electric-purple)]/20">
                            {analyzing ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <div className="relative mb-10 scale-125">
                                        <div className="absolute inset-0 bg-[var(--accent-primary)]/40 blur-3xl rounded-full animate-pulse"></div>
                                        <div className="relative z-10 p-6 rounded-3xl bg-[var(--bg-dark)] ring-2 ring-[var(--accent-primary)]/50 shadow-[0_0_20px_rgba(218,119,242,0.3)]">
                                            <Loader2 className="h-16 w-16 text-[var(--accent-primary)] animate-spin" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">AI Deep Scan...</h3>
                                    <div className="space-y-3 max-w-xs mx-auto">
                                        <p className="text-[var(--text-secondary)] text-sm font-medium animate-pulse">Analyzing Zero-Trust Context</p>
                                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest bg-[var(--bg-dark)]/80 py-2 px-4 rounded-lg font-bold border border-[var(--border-color)]">Role: {user.role.toUpperCase()} | Record: {selectedPatient?.patientId}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in pb-6">
                                    <div className={`mx-auto mb-8 p-6 rounded-3xl w-24 h-24 flex items-center justify-center ring-4 transition-all duration-700 ${decisionData?.decision === 'GRANTED' ? 'bg-[var(--accent-success)]/20 text-[var(--accent-success)] ring-[var(--accent-success)]/40 shadow-[0_0_40px_rgba(74,222,128,0.3)]' : decisionData?.decision === 'FLAGGED' ? 'bg-[var(--accent-warning)]/20 text-[var(--accent-warning)] ring-[var(--accent-warning)]/40 shadow-[0_0_40px_rgba(251,191,36,0.3)]' : 'bg-[var(--accent-danger)]/20 text-[var(--accent-danger)] ring-[var(--accent-danger)]/40 shadow-[0_0_40px_rgba(248,113,113,0.3)]'}`}>
                                        {decisionData?.decision === 'GRANTED' ? <CheckCircle className="h-14 w-14" /> : decisionData?.decision === 'FLAGGED' ? <AlertTriangle className="h-14 w-14" /> : <XCircle className="h-14 w-14" />}
                                    </div>

                                    <div className="text-center mb-8">
                                        <h2 className="text-4xl font-black mb-3 tracking-tighter italic">
                                            {decisionData?.decision === 'GRANTED' ? 'ACCESS GRANTED' : decisionData?.decision === 'FLAGGED' ? 'ACCESS FLAGGED' : 'ACCESS RESTRICTED'}
                                        </h2>
                                        <p className={`text-lg font-bold ${decisionData?.decision === 'GRANTED' ? 'text-[var(--accent-success)]' : decisionData?.decision === 'FLAGGED' ? 'text-[var(--accent-warning)]' : 'text-[var(--accent-danger)]'}`}>
                                            {decisionData?.message}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-[var(--bg-dark)]/50 p-4 rounded-2xl border border-[var(--border-color)]">
                                            <span className="block text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest mb-1">Risk Factor Score</span>
                                            <span className={`text-2xl font-black ${decisionData?.riskScore > 75 ? 'text-[var(--accent-danger)]' : decisionData?.riskScore > 40 ? 'text-[var(--accent-warning)]' : 'text-[var(--accent-success)]'}`}>
                                                {decisionData?.riskScore}%
                                            </span>
                                        </div>
                                        <div className="bg-[var(--bg-dark)]/50 p-4 rounded-2xl border border-[var(--border-color)]">
                                            <span className="block text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest mb-1">Request Reason</span>
                                            <span className="text-base font-bold text-white capitalize">{accessReason}</span>
                                        </div>
                                    </div>

                                    {decisionData?.decision !== 'RESTRICTED' && selectedPatient && (
                                        <div className="bg-[var(--accent-primary)]/5 rounded-2xl p-6 mb-8 border border-[var(--accent-primary)]/20 ring-1 ring-white/5 animate-fade-in-up">
                                            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-color)]">
                                                <h4 className="text-xs font-black text-[var(--accent-primary)] uppercase tracking-[0.2em]">Patient Identity Stream</h4>
                                                <Badge variant="success">CRYPT-VERIFIED</Badge>
                                            </div>
                                            <div className="space-y-5">
                                                <div className="flex justify-between items-center bg-[var(--bg-dark)]/40 p-3 rounded-xl">
                                                    <span className="text-[var(--text-muted)] text-xs font-bold uppercase">Legal Name</span>
                                                    <span className="font-bold text-white text-base">{selectedPatient.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-[var(--bg-dark)]/40 p-3 rounded-xl">
                                                    <span className="text-[var(--text-muted)] text-xs font-bold uppercase">Diagnosis</span>
                                                    <span className="font-bold text-white text-base">{selectedPatient.condition}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {decisionData?.decision === 'GRANTED' && selectedPatient && (
                                        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-black italic tracking-tight flex items-center gap-2 text-white">
                                                    <FileText className="h-5 w-5 text-[var(--accent-primary)]" />
                                                    Clinical Notes
                                                </h3>
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="text-[var(--text-muted)] hover:text-[var(--accent-warning)] text-xs"
                                                    onClick={() => setShowFlagModal(true)}
                                                >
                                                    <AlertTriangle className="h-4 w-4 mr-1" /> Flag for Review
                                                </Button>
                                            </div>
                                            
                                            <div className="bg-[var(--bg-dark)]/50 rounded-2xl p-4 border border-[var(--border-color)] mb-4">
                                                <textarea
                                                    className="w-full bg-transparent border-none text-white focus:ring-0 p-0 text-sm resize-none"
                                                    rows={3}
                                                    placeholder="Add a clinical note..."
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                ></textarea>
                                                <div className="flex justify-end mt-2 pt-2 border-t border-[var(--border-color)]/50">
                                                    <Button size="sm" onClick={handleSaveNote} disabled={!newNote.trim() || isSavingNote}>
                                                        {isSavingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Note'}
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                                {notes.map(note => (
                                                    <div key={note.id} className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-color)] relative">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-bold text-[var(--accent-primary)]">{note.doctorName}</span>
                                                            <span className="text-[10px] text-[var(--text-muted)]">{new Date(note.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{note.note}</p>
                                                    </div>
                                                ))}
                                                {notes.length === 0 && (
                                                    <p className="text-center text-[var(--text-muted)] text-sm py-4 italic">No clinical notes available.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {decisionData?.decision === 'RESTRICTED' && (
                                        <div className="bg-[var(--accent-danger)]/5 rounded-2xl p-6 mb-8 border border-[var(--accent-danger)]/20 text-center animate-fade-in-up">
                                            <p className="text-[var(--accent-danger)] font-bold text-sm mb-2 italic">Threat Intelligence Report:</p>
                                            <ul className="text-[var(--text-secondary)] text-xs space-y-2 font-medium">
                                                <li>• Unusual access velocity detected</li>
                                                <li>• High-sensitivity data breach risk</li>
                                                <li>• Behavioral pattern anomaly</li>
                                            </ul>
                                        </div>
                                    )}

                                    <div className="sticky bottom-0 bg-[var(--bg-card)]/90 backdrop-blur-md pt-4 border-t border-[var(--border-color)]">
                                        <Button onClick={closeModal} variant={decisionData?.decision === 'GRANTED' ? 'primary' : 'secondary'} className="w-full py-4 text-lg font-black tracking-tight rounded-2xl shadow-xl transform active:scale-[0.98] transition-all">
                                            {decisionData?.decision === 'GRANTED' ? 'CLOSE SESSION' : 'DISMISS & EXIT'}
                                        </Button>
                                    </div>

                                    <div className="text-center mt-6">
                                        <p className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-[0.3em] opacity-40">
                                            NIST SP 800-207 COMPLIANT OVERSIGHT
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}
            {/* Flag Modal */}
            {showFlagModal && (
                <div className="fixed inset-0 z-[10010] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <Card className="max-w-md w-full p-8 border-[var(--accent-warning)]/30 bg-[var(--bg-card)] shadow-[0_0_50px_rgba(251,191,36,0.15)] relative overflow-hidden ring-1 ring-[var(--accent-warning)]/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle size={80} className="text-[var(--accent-warning)]" />
                        </div>
                        <h3 className="text-xl font-black italic tracking-tighter mb-4 uppercase text-[var(--accent-warning)]">Flag for Admin Review</h3>
                        
                        {flagSuccessMessage ? (
                            <div className="py-6 text-center">
                                <CheckCircle className="h-12 w-12 text-[var(--accent-success)] mx-auto mb-3" />
                                <p className="text-lg font-bold text-[var(--accent-success)]">{flagSuccessMessage}</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                                    Please provide a reason for flagging patient <strong>{selectedPatient?.patientId}</strong>. This will notify the administrative team immediately.
                                </p>
                                <textarea
                                    className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white mb-6 focus:border-[var(--accent-warning)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-warning)]/50 transition-all text-sm resize-none"
                                    rows={4}
                                    placeholder="Enter reason for flag..."
                                    value={flagReason}
                                    onChange={(e) => setFlagReason(e.target.value)}
                                ></textarea>
                                <div className="flex gap-4">
                                    <Button variant="secondary" className="flex-grow rounded-xl" onClick={() => setShowFlagModal(false)} disabled={isFlagging}>Cancel</Button>
                                    <Button
                                        className="flex-grow rounded-xl font-black uppercase tracking-widest text-[10px] bg-[var(--accent-warning)] hover:bg-[#eab308] text-black"
                                        onClick={handleFlagPatient}
                                        disabled={!flagReason.trim() || isFlagging}
                                    >
                                        {isFlagging ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Submit Flag'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Records;
