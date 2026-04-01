import { useEffect, useState } from 'react';
import DialogBase from '@/components/molecules/DialogBase/DialogBase';
import Button from '@/components/atoms/Button/Button';
import ShipCard from '@/components/organisms/ShipCard/ShipCard';

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
    const [profileShips] = useState<ShipProfile[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(false);
    }, [isOpen, userId]);

    if (!isOpen) return null;

    return (
        <DialogBase isOpen={isOpen} onClose={onClose} title="User Profile">
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h3>Profile Ships</h3>
                    {profileShips?.map((ship) => (
                        <ShipCard key={ship.id} ship={ship} />
                    ))}
                    <div style={{ marginTop: '1rem' }}>
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            )}
        </DialogBase>
    );
};

export default UserProfileDialog;
