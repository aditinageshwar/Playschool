import React from 'react';

const EventCalendar = () => {
  return (
    <div className="panel">
      <h3>Weekly Event Calendar</h3>
      <div className="notice-list">
        <div className="notice-item" style={{ borderLeft: "4px solid var(--primary)" }}>
          <span>Parent-Teacher Meeting</span>
          <span className="text-muted text-sm">Scheduled (Tomorrow, 10:00 AM)</span>
        </div>
        <div className="notice-item" style={{ borderLeft: "4px solid var(--warning)" }}>
          <span>Inter-School Sports Day</span>
          <span className="text-muted text-sm">In Planning (Next Week)</span>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;