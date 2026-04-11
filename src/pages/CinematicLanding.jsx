import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

const seededUnit = (seed) => {
  const value = Math.sin(seed * 9999) * 10000;
  return value - Math.floor(value);
};

const createNeurons = (count) => (
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: seededUnit(i + 1) * 100,
    y: seededUnit(i + 101) * 100,
    size: seededUnit(i + 201) * 4 + 2,
    delay: seededUnit(i + 301) * 2,
    repeatDelay: seededUnit(i + 401) * 5,
  }))
);

const createPulseParticles = (count) => (
  Array.from({ length: count }, (_, i) => ({
    id: i,
    top: seededUnit(i + 501) * 100,
    left: seededUnit(i + 601) * 100,
    duration: 3 + seededUnit(i + 701) * 4,
    delay: seededUnit(i + 801) * 5,
  }))
);

const CinematicLanding = () => {
  const navigate = useNavigate();
  const [beat, setBeat] = useState(1);
  const [showSkip, setShowSkip] = useState(true);
  const MotionDiv = motion.div;

  // Sequence Timing
  useEffect(() => {
    const sequence = [
      { beat: 1, duration: 2500 }, // ECG Draw (0 - 2.5s)
      { beat: 2, duration: 800 },  // Flatline Pause (2.5 - 3.3s)
      { beat: 3, duration: 1700 }, // Shield Assembly (3.3 - 5s)
      { beat: 4, duration: 1000 }, // Neural Activation (5 - 6s)
      { beat: 5, duration: 2000 }, // Title Reveal (6 - 8s)
      { beat: 6, duration: 0 }     // Final State (8s+)
    ];

    if (beat >= 6) return;

    const timer = setTimeout(() => {
      setBeat(prev => prev + 1);
    }, sequence[beat - 1].duration);

    return () => clearTimeout(timer);
  }, [beat]);

  const skipIntro = () => {
    setBeat(6);
    setShowSkip(false);
  };

  const neurons = useMemo(() => createNeurons(16), []);
  const pulseParticles = useMemo(() => createPulseParticles(20), []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A1A] text-white relative overflow-hidden font-['Inter'] select-none">
      {/* Background & Atmosphere */}
      <div className="cinematic-bg"></div>
      <div className="grain-overlay"></div>
      <div className={`tension-dim ${beat === 2 ? 'active' : ''}`}></div>
      {beat === 2 && <MotionDiv animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.3 }} className="danger-flash active"></MotionDiv>}
      
      <div className={`radial-glow ${beat >= 3 ? 'animate-glow-breathe' : ''}`} 
           style={{ opacity: beat >= 3 ? 1 : 0, transition: 'opacity 1s ease' }}></div>

      {/* Skip Button */}
      {showSkip && beat < 6 && (
        <button 
          onClick={skipIntro}
          className="absolute top-8 right-8 z-[100] text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all flex items-center gap-2 group"
        >
          Skip Intro <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Logo Wrapper */}
      <div className="absolute top-8 left-8 z-[100] flex items-center gap-3 opacity-60">
        <div className="p-1.5 rounded-lg bg-[var(--accent-electric-purple)]/10 border border-[var(--accent-electric-purple)]/20 shadow-[0_0_15px_rgba(155,92,246,0.2)]">
          <Shield size={20} className="text-[var(--accent-electric-purple)]" />
        </div>
        <span className="text-sm font-black uppercase tracking-[0.2em] italic">MedSecureAI</span>
      </div>

      <AnimatePresence mode="wait">
        {/* Beat 1 & 2: Hero ECG */}
        {(beat === 1 || beat === 2) && (
          <motion.div 
            key="ecg-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full absolute inset-0 flex items-center justify-center z-10"
          >
            <svg viewBox="0 0 1000 200" className="w-full px-0 overflow-visible">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* The Path */}
              <motion.path
                d={beat === 1 
                  ? "M -50 100 L 200 100 L 230 40 L 260 160 L 290 100 L 400 100 L 430 40 L 460 160 L 490 100 L 700 100 L 730 40 L 760 160 L 790 100 L 1050 100" 
                  : "M -50 100 L 1050 100"}
                fill="none"
                stroke="var(--accent-bio-green)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: beat === 1 ? 2.5 : 0.8, ease: "linear" }}
                filter="url(#glow)"
              />

              {/* Leading Spark */}
              {beat === 1 && (
                <motion.circle
                  r="4"
                  fill="var(--accent-bio-green)"
                  style={{ filter: 'drop-shadow(0 0 10px #00FF88)' }}
                  offset="0"
                >
                  <animateMotion
                    dur="2.5s"
                    repeatCount="1"
                    path="M -50 100 L 200 100 L 230 40 L 260 160 L 290 100 L 400 100 L 430 40 L 460 160 L 490 100 L 700 100 L 730 40 L 760 160 L 790 100 L 1050 100"
                  />
                </motion.circle>
              )}
            </svg>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-24 text-[10px] font-black uppercase tracking-[0.8em] text-[var(--accent-bio-green)] blur-[0.5px]"
            >
              System Pulse Verification...
            </motion.div>
          </motion.div>
        )}

        {/* Beat 3 & 4: Shield Assembly & Neural Awakening */}
        {(beat === 3 || beat === 4 || beat === 5) && (
          <motion.div 
            key="shield-stage"
            className="relative flex flex-col items-center z-20"
          >
            {/* Neural Network Spread */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <svg className="h-full w-full">
                {beat >= 4 && neurons.map((n, i) => {
                  const nextN = neurons[(i + 1) % neurons.length];
                  return (
                    <g key={`net-${i}`}>
                      <motion.line
                        x1={`${n.x}%`} y1={`${n.y}%`}
                        x2={`${nextN.x}%`} y2={`${nextN.y}%`}
                        stroke="var(--accent-electric-purple)"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.15 }}
                        transition={{ delay: n.delay, duration: 2 }}
                      />
                      {/* Signal Pulse */}
                      <motion.circle
                        r="1"
                        fill="var(--accent-bio-green)"
                        initial={{ offset: 0, opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ 
                          delay: n.delay + 1, 
                          duration: 2, 
                          repeat: Infinity,
                          repeatDelay: n.repeatDelay
                        }}
                      >
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          path={`M ${n.x * 10} ${n.y * 10} L ${nextN.x * 10} ${nextN.y * 10}`}
                        />
                      </motion.circle>
                    </g>
                  );
                })}
              </svg>
              {neurons.map((n) => (
                <div key={n.id} style={{ left: `${n.x}%`, top: `${n.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: beat >= 4 ? 1 : 0, opacity: beat >= 4 ? 0.6 : 0 }}
                    transition={{ delay: n.delay, duration: 0.5 }}
                    className="h-1.5 w-1.5 rounded-full bg-[var(--accent-electric-purple)] shadow-[0_0_10px_var(--accent-electric-purple)]"
                  ></motion.div>
                </div>
              ))}
            </div>

            {/* The Shield */}
            <div className={`relative ${beat >= 6 ? 'animate-slow-scale' : ''} transition-transform duration-1000`}>
              {/* Pulse Ring */}
              {beat === 4 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-[var(--accent-electric-purple)] shadow-[0_0_20px_var(--accent-electric-purple)]"
                />
              )}
              
              <svg viewBox="0 0 100 110" className="w-[200px] h-[220px] filter drop-shadow(0 0 20px rgba(155, 92, 246, 0.4))">
                <defs>
                  <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(155, 92, 246, 0.2)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M50 5 L90 25 L90 75 C90 95 50 105 50 105 C50 105 10 95 10 75 L10 25 Z"
                  fill="url(#shieldFill)"
                  stroke="var(--accent-electric-purple)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                {/* Shield Detail Dots (Neural cluster) */}
                {beat >= 4 && (
                  <>
                    {[
                      { x: 50, y: 40 }, { x: 35, y: 55 }, { x: 65, y: 55 }, { x: 50, y: 75 }
                    ].map((p, i) => (
                      <motion.circle
                        key={i}
                        cx={p.x} cy={p.y} r="1.5"
                        fill="var(--accent-bio-green)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 * i }}
                        style={{ filter: 'drop-shadow(0 0 5px #00FF88)' }}
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>

            {/* AI Activation Text */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: beat >= 4 ? 1 : 0, y: beat >= 4 ? 0 : 10 }}
              className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md"
            >
              <div className="h-2 w-2 rounded-full bg-[var(--accent-bio-green)] animate-pulse shadow-[0_0_8px_var(--accent-bio-green)]"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50">
                Neural Lattice Secured
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* Beat 5 & 6: Brand Reveal & CTA */}
        {(beat === 5 || beat === 6) && (
          <motion.div 
            key="final-stage"
            className="flex flex-col items-center text-center px-6 mt-12 z-30"
          >
            {/* Title with Typing/Drawing effect */}
            <div className="relative mb-6">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl md:text-8xl font-black italic tracking-[-0.02em] leading-none"
              >
                MEDSECURE<span className="text-[var(--accent-electric-purple)] not-italic">AI</span>
              </motion.h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-[3px] bg-[var(--accent-electric-purple)] mt-2 shadow-[0_0_15px_var(--accent-electric-purple)]"
              />
            </div>

            {/* Tagline word by word */}
            <div className="overflow-hidden flex gap-2 mb-14">
              {["INTELLIGENT", "SECURITY", "FOR", "MEDICAL", "DATA"].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.6 }}
                  transition={{ delay: 0.8 + (i * 0.15) }}
                  className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* CTA & Badges Reveal */}
            {beat === 6 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <button 
                  onClick={() => navigate('/login')}
                  className="group relative px-16 py-5 rounded-2xl bg-transparent border border-[var(--accent-electric-purple)]/50 text-white font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-electric-purple)] to-[var(--accent-primary)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10 opacity-80"></div>
                  <span className="flex items-center gap-3">
                     Enter Secure Portal <ArrowRight size={16} />
                  </span>
                </button>

                <div className="flex flex-wrap justify-center gap-8 md:gap-14 pt-10">
                  {[
                    { label: "256-bit Encrypted", icon: Lock },
                    { label: "Zero-Trust Model", icon: ShieldCheck },
                    { label: "AI Monitored 24/7", icon: Activity }
                  ].map((badge, i) => (
                    <motion.div 
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.5 }}
                      transition={{ delay: 0.2 + (i * 0.2) }}
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] group"
                    >
                      <badge.icon size={14} className="text-[var(--accent-bio-green)] group-hover:scale-125 transition-transform" />
                      {badge.label}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Neural Pulse (Beat 6 Loop) */}
      {beat === 6 && (
        <div className="fixed inset-0 pointer-events-none opacity-10">
          {pulseParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute h-1 w-1 bg-[var(--accent-bio-green)] rounded-full"
              style={{ top: `${particle.top}%`, left: `${particle.left}%` }}
              animate={{ 
                opacity: [0, 0.4, 0], 
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{ 
                duration: particle.duration,
                repeat: Infinity, 
                delay: particle.delay
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CinematicLanding;
