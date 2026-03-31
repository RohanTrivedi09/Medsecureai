import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import { ShieldCheck, Activity, Cpu, Globe } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-dark)] relative overflow-x-hidden">
            {/* Background grid/mesh from CSS */}
            <div className="bg-mesh"></div>

            <Navbar />

            <main className="flex-grow w-full max-w-none mx-auto px-4 md:px-8 py-8 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="bg-[var(--bg-dark)]/50 border-t border-[var(--border-color)] py-8 mt-auto relative z-10 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="max-w-md text-center md:text-left">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-white mb-2 italic">MedSecureAI Zero-Trust Engine</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed">
                            Academic prototype built for university Coursework. All identities and data simulated. 
                            NIST SP 800-207 Reference Implementation.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        <div className="flex items-center gap-2 text-[var(--accent-success)]">
                            <Activity size={14} className="animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">AI Monitoring: Active</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--accent-primary)]">
                            <ShieldCheck size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">DB: Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--accent-secondary)]">
                            <Cpu size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Session: Secure</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <Globe size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Last Sync: Just Now</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
