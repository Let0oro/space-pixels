import { CSSProperties } from 'react';

export interface UserProfileDialogStyles {
  container: CSSProperties;
  header: CSSProperties;
  username: CSSProperties;
  shipsContainer: CSSProperties;
  loadingText: CSSProperties;
  followButton: CSSProperties;
  errorText: CSSProperties;
}

export const styles: UserProfileDialogStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  },
  username: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0,
  },
  shipsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  loadingText: {
    textAlign: 'center',
    padding: '1rem',
    color: '#666',
  },
  followButton: {
    fontSize: '0.85rem',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '0.85rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderRadius: '0.25rem',
  },
};

