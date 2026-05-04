import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "../../assets/styles/main.css";
import { FiEdit3, FiTrash2, FiSearch, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiX } from "react-icons/fi";

const StudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    className: "",
    section: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/admin/student-admin/students");
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStatusMessage("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.user?.name || "",
      email: student.user?.email || "",
      phone: student.user?.phone || "",
      address: student.address || "",
      dob: student.dob ? student.dob.slice(0, 10) : "",
      className: student.className || "",
      section: student.section || "",
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      setLoading(true);
      await API.put(
        `/api/admin/student-admin/students/${editingStudent._id}`,
        formData
      );
      setStatusMessage("Student profile updated successfully!");
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      setStatusMessage("Failed to update student profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      setLoading(true);
      await API.delete(`/api/admin/student-admin/students/${studentId}`);
      setStatusMessage("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      setStatusMessage("Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
    <div className="p-4 md:p-8">
      {/* Header & Search Card */}
      <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 mb-8 border border-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-[#1E3A5F] mt-1">
              Student <span className="text-[#F07A4A]">Profiles</span>
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3AA4AC]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium text-[#1E3A5F]"
            />
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 bg-[#E6F4F5] text-[#07758D] rounded-2xl border border-teal-100 font-bold flex items-center gap-2">
          <FiUser className="text-[#3AA4AC]" /> {statusMessage}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                <th className="p-6">Student Info</th>
                <th className="p-6">Contact Details</th>
                <th className="p-6">Academic Info</th>
                <th className="p-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[#1E3A5F]">
              {loading && !students.length ? (
                <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-300">Magic is happening... (Loading)</td></tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="font-semibold text-md">{student.user?.name || "N/A"}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <FiMail className="text-teal-800 shrink-0" size={14} /> {student.user?.email || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiPhone className="text-[#F07A4A] shrink-0" size={14} /> {student.user?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <span className="bg-[#FCEAE2] text-[#F07A4A] px-3 py-1 rounded-lg text-xs font-black uppercase">
                          {student.className || "-"}
                        </span>
                        <span className="bg-purple-50 text-purple-400 px-3 py-1 rounded-lg text-xs font-black uppercase">
                          Sec {student.section || "-"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 ml-2 mt-2">Roll No: {student.rollNumber || "N/A"}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEditClick(student)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                          <FiEdit3 size={18} />
                        </button>
                        <button onClick={() => handleDeleteStudent(student._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-20 text-center text-slate-400 italic font-medium">No students found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-[#1E3A5F]">Edit Profile</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-[#F07A4A] transition-colors"><FiX size={28}/></button>
              </div>

              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Student Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3AA4AC]" />
                      <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3AA4AC]" />
                      <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F07A4A]" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Birthday</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3AA4AC]" />
                      <input type="date" name="dob" value={formData.dob} onChange={handleFormChange} className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Home Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-4 text-[#F07A4A]" />
                    <textarea name="address" value={formData.address} onChange={handleFormChange} className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A] min-h-[80px]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Class</label>
                    <input type="text" name="className" value={formData.className} onChange={handleFormChange} className="w-full p-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Section</label>
                    <input type="text" name="section" value={formData.section} onChange={handleFormChange} className="w-full p-3 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A] font-bold" />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="submit" disabled={loading} className="flex-1 bg-[#3AA4AC] text-white py-3 rounded-2xl font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg shadow-teal-50">
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfiles;