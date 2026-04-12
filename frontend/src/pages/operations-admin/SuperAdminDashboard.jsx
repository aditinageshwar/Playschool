import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Users, UserPlus, GraduationCap, Wallet, CalendarDays, Settings, ShieldCheck, ArrowRightCircle } from 'lucide-react';

import starsBg from "../../images/programs/bg.png"; 

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    { title: "Manage Teachers", desc: "Directory & Assignments", path: "/teachers", icon: <Users />, color: "text-[#3AA4AC]", bg: "bg-[#E6F4F5]" },
    { title: "Manage Students", desc: "Enrollment & Records", path: "/students", icon: <GraduationCap />, color: "text-[#F07A4A]", bg: "bg-[#FCEAE2]" },
    { title: "Finance Admin", desc: "Accounts & Billing Control", path: "/manage/finance-admin", icon: <ShieldCheck />, color: "text-[#3AA4AC]", bg: "bg-[#E6F4F5]" },
    { title: "Academic Admin", desc: "Curriculum & Class Planning", path: "/manage/academic-admin", icon: <ShieldCheck />, color: "text-[#F07A4A]", bg: "bg-[#FCEAE2]" },
    { title: "Student Admin", desc: "Admission Workflows", path: "/manage/student-admin", icon: <UserPlus />, color: "text-[#3AA4AC]", bg: "bg-[#E6F4F5]" },
    { title: "Operations Admin", desc: "Event Management", path: "/manage/operations-admin", icon: <Settings />, color: "text-[#F07A4A]", bg: "bg-[#FCEAE2]" },
    { title: "Manage Fees", desc: "Fee Structure & Collections", path: "/finance-admin", icon: <Wallet />, color: "text-[#3AA4AC]", bg: "bg-[#E6F4F5]" },
    { title: "Manage Events", desc: "Holidays & School Functions", path: "/operations-admin", icon: <CalendarDays />, color: "text-[#F07A4A]", bg: "bg-[#FCEAE2]" }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main 
        className="flex-1 bg-cover bg-fixed bg-center relative"
        style={{ backgroundImage: `url(${starsBg})` }}
      >
        {/* Subtle Overlay to ensure content is readable */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-0" />

        <div className="relative z-10">
          <Navbar />

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h1 className="text-3xl md:text-3xl font-black text-[#1E3A5F]">
                Super Admin <span className="text-[#F07A4A]">Panel</span>
              </h1>
              <p className="text-[#07758D] mt-2 font-semibold">
                Nurturing the future, one module at a time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {modules.map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(item.path, { state: { from: "super-admin" } })}
                  className="group relative bg-white/70 backdrop-blur-md p-8 rounded-[40px] border border-white/50 shadow-xl shadow-purple-200/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Dotted border on hover - customized for this bg */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 border-4 border-dotted border-white/40 group-hover:border-[#F07A4A]/40 rounded-full transition-all" />

                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                    {React.cloneElement(item.icon, { size: 28 })}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#1E3A5F]">
                      {item.title}
                    </h3>
                    <ArrowRightCircle size={20} className="text-[#F07A4A] opacity-0 group-hover:opacity-100 transition-all" />
                  </div>

                  <p className="text-sm text-[#07758D] font-medium leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Progress Line */}
                  <div className="mt-6 h-1 w-full bg-white/50 rounded-full overflow-hidden">
                    <div className={`h-full w-0 group-hover:w-full transition-all duration-1000 ${item.bg === 'bg-[#E6F4F5]' ? 'bg-[#3AA4AC]' : 'bg-[#F07A4A]'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;