import { CSSProperties } from 'react';

/**
 * TypeScript interface for StudioTemplate styles
 */
export interface StudioTemplateStyles {
  // Layout styles
  container: CSSProperties;
  content: CSSProperties;
  mainGrid: CSSProperties;
  
  // Canvas styles
  canvasContainer: CSSProperties;
  canvasWrapper: CSSProperties;
  canvasGrid: CSSProperties;
  
  // Tools panel styles
  toolsPanel: CSSProperties;
  toolSection: CSSProperties;
  toolSectionTitle: CSSProperties;
  toolGrid: CSSProperties;
  toolButton: CSSProperties;
  toolButtonActive: CSSProperties;
  
  // Color picker styles
  colorGrid: CSSProperties;
  colorSwatch: CSSProperties;
  colorSwatchActive: CSSProperties;
  colorCustomInput: CSSProperties;
  
  // Canvas size selector styles
  sizeSelector: CSSProperties;
  sizeOption: CSSProperties;
  sizeOptionActive: CSSProperties;
  
  // Controls styles
  controlsBar: CSSProperties;
  actionsContainer: CSSProperties;
  
  // Preview styles
  previewContainer: CSSProperties;
  
  // Form styles
  formGroup: CSSProperties;
  input: CSSProperties;
  label: CSSProperties;
  
  // Message styles
  errorMessage: CSSProperties;
  successMessage: CSSProperties;
}

/**
 * Base styles for the StudioTemplate component
 */
export const styles: StudioTemplateStyles = {
  // Layout styles
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    boxSizing: 'border-box',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '1.5rem',
    flex: 1,
  },
  
  // Canvas styles
  canvasContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  canvasWrapper: {
    position: 'relative',
    margin: '0 auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  canvasGrid: {
    display: 'grid',
    width: '320px',
    height: '320px',
  },
  
  // Tools panel styles
  toolsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  toolSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  toolSectionTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    color: '#4a4dbd',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem',
  },
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
  },
  toolButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 0.5rem',
    backgroundColor: '#f1f3f5',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: 'normal',
    fontSize: '0.9rem',
  },
  toolButtonActive: {
    backgroundColor: '#4a4dbd',
    color: '#ffffff',
    borderColor: '#3a3d9d',
    fontWeight: 'bold',
  },
  
  // Color picker styles
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
  },
  colorSwatch: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
  },
  colorSwatchActive: {
    transform: 'scale(1.1)',
    boxShadow: '0 0 0 2px #fff, 0 0 0 4px #4a4dbd',
    zIndex: 1,
  },
  colorCustomInput: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
    cursor: 'pointer',
  },
  
  // Canvas size selector styles
  sizeSelector: {
    display: 'flex',
    gap: '0.5rem',
  },
  sizeOption: {
    flex: 1,
    padding: '0.75rem',
    textAlign: 'center',
    backgroundColor: '#f1f3f5',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.9rem',
  },
  sizeOptionActive: {
    backgroundColor: '#4a4dbd',
    color: '#ffffff',
    borderColor: '#3a3d9d',
    fontWeight: 'bold',
  },
  
  // Controls styles
  controlsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    width: '100%',
  },
  actionsContainer: {
    display: 'flex',
    gap: '0.75rem',
  },
  
  // Preview styles
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: '#f1f3f5',
    padding: '1rem',
    borderRadius: '4px',
  },
  
  // Form styles
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1.5rem',
    width: '100%',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#495057',
  },
  
  // Message styles
  errorMessage: {
    color: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '4px',
    padding: '0.75rem',
    marginTop: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
  },
  successMessage: {
    color: '#2ecc71',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: '4px',
    padding: '0.75rem',
    marginTop: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
  },
};

/**
 * Get responsive styles based on window width
 * 
 * @param windowWidth Current window width in pixels
 * @returns Partial style overrides for responsive layout
 */
export const getResponsiveStyles = (windowWidth: number): Partial<StudioTemplateStyles> => {
  // Mobile styles (small screens)
  if (windowWidth < 576) {
    return {
      content: {
        padding: '1rem',
      },
      mainGrid: {
        gridTemplateColumns: '1fr',
        gap: '1rem',
      },
      controlsBar: {
        flexDirection: 'column',
        gap: '1rem',
      },
      colorGrid: {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
      toolGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
    };
  }
  
  // Tablet styles (medium screens)
  if (windowWidth < 992) {
    return {
      mainGrid: {
        gridTemplateColumns: '1fr',
        gap: '1.25rem',
      },
      colorGrid: {
        gridTemplateColumns: 'repeat(8, 1fr)',
      },
      toolGrid: {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
    };
  }
  
  // Default styles (large screens)
  return {};
};

