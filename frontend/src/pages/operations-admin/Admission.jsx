import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "../../assets/styles/main.css";
import { FiCheck, FiX, FiFilter, FiLoader, FiUser } from "react-icons/fi";

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [approveData, setApproveData] = useState({
    className: "",
    section: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [modalAction, setModalAction] = useState(""); // "approve" or "reject"
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
      console.error("Error fetching admissions:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch admissions";
      setStatusMessage(errorMsg);
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (admission) => {
    setSelectedAdmission(admission);
    setModalAction("approve");
    setApproveData({ className: "", section: "" });
    setRejectReason("");
    setShowModal(true);
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    if (!approveData.className || !approveData.section) {
      setStatusMessage("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await API.post(
        `/api/admin/student-admin/admissions/${selectedAdmission._id}/approve`,
        approveData
      );
      setStatusMessage("Admission approved successfully!");
      setShowModal(false);
      fetchAdmissions();
    } catch (error) {
      console.error("Error approving admission:", error);
      setStatusMessage("Failed to approve admission");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = (admission) => {
    setSelectedAdmission(admission);
    setModalAction("reject");
    setApproveData({ className: "", section: "" });
    setRejectReason("");
    setShowModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await API.post(
        `/api/admin/student-admin/admissions/${selectedAdmission._id}/reject`,
        { reason: rejectReason }
      );
      setStatusMessage("Admission rejected successfully!");
      setShowModal(false);
      fetchAdmissions();
    } catch (error) {
      console.error("Error rejecting admission:", error);
      setStatusMessage("Failed to reject admission");
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
            Admissions <span className="text-[#F07A4A]">Queue</span>
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
                              onClick={() => handleApproveClick(adm)}
                              className="bg-[#E6F4F5] text-[#3AA4AC] p-3 rounded-xl hover:bg-[#3AA4AC] hover:text-white transition-all shadow-sm"
                              title="Approve"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() => handleRejectClick(adm)}
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

      {/* Decision Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <h3 className="text-2xl font-black text-[#1E3A5F] mb-2 italic">
                {modalAction === "approve" ? "Finalize" : "Reject"} <span className="text-[#F07A4A]">Admission</span>
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                Applicant: <span className="font-bold text-[#1E3A5F]">{selectedAdmission?.student?.user?.name}</span>
              </p>

              {modalAction === "approve" ? (
                <form onSubmit={handleApproveSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-[#3AA4AC] uppercase ml-1">Assign Class</label>
                    <input
                      type="text"
                      value={approveData.className}
                      onChange={(e) => setApproveData({ ...approveData, className: e.target.value })}
                      placeholder="e.g. Nursery"
                      className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-[#3AA4AC] uppercase ml-1">Section</label>
                    <input
                      type="text"
                      value={approveData.section}
                      onChange={(e) => setApproveData({ ...approveData, section: e.target.value })}
                      placeholder="e.g. A"
                      className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] mt-1"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-[#3AA4AC] text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-50">Approve</button>
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black">Cancel</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRejectSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-red-400 uppercase ml-1">Reason for Rejection</label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Why is this application being rejected?"
                      rows="4"
                      className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-400 mt-1 resize-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-50">Reject</button>
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;