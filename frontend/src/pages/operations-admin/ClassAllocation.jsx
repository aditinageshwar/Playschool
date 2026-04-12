import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "../../assets/styles/main.css";
import { FiLayers, FiUserCheck, FiUserPlus, FiHash, FiX, FiFilter, FiEdit3 } from "react-icons/fi";

const ClassAllocation = () => {
  const [unallocatedStudents, setUnallocatedStudents] = useState([]);
  const [studentsByClass, setStudentsByClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("unallocated");                            // unallocated or byClass
  const [selectedClass, setSelectedClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [allocationData, setAllocationData] = useState({
    className: "",
    section: "",
    rollNumber: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [classes, setClasses] = useState([]); // Dynamic classes from database
  const [sections] = useState(["A", "B"]);

  useEffect(() => {
    fetchClassNames(); // Fetch available classes on component mount
  }, []);

  useEffect(() => {
    if (activeTab === "unallocated") {
      fetchUnallocatedStudents();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedClass && activeTab === "byClass") {
      fetchStudentsByClass();
    }
  }, [selectedClass, activeTab]);

  const fetchClassNames = async () => {
    try {
      const response = await API.get("/api/admin/student-admin/classes");
      setClasses(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching class names:", error);
      setClasses([]);
    }
  };

  const fetchUnallocatedStudents = async () => {
    try {
      setLoading(true);
      setStatusMessage("");
      const response = await API.get(
        "/api/admin/student-admin/allocation/unallocated"
      );
      setUnallocatedStudents(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching unallocated students:", error);
      setStatusMessage("Failed to fetch unallocated students");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByClass = async () => {
    try {
      setLoading(true);
      setStatusMessage("");
      const response = await API.get(
        `/api/admin/student-admin/classes/${selectedClass}/students`
      );
      setStudentsByClass(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching students by class:", error);
      setStudentsByClass([]);
      setStatusMessage("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateClick = (student) => {
    setEditingStudent(student);
    setAllocationData({
      className: "",
      section: "",
      rollNumber: "",
    });
    setShowModal(true);
  };

  const handleAllocationFormChange = (e) => {
    const { name, value } = e.target;
    setAllocationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAllocation = async (e) => {
    e.preventDefault();

    if (!allocationData.className || !allocationData.section) {
      setStatusMessage("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.post(
        `/api/admin/student-admin/allocation/${editingStudent._id}`,
        allocationData
      );
      setStatusMessage("Student allocated to class successfully!");
      setShowModal(false);
      fetchUnallocatedStudents();
      fetchClassNames(); // Refresh class names after allocation
    
      if (activeTab === "byClass" && selectedClass) {
      await fetchStudentsByClass();
      }
    } catch (error) {
      console.error("Error allocating student:", error);
      setStatusMessage(
        error.response?.data?.message || "Failed to allocate student"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReAllocate = (student) => {
    setEditingStudent(student);
    setAllocationData({
      className: student.className || "",
      section: student.section || "",
      rollNumber: student.rollNumber || "",
    });
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header & Tab Toggle */}
      <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 mb-8 border border-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-[#1E3A5F] mt-1">
              Class <span className="text-[#F07A4A]"> Allocation</span>
            </h2>
          </div>

          <div className="inline-flex p-1 bg-[#F8FAFC] rounded-2xl border border-slate-100">
            <button
              onClick={() => setActiveTab("unallocated")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === "unallocated" ? "bg-[#1E3A5F] text-white shadow-md" : "text-slate-400 hover:text-[#1E3A5F]"
              }`}
            >
              <FiUserPlus /> Unallocated
            </button>
            <button
              onClick={() => setActiveTab("byClass")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === "byClass" ? "bg-[#1E3A5F] text-white shadow-md" : "text-slate-400 hover:text-[#1E3A5F]"
              }`}
            >
              <FiLayers /> View By Class
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 bg-[#E6F4F5] text-[#07758D] rounded-2xl border border-teal-100 font-bold flex items-center gap-2">
          <FiUserCheck /> {statusMessage}
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] shadow-xl border border-slate-50 overflow-hidden min-h-[400px]">
        
        {/* Unallocated View */}
        {activeTab === "unallocated" && (
          <div className="p-0">
            <div className="p-8 border-b border-slate-50 bg-[#F8FAFC]/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1E3A5F]">Pending Allocation ({unallocatedStudents.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                    <th className="p-6">Student Name</th>
                    <th className="p-6">Contact</th>
                    <th className="p-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {unallocatedStudents.length > 0 ? (
                    unallocatedStudents.map((s) => (
                      <tr key={s._id} className="hover:bg-teal-50/30 transition-colors group">
                        <td className="p-6 font-bold text-[#1E3A5F] text-lg">{s.user?.name || "N/A"}</td>
                        <td className="p-6 text-sm text-slate-500 font-medium">{s.user?.email}</td>
                        <td className="p-6 text-center">
                          <button onClick={() => handleAllocateClick(s)} className="bg-[#F07A4A] text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-[#d9693d] transition-all shadow-md shadow-orange-100">
                            ALLOCATE
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="p-20 text-center text-slate-400 font-medium italic">Hurray! All students are in their classrooms.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* By Class View */}
        {activeTab === "byClass" && (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8 bg-[#F8FAFC] p-4 rounded-[20px] border border-slate-100">
              <FiFilter className="text-[#3AA4AC]" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent outline-none font-bold text-[#1E3A5F] flex-1 cursor-pointer"
              >
                <option value="">-- Select Classroom --</option>
                {classes.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>

            {selectedClass ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em] border-b border-slate-100">
                      <th className="pb-4 px-2">Learner</th>
                      <th className="pb-4 px-2">Section</th>
                      <th className="pb-4 px-2">Roll No</th>
                      <th className="pb-4 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {studentsByClass.length > 0 ? (
                      studentsByClass.map((s) => (
                        <tr key={s._id} className="hover:bg-teal-50/30 transition-colors">
                          <td className="py-4 px-2 font-bold text-[#1E3A5F]">{s.user?.name}</td>
                          <td className="py-4 px-2">
                             <span className="px-3 py-1 rounded-lg text-xs font-black">SEC {s.section || "-"}</span>
                          </td>
                          <td className="py-4 px-2 font-mono text-slate-800">{s.rollNumber || "N/A"}</td>
                          <td className="py-4 px-2 text-center">
                            <button onClick={() => handleReAllocate(s)} className="p-2 bg-slate-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                              <FiEdit3 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="p-10 text-center text-slate-300">Classroom is empty.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-300 font-medium">Please select a class to view learners.</div>
            )}
          </div>
        )}
      </div>

      {/* Allocation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-black text-[#1E3A5F] italic">Assign <span className="text-[#F07A4A]">Class</span></h3>
                <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-[#F07A4A]"><FiX size={28}/></button>
              </div>
              
              <p className="mb-8 text-slate-500 text-sm">Assigning class for: <span className="font-black text-[#1E3A5F]">{editingStudent?.user?.name}</span></p>

              <form onSubmit={handleSaveAllocation} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-[#3AA4AC] uppercase ml-2">Class Name</label>
                  <input
                    type="text"
                    name="className"
                    value={allocationData.className}
                    onChange={handleAllocationFormChange}
                    placeholder="e.g. Nursery"
                    className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-[#F07A4A] uppercase ml-2">Section</label>
                    <select
                      name="section"
                      value={allocationData.section}
                      onChange={handleAllocationFormChange}
                      className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A] font-bold"
                      required
                    >
                      <option value="">Select</option>
                      {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#3AA4AC] uppercase ml-2">Roll No</label>
                    <div className="relative">
                      <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="text"
                        name="rollNumber"
                        value={allocationData.rollNumber}
                        onChange={handleAllocationFormChange}
                        className="w-full pl-10 pr-4 py-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#3AA4AC] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg">
                  Confirm Allocation
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassAllocation;