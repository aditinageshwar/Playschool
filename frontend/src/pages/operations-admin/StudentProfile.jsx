import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiLoader, FiBookOpen, FiGrid, FiAward, FiXCircle } from 'react-icons/fi';
import API from '../../api/axios';
import starsBg from "../../images/programs/bg.png";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail'); 
        const response = await API.get(`/api/student/profile/${userEmail}`);
        setStudent(response.data);
      } 
      catch (err) {
        setError("Could not load profile details.");
        console.error(err);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <FiLoader className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-[#FEF7E6] p-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-[32px] border border-red-100 font-bold shadow-lg flex items-center gap-3">
          <FiXCircle size={24} /> {error}
        </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main 
        className="flex-1 bg-cover bg-fixed bg-center" 
        style={{ backgroundImage: `url(${starsBg})` }}
      >
        <div className="min-h-screen bg-white/30 backdrop-blur-[1px]">
          <Navbar />
          
          <div className="py-6 md:py-10 max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-[#1E3A5F] mt-1">
                My <span className="text-[#F07A4A]">Profile</span>
              </h1>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-[50px] shadow-2xl border border-white/50 overflow-hidden relative">
              {/* Profile Header Background */}
              <div className="bg-gradient-to-r from-[#3AA4AC] to-[#1E3A5F] h-40 relative">
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url(${starsBg})`, backgroundSize: '200px' }}></div>
              </div>
              
              <div className="px-8 md:px-12 pb-12">
                <div className="relative -top-16 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                  {/* Avatar Container */}
                  <div className="w-40 h-40 rounded-[40px] bg-[#FEF7E6] border-8 border-white flex items-center justify-center text-[#3AA4AC] shadow-xl relative overflow-hidden group">
                    <FiUser size={80} className="group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute bottom-0 w-full bg-[#3AA4AC]/10 py-1 text-center">
                        <FiAward className="inline text-[#F07A4A]" size={16} />
                    </div>
                  </div>
                  
                  <div className="pb-2 md:pb-6">
                    <h2 className="text-3xl font-black text-[#1E3A5F] mb-1">{student.user?.name}</h2>
                    <div className="inline-flex items-center gap-2 bg-[#FCEAE2] text-[#F07A4A] px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest border border-orange-100">
                       Roll No: {student.rollNumber}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mt-4">
                  {/* Personal Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-[#3AA4AC] uppercase tracking-[0.2em] ml-2">Academic Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-5 p-5 bg-white/50 rounded-[30px] border border-slate-50 hover:border-[#3AA4AC]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#E6F4F5] text-[#3AA4AC] rounded-2xl flex items-center justify-center group-hover:bg-[#3AA4AC] group-hover:text-white transition-colors">
                          <FiBookOpen size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Current Class</p>
                          <p className="font-bold text-[#1E3A5F] text-lg">{student.className}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 p-5 bg-white/50 rounded-[30px] border border-slate-50 hover:border-[#3AA4AC]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#E6F4F5] text-[#3AA4AC] rounded-2xl flex items-center justify-center group-hover:bg-[#3AA4AC] group-hover:text-white transition-colors">
                          <FiGrid size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Section</p>
                          <p className="font-bold text-[#1E3A5F] text-lg">Group {student.section}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 p-5 bg-white/50 rounded-[30px] border border-slate-50 hover:border-[#3AA4AC]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#E6F4F5] text-[#3AA4AC] rounded-2xl flex items-center justify-center group-hover:bg-[#3AA4AC] group-hover:text-white transition-colors">
                          <FiCalendar size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Birthday</p>
                          <p className="font-bold text-[#1E3A5F] text-lg">{new Date(student.dob).toLocaleDateString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-[#F07A4A] uppercase tracking-[0.2em] ml-2">Contact Link</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-5 p-5 bg-white/50 rounded-[30px] border border-slate-50 hover:border-[#F07A4A]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#FCEAE2] text-[#F07A4A] rounded-2xl flex items-center justify-center group-hover:bg-[#F07A4A] group-hover:text-white transition-colors">
                          <FiMail size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Magic Email</p>
                          <p className="font-bold text-[#1E3A5F] text-lg break-all">{student.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 p-5 bg-white/50 rounded-[30px] border border-slate-50 hover:border-[#F07A4A]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#FCEAE2] text-[#F07A4A] rounded-2xl flex items-center justify-center group-hover:bg-[#F07A4A] group-hover:text-white transition-colors">
                          <FiPhone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Mobile Line</p>
                          <p className="font-bold text-[#1E3A5F] text-lg">{student.user?.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 p-5 bg-white/50 rounded-[30px] border border-slate-50 hover:border-[#F07A4A]/30 transition-all group">
                        <div className="w-12 h-12 bg-[#FCEAE2] text-[#F07A4A] rounded-2xl flex items-center justify-center group-hover:bg-[#F07A4A] group-hover:text-white transition-colors">
                          <FiMapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase">Home Address</p>
                          <p className="font-bold text-[#1E3A5F] text-sm leading-relaxed">{student.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;