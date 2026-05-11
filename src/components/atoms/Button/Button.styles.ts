import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

export interface ButtonStyles {
  base: React.CSSProperties;
  primary: React.CSSProperties;
  secondary: React.CSSProperties;
  danger: React.CSSProperties;
  link: React.CSSProperties;
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
    transition: 'background-color 0.2s, transform 0.1s, opacity 0.2s',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  primary: {
    backgroundColor: 'var(--color-primary, #646cff)',
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
  link: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary, #646cff)',
    padding: '0.25rem 0.5rem',
    textDecoration: 'underline',
    fontWeight: 'normal',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
