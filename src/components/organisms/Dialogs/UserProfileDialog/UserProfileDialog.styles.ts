
import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
    dialogOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    dialogContent: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '8px', minWidth: '300px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' },
    closeButton: { background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }
};
