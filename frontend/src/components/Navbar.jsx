import React from 'react';
import { FiBell, FiUser, FiLogOut, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('role') || 'Guest';
  const shortName = userName.split(' ')[0];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <header>
      <div className="bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl shadow-slate-200/40 px-8 py-4 flex justify-between items-center transition-all duration-500">
        
        {/* Left Side: Welcome Message */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex w-10 h-10 bg-[#E6F4F5] text-[#3AA4AC] rounded-2xl items-center justify-center shadow-inner">
            <FiStar size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-[#1E3A5F] text-sm md:text-base font-medium leading-tight">
              Welcome back, <span className="font-black text-[#3AA4AC]">{userName}</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 md:gap-6">
          <button className="relative p-3 text-slate-400 hover:text-[#F07A4A] hover:bg-[#FCEAE2] rounded-2xl transition-all duration-300 group">
            <FiBell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#F07A4A] border-2 border-white rounded-full group-hover:animate-bounce"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-black text-[#1E3A5F] uppercase tracking-tighter">{shortName}</p>
              <p className="text-[9px] text-[#3AA4AC] font-bold">Active Now</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-[#3AA4AC] to-[#1E3A5F] p-[2px] rounded-2xl shadow-lg shadow-teal-100 group cursor-pointer overflow-hidden">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#1E3A5F] group-hover:bg-transparent group-hover:text-white transition-all">
                <FiUser size={20} />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 ml-2 md:ml-0 p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
            title="Logout from Magic Portal"
          >
            <FiLogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Exit</span>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;