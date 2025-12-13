import React from 'react';

export const Card = ({ children, hover = false, className = '' }) => {
    const baseClasses = 'bg-white rounded-lg shadow-md p-6';
    const hoverClasses = hover ? 'hover:shadow-lg cursor-pointer' : '';

    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};