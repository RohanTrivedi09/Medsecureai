import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Stethoscope, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('doctor');
    const { login, lastLogin, isLocked } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] py-12 relative overflow-hidden">
            {/* ECG Pulse Animation Background */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--accent-primary)] animate-[ecg-pulse_4s_infinite_linear]"></div>
                <div className="absolute top-1/3 left-0 w-full h-[1px] bg-[var(--accent-secondary)] animate-[ecg-pulse_6s_infinite_linear_reverse]"></div>
            </div>

            <div className="w-full max-w-[400px] relative z-10 animate-fade-in-up">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] mb-4 ring-1 ring-[var(--accent-primary)]/20 shadow-lg">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h2 className="text-4xl font-extrabold mb-2 tracking-tight text-white">MedSecure<span className="text-[var(--accent-primary)]">AI</span></h2>
                    <p className="text-[var(--text-secondary)] font-medium">Secure Zero-Trust Portal</p>
                </div>

                {isLocked && (
                    <div className="mb-6 p-4 rounded-xl bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/30 text-[var(--accent-danger)] text-sm font-semibold flex items-center gap-3 animate-fade-in">
                        <ShieldCheck className="h-5 w-5" />
                        <span>Account temporarily locked. Contact administrator.</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/30 text-[var(--accent-danger)] text-sm font-semibold animate-fade-in">
                        {error}
                    </div>
                )}

                <Card className="backdrop-blur-2xl bg-[var(--bg-card)]/70 border-[var(--border-color)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="Username"
                            placeholder="e.g. dr.smith"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="bg-[var(--bg-dark)]/50 border-[var(--border-color)] focus:border-[var(--accent-primary)] transition-colors"
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-[var(--bg-dark)]/50 border-[var(--border-color)] focus:border-[var(--accent-primary)] transition-colors"
                        />

                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Access Role</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-300 ${role === 'doctor' ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 ring-1 ring-[var(--accent-primary)]/40' : 'border-[var(--border-color)] bg-[var(--bg-dark)]/20 hover:border-[var(--text-secondary)]'}`}
                                    onClick={() => setRole('doctor')}
                                >
                                    <Stethoscope className={`h-7 w-7 ${role === 'doctor' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
                                    <span className={`text-sm font-bold ${role === 'doctor' ? 'text-white' : 'text-[var(--text-muted)]'}`}>Doctor</span>
                                </div>

                                <div
                                    className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-300 ${role === 'admin' ? 'border-[var(--accent-warning)] bg-[var(--accent-warning)]/10 ring-1 ring-[var(--accent-warning)]/40' : 'border-[var(--border-color)] bg-[var(--bg-dark)]/20 hover:border-[var(--text-secondary)]'}`}
                                    onClick={() => setRole('admin')}
                                >
                                    <ShieldCheck className={`h-7 w-7 ${role === 'admin' ? 'text-[var(--accent-warning)]' : 'text-[var(--text-muted)]'}`} />
                                    <span className={`text-sm font-bold ${role === 'admin' ? 'text-white' : 'text-[var(--text-muted)]'}`}>Admin</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLocked || loading}
                            className="w-full h-14 text-base font-bold shadow-[0_4px_20px_rgba(218,119,242,0.4)] hover:shadow-[0_8px_30px_rgba(218,119,242,0.6)] transition-all transform active:scale-[0.98]"
                        >
                            {loading ? 'Authenticating...' : 'Establish Secure Session'}
                        </Button>
                    </form>

                    {lastLogin && (
                        <div className="mt-6 pt-6 border-t border-[var(--border-color)]/50 text-center">
                            <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-widest">
                                Last login: {lastLogin}
                            </p>
                        </div>
                    )}
                </Card>

            </div>
        </div>
    );
};

export default Login;
