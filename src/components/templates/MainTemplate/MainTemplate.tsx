import React, { useState, useEffect, ReactNode } from 'react';
import { styles, getResponsiveStyles, LayoutType } from './MainTemplate.styles';
import Navigation from '../../organisms/Navigation/Navigation';
import { Button } from '../../atoms/Button';
import { useUserContext } from '../../../context/userContext';

/**
 * Error boundary props interface
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching and displaying errors
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Template error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div style={styles.errorContainer}>
          <h2>Something went wrong</h2>
          <p style={styles.errorMessage}>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <Button 
            variant="primary" 
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Props for MainTemplate component
 */
export interface MainTemplateProps {
  /**
   * Content to render within the template
   */
  children: ReactNode;
  
  /**
   * Page title to display in the browser tab
   */
  title?: string;
  
  /**
   * Layout type to determine content width
   */
  layout?: LayoutType;
  
  /**
   * Whether the page is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Message to display while loading
   */
  loadingMessage?: string;
  
  /**
   * Error message to display (if any)
   */
  errorMessage?: string | null;
  
  /**
   * Whether to hide the header/navigation
   */
  hideHeader?: boolean;
  
  /**
   * Whether to hide the footer
   */
  hideFooter?: boolean;
  
  /**
   * Custom styles for the container
   */
  customStyle?: React.CSSProperties;
  
  /**
   * Custom styles for the content area
   */
  contentStyle?: React.CSSProperties;
  
  /**
   * Custom fallback for error boundary
   */
  errorFallback?: ReactNode;
  
  /**
   * Optional header content to render above the main content
   */
  headerContent?: ReactNode;
  
  /**
   * Optional footer content to replace the default footer
   */
  footerContent?: ReactNode;
  
  /**
   * Whether authentication is required for this page
   */
  requireAuth?: boolean;
  
  /**
   * Content to show when user is not authenticated (if requireAuth is true)
   */
  unauthenticatedContent?: ReactNode;
}

/**
 * MainTemplate component
 * 
 * A layout template for the application that handles navigation, authentication,
 * loading states, error handling, and responsive design.
 * 
 * @param props - Component props
 * @returns React component
 */
const MainTemplate: React.FC<MainTemplateProps> = ({
  children,
  title = 'Space Pixels',
  layout = 'default',
  isLoading = false,
  loadingMessage = 'Loading...',
  errorMessage = null,
  hideHeader = false,
  hideFooter = false,
  customStyle = {},
  contentStyle = {},
  errorFallback,
  headerContent,
  footerContent,
  requireAuth = false,
  unauthenticatedContent,
}) => {
  // Get authentication state from context
  const { user } = useUserContext();
  const isAuthenticated = !!user.id;
  
  // State for responsive styles
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [responsiveStyles, setResponsiveStyles] = useState(
    getResponsiveStyles(typeof window !== 'undefined' ? window.innerWidth : 1200)
  );
  
  // Determine layout style based on layout type
  const getLayoutStyle = () => {
    switch (layout) {
      case 'wide':
        return styles.wideLayout;
      case 'narrow':
        return styles.narrowLayout;
      case 'full':
        return styles.fullLayout;
      default:
        return styles.defaultLayout;
    }
  };
  
  // Handle window resize for responsive design
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setResponsiveStyles(getResponsiveStyles(window.innerWidth));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update document title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }, [title]);
  
  // Render loading state
  const renderLoading = () => (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner} />
      <p>{loadingMessage}</p>
    </div>
  );
  
  // Render error state
  const renderError = () => (
    <div style={styles.errorContainer}>
      <p style={styles.errorMessage}>{errorMessage}</p>
      <Button variant="primary" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
  
  // Render content based on state
  const renderContent = () => {
    // Check authentication if required
    if (requireAuth && !isAuthenticated) {
      return unauthenticatedContent || (
        <div style={styles.errorContainer}>
          <h2>Authentication Required</h2>
          <p>Please log in to access this page.</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </Button>
        </div>
      );
    }
    
    // Handle loading state
    if (isLoading) {
      return renderLoading();
    }
    
    // Handle error state
    if (errorMessage) {
      return renderError();
    }
    
    // Render children if no special states
    return children;
  };

  return (
    <ErrorBoundary fallback={errorFallback}>
      <div style={{ ...styles.container, ...customStyle }}>
        {/* Header with navigation */}
        {!hideHeader && (
          <header style={styles.header}>
            <div style={styles.navigationContainer}>
              <Navigation />
            </div>
            {headerContent}
          </header>
        )}
        
        {/* Main content area */}
        <main style={{ ...styles.main, ...responsiveStyles.main }}>
          <div 
            style={{ 
              ...styles.content, 
              ...getLayoutStyle(), 
              ...responsiveStyles.content,
              ...contentStyle 
            }}
          >
            {renderContent()}
          </div>
        </main>
        
        {/* Footer */}
        {!hideFooter && (
          <footer style={styles.footer}>
            {footerContent || (
              <div>
                <p>© {new Date().getFullYear()} Space Pixels. All rights reserved.</p>
                <p>Built with Atomic Design and SOLID principles</p>
              </div>
            )}
          </footer>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MainTemplate;

