import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/events.css";
import API from "../../api/axios";
import { FiUsers, FiMail, FiPhone, FiBookOpen, FiBriefcase } from "react-icons/fi";
import starsBg from "../../images/programs/bg.png"; 

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = async () => {
    const res = await API.get("/api/academic-admin/teachers");
    setTeachers(res.data.data);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main 
        className="flex-1 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${starsBg})` }}
      >
        {/* Subtle Overlay for readability */}
        <div className="min-h-screen bg-white/40 backdrop-blur-[1px]">
          <Navbar />

          <div className="p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-3xl font-black text-[#1E3A5F] mt-2">
                Our <span className="text-[#F07A4A]">Teachers</span>
              </h1>
              <p className="text-[#07758D] mt-2 font-medium">View and manage the heartbeat of our school.</p>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-[#F8FAFC]/50">
                <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
                  <FiUsers className="text-[#3AA4AC]" /> Teacher Directory
                </h3>
                <span className="bg-[#E6F4F5] text-[#3AA4AC] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {teachers?.length || 0} Registered
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] md:text-xs font-bold tracking-widest">
                      <th className="p-6">Teacher Details</th>
                      <th className="p-6">Specialization</th>
                      <th className="p-6">Department</th>
                      <th className="p-6">Experience</th>
                      <th className="p-6">Qualifications</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {Array.isArray(teachers) && teachers.length > 0 ? (
                      teachers.map((t) => (
                        <tr key={t._id} className="hover:bg-teal-50/40 transition-colors group">
                          {/* Name, Email, Phone combined for a cleaner look */}
                          <td className="p-6">
                            <div className="font-bold text-[#1E3A5F] text-lg">{t.user.name}</div>
                            <div className="flex flex-col space-y-1 mt-1">
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <FiMail size={12} className="text-[#F07A4A]" /> {t.user.email}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <FiPhone size={12} className="text-[#F07A4A]" /> {t.user.phone}
                              </span>
                            </div>
                          </td>
                          
                          <td className="p-6">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold">
                              <FiBookOpen className="text-[#3AA4AC]" /> {t.specialization}
                            </div>
                          </td>

                          <td className="p-6">
                            <span className="bg-orange-50 text-[#F07A4A] px-3 py-1 rounded-lg text-xs font-bold">
                              {t.department || 'N/A'}
                            </span>
                          </td>

                          <td className="p-6">
                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                              <FiBriefcase className="text-slate-400" /> {t.experience} Years
                            </div>
                          </td>

                          <td className="p-6 text-sm text-slate-600 font-medium">
                            {t.qualifications || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-20 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FiUsers size={48} className="text-slate-200 mb-4" />
                            <p className="text-slate-400 font-medium italic text-lg">No teachers found in the magic book.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherManagement;