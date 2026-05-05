import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiUserPlus , FiX, FiEyeOff, FiEye, FiRefreshCw, FiGrid, FiFileText, FiUsers, FiLayers, FiTrendingUp} from 'react-icons/fi';
import API from '../../api/axios';
import Admissions from './Admission';
import StudentProfiles from './StudentProfiles';
import ClassAllocation from './ClassAllocation';
import Promotions from './Promotions';
import starsBg from "../../images/programs/bg.png"; 

const StudentAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState([
    { title: "Total Enrolled", value: "0", fill: "0%", color: "#3AA4AC", bg: "bg-[#E6F4F5]" },
    { title: "New Admissions", value: "0", fill: "0%", color: "#F07A4A", bg: "bg-[#FCEAE2]" },
    { title: "Exited Students", value: "0", fill: "0%", color: "#3AA4AC", bg: "bg-[#E6F4F5]" },
    { title: "Unallocated Students", value: "0", fill: "0%", color: "#F07A4A", bg: "bg-[#FCEAE2]" }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    className: '',
    section: '',
    rollNumber: '',
    address: '',
    dob: ''
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    
      // Password Validation Regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^\+91\d{10}$/;

    if (!phoneRegex.test(newStudent.phone)) {
      alert("Phone number must start with +91 followed by 10 digits (e.g., +919876543210)");
      return;
    }

    if (!passwordRegex.test(newStudent.password)) {
      alert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
      return; 
    }

    try {
      setSubmitting(true);
      await API.post('/api/admin/student-admin/create-student', newStudent);
      alert("Student Admission Successful!");
      setShowModal(false); 
      setNewStudent({ name: '', email: '', phone: '', password: '', className: '', section: '',  rollNumber: '', address: '', dob: '' });
      fetchDashboardStats(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error during admission");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/api/admin/student-admin/dashboard-stats');

      const data = response.data.data;
      const totalStudents = data.totalStudents || 0;
      const newAdmissions = data.newAdmissions || 0;
      const totalLeft = data.totalLeft || 0;
      const unallocatedStudents = data.unallocatedStudents || 0;

      // Calculate fill percentages (max 100%)
      const maxStudents = Math.max(totalStudents, 100);                        // Use at least 100 as baseline
      const totalFill = Math.min((totalStudents / maxStudents) * 100, 100);
      const admissionsFill = Math.min((newAdmissions / Math.max(totalStudents, 1)) * 100, 100);
      const unresolvedFill = Math.min((totalLeft / Math.max(totalStudents, 1)) * 100, 100);
      const unallocatedFill = Math.min((unallocatedStudents / Math.max(totalStudents, 1)) * 100, 100);

      setStats([
        {
          title: "Total Enrolled",
          value: totalStudents.toLocaleString(),
          fill: `${totalFill}%`,
          color: "var(--primary)"
        },
        {
          title: "New Admissions",
          value: newAdmissions.toLocaleString(),
          fill: `${admissionsFill}%`,
          color: "var(--success)"
        },
        {
          title: "Exited Students",
          value: totalLeft.toLocaleString(),
          fill: `${unresolvedFill}%`,
          color: "var(--warning)"
        },
        {
          title: "Unallocated Students",
          value: unallocatedStudents.toLocaleString(),
          fill: `${unallocatedFill}%`,
          color: "var(--danger)"
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { id: 'applications', label: 'Applications', icon: <FiFileText /> },
  { id: 'profiles', label: 'Student Profiles', icon: <FiUsers /> },
  { id: 'allocation', label: 'Class Allocation', icon: <FiLayers /> },
  { id: 'promotions', label: 'Promotions', icon: <FiTrendingUp /> }
];

  // Refresh stats when switching to dashboard tab
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch(activeTab) {
      case 'applications':
        return <Admissions />;
      case 'profiles':
        return <StudentProfiles />;
      case 'allocation':
        return <ClassAllocation />;
      case 'promotions':
        return <Promotions />;
      case 'dashboard':
        return (
        <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">Student <span className="text-[#F07A4A]">Management</span></h1>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchDashboardStats} className="p-3 bg-white text-[#3AA4AC] rounded-2xl shadow-sm border border-slate-100 hover:rotate-180 transition-all duration-500">
              <FiRefreshCw size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-[#3AA4AC] text-white rounded-2xl font-bold shadow-lg shadow-teal-100 hover:scale-105 transition-all">
              <FiUserPlus /> New Admission
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 group">
              <p className="text-[#3AA4AC] font-bold text-[10px] uppercase tracking-widest mb-2">{stat.title}</p>
              <h2 className="text-3xl font-black text-[#1E3A5F]">{loading ? '...' : stat.value}</h2>
              <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-1000 group-hover:scale-x-110" style={{ width: loading ? '0%' : stat.fill, backgroundColor: stat.color }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.filter(item => item.id !== 'dashboard').map(item => (
            <div key={item.id} onClick={() => setActiveTab(item.id)} className="bg-white/70 backdrop-blur-md p-8 rounded-[32px] border border-white/50 shadow-lg text-center cursor-pointer hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 text-white bg-orange-300 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-400 group-hover:text-white transition-colors">
                {React.cloneElement(item.icon, { size: 32 })}
              </div>
              <p className="font-black text-[#1E3A5F] uppercase text-xs tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main className="flex-1 bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${starsBg})` }}>
        <div className="min-h-screen bg-white/30 backdrop-blur-[1px]">
          <Navbar />
          
          <div className="px-6 md:px-10 py-4">
            <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-md rounded-[20px] shadow-sm border border-white/50">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-6 py-2.5 rounded-[15px] text-xs font-bold transition-all ${
                    activeTab === item.id ? "bg-[#1E3A5F] text-white shadow-md" : "text-[#1E3A5F] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10">{renderContent()}</div>

          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md">
              <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl max-h-[90vh] relative animate-in zoom-in duration-300">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md px-10 mt-8 z-10 flex justify-between items-center">
                  <h2 className="text-2xl font-black text-[#1E3A5F]">New <span className="text-[#F07A4A]">Admission</span></h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-[#F07A4A]"><FiX size={28} /></button>
                </div>

                <form onSubmit={handleAdmissionSubmit} className="p-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input placeholder="Full Name" required className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                    <input placeholder="Email" type="email" required className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
                    <input placeholder="Phone (+91)" required className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                    <div className="relative">
                      <input placeholder="Password" type={showPassword ? "text" : "password"} required className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-5 text-slate-300">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <select required className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none" value={newStudent.className} onChange={e => setNewStudent({...newStudent, className: e.target.value})}>
                      <option value="">Class</option>
                      {["Playgroup", "Nursery", "LKG", "UKG", "1st", "2nd"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select required className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none" value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})}>
                      <option value="">Section</option>
                      {['A', 'B'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <input placeholder="Roll No" className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" value={newStudent.rollNumber} onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})} />
                    <input type="date" className="p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC]" value={newStudent.dob} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} />
                  </div>

                  <textarea placeholder="Address" rows="3" className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-[#3AA4AC]" value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} />

                  <button type="submit" disabled={submitting} className="w-full py-5 bg-[#3AA4AC] text-white rounded-[20px] font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg shadow-teal-50">
                    {submitting ? 'Admitting...' : '🚀 Finalize Admission'}
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

export default StudentAdminDashboard;