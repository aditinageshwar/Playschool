import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiUpload, FiSend, FiFileText, FiLink, FiCalendar, FiBook, FiCheckCircle, FiX } from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [selectedAsg, setSelectedAsg] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [formData, setFormData] = useState({ answer: "", fileUrl: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                
                const [asgRes, subRes] = await Promise.all([
                    API.get(`/api/assignment/all?email=${userEmail}`),
                    API.get(`/api/assignment/my-submissions?email=${userEmail}`) 
                ]);

                setAssignments(asgRes.data);
                setSubmissions(subRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const pendingAssignments = assignments.filter(asg => 
        !submissions.some(sub => sub.assignment === asg._id)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const userEmail = localStorage.getItem('userEmail');
            await API.post('/api/assignment/submit', { 
                ...formData, 
                assignment: selectedAsg._id, 
                userEmail 
            });
            alert("Success!");
            setSubmissions([...submissions, { assignment: selectedAsg._id }]);
            setSelectedAsg(null);
            setFormData({ answer: "", fileUrl: "" });
        } 
        catch (err) {
            alert(err.response?.data?.message || "Submission failed");
        } 
        finally { 
            setSubmitting(false); 
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FEF7E6]">
            <main className="flex-1 bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${starsBg})` }}>
                <div className="min-h-screen bg-white/30 backdrop-blur-[1px]">
                    <div className="p-6 md:p-10">
                        {/* Header Section */}
                        <div className="mb-10">
                            <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs">Homework Corner</span>
                            <h1 className="text-4xl font-black text-[#1E3A5F] mt-1">
                                My <span className="text-[#F07A4A]">Assignments</span>
                            </h1>
                            <p className="text-[#07758D] mt-1 font-medium">Complete your tasks!</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 max-w-5xl ml-10">
                            {pendingAssignments.length > 0 ? (
                                pendingAssignments.map((asg) => (
                                    <div key={asg._id} className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-center group hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                                            <div className="w-16 h-16 bg-[#E6F4F5] text-[#3AA4AC] rounded-[24px] flex items-center justify-center font-bold shadow-inner group-hover:bg-[#3AA4AC] group-hover:text-white transition-colors">
                                                <FiBook size={30} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl text-[#1E3A5F] mb-1">{asg.title}</h3>
                                                <p className="text-sm text-slate-500 line-clamp-1 max-w-md font-medium">{asg.instructions}</p>
                                                
                                                <div className="flex items-center gap-2 mt-3 text-[10px] font-black px-3 py-1.5 bg-red-50 text-red-400 rounded-full w-fit uppercase tracking-wider border border-red-100">
                                                    <FiCalendar /> Due: {new Date(asg.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={() => setSelectedAsg(asg)}
                                            className="bg-[#3AA4AC] text-white px-10 py-4 rounded-[20px] font-black shadow-lg shadow-teal-50 hover:bg-[#2d8389] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            Submit Work <FiArrowRightCircle className="hidden md:inline" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-[50px] border-4 border-dashed border-[#E6F4F5]">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#3AA4AC] shadow-md">
                                        <FiCheckCircle size={50} />
                                    </div>
                                    <p className="text-[#1E3A5F] text-2xl font-black">Excellent Job!</p>
                                    <p className="text-[#3AA4AC] font-bold mt-2">All your assignments are submitted. Go play! 🎈</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SUBMISSION MODAL */}
                    {selectedAsg && (
                        <div className="fixed inset-0 bg-[#1E3A5F]/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
                            <div className="bg-white w-full max-w-lg rounded-[50px] p-10 shadow-2xl relative animate-in zoom-in duration-300">
                                <button onClick={() => setSelectedAsg(null)} className="absolute top-8 right-8 text-slate-300 hover:text-[#F07A4A] transition-colors">
                                    <FiX size={30} />
                                </button>

                                <div className="mb-8">
                                    <span className="bg-[#FCEAE2] text-[#F07A4A] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-50"> 
                                        New Submission 
                                    </span>
                                    <h3 className="text-2xl font-black text-[#1E3A5F] mt-4 leading-tight"> {selectedAsg.title} </h3>
                                    
                                    <div className="bg-[#F8FAFC] border border-slate-100 rounded-[30px] p-6 mt-6">
                                        <p className="text-[10px] font-black uppercase text-[#3AA4AC] mb-2 tracking-widest">Educator's Note</p>
                                        <p className="text-slate-600 text-sm leading-relaxed italic"> "{selectedAsg.instructions || "Follow the class guidelines for this work."}" </p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block">Your Magic Answer</label>
                                        <textarea 
                                            className="w-full p-6 bg-[#F8FAFC] border border-slate-100 rounded-[30px] h-40 focus:ring-4 ring-[#3AA4AC]/10 outline-none font-medium text-[#1E3A5F]"
                                            placeholder="Write your answer or notes here..."
                                            value={formData.answer}
                                            onChange={(e) => setFormData({...formData, answer: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block">Project Link / File URL</label>
                                        <div className="relative">
                                            <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F07A4A]" />
                                            <input 
                                                required
                                                type="url"
                                                className="w-full p-5 pl-14 bg-[#F8FAFC] border border-slate-100 rounded-[25px] focus:ring-4 ring-[#3AA4AC]/10 outline-none font-bold text-[#1E3A5F]"
                                                placeholder="Link to your Google Drive or Work..."
                                                value={formData.fileUrl}
                                                onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <button disabled={submitting} type="submit" 
                                        className="w-full py-5 bg-[#F07A4A] text-white rounded-[25px] font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:bg-[#d9693d] transition-all disabled:opacity-50"
                                    >
                                        {submitting ? "Flying to Teacher..." : "Turn It In"} <FiSend />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Simple Arrow Icon helper
const FiArrowRightCircle = ({className}) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

export default StudentAssignments;