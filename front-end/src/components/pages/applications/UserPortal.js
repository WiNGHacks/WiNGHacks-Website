import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiBookOpen,
  FiFileText,
  FiLogOut,
  FiMapPin,
  FiCalendar,
  FiCheck,
  FiRefreshCw,
  FiMail,
  FiExternalLink,
} from "react-icons/fi";
import { useSession } from "../../auth/SessionProvider";
import RSVPForm from "./RSVPForm";
import PortalLocation from "./PortalLocation";
import flower from "../../pictures/meadow/about-flower-bloom.webp";
import "../MeadowHome.css";
import "./UserPortal.css";

const states = {
  "Not Applied": {
    label: "Not applied",
    text: "You haven’t submitted an application yet.",
    step: 0,
    tone: "peach",
  },
  Applied: {
    label: "Application received",
    text: "Your application is under review. Check here for your decision.",
    step: 1,
    tone: "lavender",
  },
  Waitlisted: {
    label: "Waitlisted",
    text: "We’ll email you if a spot becomes available.",
    step: 2,
    tone: "lavender",
  },
  Accepted: {
    label: "Accepted",
    text: "Complete your RSVP below to confirm whether you’ll attend.",
    step: 3,
    tone: "sage",
  },
  Rejected: {
    label: "Not selected",
    text: "We’re unable to offer you a spot this time. Thank you for applying.",
    step: 2,
    tone: "peach",
  },
};

export function applicationState(user) {
  if (user.status === "Accepted" && user.acceptedRSVP === "yes")
    return {
      label: "Attendance confirmed",
      text: "Your RSVP is saved. Arrival details will be sent to your email.",
      step: 4,
      tone: "sage",
    };
  if (user.status === "Accepted" && user.acceptedRSVP === "no")
    return {
      label: "Offer declined",
      text: "Your decision not to attend has been saved.",
      step: 4,
      tone: "peach",
    };
  return (
    states[user.status] || {
      label: "Status unavailable",
      text: "Refresh your status or contact the team if this continues.",
      step: -1,
      tone: "peach",
    }
  );
}

export function timelineStep(user) {
  if (user.status === "Accepted") return 3;
  if (["Waitlisted", "Rejected"].includes(user.status)) return 2;
  if (user.status === "Applied") return 1;
  return user.status === "Not Applied" ? 0 : -1;
}

function Information({ user, state, openApplication }) {
  const currentStep = timelineStep(user);
  const milestones = [
    ["Application", "Complete your hacker application when applications open."],
    [
      "Application review",
      "Our team reviews your application. Your status will update in the Application tab.",
    ],
    [
      "Decision released",
      "Find your acceptance, waitlist, or decision in your portal and account email.",
    ],
    [
      "Confirm attendance",
      user.acceptedRSVP === "yes"
        ? "Your attendance is confirmed. We can’t wait to see you!"
        : user.acceptedRSVP === "no"
          ? "You’ve declined your offer. Thank you for letting us know."
          : "If accepted, complete your RSVP to confirm whether you’ll attend.",
    ],
    ["Event day", "Meet your fellow hackers and bring your ideas to life."],
  ];
  return (
    <>
      <section className="portal-welcome">
        <div>
          <h1>
            Welcome to the
            <br />
            meadow, {user.firstName || "hacker"}.
          </h1>
          <button className="portal-button" onClick={openApplication}>
            View my application <FiFileText aria-hidden="true" />
          </button>
        </div>
        <img className="portal-welcome-flower" src={flower} alt="" />
      </section>
      <div className="portal-info-stack">
        <section className="portal-card portal-about">
          <h2>WiNGHacks</h2>
          <p>
            WiNGHacks is a student led hackathon at the University of Florida
            celebrating women, nonbinary, and gender nonconforming people in
            technology. Come to learn, create, and connect. Whether it’s your
            first line of code or your next big project, build it here!
          </p>
        </section>
        <section className="portal-card portal-timeline">
          <div className="portal-section-heading">
            <div>
              <h2>Timeline</h2>
              <p>
                Dates will be announced. Your progress is highlighted below.
              </p>
            </div>
            <FiCalendar aria-hidden="true" />
          </div>
          <ol aria-label="Your hacker timeline">
            {milestones.map(([title, detail], index) => (
              <li
                key={title}
                className={
                  index < currentStep
                    ? "is-complete"
                    : index === currentStep
                      ? "is-current"
                      : ""
                }
                aria-current={index === currentStep ? "step" : undefined}
              >
                <span className="portal-timeline-number" aria-hidden="true">
                  {index < currentStep ? <FiCheck /> : index + 1}
                </span>
                <div className="portal-milestone">
                  <span className="portal-date">Date to be announced</span>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                  {index === currentStep && (
                    <span className={`portal-status ${state.tone}`}>
                      {state.label}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="portal-card portal-location">
          <div className="portal-section-heading">
            <div>
              <h2>Event location</h2>
              <p>University of Florida · Gainesville, Florida</p>
            </div>
            <FiMapPin aria-hidden="true" />
          </div>
          <PortalLocation />
          <p className="portal-small">
            The pin marks Newell Hall. Room and event check-in details will be
            shared here.
          </p>
        </section>
      </div>
    </>
  );
}

function Application({ user, state, refresh, refreshing, error, onRSVP }) {
  const candidate = process.env.REACT_APP_APPLICATION_FORM || "";
  const formUrl = /^https:\/\//i.test(candidate) ? candidate : null;
  const needsRSVP =
    user.status === "Accepted" && !["yes", "no"].includes(user.acceptedRSVP);
  return (
    <>
      <div className="portal-page-heading">
        <h1>My application</h1>
      </div>
      <section
        className={`portal-application-banner ${state.tone}`}
        aria-label="Application status"
      >
        <h2>{state.label}</h2>
        <p>{state.text}</p>
      </section>
      <ol className="portal-progress" aria-label="Application progress">
        {["Apply", "Review", "Decision", "RSVP"].map((label, index) => (
          <li
            key={label}
            className={
              index < state.step
                ? "complete"
                : index === state.step
                  ? "current"
                  : ""
            }
            aria-current={index === state.step ? "step" : undefined}
          >
            <span>
              {index < state.step ? (
                <FiCheck aria-label="Completed" />
              ) : (
                index + 1
              )}
            </span>
            {label}
          </li>
        ))}
      </ol>
      <div className="portal-application-grid">
        <section className="portal-card">
          <div className="portal-section-heading">
            <h2>Applicant details</h2>
            <FiFileText aria-hidden="true" />
          </div>
          <dl className="portal-details">
            <div>
              <dt>Name</dt>
              <dd>
                {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  "Hacker"}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{state.label}</dd>
            </div>
          </dl>
          {user.status === "Not Applied" ? (
            <div className="portal-form-entry">
              <h3>
                {formUrl ? "Application form" : "Applications are coming soon."}
              </h3>
              <p>
                {formUrl
                  ? "Use your account email and submit only once."
                  : "The form will be available here when applications open."}
              </p>
              {formUrl && (
                <a
                  className="portal-button"
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open application form <FiExternalLink aria-hidden="true" />
                </a>
              )}
            </div>
          ) : (
            state.step >= 1 && (
              <div className="portal-form-entry">
                <p>
                  To update your submitted answers, email the team from your
                  account email.
                </p>
              </div>
            )
          )}
          <button
            className="portal-text-button"
            onClick={refresh}
            disabled={refreshing}
          >
            <FiRefreshCw aria-hidden="true" />{" "}
            {refreshing ? "Checking…" : "Refresh status"}
          </button>
          {error && (
            <p className="portal-error" role="alert">
              {error}
            </p>
          )}
        </section>
        <aside className="portal-little-note">
          <h2>Have questions?</h2>
          <p>Contact us about your application or accessibility needs.</p>
          <a
            className="portal-text-button"
            href="mailto:uf.winghacks@gmail.com"
          >
            <FiMail aria-hidden="true" /> Email the team
          </a>
        </aside>
      </div>
      {needsRSVP && (
        <section className="portal-card portal-rsvp">
          <h2>RSVP</h2>
          <RSVPForm
            id={user._id}
            firstName={user.firstName}
            lastName={user.lastName}
            setAlreadyRSVP={() => {}}
            setRSVPStatus={onRSVP}
          />
        </section>
      )}
    </>
  );
}

export default function UserPortal() {
  const { user: sessionUser, api, signOut } = useSession();
  const [user, setUser] = useState(sessionUser);
  const [params, setParams] = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  useEffect(() => {
    setUser(sessionUser);
  }, [sessionUser]);
  if (!user) return null;
  const active =
    params.get("tab") === "application" ? "application" : "information";
  const state = applicationState(user);
  const refresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch {
      setError("We couldn’t refresh your status. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };
  const logout = async () => {
    try {
      await signOut();
    } catch {
      setLogoutError("Unable to sign out. Please try again.");
    }
  };
  return (
    <div className="meadow-site hacker-portal">
      <a className="meadow-skip" href="#portal-content">
        Skip to content
      </a>
      <aside className="portal-sidebar">
        <Link
          to="/"
          className="portal-logo portal-pastel-wordmark"
          aria-label="WiNGHacks home"
        >
          <span aria-hidden="true">
            {Array.from("WiNGHacks").map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </span>
        </Link>
        <p className="portal-sidebar-caption">Hacker portal</p>
        <nav aria-label="Portal menu">
          <Link
            to="/portal"
            aria-current={active === "information" ? "page" : undefined}
          >
            <FiBookOpen aria-hidden="true" />
            <span>Information</span>
          </Link>
          <Link
            to="/portal?tab=application"
            aria-current={active === "application" ? "page" : undefined}
          >
            <FiFileText aria-hidden="true" />
            <span>Application</span>
          </Link>
        </nav>
        <div className="portal-sidebar-bottom">
          <Link to="/" className="portal-back">
            Back to WiNGHacks
          </Link>
          <div className="portal-account">
            <span className="portal-avatar" aria-hidden="true">
              {user.firstName?.charAt(0) || "W"}
            </span>
            <div>
              <strong>{user.firstName || "Hacker"}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button className="portal-signout" onClick={logout}>
            <FiLogOut aria-hidden="true" />
            <span>Sign out</span>
          </button>
          {logoutError && <p role="alert">{logoutError}</p>}
        </div>
      </aside>
      <main id="portal-content" className="portal-main" tabIndex={-1}>
        {active === "information" ? (
          <Information
            user={user}
            state={state}
            openApplication={() => setParams({ tab: "application" })}
          />
        ) : (
          <Application
            user={user}
            state={state}
            refresh={refresh}
            refreshing={refreshing}
            error={error}
            onRSVP={(acceptedRSVP) =>
              setUser((current) => ({ ...current, acceptedRSVP }))
            }
          />
        )}
        <footer className="portal-footer">
          A little space to grow. Made with care by WiNGHacks.
        </footer>
      </main>
    </div>
  );
}
