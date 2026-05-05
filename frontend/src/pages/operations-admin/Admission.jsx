import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "../../assets/styles/main.css";
import { FiCheck, FiX, FiFilter, FiLoader, FiUser } from "react-icons/fi";

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      setStatusMessage('');
      const response = await API.get("/api/admin/student-admin/admissions");
      setAdmissions(response.data.data || []);
      if (response.data.data?.length === 0) {
        setStatusMessage('No admissions available');
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch applications";
      setStatusMessage(errorMsg);
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubmit = async (adm) => {
    try {
      setLoading(true);
      await API.post(`/api/admin/student-admin/admissions/${adm._id}/approve`);
      setStatusMessage("Application approved successfully!");
      fetchAdmissions();
    } catch (error) {
      console.error("Error approving application:", error);
      setStatusMessage("Failed to approve application");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = async (adm) => {
    try {
      setLoading(true);
      await API.post(
        `/api/admin/student-admin/admissions/${adm._id}/reject`);
      setStatusMessage("Application rejected successfully!");
      fetchAdmissions();
    } catch (error) {
      console.error("Error rejecting application:", error);
      setStatusMessage("Failed to reject application");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmissions = admissions.filter((adm) => {
    if (filter === "all") return true;
    return adm.status.toLowerCase() === filter;
  });

  return (
    <div className="p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 mb-8 border border-slate-50">
        <div>
          <h2 className="text-2xl font-black text-[#1E3A5F] mt-1 capitalize">
            Applications <span className="text-[#F07A4A]">Queue</span>
          </h2>
        </div>

        {/* Filter Dropdown */}
        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-2xl border border-slate-100">
          <FiFilter className="text-[#3AA4AC]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent outline-none font-bold text-[#1E3A5F] text-sm cursor-pointer"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 bg-[#E6F4F5] text-[#07758D] rounded-2xl border border-teal-100 font-bold flex items-center gap-2 animate-pulse">
          <FiCheck /> {statusMessage}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                <th className="p-6">Applicant</th>
                <th className="p-6">Contact Info</th>
                <th className="p-6">Request Details</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-center">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <FiLoader className="animate-spin inline-block text-4xl text-[#3AA4AC]" />
                  </td>
                </tr>
              ) : filteredAdmissions.length > 0 ? (
                filteredAdmissions.map((adm) => (
                  <tr key={adm._id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="p-6 font-bold text-[#1E3A5F] flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FCEAE2] text-[#F07A4A] rounded-full flex items-center justify-center">
                        <FiUser />
                      </div>
                      {adm.student?.user?.name || "N/A"}
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-medium text-slate-600">{adm.student?.user?.email}</p>
                      <p className="text-xs text-slate-400">{adm.student?.user?.phone}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-medium text-slate-600">{adm.subject}</p>
                      <p className="text-xs text-slate-400">{adm.description}</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${
                        adm.status === "Pending" ? "bg-orange-50 text-[#F07A4A]" : 
                        adm.status === "Approved" ? "bg-green-100 text-green-600" : 
                        "bg-red-50 text-red-500"
                      }`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        {adm.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleApproveSubmit(adm)}
                              className="bg-[#E6F4F5] text-[#3AA4AC] p-3 rounded-xl hover:bg-[#3AA4AC] hover:text-white transition-all shadow-sm"
                              title="Approve"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() => handleRejectSubmit(adm)}
                              className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Reject"
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-300 text-xs">Closed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400 font-medium italic">
                    No matching applications in the magic book.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admissions;