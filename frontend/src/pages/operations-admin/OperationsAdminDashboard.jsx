import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Events from "./Events";
import starsBg from "../../images/programs/bg.png"; 

const OperationsAdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main 
        className="flex-1 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${starsBg})` }}
      >
        <Navbar />

        <div className="p-6 md:p-10">
         <div className="mb-10">
          <h1 className="text-3xl font-black text-[#1E3A5F] mt-2">
            Magic <span className="text-[#F07A4A]">Events</span>
          </h1>
          <p className="text-[#07758D] mt-2 font-medium">Create and manage upcoming fun activities for our little ones.</p>
        </div>

        <Events />
          
        </div>
      </main>
    </div>
  );
};

export default OperationsAdminDashboard;