import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiSearch, FiBook, FiClock, FiMapPin, FiInbox, FiLayers, FiUsers, FiStar } from 'react-icons/fi';
import API from "../../api/axios"; 
import starsBg from "../../images/programs/bg.png";

const TeacherMyClasses = () => {
    const [search, setSearch] = useState("");
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const email = localStorage.getItem('userEmail');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/api/teacher/my-classes/${email}`);
            setClasses(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching classes:", err);
            setError("Error while fetching classes");
        } finally {
            setLoading(false);
        }
    };

    const filtered = classes.filter((c) =>
        c.className?.toLowerCase().includes(search.toLowerCase()) ||
        c.subjects?.some(sub => sub.name.toLowerCase().includes(search.toLowerCase()))
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

                    <div className="p-6 md:p-10">
                        {/* Header & Search Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                                    My <span className="text-[#F07A4A]">Classes</span>
                                </h1>
                                <p className="text-[#07758D] mt-1 font-medium">Your journey of shaping little minds starts here.</p>
                            </div>

                            <div className="relative group w-full md:w-96">
                                <FiSearch className="absolute left-5 top-5 text-orange-900" size={20} />
                                <input
                                    type="text"
                                    placeholder="Find a class or subject..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-14 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-[25px] w-full outline-none focus:ring-2 ring-[#3AA4AC]/10 font-semibold text-[#1E3A5F] shadow-lg transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-5 rounded-[25px] mb-8 flex items-center gap-3 border border-red-100 font-bold animate-in fade-in slide-in-from-top-2">
                                <FiInbox size={24} /> {error}
                            </div>
                        )}

                        {/* TABLE CONTAINER */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[40px] shadow-2xl border border-white/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="py-32 text-center flex flex-col items-center gap-4">
                                        <div className="w-14 h-14 border-4 border-[#3AA4AC] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-[#1E3A5F] font-black italic text-lg">Consulting the teacher's diary...</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-[#F8FAFC]/50 text-[#3AA4AC] text-[10px] font-black uppercase tracking-[0.2em]">
                                                <th className="px-10 py-6">Milestone (Class)</th>
                                                <th className="px-10 py-6">Magic Subjects</th>
                                                <th className="px-10 py-6">Timings & Venue</th>
                                                <th className="px-10 py-6 text-center">Group Size</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                          {filtered.length > 0 ? (
                                            filtered.map((c, i) => (
                                            <tr key={i} className="hover:bg-teal-50/30 transition-colors group">
                                             {/* 1. ClassName & Section */}
                                              <td className="px-10 py-6">
                                                 <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl text-[#F07A4A] bg-[#FCEAE2] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                        <FiLayers size={22} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-xl text-[#1E3A5F]">{c.className}</div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit mt-1">Section {c.section}</div>
                                                    </div>
                                                 </div>
                                              </td>

                                                {/* 2. Subjects with Badges */}
                                              <td className="px-10 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {c.subjects?.map((sub, idx) => (
                                                        <div key={idx} className="">
                                                            <div className="text-[#F07A4A] bg-[#FCEAE2] text-center max-w-12 rounded-lg font-black text-[13px] uppercase tracking-tighter">
                                                                {sub.code}
                                                            </div>
                                                            <div className="text-sm text-[#1E3A5F] font-semibold">{sub.name}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                               </td>

                                                {/* 3. StartTime, EndTime & Room */}
                                                <td className="px-10 py-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-[12px] font-black text-slate-500 bg-slate-100 w-fit px-3 py-1 rounded-lg">
                                                            <FiClock />
                                                            {c.startTime} - {c.endTime}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pl-1">
                                                            <FiMapPin className="text-[#F07A4A]" /> Room: <span className="text-[#1E3A5F] font-bold">{c.room || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 4. Occupancy / Capacity */}
                                                <td className="px-10 py-6">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="flex items-center gap-1.5 text-sm font-black text-[#1E3A5F]">
                                                            <FiUsers className="text-[#3AA4AC]" /> {c.capacity} Students
                                                        </div>
                                                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                            <div 
                                                                className={`h-full transition-all duration-1000 ${ (c.capacity) > 30 ? 'bg-[#F07A4A]' : 'bg-[#3AA4AC]'}`} 
                                                                style={{ width: `${Math.min((c.capacity / 40) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-24 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                                <FiStar size={40} />
                                            </div>
                                            <p className="text-slate-400 font-medium italic text-lg">No magical classes assigned to you yet.</p>
                                        </td>
                                    </tr>
                                    )}
                                    </tbody>
                                  </table>
                                )}
                            </div>
                        </div>

                        {/* Legend Footer */}
                        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#E6F4F5] border border-[#3AA4AC] rounded"></div> Teaching Slot</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#FCEAE2] border border-[#F07A4A] rounded"></div> Class Info</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherMyClasses;