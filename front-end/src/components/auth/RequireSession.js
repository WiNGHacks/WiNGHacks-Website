import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from './SessionProvider';
import LoadingScreen from './LoadingScreen';

export default function RequireSession({ children, admin = false }) {
  const { configured, isLoaded, isSignedIn, user, error, signOut } = useSession();
  if (!configured) return <div className="session-screen" role="status"><p>Account access is temporarily unavailable.</p></div>;
  if (!isLoaded) return <LoadingScreen message="Loading your account…" />;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (error) return <div className="session-screen" role="alert"><p>{error}</p>
    <button onClick={() => window.location.reload()}>Try again</button>
    <button onClick={signOut}>Sign out</button></div>;
  if (!user || (admin && !user.admin)) return <div className="session-screen" role="alert"><p>You do not have permission to access this page.</p></div>;
  return children;
}
