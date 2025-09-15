import React from 'react';

const UnhaunterGamePage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <iframe
        src="/games/unhaunter/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Unhaunter Game"
      />
    </div>
  );
};

export default UnhaunterGamePage;
