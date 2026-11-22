import React, { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiSave, FiUpload, FiFileText, FiMail } from 'react-icons/fi';
import { useSession } from '../auth/SessionProvider';
import { DraftStore, backups } from './draftStore';
import { ApplicationFields, AnswersReview } from './ApplicationFields';
import './applications.css';
import './hacker-application.css';

export default function HackerApplication() {
  const { api, user, refreshProfile } = useSession();
  const [config, setConfig] = useState(null), [store, setStore] = useState(null), [, redraw] = useState(0);
  const [error, setError] = useState(''), [errors, setErrors] = useState({}), [step, setStep] = useState(0), [recovery, setRecovery] = useState([]);
  const [reload, setReload] = useState(0);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const recoveredKey = useRef(null), timer = useRef(null), stepHeading = useRef(null), fileInputRef = useRef(null);

  useEffect(() => { stepHeading.current?.focus(); }, [step]);

  useEffect(() => {
    let active = true, editor;
    (async () => {
      setError('');
      const [{ data: configuration }, { data: existing }] = await Promise.all([api.get('/applications/config'), api.get('/applications/me')]);
      let doc = existing;
      if (!doc) doc = (await api.post('/applications/me')).data;
      if (!active) return;
      let storage; try { storage = window.localStorage; } catch { storage = { setItem() { throw Error(); }, removeItem() { throw Error(); } }; }
      const prefix = `winghacks:draft:${user.clerkUserId}:${configuration.season}:`;
      editor = new DraftStore(api, doc, prefix, storage, () => redraw(v => v + 1));
      setConfig(configuration); setStore(editor); setRecovery(backups(storage, prefix));
    })().catch(e => active && setError(e.response?.data?.message || 'Unable to load your application. Please retry.'));
    return () => { active = false; if (editor) { editor.persist(); editor.disposed = true; } };
  }, [api, user.clerkUserId, reload]);

  useEffect(() => {
    if (!store) return;
    const save = () => { if (!recovery.length) store.flush(); };
    const interval = setInterval(save, 5000);
    const leave = e => { if (store.dirty || store.pending || store.busy) { store.persist(); e.preventDefault(); e.returnValue = ''; } };
    const hidden = () => { if (document.visibilityState === 'hidden') { store.persist(); save(); } };
    window.addEventListener('online', save); window.addEventListener('beforeunload', leave); document.addEventListener('visibilitychange', hidden);
    return () => { clearInterval(interval); clearTimeout(timer.current); window.removeEventListener('online', save); window.removeEventListener('beforeunload', leave); document.removeEventListener('visibilitychange', hidden); };
  }, [store, recovery.length]);

  useEffect(() => {
    if (store && !store.dirty && recoveredKey.current && !store.conflicts.length) {
      try { store.storage.removeItem(recoveredKey.current); recoveredKey.current = null; } catch { /* Keep recovery copy. */ }
    }
  });

  const change = (key, value) => {
    store.set(key, value);
    setErrors(e => ({ ...e, [key]: undefined }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => store.flush(), 800);
  };

  const act = async fn => {
    setError('');
    try {
      return await store.action(fn);
    } catch (e) {
      setErrors(e.response?.data?.errors || {});
      setError(e.response?.data?.message || 'Request not confirmed. Please retry.');
      return null;
    }
  };

  const handleResumeFile = async file => {
    if (!file) return;
    setResumeError('');
    if (!/\.pdf$/i.test(file.name)) {
      setResumeError('Please upload a PDF file.');
      return;
    }
    const maxBytes = config?.maxResumeBytes || 512 * 1024;
    if (file.size > maxBytes) {
      const maxKb = Math.round(maxBytes / 1024);
      setResumeError(`File exceeds maximum size (${maxKb} KB). Please upload a smaller PDF.`);
      return;
    }
    const res = await act(revision =>
      api.put('/applications/me/resume', file, {
        headers: {
          'Content-Type': 'application/pdf',
          'X-Application-Revision': revision,
          'X-File-Name': file.name.replace(/[^a-zA-Z0-9._ -]/g, '_'),
        },
        timeout: 30000,
      })
    );
    if (res) {
      setErrors(prev => ({ ...prev, resume: undefined }));
      setResumeError('');
    } else {
      setResumeError('Resume upload not confirmed. Please retry.');
    }
  };

  if (!store || !config) return (
    <section className="hacker-application application-shell application-loading" aria-label="Hacker application form">
      {error ? <><p role="alert">{error}</p><button type="button" onClick={() => setReload(v => v + 1)}>Retry</button></> : <p role="status">Loading your saved application...</p>}
    </section>
  );

  const sections = [...new Set(config.fields.map(f => f.section))];
  const resumeStepIndex = sections.indexOf('Resume & links');
  const reviewStepIndex = sections.indexOf('Review & agreements') !== -1 ? sections.indexOf('Review & agreements') : sections.length - 1;
  const isReviewStep = step === reviewStepIndex;
  const isResumeStep = resumeStepIndex !== -1 && step === resumeStepIndex;
  const fields = config.fields.filter(f => f.section === sections[step]);
  const disabled = store.locked || store.busy || recovery.length > 0 || store.conflicts.length > 0;
  const activeErrors = { ...(store?.serverErrors || {}), ...errors };

  const missingRequired = config.fields.filter(f => {
    if (f.key === 'schoolOther') {
      // schoolOther is required only when school === 'Other'
      if (store.answers.school !== 'Other') return false;
      const v = store.answers[f.key];
      return !v || (typeof v === 'string' && !v.trim());
    }
    if (f.key === 'pronounsOther') {
      // pronounsOther is required only when pronouns === 'Prefer to self-describe'
      if (store.answers.pronouns !== 'Prefer to self-describe') return false;
      const v = store.answers[f.key];
      return !v || (typeof v === 'string' && !v.trim());
    }
    if (!f.required) return false;
    const v = store.answers[f.key];
    if (v === undefined || v === null) return true;
    if (typeof v === 'string' && !v.trim()) return true;
    if (f.type === 'checkbox' && !v) return true;
    if (f.maxLength && typeof v === 'string' && v.length > f.maxLength) return true;
    return false;
  });
  const missingResume = !store.doc.resume;
  const hasErrorsOnReview = (missingRequired.length > 0 || missingResume) && (submittedAttempt || Object.keys(errors).length > 0);

  const handleSubmit = async () => {
    setSubmittedAttempt(true);
    if (missingRequired.length > 0 || missingResume) {
      const errMap = {};
      for (const f of missingRequired) {
        if (f.maxLength && typeof store.answers[f.key] === 'string' && store.answers[f.key].length > f.maxLength) {
          errMap[f.key] = `Exceeds ${f.maxLength} characters`;
        } else {
          errMap[f.key] = 'Required';
        }
      }
      if (missingResume) errMap.resume = 'Resume PDF is required.';
      setErrors(errMap);

      const hasMissingCheckboxes = missingRequired.some(f => f.type === 'checkbox');

      setTimeout(() => {
        if (hasMissingCheckboxes) {
          const agreementsEl = document.querySelector('.application-agreements-card');
          if (agreementsEl) {
            agreementsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
        }
        const firstError = document.querySelector('.application-review-error-text, [aria-invalid=true]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          stepHeading.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return;
    }
    await act(async revision => {
      const result = await api.post('/applications/me/submit', { revision }, { timeout: 30000 });
      if (result) {
        setJustSubmitted(true);
        refreshProfile?.().catch(() => {});
      }
      return result;
    });
  };

  return (
    <section className="hacker-application application-shell" aria-label="Hacker application form">
      {recovery.length > 0 && (
        <section className="application-alert">
          <h2>Recover unsaved work</h2>
          <p>This browser has drafts that weren’t confirmed saved. Choose a copy to compare with the server.</p>
          {recovery.map(b => (
            <div className="application-actions" key={b.key}>
              <span>{new Date(b.at).toLocaleString()}</span>
              <button type="button" onClick={() => { store.recover(b); recoveredKey.current = b.key; setRecovery([]); }}>Recover this copy</button>
              <button type="button" onClick={() => { if (!window.confirm('Discard this unsaved browser copy? This cannot be undone.')) return; try { store.storage.removeItem(b.key); } catch {} setRecovery(v => v.filter(x => x.key !== b.key)); }}>Discard this copy</button>
            </div>
          ))}
        </section>
      )}

      {store.conflicts.length > 0 && (
        <section className="application-alert">
          <h2>Choose which changes to keep</h2>
          <p>Another tab or reviewer changed these answers. All other changes were combined automatically.</p>
          {store.conflicts.map(key => (
            <div className="application-conflict" key={key}>
              <h3>{config.fields.find(f => f.key === key)?.label || key}</h3>
              <p>Your copy: {String(store.answers[key] ?? '')}</p>
              <p>Saved copy: {String(store.doc.answers[key] ?? '')}</p>
              <button type="button" onClick={() => store.resolve(key, true)}>Keep my answer</button>
              <button type="button" onClick={() => store.resolve(key, false)}>Use saved answer</button>
            </div>
          ))}
        </section>
      )}

      {store.locked ? (
        justSubmitted ? (
          <section className="application-card application-congrats-card" aria-label="Application submitted successfully">
            <div className="application-congrats-icon" aria-hidden="true">🎉</div>
            <h2>Congrats, you have submitted your application!</h2>
            <p className="application-congrats-desc">
              Your application for WiNGHacks 2027 has been received and locked for review. You’ll be notified once decisions are released.
            </p>
            <div className="application-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <button
                type="button"
                className="primary"
                onClick={() => setJustSubmitted(false)}
              >
                Review submission
              </button>
            </div>
          </section>
        ) : (
          <section className="application-card">
            <h2>{store.doc.deletedAt ? 'Application archived' : 'Application received'}</h2>
            <p>{store.doc.deletedAt ? 'Contact the team to restore your application.' : `Submitted ${new Date(store.doc.submittedAt).toLocaleString()}. Your answers are locked. Contact the team if you need a correction.`}</p>
            {store.dirty && <p role="alert">You have a different local copy. Your browser backup is retained on this device; the submitted answers below are the server copy.</p>}
            <p style={{ margin: '8px 0 20px' }}>Review status: <strong style={{ textTransform: 'capitalize' }}>{store.doc.reviewStatus.replace('_', ' ')}</strong></p>
            <AnswersReview
              fields={config.fields}
              answers={store.doc.answers}
              resume={store.doc.resume}
            />
            {(error || store.message || store.storageError) && (
              <div className="application-alert application-alert-bottom" role="alert" style={{ margin: '16px 0' }}>
                <p>{error || store.message}</p>
                {store.storageError && <p>{store.storageError}</p>}
                <button type="button" disabled={store.busy} onClick={() => { setError(''); store.flush(); }}>Retry save</button>
              </div>
            )}
            <div className="application-contact-help" style={{ marginTop: '28px' }}>
              <p className="application-contact-text">
                Questions about your application or need to make a change?{' '}
                <a href="mailto:uf.winghacks@gmail.com" className="application-contact-link">
                  <FiMail className="application-contact-icon" aria-hidden="true" />
                  Contact the team
                </a>
              </p>
            </div>
          </section>
        )
      ) : (
        <>
          <nav className="application-steps" aria-label="Application steps">
            {sections.map((name, index) => (
              <button
                type="button"
                key={name}
                aria-current={step === index ? 'step' : undefined}
                onClick={() => setStep(index)}
              >
                <span className="application-step-number" aria-hidden="true">{index + 1}</span>
                <span>{name}</span>
              </button>
            ))}
          </nav>

          <section className="application-card">
            <p className="application-eyebrow">STEP {step + 1} OF {sections.length}</p>
            <h2 ref={stepHeading} tabIndex={-1}>{sections[step]}</h2>

            {step === 0 && (
              <p className="application-step-note">
                Fields marked <span className="application-required">*</span> are required at submission. Incomplete answers are saved as drafts.
              </p>
            )}

            {isResumeStep && (
              <div className="application-resume-card">
                <div className="application-resume-card-header">
                  <h3 className="application-resume-title">
                    Resume File <span className="application-required">*</span>
                  </h3>
                </div>

                <input
                  ref={fileInputRef}
                  aria-label="Upload resume PDF"
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={disabled}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    handleResumeFile(file);
                  }}
                  style={{ display: 'none' }}
                />

                {!store.doc.resume ? (
                  <div
                    className={`application-dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    onDragOver={e => {
                      e.preventDefault();
                      if (!disabled) setIsDragging(true);
                    }}
                    onDragLeave={e => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (disabled) return;
                      const file = e.dataTransfer.files?.[0];
                      handleResumeFile(file);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    aria-label="Upload resume PDF. Drag and drop or browse files."
                  >
                    <div className="application-dropzone-inner">
                      <FiUpload className="application-dropzone-icon" aria-hidden="true" />
                      <p className="application-dropzone-prompt">Drag & Drop or browse files</p>
                      <p className="application-dropzone-hint">
                        PDF only – max {Math.round((config?.maxResumeBytes || 512 * 1024) / 1024)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="application-resume-uploaded-card">
                    <div className="application-resume-uploaded-main">
                      <div className="application-resume-file-icon-wrap" aria-hidden="true">
                        <FiFileText className="application-resume-file-icon" />
                      </div>
                      <div className="application-resume-file-details">
                        <span className="application-resume-file-name">{store.doc.resume.name}</span>
                        <span className="application-resume-file-meta">
                          {Math.ceil(store.doc.resume.size / 1024)} KB · Saved
                        </span>
                      </div>
                    </div>
                    <div className="application-resume-uploaded-actions">
                      <button
                        type="button"
                        className="secondary"
                        disabled={disabled}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Replace file
                      </button>
                      <button
                        type="button"
                        className="application-resume-remove-btn"
                        disabled={disabled}
                        onClick={async () => {
                          setResumeError('');
                          await act(revision => api.delete('/applications/me/resume', { data: { revision } }));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {(resumeError || errors.resume || (submittedAttempt && missingResume)) && (
                  <p id="error-resume" className="application-error application-resume-error" role="alert">
                    {resumeError || errors.resume || 'Resume PDF is required.'}
                  </p>
                )}
              </div>
            )}

            {isReviewStep && (
              <>
                {hasErrorsOnReview && (
                  <div className="application-step6-error-banner" role="alert">
                    <span className="application-step6-error-badge">
                      Please complete all required fields marked below before submitting.
                    </span>
                  </div>
                )}
                <AnswersReview
                  fields={config.fields.filter(f => f.section !== sections[reviewStepIndex])}
                  answers={store.answers}
                  errors={submittedAttempt ? activeErrors : (store?.serverErrors || {})}
                  onEditSection={sec => setStep(sections.indexOf(sec))}
                  resume={store.doc.resume}
                  missingResume={missingResume && submittedAttempt}
                  onEditResume={() => setStep(resumeStepIndex !== -1 ? resumeStepIndex : 0)}
                />

                <div className={`application-agreements-card ${submittedAttempt && missingRequired.some(f => f.type === 'checkbox') ? 'has-checkbox-errors' : ''}`}>
                  <h3 className="application-agreements-title">Agreements</h3>
                  {submittedAttempt && missingRequired.some(f => f.type === 'checkbox') && (
                    <p className="application-agreements-error-notice" role="alert">
                      Please confirm all required agreements below before submitting.
                    </p>
                  )}
                  <ApplicationFields
                    fields={fields}
                    answers={store.answers}
                    onChange={change}
                    errors={activeErrors}
                    disabled={disabled}
                    codeOfConductUrl={config.codeOfConductUrl}
                  />
                </div>
              </>
            )}

            {!isReviewStep && (
              <ApplicationFields
                fields={fields}
                answers={store.answers}
                onChange={change}
                errors={activeErrors}
                disabled={disabled}
              />
            )}

            {(error || store.message || store.storageError) && (
              <div className="application-alert application-alert-bottom" role="alert">
                <div className="application-alert-text">
                  <p>{error || store.message}</p>
                  {store.storageError && <p>{store.storageError}</p>}
                </div>
                <button
                  type="button"
                  disabled={store.busy}
                  onClick={() => {
                    setError('');
                    store.flush();
                  }}
                >
                  Retry save
                </button>
              </div>
            )}

            <div className="application-card-footer">
              <div className="application-actions">
                <button type="button" disabled={step === 0} onClick={() => setStep(v => v - 1)}>Back</button>
                <button type="button" disabled={disabled} onClick={() => store.flush()}>Save draft</button>
                {step < sections.length - 1 ? (
                  <button type="button" className="primary" onClick={() => { store.flush(); setStep(v => v + 1); }}>Continue</button>
                ) : (
                  <button type="button" className="primary" disabled={disabled} onClick={handleSubmit}>Submit application</button>
                )}
              </div>

              <div className="application-save-bottom" role="status" aria-live="polite">
                {store.dirty || store.pending || store.busy ? <FiSave aria-hidden="true" /> : <FiCheckCircle aria-hidden="true" />}
                <span>
                  {store.busy ? 'Working...' : store.pending ? 'Saving...' : store.dirty ? 'Unsaved changes (saving...)' : store.doc.updatedAt ? `Saved · ${new Date(store.doc.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Draft saved'}
                </span>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
