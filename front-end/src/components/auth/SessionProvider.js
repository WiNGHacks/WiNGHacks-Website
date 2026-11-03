import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ClerkProvider, useAuth, useClerk } from '@clerk/react';
import { createApiClient } from '../api';

const SessionContext = createContext({
  isLoaded: true, isSignedIn: false, user: null, error: null,
  configured: false, api: null, signOut: async () => {},
});

function ClerkSession({ children }) {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const { signOut } = useClerk();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [profile, setProfile] = useState({ sessionId: null, user: null, error: null });
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const controller = new AbortController();
    api.get('/users/me', { signal: controller.signal })
      .then(({ data }) => setProfile({ sessionId, user: data, error: null }))
      .catch(error => {
        if (!controller.signal.aborted) setProfile({ sessionId, user: null,
          error: error.response?.data?.message || 'Unable to load your profile. Please try again.' });
      });
    return () => controller.abort();
  }, [api, isLoaded, isSignedIn, userId, sessionId]);
  const current = isSignedIn && profile.sessionId === sessionId;
  return <SessionContext.Provider value={{
    configured: true,
    isLoaded: Boolean(isLoaded && (!isSignedIn || current)),
    isSignedIn: Boolean(isSignedIn),
    user: current ? profile.user : null,
    error: current ? profile.error : null,
    api,
    signOut: () => signOut({ redirectUrl: '/login' }),
  }}>{children}</SessionContext.Provider>;
}

export default function SessionProvider({ children }) {
  const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
  // Keep public pages and custom UI previews usable before Clerk is configured.
  // Protected routes remain inaccessible; there is no legacy auth fallback.
  if (!publishableKey) return <SessionContext.Provider value={{
    configured: false, isLoaded: true, isSignedIn: false, user: null, error: null,
    api: null, signOut: async () => {},
  }}>{children}</SessionContext.Provider>;
  return <ClerkProvider publishableKey={publishableKey}>
    <ClerkSession>{children}</ClerkSession>
  </ClerkProvider>;
}

export const useSession = () => useContext(SessionContext);
export const useApi = () => useSession().api;
