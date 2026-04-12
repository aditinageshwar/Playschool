import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiPlus, FiEdit3, FiTrash2, FiBook, FiBookOpen, FiCode, FiActivity, FiX } from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const SubjectsManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    syllabus: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/academic-admin/subjects');
      setSubjects(response.data.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await API.put(`/api/academic-admin/subjects/${editingSubject._id}`, formData);
        alert('Subject updated successfully');
      } else {
        await API.post('/api/academic-admin/subjects', formData);
        alert('Subject created successfully');
      }
      setShowModal(false);
      setEditingSubject(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        credits: 3,
        syllabus: ''
      });
      fetchSubjects();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error saving subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      credits: subject.credits,
      syllabus: subject.syllabus
    });
    setShowModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await API.delete(`/api/academic-admin/subjects/${subjectId}`);
        alert('Subject deleted successfully');
        fetchSubjects();
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete subject');
      }
    }
  };

  const handleNewSubject = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      credits: 3,
      syllabus: ''
    });
    setShowModal(true);
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

          <div className="p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">
                  Manage <span className="text-[#F07A4A]">Subjects</span>
                </h1>
                <p className="text-[#07758D] mt-1 font-medium">Design the learning path for our young stars.</p>
              </div>
              <button 
                onClick={handleNewSubject}
                className="flex items-center gap-2 px-6 py-3 bg-[#3AA4AC] text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all"
              >
                <FiPlus size={20} /> Add New Subject
              </button>
            </div>
            
            {loading && <p>Loading subjects...</p>}

            {/* Table Card Section */}
            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-50">
              <div className="p-8 border-b border-slate-50 bg-[#F8FAFC]/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
                  <FiBookOpen className="text-[#F07A4A]" /> Subject Directory
                </h3>
                <span className="bg-[#E6F4F5] text-[#3AA4AC] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {subjects.length} Total
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                      <th className="p-6">Subject Info</th>
                      <th className="p-6">Credits</th>
                      <th className="p-6">Description</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan="5" className="p-20 text-center text-[#3AA4AC] font-bold animate-pulse">Consulting the magic books...</td></tr>
                    ) : subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <tr key={subject._id} className="hover:bg-teal-50/30 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#FCEAE2] text-[#F07A4A] rounded-xl flex items-center justify-center font-bold">
                                <FiBook />
                              </div>
                              <div>
                                <p className="font-bold text-[#1E3A5F] text-lg">{subject.name}</p>
                                <p className="text-xs text-slate-400 font-mono">Code: {subject.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="bg-[#FCEAE2] text-[#F07A4A] px-3 py-1 rounded-lg text-sm font-black">
                              {subject.credits} Points
                            </span>
                          </td>
                          <td className="p-6 max-w-xs">
                            <p className="text-sm text-slate-500 line-clamp-2 font-medium">
                              {subject.description || 'No description provided'}
                            </p>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${subject.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                              {subject.status}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEdit(subject)} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><FiEdit3 /></button>
                              <button onClick={() => handleDelete(subject._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><FiTrash2 /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic">No subjects found in the curriculum.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
              <div className="bg-white w-full max-w-2xl shadow-2xl max-h-[100vh] rounded-lg">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md px-10 py-8 z-10 flex justify-between items-center border-b border-slate-50">
                  <h2 className="text-2xl font-black text-[#1E3A5F]">
                    {editingSubject ? 'Edit' : 'Add'} <span className="text-[#F07A4A]">Subject</span>
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-[#F07A4A] transition-colors"><FiX size={28}/></button>
                </div>

                <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Subject Name</label>
                      <div className="relative">
                        <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3AA4AC]" />
                        <input name="name" type="text" value={formData.name} onChange={handleInputChange} 
                          className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-bold" placeholder="e.g. Alphabets & phonics" required />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Subject Code</label>
                      <div className="relative">
                        <FiCode className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F07A4A]" />
                        <input name="code" type="text" value={formData.code} onChange={handleInputChange} 
                          className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A] font-bold" placeholder="ABC-101" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex justify-between">
                      Learning Credits <span>{formData.credits} Points</span>
                    </label>
                    <input name="credits" type="range" min="1" max="10" value={formData.credits} onChange={handleInputChange} 
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#3AA4AC]" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Short Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} 
                      className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] min-h-[100px] resize-none" placeholder="What will the kids learn?" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Syllabus Outline</label>
                    <textarea name="syllabus" value={formData.syllabus} onChange={handleInputChange} 
                      className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#F07A4A] min-h-[100px] resize-none" placeholder="Detailed topics..." />
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#3AA4AC] text-white rounded-[20px] font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg shadow-teal-50 active:scale-95">
                    {editingSubject ? 'Confirm Magic Update' : 'Create New Subject'}
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

export default SubjectsManagement;