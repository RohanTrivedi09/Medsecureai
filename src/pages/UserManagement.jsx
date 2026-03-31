import React, { useState, useEffect } from 'react';
import { Users, UserX, Key, MoreHorizontal, AlertTriangle, Edit2, UserPlus } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getAdminUsers, deleteAdminUser, createAdminUser, updateAdminUser } from '../api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState({ show: false, type: '', user: null });
    const [formData, setFormData] = useState({ username: '', displayName: '', role: 'doctor', password: '' });

    useEffect(() => {
        getAdminUsers()
            .then(res => { if (res.success) setUsers(res.data); })
            .catch(() => {});
    }, []);

    const openModal = (type, user = null) => {
        setModal({ show: true, type, user });
        if (type === 'edit' && user) {
            setFormData({ username: user.username, displayName: user.displayName || '', role: user.role, password: '' });
        } else if (type === 'add') {
            setFormData({ username: '', displayName: '', role: 'doctor', password: '' });
        }
    };
    const closeModal = () => setModal({ show: false, type: '', user: null });

    const handleConfirm = async () => {
        try {
            if (modal.type === 'suspend') {
                await deleteAdminUser(modal.user.id);
                setUsers(prev => prev.map(u => u.id === modal.user.id ? { ...u, isActive: false } : u));
            } else if (modal.type === 'add') {
                const res = await createAdminUser(formData);
                if (res.success) setUsers([res.data, ...users]);
            } else if (modal.type === 'edit') {
                const res = await updateAdminUser(modal.user.id, formData);
                if (res.success) setUsers(prev => prev.map(u => u.id === modal.user.id ? { ...u, ...formData } : u));
            }
        } catch (e) {
            console.error('Action failed:', e);
        }
        closeModal();
    };

    return (
        <div className="flex min-h-[80vh] gap-8 animate-fade-in">
            <AdminSidebar />

            <div className="flex-grow space-y-6">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
                        <Users className="text-[var(--accent-secondary)]" />
                        Identity Access Management
                    </h2>
                    <Button onClick={() => openModal('add')} size="sm" className="bg-[var(--accent-primary)] text-white hover:opacity-90">
                        <UserPlus size={16} className="mr-2" />
                        <span className="text-xs uppercase font-black tracking-widest hidden sm:inline">Add Identity</span>
                    </Button>
                </div>

                <Card className="overflow-hidden p-0 border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-xl ring-1 ring-white/5 w-full">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse table-fixed">
                            <colgroup>
                                <col style={{ width: '30%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '25%', minWidth: '160px' }} />
                            </colgroup>
                            <thead className="bg-[var(--bg-dark)]/50 border-b border-[var(--border-color)]">
                                <tr>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Identity Name</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Security Role</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Last Auth</th>
                                    <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-0">Status</th>
                                    <th className="px-2 py-3 pr-6 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right overflow-visible whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]/30">
                                {users.map((user) => {
                                    const isActive = user.isActive !== false;
                                    return (
                                        <tr key={user.id} className={`transition-colors even:bg-white/[0.02] ${!isActive ? 'opacity-50 grayscale bg-[var(--bg-dark)]/50' : 'hover:bg-white/5'}`}>
                                            <td className="px-2 py-3 font-extrabold text-white text-base overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={user.displayName || user.username}>{user.displayName || user.username}</td>
                                            <td className="px-2 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-0">
                                                <Badge variant={user.role === 'admin' ? 'warning' : 'primary'}>
                                                    {user.role.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-2 py-3 text-sm text-[var(--text-muted)] font-mono overflow-hidden text-ellipsis whitespace-nowrap max-w-0" title={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}>
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                            </td>
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
                                                        title="Edit User"
                                                        onClick={() => openModal('edit', user)}
                                                    >
                                                        <Edit2 size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="px-3 py-2 flex items-center gap-2 text-[var(--text-muted)] hover:text-white bg-white/5 hover:bg-white/10"
                                                        title="Reset Secret Key"
                                                        onClick={() => openModal('reset', user)}
                                                    >
                                                        <Key size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Reset</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="px-3 py-2 flex items-center gap-2 text-[var(--text-muted)] hover:text-[#EF4444] bg-white/5 hover:bg-[#EF4444]/10 transition-colors"
                                                        title="Suspend User"
                                                        onClick={() => openModal('suspend', user)}
                                                        disabled={!isActive}
                                                    >
                                                        <UserX size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Suspend</span>
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

            {/* Confirmation Modal */}
            {modal.show && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <Card className="max-w-md w-full p-8 border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle size={80} />
                        </div>
                        {modal.type === 'add' || modal.type === 'edit' ? (
                            <>
                                <h3 className="text-xl font-black italic tracking-tighter mb-6 uppercase">
                                    {modal.type === 'add' ? 'Provision New Identity' : 'Update Identity Details'}
                                </h3>
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Username</label>
                                        <input type="text" className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none" 
                                            value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} disabled={modal.type === 'edit'} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Display Name</label>
                                        <input type="text" className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none" 
                                            value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Role</label>
                                        <select className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none"
                                            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                            <option value="doctor">Doctor</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                    {modal.type === 'add' && (
                                    <div>
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">Password</label>
                                        <input type="password" className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-xl p-3 text-white text-sm focus:border-[var(--accent-primary)] focus:outline-none" 
                                            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                    </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="secondary" className="flex-grow rounded-xl" onClick={closeModal}>Cancel</Button>
                                    <Button variant="primary" className="flex-grow rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={handleConfirm} disabled={!formData.username || (modal.type === 'add' && !formData.password)}>
                                        {modal.type === 'add' ? 'Provision' : 'Update'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-black italic tracking-tighter mb-4 uppercase">Security Confirmation</h3>
                                <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                                    {modal.type === 'suspend'
                                        ? `Are you sure you want to suspend access for ${modal.user?.displayName || modal.user?.username}? This will immediately terminate all active sessions.`
                                        : `Generate a new cryptographic secret key for ${modal.user?.displayName || modal.user?.username}? The previous key will be voided.`}
                                </p>
                                <div className="flex gap-4">
                                    <Button variant="secondary" className="flex-grow rounded-xl" onClick={closeModal}>Cancel</Button>
                                    <Button
                                        variant={modal.type === 'suspend' ? 'danger' : 'primary'}
                                        className="flex-grow rounded-xl font-black uppercase tracking-widest text-[10px]"
                                        onClick={handleConfirm}
                                    >
                                        Confirm Action
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

export default UserManagement;
