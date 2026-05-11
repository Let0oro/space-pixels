import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontFetch } from '../utils/FrontFetch';
import { useUserContext } from '../context/userContext';
import { useDialogContext } from '../context/dialogContext';
import useSessionExpired from '../hooks/useSessionExpired';
import PixelStudio from './PixelStudio';

import {
  DashboardHeader,
  DashboardActions,
  ShipsCollection,
  Rankings,
} from '../components/organisms';
import Dialog from '../components/Dialog';

const UserMain: React.FC = () => {
  const navigate = useNavigate();
  const { user, ships, setShips, rank, setRank } = useUserContext();
  const { element } = useDialogContext();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newShipFlag, setNewShipFlag] = useState<boolean>(false);
  // Canvas visibility — kept mounted to preserve auth session
  const [showStudio, setShowStudio] = useState<boolean>(false);

  useSessionExpired();

  // Fetch user's ships — re-runs on login, new ship, dialog close
  useEffect(() => {
    if (!user.id) return;
    const fetchShips = async () => {
      try {
        const resp = await FrontFetch.caller({
          name: 'ship', method: 'get', typeMethod: 'get', id: `${user.id}`,
        });
        setShips(Array.isArray(resp) ? resp : []);
      } catch {
        setErrorMsg('Failed to load ships. Please try again.');
      }
    };
    fetchShips();
  }, [user.id, newShipFlag, element?.open]);

  // Fetch global rankings — re-runs on every mount (login) and after each game
  // UserMain re-mounts on each navigation, so this covers: login + return from game
  useEffect(() => {
    if (!user.id) return;
    setIsLoading(true);
    const fetchRankings = async () => {
      try {
        const scoreResp = await FrontFetch.caller({
          name: 'score', method: 'get', typeMethod: 'get',
        });
        const arr: { points: number; playername: string }[] = Array.isArray(scoreResp)
          ? scoreResp
          : Object.values(scoreResp as Record<string, { points: number; playername: string }>);
        // Sort desc by points, assign position
        const ranked = [...arr]
          .sort((a, b) => b.points - a.points)
          .map((s, i) => ({ ...s, position: i + 1 }));
        setRank(ranked);
        setErrorMsg(null);
      } catch {
        setErrorMsg('Failed to load rankings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRankings();
  }, [user.id]); // intentionally only user.id — runs fresh on every login/return

  const handleDismissError = () => setErrorMsg(null);

  const handlePlayGame = () => {
    if (!user.active_ship_id) {
      setErrorMsg('You need to select a ship to play. Please choose one from your collection.');
      return;
    }
    navigate('/game');
  };

  return (
    <>
      <Dialog />
      <div className="container">
        <DashboardHeader
          title={`Welcome back, ${user.name || 'Player'}!`}
          showCoins={true}
          isLoading={isLoading && !user.name}
          error={errorMsg}
          onErrorClear={handleDismissError}
        />

        <ShipsCollection
          ships={ships}
          isLoading={isLoading}
          activeShipId={user.active_ship_id || 0}
          showCreateButton={true}
          onCreateShip={() => setShowStudio(true)}
          error={errorMsg}
          onErrorClear={handleDismissError}
        />

        <DashboardActions
          showPlayButton={true}
          showShopButton={true}
          showStudioButton={false}
          isShipSelected={!!user.active_ship_id}
          onPlay={handlePlayGame}
          onShop={() => navigate('/shop')}
        />

        {/* Canvas embebido — siempre montado para mantener sesión, toggle con display */}
        <div style={{ display: showStudio ? 'block' : 'none' }}>
          <div className="bg-surface rounded-md shadow-md p-md mb-md animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 className="text-lg font-medium" style={{ margin: 0 }}>Pixel Studio</h3>
              <button
                onClick={() => setShowStudio(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}
                aria-label="Close studio"
              >
                ✕
              </button>
            </div>
            <PixelStudio title={false} setNewShip={setNewShipFlag} />
          </div>
        </div>

        <Rankings
          rankings={rank.map((s) => ({
            id: s.position ?? 0,
            name: s.playername,
            points: s.points,
            position: s.position,
          }))}
          following={[]}
          currentUserName={user.name || ''}
          currentUserId={user.id || 0}
          isLoading={isLoading}
          title="Player Rankings"
          showTabs={false}
        />
      </div>
    </>
  );
};

export default UserMain;
