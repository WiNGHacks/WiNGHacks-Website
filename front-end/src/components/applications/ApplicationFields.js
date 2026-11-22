import React, { useState } from 'react';
import { FiEdit2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  const matches = str.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export function ApplicationFields({
  fields,
  answers,
  onChange,
  errors = {},
  disabled = false,
  codeOfConductUrl = 'https://static.mlh.io/docs/mlh-code-of-conduct.pdf',
}) {
  const visibleFields = fields;

  const handleInputChange = (field, e) => {
    let raw = e.target.value;
    // Strip newlines from single-line text inputs
    if (field.type !== 'textarea') {
      raw = raw.replace(/[\r\n]/g, '');
    }
    // Graduation year: numeric only, up to 4 digits
    if (field.key === 'graduationYear') {
      raw = raw.replace(/\D/g, '').slice(0, 4);
    }
    // URLs: trim leading/trailing whitespace
    if (field.type === 'url') {
      raw = raw.trim();
    }
    // Hard limit to field.maxLength
    if (field.maxLength && raw.length > field.maxLength) {
      raw = raw.slice(0, field.maxLength);
    }
    onChange(field.key, raw);
  };

  return (
    <div className="application-fields">
      {visibleFields.map(f => {
        const id = `answer-${f.key}`;
        const val = answers[f.key] || '';
        const charLimit = f.maxLength || (f.type === 'textarea' ? 2000 : 200);
        const charCount = typeof val === 'string' ? val.length : 0;
        const hasError = !!errors[f.key];
        const isCheckbox = f.type === 'checkbox';

        // Hide schoolOther unless school === 'Other'
        if (f.key === 'schoolOther' && answers.school !== 'Other') return null;
        // Hide pronounsOther unless pronouns === 'Prefer to self-describe'
        if (f.key === 'pronounsOther' && answers.pronouns !== 'Prefer to self-describe') return null;

        if (isCheckbox) {
          const isCodeOfConduct = f.key === 'codeOfConduct';
          return (
            <div
              className={`application-field application-checkbox-field ${hasError ? 'has-error' : ''}`}
              key={f.key}
            >
              <div className="application-checkbox-row">
                <input
                  id={id}
                  type="checkbox"
                  checked={answers[f.key] === true}
                  disabled={disabled}
                  onChange={e => onChange(f.key, e.target.checked)}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `error-${f.key}` : undefined}
                />
                <label htmlFor={id}>
                  {isCodeOfConduct ? (
                    <>
                      I agree to follow the event{' '}
                      <a
                        href={codeOfConductUrl || 'https://static.mlh.io/docs/mlh-code-of-conduct.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="application-link"
                      >
                        code of conduct
                      </a>
                      .
                    </>
                  ) : (
                    f.label
                  )}
                  {' '}
                  <span className={`application-agreement-tag ${f.required ? 'required' : 'optional'}`}>
                    {f.required ? (
                      <span className="application-agreement-required">* (Required)</span>
                    ) : (
                      <span className="application-agreement-optional">(Optional)</span>
                    )}
                  </span>
                </label>
              </div>
              {hasError && (
                <p id={`error-${f.key}`} className="application-error application-checkbox-error" role="alert">
                  {errors[f.key] || 'Please confirm this agreement.'}
                </p>
              )}
            </div>
          );
        }

        return (
          <div
            className={`application-field ${f.type === 'textarea' ? 'wide' : ''}`}
            key={f.key}
          >
            <label htmlFor={id}>
              {f.label}
              {(f.required || (f.key === 'schoolOther' && answers.school === 'Other') || (f.key === 'pronounsOther' && answers.pronouns === 'Prefer to self-describe')) && (
                <span className="application-required" aria-hidden="true">
                  *
                </span>
              )}
            </label>

            {f.type === 'select' ? (
              <select
                id={id}
                value={answers[f.key] || ''}
                disabled={disabled}
                onChange={e => onChange(f.key, e.target.value)}
                aria-invalid={hasError}
                aria-describedby={hasError ? `error-${f.key}` : undefined}
              >
                <option value="">Choose one</option>
                {f.options.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                id={id}
                rows={5}
                value={val}
                maxLength={charLimit}
                disabled={disabled}
                onChange={e => handleInputChange(f, e)}
                aria-invalid={hasError}
                aria-describedby={`help-${f.key}`}
              />
            ) : (
              <input
                id={id}
                type={f.type}
                value={val}
                maxLength={charLimit}
                inputMode={f.key === 'graduationYear' ? 'numeric' : undefined}
                pattern={f.key === 'graduationYear' ? '[0-9]*' : undefined}
                placeholder={
                  f.key === 'graduationYear'
                    ? 'e.g. 2027'
                    : f.key === 'discord'
                    ? 'e.g. username'
                    : f.key === 'city'
                    ? 'e.g. Gainesville'
                    : f.type === 'url'
                    ? 'https://...'
                    : undefined
                }
                disabled={disabled}
                onChange={e => handleInputChange(f, e)}
                aria-invalid={hasError}
                aria-describedby={hasError ? `error-${f.key}` : undefined}
              />
            )}

            {f.type === 'textarea' && (
              <small
                id={`help-${f.key}`}
                className={`application-char-count ${charCount >= charLimit ? 'at-limit' : ''}`}
              >
                {charCount} / {charLimit} characters
              </small>
            )}

            {errors[f.key] && (
              <p id={`error-${f.key}`} className="application-error" role="alert">
                {errors[f.key]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AnswersReview({
  fields = [],
  answers = {},
  errors = {},
  onEditSection,
  resume,
  onEditResume,
  missingResume,
}) {
  const safeAnswers = answers || {};
  const visibleFields = (fields || []).filter(f => {
    if (f.key === 'schoolOther' && safeAnswers.school !== 'Other') return false;
    if (f.key === 'pronounsOther' && safeAnswers.pronouns !== 'Prefer to self-describe') return false;
    return true;
  });

  const sections = [...new Set(visibleFields.map(f => f.section || 'General'))];

  const isSectionIncomplete = secName => {
    const secFields = visibleFields.filter(f => (f.section || 'General') === secName);
    const hasFieldReq = secFields.some(f => {
      const val = safeAnswers[f.key];
      const isBlank =
        val === undefined ||
        val === null ||
        (typeof val === 'string' && !val.trim()) ||
        (f.type === 'checkbox' && !val);
      const isOverCharLimit = Boolean(f.maxLength && f.maxLength > 0 && typeof val === 'string' && val.length > f.maxLength);
      return Boolean(errors[f.key] || (f.required && isBlank) || isOverCharLimit);
    });
    const hasResumeReq = secName === 'Resume & links' && Boolean(missingResume || !resume);
    return Boolean(hasFieldReq || hasResumeReq);
  };

  // Only expand the sections that still require information; completed sections start collapsed.
  const [openSections, setOpenSections] = useState(() => {
    const incomplete = sections.filter(isSectionIncomplete);
    return new Set(incomplete);
  });

  const toggleSection = sec => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(sec)) next.delete(sec);
      else next.add(sec);
      return next;
    });
  };

  return (
    <div className="application-accordion" role="region" aria-label="Application review sections">
      {sections.map(sec => {
        const secFields = visibleFields.filter(f => (f.section || 'General') === sec);
        const hasSectionError = isSectionIncomplete(sec);
        const isOpen = openSections.has(sec);

        return (
          <div
            className={`application-accordion-item ${hasSectionError ? 'has-section-error' : ''}`}
            key={sec}
          >
            <button
              type="button"
              className="application-accordion-header"
              onClick={() => toggleSection(sec)}
              aria-expanded={isOpen}
            >
              <div className="application-accordion-title-wrap">
                <span className="application-accordion-subtitle">{sec}</span>
                {hasSectionError && (
                  <span className="application-accordion-status-text" role="alert">
                    (Incomplete)
                  </span>
                )}
              </div>
              <div className="application-accordion-meta">
                {isOpen ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
              </div>
            </button>

            {isOpen && (
              <div className="application-accordion-content">
                <dl className="application-review-list">
                  {secFields.map(f => {
                    const val = safeAnswers[f.key];
                    const isBlank =
                      val === undefined ||
                      val === null ||
                      (typeof val === 'string' && !val.trim()) ||
                      (f.type === 'checkbox' && !val);
                    const isOverCharLimit = Boolean(f.maxLength && f.maxLength > 0 && typeof val === 'string' && val.length > f.maxLength);
                    const hasError = Boolean(errors[f.key] || (f.required && isBlank) || isOverCharLimit);

                    return (
                      <div
                        key={f.key}
                        className={`application-review-row ${hasError ? 'has-error' : ''}`}
                      >
                        <dt>
                          <span className="application-review-label">
                            {f.key === 'codeOfConduct' ? (
                              <>
                                I agree to follow the event{' '}
                                <a
                                  href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="application-link"
                                >
                                  code of conduct
                                </a>
                                .
                              </>
                            ) : (
                              f.label
                            )}
                          </span>
                          {f.required && (
                            <span className="application-required" aria-hidden="true">
                              *
                            </span>
                          )}
                          {hasError && (
                            <span className="application-review-error-text" role="alert">
                              {errors[f.key] || (isOverCharLimit ? `Exceeds ${f.maxLength} characters` : 'Required')}
                            </span>
                          )}
                        </dt>
                              <dd>
                                <span className="application-review-val">
                                  {typeof val === 'boolean'
                                    ? val
                                      ? 'Yes'
                                      : 'No'
                                    : val || <span className="application-review-empty">Not provided</span>}
                                </span>
                                {onEditSection && f.section && (
                                  <button
                                    type="button"
                                    className="application-review-edit-btn"
                                    onClick={() => onEditSection(f.section)}
                                    aria-label={`Edit ${f.label}`}
                                    title={`Edit ${f.label}`}
                                  >
                                    <FiEdit2 aria-hidden="true" />
                                  </button>
                                )}
                              </dd>
                            </div>
                          );
                        })}

                        {sec === 'Resume & links' && resume !== undefined && (
                          <div className="application-review-resume-row">
                            <div className="application-review-resume-meta">
                              <span className="application-review-label">Resume PDF</span>
                              <span className="application-required">*</span>
                              {missingResume && (
                                <span className="application-review-error-text" role="alert">Required</span>
                              )}
                            </div>
                            <div className="application-review-resume-val">
                              <span>{resume?.name || <span className="application-review-empty">Not provided</span>}</span>
                              {onEditResume && (
                                <button
                                  type="button"
                                  className="application-review-edit-btn"
                                  onClick={onEditResume}
                                  aria-label="Edit resume"
                                  title="Edit resume"
                                >
                                  <FiEdit2 aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
              </div>
            );
          })}
    </div>
  );
}
