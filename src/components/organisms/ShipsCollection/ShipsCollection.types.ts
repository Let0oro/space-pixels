import React from 'react';

export type ShipStatus = 'selected';

export interface StatusLegendItem {
  status: ShipStatus;
  label: string;
  className: string;
}

export interface ShipsCollectionProps {
  customStyle?: React.CSSProperties;
  className?: string;
  ships?: any[];
  onShipSelect?: (shipId: number) => void;
  showLegend?: boolean;
  title?: string;
  isLoading?: boolean;
  error?: string | null;
  onErrorClear?: () => void;
  emptyStateContent?: React.ReactNode;
  activeShipId?: number;
  showCreateButton?: boolean;
  onCreateShip?: () => void;
}
