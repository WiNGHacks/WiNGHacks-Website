import React from 'react';

export default function LoadingScreen({ message = 'Loading…' }) {
  return <div className="session-screen" role="status" aria-live="polite">
    <span className="session-loading-dot" aria-hidden="true" />
    <p>{message}</p>
  </div>;
}
