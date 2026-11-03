import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireSession from './RequireSession';
import { useSession } from './SessionProvider';
jest.mock('./SessionProvider', () => ({ useSession: jest.fn() }));
let container, root;
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
function renderSession(session, admin = false) {
  useSession.mockReturnValue({ configured: true, isLoaded: true, isSignedIn: true, user: { admin: false }, ...session });
  act(() => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/" element={<RequireSession admin={admin}><p>Private profile</p></RequireSession>} />
      <Route path="/login" element={<p>Custom login</p>} /></Routes>
  </MemoryRouter>));
}
test('signed-out visitors are sent to our custom login', () => {
  renderSession({ isSignedIn: false, user: null });
  expect(container.textContent).toBe('Custom login');
});
test('missing config and loading sessions never render private content', () => {
  renderSession({ configured: false });
  expect(container.textContent).not.toContain('Private profile');
  renderSession({ isLoaded: false });
  expect(container.textContent).toContain('Loading');
});
test('profile errors and non-admin users cannot render admin content', () => {
  renderSession({ error: 'Profile needs linking', user: null }, true);
  expect(container.textContent).toContain('Profile needs linking');
  expect(container.textContent).not.toContain('Private profile');
  renderSession({}, true);
  expect(container.textContent).toContain('do not have permission');
});
test('authorized users can render their portal and current admins can render admin pages', () => {
  renderSession({});
  expect(container.textContent).toBe('Private profile');
  renderSession({ user: { admin: true } }, true);
  expect(container.textContent).toBe('Private profile');
});
