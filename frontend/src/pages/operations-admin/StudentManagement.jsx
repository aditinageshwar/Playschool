import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/events.css";
import API from "../../api/axios";
import { FiUser, FiMail, FiPhone, FiHash, FiLayers } from "react-icons/fi";
import starsBg from "../../images/programs/bg.png"; 

const StudentManagement = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/api/admin/student-admin/students");
      setStudents(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
  <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main 
        className="flex-1 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${starsBg})` }}
      >
        {/* Magic Overlay */}
        <div className="min-h-screen bg-white/40 backdrop-blur-[1px]">
          <Navbar />

          <div className="p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-3xl font-black text-[#1E3A5F] mt-2">
                Little <span className="text-[#F07A4A]">Learners</span>
              </h1>
              <p className="text-[#07758D] mt-2 font-medium">Manage and view all student profiles and enrollment data.</p>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-[#F8FAFC]/50">
                <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
                  <FiUser className="text-[#F07A4A]" /> Student Directory
                </h3>
                <span className="bg-[#FCEAE2] text-[#F07A4A] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {students?.length || 0} Students enrolled
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] md:text-xs font-bold tracking-widest">
                      <th className="p-6">Student Information</th>
                      <th className="p-6">Class & Section</th>
                      <th className="p-6">Roll Number</th>
                      <th className="p-6">Contact Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {Array.isArray(students) && students.length > 0 ? (
                      students.map((s) => (
                        <tr key={s._id} className="hover:bg-teal-50/40 transition-colors group">
                          {/* Student Basic Info */}
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold">
                                {s.user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-[#1E3A5F] text-lg">{s.user.name}</div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Class & Section with Badges */}
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <span className="bg-orange-50 text-[#F07A4A] px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                <FiLayers size={12} /> Class {s.className}
                              </span>
                              <span className="bg-purple-50 text-purple-400 px-3 py-1 rounded-lg text-xs font-bold">
                                Sec {s.section}
                              </span>
                            </div>
                          </td>

                          {/* Roll Number with Icon */}
                          <td className="p-6">
                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                              </div>
                              {s.rollNumber}
                            </div>
                          </td>

                          {/* Contact Info Grouped */}
                          <td className="p-6">
                            <div className="flex flex-col space-y-1">
                              <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <FiMail size={12} className="text-[#F07A4A]" /> {s.user.email}
                              </span>
                              <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <FiPhone size={12} className="text-[#F07A4A]" /> {s.user.phone}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-20 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                              <FiUser size={40} className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-medium italic">No students are currently in the classroom.</p>
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

export default StudentManagement;