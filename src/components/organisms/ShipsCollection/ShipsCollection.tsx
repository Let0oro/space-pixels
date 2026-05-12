import React, { Suspense, useState } from 'react';
import { lazy } from 'react';
import { useUserContext } from '../../../context/userContext';
import { Button } from '../../atoms/Button';
import { 
  ShipsCollectionProps, 
  StatusLegendItem,
} from './ShipsCollection.types';

// Lazy-loaded components
const ShipsList = lazy(() => import("../../UserMain/ShipList"));

/**
 * Status legend items configuration
 */
const STATUS_LEGEND_ITEMS: StatusLegendItem[] = [
  { 
    status: 'selected', 
    label: 'Current selected', 
    className: 'border-primary p-sm rounded-sm border-2' 
  },
];

/**
 * Ship status legend component
 */
const ShipStatusLegend: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-wrap gap-sm justify-center items-center p-md text-sm ${className}`}>
    <span>Legend: </span>
    {STATUS_LEGEND_ITEMS.map((item) => (
      <span key={item.status} className={item.className}>
        {item.label}
      </span>
    ))}
  </div>
);

/**
 * Loading indicator for ships
 */
const ShipsLoadingIndicator: React.FC = () => (
  <div className="flex justify-center items-center p-md animate-pulse">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    <p className="ml-sm">Loading ships...</p>
  </div>
);

/**
 * Empty state for no ships
 */
const EmptyShipsState: React.FC<{ onCreateShip?: () => void }> = ({ onCreateShip }) => (
  <div className="text-center p-md">
    <p className="text-muted mb-md">You don't have any ships yet.</p>
    {onCreateShip ? (
      <Button variant="primary" onClick={onCreateShip}>
        Create Your First Ship
      </Button>
    ) : (
      <p className="text-sm">Create your first ship or visit the shop!</p>
    )}
  </div>
);

/**
 * ShipsCollection component
 * 
 * Displays the user's collection of ships with a status legend
 * and handles loading states.
 * 
 * @param props - Component props
 * @returns React component
 */
const ShipsCollection: React.FC<ShipsCollectionProps> = ({
  customStyle = {},
  className = '',
  ships: propShips,
  onShipSelect: _onShipSelect,
  showLegend = true,
  title = "Your Ships Collection",
  isLoading: propIsLoading,
  error: propError,
  onErrorClear,
  emptyStateContent,
  activeShipId,
  showCreateButton = true,
  onCreateShip,
}) => {
  // Get data from context if not provided as props
  const { user, ships: contextShips } = useUserContext();
  
  // Local state
  const [error, setError] = useState<string | null>(propError || null);
  
  // Use props ships if provided, otherwise use context ships
  const ships = propShips || contextShips;
  
  // Use props loading state if provided
  const isLoading = propIsLoading !== undefined ? propIsLoading : false;
  
  // Use props active ship ID if provided, otherwise use context
  const selectedShipId = activeShipId !== undefined ? activeShipId : user.active_ship_id;
  
  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
    if (onErrorClear) {
      onErrorClear();
    }
  };
  
  return (
    <section 
      className={`bg-surface rounded-md shadow-md p-md mb-md animate-fade-in ${className}`}
      style={customStyle}
    >
      <h3 className="text-lg font-medium mb-sm">{title}</h3>
      
      {/* Error message */}
      {error && (
        <div className="bg-error-light text-error p-sm rounded-sm mb-md">
          <p>{error}</p>
          <button 
            className="text-sm text-primary mt-xs"
            onClick={clearError}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Ships content */}
      {isLoading ? (
        <ShipsLoadingIndicator />
      ) : (
        <>
          {/* No ships message */}
          {(!ships || ships.length === 0) && !error ? (
            emptyStateContent || <EmptyShipsState onCreateShip={onCreateShip} />
          ) : (
            // Ships list
            <Suspense fallback={<ShipsLoadingIndicator />}>
              <ShipsList
                user={user}
                ships={ships}
                player_selected={selectedShipId || 0}
              />
            </Suspense>
          )}
          
          {/* Status legend */}
          {showLegend && ships && ships.length > 0 && <ShipStatusLegend />}
          
          {/* Create ship button */}
          {!!ships && ships.length > 0 && showCreateButton && (
            <div className="text-center mt-md">
              <Button 
                variant="secondary" 
                onClick={onCreateShip}
                customStyle={{ minWidth: '180px' }}
              >
                Create New Ship
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ShipsCollection;

