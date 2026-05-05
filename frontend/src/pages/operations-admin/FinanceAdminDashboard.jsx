import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FiDollarSign, FiX, FiFileText, FiEdit3, FiTrash2, FiSearch, FiTrendingUp, FiBell } from 'react-icons/fi';
import API from "../../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import starsBg from "../../images/programs/bg.png"; 

const FinanceAdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({studentId: '', amount: '', dueDate: '', status: 'Pending'});
  const [editingId, setEditingId] = useState(null);
  const [notificationLoading, setnotificationLoading] = useState(false);

  const [students, setStudents] = useState([]); 
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({ className: '', section: '' });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await API.get('/api/student/all-students');
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  // Update list whenever Class or Section filter changes
  useEffect(() => {
    let result = students;
    if (filters.className) result = result.filter(s => s.className === filters.className);
    if (filters.section) result = result.filter(s => s.section === filters.section);
    if (!filters.className && !filters.section) {
      setFilteredStudents([]); 
    } 
    else {
      setFilteredStudents(result);
    }
  }, [filters, students]);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await API.get('/api/finance/all');
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching fees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/api/finance/update/${editingId}`, formData);
        alert("Fee record updated successfully!");
      } else {
        await API.post('/api/finance/create-fee', formData);
        alert("Fee record created successfully!");
      }
      setEditingId(null);
      setShowModal(false);
      setFormData({ studentId: '', amount: '', dueDate: '', status: 'Pending' });
      fetchFees(); 
    } catch (err) {
      alert("Error creating fee: " + err.response?.data?.message || err.message);
    }
  };

  const handleDeleteFee = async (id) => {
  if (window.confirm("Are you sure you want to delete this fee record?")) {
    try {
      await API.delete(`/api/finance/delete/${id}`);
      fetchFees(); 
    } catch (err) {
      alert("Error deleting fee: " + (err.response?.data?.message || err.message));
    }
  }
};

  const handleEditClick = (tx) => {
  setEditingId(tx._id);
  setFormData({
    studentId: tx.studentId,
    amount: tx.amount,
    dueDate: tx.dueDate, 
    status: tx.status
  });
  setShowModal(true);
};

 const handleSendReminders = async () => {
    if (!window.confirm("Are you sure you want to send email reminders to all students with pending fees?")) 
      return;

    setnotificationLoading(true);
    try {
      const response = await API.post('/api/payment/send-due-reminders');
      alert(response.data.message); 
    } catch (err) {
      console.error(err);
      alert("Error: Could not send reminders at this time.");
    } finally {
      setnotificationLoading(false);
    }
};

  //--Generate Invoice-----
  const generateInvoice = (tx) => {
  const doc = new jsPDF();

  // 1. Branding & Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text("PlaySchool - FEE RECEIPT", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Play School, Bhopal", 105, 27, { align: "center" });
  doc.line(14, 32, 196, 32); // Horizontal line

  // 2. Invoice Metadata
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Receipt No: # ${tx._id.slice(-8).toUpperCase()}`, 14, 45);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 52);
  doc.text(`Status: ${tx.status.toUpperCase()}`, 150, 45);

  // 3. Student Details Box
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 60, 182, 30, 'F');
  doc.setFont(undefined, 'bold');
  doc.text("STUDENT DETAILS:", 20, 68);
  doc.setFont(undefined, 'normal');
  doc.text(`Name: ${tx.studentId?.user?.name || "N/A"}`, 20, 75);
  doc.text(`Email: ${tx.studentId?.user?.email || "N/A"}`, 20, 82);
  doc.text(`Phone: ${tx.studentId?.user?.phone || "N/A"}`, 20, 89);
  doc.text(`Roll Number: ${tx.studentId?.rollNumber || "N/A"}`, 140, 75);
  doc.text(`Payment Mode: Online`, 140, 82);

  // 4. Table of Charges
  autoTable(doc, {
    startY: 100,
    head: [['Description', 'Amount (INR)']],
    body: [
      ['Tuition / Semester Fees', `Rs. ${tx.amount}`],
      ['Service Charges', 'Rs. 0.00'],
    ],
    foot: [['TOTAL PAID', `Rs. ${tx.amount}`]],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] }, 
    styles: { font: "helvetica", fontSize: 10 },
  });

  // 5. Footer / Signature
  const finalY = doc.lastAutoTable.finalY + 30;
  doc.text("__________________________", 140, finalY);
  doc.text("Authorized Signatory", 145, finalY + 7);
  
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("This is a computer-generated receipt and does not require a physical stamp.", 105, 285, { align: "center" });

  // 6. Save PDF
  doc.save(`Receipt_${tx.studentId?.rollNumber}_${tx._id.slice(-4)}.pdf`);
};

  // --- Dynamic Stats Calculation ---
  const calculateStats = () => {
   const rawPaid = transactions
    .filter(tx => tx.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

    const displayPaid = rawPaid >= 100000 ? `₹${(rawPaid / 100000).toFixed(1)}L` : `₹${rawPaid.toLocaleString('en-IN')}`;

    const rawPending = transactions
      .filter(tx => tx.status === 'Pending')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const displayPending = rawPending >= 100000 ? `₹${(rawPending / 100000).toFixed(1)}L` : `₹${rawPending.toLocaleString('en-IN')}`;

    const totalExpected = rawPaid + rawPending;

    const recentPaymentsCount = transactions.filter(tx => {
      const thirtyDaysAgo = new Date(); 
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);                          //for last 30 days
      return tx.status === 'Paid' && new Date(tx.paymentDate) > thirtyDaysAgo;
    }).length;

    return [
      { 
        title: "Total Collection", 
        value: displayPaid, 
        fill: `${totalExpected > 0 ? Math.round((rawPaid / totalExpected) * 100) : 0}%`, 
        color: "var(--success)" 
      },
      { 
        title: "Pending Fees", 
        value: displayPending,
        fill: `${totalExpected > 0 ? Math.round((rawPending / totalExpected) * 100) : 0}%`,
        color: "var(--danger)" 
      },
      { 
        title: "Active Students", 
        value: [...new Set(transactions.map(t => t.studentId?._id))].length, 
        fill: "5%", 
        color: "var(--primary)" 
      },
      { 
        title: "Recent (30 day)", 
        value: recentPaymentsCount, 
        fill: "5%", 
        color: "var(--warning)" 
      }
    ];
  };

  const stats = calculateStats();

  return (
    <div className="flex min-h-screen bg-[#FEF7E6]">
      <Sidebar />
      <main className="flex-1 bg-cover bg-fixed" style={{ backgroundImage: `url(${starsBg})` }}>
        <div className="min-h-screen bg-white/40 backdrop-blur-[1px]">
        <Navbar />
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <span className="text-[#3AA4AC] font-bold tracking-[0.2em] uppercase text-xs">Accounts Center</span>
              <h1 className="text-3xl font-black text-[#1E3A5F] mt-1">Finance <span className="text-[#F07A4A]">Tracker</span></h1>
            </div>
            <button onClick={() => {
              setEditingId(null);
              setFormData({ studentId: '', amount: '', dueDate: '', status: 'Pending' });
              setShowModal(true);
              }} 
              className="flex items-center gap-2 px-6 py-3 bg-[#F07A4A] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:scale-105 transition-all">
              <FiDollarSign size={20}/> Create New Fee
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-50" key={i}>
                <p className="text-[#3AA4AC] font-bold text-xs uppercase tracking-widest mb-2">{stat.title}</p>
                <h2 className="text-2xl font-black text-[#1E3A5F]">{stat.value}</h2>
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-1000" style={{ width: stat.fill, backgroundColor: stat.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-50">
            <div className="flex items-center justify-between">
              <div className="p-8 border-b border-slate-50 bg-[#F8FAFC]/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2"><FiTrendingUp className="text-[#3AA4AC]"/> Recent Transactions</h3>
              </div>

              <button 
                onClick={handleSendReminders}
                disabled={notificationLoading }
                className={`flex items-center gap-2 px-2 mr-4 py-2 rounded-xl font-bold transition-all shadow-sm border-2 
                ${notificationLoading 
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500'
                }`}
              >
                {notificationLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                ) : (
                  <FiBell className="text-lg" />
                )}
                {notificationLoading ? 'Sending...' : 'Send Reminders'}
              </button>
             </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                       <th className="p-6">Receipt</th>
                       <th className="p-6">Student Details</th>
                       <th className="p-6">Amount</th>
                       <th className="p-6">Payment Date</th>
                       <th className="p-6">Status</th>
                       <th className="p-6 text-center">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {transactions.map((tx) => (
                       <tr key={tx._id} className="hover:bg-teal-50/30 transition-colors">
                         <td className="p-6 font-bold text-slate-400">#{tx._id.slice(-8)}</td>
                         <td className="p-6">
                           <p className="font-bold text-[#1E3A5F]">{tx.studentId?.user?.name}</p>
                           <p className="text-xs text-slate-400">Email: {tx.studentId?.user?.email}</p>
                           <p className="text-xs text-slate-400">Phone No: {tx.studentId?.user?.phone}</p>
                           <p className="text-xs text-slate-400">Roll: {tx.studentId?.rollNumber}</p>
                         </td>
                         <td className="p-6 font-black text-[#1E3A5F]">₹{tx.amount}</td>
                         <td className="p-6 font-black text-[#1E3A5F]">
                         {tx.status === 'Paid' ? (
                            new Date(tx.paymentDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          ) : (
                            <span className="text-slate-400 text-xs font-normal">Not Paid Yet</span>
                          )}
                         </td>
                         <td className="p-6">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${tx.status === 'Paid' ? 'bg-[#E6F4F5] text-[#3AA4AC]' : 'bg-[#FCEAE2] text-[#F07A4A]'}`}>
                             {tx.status}
                           </span>
                         </td>
                         <td className="p-6">
                           <div className="flex justify-center gap-2">
                            {tx.status === 'Paid' ? (
                              <button onClick={() => generateInvoice(tx)} 
                                className="flex item-center gap-2 p-2 bg-slate-50 text-[#3AA4AC] rounded-xl hover:bg-[#3AA4AC] hover:text-white transition-all">
                                  <FiFileText/>
                                  <span className='text-sm'>Receipt</span>
                              </button>
                            ) : ( 
                            <> 
                              <button onClick={() => handleEditClick(tx)} 
                                className="p-2 bg-slate-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                                  <FiEdit3/>
                              </button>
                              <button onClick={() => handleDeleteFee(tx._id)} 
                                className="p-2 bg-slate-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                  <FiTrash2/>
                              </button>
                            </>
                            )}
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>

        {/* Create Fee Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingId ? "Update" : "Create"}
                  <span className="text-[#F07A4A]"> Fee Record </span>
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateFee} className="space-y-5">
              {editingId ? (
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 mb-2">
                <p className="text-[10px] font-black text-[#3AA4AC] uppercase tracking-[0.2em] mb-1">Editing Fee For</p>
                <h4 className="font-bold text-[#1E3A5F]">
                  {transactions.find(t => t._id === editingId)?.studentId?.user?.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  Class: {transactions.find(t => t._id === editingId)?.studentId?.className}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Section: {transactions.find(t => t._id === editingId)?.studentId?.section}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Roll No: {transactions.find(t => t._id === editingId)?.studentId?.rollNumber}
                </p>
              </div>
              ) : (
              <>  
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Class</label>
                  <select 
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    onChange={(e) => setFilters({...filters, className: e.target.value})}
                  >
                    <option value="">All Classes</option>
                   {["Playgroup", "Nursery", "LKG", "UKG", "1st", "2nd"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Section</label>
                  <select 
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    onChange={(e) => setFilters({...filters, section: e.target.value})}
                  >
                    <option value="">All Sections</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Student Roll No.</label>
                <select 
                  required
                  disabled={filteredStudents.length === 0}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${filteredStudents.length === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  value={formData.studentId}
                >
                  <option value="">RollNo...</option>
                  {filteredStudents.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.rollNumber} 
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-blue-600 mt-1">
                  Showing {filteredStudents.length} students in this category.
                </p>
              </div>
              </>
              )}
  
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input 
                      type="number" required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AA4AC] outline-none"
                      value={formData.amount} 
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input 
                      type="date" required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AA4AC] outline-none"
                      value={formData.dueDate} 
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      min={today}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setShowModal(false); setEditingId(null); setFormData({ studentId: '', amount: '', dueDate: '', status: 'Pending' });}}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#3AA4AC] text-white rounded-lg hover:bg-[#2d8389] transition-all shadow-md shadow-teal-100"
                  >
                    {editingId ? "Update Record" : "Generate Fee"}
                  </button>
                </div> 
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default FinanceAdminDashboard;