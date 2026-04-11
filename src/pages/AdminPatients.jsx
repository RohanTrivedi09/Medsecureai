import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Edit2, UserX, AlertTriangle } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getPatients, getAdminUsers, createPatient, updatePatient, deletePatient } from '../api';

const AdminPatients = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ show: false, type: '', patient: null });
    
    const initialFormState = {
        name: '',
        age: 30,
        condition: 'Hypertension',
        sensitivityLevel: 'Low',
        department: 'Cardiology',
        assignedDoctor: '',
        bloodGroup: 'O+',
        ward: 'General'
    };
    
    const [formData, setFormData] = useState(initialFormState);

    const conditionsList = ['Hypertension', 'Diabetes Type 2', 'Cardiac Arrhythmia', 'Brain Tumour', 'Lung Cancer', 'Fracture', 'Appendicitis', 'Kidney Stones', 'Migraine', 'Pneumonia', 'Coronary Artery Disease', 'Epilepsy', 'Osteoporosis', 'Anaemia', 'Stroke'];

    const fetchData = () => {
        getPatients()
            .then(res => { if (res.success) setPatients(res.data); })
            .catch(() => {});
        getAdminUsers()
            .then(res => { 
                if (res.success) {
                    const onlyDoctors = res.data.filter(u => u.role === 'doctor');
                    setDoctors(onlyDoctors);
                    if (onlyDoctors.length > 0) {
                        setFormData(prev => ({ ...prev, assignedDoctor: onlyDoctors[0].username }));
                    }
                } 
            })
            .catch(() => {});
    };

    useEffect(() => {
        // Fetch all patients (no sensitivity filter here since admin is viewing all)
        fetchData();
    }, []);

    const openModal = (type, patient = null) => {
        setModal({ show: true, type, patient });
        if (type === 'edit' && patient) {
            setFormData({
                name: patient.name,
                age: patient.age,
                condition: patient.condition,
                sensitivityLevel: patient.sensitivityLevel,
                department: patient.department,
                assignedDoctor: patient.assignedDoctor,
                bloodGroup: patient.bloodGroup || 'O+',
                ward: patient.ward || 'General'
            });
        } else if (type === 'add') {
            setFormData({ ...initialFormState, assignedDoctor: doctors[0]?.username || '' });
        }
    };

    const closeModal = () => setModal({ show: false, type: '', patient: null });

    const handleConfirm = async () => {
        try {
            if (modal.type === 'deactivate') {
                await deletePatient(modal.patient.patientId);
                setPatients(prev => prev.map(p => p.patientId === modal.patient.patientId ? { ...p, isActive: false } : p));
                // Show toast or alert ideally, here we just refresh locally
            } else if (modal.type === 'add') {
                const res = await createPatient(formData);
                if (res.success) setPatients([res.data, ...patients]);
            } else if (modal.type === 'edit') {
                const res = await updatePatient(modal.patient.patientId, formData);
                if (res.success) setPatients(prev => prev.map(p => p.patientId === modal.patient.patientId ? { ...p, ...formData } : p));
            }
        } catch (e) {
            console.error('Patient action failed:', e);
        }
        closeModal();
    };

    const filteredPatients = patients.filter(p => {
        const search = searchTerm.toLowerCase();
        return p.name?.toLowerCase().includes(search) || 
               p.patientId?.toLowerCase().includes(search) || 
               p.department?.toLowerCase().includes(search);
    });

    return (
        <div className="flex min-h-[80vh] gap-8 animate-fade-in">
            <AdminSidebar />

            <div className="flex-grow space-y-6">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
                        <FileText className="text-[var(--accent-secondary)]" />
                        Patient Management
                    </h2>
                    <Button onClick={() => openModal('add')} size="sm" className="bg-[var(--accent-primary)] text-white hover:opacity-90">
                        <Plus size={16} className="mr-2" />
                        <span className="text-xs uppercase font-black tracking-widest hidden sm:inline">Add Patient</span>
                    </Button>
                </div>

                {/* Filters */}
                <div className="relative mb-6 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or department..."
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-[var(--accent-primary)] transition-all font-bold placeholder:text-[var(--text-muted)] shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Card className="overflow-hidden p-0 border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-xl ring-1 ring-white/5 w-full">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse table-fixed">
                            <colgroup>
                                <col style={{ width: '8%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '6%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '8%' }} />
                                <col style={{ width: '13%', minWidth: '160px' }} />
                            </colgroup>
                            <thead className="bg-[var(--bg-dark)]/50 border-b border-[var(--border-color)]">
                                <tr>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">ID</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Name</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Age</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Condition</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Sensitivity</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Department</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Doctor</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Status</th>
                                    <th className="px-2 py-3 pr-6 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right overflow-visible whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]/30">
                                {filteredPatients.map((patient) => {
                                    const isActive = patient.isActive !== false;
                                    const isHigh = patient.sensitivityLevel === 'High';
                                    return (
                                        <tr key={patient.patientId} className={`transition-colors even:bg-white/[0.02] ${!isActive ? 'opacity-50 grayscale bg-[var(--bg-dark)]/50' : 'hover:bg-white/5'}`}>
                                            <td className={`px-2 py-3 font-mono text-xs font-bold text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0 ${isHigh ? 'border-l-[3px] border-l-[#EF4444]' : 'border-l-[3px] border-l-transparent'}`} title={patient.patientId}>{patient.patientId}</td>
                                            <td className="px-2 py-3 text-base font-extrabold text-white overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.name}>{patient.name}</td>
                                            <td className="px-2 py-3 text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">{patient.age}</td>
                                            <td className="px-2 py-3 text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.condition}>{patient.condition}</td>
                                            <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                <Badge variant={isHigh ? 'danger' : patient.sensitivityLevel === 'Medium' ? 'warning' : 'success'}>
                                                    {patient.sensitivityLevel.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-2 py-3 text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.department}>{patient.department}</td>
                                            <td className="px-2 py-3 text-sm font-mono text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={patient.assignedDoctor}>{patient.assignedDoctor}</td>
                                            <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[var(--accent-success)]' : 'bg-[var(--text-muted)]'}`}></div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-3 pr-6 text-right overflow-visible whitespace-nowrap">
                                                <div className="flex flex-row gap-[6px] items-center justify-start whitespace-nowrap overflow-visible">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="px-3 py-2 flex items-center gap-2 text-[var(--text-muted)] hover:text-white bg-white/5 hover:bg-white/10"
                                                        onClick={() => openModal('edit', patient)}
                                                        disabled={!isActive}
                                                    >
                                                        <Edit2 size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="px-3 py-2 flex items-center gap-2 text-[var(--text-muted)] hover:text-[#EF4444] bg-white/5 hover:bg-[#EF4444]/10 transition-colors"
                                                        onClick={() => openModal('deactivate', patient)}
                                                        disabled={!isActive}
                                                    >
                                                        <UserX size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Deactivate</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modal */}
            {modal.show && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <Card className="max-w-xl w-full p-8 border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            {modal.type === 'deactivate' ? <AlertTriangle size={80} /> : <FileText size={80} />}
                        </div>
                        
                        {modal.type === 'add' || modal.type === 'edit' ? (
                            <>
                                <h3 className="text-xl font-black italic tracking-tighter mb-6 uppercase">
                                    {modal.type === 'add' ? 'Register New Patient' : 'Update Patient Record'}
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Full Name</label>
                                        <input type="text" className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none" 
                                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Age</label>
                                        <input type="number" className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none" 
                                            value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Blood Group</label>
                                        <select className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                                            value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                                            {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Condition</label>
                                        <select className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                                            value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                                            {conditionsList.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Sensitivity Level</label>
                                        <select className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                                            value={formData.sensitivityLevel} onChange={e => setFormData({...formData, sensitivityLevel: e.target.value})}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Department</label>
                                        <select className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                                            value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                                            {['Cardiology', 'Neurology', 'Oncology', 'Orthopaedics'].map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Assigned Doctor</label>
                                        <select className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                                            value={formData.assignedDoctor} onChange={e => setFormData({...formData, assignedDoctor: e.target.value})}>
                                            {doctors.map(d => <option key={d.username} value={d.username}>{d.displayName || d.username}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Ward</label>
                                        <select className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                                            value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}>
                                            {['General', 'ICU', 'Private', 'Semi-Private'].map(w => <option key={w} value={w}>{w}</option>)}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4">
                                    <Button variant="secondary" className="flex-grow rounded-xl" onClick={closeModal}>Cancel</Button>
                                    <Button variant="primary" className="flex-grow rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={handleConfirm} disabled={!formData.name || !formData.assignedDoctor}>
                                        {modal.type === 'add' ? 'Submit Registration' : 'Save Changes'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-black italic tracking-tighter mb-4 uppercase">Security Confirmation</h3>
                                <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                                    Are you sure you want to deactivate this patient record? Access will be revoked for all clinical staff.
                                </p>
                                <div className="flex gap-4">
                                    <Button variant="secondary" className="flex-grow rounded-xl" onClick={closeModal}>Cancel</Button>
                                    <Button
                                        variant="danger"
                                        className="flex-grow rounded-xl font-black uppercase tracking-widest text-[10px]"
                                        onClick={handleConfirm}
                                    >
                                        Deactivate Record
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

export default AdminPatients;
