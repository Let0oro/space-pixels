import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { useUserContext } from '../../../context/userContext';
import { 
  DashboardActionsProps, 
  ActionStatus, 
  DashboardActionItem 
} from './DashboardActions.types';

/**
 * Status message component for action status
 */
const ActionStatusMessage: React.FC<{ 
  status: ActionStatus; 
  message: string | null;
  onClear?: () => void;
}> = ({ status, message, onClear }) => {
  if (!message) return null;
  
  let className = '';
  
  switch (status) {
    case 'error':
      className = 'bg-error-light text-error';
      break;
    case 'success':
      className = 'bg-success-light text-success';
      break;
    default:
      className = 'bg-primary-light text-primary';
  }
  
  return (
    <div className={`p-sm rounded-sm text-center mb-md ${className}`}>
      <p>{message}</p>
      {onClear && (
        <button 
          className="text-sm underline mt-xs cursor-pointer" 
          onClick={onClear}
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

/**
 * Confirmation dialog component
 */
const ConfirmationDialog: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-surface p-md rounded-md shadow-lg max-w-sm w-full">
      <p className="mb-md">{message}</p>
      <div className="flex justify-end gap-sm">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  </div>
);

/**
 * DashboardActions component
 * 
 * Displays action buttons for the dashboard and handles action execution,
 * confirmations, and error states.
 * 
 * @param props - Component props
 * @returns React component
 */
const DashboardActions: React.FC<DashboardActionsProps> = ({
  customStyle = {},
  className = '',
  showPlayButton = true,
  showShopButton = true,
  showStudioButton = true,
  isShipSelected,
  selectedShipId,
  customActions = [],
  onPlay,
  onShop,
  onStudio,
  onError,
  isLoading = false,
  error = null,
  onErrorClear,
  showStatus = true,
  noShipMessage = "You need to select a ship to play. Please choose one from your collection.",
  useButtonGroup = true,
}) => {
  // Navigation
  const navigate = useNavigate();
  
  // User context
  const { user } = useUserContext();
  
  // Local state
  const [actionStatus, setActionStatus] = useState<ActionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(error);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<DashboardActionItem | null>(null);
  
  // Determine if a ship is selected from props or context
  const hasShipSelected = isShipSelected !== undefined
    ? isShipSelected
    : !!user.active_ship_id;
  
  // Get selected ship ID from props or context
  const activeShipId = selectedShipId !== undefined 
    ? selectedShipId 
    : user.active_ship_id;
  
  /**
   * Handle error occurrence
   */
  const handleError = (message: string) => {
    setActionStatus('error');
    setStatusMessage(message);
    
    if (onError) {
      onError(message);
    }
  };
  
  /**
   * Clear status message
   */
  const clearStatusMessage = () => {
    setStatusMessage(null);
    setActionStatus('idle');
    
    if (onErrorClear && actionStatus === 'error') {
      onErrorClear();
    }
  };
  
  /**
   * Execute an action with error handling
   */
  const executeAction = async (action: DashboardActionItem) => {
    try {
      setActionStatus('loading');
      
      if (action.confirmMessage && !isConfirmOpen) {
        setPendingAction(action);
        setIsConfirmOpen(true);
        return;
      }
      
      // Reset confirmation state
      setIsConfirmOpen(false);
      setPendingAction(null);
      
      await action.handler();
      
      setActionStatus('success');
    } catch (err) {
      console.error(`Error executing ${action.type} action:`, err);
      handleError(`Failed to ${action.type}. Please try again.`);
    }
  };
  
  /**
   * Handle play game action
   */
  const handlePlay = async () => {
    if (!hasShipSelected) {
      handleError(noShipMessage);
      return;
    }
    
    if (onPlay) {
      await onPlay();
    } else {
      navigate('/game');
    }
  };
  
  /**
   * Handle shop navigation
   */
  const handleShop = async () => {
    if (onShop) {
      await onShop();
    } else {
      navigate('/shop');
    }
  };
  
  /**
   * Handle pixel studio navigation
   */
  const handleStudio = async () => {
    if (onStudio) {
      await onStudio();
    } else {
      navigate('/pixel');
    }
  };
  
  /**
   * Cancel pending confirmation
   */
  const cancelConfirmation = () => {
    setIsConfirmOpen(false);
    setPendingAction(null);
    setActionStatus('idle');
  };
  
  /**
   * Confirm pending action
   */
  const confirmAction = async () => {
    if (pendingAction) {
      await executeAction(pendingAction);
    }
  };
  
  // Create default actions
  const defaultActions: DashboardActionItem[] = [];
  
  if (showPlayButton) {
    defaultActions.push({
      type: 'play',
      label: 'Play Game',
      handler: handlePlay,
      disabled: !hasShipSelected,
      variant: hasShipSelected ? 'primary' : 'secondary',
      customStyle: { minWidth: '120px' },
    });
  }
  
  if (showShopButton) {
    defaultActions.push({
      type: 'shop',
      label: 'Shop',
      handler: handleShop,
      variant: 'secondary',
      customStyle: { minWidth: '120px' },
    });
  }
  
  if (showStudioButton) {
    defaultActions.push({
      type: 'studio',
      label: 'Pixel Studio',
      handler: handleStudio,
      variant: 'secondary',
      customStyle: { minWidth: '120px' },
    });
  }
  
  // Combine default and custom actions
  const allActions = [...defaultActions, ...customActions];
  
  return (
    <div 
      className={`mb-md animate-fade-in ${className}`}
      style={customStyle}
    >
      {/* Confirmation dialog */}
      {isConfirmOpen && pendingAction && (
        <ConfirmationDialog 
          message={pendingAction.confirmMessage || 'Are you sure?'}
          onConfirm={confirmAction}
          onCancel={cancelConfirmation}
        />
      )}
      
      {/* Status message */}
      {showStatus && (statusMessage || error) && (
        <ActionStatusMessage 
          status={actionStatus}
          message={statusMessage || error}
          onClear={clearStatusMessage}
        />
      )}
      
      {/* No ship selected warning */}
      {showPlayButton && !hasShipSelected && !statusMessage && (
        <div className="text-error text-center mb-md">
          {noShipMessage}
        </div>
      )}
      
      {/* Action buttons */}
      <div className={`flex ${useButtonGroup ? 'flex-wrap' : 'flex-col'} gap-md justify-center`}>
        {allActions.map((action, index) => (
          <Button
            key={`${action.type}-${index}`}
            variant={action.variant || 'secondary'}
            onClick={() => executeAction(action)}
            disabled={action.disabled || isLoading || actionStatus === 'loading'}
            customStyle={action.customStyle}
          >
            {action.icon && <span className="mr-xs">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardActions;

