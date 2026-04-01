import React, { ReactNode } from 'react';

interface DialogBaseProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const DialogBase: React.FC<DialogBaseProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '8px', minWidth: '400px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0 }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default DialogBase;
