import React, { useState, useEffect, useRef } from "react";
import { MemberList } from "../data/MemberList";
import airplaneVideo from "../pictures/meadow/airplane-loop.mp4";
import airplanePoster from "../pictures/meadow/airplane-poster.webp";
import heroWindow from "../pictures/meadow/hero-watercolor-window.webp";
import photo from "../pictures/2024_Gallery/Hackers2.webp";
import community from "../pictures/2024_Gallery/Organizers_Group.webp";
import workshop from "../pictures/2024_Gallery/React_Workshop_Cami.webp";
import "./MeadowHome.css";
import BloomProfile from "./BloomProfile";
import gator from "../pictures/meadow/gator.webp";
import watercolorFlowerPot from "../pictures/meadow/watercolor-flower-pot.webp";
import watercolorShovel from "../pictures/meadow/watercolor-shovel.webp";
import aboutFlowerSeedling from "../pictures/meadow/about-flower-seedling.webp";
import aboutFlowerBloom from "../pictures/meadow/about-flower-bloom.webp";
import bulletinWide from "../pictures/meadow/community-bulletin-wide.webp";
import bulletinMobile from "../pictures/meadow/community-bulletin-mobile.webp";

const email = "mailto:uf.winghacks@gmail.com";
const tracks = [
  [
    "01",
    "First Flight",
    "Your first hackathon. Your first big idea. A space to try something new.",
    "♡",
  ],
  [
    "02",
    "WiNG Track",
    "Build for women, gender minorities, and communities that deserve to be heard.",
    "❀",
  ],
  [
    "03",
    "Best UI/UX",
    "Make technology feel a little more thoughtful, intuitive, and human.",
    "⌘",
  ],
  [
    "04",
    "Game Track",
    "Invent a world, tell a story, or make something wonderfully fun.",
    "⚑",
  ],
];
const faqs = [
  [
    "What exactly is a hackathon?",
    "Think of it as an invention marathon with friends. Build a project, learn in workshops, meet mentors, and share what you made. You can bring an idea or discover one here.",
  ],
  [
    "I’m a beginner. Is this for me?",
    "Absolutely. WiNGHacks was created to make getting started feel welcoming. Our workshops, mentors, and fellow hackers can help you turn curiosity into your first project.",
  ],
  [
    "Who can participate?",
    "WiNGHacks uplifts women, nonbinary, and gender-nonconforming students in technology. The previous edition welcomed UF and Santa Fe College students aged 18 and older. Eligibility for the next edition will be announced with applications.",
  ],
  [
    "How much does it cost?",
    "Completely free to attend! We have meals provided during the event but unfortuantely no transportation reimbursement. More details will be confirmed when applications open.",
  ],
  [
    "Do I need a team?",
    "You can come solo! We allow teams of 1–4 and offered a team formation social. We’ll share the next edition’s team guidelines with registration.",
  ],
  [
    "What should I bring?",
    "A laptop, charger, and your curiosity are a good start. The confirmed packing list, check-in requirements, and venue details will be shared before the event.",
  ],
  [
    "What about accessibility and dietary needs?",
    "Contact uf.winghacks@gmail.com to discuss access, dietary, or other participation needs with the organizers before attending.",
  ],
  [
    "When and where is the next WiNGHacks?",
    "The next edition’s dates, venue, application timeline, and detailed schedule are coming soon. Follow @winghacks on Instagram for announcements.",
  ],
];

function Sparkle({ className = "" }) {
  return (
    <svg
      className={`meadow-sparkle ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path d="M50 3 Q57 35 70 18 Q67 40 97 50 Q65 58 82 74 Q60 68 50 97 Q42 65 24 83 Q33 60 3 50 Q35 42 18 24 Q40 32 50 3Z" />
    </svg>
  );
}

function Flower({ active, member }) {
  const portraitRef = useRef(null);
  const [portraitVisible, setPortraitVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPortraitVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(portraitRef.current);
    return () => observer.disconnect();
  }, []);
  const portraitClipId = `flower-portrait-${member.id}`;
  const flowerVariant = Number(member.id) || 0;
  const petalCount = 5;
  const petalOffset = (flowerVariant % 4) * 11;
  const leafPath =
    flowerVariant % 2 === 0
      ? "M67 143 Q25 141 32 116 Q61 118 67 143 M66 165 Q101 162 108 139 Q78 136 66 165"
      : "M66 165 Q24 164 31 140 Q61 140 66 165 M67 143 Q104 139 108 116 Q78 115 67 143";
  return (
    <svg
      ref={portraitRef}
      viewBox="0 0 140 190"
      aria-hidden="true"
      className={`garden-flower ${active ? "is-bloomed" : ""}`}
    >
      <defs>
        <clipPath id={portraitClipId}>
          <circle cx="70" cy="70" r="26" />
        </clipPath>
      </defs>
      <path className="stem" d="M70 180 Q60 125 70 70" />
      <path className="leaf" d={leafPath} />
      <g className="petals">
        {Array.from({ length: petalCount }, (_, i) => (
          <ellipse
            key={i}
            cx="70"
            cy="42"
            rx="24"
            ry="27"
            transform={`rotate(${petalOffset + i * (360 / petalCount)} 70 70)`}
          />
        ))}
      </g>
      <image
        className="flower-portrait-image"
        href={portraitVisible ? member.profile_pic : undefined}
        x="44"
        y="44"
        width="52"
        height="52"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${portraitClipId})`}
      />
    </svg>
  );
}

export default function MeadowHome() {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const aboutFlowerRef = useRef(null);
  const [aboutBloomed, setAboutBloomed] = useState(false);
  useEffect(() => {
    const flower = aboutFlowerRef.current;
    if (!flower) return;
    let bloomTimer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(bloomTimer);
        if (entry.isIntersecting && entry.intersectionRatio >= 0.85) {
          bloomTimer = window.setTimeout(() => setAboutBloomed(true), 650);
        } else {
          if (!entry.isIntersecting) setAboutBloomed(false);
        }
      },
      { threshold: [0, 0.85], rootMargin: "-90px 0px -40px 0px" },
    );
    observer.observe(flower);
    return () => {
      window.clearTimeout(bloomTimer);
      observer.disconnect();
    };
  }, []);
  const [videoFailed, setVideoFailed] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;
    let disposed = false;
    const updatePlayback = (visible) => {
      if (motionPaused || reduceMotion || !visible || document.hidden) {
        video.pause();
      } else {
        video.play().catch((error) => {
          if (!disposed && error.name !== "AbortError") setMotionPaused(true);
        });
      }
    };
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback(visible);
    });
    observer.observe(video);
    const onVisibility = () => updatePlayback(visible);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, [motionPaused, reduceMotion, videoFailed]);
  const [menu, setMenu] = useState(false);
  const headerRef = useRef(null);
  const menuToggleRef = useRef(null);
  useEffect(() => {
    if (!menu) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuToggleRef.current?.focus();
      }
    };
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenu(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [menu]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [bloomOrigin, setBloomOrigin] = useState({
    x: 0,
    y: 0,
    color: "#eeb6bc",
  });
  const flowerTrigger = useRef(null);
  const openBloom = (id, target, color) => {
    const rect = target.getBoundingClientRect();
    flowerTrigger.current = target;
    setBloomOrigin({
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height * 0.35 - window.innerHeight / 2,
      color,
    });
    setSelected(id);
  };
  const closeBloom = () => {
    setSelected(null);
    flowerTrigger.current?.focus({ preventScroll: true });
  };
  const [day, setDay] = useState(0);
  const [greeting, setGreeting] = useState(false);
  const [idea, setIdea] = useState(0);
  const member = MemberList.find((m) => m.id === selected);
  const groups = ["All", ...new Set(MemberList.map((m) => m.committee_name))];
  const members = MemberList.filter(
    (m) => filter === "All" || m.committee_name === filter,
  );
  const ideas = [
    "A little idea can become something big.",
    "What could you build to help someone feel included?",
    "What everyday problem would you love to solve?",
    "What if learning something new felt like a game?",
  ];
  const days = [
    [
      [
        "Meet your team",
        "Check in, find a team, and get inspired at opening ceremonies.",
      ],
      [
        "Plant an idea",
        "Brainstorm together and start building something you care about.",
      ],
    ],
    [
      [
        "Learn as you grow",
        "Explore workshops, ask mentors questions, and try a new skill.",
      ],
      [
        "Make room for play",
        "Take a break, meet other hackers, and return with a fresh perspective.",
      ],
    ],
    [
      [
        "Show what you made",
        "Put the finishing touches on your project and share your demo.",
      ],
      [
        "Celebrate every first",
        "Cheer for your community and leave with new connections.",
      ],
    ],
  ];
  return (
    <div
      id="page-top"
      ref={sceneRef}
      className={`meadow-site playful-meadow ${motionPaused || reduceMotion ? "motion-paused" : ""}`}
    >
      <button
        className="motion-toggle"
        onClick={() => setMotionPaused(!motionPaused)}
        aria-pressed={motionPaused || reduceMotion}
        disabled={reduceMotion}
      >
        {reduceMotion
          ? "Motion reduced"
          : motionPaused
            ? "✿ Play motion"
            : "Ⅱ Pause motion"}
      </button>
      <a className="meadow-skip" href="#main">
        Skip to content
      </a>
      <header
        ref={headerRef}
        className="meadow-header"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setMenu(false);
        }}
      >
        <button
          ref={menuToggleRef}
          className="menu-toggle"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="meadow-nav"
          aria-label={menu ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <a
          href="#page-top"
          className="meadow-wordmark"
          aria-label="WiNGHacks home"
          onClick={() => setMenu(false)}
        >
          WiNGHacks
          <span className="wordmark-dot" aria-hidden="true">
            ✿
          </span>
        </a>
        <nav
          id="meadow-nav"
          className={menu ? "open" : ""}
          aria-label="Main navigation"
        >
          {[
            ["About", "about"],
            ["Experience", "experience"],
            ["Schedule", "schedule"],
            ["Our team", "team"],
            ["FAQ", "faq"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
          <a href="#join" className="nav-join" onClick={() => setMenu(false)}>
            Stay in the loop
          </a>
        </nav>
      </header>
      <a
        id="mlh-trust-badge"
        className="meadow-mlh-badge"
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-blue.svg"
          alt="Major League Hacking 2026 Hackathon Season"
        />
      </a>
      <main id="main">
        <section className="meadow-hero" aria-labelledby="hero-title">
          <div className="hero-film" aria-hidden="true">
            <div className="hero-window-opening">
              {!reduceMotion && !videoFailed && (
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={airplanePoster}
                  onError={() => setVideoFailed(true)}
                >
                  <source src={airplaneVideo} type="video/mp4" />
                </video>
              )}
            </div>
            <img
              className="hero-window-frame"
              src={heroWindow}
              alt=""
              width="1450"
              height="1085"
              draggable="false"
            />
          </div>
          <div className="hero-event">
            <p className="hero-school">University of Florida</p>
            <h1 id="hero-title" className="hero-title" aria-label="WiNGHacks">
              <span aria-hidden="true">
                {Array.from("WiNGHacks").map((letter, i) => (
                  <span
                    className="bouncy-letter"
                    key={i}
                    style={{ "--letter": i }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
            <p className="hero-intro">
              <em>A little curiosity.</em>
              <br />A world of possibility.
            </p>
            <p className="hero-description">
              A welcoming hackathon for women and gender minorities. Bring your
              ideas. Find your people. Make something you love.
            </p>
            <div className="hero-details" aria-label="Event details">
              <div className="hero-detail">
                <span>Date</span>
                {/* <strong>February 20–22, 2026</strong> */}
                <strong>TBD</strong>
              </div>
              <div className="hero-detail">
                <span>Location</span>
                <strong>Newell Hall — Gainesville, FL</strong>
              </div>
            </div>
            <div className="hero-actions">
              <a
                className="hero-button hero-button-primary"
                href={process.env.REACT_APP_APPLICATION_FORM || "/signup"}
              >
                Apply Now
                <span aria-hidden="true">→</span>
              </a>
              <a
                className="hero-button hero-button-secondary"
                href={`${email}?subject=WiNGHacks%20volunteering`}
              >
                Sign up to Volunteer
              </a>
            </div>
          </div>
          <a className="hero-scroll" href="#about">
            Let’s grow something <span aria-hidden="true">↓</span>
          </a>
        </section>
        <section id="about" className="meadow-section about-section">
          <div className="about-art">
            <div
              ref={aboutFlowerRef}
              className={`about-bloom${aboutBloomed ? " is-bloomed" : ""}`}
              role="img"
              aria-label="A watercolor flower blooming — ideas grow here"
            >
              <img
                loading="lazy"
                decoding="async"
                className="about-bloom-stage about-bloom-base"
                src={aboutFlowerSeedling}
                alt=""
                aria-hidden="true"
              />
              <img
                loading="lazy"
                decoding="async"
                className="about-bloom-stage about-bloom-bud"
                src={aboutFlowerSeedling}
                alt=""
                aria-hidden="true"
              />
              <img
                loading="lazy"
                decoding="async"
                className="about-bloom-stage about-bloom-flower"
                src={aboutFlowerBloom}
                alt=""
                aria-hidden="true"
              />
              <span className="about-bloom-message">
                ideas
                <br />
                grow here
              </span>
            </div>
          </div>
          <div>
            <h2>
              Build boldly.
              <br />
              <em>Grow together.</em>
            </h2>
            <p>
              WiNGHacks is the University of Florida’s hackathon created to
              uplift{" "}
              <strong>
                women, nonbinary, and gender-nonconforming students
              </strong>{" "}
              in technology.
            </p>
            <p>
              Whether you’re writing your first line of code or chasing your
              next challenge, there’s room for you here. Meet collaborators,
              learn something unexpected, and build something you’re proud of.
            </p>
            <div className="about-facts">
              <div>
                <strong>36 hours</strong>
                <span>of building in past editions</span>
              </div>
              <div>
                <strong>Every skill level</strong>
                <span>curiosity is a great start</span>
              </div>
              <div>
                <strong>One community</strong>
                <span>so many ways to grow</span>
              </div>
            </div>
          </div>
        </section>
        <section id="experience" className="experience-section">
          <div className="meadow-section">
            <div className="section-heading">
              <div>
                <h2>
                  What are we <em>making?</em>
                </h2>
              </div>
            </div>
            <div className="track-grid">
              {tracks.map(([number, title, description, symbol]) => (
                <article key={title} className="track-card">
                  <div className="track-top">
                    <span className="track-number">{number}</span>
                    <span className="track-symbol" aria-hidden="true">
                      {symbol}
                    </span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <button
              className="idea-button"
              onClick={() => setIdea((idea + 1) % ideas.length)}
            >
              Need a seed of inspiration?{" "}
            </button>
            <p className="idea-result" aria-live="polite">
              {ideas[idea]}
            </p>
          </div>
        </section>
        <section id="schedule" className="meadow-section schedule-section">
          <div>
            <h2>
              <em>One weekend.</em>
              <br />
              So many side quests.
            </h2>
            <p>
              From the first hello to the final demo, there’s more to a
              hackathon than the code.
            </p>
            <p className="small-note">
              More information to be determined closer to the event in Spring
              2027 semester. Confirmed dates, times, venue, and prizes will be
              announced soon.
            </p>
          </div>
          <div className="schedule-card">
            <div
              className="day-tabs"
              role="tablist"
              aria-label="Weekend overview"
            >
              {["Day 01", "Day 02", "Day 03"].map((label, i) => (
                <button
                  key={label}
                  role="tab"
                  id={`day-${i}`}
                  aria-selected={day === i}
                  aria-controls="day-panel"
                  onClick={() => setDay(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const next = (day + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                      setDay(next);
                      document.getElementById(`day-${next}`).focus();
                    }
                  }}
                  tabIndex={day === i ? 0 : -1}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              id="day-panel"
              role="tabpanel"
              aria-labelledby={`day-${day}`}
              tabIndex="0"
            >
              {days[day].map(([title, text], i) => (
                <div className="journey-stop" key={title}>
                  <span aria-hidden="true">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className="schedule-footnote">
              A little learning. A lot of possibility.
            </span>
          </div>
        </section>
        <section className="community-section meadow-section">
          <div className="section-heading">
            <div>
              <h2>
                Wish you were <em>here?</em>
              </h2>
            </div>
            <a
              className="text-link"
              href="https://www.instagram.com/winghacks/"
            >
              More on our community Instagram!
            </a>
          </div>
          <div className="memory-board">
            <picture className="memory-board-art" aria-hidden="true">
              <source media="(max-width: 640px)" srcSet={bulletinMobile} />
              <img src={bulletinWide} alt="" loading="lazy" decoding="async" />
            </picture>
            <div className="memory-grid">
            {[
              [
                photo,
                "A room full of possibility",
                "Students collaborating at WiNGHacks 2024",
              ],
              [
                workshop,
                "Your next “I get it!” moment",
                "A React workshop at WiNGHacks 2024",
              ],
              [
                community,
                "Build with a welcoming community",
                "The WiNGHacks 2024 organizing team",
              ],
            ].map(([src, caption, alt]) => (
              <figure key={caption}>
                <span className="memory-pin" aria-hidden="true">
                  <svg viewBox="0 0 32 40" width="24" height="30">
                    <path d="M16 24v13" stroke="#6b6655" strokeWidth="2" />
                    <path d="M10 10h12l-2 10 5 6H7l5-6z" fill="#b46e61" stroke="#744b40" strokeWidth="1.5" />
                    <ellipse cx="16" cy="9" rx="9" ry="5" fill="#f3b6aa" stroke="#744b40" strokeWidth="1.5" />
                    <path d="M11 8q4-3 8 0" fill="none" stroke="#fffbed" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <img src={src} alt={alt} loading="lazy" />
                <figcaption>
                  {caption}
                  <span>2024 </span>
                </figcaption>
              </figure>
            ))}
            </div>
          </div>
        </section>
        <section id="team" className="team-section">
          <img
            loading="lazy"
            decoding="async"
            className="garden-prop garden-pot"
            src={watercolorFlowerPot}
            alt=""
            aria-hidden="true"
          />
          <img
            loading="lazy"
            decoding="async"
            className="garden-prop garden-shovel"
            src={watercolorShovel}
            alt=""
            aria-hidden="true"
          />
          <div className="meadow-section">
            <h2>
              Meet <em>the garden.</em>
            </h2>
            <p className="team-intro">
              A little team with a lot of heart. Click on a flower!
            </p>
            <div className="garden-filters" aria-label="Filter committee">
              {groups.map((group) => (
                <button
                  key={group}
                  aria-pressed={filter === group}
                  onClick={() => {
                    setFilter(group);
                    setSelected(null);
                  }}
                >
                  {group.replace("Tech-support", "Tech support")}
                </button>
              ))}
            </div>
            <div className="garden-layout">
              <div className="flower-field">
                {members.map((m, i) => (
                  <button
                    key={m.id}
                    className={`flower-person ${selected === m.id ? "selected" : ""}`}
                    style={{
                      "--petal": ["#eeb6bc", "#bdbae7", "#f5d18e", "#b7cda2"][
                        i % 4
                      ],
                    }}
                    aria-label={`Meet ${m.name}, ${m.committee_position}`}
                    aria-haspopup="dialog"
                    aria-expanded={selected === m.id}
                    onClick={(event) =>
                      openBloom(
                        m.id,
                        event.currentTarget,
                        ["#eeb6bc", "#bdbae7", "#f5d18e", "#b7cda2"][i % 4],
                      )
                    }
                  >
                    <Flower active={selected === m.id} member={m} />
                    <span>{m.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section id="sponsors" className="meadow-section sponsor-section">
          <h2>
            Our <em>sponsors.</em>
          </h2>
          <p>They helped make this wonderful event possible.</p>
          <div
            className="meadow-sponsors meadow-sponsors-coming-soon"
            aria-live="polite"
          >
            <p>Coming soon...</p>
          </div>
          <div className="sponsor-callout">
            <div>
              <h3>
                Want to help us <em>pull this off?</em>
              </h3>
              <p>
                Help students spend a weekend learning, building, and making
                friends.
              </p>
            </div>
            <a
              className="meadow-button secondary"
              href={`${email}?subject=WiNGHacks%20sponsorship`}
            >
              Become a sponsor
            </a>
          </div>
        </section>
        <section id="faq" className="faq-section">
          <div className="meadow-section faq-layout">
            <div>
              <h2>
                <em>Questions?</em>
                <br />
                We got you.
              </h2>
              <a className="text-link" href={email}>
                Email our team
              </a>
              <button
                className="gator-button"
                aria-label="Say hello to the WiNGHacks gator"
                aria-pressed={greeting}
                onClick={() => setGreeting(!greeting)}
              >
                <img
                  src={gator}
                  alt="A friendly flower-crowned gator"
                  loading="lazy"
                />
              </button>
              <p className="gator-greeting" aria-live="polite">
                {greeting
                  ? "You don’t have to know everything to start. See you in the meadow! ♡"
                  : "Psst… the gator has something to say."}
              </p>
            </div>
            <div className="meadow-faqs">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="join" className="join-section">
          <Sparkle className="join-sparkle" />
          <h2>
            See you in
            <br />
            <em>the meadow!</em>
          </h2>
          <p>
            Applications are coming soon.
            <br />
            Follow along to hear when it’s time to take flight.
          </p>
          <a
            className="meadow-button"
            href="https://www.instagram.com/winghacks/"
          >
            Follow @winghacks
          </a>
          {/* <div className="join-links">
            <a href={`${email}?subject=WiNGHacks%20mentoring`}>
              Become a mentor
            </a>
            <a href={`${email}?subject=WiNGHacks%20volunteering`}>
              Become a volunteer
            </a>
          </div> */}
        </section>
      </main>
      <footer className="meadow-footer">
        <a className="meadow-wordmark" href="#page-top">
          WiNGHacks
        </a>
        <p>Made with love. Grown together. 🌸</p>
        <div>
          <a href={email}>Contact</a>
          <a href="https://www.linkedin.com/company/winghacks">LinkedIn</a>
          <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
            Code of conduct
          </a>
        </div>
        <small>
          © {new Date().getFullYear()} WiNGHacks · University of Florida
        </small>
      </footer>
      <BloomProfile
        member={member}
        origin={bloomOrigin}
        onClose={closeBloom}
        reducedMotion={motionPaused || reduceMotion}
      />
    </div>
  );
}
