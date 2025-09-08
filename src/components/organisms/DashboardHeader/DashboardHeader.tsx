import React from 'react';
import { useUserContext } from '../../../context/userContext';
import { Button } from '../../atoms/Button';

/**
 * DashboardHeader props interface
 */
export interface DashboardHeaderProps {
  /**
   * Optional title to display
   */
  title?: string;
  
  /**
   * Optional subtitle to display
   */
  subtitle?: string;
  
  /**
   * Whether to show the user's coin balance
   */
  showCoins?: boolean;
  
  /**
   * Whether to show the user's last login time
   */
  showLastLogin?: boolean;
  
  /**
   * Custom content to display in the header
   */
  customContent?: React.ReactNode;
  
  /**
   * Custom style to apply to the header container
   */
  customStyle?: React.CSSProperties;
  
  /**
   * Custom class names to apply to the header container
   */
  className?: string;
  
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
  
  /**
   * Error message to display
   */
  error?: string | null;
  
  /**
   * Function to clear the error message
   */
  onErrorClear?: () => void;
}

/**
 * Dashboard header loading skeleton
 */
const DashboardHeaderSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-primary-light rounded w-3/4 mb-sm"></div>
    <div className="h-4 bg-primary-light rounded w-1/2"></div>
  </div>
);

/**
 * Format date to a readable string
 * 
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * DashboardHeader component
 * 
 * Displays user information and customizable header content at the top of a dashboard.
 * 
 * @param props - Component props
 * @returns React component
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  showCoins = true,
  showLastLogin = false,
  customContent,
  customStyle = {},
  className = '',
  isLoading = false,
  error = null,
  onErrorClear,
}) => {
  // Get user information from context
  const { user } = useUserContext();
  
  // Determine welcome message
  const welcomeMessage = title || (
    user.name 
      ? `Welcome back, ${user.name}!` 
      : 'Welcome to your dashboard!'
  );
  
  return (
    <div 
      className={`bg-surface rounded-md shadow-md p-md mb-md animate-fade-in ${className}`}
      style={customStyle}
    >
      {/* Error message */}
      {error && (
        <div className="bg-error-light text-error p-sm rounded-sm mb-md">
          <p>{error}</p>
          {onErrorClear && (
            <Button 
              variant="secondary" 
              onClick={onErrorClear}
              customStyle={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
            >
              Dismiss
            </Button>
          )}
        </div>
      )}
      
      {isLoading ? (
        <DashboardHeaderSkeleton />
      ) : (
        <>
          {/* Header title */}
          <h2 className="text-xl font-bold mb-sm">
            {user.name ? (
              <>
                {title || 'Welcome back,'} <span className="text-primary">{user.name}</span>!
              </>
            ) : (
              welcomeMessage
            )}
          </h2>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-muted mb-md">{subtitle}</p>
          )}
          
          {/* User info section */}
          <div className="flex flex-wrap items-center gap-md">
            {/* Coins */}
            {showCoins && user.coins !== undefined && (
              <div className="bg-primary-light p-sm rounded-sm">
                <span className="text-sm">Balance:</span>
                <span className="text-secondary font-bold ml-sm">{user.coins} coins</span>
              </div>
            )}
            
            {/* Last login */}
            {showLastLogin && user.lastLogin && (
              <div className="text-sm text-muted">
                Last login: {formatDate(user.lastLogin)}
              </div>
            )}
            
            {/* Custom content */}
            {customContent}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHeader;

