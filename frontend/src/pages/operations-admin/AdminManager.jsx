import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiPlus, FiEyeOff, FiEye, FiTrash2, FiUser} from 'react-icons/fi';
import starsBg from "../../images/programs/bg.png"; 

const AdminManager = () => {
  const { role } = useParams();      //fetch from url
  const [showPassword, setShowPassword] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone:'', password: '' });

  const fetchAdmins = async () => {
    try {
      const res = await API.get(`/api/super-admin/role/${role}`);
      setAdmins(res.data);
    } catch (err) { 
        console.error(err); 
    }
  };

  useEffect(() => { 
    fetchAdmins(); 
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password Validation Regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^\+91\d{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      alert("Phone number must start with +91 followed by 10 digits (e.g., +919876543210)");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      alert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
      return; 
    }

    try {
      await API.post('/api/super-admin/create-admin', { ...formData, role });
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', password: '' });
      fetchAdmins();
    } catch (err) { 
        alert(err.response?.data?.message || "Error adding admin"); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this admin?")) {
      await API.delete(`/api/super-admin/delete-admin/${id}`);
      fetchAdmins();
    }
  };

  return (
   <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main className="flex-1 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${starsBg})` }}>
        <Navbar />

        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 mb-10 border border-slate-50">
            <div>
              <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs">Staff Management</span>
              <h2 className="text-2xl font-black text-[#1E3A5F] mt-1 capitalize">
                Manage <span className="text-[#F07A4A]">{role.replace('-', ' ')}</span>
              </h2>
            </div>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className={`mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                showForm 
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                : "bg-[#F07A4A] text-white hover:bg-[#d9693d] shadow-orange-200"
              }`}
            >
              {showForm ? "Close Form" : <><FiPlus size={20} /> Add New Admin</>}
            </button>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white p-8 rounded-[32px] shadow-xl border border-teal-50 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E6F4F5] text-[#3AA4AC] rounded-lg flex items-center justify-center">
                  <FiUser />
                </div>
                Registration Details
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <input className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium" 
                    type="text" placeholder="Full Name" required value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <input className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium" 
                    type="email" placeholder="Email Address" required value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <input className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium" 
                    type="text" placeholder="Phone (+91...)" required maxLength={13} value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div className="relative">
                  <input className="w-full p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium" 
                    type={showPassword ? "text" : "password"} placeholder="Password" required value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-5 text-slate-400 hover:text-[#3AA4AC]">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <button type="submit" className="lg:col-span-4 bg-[#3AA4AC] text-white p-4 rounded-2xl font-black text-lg hover:bg-[#2d8389] transition-all shadow-lg shadow-teal-100 active:scale-95">
                  Register Administrator
                </button>
              </form>
            </div>
          )}

          {/* Table Section */}
          <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-[#F8FAFC]/50">
               <h3 className="text-xl font-bold text-[#1E3A5F]">Active List</h3>
               <span className="bg-[#E6F4F5] text-[#3AA4AC] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                 {admins.length} Total
               </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-xs font-bold tracking-widest">
                    <th className="p-6">Administrator Name</th>
                    <th className="p-6">Email Contact</th>
                    <th className="p-6">Phone Number</th>
                    <th className="p-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {admins.map(admin => (
                    <tr key={admin._id} className="hover:bg-teal-50/30 transition-colors group">
                      <td className="p-6 font-bold text-[#1E3A5F]">{admin.name}</td>
                      <td className="p-6 text-slate-600 font-medium">{admin.email}</td>
                      <td className="p-6 text-slate-600 font-medium">{admin.phone}</td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => handleDelete(admin._id)}
                          className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:scale-105"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {admins.length === 0 && (
              <div className="text-center py-20">
                <div className="text-slate-300 mb-4 flex justify-center"><FiUser size={64} /></div>
                <p className="text-slate-500 font-medium">No active administrators found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManager;