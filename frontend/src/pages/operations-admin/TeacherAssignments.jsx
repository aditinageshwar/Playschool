import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';
import { FiPlus, FiBookOpen, FiCalendar, FiLoader, FiAlertCircle, FiCheckCircle, FiX, FiUsers, FiExternalLink, FiEdit3 } from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const TeacherAssignments = () => {
    const [open, setOpen] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [viewSubModal, setViewSubModal] = useState(false);
    const [currentSubmissions, setCurrentSubmissions] = useState([]);
    const [allottedClasses, setAllottedClasses] = useState([]);
    
    const [form, setForm] = useState({title: "", className: "", section: "", dueDate: "", instructions: ""});
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchAssignments();
        fetchAllottedClasses();
    }, []);

    const fetchAssignments = async () => {
        setFetching(true);
        try {
            const userEmail = localStorage.getItem('userEmail');
            const res = await API.get(`/api/assignment/all?email=${userEmail}`);
            setAssignments(res.data);
        } catch (err) {
            console.error("Error fetching assignments:", err);
        } finally {
            setFetching(false);
        }
    };

    const fetchAllottedClasses = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            const res = await API.get(`/api/assignment/my-classes?email=${userEmail}`);
            setAllottedClasses(res.data); 
            
            if(res.data.length > 0) {
                setForm(prev => ({
                    ...prev,
                    className: res.data[0].className,
                    section: res.data[0].section
                }));
            }
        } catch (err) {
            console.error("Error fetching classes:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userEmail = localStorage.getItem('userEmail');
            await API.post('/api/assignment/create', { ...form, userEmail });
            
            setOpen(false);
            setForm({ title: "", className: "", section: "", dueDate: "", instructions: "" });
            fetchAssignments(); 
            alert("Assignment Created Successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to create assignment. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewSubmissions = async (asgId) => {
      try {
        const res = await API.get('/api/assignment/submit', { params: { asgId: asgId } });
        setCurrentSubmissions(res.data);
        setViewSubModal(true);
      } catch (err) {
        alert("Error fetching submissions");
      }
    }; 

    const handleUpdateMarks = async (subId, newMarks) => {
      try {
        await API.put(`/api/assignment/update-marks/${subId}`, { marks: newMarks });
        alert("Marks updated successfully");
      } catch (err) {
        console.error("Failed to update marks", err);
        alert("Could not save marks. Try again.");
      }
    };

    return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
        <Sidebar />
            <main className="flex-1 bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${starsBg})` }}>
                <div className="min-h-screen bg-white/30 backdrop-blur-[1px]">
                    <Navbar />
                    
                    <div className="p-6 md:p-10 max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                                    Track <span className="text-[#F07A4A]">Assignments</span>
                                </h1>
                                <p className="text-[#07758D] mt-1 font-medium">Create magical tasks for your little learners.</p>
                            </div>
                            <button 
                                onClick={() => setOpen(true)}
                                className="bg-[#3AA4AC] text-white px-8 py-3 rounded-[20px] font-black shadow-lg shadow-teal-100 hover:bg-[#2d8389] hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <FiPlus size={20} /> Create New Task
                            </button>
                        </div>

                        {/* TABLE CONTAINER */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[40px] shadow-2xl border border-white/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#F8FAFC]/50 text-[#3AA4AC] text-[10px] font-black uppercase tracking-[0.2em]">
                                            <th className="px-10 py-6">Assignment Info</th>
                                            <th className="px-10 py-6 text-center">Classroom</th>
                                            <th className="px-10 py-6">Due Timeline</th>
                                            <th className="px-10 py-6 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-[#1E3A5F]">
                                        {fetching ? (
                                            <tr>
                                                <td colSpan="4" className="px-10 py-32 text-center">
                                                    <div className="w-14 h-14 border-4 border-[#3AA4AC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                    <p className="text-[#1E3A5F] font-black italic">Opening the teacher's vault...</p>
                                                </td>
                                            </tr>
                                        ) : assignments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-10 py-32 text-center">
                                                    <FiAlertCircle className="mx-auto text-slate-200 text-6xl mb-4" />
                                                    <p className="text-slate-400 font-bold italic text-lg">No assignments created yet. Let's start the fun!</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            assignments.map((asg) => (
                                                <tr key={asg._id} className="hover:bg-teal-50/30 transition-colors group">
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-[#E6F4F5] text-[#3AA4AC] rounded-2xl flex items-center justify-center font-bold shadow-inner">
                                                                <FiBookOpen size={24} />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-lg leading-tight">{asg.title}</p>
                                                                <p className="text-xs text-slate-400 line-clamp-1">{asg.instructions}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-center">
                                                        <span className="bg-[#FCEAE2] text-[#F07A4A] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100">
                                                            {asg.className} - {asg.section}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-red-400">
                                                            <FiCalendar />
                                                            {new Date(asg.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-center">
                                                        <button 
                                                            onClick={() => handleViewSubmissions(asg._id)}
                                                            className="bg-white text-blue-900 px-6 py-2 rounded-xl font-black text-xs hover:bg-blue-400 hover:text-white transition-all shadow-sm border border-[#3AA4AC]/20"
                                                        >
                                                            VIEW SUBMISSIONS
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* CREATE MODAL */}
                    {open && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
                            <div className="bg-white w-full max-w-lg rounded-[50px] shadow-2xl p-10 relative animate-in zoom-in duration-300">
                                <button onClick={() => setOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-[#F07A4A]"><FiX size={30} /></button>
                                
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 bg-[#E6F4F5] rounded-[22px] flex items-center justify-center text-[#3AA4AC] shadow-inner">
                                        <FiPlus size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#1E3A5F]">Create <span className="text-[#F07A4A]">Task</span></h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <input name="title" required value={form.title} placeholder="Task Title" onChange={handleChange} 
                                        className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-[15px] focus:ring-4 ring-[#3AA4AC]/10 font-semibold outline-none" />

                                    <div className="space-y-4">
                                        <select 
                                            name="classSelection"
                                            required 
                                            className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-[15px] focus:ring-4 ring-[#3AA4AC]/10 font-semibold outline-none"
                                            onChange={(e) => {
                                                const selected = allottedClasses[e.target.value];
                                                setForm({ ...form, className: selected.className, section: selected.section });
                                            }}
                                        >
                                            {allottedClasses.length === 0 ? (
                                                <option>No classes assigned to you</option>
                                            ) : (
                                                allottedClasses.map((cls, index) => (
                                                    <option key={index} value={index}>
                                                        {cls.className} - {cls.section}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3AA4AC]" />
                                        <input type="date" name="dueDate" required value={form.dueDate} onChange={handleChange} min={today} 
                                            className="w-full p-3 pl-14 bg-[#F8FAFC] border border-slate-300 rounded-[15px] focus:ring-4 ring-[#3AA4AC]/10 font-bold outline-none" />
                                    </div>

                                    <textarea name="instructions" value={form.instructions} placeholder="Teacher's Instructions..." rows="3" onChange={handleChange} 
                                        className="w-full p-6 bg-[#F8FAFC] border border-slate-300 rounded-[15px] focus:ring-4 ring-[#3AA4AC]/10 font-medium outline-none resize-none" />

                                    <button disabled={loading} type="submit" 
                                        className="w-full py-3 bg-[#3AA4AC] text-white rounded-[25px] font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-teal-50 hover:bg-[#2d8389] transition-all"
                                    >
                                        {loading ? "Creating..." : "Launch Assignment"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* SUBMISSIONS MODAL */}
                    {viewSubModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
                            <div className="bg-white w-full max-w-4xl rounded-[20px] shadow-2xl p-10 max-h-[85vh] overflow-y-auto relative animate-in zoom-in duration-300">
                                <div className="flex justify-between items-center mb-10 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 border-b border-slate-50">
                                    <h3 className="text-2xl font-black text-[#1E3A5F]">Student <span className="text-[#F07A4A]">Submissions</span></h3>
                                    <button onClick={() => setViewSubModal(false)} className="p-3 bg-[#F8FAFC] text-slate-300 hover:text-red-400 rounded-full transition-colors"><FiX size={24} /></button>
                                </div>

                                {currentSubmissions.length === 0 ? (
                                    <div className="text-center py-20">
                                        <FiUsers className="mx-auto text-slate-100 text-7xl mb-4" />
                                        <p className="text-slate-400 font-bold italic">No students have handed in their work yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {currentSubmissions.map((sub) => (
                                            <div key={sub._id} className="p-8 bg-white rounded-[20px] border border-slate-200 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#3AA4AC]/30 transition-all group">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-14 h-14 rounded-full bg-[#E6F4F5] flex items-center justify-center text-[#3AA4AC] font-black text-xl shadow-inner border-2 border-white">
                                                            {sub.student?.user?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-[#1E3A5F] text-xl leading-tight">{sub.student?.user?.name}</h4>
                                                            <p className="text-[10px] text-[#3AA4AC] font-black uppercase tracking-widest">Roll No: {sub.student?.rollNumber}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-[#F8FAFC] p-6 rounded-[20px] border border-slate-50 text-sm text-slate-600 italic font-medium leading-relaxed mb-4">
                                                        "{sub.answer}"
                                                    </div>
                                                    
                                                    <a href={sub.fileUrl} target="_blank" rel="noreferrer" 
                                                        className="inline-flex items-center gap-2 bg-[#FCEAE2] text-[#F07A4A] px-6 py-2.5 rounded-2xl text-xs font-black hover:bg-[#F07A4A] hover:text-white transition-all shadow-sm"
                                                    >
                                                        View Magical File <FiExternalLink />
                                                    </a>
                                                </div>
                                                
                                                <div className="flex flex-col items-end gap-3 w-full md:w-auto md:min-w-[180px] pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                                                    <div className="flex items-center gap-3 bg-[#E6F4F5] p-2 rounded-2xl w-full justify-between border border-teal-100">
                                                        <span className="text-[10px] font-black uppercase text-[#3AA4AC] ml-2">Award Marks</span>
                                                        <input 
                                                            type="number" 
                                                            defaultValue={sub.marks} 
                                                            className="w-16 p-2 bg-white border border-[#3AA4AC]/20 rounded-xl text-center font-black text-[#1E3A5F] focus:ring-2 ring-[#3AA4AC]/20 outline-none"
                                                            onKeyDown={(e) => {if (e.key === 'Enter') handleUpdateMarks(sub._id, e.target.value);}}
                                                        />
                                                    </div>
                                                    <p className="text-[9px] text-slate-300 font-bold">Press ENTER to save</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherAssignments;