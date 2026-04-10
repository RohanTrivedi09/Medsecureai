import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Shield, Bell, Clock, Mail, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Button from '../components/Button';

const Toggle = ({ value, onChange, label, sublabel, icon }) => {
    const IconComponent = icon;

    return (
        <div className="flex items-center justify-between p-4 bg-[var(--bg-dark)]/50 rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent-primary)]/30 transition-all">
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${value ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] shadow-[0_0_15px_rgba(218,119,242,0.2)]' : 'bg-white/5 text-[var(--text-muted)]'}`}>
                    <IconComponent size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight italic">{label}</h4>
                    <p className="text-[10px] font-medium text-[var(--text-muted)]">{sublabel}</p>
                </div>
            </div>
            <button 
                type="button"
                onClick={() => onChange(!value)}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${value ? 'bg-[var(--accent-primary)]' : 'bg-white/10'}`}
            >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
};

const Settings = () => {
    const [settings, setSettings] = useState({
        aiMonitoring: true,
        autoFlag: true,
        emailAlerts: false,
        timeout: '30min'
    });
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="flex min-h-[80vh] gap-8 animate-fade-in">
            <AdminSidebar />

            <div className="flex-grow max-w-4xl space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--text-muted)]">Configuration</p>
                        <h1 className="mt-2 text-4xl font-black tracking-tight italic flex items-center gap-3">
                        <SettingsIcon className="text-[var(--accent-primary)]" />
                        System Global Configurations
                        </h1>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">Prototype controls for monitoring, alerting, and session behavior used during demos.</p>
                    </div>
                    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/35 px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Persistence</p>
                        <p className="mt-1 text-sm font-semibold text-white">Demo-only local state</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'AI Monitoring', value: settings.aiMonitoring ? 'On' : 'Off' },
                        { label: 'Auto Flagging', value: settings.autoFlag ? 'On' : 'Off' },
                        { label: 'Email Alerts', value: settings.emailAlerts ? 'On' : 'Off' },
                        { label: 'Timeout', value: settings.timeout },
                    ].map(item => (
                        <Card key={item.label} className="p-5 border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-xl ring-1 ring-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--text-muted)]">{item.label}</p>
                            <p className="mt-2 text-3xl font-black italic tracking-tight text-white">{item.value}</p>
                        </Card>
                    ))}
                </div>

                <Card className="p-8 border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-xl space-y-8 ring-1 ring-white/5">
                    <div className="grid xl:grid-cols-2 gap-8">
                        <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-6">Security & AI Engine</h3>
                        <Toggle 
                            value={settings.aiMonitoring} 
                            onChange={(v) => setSettings({...settings, aiMonitoring: v})}
                            label="AI Behavior Monitoring"
                            sublabel="Analyze all access attempts using Zero-Trust heuristics"
                            icon={Shield}
                        />
                        <Toggle 
                            value={settings.autoFlag} 
                            onChange={(v) => setSettings({...settings, autoFlag: v})}
                            label="Auto-Flag Anomalies"
                            sublabel="Automatically flag suspicious velocities and pattern shifts"
                            icon={Bell}
                        />
                        </div>

                        <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-6">Notifications & Sessions</h3>
                        <Toggle 
                            value={settings.emailAlerts} 
                            onChange={(v) => setSettings({...settings, emailAlerts: v})}
                            label="High-Risk Email Alerts"
                            sublabel="Immediate dispatch to security leads for RESTRICTED events"
                            icon={Mail}
                        />

                        <div className="p-4 bg-[var(--bg-dark)]/50 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-white/5 text-[var(--text-muted)]">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight italic">Global Session Timeout</h4>
                                    <p className="text-[10px] font-medium text-[var(--text-muted)]">Idle time before mandatory re-authentication</p>
                                </div>
                            </div>
                            <select 
                                value={settings.timeout}
                                onChange={(e) => setSettings({...settings, timeout: e.target.value})}
                                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                            >
                                <option value="15min">15 Minutes</option>
                                <option value="30min">30 Minutes</option>
                                <option value="1hr">1 Hour</option>
                            </select>
                        </div>
                    </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--border-color)]">
                        <Button onClick={handleSave} className="w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] text-xs shadow-xl">
                            <Save size={16} className="mr-3" /> Commit Changes to Schema
                        </Button>
                    </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-medium leading-relaxed tracking-wider">
                        [Prototype note] These controls are presentation settings for the academic build and do not persist after a restart.
                    </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/30 border border-[var(--border-color)]">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase font-medium leading-relaxed tracking-wider">
                            [Production note] In a real deployment, all changes should be audit-logged and backed by secure server-side configuration.
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[2000] animate-fade-in-up">
                    <div className="bg-[var(--accent-success)] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ring-2 ring-white/20">
                        <CheckCircle2 size={24} />
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest italic">Success</p>
                            <p className="text-xs font-bold opacity-90">Protocol Settings Saved Successfully</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
