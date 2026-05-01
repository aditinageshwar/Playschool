import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import { FiCheck, FiX, FiClock, FiFileText, FiCalendar, FiUser, FiInfo, FiLoader, FiDribbble } from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const TeacherApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/api/application/all'); 
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const remarks = prompt(`Enter remarks for ${newStatus}:`);
    try {
      await API.patch(`/api/application/status/${id}`, { 
        status: newStatus, 
        teacherRemarks: remarks 
      });
      alert(`Application ${newStatus} successfully!`);
      fetchApplications(); 
    } catch (err) {
      alert("Error updating status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
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
          
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                  Student <span className="text-[#F07A4A]">Applications</span>
                </h1>
                <p className="text-[#07758D] mt-1 font-medium">Review leave requests and document needs from your learners.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FCEAE2] text-[#F07A4A] rounded-xl flex items-center justify-center shadow-inner font-black">
                   {applications.filter(a => a.status === 'Pending').length}
                </div>
                <span className="text-xs font-black text-[#1E3A5F] uppercase tracking-widest leading-none">Pending<br/><span className="text-[#3AA4AC]">Tasks</span></span>
              </div>
            </div>

            {/* Applications List */}
            <div className="grid gap-6">
              {loading ? (
                <div className="text-center py-20">
                   <div className="w-14 h-14 border-4 border-[#3AA4AC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="text-[#1E3A5F] font-black italic">Reading the application scrolls...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-[50px] border-4 border-dashed border-[#E6F4F5]">
                  <FiFileText className="mx-auto text-[#E6F4F5] text-7xl mb-4" />
                  <p className="text-slate-400 font-bold italic text-lg">No applications found in the magic box.</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app._id} className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-xl border border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex-1 w-full">
                      <div className="flex items-center flex-wrap gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          <FiClock /> Applied: {new Date(app.appliedDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-8 h-8 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
                          <FiUser size={14} />
                         </div>
                         <h3 className="font-black text-xl text-[#1E3A5F] mt-2">{app.student?.user?.name || "Magical Learner"}</h3>
                      </div>
                      
                      <p className="text-[10px] font-black text-[#3AA4AC] uppercase tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
                        <FiInfo size={12}/> Request Type: {app.type}
                      </p>

                      <h3 className="font-bold text-lg text-[#1E3A5F] mb-2">Subject : {app.subject}</h3>
                      <div className="bg-[#F8FAFC]/80 p-5 rounded-[25px] border border-slate-100 text-[#1E3A5F] text-sm leading-relaxed italic shadow-inner">
                        "{app.description}"
                      </div>

                      {app.type === 'Leave' && (
                        <div className="mt-4 flex flex-wrap gap-3 text-[11px] font-black text-[#F07A4A] bg-[#FCEAE2]/50 w-fit px-4 py-2.5 rounded-2xl border border-orange-100 shadow-sm">
                          <span className="flex items-center gap-2"><FiCalendar /> Start: {new Date(app.startDate).toLocaleDateString('en-IN')}</span>
                          {/* <div className="w-1 h-1 bg-[#F07A4A] rounded-full opacity-30 self-center"></div> */}
                          <span className="flex items-center gap-2"><FiCalendar /> End: {new Date(app.endDate).toLocaleDateString('en-IN')}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {app.status === 'Pending' ? (
                      <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-48">
                        <button 
                          onClick={() => handleStatusUpdate(app._id, 'Approved')}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-100 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tighter"
                        >
                          <FiCheck size={18} /> Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                          className="flex-1 flex items-center justify-center gap-2 bg-white text-red-400 border border-red-100 py-4 rounded-2xl font-black hover:bg-red-50 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tighter shadow-sm"
                        >
                          <FiX size={18} /> Deny
                        </button>
                      </div>
                    ) : (
                      <div className="w-full lg:w-48 text-center px-4 py-8 bg-[#F8FAFC] rounded-[30px] border border-slate-50 italic text-slate-400 font-bold text-sm">
                        Decision Made
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
    
export default TeacherApplicationReview;