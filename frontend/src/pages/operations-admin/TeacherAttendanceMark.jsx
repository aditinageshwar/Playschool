import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import { FiSave, FiSearch, FiCheck, FiX, FiLoader, FiCalendar, FiUsers, FiStar, FiAlertTriangle } from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const TeacherAttendanceMark = () => {
    const [filters, setFilters] = useState({ className: '', section: '', date: new Date().toISOString().split('T')[0] });
    const [students, setStudents] = useState([]);
    const [attendanceList, setAttendanceList] = useState({}); 
    const [loading, setLoading] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await API.get('/api/attendance/list', {
              params: {
                className: filters.className,
                section: filters.section
              }
           });
            setStudents(res.data);
            const initialStatus = {};
            res.data.forEach(s => initialStatus[s._id] = 'Present');
            setAttendanceList(initialStatus);
        } catch (err) {
            console.error(err);
            setStudents([]);
            if (err.response && err.response.status === 403) {
              alert(err.response?.data?.message);
            } else {
              alert("Error fetching students list");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id, status) => {
        setAttendanceList(prev => ({ ...prev, [id]: status }));
    };

    const submitAttendance = async () => {
        const data = Object.keys(attendanceList).map(id => ({
            studentId: id,
            status: attendanceList[id]
        }));
        try {
            await API.post('/api/attendance/bulkSubmit', { attendanceData: data, date: filters.date });
            alert("Attendance recorded successfully!");
        } catch (err) {
            alert("Error saving attendance");
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
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                            Mark <span className="text-[#F07A4A]">Attendance</span>
                        </h1>
                        <p className="text-[#07758D] mt-1 font-medium">Check who's joined the fun today!</p>
                    </div>
                    
                    {/* Filters Card */}
                    <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-xl border border-white/50 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#3AA4AC] uppercase ml-2 tracking-widest flex items-center gap-1"><FiCalendar /> Date</label>
                                <input type="date" name="date" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-[#3AA4AC]/10 font-bold text-[#1E3A5F]" value={filters.date} onChange={handleFilterChange} required/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#3AA4AC] uppercase ml-2 tracking-widest flex items-center gap-1"><FiUsers /> Class</label>
                                <input type="text" name="className" placeholder="e.g. Nursery" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-[#3AA4AC]/10 font-bold text-[#1E3A5F]" value={filters.className} onChange={handleFilterChange} required/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#3AA4AC] uppercase ml-2 tracking-widest flex items-center gap-1"><FiStar /> Section</label>
                                <input type="text" name="section" placeholder="e.g. A" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-[#3AA4AC]/10 font-bold text-[#1E3A5F]" value={filters.section} onChange={handleFilterChange} required/>
                            </div>
                            <div className="flex items-end pb-1">
                                <button onClick={fetchStudents} disabled={loading} className="w-full bg-[#3AA4AC] text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-50 flex items-center justify-center gap-2 hover:bg-[#2d8389] transition-all">
                                    {loading ? <FiLoader className="animate-spin" /> : <FiSearch />}
                                    Get Learners List
                                </button>
                            </div>
                        </div>
                    </div>

                    {(!filters.className || !filters.section) && !loading && (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[50px] border-4 border-dashed border-[#E6F4F5]">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#F07A4A] shadow-md">
                        <FiUsers size={50} />
                        </div>
                        <p className="text-[#1E3A5F] text-2xl font-black">Ready to start?</p>
                        <p className="text-[#3AA4AC] font-bold mt-2">Pick a class and section to see your magical learners! 🌈</p>
                    </div>
                    )}

                    {/* Students Table */}
                    {filters.className && filters.section && students.length > 0 ? (
                        <div className="bg-white/90 backdrop-blur-sm rounded-[40px] shadow-2xl border border-white/50 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#F8FAFC]/50 text-[#3AA4AC] text-[10px] font-black uppercase tracking-[0.2em]">
                                            <th className="px-10 py-6">Roll No</th>
                                            <th className="px-10 py-6">Student Name</th>
                                            <th className="px-10 py-6 text-center">Daily Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {students.map((student) => (
                                            <tr key={student._id} className="hover:bg-teal-50/20 transition-colors group">
                                                <td className="px-10 py-6">
                                                    <span className="w-10 h-10 bg-orange-100 text-[#F07A4A] rounded-full flex items-center justify-center font-black">
                                                        {student.rollNumber}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="font-bold text-[#1E3A5F] text-lg">{student.user?.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Smart Academy Learner</div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleStatusChange(student._id, 'Present')}
                                                            className={`flex flex-col items-center justify-center w-8 h-8 rounded-2xl transition-all duration-300 shadow-sm 
                                                            ${attendanceList[student._id] === 'Present' ? 'bg-green-50 text-green-400 scale-110 shadow-teal-100 ring-2 ring-green-300' : 'bg-slate-50 text-slate-300'}`}
                                                            title="Mark Present"
                                                        >
                                                            <FiCheck size={24} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusChange(student._id, 'Absent')}
                                                            className={`flex flex-col items-center justify-center w-8 h-8 rounded-2xl transition-all duration-300 shadow-sm 
                                                            ${attendanceList[student._id] === 'Absent' ? 'bg-red-50 text-red-500 scale-110 shadow-red-100 ring-2 ring-red-400' : 'bg-slate-50 text-slate-300'}`}
                                                            title="Mark Absent"
                                                        >
                                                            <FiX size={24} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-10 bg-[#F8FAFC]/50 border-t border-slate-50 flex justify-center">
                                <button onClick={submitAttendance} className="w-full md:w-1/2 bg-[#F07A4A] text-white py-3 rounded-[25px] font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:bg-[#d9693d] transition-all transform active:scale-95">
                                    <FiSave /> Finalize Today's Attendance
                                </button>
                            </div>
                        </div>
                    ) : filters.className && filters.section && !loading && (
                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4">
                        <FiAlertTriangle className="text-[#F07A4A] shrink-0 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-red-500/80 leading-relaxed font-medium">
                              Please select your assigned class and section to proceed.
                            </p>
                        </div>
                      </div>
                    )}
                </div>
            </div>
        </main>
    </div>
);
};

export default TeacherAttendanceMark;