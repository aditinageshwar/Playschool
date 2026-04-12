import React from 'react';

const DashboardCards = () => {
  const stats = [
    { title: "Active Events", value: "12", fill: "70%", color: "var(--primary)" },
    { title: "Pending Notices", value: "4", fill: "30%", color: "var(--warning)" },
    { title: "Infrastructure Projects", value: "7", fill: "50%", color: "var(--success)" },
    { title: "Overdue Coordination Tasks", value: "1", fill: "10%", color: "var(--danger)" }
  ];

  return (
    <div className="cards-grid">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <span className="stat-title">{stat.title}</span>
          <span className="stat-value">{stat.value}</span>
          <div className="stat-indicator">
            <div className="indicator-fill" style={{ width: stat.fill, backgroundColor: stat.color }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;