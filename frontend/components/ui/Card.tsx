
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
