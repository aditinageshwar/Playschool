import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiCheckCircle, FiXCircle, FiLoader, FiCalendar, FiActivity, FiStar } from 'react-icons/fi';
import API from '../../api/axios';
import starsBg from "../../images/programs/bg.png";

const StudentAttendance = () => {
 const [attendanceData, setAttendanceData] = useState({ records: [], percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await API.get(`/api/attendance/${email}`);
        setAttendanceData(response.data);
      } catch (err) {
        console.error("Error fetching attendance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <div className="p-8 text-center"><FiLoader className="animate-spin mx-auto" size={32} /></div>;

  return (
  <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main 
        className="flex-1 bg-cover bg-fixed bg-center" 
        style={{ backgroundImage: `url(${starsBg})` }}
      >
        <div className="min-h-screen bg-white/30 backdrop-blur-[1px]">
          <Navbar />
          
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header & Stats Card */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs text-glow">Daily Presence</span>
                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                  Attendance <span className="text-[#F07A4A]">Tracker</span>
                </h1>
              </div>

              <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-[30px] shadow-xl border border-white/50 flex items-center gap-4 group hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-[#FCEAE2] text-[#F07A4A] rounded-2xl flex items-center justify-center shadow-inner">
                  <FiStar size={24} className="group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#3AA4AC] uppercase tracking-widest leading-none mb-1">Overall Goal</p>
                  <span className={`text-2xl font-black ${attendanceData.percentage >= 75 ? 'text-[#3AA4AC]' : 'text-red-400'}`}>
                    {attendanceData.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Table Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-[40px] shadow-2xl border border-white/50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-[#F8FAFC]/50 flex items-center gap-3">
                <FiCalendar className="text-[#3AA4AC] mb-2" size={20} />
                <h3 className="text-xl font-bold text-[#1E3A5F]">Monthly Log</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Weekday</th>
                      <th className="px-8 py-5">Presence Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[#1E3A5F]">
                    {attendanceData.records.length > 0 ? (
                      attendanceData.records.map((row, i) => {
                        const dateObj = new Date(row.date);
                        const isPresent = row.status === 'Present';
                        return (
                          <tr key={i} className="hover:bg-teal-50/30 transition-colors group">
                            <td className="px-8 py-5 font-semibold text-md">
                              {dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-slate-400 font-medium">
                                {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-sm transition-all ${
                                isPresent 
                                ? 'bg-green-100 text-green-500 border border-teal-100' 
                                : 'bg-red-50 text-red-400 border border-red-100'
                              }`}>
                                {isPresent ? <FiCheckCircle /> : <FiXCircle />} 
                                {row.status}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-8 py-20 text-center">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                             <FiActivity size={40} />
                          </div>
                          <p className="text-slate-400 font-medium italic">No attendance records found in the magic book.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Legend/Note */}
            <div className="mt-8 px-6 py-4 bg-[#1E3A5F]/5 rounded-[25px] border border-[#1E3A5F]/10 flex items-center gap-3">
               <FiActivity className="text-[#F07A4A]" />
               <p className="text-xs text-[#1E3A5F] font-medium">
                 <span className="font-black uppercase tracking-tighter mr-2 text-[#F07A4A]">Note:</span> 
                 Maintaining above 75% attendance helps you unlock special academy badges!
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance;