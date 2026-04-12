import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "../../assets/styles/main.css";
import { FiTrendingUp, FiClock, FiArrowRight, FiAlertTriangle, FiCheckCircle, FiUser } from "react-icons/fi";

const Promotions = () => {
  const [promotionHistory, setPromotionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("history"); 
  const [bulkPromotionData, setBulkPromotionData] = useState({
    currentClass: "",
    currentSection: "",
    newClass: "",
    newSection: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [classes, setClasses] = useState([]); 
  const [sections] = useState(["A", "B"]);

  useEffect(() => {
    fetchClassNames(); 
  }, []);

  useEffect(() => {
    if (activeTab === "history") {
      fetchPromotionHistory();
    }
  }, [activeTab]);

  const fetchClassNames = async () => {
    try {
      const response = await API.get("/api/admin/student-admin/classes");
      setClasses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching class names:", error);
    }
  };

  const fetchPromotionHistory = async () => {
    try {
      setLoading(true);
      setStatusMessage('');
      const response = await API.get(
        "/api/admin/student-admin/promotions/history"
      );
      setPromotionHistory(response.data.data || []);
      if (response.data.data && response.data.data.length === 0) {
        setStatusMessage('No promotion history available yet');
      }
    } catch (error) {
      console.error("Error fetching promotion history:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch promotion history";
      setStatusMessage(errorMsg);
      setPromotionHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPromotionChange = (e) => {
    const { name, value } = e.target;
    setBulkPromotionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBulkPromotion = async (e) => {
    e.preventDefault();

    if (
      !bulkPromotionData.currentClass ||
      !bulkPromotionData.newClass ||
      !bulkPromotionData.newSection
    ) {
      setStatusMessage("Please fill in all required fields");
      return;
    }

    if (!window.confirm("Are you sure you want to promote these students? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const response = await API.post(
        "/api/admin/student-admin/promotions/bulk",
        bulkPromotionData
      );
      setStatusMessage(
        `Promotion successful! ${response.data.count} students promoted.`
      );
      setBulkPromotionData({
        currentClass: "",
        currentSection: "",
        newClass: "",
        newSection: "",
      });
      // Optionally refresh history
      setTimeout(() => {
        fetchPromotionHistory();
        fetchClassNames(); 
      }, 500);
    } catch (error) {
      console.error("Error promoting students:", error);
      setStatusMessage(
        error.response?.data?.message || "Failed to promote students"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="p-4 md:p-8">
      {/* Header & Navigation */}
      <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 mb-8 border border-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs">Growth Center</span>
            <h2 className="text-2xl font-black text-[#1E3A5F] mt-1">
              Student <span className="text-[#F07A4A]">Promotions</span>
            </h2>
          </div>

          <div className="inline-flex p-1 bg-[#F8FAFC] rounded-2xl border border-slate-100">
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === "history" ? "bg-[#1E3A5F] text-white shadow-md" : "text-slate-400 hover:text-[#1E3A5F]"
              }`}
            >
              <FiClock /> History
            </button>
            <button
              onClick={() => setActiveTab("promotionForm")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === "promotionForm" ? "bg-[#1E3A5F] text-white shadow-md" : "text-slate-400 hover:text-[#1E3A5F]"
              }`}
            >
              <FiTrendingUp /> New Promotion
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={`mb-6 p-4 rounded-2xl border font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${
          statusMessage.includes("Success") ? "bg-[#E6F4F5] text-[#07758D] border-teal-100" : "bg-red-50 text-red-500 border-red-100"
        }`}>
          {statusMessage.includes("Success") ? <FiCheckCircle /> : <FiAlertTriangle />} {statusMessage}
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white rounded-[40px] shadow-xl border border-slate-50 overflow-hidden min-h-[400px]">
        
        {activeTab === "history" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                  <th className="p-6">Student Name</th>
                  <th className="p-6">Promotion Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {promotionHistory.length > 0 ? (
                  promotionHistory.map((student) => (
                    <tr key={student._id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FCEAE2] text-[#F07A4A] rounded-full flex items-center justify-center font-bold">
                            {student.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-[#1E3A5F]">{student.user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{student.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-3">
                          {student.promotionHistory?.map((p, idx) => (
                            <div key={idx} className="bg-[#E6F4F5] p-3 rounded-2xl border border-teal-50 flex items-center gap-3">
                              <div className="text-center">
                                <p className="text-[9px] font-black text-[#3AA4AC] uppercase">From</p>
                                <p className="text-sm font-bold text-[#1E3A5F]">{p.from}</p>
                              </div>
                              <FiArrowRight className="text-slate-300" />
                              <div className="text-center">
                                <p className="text-[9px] font-black text-[#F07A4A] uppercase">To</p>
                                <p className="text-sm font-bold text-[#1E3A5F]">{p.to}</p>
                              </div>
                              <div className="ml-2 pl-3 border-l border-teal-100">
                                <p className="text-[9px] font-medium text-slate-400 italic">{new Date(p.promotedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2" className="p-20 text-center text-slate-400 italic">The magic map of promotions is empty.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Promotion Form Tab --- */}
        {activeTab === "promotionForm" && (
          <div className="p-10 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-14 h-14 bg-[#FCEAE2] text-[#F07A4A] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp size={28} />
              </div>
              <h3 className="text-2xl font-black text-[#1E3A5F]">Bulk Promotion Form</h3>
              <p className="text-slate-400 text-sm mt-1">Easily move an entire group of learners to their next milestone.</p>
            </div>

            <form onSubmit={handleBulkPromotion} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Info */}
                <div className="bg-[#F8FAFC] p-6 rounded-[32px] border border-slate-100">
                  <h4 className="text-xs font-black text-[#3AA4AC] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#3AA4AC] rounded-full"></span> Current Level
                  </h4>
                  <div className="space-y-4">
                    <input
                      type="text" name="currentClass" placeholder="Current Class (e.g. Nursery)"
                      value={bulkPromotionData.currentClass} onChange={handleBulkPromotionChange}
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-semibold"
                    />
                    <select
                      name="currentSection" value={bulkPromotionData.currentSection} onChange={handleBulkPromotionChange}
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]"
                    >
                      <option value="">Section</option>
                      {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>

                {/* New Info */}
                <div className="bg-[#FEF7E6] p-6 rounded-[32px] border border-orange-50">
                  <h4 className="text-xs font-black text-[#F07A4A] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F07A4A] rounded-full"></span> New Level
                  </h4>
                  <div className="space-y-4">
                    <input
                      type="text" name="newClass" placeholder="Target Class (e.g. LKG)"
                      value={bulkPromotionData.newClass} onChange={handleBulkPromotionChange}
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A] font-semibold"
                    />
                    <select
                      name="newSection" value={bulkPromotionData.newSection} onChange={handleBulkPromotionChange}
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A]"
                    >
                      <option value="">Select New Section</option>
                      {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Warning Card */}
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4">
                <FiAlertTriangle className="text-[#F07A4A] shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-xs font-black text-red-500 uppercase tracking-tight">Important Notice</p>
                  <p className="text-sm text-red-500/80 leading-relaxed font-medium">
                    This action will update the class and section records for all students currently in the selected class. Please verify the details before proceeding.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-[#3AA4AC] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg shadow-teal-50">
                  {loading ? "Processing..." : "Promote Learners"}
                </button>
                <button type="button" onClick={() => setBulkPromotionData({currentClass:"", currentSection:"", newClass:"", newSection:""})} 
                  className="px-8 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;