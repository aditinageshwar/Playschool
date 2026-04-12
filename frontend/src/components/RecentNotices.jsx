import React from 'react';

const RecentNotices = () => {
  const notices = [
    { title: "Field Trip", status: "Approved", class: "approved" },
    { title: "Exam Schedule", status: "Review Needed", class: "review" },
    { title: "Exam Tax Planning", status: "Pending", class: "pending" },
    { title: "Infrastructure", status: "Management", class: "management" }
  ];

  return (
    <div className="panel">
      <h3>Recent Notices</h3>
      <div className="notice-list">
        {notices.map((notice, index) => (
          <div className="notice-item" key={index}>
            <span>{notice.title}</span>
             
            <span className={`badge ${notice.class}`}>
              {notice.status === 'Review Needed' ? 'Review' : notice.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNotices;