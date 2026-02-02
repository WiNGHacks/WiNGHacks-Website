import React, { forwardRef, useState } from "react";
import { scheduleData, tabLabels } from "../data/ScheduleData";

const Schedule = ({}, ref) => {
  const [activeTab, setActiveTab] = useState("day1");
  const events = scheduleData[activeTab];

  return (
    <div ref={(el) => (ref.current = { ...ref.current, schedule: el })}>
      <div className="Page entire-schedule">
        <h1>Schedule</h1>
        {/* <h2 className="disclaimer">Please note that the schedule is subject to change.</h2> */}

        <div className="schedule-tabs" role="tablist" aria-label="Schedule days">
          {Object.keys(tabLabels).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={`schedule-tab ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {tabLabels[key]}
            </button>
          ))}
        </div>

        <div className="timeline" aria-label={`${tabLabels[activeTab]} timeline`}>
          {events.map((e, idx) => (
            <div className="timeline-row" key={`${e.time}-${idx}`}>
              <div className="time-pill">{e.time}</div>

              <div className="timeline-mid" aria-hidden="true">
                <span className="dot" />
                {idx !== events.length - 1 && <span className="line" />}
              </div>

              <div className={`event-card ${e.variant} ${e.emphasis ? "emphasis" : ""}`}>
                <div className="event-title">
                  {e.emphasis ? <span className="event-emphasis">{e.title}</span> : e.title}
                </div>
                <div className="event-location">Location: {e.location}</div>
              </div>
            </div>
          ))}
        </div>
        <h2 className="disclaimer">Please note that the schedule is subject to change.</h2>
      </div>
    </div>
  );
};

export default forwardRef(Schedule);
