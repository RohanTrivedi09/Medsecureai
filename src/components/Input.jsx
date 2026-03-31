import React from 'react';

const Input = ({ label, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;
