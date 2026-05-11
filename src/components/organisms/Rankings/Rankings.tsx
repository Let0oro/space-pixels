import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../atoms/Button';
import { useUserContext } from '../../../context/userContext';
import {
  RankingsProps,
  RankData,
  RankingsTab,
  RankingsSortOptions,
  SortDirection
} from './Rankings.types';

/**
 * Loading indicator for rankings
 */
const RankingsLoadingIndicator: React.FC = () => (
  <div className="flex justify-center items-center p-md animate-pulse">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    <p className="ml-sm">Loading rankings...</p>
  </div>
);

/**
 * Empty state for no rankings
 */
const EmptyRankingsState: React.FC<{ message?: string }> = ({
  message = "No rankings available yet."
}) => (
  <div className="text-center p-md text-muted">
    <p>{message}</p>
  </div>
);

/**
 * Tab button component
 */
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={`flex-1 py-sm px-md text-center ${active
        ? 'border-b-2 border-primary text-primary font-bold'
        : 'text-muted'
      }`}
    onClick={onClick}
  >
    {children}
  </button>
);

/**
 * Sort button component
 */
const SortButton: React.FC<{
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, direction, onClick, children }) => (
  <button
    className={`px-sm py-xs text-sm ${active ? 'font-bold text-primary' : 'text-muted'
      }`}
    onClick={onClick}
  >
    {children}
    {active && (
      <span className="ml-xs">
        {direction === 'asc' ? '↑' : '↓'}
      </span>
    )}
  </button>
);

/**
 * Rank item component
 */
const RankItem: React.FC<{
  player: RankData;
  isCurrentUser: boolean;
  onFollowToggle?: (player: RankData, isFollowing: boolean) => void;
  onPlayerClick?: (player: RankData) => void;
  position: number
}> = ({
  player,
  isCurrentUser,
  onFollowToggle,
  onPlayerClick,
  position
}) => {
    const positionClass =
      position === 1 ? 'text-warning font-bold' :
        position === 2 ? 'text-secondary font-bold' :
          position === 3 ? 'text-primary font-bold' :
            'text-muted';

    return (
      <div
        className={`
        flex items-center justify-between p-sm mb-sm rounded-sm
        ${isCurrentUser ? 'bg-primary-light' : 'hover:bg-surface'}
        ${onPlayerClick ? 'cursor-pointer' : ''}
        border-b border-color-border
      `}
        onClick={() => onPlayerClick && onPlayerClick(player)}
      >
        <div className="flex items-center gap-sm">
          <span className={`w-8 text-center ${positionClass}`}>
            {position}
          </span>

          {player.avatarUrl && (
            <img
              src={player.avatarUrl}
              alt={player.name}
              className="w-8 h-8 rounded-full"
            />
          )}

          <span className={isCurrentUser ? 'font-bold' : ''}>
            {player.name}
          </span>

          {isCurrentUser && (
            <span className="text-xs bg-primary text-white px-xs rounded-sm ml-sm">
              You
            </span>
          )}
        </div>

        <div className="flex items-center gap-md">
          <span className="font-bold">{player.points} pts</span>

          {!isCurrentUser && onFollowToggle && (
            <Button
              variant={player.isFollowing ? 'secondary' : 'link'}
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(player, !player.isFollowing);
              }}
              customStyle={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
            >
              {player.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
      </div>
    );
  };

/**
 * Pagination component
 */
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-sm mt-md">
    <Button
      variant="secondary"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 1}
      customStyle={{ padding: '0.25rem 0.5rem' }}
    >
      &laquo; Prev
    </Button>

    <div className="flex items-center">
      Page {currentPage} of {totalPages}
    </div>

    <Button
      variant="secondary"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
      customStyle={{ padding: '0.25rem 0.5rem' }}
    >
      Next &raquo;
    </Button>
  </div>
);

/**
 * Rankings component
 * 
 * Displays player rankings with sorting, filtering, and pagination options.
 * 
 * @param props - Component props
 * @returns React component
 */
const Rankings: React.FC<RankingsProps> = ({
  customStyle = {},
  className = '',
  rankings = [],
  following = [],
  currentUserName,
  currentUserId,
  initialTab = 'all',
  initialSort = { field: 'points', direction: 'desc' },
  allowSorting = true,
  showTabs = true,
  showPagination = false,
  pagination = { page: 1, pageSize: 10, total: 0 },
  title = 'Rankings',
  isLoading = false,
  error = null,
  onErrorClear,
  onPlayerClick,
  onFollowToggle,
  onSortChange,
  onTabChange,
  onPageChange,
  maxHeight = '600px',
  highlightCurrentUser = true,
  emptyStateContent,
  headerContent,
  footerContent,
  renderRankItem,
}) => {
  // Get user context for additional data
  const { user } = useUserContext();

  // Local state
  const [activeTab, setActiveTab] = useState<RankingsTab>(initialTab);
  const [sortOptions, setSortOptions] = useState<RankingsSortOptions>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(pagination.page);

  // Use provided IDs/names or fall back to context
  const userName = currentUserName || user.name;
  const userId = currentUserId || user.id;

  // Update page when pagination props change
  useEffect(() => {
    setCurrentPage(pagination.page);
  }, [pagination.page]);

  // Calculate total pages — auto-compute from data length when pagination.total is 0
  const effectiveTotal = pagination.total > 0 ? pagination.total : (activeTab === 'following' ? following.length : rankings.length);
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pagination.pageSize));

  // Handle tab change
  const handleTabChange = (tab: RankingsTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Handle sort change
  const handleSortChange = (field: 'points' | 'name') => {
    const direction: SortDirection =
      sortOptions.field === field && sortOptions.direction === 'desc' ? 'asc' : 'desc';
    const newSort: RankingsSortOptions = { field, direction };
    setSortOptions(newSort);
    if (onSortChange) onSortChange(newSort);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Process rankings data
  const processedRankings = useMemo(() => {
    let data: RankData[] = [];

    // Select data based on active tab
    if (activeTab === 'following') {
      data = [...following];
    } else {
      data = [...rankings];
    }

    // Add position if not present
    data = data.map((player, index) => ({
      ...player,
      position: player.position || index + 1,
      isCurrentUser: highlightCurrentUser &&
        (player.id === userId || player.name === userName),
    }));

    // Sort locally if no external sort handler
    if (!onSortChange) {
      data.sort((a, b) => {
        const dir = sortOptions.direction === 'asc' ? 1 : -1;
        if (sortOptions.field === 'name') return dir * a.name.localeCompare(b.name);
        return dir * ((a.points > b.points) ? 1 : (a.points < b.points) ? -1 : 0);
      });
    }

    // Apply pagination — always slice when multiple pages exist
    if (totalPages > 1 && !onPageChange) {
      const start = (currentPage - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      data = data.slice(start, end);
    }

    return data;
  }, [
    activeTab,
    following,
    rankings,
    sortOptions,
    currentPage,
    pagination.pageSize,
    onSortChange,
    onPageChange,
    userId,
    userName,
    highlightCurrentUser,
  ]);

  // Empty state messages
  const emptyMessages: Record<RankingsTab, string> = {
    all: 'No rankings available yet.',
    following: "You're not following anyone yet.",
  };

  return (
    <div
      className={`bg-surface rounded-md shadow-md p-md animate-fade-in mb-lg ${className}`}
      style={{ ...customStyle }}
    >
      <h3 className="text-lg font-medium mb-sm">{title}</h3>

      {/* Error message */}
      {error && (
        <div className="bg-error-light text-error p-sm rounded-sm mb-md">
          <p>{error}</p>
          {onErrorClear && (
            <button
              className="text-sm underline mt-xs cursor-pointer"
              onClick={onErrorClear}
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Header content */}
      {headerContent}

      {/* Tabs */}
      {showTabs && (
        <div className="flex mb-md border-b border">
          <TabButton
            active={activeTab === 'all'}
            onClick={() => handleTabChange('all')}
          >
            Top Players
          </TabButton>

          <TabButton
            active={activeTab === 'following'}
            onClick={() => handleTabChange('following')}
          >
            Following
          </TabButton>
        </div>
      )}

      {/* Sort controls */}
      {allowSorting && (
        <div className="flex justify-end mb-sm">
          <div className="flex gap-sm text-sm">
            <span className="text-muted">Sort by:</span>

            <SortButton
              active={sortOptions.field === 'points'}
              direction={sortOptions.direction}
              onClick={() => handleSortChange('points')}
            >
              Points
            </SortButton>

            <SortButton
              active={sortOptions.field === 'name'}
              direction={sortOptions.direction}
              onClick={() => handleSortChange('name')}
            >
              Name
            </SortButton>
          </div>
        </div>
      )}

      {/* Rankings list */}
      <div
        className="overflow-auto"
        style={{ maxHeight }}
      >
        {isLoading ? (
          <RankingsLoadingIndicator />
        ) : processedRankings.length === 0 ? (
          emptyStateContent || (
            <EmptyRankingsState message={emptyMessages[activeTab]} />
          )
        ) : (
          <div>
            {processedRankings.map((player, index) => (
              renderRankItem ? (
                renderRankItem(player, index)
              ) : (
                <RankItem
                  key={`${player.id}-${index}`}
                  player={player}
                  isCurrentUser={!!player.isCurrentUser}
                  onFollowToggle={onFollowToggle}
                  onPlayerClick={onPlayerClick}
                  position={player.position ?? index + 1}
                />
              )
            ))}
          </div>
        )}
      </div>

      {/* Pagination — auto-shown when more than one page */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Footer content */}
      {footerContent}
    </div>
  );
};

export default Rankings;

