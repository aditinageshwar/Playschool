import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiUploadCloud, FiAlertCircle, FiCreditCard, FiCheckCircle, FiCalendar, FiArrowRight} from 'react-icons/fi';
import API from '../../api/axios';
import starsBg from "../../images/programs/bg.png";

const StudentDashboard = () => {
  const navigate = useNavigate();
  // const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myFees, setMyFees] = useState([]);

  useEffect(() => {
    const fetchMyFees = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const res = await API.get('/api/finance/my-fees', {params : {email:email}});
        setMyFees(res.data);
      } catch (err) {
        console.error("Error loading fees");
      } finally {
        setLoading(false);
      }
    };
    fetchMyFees();
  }, []);

  const totalPending = myFees
    .filter(f => f.status === 'Pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleInstantPay = async (feeId) => {
    if (!window.confirm("Are you sure you want to proceed with the payment?")) return;
    try {
      await API.post(`/api/finance/pay/${feeId}`);
      alert("Payment Successful!");
    
      setMyFees(prevFees => prevFees.map(fee => 
        fee._id === feeId ? { ...fee, status: 'Paid', paymentDate: new Date() } : fee
       )
      );
    } 
    catch (err) {
      alert("Payment failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       setLoading(true);
  //       const [statsRes, assignRes] = await Promise.all([
  //         API.get('/api/student/stats'),
  //       ]);

  //       setStudentData(statsRes.data);
  //     } catch (err) {
  //       setError("Failed to load dashboard data. Please try again later.");
  //       console.error("Dashboard Fetch Error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  // const stats = studentData ? [
  //   { title: "My Attendance", value: `${studentData.attendance}%`, fill: `${studentData.attendance}%`, color: "#10b981" },
  //   { title: "Pending Assignments", value: studentData.pendingCount, fill: "40%", color: "#f59e0b" },
  //   { title: "Upcoming Tests", value: studentData.testCount, fill: "20%", color: "#ef4444" },
  //   { title: "Unread Notices", value: studentData.noticeCount, fill: "60%", color: "#3b82f6" }
  // ] : [];

 if(loading) 
  return <div className="loading-spinner">Loading your portal...</div>;

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
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100 font-bold shadow-sm">
                <FiAlertCircle size={20}/> {error}
              </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <h1 className="text-3xl font-black text-[#1E3A5F]">
                  My Learning <span className="text-[#F07A4A]">Journey</span>
                </h1>
                <p className="text-[#07758D] mt-1 font-medium">Grow and learn with Smart Academy!</p>
              </div>
              <button 
                onClick={() => navigate('/student/assignments')} 
                className="flex items-center gap-2 bg-[#F07A4A] text-white px-6 py-3 rounded-[20px] font-black shadow-lg shadow-orange-100 hover:scale-105 transition-all"
              >
                <FiUploadCloud size={20}/> Submit Homework
              </button>
            </div>

            {/* Fees Highlight Card */}
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-400"></div>
                <div className="mb-6 md:mb-0">
                  <p className="text-[10px] text-[#F07A4A] uppercase font-black tracking-widest mb-1">Fee Summary</p>
                  <h3 className="text-3xl font-black text-[#1E3A5F]">₹{totalPending.toLocaleString('en-IN')}</h3>
                  <p className="text-slate-400 text-sm font-medium">Total Pending Dues</p>
                </div>
                <button className="bg-[#1E3A5F] text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-[#2d4d75] transition-all shadow-lg flex items-center gap-2">
                  <FiCreditCard /> Pay All Dues
                </button>
              </div>

              {/* Individual Fee List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2 px-2 italic">
                  <FiArrowRight className="text-[#3AA4AC]" /> Outstanding Payments
                </h3>
                
                {myFees.filter(fee => fee.status === 'Pending').length > 0 ? (
                  myFees.filter(fee => fee.status === 'Pending').map((fee) => (
                    <div key={fee._id} className="bg-white p-6 rounded-[32px] shadow-md flex justify-between items-center border border-slate-50 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FCEAE2] text-[#F07A4A] rounded-2xl flex items-center justify-center font-bold">
                          <FiCreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-black text-[#1E3A5F]">School Tuition Fee</p>
                          <p className="text-lg font-bold text-[#3AA4AC]">₹{fee.amount}</p>
                        </div>
                      </div>
                  
                      <div className="flex flex-col items-end gap-2">      
                        <div className="flex items-center gap-1 text-[10px] font-black text-red-400 bg-red-50 px-2 py-1 rounded-lg">
                          <FiCalendar /> DUE: {new Date(fee.dueDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}
                        </div>
                        <button 
                          onClick={() => handleInstantPay(fee._id)} 
                          className="bg-[#3AA4AC] text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-[#2d8389] transition-all shadow-sm active:scale-95"
                        >
                          PAY NOW
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#E6F4F5] p-12 rounded-[40px] border border-teal-100 text-center animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#3AA4AC] shadow-inner">
                      <FiCheckCircle size={40} />
                    </div>
                    <p className="text-[#07758D] font-black text-2xl italic">All Settled! 🎉</p>
                    <p className="text-[#3AA4AC] font-medium mt-1">You have no pending dues. Keep up the great work!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;