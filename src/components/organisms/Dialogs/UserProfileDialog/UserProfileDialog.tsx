import { useEffect, useState } from 'react';
import DialogBase from '../../../molecules/DialogBase/DialogBase';
import { Button } from '../../../atoms/Button';
import { styles } from './UserProfileDialog.styles';
import { FrontFetch } from '../../../../utils/FrontFetch';
import { useUserContext } from '../../../../context/userContext';
import shadowPixel from '../../../../utils/shadowPixel';
import ShipCard from '../../ShipCard/ShipCard';

export interface UserProfileDialogProps {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean;
  
  /**
   * Callback function when the dialog is closed
   */
  onClose: () => void;
  
  /**
   * User ID of the profile to display
   */
  userId: number;
}

interface ShipProfile {
  name: string;
  id: number;
  pixels: string[];
  store_id: number;
  ship_id: number;
  price: number;
  following_id: number[];
}

/**
 * UserProfileDialog component - Dialog for displaying a user profile
 * 
 * @param isOpen - Whether the dialog is open
 * @param onClose - Callback function when the dialog is closed
 * @param userId - User ID of the profile to display
 */
const UserProfileDialog = ({
  isOpen,
  onClose,
  userId,
}: UserProfileDialogProps) => {
  const { user, setUser, setLikes } = useUserContext();
  const [profileShips, setProfileShips] = useState<ShipProfile[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError]

