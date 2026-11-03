// Clerk's current custom-flow APIs return errors as values; network failures may
// still throw. Normalize both paths so a failed step never activates a session.
export async function clerkStep(promise) {
  const result = await promise;
  if (result?.error) throw result.error;
  return result;
}

export function authError(error) {
  const detail = error?.errors?.[0] || error;
  const messages = {
    form_password_incorrect: 'That email and password don’t match. Please try again.',
    form_identifier_not_found: 'That email and password don’t match. Please try again.',
    form_code_incorrect: 'That code doesn’t match. Check your email and try again.',
    verification_expired: 'This code has expired. Request a new one below.',
    form_password_pwned: 'This password has appeared in a data breach. Please choose a different one.',
    too_many_requests: 'Too many attempts. Please wait a moment before trying again.',
    form_identifier_exists: 'An account with this email already exists. Try signing in instead.',
  };
  return messages[detail?.code] || detail?.longMessage ||
    'We couldn’t complete that step. Check your connection and try again.';
}

export function chooseFactor(signIn) {
  const supported = signIn.supportedSecondFactors || [];
  const preference = signIn.status === 'needs_client_trust'
    ? ['email_code', 'phone_code', 'totp', 'backup_code']
    : ['totp', 'email_code', 'phone_code', 'backup_code'];
  return preference.find(strategy => supported.some(factor => factor.strategy === strategy));
}

export function sendFactor(signIn, factor) {
  if (factor === 'email_code') return clerkStep(signIn.mfa.sendEmailCode());
  if (factor === 'phone_code') return clerkStep(signIn.mfa.sendPhoneCode());
  return Promise.resolve();
}

export function verifyFactor(signIn, factor, code) {
  const methods = { email_code: 'verifyEmailCode', phone_code: 'verifyPhoneCode', totp: 'verifyTOTP', backup_code: 'verifyBackupCode' };
  if (!methods[factor]) throw new Error('Unsupported verification method');
  return clerkStep(signIn.mfa[methods[factor]]({ code }));
}
