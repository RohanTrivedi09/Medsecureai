import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]",
        primary: "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20",
        success: "bg-[#10B981] text-white font-bold",
        warning: "bg-[#F59E0B] text-white font-bold",
        danger: "bg-[#EF4444] text-white font-black uppercase shadow-lg",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
