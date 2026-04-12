import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiEyeOff, FiMail, FiPhone, FiBook, FiAward, FiX} from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const TeachersAcademicManagement = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    qualifications: '',
    experience: 0,
    department: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/academic-admin/teachers');
      setTeachers(response.data.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      alert('Failed to fetch teachers');
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
      if (editingTeacher) {
        // Update teacher
        const updateData = { ...formData };
        delete updateData.password; // Don't send password on update
        delete updateData.email; // Don't change email
        await API.put(`/api/academic-admin/teachers/${editingTeacher._id}`, updateData);
        alert('Teacher updated successfully');
      } 
      else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const phoneRegex = /^\+91\d{10}$/;

        if (!passwordRegex.test(formData.password)) {
          alert("Password must be 8+ chars with uppercase, lowercase, number, and special character.");
          return;
        }

        if (!phoneRegex.test(formData.phone)) {
          alert("Phone number must start with +91 followed by 10 digits (e.g., +919876543210)");
          return;
        }
        // Create new teacher
        await API.post('/api/academic-admin/teachers', formData);
        alert('Teacher created successfully');
      }
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        qualifications: '',
        experience: 0,
        department: ''
      });
      fetchTeachers();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error saving teacher');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.user.name,
      email: teacher.user.email,
      phone: teacher.user.phone,
      password: '',
      specialization: teacher.specialization,
      qualifications: teacher.qualifications,
      experience: teacher.experience,
      department: teacher.department
    });
    setShowModal(true);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await API.delete(`/api/academic-admin/teachers/${teacherId}`);
        alert('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete teacher');
      }
    }
  };

  const handleNewTeacher = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      specialization: '',
      qualifications: '',
      experience: 0,
      department: ''
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
                <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs">Faculty Hub</span>
                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">Academic <span className="text-[#F07A4A]">Educators</span></h1>
              </div>
              <button 
                onClick={handleNewTeacher}
                className="flex items-center gap-2 px-6 py-3 bg-[#3AA4AC] text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all"
              >
                <FiPlus size={20} /> Add New Teacher
              </button>
            </div>

          {loading && <p>Loading teachers...</p>}

          {/* Table Section */}
            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-50">
              <div className="p-8 bg-[#F8FAFC]/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
                  <FiAward className="text-[#F07A4A]" /> Teacher Directory
                </h3>
                 <span className="bg-[#E6F4F5] text-[#3AA4AC] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {teachers.length} Total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                      <th className="p-6">Educator</th>
                      <th className="p-6">Department</th>
                      <th className="p-6">Experience</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teachers.length > 0 ? teachers.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-teal-50/30 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#FCEAE2] text-[#F07A4A] rounded-full flex items-center justify-center font-black text-xl">
                              {teacher.user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#1E3A5F] text-lg">{teacher.user.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{teacher.user.email}</p>
                              <p className="text-xs text-slate-400 font-medium">{teacher.user.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="bg-orange-50 text-[#F07A4A] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight">
                            {teacher.department || 'General'}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">{teacher.specialization}</p>
                        </td>
                        <td className="p-6">
                           <p className="text-sm font-bold text-slate-600">{teacher.experience} Years</p>
                           <p className="text-[10px] text-slate-400 line-clamp-1">{teacher.qualifications}</p>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${teacher.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(teacher)} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><FiEdit3 /></button>
                            <button onClick={() => handleDelete(teacher._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic">No educators found in the magic directory.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
              <div className="bg-white w-full max-w-2xl shadow-2xl max-h-[90vh]">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md px-10 py-8 z-10 flex justify-between items-center border-b border-slate-50">
                  <h2 className="text-2xl font-black text-[#1E3A5F]">
                    {editingTeacher ? 'Edit' : 'New'} <span className="text-[#F07A4A]">Educator</span>
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-[#F07A4A]"><FiX size={28}/></button>
                </div>

                <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                      <input name="name" type="text" value={formData.name} onChange={handleInputChange} 
                       className="w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={editingTeacher} 
                        className={`w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none ${editingTeacher ? 'opacity-50' : 'focus:ring-2 focus:ring-[#3AA4AC]'}`} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Phone No</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} 
                        className="w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" required />
                    </div>
                    {!editingTeacher && (
                      <div className="space-y-1 relative">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Password</label>
                        <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} 
                          className="w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-slate-300">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Specialization</label>
                      <input name="specialization" value={formData.specialization} onChange={handleInputChange} 
                        className="w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none" placeholder="e.g. Arts & Crafts" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Department</label>
                      <input name="department" value={formData.department} onChange={handleInputChange} 
                        className="w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Experience (Years)</label>
                      <input name="experience" type="number" value={formData.experience} onChange={handleInputChange} 
                        className="w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none" min="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Qualifications</label>
                      <input name="qualifications" value={formData.qualifications} onChange={handleInputChange} 
                        className="w-full p-2 bg-[#F8FAFC] border border-slate-300 rounded-xl outline-none" placeholder="e.g. B.Ed, PhD" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#3AA4AC] text-white rounded-[20px] font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg shadow-teal-50">
                    {editingTeacher ? 'Update Profile' : 'Confirm Registration'}
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

export default TeachersAcademicManagement;