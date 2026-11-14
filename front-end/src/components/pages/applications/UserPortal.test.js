import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import UserPortal, { applicationState, timelineStep } from './UserPortal';
import { useSession } from '../../auth/SessionProvider';
jest.mock('../../auth/SessionProvider', () => ({ useSession: jest.fn() }));
jest.mock('./RSVPForm', () => props => <button onClick={() => props.setRSVPStatus('yes')}>Test RSVP confirmation</button>);
let container, root;
const profile = { _id: 'hacker', firstName: 'Alex', lastName: 'Hacker', email: 'alex@example.edu', status: 'Not Applied', acceptedRSVP: 'n/a' };
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); delete process.env.REACT_APP_APPLICATION_FORM; });
function render(user = profile, route = '/portal?tab=application', api = {}) {
  useSession.mockReturnValue({ user, api, signOut: jest.fn() });
  act(() => root.render(<MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><UserPortal /></MemoryRouter>));
}
test.each(['Not Applied', 'Applied', 'Waitlisted', 'Accepted', 'Rejected'])('uses the real %s application state', status => {
  render({ ...profile, status });
  expect(container.querySelector('[aria-label="Application status"]').textContent).toContain(applicationState({ ...profile, status }).label);
  expect(Boolean(container.textContent.includes('Test RSVP confirmation'))).toBe(status === 'Accepted');
});
test('information navigation opens the application and the form is unavailable until configured', () => {
  render(profile, '/portal');
  expect(container.textContent).toContain('meadow, Alex');
  act(() => Array.from(container.querySelectorAll('button')).find(button => button.textContent.includes('View my application')).click());
  expect(container.textContent).toContain('Applications are coming soon.');
  expect(container.querySelector('nav a[aria-current]').textContent).toBe('Application');
});
test('configured form opens securely and never marks an application as submitted', () => {
  process.env.REACT_APP_APPLICATION_FORM = 'https://example.com/application';
  render();
  const link = container.querySelector('a[href="https://example.com/application"]');
  expect(link.rel).toBe('noopener noreferrer');
  expect(container.querySelector('[aria-label="Application status"]').textContent).toContain('Not applied');
});
test('refresh displays the server decision and reports failures without losing it', async () => {
  const api = { get: jest.fn().mockResolvedValueOnce({ data: { ...profile, status: 'Waitlisted' } }).mockRejectedValueOnce(new Error('Offline')) };
  render(profile, undefined, api);
  const refresh = () => Array.from(container.querySelectorAll('button')).find(button => button.textContent.includes('Refresh status')).click();
  await act(async () => refresh());
  expect(api.get).toHaveBeenCalledWith('/users/me');
  expect(container.querySelector('[aria-label="Application status"]').textContent).toContain('Waitlisted');
  await act(async () => refresh());
  expect(container.querySelector('[role="alert"]').textContent).toContain('couldn’t refresh');
  expect(container.querySelector('[aria-label="Application status"]').textContent).toContain('Waitlisted');
});
test('successful RSVP replaces the form with attendance confirmation', () => {
  render({ ...profile, status: 'Accepted' });
  act(() => Array.from(container.querySelectorAll('button')).find(button => button.textContent === 'Test RSVP confirmation').click());
  expect(container.textContent).toContain('Attendance confirmed');
  expect(container.textContent).not.toContain('Test RSVP confirmation');
  expect(container.querySelectorAll('.portal-progress .complete')).toHaveLength(4);
});
test('accepted hackers are placed on the RSVP progress step', () => {
  render({ ...profile, status: 'Accepted' });
  expect(container.querySelector('.portal-progress [aria-current="step"]').textContent).toContain('RSVP');
});
test('declined RSVP and unknown states are not represented as pending applications', () => {
  expect(applicationState({ status: 'Accepted', acceptedRSVP: 'no' }).label).toBe('Offer declined');
  expect(applicationState({ status: 'unexpected' }).label).toBe('Status unavailable');
});
test.each([
  ['Not Applied', 'n/a', 0], ['Applied', 'n/a', 1], ['Waitlisted', 'n/a', 2],
  ['Rejected', 'n/a', 2], ['Accepted', 'n/a', 3], ['Accepted', 'yes', 3], ['Accepted', 'no', 3], ['unknown', 'n/a', -1],
])('timeline follows %s / %s without inventing event attendance', (status, acceptedRSVP, expected) => {
  const user = { ...profile, status, acceptedRSVP };
  expect(timelineStep(user)).toBe(expected);
  render(user, '/portal');
  const timeline = container.querySelector('[aria-label="Your hacker timeline"]');
  expect(timeline.querySelectorAll('.is-complete')).toHaveLength(Math.max(0, expected));
  expect(timeline.querySelectorAll('[aria-current="step"]')).toHaveLength(expected < 0 ? 0 : 1);
});
