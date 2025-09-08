import { ReactNode } from 'react';

/**
 * Action status type
 */
export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Action type for dashboard actions
 */
export type ActionType = 'play' | 'shop' | 'studio' | 'custom';

/**
 * Action handler type
 */
export type ActionHandler = () => void | Promise<void>;

/**
 * Dashboard action item interface
 */
export interface DashboardActionItem {
  /**
   * Action type
   */
  type: ActionType;
  
  /**
   * Action label
   */
  label: string;
  
  /**
   * Action handler function
   */
  handler: ActionHandler;
  
  /**
   * Whether the action is disabled
   */
  disabled?: boolean;
  
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  
  /**
   * Confirmation message before executing action
   */
  confirmMessage?: string;
  
  /**
   * Custom icon or element to display with the action
   */
  icon?: ReactNode;
  
  /**
   * Custom styles for the action button
   */
  customStyle?: React.CSSProperties;
}

/**
 * Dashboard actions props interface
 */
export interface DashboardActionsProps {
  /**
   * Optional custom style for the container
   */
  customStyle?: React.CSSProperties;
  
  /**
   * Optional custom class name
   */
  className?: string;
  
  /**
   * Whether to show the play game button
   */
  showPlayButton?: boolean;
  
  /**
   * Whether to show the shop button
   */
  showShopButton?: boolean;
  
  /**
   * Whether to show the pixel studio button
   */
  showStudioButton?: boolean;
  
  /**
   * Whether a ship is selected
   */
  isShipSelected?: boolean;
  
  /**
   * Selected ship ID
   */
  selectedShipId?: number | null;
  
  /**
   * Custom action buttons to display
   */
  customActions?: DashboardActionItem[];
  
  /**
   * Optional handler for play action
   */
  onPlay?: ActionHandler;
  
  /**
   * Optional handler for shop action
   */
  onShop?: ActionHandler;
  
  /**
   * Optional handler for studio action
   */
  onStudio?: ActionHandler;
  
  /**
   * Optional handler for error
   */
  onError?: (message: string) => void;
  
  /**
   * Whether the component is in loading state
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
  
  /**
   * Whether to show the action status
   */
  showStatus?: boolean;
  
  /**
   * Message to display when no ship is selected
   */
  noShipMessage?: string;
  
  /**
   * Whether to use button group layout
   */
  useButtonGroup?: boolean;
}

