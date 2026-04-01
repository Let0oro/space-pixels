import React from 'react';

export interface ButtonStyles {
    base: React.CSSProperties;
    primary: React.CSSProperties;
    secondary: React.CSSProperties;
    danger: React.CSSProperties;
    disabled: React.CSSProperties;
}

export const styles: ButtonStyles = {
    base: {
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.2s, transform 0.1s',
        outline: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    primary: {
        backgroundColor: '#3b82f6',
        color: '#fff',
    },
    secondary: {
        backgroundColor: '#4b5563',
        color: '#fff',
    },
    danger: {
        backgroundColor: '#ef4444',
        color: '#fff',
    },
    disabled: {
        backgroundColor: '#d1d5db',
        color: '#9ca3af',
        cursor: 'not-allowed',
    }
};
