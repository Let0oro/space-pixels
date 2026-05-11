/**
 * Types for the Rankings component — aligned with Rankings.tsx implementation
 */

import { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';
export type RankingsTab = 'all' | 'following';

export interface RankData {
  id: number;
  name: string;
  points: number;
  position?: number;
  isFollowing?: boolean;
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

export interface RankingsSortOptions {
  field: 'points' | 'name';
  direction: SortDirection;
}

export interface RankingsProps {
  rankings?: RankData[];
  following?: RankData[];
  currentUserName?: string;
  currentUserId?: number;
  initialTab?: RankingsTab;
  initialSort?: RankingsSortOptions;
  allowSorting?: boolean;
  showTabs?: boolean;
  showPagination?: boolean;
  pagination?: { page: number; pageSize: number; total: number };
  title?: string;
  isLoading?: boolean;
  error?: string | null;
  onErrorClear?: () => void;
  onPlayerClick?: (player: RankData) => void;
  onFollowToggle?: (player: RankData, isFollowing: boolean) => void;
  onSortChange?: (sort: RankingsSortOptions) => void;
  onTabChange?: (tab: RankingsTab) => void;
  onPageChange?: (page: number) => void;
  maxHeight?: string;
  highlightCurrentUser?: boolean;
  emptyStateContent?: ReactNode;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  renderRankItem?: (player: RankData, index: number) => ReactNode;
  customStyle?: React.CSSProperties;
  className?: string;
}
