import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiSettings, FiBookOpen, FiCalendar, FiFileText, FiUser,
  FiUserPlus, FiDollarSign, FiCheckSquare, FiEdit3, FiMail, FiLock, FiStar, FiChevronRight 
} from 'react-icons/fi';
import magicBgSide from "../images/Admission/image.png";

const Sidebar = () => {
  const userRole = localStorage.getItem('role') || 'Guest';

  const sidebarMenus = {
    'super-admin': [
      { path: '/super-admin', name: 'System Overview', icon: <FiHome /> },
      { path: '/manage/finance-admin', name: 'Finance Admin', icon: <FiDollarSign /> },
      { path: '/manage/academic-admin', name: 'Academic Admin', icon: <FiBookOpen /> },
      { path: '/manage/student-admin', name: 'Student Admin', icon: <FiUsers /> },
      { path: '/manage/operations-admin', name: 'Operations Admin', icon: <FiSettings /> },
      { path: '/teachers', name: 'Manage Teachers', icon: <FiUserPlus /> },
      { path: '/students', name: 'Manage Students', icon: <FiUsers /> },
      { path: '/forgot-password', name: 'Update Password', icon: <FiLock/>},
      { path: '/update-username', name: 'Update Username', icon: <FiUser/>}
    ],
    'academic-admin': [
      { path: '/academic-admin', name: 'Dashboard', icon: <FiHome /> },
      { path: '/academic-admin/teachers', name: 'Teacher Management', icon: <FiUsers /> },
      { path: '/academic-admin/subjects', name: 'Subjects', icon: <FiBookOpen /> },
      { path: '/academic-admin/classes', name: 'Classes Management', icon: <FiCalendar /> },
      { path: '/forgot-password', name: 'Update Password', icon: <FiLock/>}
    ],
    'student-admin': [
      { path: '/student-admin', name: 'Dashboard', icon: <FiHome /> },
      { path: '/forgot-password', name: 'Update Password', icon: <FiLock/>}
    ],
    'finance-admin': [
      { path: '/finance-admin', name: 'Finance Home', icon: <FiHome /> },
      { path: '/forgot-password', name: 'Update Password', icon: <FiLock/>}
    ],
    'operations-admin': [
      { path: '/operations-admin', name: 'Operations Home', icon: <FiHome /> },
      { path: '/forgot-password', name: 'Update Password', icon: <FiLock/>}
    ],
    'teacher': [
      { path: '/teacher', name: 'My Dashboard', icon: <FiHome /> },
      { path: '/teacher/myclasses', name: 'My Classes', icon: <FiUsers /> },
      { path: '/teacher/attendanceMark', name: 'Attendance Entry', icon: <FiCheckSquare /> },
      { path: '/teacher/assignments', name: 'Assignments', icon: <FiEdit3 /> },
      { path: '/teacher/application', name: 'Review Applications', icon: <FiFileText /> },
      { path: '/forgot-password', name: 'Update Password', icon: <FiLock/>}
    ],
    'student': [
      { path: '/student', name: 'My Dashboard', icon: <FiHome /> },
      { path: '/student/profile', name: 'My Profile', icon: <FiUsers /> },
      { path: '/student/attendance', name: 'Attendance', icon: <FiCheckSquare /> },
      { path: '/student/application', name: 'Application', icon: <FiMail /> },
      { path: '/forgot-password', name: 'Update Password', icon: <FiLock/>}
    ]
  };
  const currentMenu = sidebarMenus[userRole] || [];

  const getMenuTitle = () => {
    const titles = {
      'admin': 'SUPER ADMIN',
      'academic-admin': 'ACADEMIC ADMIN',
      'teacher': 'TEACHER PORTAL',
      'student': 'STUDENT PORTAL',
      'guest': 'PlaySchool ERP'
    };
    return titles[userRole] || 'MAIN MENU';
  };

  return (
  <aside 
      className="w-72 border min-h-screen flex flex-col transition-all duration-300 relative z-50 shadow-xl overflow-hidden"
      style={{ 
        backgroundColor: '#FEF7E6', 
        backgroundImage: `linear-gradient(rgba(254, 247, 230, 0.01), rgba(254, 247, 230, 0)), url(${magicBgSide})`, 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 110%',
      }}
    > 
      <div className="absolute inset-0 bg-[#FEF7E6]/30 pointer-events-none z-0"></div>

      {/* Logo Section */}
      <div className="p-8 mb-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#3AA4AC] shadow-md rotate-3 border border-[#EBDCB2]/30">
            <FiStar size={24} className="fill-[#3AA4AC]" />
          </div>
          <h1 className="text-[#1E3A5F] font-black text-xl italic tracking-tighter leading-none uppercase">
            Smart<br/><span className="text-[#F07A4A]">Academy</span>
          </h1>
        </div>
      </div>
      
      {/* Menu Title Badge */}
      <div className="px-8 mb-6 relative z-20">
        <p className="text-[10px] font-black text-[#F07A4A] uppercase tracking-[0.25em] bg-[#FCEAE2] w-fit px-4 py-1.5 rounded-xl border border-orange-100/50 shadow-sm">
          {getMenuTitle()}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar relative z-20">
        {currentMenu.length > 0 ? (
          currentMenu.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center justify-between group px-5 py-3 rounded-[20px] transition-all duration-300 font-bold text-sm tracking-wide mb-1 ${
                  isActive 
                  ? "bg-[#3AA4AC] text-white shadow-lg shadow-teal-200/50 -translate-y-0.5" 
                  : "text-[#1E3A5F]/70 hover:text-[#3AA4AC] hover:bg-white/70 backdrop-blur-[2px]"
                }`
              }
            >
              <div className="flex items-center gap-4">
                <span className="text-xl transition-transform group-hover:scale-110">
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </div>
              <FiChevronRight className="text-xs transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
            </NavLink>
          ))
        ) : (
          <div className="px-8 py-10 text-slate-400 italic text-xs">No magic doors here...</div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 relative z-20">
        <div className="bg-white/60 backdrop-blur-md rounded-[24px] p-4 border border-white/80 flex items-center gap-3 shadow-sm">
          <div className="relative">
             <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
             <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-[10px] font-black text-[#1E3A5F]/60 uppercase tracking-widest italic">
            Magic Server Online
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;