import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiEdit3, FiUsers, FiClipboard, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";
import API from '../../api/axios';

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Classes Today", value: "0", icon: <FiClock />, fill: "0%", color: "var(--primary)" },
    { title: "Active Assignments", value: "0", icon: <FiEdit3 />, fill: "0%", color: "var(--warning)" },
    { title: "Average Attendance", value: "0", icon: <FiCheckCircle />, fill: "0%", color: "var(--success)" },
    { title: "Pending Applications", value: "0", icon: <FiClipboard />, fill: "0%", color: "var(--danger)" }
  ]);
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/teacher/dashboard-stats');
      const data = res.data;

      const classesToday = data.classesToday || 0;
      const activeAssignment = data.activeAssignment || 0;
      const averageAttendance = data.averageAttendance || 0;
      const presentRecords = data.presentRecords || 0;
      const pendingApplication = data.pendingApplication || 0;

      // Calculate fill percentages (max 100%)
      const classesFill = Math.min((classesToday / 6) * 100, 100);
      const assignmentFill = Math.min((activeAssignment / 10) * 100, 100);
      const attendanceFill = Math.min(averageAttendance, 100);
      const applicationFill = Math.min((pendingApplication / 10) * 100, 100);
      
      setStats([
        {
          title: "Classes Today",
          value: classesToday.toLocaleString(),
          icon: <FiClock />,
          fill: `${classesFill}%`,
          color: "var(--primary)"
        },
        {
          title: "Active Assignments",
          value: activeAssignment.toLocaleString(),
          icon: <FiEdit3 />,
          fill: `${assignmentFill}%`,
          color: "var(--warning)"
        },
        {
          title: "Average Attendance",
          value: presentRecords.toLocaleString(),
          icon: <FiCheckCircle />,
          fill: `${attendanceFill}%`,
          color: "var(--success)"
        },
        {
          title: "Pending Applications",
          value: pendingApplication.toLocaleString(),
          icon: <FiClipboard />,
          fill: `${applicationFill}%`,
          color: "var(--danger)" 
        }
      ]);
  } catch (err) {
      console.error("Error loading stats", err);
  } finally {
      setLoading(false);
  }
  };
  
  return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main 
        className="flex-1 bg-cover bg-fixed bg-center" 
        style={{ backgroundImage: `url(${starsBg})` }}
      >
        <div className="min-h-screen bg-white/30 backdrop-blur-[1px]">
          <Navbar />

          <div className="p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                Teacher <span className="text-[#F07A4A]">Portal</span>
              </h1>
              <p className="text-[#07758D] mt-1 font-medium">Empowering little minds, one lesson at a time.</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-2 transition-all duration-300">
                  <div className="flex justify-start items-start mb-2">
                    <div className="w-8 h-8 bg-[#F8FAFC] text-[#3AA4AC] rounded-xl flex items-center justify-center group-hover:bg-[#3AA4AC] group-hover:text-white transition-colors border border-slate-100">
                      {stat.icon}
                    </div>
                    <span className="text-[10px] ml-2 mt-2 font-black text-slate-400 uppercase tracking-widest">{stat.title}</span>
                  </div>
                  <h2 className="text-3xl font-black text-[#1E3A5F] mb-4">{stat.value}</h2>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out" 
                      style={{ width: stat.fill, backgroundColor: stat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;