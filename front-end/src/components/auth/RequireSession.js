import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from './SessionProvider';

export default function RequireSession({ children, admin = false }) {
  const { configured, isLoaded, isSignedIn, user, error, signOut } = useSession();
  if (!configured) return <p role="status">Account access is temporarily unavailable.</p>;
  if (!isLoaded) return <p role="status">Loading your account…</p>;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (error) return <div role="alert"><p>{error}</p>
    <button onClick={() => window.location.reload()}>Try again</button>
    <button onClick={signOut}>Sign out</button></div>;
  if (!user || (admin && !user.admin)) return <p role="alert">You do not have permission to access this page.</p>;
  return children;
}
