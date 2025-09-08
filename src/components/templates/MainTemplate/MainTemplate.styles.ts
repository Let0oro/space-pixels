import { CSSProperties } from 'react';

/**
 * Layout types for the main content area
 */
export type LayoutType = 'default' | 'wide' | 'narrow' | 'full';

/**
 * TypeScript interface for MainTemplate styles
 */
export interface MainTemplateStyles {
  // Main container elements
  container: CSSProperties;
  header: CSSProperties;
  navigationContainer: CSSProperties;
  main: CSSProperties;
  content: CSSProperties;
  footer: CSSProperties;
  
  // Layout variations
  defaultLayout: CSSProperties;
  wideLayout: CSSProperties;
  narrowLayout: CSSProperties;
  fullLayout: CSSProperties;
  
  // State styles
  loadingContainer: CSSProperties;
  loadingSpinner: CSSProperties;
  errorContainer: CSSProperties;
  errorMessage: CSSProperties;
  authRequiredContainer: CSSProperties;
  
  // User-related styles
  userInfoContainer: CSSProperties;
  
  // Animation styles
  fadeIn: CSSProperties;
  slideIn: CSSProperties;
}

/**
 * Define animations if in browser environment
 */
if (typeof document !== 'undefined') {
  // Check if animations are already defined
  if (!document.querySelector('#space-pixels-animations')) {
    const style = document.createElement('style');
    style.id = 'space-pixels-animations';
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Primary color palette
 */
const colors = {
  primary: '#4a4dbd',
  primaryLight: 'rgba(74, 77, 189, 0.1)',
  primaryDark: '#3a3d9d',
  background: '#f8f9fa',
  white: '#ffffff',
  border: '#e9ecef',
  text: '#212529',
  textSecondary: '#6c757d',
  error: '#e74c3c',
  errorLight: 'rgba(231, 76, 60, 0.1)',
  success: '#2ecc71',
  successLight: 'rgba(46, 204, 113, 0.1)',
};

/**
 * Spacing system
 */
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
};

/**
 * Base styles for MainTemplate
 */
export const styles: MainTemplateStyles = {
  // Main container elements
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: colors.background,
    transition: 'background-color 0.3s ease',
  },
  header: {
    width: '100%',
    backgroundColor: colors.white,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navigationContainer: {
    width: '100%',
  },
  main: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: `${spacing.xl} ${spacing.md}`,
    boxSizing: 'border-box',
  },
  content: {
    width: '100%',
    margin: '0 auto',
    animation: 'fadeIn 0.3s ease-out, slideIn 0.3s ease-out',
    transition: 'max-width 0.3s ease',
  },
  footer: {
    width: '100%',
    backgroundColor: colors.white,
    borderTop: `1px solid ${colors.border}`,
    padding: `${spacing.xl} ${spacing.md}`,
    textAlign: 'center',
    fontSize: '0.9rem',
    color: colors.textSecondary,
  },
  
  // Layout variations
  defaultLayout: {
    maxWidth: '1200px',
  },
  wideLayout: {
    maxWidth: '1600px',
  },
  narrowLayout: {
    maxWidth: '800px',
  },
  fullLayout: {
    maxWidth: '100%',
    padding: 0,
  },
  
  // State styles
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    width: '100%',
    gap: spacing.md,
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: `3px solid ${colors.primaryLight}`,
    borderTopColor: colors.primary,
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.errorLight,
    borderRadius: '8px',
    margin: `${spacing.md} 0`,
    minHeight: '200px',
  },
  errorMessage: {
    color: colors.error,
    fontSize: '1rem',
    textAlign: 'center',
    margin: `${spacing.md} 0`,
  },
  authRequiredContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.primaryLight,
    borderRadius: '8px',
    margin: `${spacing.md} 0`,
    minHeight: '200px',
  },
  
  // User-related styles
  userInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: '4px',
    margin: `0 ${spacing.md}`,
    fontSize: '0.9rem',
  },
  
  // Animation styles
  fadeIn: {
    animation: 'fadeIn 0.3s ease-out',
  },
  slideIn: {
    animation: 'slideIn 0.3s ease-out',
  },
};

/**
 * Get responsive styles based on window width
 * 
 * @param windowWidth - Current window width in pixels
 * @returns Partial style overrides for different screen sizes
 */
export const getResponsiveStyles = (windowWidth: number): Partial<MainTemplateStyles> => {
  // Mobile styles (small screens)
  if (windowWidth < 576) {
    return {
      main: {
        padding: `${spacing.md} ${spacing.sm}`,
      },
      content: {
        padding: '0',
      },
      footer: {
        padding: `${spacing.lg} ${spacing.sm}`,
      },
      loadingContainer: {
        minHeight: '200px',
      },
      errorContainer: {
        padding: spacing.md,
      },
    };
  }
  
  // Tablet styles (medium screens)
  if (windowWidth < 992) {
    return {
      main: {
        padding: `${spacing.lg} ${spacing.md}`,
      },
      content: {
        maxWidth: '100%',
      },
    };
  }
  
  // Desktop styles (large screens)
  return {};
};

