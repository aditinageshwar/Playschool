import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiSend, FiFileText, FiCalendar, FiEdit3, FiInfo, FiCheckCircle } from 'react-icons/fi';
import API from '../../api/axios'; 
import starsBg from "../../images/programs/bg.png";

const Application = () => {
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('userEmail');
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    description: '',
    startDate: '',
    endDate: '',
    email: email
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/api/application/send', formData);
      alert("Application Submitted Successfully!");
      setFormData({ type: '', subject: '', description: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to submit application");
    } finally {
      setLoading(false);
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
          
          <div className="p-6 md:p-10 max-w-5xl mx-auto">
            {/* Header Section */}
            <header className="mb-10">
              <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs">Student Requests</span>
              <h1 className="text-3xl font-black text-[#1E3A5F] mt-1 flex items-center gap-3">
                New <span className="text-[#F07A4A]">Application</span>
              </h1>
              <p className="text-[#07758D] mt-1 font-medium">Need something? Send a magic letter to the academy office!</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[40px] shadow-2xl border border-white/50 space-y-8">    
              {/* Application Type Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-orange-400 uppercase ml-3 tracking-widest flex items-center gap-2">
                  <FiInfo /> What kind of request?
                </label>
                <div className="relative">
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-[20px] focus:ring-2 ring-[#3AA4AC]/10 outline-none appearance-none cursor-pointer font-semibold text-[#1E3A5F]"
                  >
                    <option value="">Select Application Type</option>
                    <option value="Leave">Leave Application</option>
                    <option value="Bonafide">Bonafide Certificate</option>
                    <option value="Fee Extension">Fee Extension Request</option>
                    <option value="Document">Document Request (Marksheet/TC)</option>
                    <option value="Other">Other Request</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-orange-400 uppercase ml-3 tracking-widest flex items-center gap-2">
                  <FiEdit3 /> Subject
                </label>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="e.g., Request for leave to visit my hometown"
                  required 
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-[20px] focus:ring-2 ring-[#3AA4AC]/10 outline-none font-semibold text-[#1E3A5F]" 
                />
              </div>

              {/* Optional Dates - Specifically for Leave */}
              {formData.type === 'Leave' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#F07A4A] uppercase ml-3 tracking-widest flex items-center gap-2">
                      <FiCalendar /> From Date
                    </label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={formData.startDate}
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 bg-[#FEF7E6] border border-orange-100 rounded-[25px] focus:ring-4 ring-[#F07A4A]/10 outline-none font-semibold text-[#1E3A5F]" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#F07A4A] uppercase ml-3 tracking-widest flex items-center gap-2">
                      <FiCalendar /> To Date
                    </label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={formData.endDate}
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 bg-[#FEF7E6] border border-orange-100 rounded-[25px] focus:ring-4 ring-[#F07A4A]/10 outline-none font-semibold text-[#1E3A5F]" 
                    />
                  </div>
                </div>
              )}

              {/* Description TextArea */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-orange-400 uppercase ml-3 tracking-widest flex items-center gap-2">
                  <FiFileText /> Description / Reason
                </label>
                <textarea 
                  name="description"
                  rows="5" 
                  placeholder="Tell us more about your request..." 
                  className="w-full p-6 bg-[#F8FAFC] border border-slate-300 rounded-[35px] focus:ring-2 ring-[#3AA4AC]/10 outline-none resize-none font-medium text-[#1E3A5F]"
                  required
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#F07A4A] text-white py-3 rounded-[30px] font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:bg-[#d9693d] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">Sending Magic Letter...</span>
                ) : (
                  <>Send Application <FiSend /></>
                )}
              </button>
            </form>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-medium text-sm">
                <FiCheckCircle className="text-[#3AA4AC]" />
                Your information is securely shared with the administration office.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Application;