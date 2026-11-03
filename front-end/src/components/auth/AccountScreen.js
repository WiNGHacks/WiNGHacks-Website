import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useClerk, useSignIn, useSignUp } from '@clerk/react';
import { useSession } from './SessionProvider';
import AccountLayout from './AccountLayout';
import { isEduEmail } from './eduEmail';
import { authError, chooseFactor, clerkStep, sendFactor, verifyFactor } from './authFlow';

const initialValues = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', code: '' };
const factorNames = { email_code: 'Email code', phone_code: 'Text message', totp: 'Authenticator app', backup_code: 'Backup code' };

function Field({ name, label, type = 'text', value, onChange, error, hint, extra, ...props }) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  const id = `account-${name}`;
  return <div className="account-field">
    <div className="account-label-row"><label htmlFor={id}>{label}</label>{extra}</div>
    <div className={`account-input-wrap${password ? ' has-toggle' : ''}`}>
      <input id={id} name={name} className={`account-input${name === 'code' && type !== 'password' ? ' account-code' : ''}`}
        type={password && visible ? 'text' : type} value={value} onChange={onChange}
        aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...props} />
      {password && <button type="button" className="account-password-toggle" onClick={() => setVisible(!visible)}
        aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} disabled={props.disabled}>{visible ? 'Hide' : 'Show'}</button>}
    </div>
    {error ? <p className="account-field-error" id={`${id}-error`}>{error}</p> : hint && <p className="account-hint" id={`${id}-hint`}>{hint}</p>}
  </div>;
}

function FormContent({ mode, signIn, signUp, fetchStatus = 'idle', sdkErrors, unavailable = false, signOut }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [step, setStep] = useState({ stage: 'details', factor: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const locked = useRef(false);
  const restored = useRef(false);
  const heading = useRef(null);
  const alert = useRef(null);
  const resource = mode === 'signup' ? signUp : signIn;
  const working = busy || fetchStatus === 'fetching';
  const disabled = unavailable || !resource || working;
  const signup = mode === 'signup';
  const reset = mode === 'reset';
  const { stage, factor } = step;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(seconds => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  useEffect(() => { if (stage !== 'details') heading.current?.focus(); }, [stage]);
  useEffect(() => { if (error) alert.current?.focus(); }, [error]);
  // Resume an unfinished code step after refresh without sending another email.
  useEffect(() => {
    if (!resource || restored.current) return;
    restored.current = true;
    if (signup && resource.status === 'missing_requirements' && resource.unverifiedFields?.includes('email_address') && !resource.missingFields?.length) {
      setValues(v => ({ ...v, email: resource.emailAddress || '' }));
      setStep({ stage: 'code', factor: 'signup' });
    } else if (!signup && ['needs_second_factor', 'needs_client_trust'].includes(resource.status)) {
      const strategy = chooseFactor(resource);
      if (strategy) setStep({ stage: 'code', factor: strategy });
    } else if (!signup && resource.status === 'needs_new_password') {
      setStep({ stage: 'newPassword' });
    } else if (signup && resource.status === 'complete') {
      setStep({ stage: 'ready' });
    }
  }, [resource, signup]);

  const update = event => {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setFieldErrors(current => ({ ...current, [name]: null }));
  };
  async function run(action) {
    if (locked.current || disabled) return;
    locked.current = true;
    setBusy(true); setError(''); setNotice(''); setFieldErrors({});
    try { await action(); }
    catch (caught) { setError(authError(caught)); }
    finally { locked.current = false; setBusy(false); }
  }
  async function finish(currentResource) {
    if (currentResource.status !== 'complete') {
      setError('There’s another step to complete before you can sign in. Please try again or get in touch below.');
      return;
    }
    setStep({ stage: 'ready' });
    await clerkStep(currentResource.finalize({ navigate: ({ session, decorateUrl }) => {
      if (session?.currentTask) {
        setStep({ stage: 'task' });
        return;
      }
      const destination = decorateUrl('/portal');
      if (/^https?:\/\//.test(destination)) window.location.assign(destination);
      else navigate(destination, { replace: true });
    } }));
  }
  async function prepareFactor(strategy) {
    setValues(v => ({ ...v, code: '', password: '', confirmPassword: '' }));
    setStep({ stage: 'code', factor: strategy });
    await sendFactor(signIn, strategy);
    if (['email_code', 'phone_code'].includes(strategy)) {
      setCooldown(30);
      setNotice(strategy === 'email_code' ? 'A fresh code is on its way to your email.' : 'A fresh code is on its way to your phone.');
    }
  }
  async function advanceSignIn() {
    if (signIn.status === 'complete') return finish(signIn);
    if (signIn.status === 'needs_new_password') {
      setValues(v => ({ ...v, password: '', confirmPassword: '' }));
      setStep({ stage: 'newPassword' }); return;
    }
    if (['needs_second_factor', 'needs_client_trust'].includes(signIn.status)) {
      const strategy = chooseFactor(signIn);
      if (strategy) return prepareFactor(strategy);
    }
    setError('This account needs an additional verification method. Please contact the WiNGHacks team using the link below.');
  }
  async function submit(event) {
    event.preventDefault();
    await run(async () => {
      if (stage === 'ready') return finish(resource);
      if (stage === 'details') {
        const emailAddress = values.email.trim().toLowerCase();
        setValues(v => ({ ...v, email: emailAddress }));
        if (signup) {
          if (!isEduEmail(emailAddress)) {
            setFieldErrors({ email: 'Use your school email ending in .edu.' });
            setError('Sign up with a .edu email address.'); return;
          }
          if (!values.firstName.trim() || !values.lastName.trim()) {
            setFieldErrors({ firstName: !values.firstName.trim() ? 'Please enter your first name.' : null,
              lastName: !values.lastName.trim() ? 'Please enter your last name.' : null });
            setError('Please add your name before continuing.'); return;
          }
          await clerkStep(signUp.password({ emailAddress, password: values.password,
            firstName: values.firstName.trim(), lastName: values.lastName.trim() }));
          setValues(v => ({ ...v, password: '' }));
          if (signUp.status === 'complete') return finish(signUp);
          if (signUp.missingFields?.length || signUp.protectCheck) {
            setError('We need a little more information to finish your account. Please contact the WiNGHacks team below.'); return;
          }
          setStep({ stage: 'code', factor: 'signup' });
          await clerkStep(signUp.verifications.sendEmailCode());
          setCooldown(30);
        } else if (reset) {
          await clerkStep(signIn.reset());
          await clerkStep(signIn.create({ identifier: emailAddress }));
          await clerkStep(signIn.resetPasswordEmailCode.sendCode());
          setStep({ stage: 'code', factor: 'reset' });
          setCooldown(30);
        } else {
          // Always verify these credentials in a fresh attempt. A completed
          // reset/login resource must never stand in for a password check.
          await clerkStep(signIn.reset());
          await clerkStep(signIn.password({ emailAddress, password: values.password }));
          setValues(v => ({ ...v, password: '' }));
          await advanceSignIn();
        }
      } else if (stage === 'code') {
        const code = values.code.trim();
        if (factor === 'signup') {
          await clerkStep(signUp.verifications.verifyEmailCode({ code }));
          await finish(signUp);
        } else if (factor === 'reset') {
          await clerkStep(signIn.resetPasswordEmailCode.verifyCode({ code }));
          if (signIn.status !== 'needs_new_password') return advanceSignIn();
          setValues(v => ({ ...v, code: '', password: '', confirmPassword: '' }));
          setStep({ stage: 'newPassword' });
        } else {
          await verifyFactor(signIn, factor, code);
          await advanceSignIn();
        }
      } else if (stage === 'newPassword') {
        if (values.password !== values.confirmPassword) {
          setFieldErrors({ confirmPassword: 'Your passwords don’t match yet.' });
          setError('Please make sure both passwords match.'); return;
        }
        await clerkStep(signIn.resetPasswordEmailCode.submitPassword({ password: values.password, signOutOfOtherSessions: true }));
        setValues(v => ({ ...v, password: '', confirmPassword: '' }));
        await advanceSignIn();
      }
    });
  }
  async function resend() {
    if (cooldown) return;
    await run(async () => {
      if (factor === 'signup') await clerkStep(signUp.verifications.sendEmailCode());
      else if (factor === 'reset') await clerkStep(signIn.resetPasswordEmailCode.sendCode());
      else await sendFactor(signIn, factor);
      setCooldown(30); setNotice(factor === 'phone_code' ? 'A fresh code is on its way to your phone.' : 'A fresh code is on its way. Check your inbox in a moment.');
    });
  }
  async function startOver() {
    await run(async () => {
      await clerkStep(resource.reset());
      setStep({ stage: 'details' }); setValues(v => ({ ...v, password: '', confirmPassword: '', code: '' })); setCooldown(0);
    });
  }
  const titles = { details: signup ? 'Sign up' : reset ? 'Forgot password?' : 'Log in', code: factor === 'reset' ? 'Check your email' : factor === 'totp' ? 'Verify your login' : factor === 'backup_code' ? 'Backup code' : 'Verify your email', newPassword: 'Set a new password', ready: 'Account ready', task: 'Complete your account' };
  const descriptions = {
    details: reset ? 'We’ll email you a reset code.' : '',
    code: factor === 'reset' ? `Enter the reset code sent to ${values.email || 'your email address'}. Check your spam folder if needed.` : factor === 'totp' ? 'Enter the six-digit code from your authenticator app.' : factor === 'backup_code' ? 'Enter one of the backup codes you saved when setting up your account.' : factor === 'phone_code' ? 'Enter the verification code sent to your phone.' : `Enter the verification code for ${values.email || 'your email address'}.`,
    newPassword: 'Choose a new password. You’ll be signed out on your other devices.',
    ready: 'Your account is ready. Continue to your hacker portal.',
    task: 'Your account needs an extra setup step that isn’t available here yet. Please get in touch so we can help you finish.',
  };
  const sdkFields = error ? sdkErrors?.fields || {} : {};
  const fieldError = name => fieldErrors[name] || sdkFields[name === 'email' ? (signup ? 'emailAddress' : 'identifier') : name]?.message;
  const input = (name, label, props = {}) => <Field name={name} label={label} value={values[name]} onChange={update} error={fieldError(name)} disabled={disabled} required {...props} />;
  const canResend = ['signup', 'reset', 'email_code', 'phone_code'].includes(factor);
  const buttonText = stage === 'details' ? signup ? 'Sign up' : reset ? 'Send reset code' : 'Log in' : stage === 'code' ? 'Verify & continue' : stage === 'newPassword' ? 'Save new password' : 'Go to my portal';
  return <>
    <h1 className="account-title" ref={heading} tabIndex={-1}>{factor === 'phone_code' && stage === 'code' ? 'Verify your phone' : titles[stage]}</h1>
    {descriptions[stage] && <p className="account-description">{descriptions[stage]}</p>}
    {unavailable && <p className="account-alert" role="status">Account access is temporarily unavailable. Please try again soon.</p>}
    {!resource && !unavailable && <p className="account-notice" role="status">Getting your account ready…</p>}
    {error && <p className="account-alert" role="alert" ref={alert} tabIndex={-1}>{error}</p>}
    {notice && <p className="account-notice" role="status">{notice}</p>}
    {stage === 'task' ? <button className="account-submit" onClick={() => signOut({ redirectUrl: '/login' })}>Back to sign in</button> :
      <form onSubmit={submit} aria-busy={working}>
        <fieldset className="account-fields" disabled={disabled}>
          {stage === 'details' && <>
            {signup && <div className="account-name-row">
              {input('firstName', 'First name', { autoComplete: 'given-name', maxLength: 100 })}
              {input('lastName', 'Last name', { autoComplete: 'family-name', maxLength: 100 })}
            </div>}
            {input('email', signup ? 'School email (.edu)' : 'Email address', { type: 'email', autoComplete: 'email', placeholder: signup ? 'you@school.edu' : 'you@example.com', maxLength: 254, autoCapitalize: 'none', spellCheck: false })}
            {!reset && input('password', 'Password', { type: 'password', autoComplete: signup ? 'new-password' : 'current-password',
              minLength: signup ? 8 : undefined,
              extra: !signup && <Link className="account-small-link" to="/forgot-password">Forgot password?</Link> })}
          </>}
          {stage === 'code' && input('code', factor === 'backup_code' ? 'Backup code' : 'Verification code', {
            autoComplete: 'one-time-code', inputMode: factor === 'backup_code' ? 'text' : 'numeric',
            pattern: factor === 'backup_code' ? undefined : '[0-9]{6}', maxLength: factor === 'backup_code' ? 32 : 6,
            minLength: factor === 'backup_code' ? undefined : 6, placeholder: factor === 'backup_code' ? '' : '000000',
            spellCheck: false, autoCapitalize: 'none',
          })}
          {stage === 'newPassword' && <>
            {input('password', 'New password', { type: 'password', autoComplete: 'new-password', minLength: 8 })}
            {input('confirmPassword', 'Confirm new password', { type: 'password', autoComplete: 'new-password', minLength: 8 })}
          </>}
          <button className="account-submit" type="submit" disabled={disabled}>
            {working && <span className="account-spinner" aria-hidden="true" />}{working ? 'Just a moment…' : buttonText}
          </button>
        </fieldset>
      </form>}
    <div id="clerk-captcha" className="account-captcha" />
    {stage === 'code' && <div className="account-code-actions">
      {canResend && <button className="account-text-button" onClick={resend} disabled={disabled || cooldown > 0}>{cooldown ? `Resend in ${cooldown}s` : 'Send a new code'}</button>}
      <button className="account-text-button" onClick={startOver} disabled={disabled}>Start over</button>
    </div>}
    {stage === 'code' && !['signup', 'reset'].includes(factor) && <div className="account-factor-options">
      {(signIn?.supportedSecondFactors || []).filter((option, index, options) => factorNames[option.strategy] && option.strategy !== factor && options.findIndex(item => item.strategy === option.strategy) === index).map(option =>
        <button className="account-text-button" key={option.strategy} disabled={disabled} onClick={() => run(() => prepareFactor(option.strategy))}>Use {factorNames[option.strategy].toLowerCase()}</button>)}
    </div>}
    <p className="account-switch">{signup ? <>Already have an account? <Link to="/login">Log in</Link></> : reset ? <><Link to="/login">Back to log in</Link></> : <>No account yet? <Link to="/signup">Sign up</Link></>}</p>
  </>;
}

function ConnectedForm({ mode }) {
  const signInState = useSignIn();
  const signUpState = useSignUp();
  const { signOut } = useClerk();
  const active = mode === 'signup' ? signUpState : signInState;
  return <FormContent mode={mode} signIn={signInState.signIn} signUp={signUpState.signUp}
    fetchStatus={active.fetchStatus} sdkErrors={active.errors} signOut={signOut} />;
}

export default function AccountScreen({ mode }) {
  const { configured, isSignedIn } = useSession();
  useEffect(() => {
    const previous = document.title;
    document.title = `${mode === 'signup' ? 'Sign up' : mode === 'reset' ? 'Reset password' : 'Sign in'} · WiNGHacks`;
    return () => { document.title = previous; };
  }, [mode]);
  if (isSignedIn) return <Navigate to="/portal" replace />;
  return <AccountLayout mode={mode}>
    {configured ? <ConnectedForm key={mode} mode={mode} /> : <FormContent mode={mode} unavailable />}
  </AccountLayout>;
}
