import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiUsers, FiBookOpen, FiLayers, FiActivity, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const AcademicAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSubjects: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/academic-admin/dashboard-stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Educators", value: stats.totalTeachers, icon: <FiUsers />, color: "#213272", fill: "80%" },
    { title: "Active Subjects", value: stats.totalSubjects, icon: <FiBookOpen />, color: "#213272", fill: "65%" },
    { title: "Classrooms", value: stats.totalClasses, icon: <FiLayers />, color: "#213272", fill: "90%" },
  ];

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs">Academic Control</span>
                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                  Curriculum <span className="text-[#F07A4A]">Hub</span>
                </h1>
              </div>
              <button 
                onClick={fetchDashboardStats} 
                className={`p-4 bg-white text-[#3AA4AC] rounded-2xl shadow-lg shadow-teal-50 hover:rotate-180 transition-all duration-700 ${loading ? 'animate-spin' : ''}`}
              >
                <FiRefreshCw size={24} />
              </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {statCards.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-2 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[#3AA4AC] font-black text-[10px] uppercase tracking-widest">{stat.title}</div>
                    <div className="w-10 h-10 bg-[#F7B093] text-white rounded-xl flex items-center justify-center group-hover:bg-[#F07A4A] group-hover:text-white transition-colors">
                      {stat.icon}
                    </div>
                  </div>
                  <h2 className="text-4xl font-black text-[#1E3A5F] mb-4">
                    {loading ? '...' : stat.value}
                  </h2>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out" 
                      style={{ width: loading ? '0%' : stat.fill, backgroundColor: stat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overview & System Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Summary Card */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] border border-white/50 shadow-lg">
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                  <FiActivity className="text-[#3AA4AC]" /> Academic Snapshot
                </h3>
                <div>
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-teal-50">
                    <span className="text-slate-500 font-medium text-sm">Registered Teachers</span>
                    <span className="font-black text-[#1E3A5F]">{stats.totalTeachers}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-teal-50">
                    <span className="text-slate-500 font-medium text-sm">Course Subjects</span>
                    <span className="font-black text-[#1E3A5F]">{stats.totalSubjects}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-teal-50">
                    <span className="text-slate-500 font-medium text-sm">Active Sections</span>
                    <span className="font-black text-[#1E3A5F]">{stats.totalClasses}</span>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] border border-white/50 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                    <FiCheckCircle className="text-[#F07A4A]" /> Portal Status
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-slate-700 font-bold">Academic Systems Operational</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    All teacher assignments and subject schedules are synchronized with the cloud database.
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Last Synced</span>
                  <span className="text-xs font-black text-[#3AA4AC]">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AcademicAdminDashboard;