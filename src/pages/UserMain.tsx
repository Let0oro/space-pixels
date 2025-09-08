import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontFetch } from '../utils/FrontFetch';
import { useUserContext } from '../context/userContext';
import { useDialogContext } from '../context/dialogContext';
import useSessionExpired from '../hooks/useSessionExpired';

import {
  DashboardHeader,
  DashboardActions,
  ShipsCollection,
  Rankings
} from '../components/organisms';
import Dialog from '../components/Dialog';

/**
 * UserMain component
 * 
 * Represents the user dashboard page, displaying user info,
 * ships collection, actions, and rankings.
 */
const UserMain: React.FC = () => {
  const navigate = useNavigate();
  const { user, ships, setShips, following, setRank, rank, setFollowing } = useUserContext();
  const { element } = useDialogContext();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFollowingTab, setShowFollowingTab] = useState<'following' | 'ranks'>('following');
  const [newShipFlag, setNewShipFlag] = useState<boolean>(false);

  useSessionExpired();

  useEffect(() => {
    const checkAndFetchData = async () => {
      setIsLoading(true);
      try {
        if (user.id) {
          const followingResp = await FrontFetch.caller({
            name: 'player',
            method: 'get',
            typeMethod: 'followings',
            id: `${user.id}`,
          });
          setFollowing(followingResp);
          const rankResp = await FrontFetch.caller({
            name: 'player',
            method: 'get',
            typeMethod: 'ranks',
          });
          setRank(rankResp);
          const shipsResp = await FrontFetch.caller({
            name: 'ship',
            method: 'get',
            typeMethod: 'usership',
            id: `${user.id}`,
          });
          setShips(shipsResp);
          setErrorMsg(null);
        }
      } catch (error) {
        setErrorMsg("Failed to load user data. Please try again later.");
      }
      setIsLoading(false);
    };

    checkAndFetchData();
  }, [user.id, setFollowing, setRank, setShips, newShipFlag, element?.open]);

  const handlePlayGame = () => {
    if (!user.active_ship_id) {
      setErrorMsg("You need to select a ship to play. Please choose one from your collection.");
      return;
    }
    navigate('/game');
  };

  const handleDismissError = () => setErrorMsg(null);

  return (
    <>
      <Dialog />
      <div className="container">
        <DashboardHeader 
          title={`Welcome back, ${user.name || 'Player'}!`} 
          showCoins={true} 
          showLastLogin={true}
          isLoading={isLoading}
          error={errorMsg}
          onErrorClear={handleDismissError}
        />

        <ShipsCollection
          ships={ships}
          isLoading={isLoading}
          error={errorMsg}
          onErrorClear={handleDismissError}
          activeShipId={user.active_ship_id || 0}
          showCreateButton={true}
          onCreateShip={() => setNewShipFlag(!newShipFlag)}
        />

        <DashboardActions
          showPlayButton={true}
          showShopButton={true}
          showStudioButton={true}
          isShipSelected={!!user.active_ship_id}
          onPlay={handlePlayGame}
          onShop={() => navigate('/shop')}
          onStudio={() => navigate('/pixel')}
          error={errorMsg}
          onErrorClear={handleDismissError}
        />

        <Rankings
          rankings={rank}
          following={following}
          currentUserName={user.name || ''}
          currentUserId={user.id || 0}
          isLoading={isLoading}
          error={errorMsg}
          onErrorClear={handleDismissError}
          showTabs={true}
          title="Player Rankings"
        />
      </div>
    </>
  );
};

export default UserMain;
