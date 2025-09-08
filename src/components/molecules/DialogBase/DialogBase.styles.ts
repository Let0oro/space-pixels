import { CSSProperties } from 'react';

export interface DialogBaseStyles {
  dialog: CSSProperties;
  header: CSSProperties;
  content: CSSProperties;
  footer: CSSProperties;
  backdrop: CSSProperties;
  title: CSSProperties;
}

export const styles: DialogBaseStyles = {
  dialog: {
    width: '420px',
    maxWidth: '90vw',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  content: {
    marginBottom: '1.5rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
};

