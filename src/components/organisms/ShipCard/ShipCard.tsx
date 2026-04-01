import React from 'react';

interface ShipProfile {
    name: string;
    id: number;
    pixels: string[];
    store_id: number;
    ship_id: number;
    price: number;
    following_id: number[];
}

interface ShipCardProps {
    ship: ShipProfile;
}

const ShipCard: React.FC<ShipCardProps> = ({ ship }) => {
    return (
        <div style={{ padding: '1rem', border: '1px solid #334155', borderRadius: '4px', marginBottom: '0.5rem', backgroundColor: '#0f172a' }}>
            <strong>{ship.name}</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Price: {ship.price} | Store ID: {ship.store_id}</p>
        </div>
    );
};

export default ShipCard;
