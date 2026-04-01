import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    customStyle?: React.CSSProperties;
    children: React.ReactNode;
}

const styles: Record<string, React.CSSProperties> = {
    base: {
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.2s',
    },
    primary: { backgroundColor: '#3b82f6', color: '#fff' },
    secondary: { backgroundColor: '#4b5563', color: '#fff' },
    danger: { backgroundColor: '#ef4444', color: '#fff' },
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', customStyle, children, ...props }) => {
    const combinedStyles = { ...styles.base, ...styles[variant], ...customStyle };
    return (
        <button style={combinedStyles} {...props}>
            {children}
        </button>
    );
};

export default Button;
