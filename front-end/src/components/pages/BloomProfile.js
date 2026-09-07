import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaLinkedinIn } from "react-icons/fa6";
import "./BloomProfile.css";

export default function BloomProfile({
  member,
  origin,
  onClose,
  reducedMotion,
}) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (member && !dialog.open) {
      dialog.showModal();
      dialog.querySelector("[data-bloom-close]")?.focus();
    }
    if (!member && dialog.open) dialog.close();
  }, [member]);
  useEffect(() => {
    if (!member) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [member]);
  return createPortal(
    <dialog
      ref={dialogRef}
      className={`bloom-dialog ${reducedMotion ? "bloom-still" : ""}`}
      aria-labelledby="bloom-name"
      aria-describedby="bloom-role"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current.close();
      }}
      style={{
        "--bloom-x": `${origin.x}px`,
        "--bloom-y": `${origin.y}px`,
        "--bloom-petal": origin.color,
      }}
    >
      {member && (
        <div className="bloom-shell" key={member.id}>
          <svg
            className="bloom-corolla"
            viewBox="0 0 700 700"
            aria-hidden="true"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <g key={i} transform={`rotate(${i * 36} 350 350)`}>
                <ellipse
                  className="bloom-large-petal"
                  cx="350"
                  cy="165"
                  rx="94"
                  ry="152"
                  style={{ "--petal-order": i }}
                />
              </g>
            ))}
            <circle className="bloom-disc" cx="350" cy="350" r="222" />
            <circle className="bloom-ring" cx="350" cy="350" r="210" />
          </svg>
          <div className="bloom-face">
            <img
              className="bloom-portrait"
              src={member.profile_pic}
              alt={member.name}
            />
            <p className="bloom-committee">
              {member.committee_name.replace("Tech-support", "Tech support")}
            </p>
            <h3 id="bloom-name">{member.name}</h3>
            <p id="bloom-role">{member.committee_position}</p>
            {member.linkedIn && (
              <a
                className="bloom-linkedin"
                href={member.linkedIn}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${member.name} on LinkedIn`}
              >
                <FaLinkedinIn aria-hidden="true" />
              </a>
            )}
          </div>
          <button
            className="bloom-close"
            data-bloom-close
            onClick={() => dialogRef.current.close()}
            aria-label="Close member profile"
          >
            Close
          </button>
        </div>
      )}
    </dialog>,
    document.body,
  );
}
