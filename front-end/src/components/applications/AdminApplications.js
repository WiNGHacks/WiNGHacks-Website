import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiRefreshCw,
  FiEdit3,
  FiCheckCircle,
  FiUser,
  FiBookOpen,
} from "react-icons/fi";
import { useSession } from "../auth/SessionProvider";
import { ApplicationFields } from "./ApplicationFields";
import { BACKUP_TTL_MS, downloadFile, loadBackup, same } from "./draftStore";
import "./applications.css";
import "./admin-applications.css";

function ApplicationDetail({ initial, config, api, user, onClose, onSaved }) {
  const [doc, setDoc] = useState(initial);
  const [answers, setAnswers] = useState(initial.answers || {});
  const [edit, setEdit] = useState(false);
  const mine = initial.reviews?.find((r) => r.reviewer === user.clerkUserId);
  const [notes, setNotes] = useState(mine?.notes || "");
  const [status, setStatus] = useState(initial.reviewStatus || "pending");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [stale, setStale] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeState, setResumeState] = useState(
    initial.resume ? "loading" : "empty",
  );

  const savedReview = doc.reviews?.find((r) => r.reviewer === user.clerkUserId);
  const dirty =
    !same(answers, doc.answers) ||
    notes !== (savedReview?.notes || "") ||
    status !== doc.reviewStatus ||
    !!reason;

  const backupKey = `winghacks:review:${user.clerkUserId}:${initial._id}`;
  const [backup, setBackup] = useState(() => loadBackup(localStorage, backupKey));
  const [backupError, setBackupError] = useState("");

  useEffect(() => {
    if (!dirty) return;
    try {
      localStorage.setItem(
        backupKey,
        JSON.stringify({
          answers,
          notes,
          status,
          reason,
          revision: doc.revision,
          expiresAt: Date.now() + BACKUP_TTL_MS,
        }),
      );
      setBackupError("");
    } catch {
      setBackupError(
        "Local review backup is unavailable. Download your working copy before leaving.",
      );
    }
  }, [dirty, answers, notes, status, reason, doc.revision, backupKey]);

  useEffect(() => {
    const leave = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [dirty]);

  useEffect(() => {
    if (!doc.resume) {
      setResumeState("empty");
      return undefined;
    }
    let active = true;
    let objectUrl = "";
    setResumeState("loading");
    api
      .get(`/applications/admin/${doc._id}/resume`, { responseType: "blob" })
      .then(({ data }) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(
          new Blob([data], { type: "application/pdf" }),
        );
        setResumeUrl(objectUrl);
        setResumeState("ready");
      })
      .catch(() => active && setResumeState("error"));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [api, doc._id, doc.resume]);

  const touch = (fn) => (e) => {
    fn(e.target.value);
  };

  const close = () => {
    if (
      !dirty ||
      window.confirm(
        "Close with unsaved review changes? Download a copy first if you need to keep them.",
      )
    ) {
      onClose();
    }
  };

  const update = async (action) => {
    setBusy(true);
    setError("");
    setErrors({});
    try {
      const { data } = await api.patch(`/applications/admin/${doc._id}`, {
        revision: doc.revision,
        action,
        reason,
        answers,
        notes,
        score: null,
        status,
      });
      setDoc(data);
      if (action === "edit") {
        setAnswers(data.answers);
        setEdit(false);
      }
      setStatus(data.reviewStatus);
      setReason("");
      setPendingAction(null);
      try {
        localStorage.removeItem(backupKey);
      } catch {}
      setBackup(null);
      onSaved();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Update not confirmed. Refresh before retrying.",
      );
      setErrors(e.response?.data?.errors || {});
      if (e.response?.status === 409 || !e.response) setStale(true);
    } finally {
      setBusy(false);
    }
  };

  const reload = async () => {
    try {
      const { data } = await api.get(`/applications/admin/${doc._id}`);
      setDoc(data);
      setStale(false);
      setError(
        "Latest version loaded. Your unsaved fields are still shown. Compare them with the saved copy before applying changes.",
      );
    } catch {
      setError("Unable to refresh. Please retry.");
    }
  };

  const safeAnswers = doc.answers || {};

  // Group fields for top-to-bottom reading
  const essays = (config.fields || []).filter((f) => f.type === "textarea");
  const personalFields = (config.fields || []).filter(
    (f) => f.section === "Personal information" && f.type !== "textarea",
  );
  const educationFields = (config.fields || []).filter(
    (f) => f.section === "Education & experience" && f.type !== "textarea",
  );
  const agreementFields = (config.fields || []).filter(
    (f) => f.section === "Review & agreements",
  );
  const editableSections = [
    ...new Set(
      (config.fields || [])
        .filter((field) => field.type !== "checkbox")
        .map((field) => field.section || "General"),
    ),
  ];

  return (
    <section
      className="admin-card admin-detail"
      aria-label="Application detail"
    >
      {/* Navigation & Action Bar */}
      <div className="admin-detail-header-bar">
        <button type="button" className="admin-btn" onClick={close}>
          <FiArrowLeft aria-hidden="true" />
          Close details
        </button>
        <div className="admin-toolbar-actions">
          <button
            type="button"
            className="admin-btn"
            onClick={() =>
              downloadFile(
                JSON.stringify({ answers, notes, reason }, null, 2),
                "review-backup.json",
              )
            }
          >
            <FiDownload aria-hidden="true" />
            Download working copy
          </button>
          <button
            type="button"
            className="admin-btn"
            disabled={!!doc.deletedAt}
            onClick={() => setEdit((v) => !v)}
          >
            <FiEdit3 aria-hidden="true" />
            {edit ? "Hide answer editor" : "Edit answers"}
          </button>
        </div>
      </div>

      {backupError && (
        <p role="alert" className="application-alert">
          {backupError}
        </p>
      )}

      {backup && (
        <div className="application-alert" role="alert">
          <p>Unsaved review work is available on this browser.</p>
          <div className="application-actions admin-compact-actions">
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => {
                setAnswers(backup.answers);
                setNotes(backup.notes);
                setStatus(backup.status);
                setReason(backup.reason);
                setEdit(true);
                if (backup.revision !== doc.revision) {
                  setStale(true);
                  setError(
                    "The server version changed. Load the latest version and compare your recovered work.",
                  );
                }
                setBackup(null);
              }}
            >
              Recover working copy
            </button>
            <button
              type="button"
              className="admin-btn"
              onClick={() =>
                downloadFile(
                  JSON.stringify(backup, null, 2),
                  "review-backup.json",
                )
              }
            >
              Download backup
            </button>
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                if (window.confirm("Discard the unsaved review backup?")) {
                  try {
                    localStorage.removeItem(backupKey);
                  } catch {}
                  setBackup(null);
                }
              }}
            >
              Discard backup
            </button>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="application-alert">
          <p>{error}</p>
          {stale && (
            <button type="button" className="admin-btn" onClick={reload}>
              Load latest version for comparison
            </button>
          )}
        </div>
      )}

      {/* Applicant identity */}
      <div className="admin-applicant-hero">
        <div className="admin-applicant-title-row">
          <h2>
            {safeAnswers.firstName || "Unknown"} {safeAnswers.lastName || ""}
          </h2>
          <span className={`admin-badge ${doc.reviewStatus}`}>
            {doc.reviewStatus?.replace("_", " ")}
          </span>
          <span className={`admin-badge state-${doc.state}`}>{doc.state}</span>
          {doc.deletedAt && (
            <span className="admin-badge state-trash">In trash</span>
          )}
        </div>
        <a className="admin-applicant-email" href={`mailto:${doc.email}`}>
          {doc.email}
        </a>
      </div>

      <dl className="admin-submission-meta" aria-label="Submission details">
        <div>
          <dt>Submitted</dt>
          <dd>
            {doc.submittedAt ? (
              <>
                <time dateTime={doc.submittedAt}>
                  {new Date(doc.submittedAt).toLocaleDateString([], {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span>
                  {new Date(doc.submittedAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </>
            ) : (
              "Not submitted"
            )}
          </dd>
        </div>
        <div>
          <dt>Application state</dt>
          <dd>{doc.state}</dd>
        </div>
        <div>
          <dt>Revision</dt>
          <dd>{doc.revision}</dd>
        </div>
      </dl>

      {/* Prominent Key Information Grid */}
      <div className="admin-key-grid">
        <div className="admin-key-tile">
          <span className="admin-key-label">School / University</span>
          <span className="admin-key-value">
            {safeAnswers.school === "Other"
              ? safeAnswers.schoolOther || "Other"
              : safeAnswers.school || "—"}
          </span>
        </div>
        <div className="admin-key-tile">
          <span className="admin-key-label">Major & Degree</span>
          <span className="admin-key-value">
            {safeAnswers.major || "—"}{" "}
            {safeAnswers.degree ? `(${safeAnswers.degree})` : ""}
          </span>
        </div>
        <div className="admin-key-tile">
          <span className="admin-key-label">Graduation Year</span>
          <span className="admin-key-value">
            {safeAnswers.graduationYear || "—"}
          </span>
        </div>
        <div className="admin-key-tile">
          <span className="admin-key-label">Hackathon Experience</span>
          <span className="admin-key-value">
            {safeAnswers.experience || "—"}
          </span>
        </div>
        <div className="admin-key-tile">
          <span className="admin-key-label">Discord Username</span>
          <span className="admin-key-value">{safeAnswers.discord || "—"}</span>
        </div>
        <div className="admin-key-tile">
          <span className="admin-key-label">Location</span>
          <span className="admin-key-value">
            {[safeAnswers.city, safeAnswers.country]
              .filter(Boolean)
              .join(", ") || "—"}
          </span>
        </div>
        <div className="admin-key-tile">
          <span className="admin-key-label">Pronouns</span>
          <span className="admin-key-value">
            {safeAnswers.pronouns === "Prefer to self-describe"
              ? safeAnswers.pronounsOther || "Self-described"
              : safeAnswers.pronouns || "—"}
          </span>
        </div>
        <div className="admin-key-tile">
          <span className="admin-key-label">Applicant Email</span>
          <span className="admin-key-value">
            <a href={`mailto:${doc.email}`}>{doc.email}</a>
          </span>
        </div>
      </div>

      {/* Protected in-browser resume preview */}
      {doc.resume && (
        <section
          className="admin-resume-section"
          aria-labelledby="admin-resume-heading"
        >
          <div className="admin-resume-header">
            <FiFileText className="admin-resume-icon" aria-hidden="true" />
            <div className="admin-resume-details">
              <h3 id="admin-resume-heading">Resume</h3>
              <strong>{doc.resume.name}</strong>
              <span>
                {doc.resume.size
                  ? `${(doc.resume.size / 1024).toFixed(1)} KB`
                  : "PDF"}
              </span>
            </div>
          </div>
          <div className="admin-resume-viewer">
            {resumeState === "loading" && <p role="status">Loading resume…</p>}
            {resumeState === "error" && (
              <p role="alert">
                The resume could not be displayed. Refresh and try again.
              </p>
            )}
            {resumeState === "ready" && (
              <iframe
                src={resumeUrl}
                title={`${safeAnswers.firstName || "Applicant"} resume`}
                sandbox=""
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </section>
      )}

      {/* External Profile Links */}
      {(safeAnswers.githubUrl ||
        safeAnswers.linkedinUrl ||
        safeAnswers.portfolioUrl ||
        safeAnswers.resumeUrl) && (
        <div className="admin-links-strip">
          {safeAnswers.githubUrl && (
            <a
              href={safeAnswers.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="admin-link-pill"
            >
              <FiExternalLink aria-hidden="true" />
              GitHub Profile
            </a>
          )}
          {safeAnswers.linkedinUrl && (
            <a
              href={safeAnswers.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="admin-link-pill"
            >
              <FiExternalLink aria-hidden="true" />
              LinkedIn Profile
            </a>
          )}
          {safeAnswers.portfolioUrl && (
            <a
              href={safeAnswers.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="admin-link-pill"
            >
              <FiExternalLink aria-hidden="true" />
              Portfolio / Website
            </a>
          )}
          {safeAnswers.resumeUrl && (
            <a
              href={safeAnswers.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="admin-link-pill"
            >
              <FiExternalLink aria-hidden="true" />
              External Resume Link
            </a>
          )}
        </div>
      )}

      {/* Answer Editor or Top-to-Bottom Reading Display */}
      {edit ? (
        <div className="admin-edit-container">
          <p className="admin-editor-note">
            Applicant agreements are preserved. Reopen the application if the
            applicant needs to change consent.
          </p>
          <div className="admin-edit-sections">
            {editableSections.map((section) => (
              <section
                key={section}
                className="admin-edit-section"
                aria-labelledby={`edit-${section.replace(/\W+/g, "-").toLowerCase()}`}
              >
                <h3 id={`edit-${section.replace(/\W+/g, "-").toLowerCase()}`}>
                  {section}
                </h3>
                <ApplicationFields
                  idPrefix="review-answer"
                  fields={config.fields.filter(
                    (field) =>
                      field.type !== "checkbox" &&
                      (field.section || "General") === section,
                  )}
                  answers={answers}
                  onChange={(key, value) =>
                    setAnswers((current) => ({ ...current, [key]: value }))
                  }
                  errors={errors}
                  disabled={busy || stale}
                />
              </section>
            ))}
          </div>
          <div className="application-actions admin-editor-actions">
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={busy || stale || !reason.trim()}
              onClick={() => update("edit")}
            >
              Save answer corrections
            </button>
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                setAnswers(doc.answers);
                setEdit(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-responses-top-to-bottom">
          {/* Section 1: Personal Information */}
          <div className="admin-section-block">
            <h3 className="admin-section-header">
              <FiUser aria-hidden="true" />
              Personal Information
            </h3>
            <div className="admin-response-grid">
              {personalFields.map((f) => {
                if (
                  f.key === "pronounsOther" &&
                  safeAnswers.pronouns !== "Prefer to self-describe"
                )
                  return null;
                const val = safeAnswers[f.key];
                return (
                  <div key={f.key} className="admin-response-item">
                    <span className="admin-response-label">{f.label}</span>
                    <span className="admin-response-value">{val || "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Education & Experience */}
          <div className="admin-section-block">
            <h3 className="admin-section-header">
              <FiBookOpen aria-hidden="true" />
              Education & Experience
            </h3>
            <div className="admin-response-grid">
              {educationFields.map((f) => {
                if (f.key === "schoolOther" && safeAnswers.school !== "Other")
                  return null;
                const val = safeAnswers[f.key];
                return (
                  <div key={f.key} className="admin-response-item">
                    <span className="admin-response-label">{f.label}</span>
                    <span className="admin-response-value">{val || "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Short Answers (Spacious Reading Typography) */}
          <div className="admin-section-block">
            <h3 className="admin-section-header">
              <FiFileText aria-hidden="true" />
              Short Answers
            </h3>
            {essays.map((f) => {
              const val = safeAnswers[f.key];
              return (
                <article key={f.key} className="admin-essay-card">
                  <div className="admin-essay-question-row">
                    <h4 className="admin-essay-title">{f.label}</h4>
                    <span className="admin-essay-chars">
                      {val ? `${val.length} chars` : "No response"}
                    </span>
                  </div>
                  <div className="admin-essay-body">
                    {val || (
                      <span className="admin-empty-value">Not provided</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Section 4: Agreements */}
          <div className="admin-section-block">
            <h3 className="admin-section-header">
              <FiCheckCircle aria-hidden="true" />
              Agreements & Consents
            </h3>
            <div className="admin-response-grid">
              {agreementFields.map((f) => {
                const val = safeAnswers[f.key];
                return (
                  <div key={f.key} className="admin-response-item">
                    <span className="admin-response-label">{f.label}</span>
                    <span className="admin-response-value admin-response-confirmation">
                      {val === true
                        ? "✓ Confirmed"
                        : val === false
                          ? "✗ No"
                          : "Not provided"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Organizer Decision & Review Card (Score dropdown removed) */}
      <section className="admin-decision-box" aria-label="Review and decision">
        <h3>Review & Decision</h3>
        <p className="admin-decision-subtext">
          Decisions appear in the hacker portal immediately. This action does
          not send email.
        </p>

        <div className="admin-decision-fields">
          <label>
            Application Decision Status
            <select
              className="admin-select"
              value={status}
              onChange={touch(setStatus)}
            >
              {config.statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <label>
            Your private reviewer notes
            <textarea
              className="admin-textarea"
              rows={4}
              maxLength={5000}
              placeholder="Add internal notes about this applicant..."
              value={notes}
              onChange={touch(setNotes)}
            />
          </label>

          <label>
            Reason for this change (required for audit logging)
            <textarea
              className="admin-textarea"
              rows={2}
              maxLength={1000}
              placeholder="e.g. Accepted after holistic application review"
              value={reason}
              onChange={touch(setReason)}
            />
          </label>
        </div>

        <div className="application-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={
              busy ||
              stale ||
              !reason.trim() ||
              doc.state !== "submitted" ||
              !!doc.deletedAt
            }
            onClick={() => update("review")}
          >
            Save review & status
          </button>
          <button
            type="button"
            className="admin-btn"
            disabled={
              busy ||
              stale ||
              !reason.trim() ||
              doc.state !== "submitted" ||
              !!doc.deletedAt
            }
            onClick={() => setPendingAction("reopen")}
          >
            Reopen for applicant
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            disabled={busy || stale || !reason.trim()}
            onClick={() =>
              setPendingAction(doc.deletedAt ? "restore" : "delete")
            }
          >
            {doc.deletedAt ? "Restore application" : "Move to trash"}
          </button>
        </div>

        {pendingAction && (
          <div className="application-alert admin-confirmation" role="alert">
            <p>
              {pendingAction === "delete"
                ? "Move this application to recoverable trash? The hacker will be unable to edit it until restored."
                : pendingAction === "reopen"
                  ? "Reopen this application for editing? Its decision will reset and the applicant must submit again."
                  : "Restore this application and its previous decision?"}
            </p>
            <div className="application-actions admin-compact-actions">
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={busy}
                onClick={() => update(pendingAction)}
              >
                Confirm {pendingAction}
              </button>
              <button
                type="button"
                className="admin-btn"
                onClick={() => setPendingAction(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Collapsible History and Previous Team Reviews */}
        <div className="admin-collapsible">
          {doc.reviews?.length > 0 && (
            <details>
              <summary>Team reviews ({doc.reviews.length})</summary>
              <div className="admin-collapsible-content">
                {doc.reviews.map((r) => (
                  <article key={r.reviewer} className="admin-audit-entry">
                    <strong>
                      Reviewer: {r.reviewerProfile?.name || r.reviewer}
                      {r.reviewerProfile?.admin ? " (Admin)" : ""}
                    </strong>
                    <p className="admin-review-note">
                      {r.notes || "No notes left"}
                    </p>
                    <small className="admin-review-time">
                      {new Date(r.updatedAt).toLocaleString()}
                    </small>
                  </article>
                ))}
              </div>
            </details>
          )}

          <details>
            <summary>Audit trail ({doc.audit?.length || 0} events)</summary>
            <div className="admin-collapsible-content">
              {[...(doc.audit || [])].reverse().map((a, i) => (
                <div key={i} className="admin-audit-entry">
                  <strong>
                    {new Date(a.at).toLocaleString()} · {a.type}
                  </strong>{" "}
                  by {a.actorProfile?.name || a.actor}
                  {a.actorProfile?.admin ? " (Admin)" : ""}
                  {a.reason && (
                    <p className="admin-audit-reason">Reason: {a.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>
    </section>
  );
}

export default function AdminApplications() {
  const { user } = useSession();
  if (user?.admin !== true) {
    return (
      <section className="portal-card" role="alert">
        <h2>Organizer access only</h2>
        <p>You do not have permission to review applications.</p>
      </section>
    );
  }
  return <AdminWorkspace />;
}

function AdminWorkspace() {
  const { api, user } = useSession();
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState({
    q: "",
    status: "",
    state: "submitted",
    trash: "false",
    sort: "newest",
    page: 1,
  });
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .get("/applications/config")
      .then((r) => active && setConfig(r.data))
      .catch(() => active && setError("Unable to load configuration."));
    return () => {
      active = false;
    };
  }, [api]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .get("/applications/admin", {
          params: query,
          signal: controller.signal,
        })
        .then((r) => {
          setResult(r.data);
          setError("");
        })
        .catch((e) => {
          if (!controller.signal.aborted) {
            setError(
              e.response?.data?.message || "Unable to load applications.",
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [api, query, reload]);

  const filter = (key, value) =>
    setQuery((q) => ({ ...q, [key]: value, page: 1 }));

  const openDetail = async (id) => {
    try {
      const r = await api.get(`/applications/admin/${id}`);
      setDetail(r.data);
    } catch {
      setError("Unable to load application details.");
    }
  };

  return (
    <section
      className="admin-applications"
      aria-label="Application review workspace"
    >
      <header className="admin-header">
        <h2>Review Applications</h2>
      </header>

      {error && (
        <p role="alert" className="application-alert">
          {error}
        </p>
      )}

      {detail && config ? (
        <ApplicationDetail
          key={detail._id}
          initial={detail}
          config={config}
          api={api}
          user={user}
          onClose={() => setDetail(null)}
          onSaved={() => setReload((v) => v + 1)}
        />
      ) : (
        <section className="admin-card">
          {/* Filters Bar */}
          <div className="admin-filters">
            <label>
              Search
              <input
                type="search"
                placeholder="Name, email, or school..."
                value={query.q}
                onChange={(e) => filter("q", e.target.value)}
              />
            </label>
            <label>
              Status
              <select
                value={query.status}
                onChange={(e) => filter("status", e.target.value)}
              >
                <option value="">All statuses</option>
                {config?.statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label>
              State
              <select
                value={query.state}
                onChange={(e) => filter("state", e.target.value)}
              >
                <option value="submitted">Submitted</option>
                <option value="draft">Drafts</option>
              </select>
            </label>
            <label>
              Location
              <select
                value={query.trash}
                onChange={(e) => filter("trash", e.target.value)}
              >
                <option value="false">Active</option>
                <option value="true">Trash</option>
              </select>
            </label>
            <label>
              Sort
              <select
                value={query.sort}
                onChange={(e) => filter("sort", e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          {/* Action Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-actions">
              <button
                type="button"
                className="admin-btn"
                onClick={() => setReload((v) => v + 1)}
              >
                <FiRefreshCw aria-hidden="true" />
                Refresh
              </button>
              <button
                type="button"
                className="admin-btn"
                onClick={async () => {
                  try {
                    const r = await api.get("/applications/admin/export", {
                      params: query,
                      responseType: "blob",
                    });
                    downloadFile(r.data, "winghacks-applications.csv");
                  } catch {
                    setError("CSV export failed.");
                  }
                }}
              >
                <FiDownload aria-hidden="true" />
                Export filtered CSV
              </button>
            </div>
            <span className="admin-count-pill" role="status">
              {loading
                ? "Loading…"
                : `${result?.total || 0} matching applications`}
            </span>
          </div>

          {/* Table List View */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>School</th>
                  <th>Major & Year</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {result?.items.map((doc) => {
                  const answers = doc.answers || {};
                  return (
                    <tr key={doc._id}>
                      <td>
                        <span className="admin-table-applicant-name">
                          {answers.firstName} {answers.lastName}
                        </span>
                        <span className="admin-table-applicant-email">
                          {doc.email}
                        </span>
                      </td>
                      <td>{answers.school || "—"}</td>
                      <td>
                        {answers.major || "—"}
                        {answers.graduationYear
                          ? ` · ${answers.graduationYear}`
                          : ""}
                      </td>
                      <td>
                        <span className={`admin-badge ${doc.reviewStatus}`}>
                          {doc.reviewStatus?.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        {doc.submittedAt
                          ? new Date(doc.submittedAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Draft"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary admin-open-button"
                          onClick={() => openDetail(doc._id)}
                        >
                          Open application
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && result?.total === 0 && (
            <p className="admin-empty-state">
              No applications match these filters.
            </p>
          )}

          {/* Pagination */}
          <div className="admin-pagination">
            <button
              type="button"
              className="admin-btn"
              disabled={loading || query.page <= 1}
              onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
            >
              Previous
            </button>
            <span className="admin-page-count">
              Page {query.page} of{" "}
              {Math.max(1, Math.ceil((result?.total || 0) / 25))}
            </span>
            <button
              type="button"
              className="admin-btn"
              disabled={loading || query.page * 25 >= (result?.total || 0)}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
            >
              Next
            </button>
          </div>
        </section>
      )}
    </section>
  );
}
