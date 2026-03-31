import React from 'react';

const Card = ({ children, className = '', title, ...props }) => {
    return (
        <div
            className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 shadow-md ${className}`}
            {...props}
        >
            {title && (
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
            )}
            {children}
        </div>
    );
};

export default Card;
