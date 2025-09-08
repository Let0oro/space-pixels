/**
 * Types for the Rankings component
 */

import { ReactNode } from 'react';

/**
 * Represents a single ranking entry in the rankings list
 */
export interface RankData {
  /** Unique identifier for the rank entry */
  id: string;
  /** Username of the ranked user */
  username: string;
  /** URL to the user's avatar image */
  avatarUrl?: string;
  /** User's current rank position */
  position: number;
  /** User's score or points */
  score: number;
  /** Number of ships the user has */
  shipCount: number;
  /** Number of followers the user has */
  followerCount: number;
  /** Whether the current user is following this ranked user */
  isFollowing: boolean;
  /** Whether this entry represents the current user */
  isCurrentUser: boolean;
  /** Timestamp of when the user was last active */
  lastActive?: Date;
  /** Optional additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Sort direction for rankings
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Available tabs for the Rankings component
 */
export type RankingsTab = 'global' | 'friends' | 'weekly' | 'monthly';

/**
 * Available sort options for rankings
 */
export interface RankingsSortOptions {
  /** Sort by user score */
  score: SortDirection;
  /** Sort by number of ships */
  shipCount: SortDirection;
  /** Sort by number of followers */
  followerCount: SortDirection;
  /** Sort by recent activity */
  activity: SortDirection;
}

/**
 * Configuration for pagination
 */
export interface PaginationConfig {
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Maximum number of page buttons to show */
  maxPageButtons?: number;
  /** Whether to show the first/last page buttons */
  showFirstLastButtons?: boolean;
  /** Whether to show previous/next buttons */
  showPrevNextButtons?: boolean;
}

/**
 * Event handlers for Rankings component
 */
export interface RankingsEventHandlers {
  /** Called when a user is followed/unfollowed */
  onToggleFollow: (userId: string, isFollowing: boolean) => void;
  /** Called when pagination changes */
  onPageChange: (newPage: number) => void;
  /** Called when sort option changes */
  onSortChange: (sortField: keyof RankingsSortOptions, direction: SortDirection) => void;
  /** Called when tab changes */
  onTabChange: (tab: RankingsTab) => void;
  /** Called when a user profile is clicked */
  onUserClick?: (userId: string) => void;
  /** Called when the refresh button is clicked */
  onRefresh?: () => void;
}

/**
 * Visual customization options for the Rankings component
 */
export interface RankingsCustomization {
  /** Custom class name for the component root */
  className?: string;
  /** Whether to highlight the current user in the rankings */
  highlightCurrentUser?: boolean;
  /** Whether to show the refresh button */
  showRefreshButton?: boolean;
  /** Whether to show the sort options */
  showSortOptions?: boolean;
  /** Custom labels for the tabs */
  tabLabels?: Record<RankingsTab, string>;
  /** Whether to apply a compact layout */
  compactLayout?: boolean;
  /** Custom empty state content */
  emptyStateContent?: ReactNode;
  /** Custom loading state content */
  loadingContent?: ReactNode;
  /** Custom error state content */
  errorContent?: ReactNode;
}

/**
 * Props for the Rankings component
 */
export interface RankingsProps {
  /** Array of ranking data to display */
  data: RankData[];
  /** Current selected tab */
  activeTab: RankingsTab;
  /** Available tabs to display */
  availableTabs?: RankingsTab[];
  /** Current sort option and direction */
  sortOption: {
    field: keyof RankingsSortOptions;
    direction: SortDirection;
  };
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Pagination configuration */
  pagination: PaginationConfig;
  /** Event handlers */
  handlers: RankingsEventHandlers;
  /** Visual customization options */
  customization?: RankingsCustomization;
  /** Title for the rankings section */
  title?: string;
  /** Subtitle for the rankings section */
  subtitle?: string;
  /** Whether the component is in a restricted mode (e.g. demo/preview) */
  isRestricted?: boolean;
}

