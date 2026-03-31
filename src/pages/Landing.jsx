import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Activity, Brain, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
    return (
        <div className="flex flex-col items-center relative">
            {/* ECG Pulse Decorative Line */}
            <div className="absolute top-[20%] left-0 w-full h-32 bg-ecg-line opacity-10 pointer-events-none"></div>

            {/* Hero Section */}
            <section className="text-center py-24 px-4 max-w-5xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--accent-success)]/30 text-[var(--accent-success)] text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-[0_0_20px_rgba(74,222,128,0.1)] ring-1 ring-[var(--accent-success)]/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-success)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-success)]"></span>
                        </span>
                        CORE OVERSIGHT: OPERATIONAL
                    </div>

                    <div className="flex justify-center mb-10">
                        <div className="p-8 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--border-color)] ring-1 ring-white/10 shadow-[0_0_50px_-10px_rgba(218,119,242,0.3)] relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Shield className="h-24 w-24 text-[var(--accent-primary)] relative z-10" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] italic uppercase">
                        Zero-Trust <span className="text-gradient block not-italic">Healthcare AI</span>
                    </h1>

                    <p className="text-lg text-[var(--text-secondary)] mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                        Advanced medical data security through continuous behavioral verification. 
                        Experience the next generation of NIST-compliant clinical identity management.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/login">
                            <Button className="rounded-2xl px-12 py-5 text-sm font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(218,119,242,0.3)] hover:shadow-[0_15px_40px_rgba(218,119,242,0.5)] transform hover:-translate-y-1 transition-all flex items-center gap-3">
                                Initialize Security Protocol <ArrowRight size={18} />
                            </Button>
                        </Link>
                        <Button variant="secondary" className="rounded-2xl px-12 py-5 text-sm font-black uppercase tracking-widest border-[var(--border-color)] hover:bg-[var(--bg-card)] hover:border-[var(--accent-primary)]/50 transition-all">
                            View Documentation
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="grid md:grid-cols-3 gap-8 py-24 w-full max-w-6xl px-4 relative z-10"
            >
                <FeatureCard
                    icon={<Lock className="h-8 w-8 text-[var(--accent-secondary)]" />}
                    title="Immutable Identity"
                    description="Cryptographic identity verification for every session. Role-based access enforced at the packet level."
                    delay={0.1}
                />
                <FeatureCard
                    icon={<Brain className="h-8 w-8 text-[var(--accent-primary)]" />}
                    title="Behavioral AI"
                    description="Continuous scanning of access patterns. Real-time threat detection and automated protocol restriction."
                    delay={0.2}
                />
                <FeatureCard
                    icon={<Activity className="h-8 w-8 text-[var(--accent-success)]" />}
                    title="Audit Integrity"
                    description="Detailed log telemetry for compliance review. Visualizing every AI decision with risk-factor breakdown."
                    delay={0.3}
                />
            </motion.section>

            <div className="mt-12 mb-24 p-6 bg-[var(--bg-card)]/20 rounded-[2rem] border border-[var(--border-color)] max-w-3xl text-center backdrop-blur-xl ring-1 ring-white/5 relative z-10">
                <div className="flex justify-center gap-8 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2"><ShieldCheck size={16} /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">NIST Compliant</span></div>
                    <div className="flex items-center gap-2"><Zap size={16} /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Powered</span></div>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] leading-loose italic">
                    This demonstration uses simulated data. No real Protected Health Information is processed.
                </p>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
    >
        <Card className="h-full hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-card)] transition-all duration-500 bg-[var(--bg-card)]/40 backdrop-blur-xl group p-8 rounded-3xl border-[var(--border-color)] ring-1 ring-white/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--accent-primary)]/5 to-transparent rounded-bl-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="mb-8 p-5 rounded-2xl bg-[var(--bg-dark)] w-fit group-hover:scale-110 group-hover:bg-[var(--bg-card)] transition-all duration-500 ring-1 ring-white/10 shadow-xl relative z-10">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 group-hover:text-[var(--accent-primary)] transition-colors italic tracking-tighter relative z-10">{title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed font-medium relative z-10">{description}</p>
        </Card>
    </motion.div>
);

export default Landing;
