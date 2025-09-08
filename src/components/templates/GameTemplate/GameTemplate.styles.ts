import { CSSProperties } from 'react';

export interface GameTemplateStyles {
  container: CSSProperties;
  gameArea: CSSProperties;
  controls: CSSProperties;
  scoreboard: CSSProperties;
  scoreItem: CSSProperties;
  gameOverlay: CSSProperties;
}

export const styles: GameTemplateStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#000',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  gameArea: {
    width: '100%',
    maxWidth: '800px',
    aspectRatio: '4/3',
    backgroundColor: '#111',
    border: '2px solid #333',
    borderRadius: '4px',
    position: 'relative',
    margin: '1rem auto',
    overflow: 'hidden',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '800px',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  scoreboard: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '800px',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  scoreItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  gameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
};

// Media query styles for responsive design
export const getResponsiveStyles = (windowWidth: number) => {
  if (windowWidth <= 768) {
    return {
      gameArea: {
        maxWidth: '100%',
      },
      controls: {
        flexDirection: 'column' as const,
        gap: '0.5rem',
      },
    };
  }
  
  return {};
};

