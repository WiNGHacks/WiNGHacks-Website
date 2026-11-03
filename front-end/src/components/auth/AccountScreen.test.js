import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useSignIn, useSignUp, useClerk } from '@clerk/react';
import { useSession } from './SessionProvider';
import AccountScreen from './AccountScreen';

jest.mock('@clerk/react', () => ({ useSignIn: jest.fn(), useSignUp: jest.fn(), useClerk: jest.fn() }));
jest.mock('./SessionProvider', () => ({ useSession: jest.fn() }));
let root, container, signIn, signUp;
const ok = () => Promise.resolve({ error: null });
const finalize = () => jest.fn(async ({ navigate }) => {
  navigate({ session: { currentTask: null }, decorateUrl: url => url });
  return { error: null };
});
beforeEach(() => {
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  signUp = { status: null, missingFields: [], unverifiedFields: [], password: jest.fn(async () => {
    signUp.status = 'missing_requirements'; signUp.unverifiedFields = ['email_address']; return { error: null };
  }), verifications: { sendEmailCode: jest.fn(ok), verifyEmailCode: jest.fn(async () => { signUp.status = 'complete'; return { error: null }; }) }, finalize: finalize(), reset: jest.fn(ok) };
  signIn = { status: null, supportedSecondFactors: [], password: jest.fn(async () => { signIn.status = 'complete'; return { error: null }; }),
    create: jest.fn(ok), finalize: finalize(), reset: jest.fn(ok),
    mfa: { sendEmailCode: jest.fn(ok), sendPhoneCode: jest.fn(ok), verifyEmailCode: jest.fn(async () => { signIn.status = 'complete'; return { error: null }; }),
      verifyTOTP: jest.fn(async () => { signIn.status = 'complete'; return { error: null }; }), verifyBackupCode: jest.fn(ok) },
    resetPasswordEmailCode: { sendCode: jest.fn(ok), verifyCode: jest.fn(async () => { signIn.status = 'needs_new_password'; return { error: null }; }),
      submitPassword: jest.fn(async () => { signIn.status = 'complete'; return { error: null }; }) },
  };
  useSignIn.mockReturnValue({ signIn, errors: { fields: {} }, fetchStatus: 'idle' });
  useSignUp.mockReturnValue({ signUp, errors: { fields: {} }, fetchStatus: 'idle' });
  useClerk.mockReturnValue({ signOut: jest.fn() });
  useSession.mockReturnValue({ configured: true, isLoaded: true, isSignedIn: false });
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.clearAllMocks(); });
async function render(mode) {
  await act(async () => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/" element={<AccountScreen mode={mode} />} /><Route path="/portal" element={<p>Hacker portal</p>} /></Routes>
  </MemoryRouter>));
}
function fill(name, value) { act(() => Simulate.change(container.querySelector(`[name="${name}"]`), { target: { name, value } })); }
async function submit() { await act(async () => Simulate.submit(container.querySelector('form'))); }
function details(signup = false) {
  if (signup) { fill('firstName', 'Test'); fill('lastName', 'Hacker'); }
  fill('email', signup ? 'test@example.edu' : 'test@example.com'); fill('password', 'test-only-long-password');
}

test('signup uses our labeled fields, then requires email verification before activating a session', async () => {
  await render('signup'); details(true);
  expect(container.querySelector('label[for="account-email"]').textContent).toBe('School email (.edu)');
  expect(container.querySelector('form').checkValidity()).toBe(true);
  await submit();
  expect(signUp.password).toHaveBeenCalledWith({ firstName: 'Test', lastName: 'Hacker', emailAddress: 'test@example.edu', password: 'test-only-long-password' });
  expect(signUp.verifications.sendEmailCode).toHaveBeenCalledTimes(1);
  expect(signUp.finalize).not.toHaveBeenCalled();
  expect(container.textContent).toContain('Verify your email');
  fill('code', '123456'); await submit();
  expect(signUp.verifications.verifyEmailCode).toHaveBeenCalledWith({ code: '123456' });
  expect(container.textContent).toBe('Hacker portal');
});
test('invalid verification codes display an error and never finalize', async () => {
  signUp.verifications.verifyEmailCode.mockResolvedValue({ error: { code: 'form_code_incorrect' } });
  await render('signup'); details(true); await submit(); fill('code', '111111'); await submit();
  expect(container.querySelector('[role="alert"]').textContent).toContain('code doesn’t match');
  expect(signUp.finalize).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(container.querySelector('[role="alert"]'));
});
test.each(['test@gmail.com', 'test@school.edu.evil.com', 'test@school.education'])('signup blocks %s before calling Clerk', async email => {
  await render('signup'); details(true); fill('email', email); await submit();
  expect(signUp.password).not.toHaveBeenCalled();
  expect(container.querySelector('[role="alert"]').textContent).toContain('.edu');
});
test('a failed email send leaves a working resend action without recreating the account', async () => {
  signUp.verifications.sendEmailCode.mockRejectedValueOnce(new Error('network'));
  await render('signup'); details(true); await submit();
  const resend = [...container.querySelectorAll('button')].find(button => button.textContent === 'Send a new code');
  expect(resend.disabled).toBe(false);
  await act(async () => Simulate.click(resend));
  expect(signUp.password).toHaveBeenCalledTimes(1);
  expect(signUp.verifications.sendEmailCode).toHaveBeenCalledTimes(2);
  expect(container.textContent).toContain('Resend in 30s');
});
test('login completes using Clerk and password visibility stays inside our custom form', async () => {
  await render('login'); details();
  act(() => Simulate.click(container.querySelector('[aria-label="Show password"]')));
  expect(container.querySelector('[name="password"]').type).toBe('text');
  await submit();
  expect(signIn.password).toHaveBeenCalledWith({ emailAddress: 'test@example.com', password: 'test-only-long-password' });
  expect(container.textContent).toBe('Hacker portal');
});
test('incorrect passwords do not navigate or activate a session', async () => {
  signIn.password.mockResolvedValue({ error: { code: 'form_password_incorrect' } });
  await render('login'); details(); await submit();
  expect(container.textContent).toContain('email and password don’t match');
  expect(signIn.finalize).not.toHaveBeenCalled();
});
test('a completed previous attempt cannot bypass a fresh password check on login', async () => {
  signIn.status = 'complete';
  signIn.reset.mockImplementation(async () => { signIn.status = null; return { error: null }; });
  signIn.password.mockResolvedValue({ error: { code: 'form_password_incorrect' } });
  await render('login');
  expect(container.querySelector('[name="password"]')).not.toBeNull();
  details(); await submit();
  expect(signIn.reset).toHaveBeenCalledTimes(1);
  expect(signIn.password).toHaveBeenCalledTimes(1);
  expect(signIn.finalize).not.toHaveBeenCalled();
  expect(container.querySelector('[role="alert"]').textContent).toContain('email and password don’t match');
});
test('new-device email verification is completed before login', async () => {
  signIn.password.mockImplementation(async () => { signIn.status = 'needs_client_trust'; signIn.supportedSecondFactors = [{ strategy: 'email_code' }]; return { error: null }; });
  await render('login'); details(); await submit();
  expect(signIn.mfa.sendEmailCode).toHaveBeenCalledTimes(1);
  expect(signIn.finalize).not.toHaveBeenCalled();
  fill('code', '123456'); await submit();
  expect(signIn.mfa.verifyEmailCode).toHaveBeenCalledWith({ code: '123456' });
  expect(container.textContent).toBe('Hacker portal');
});
test('authenticator MFA never bypasses the second factor', async () => {
  signIn.password.mockImplementation(async () => { signIn.status = 'needs_second_factor'; signIn.supportedSecondFactors = [{ strategy: 'totp' }]; return { error: null }; });
  await render('login'); details(); await submit();
  expect(container.textContent).toContain('authenticator app');
  expect(signIn.mfa.sendEmailCode).not.toHaveBeenCalled();
  fill('code', '123456'); await submit();
  expect(signIn.mfa.verifyTOTP).toHaveBeenCalledWith({ code: '123456' });
  expect(container.textContent).toBe('Hacker portal');
});
test('password recovery verifies the code, checks matching passwords, and revokes other sessions', async () => {
  await render('reset'); fill('email', 'test@example.com'); await submit();
  expect(signIn.create).toHaveBeenCalledWith({ identifier: 'test@example.com' });
  expect(signIn.resetPasswordEmailCode.sendCode).toHaveBeenCalledTimes(1);
  expect(container.querySelector('[name="password"]')).toBeNull();
  fill('code', '123456'); await submit();
  fill('password', 'new-test-password'); fill('confirmPassword', 'different-password'); await submit();
  expect(signIn.resetPasswordEmailCode.submitPassword).not.toHaveBeenCalled();
  fill('confirmPassword', 'new-test-password'); await submit();
  expect(signIn.resetPasswordEmailCode.submitPassword).toHaveBeenCalledWith({ password: 'new-test-password', signOutOfOtherSessions: true });
  expect(container.textContent).toBe('Hacker portal');
});
test('login exposes the password recovery page', async () => {
  await render('login');
  expect(container.querySelector('a[href="/forgot-password"]').textContent).toBe('Forgot password?');
});
test('reset email failures keep the email form available for retry', async () => {
  signIn.resetPasswordEmailCode.sendCode.mockResolvedValueOnce({ error: { code: 'too_many_requests' } });
  await render('reset'); fill('email', 'test@example.com'); await submit();
  expect(container.querySelector('[name="email"]')).not.toBeNull();
  expect(container.querySelector('[name="code"]')).toBeNull();
  expect(container.querySelector('[role="alert"]').textContent).toContain('Too many attempts');
  await submit();
  expect(container.textContent).toContain('Check your email');
  expect(signIn.resetPasswordEmailCode.sendCode).toHaveBeenCalledTimes(2);
});
test('expired reset codes never allow a new password or an active session', async () => {
  signIn.resetPasswordEmailCode.verifyCode.mockResolvedValue({ error: { code: 'verification_expired' } });
  await render('reset'); fill('email', 'test@example.com'); await submit();
  fill('code', '123456'); await submit();
  expect(container.querySelector('[role="alert"]').textContent).toContain('expired');
  expect(container.querySelector('[name="password"]')).toBeNull();
  expect(signIn.resetPasswordEmailCode.submitPassword).not.toHaveBeenCalled();
  expect(signIn.finalize).not.toHaveBeenCalled();
});
test('a rejected new password stays on the reset form without activating a session', async () => {
  signIn.resetPasswordEmailCode.submitPassword.mockResolvedValue({ error: { code: 'form_password_pwned' } });
  await render('reset'); fill('email', 'test@example.com'); await submit();
  fill('code', '123456'); await submit();
  fill('password', 'unsafe-password'); fill('confirmPassword', 'unsafe-password'); await submit();
  expect(container.querySelector('[role="alert"]').textContent).toContain('data breach');
  expect(container.querySelector('[name="password"]')).not.toBeNull();
  expect(signIn.finalize).not.toHaveBeenCalled();
});
test('pending session tasks show an actionable state instead of claiming success', async () => {
  signIn.finalize.mockImplementation(async ({ navigate }) => { navigate({ session: { currentTask: { key: 'choose-organization' } }, decorateUrl: url => url }); return { error: null }; });
  await render('login'); details(); await submit();
  expect(container.textContent).toContain('extra setup step');
  expect(container.textContent).not.toBe('Hacker portal');
});
test('missing configuration fails closed while keeping the custom design visible', async () => {
  useSession.mockReturnValue({ configured: false, isLoaded: true, isSignedIn: false });
  await render('signup');
  expect(useSignUp).not.toHaveBeenCalled();
  expect(container.querySelector('button[type="submit"]').disabled).toBe(true);
  expect(container.textContent).toContain('temporarily unavailable');
});
