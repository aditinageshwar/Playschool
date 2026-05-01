import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiPlus, FiEdit3, FiTrash2, FiClock, FiMapPin, FiLayers, FiUsers, FiCalendar, FiBookOpen, FiX, FiCheck} from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png";

const ClassAssignmentsManagement = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    section: 'A',
    academicYear: '',
    classTeacher: '',
    subjects: [],
    capacity: 0,
    startTime: '', 
    endTime: '', 
    room: ''       
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        API.get('/api/academic-admin/classes'),
        API.get('/api/academic-admin/subjects'),
        API.get('/api/academic-admin/teachers')
      ]);
      setClasses(classesRes.data.data);
      setSubjects(subjectsRes.data.data);
      setTeachers(teachersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data: ' + (error.response?.data?.message || error.message));
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

  const handleSubjectToggle = (subjectId) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subjectId)
        ? formData.subjects.filter(id => id !== subjectId)
        : [...formData.subjects, subjectId]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.classTeacher && !formData.classTeacher.match(/^[0-9a-f]{24}$/i)) {
      alert('Invalid teacher selected');
      return;
    }

    try {
      if (editingClass) {
        await API.put(`/api/academic-admin/classes/${editingClass._id}`, formData);
        alert('Class updated successfully');
      } else {
        await API.post('/api/academic-admin/classes', formData);
        alert('Class created successfully');
      }
      setShowModal(false);
      setEditingClass(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || error.message || 'Error saving class');
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      section: 'A',
      academicYear: '',
      classTeacher: '',
      subjects: [],
      capacity: 0,
      startTime: '',
      endTime: '',
      room: ''
    });
  };

  const handleEdit = (schoolClass) => {
    setEditingClass(schoolClass);
    setFormData({
      className: schoolClass.className,
      section: schoolClass.section,
      academicYear: schoolClass.academicYear,
      classTeacher: schoolClass.classTeacher?._id || '',
      subjects: schoolClass.subjects?.map(s => s._id) || [],
      capacity: schoolClass.capacity,
      startTime: schoolClass.startTime || '',
      endTime: schoolClass.endTime || '',
      room: schoolClass.room || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await API.delete(`/api/academic-admin/classes/${classId}`);
        alert('Class deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete class');
      }
    }
  };

  const handleNewClass = () => {
    setEditingClass(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main className="flex-1 bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${starsBg})` }}>
        <div className="min-h-screen bg-white/30 backdrop-blur-[1px]">
          <Navbar />

          <div className="p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">Class <span className="text-[#F07A4A]">Assignments</span></h1>
                <p className="text-[#07758D] mt-1 font-medium">Coordinate classrooms, teachers, and study modules.</p>
              </div>
              <button 
                onClick={handleNewClass}
                className="flex items-center gap-2 px-6 py-3 bg-[#3AA4AC] text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all"
              >
                <FiPlus size={20} /> Add New Class
              </button>
            </div>

             {loading && <p>Loading classes...</p>}

            {/* Table Section */}
            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-50">
              <div className="p-8 border-b border-slate-50 bg-[#F8FAFC]/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
                  <FiLayers className="text-[#3AA4AC]" /> Active Classrooms
                </h3>
                <span className="bg-[#E6F4F5] text-[#3AA4AC] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {classes.length} Total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                      <th className="p-6">Class & Section</th>
                      <th className="p-6">Schedule & Room</th>
                      <th className="p-6">Educator</th>
                      <th className="p-6">Subjects</th>
                      <th className="p-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {classes.length > 0 ? classes.map((cls) => (
                      <tr key={cls._id} className="hover:bg-teal-50/30 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-orange-50 text-[#F07A4A] rounded-2xl flex items-center justify-center font-black text-lg">
                              {cls.className}
                            </div>
                            <div>
                              <p className="font-bold text-[#1E3A5F] text-lg">Section {cls.section}</p>
                              <p className="text-xs text-slate-400 font-medium">{cls.academicYear}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-sm">
                          <div className="flex items-center gap-2 text-slate-600 mb-1 font-bold">
                            <FiClock className="text-[#3AA4AC]" /> {cls.startTime} - {cls.endTime}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 font-medium">
                            <FiMapPin className="text-[#F07A4A]" /> Room: {cls.room || 'N/A'}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="text-sm font-bold text-[#1E3A5F]">
                            {cls.classTeacher?.user?.name || <span className="text-slate-300 italic font-normal">Not Assigned</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-tighter">Class Teacher</div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {cls.subjects?.map(s => (
                              <span key={s._id} className="bg-orange-50 text-[#F07A4A] px-2 py-0.5 rounded-md text-[14px] font-black uppercase">{s.code}</span>
                            ))}
                            {(!cls.subjects || cls.subjects.length === 0) && <span className="text-slate-300 text-xs italic">Empty</span>}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(cls)} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"><FiEdit3 /></button>
                            <button onClick={() => handleDelete(cls._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic">No classrooms configured yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
              <div className="bg-white w-full max-w-2xl rounded shadow-2xl max-h-[95vh]">
                <div className="px-10 py-8 bg-white z-10 flex justify-between items-center border-b border-slate-50">
                  <div>
                    <h2 className="text-2xl font-black text-[#1E3A5F]">{editingClass ? 'Edit' : 'New'} 
                      <span className="text-[#F07A4A]"> Classroom</span>
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-[#F07A4A] rounded-full transition-colors">
                    <FiX size={24}/>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Class Name</label>
                      <input name="className" value={formData.className} onChange={handleInputChange} placeholder="e.g. Nursery" 
                        className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Section</label>
                      <select name="section" value={formData.section} onChange={handleInputChange} required
                         className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]">
                        {['A','B'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                   <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Capacity</label>
                      <input name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} required
                      className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" min="1" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Academic Year</label>
                      <input name="academicYear" type="text" value={formData.academicYear} onChange={handleInputChange} placeholder='e.g., 2024-2025' required
                      className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" min="1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Start Time</label>
                      <div className="relative">            
                         <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} 
                           className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" required />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">End Time</label>
                      <div className="relative">
                         <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} 
                           className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" required />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Room No</label>
                      <div className="relative">
                         <input type="text" name="room" value={formData.room} onChange={handleInputChange} required
                          className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" placeholder="e.g. 101" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Class Teacher</label>
                    <select name="classTeacher" value={formData.classTeacher} onChange={handleInputChange} 
                      className="w-full p-4 bg-[#F8FAFC] border border-slate-300 rounded-2xl outline-none text-[#1E3A5F]">
                      <option value="">Choose a magical mentor</option>
                      {teachers.map(t => <option key={t._id} value={t._id}>{t.user?.name} ({t.specialization})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Assign Study Modules (Subjects)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-[#F8FAFC] rounded-2xl border border-slate-300 max-h-[150px]">
                      {subjects.map((subject) => (
                        <label key={subject._id} className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${formData.subjects.includes(subject._id) ? 'shadow-sm' : 'hover:bg-white/50'}`}>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${formData.subjects.includes(subject._id) ? 'bg-[#3AA4AC]' : 'bg-slate-200'}`}>
                            {formData.subjects.includes(subject._id) && <FiCheck className="text-white" size={12} />}
                          </div>
                          <input type="checkbox" className="hidden" checked={formData.subjects.includes(subject._id)} onChange={() => handleSubjectToggle(subject._id)} />
                          <span className={`text-[11px] font-bold truncate ${formData.subjects.includes(subject._id) ? 'text-[#1E3A5F]' : 'text-slate-400'}`}>{subject.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#3AA4AC] text-white rounded-[20px] font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg shadow-teal-50 active:scale-95">
                    {editingClass ? 'Update Classroom Magic' : 'Launch New Classroom'}
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

export default ClassAssignmentsManagement;