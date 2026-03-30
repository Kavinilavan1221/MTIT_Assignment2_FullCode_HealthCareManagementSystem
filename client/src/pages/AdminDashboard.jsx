import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Clock, 
  LogOut,
  User as UserIcon,
  Calendar,
  CreditCard
} from 'lucide-react';

const GATEWAY_URL = 'http://localhost:8080';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('admin_activeTab') || 'appointments');
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [adminBills, setAdminBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

  useEffect(() => {
    fetchAdminAppointments();
    fetchAdminBills();
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_activeTab', activeTab);
  }, [activeTab]);

  const fetchAdminAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${GATEWAY_URL}/appointment`);
      setAdminAppointments(res.data.data || []);
    } catch (e) {
      setAdminAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminBills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${GATEWAY_URL}/billing`);
      setAdminBills(res.data.data || []);
    } catch (e) {
      setAdminBills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`${GATEWAY_URL}/appointment/${id}`, { status });
      fetchAdminAppointments();
    } catch (e) {
      alert('Error updating appointment status');
    }
  };

  const handleUpdateBillStatus = async (id, status) => {
    try {
      await axios.put(`${GATEWAY_URL}/billing/${id}`, { status });
      fetchAdminBills();
    } catch (e) {
      alert('Error updating bill status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-500/10 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-600/10 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      <div className="fixed top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-amber-500/5 blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <div className="relative z-10">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-rose-500/20 px-6 py-3 shadow-lg shadow-rose-500/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-rose-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-rose-500/10">
              <UserIcon size={16} className="text-rose-400" />
              {adminUser.fullName || 'Admin User'}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <ShieldAlert className="text-rose-500" size={32} />
              System Approvals
            </h2>
            <p className="text-slate-400 mt-2">Review and manage pending patient applications and billing payments</p>
          </div>

          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === 'appointments' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={18} />
              Appointments
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === 'billing' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard size={18} />
              Billing
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="p-20 text-center text-slate-600 animate-pulse font-bold tracking-widest">LOADING REQUESTS...</div>
            ) : activeTab === 'appointments' ? (
              adminAppointments.length === 0 ? (
                <div className="p-20 text-center text-slate-600 border border-white/5 rounded-3xl border-dashed tracking-widest font-bold text-xs uppercase">No appointment requests found</div>
              ) : adminAppointments.map((appt) => (
                <div key={appt._id || appt.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-rose-500/20 transition-all border border-white/5">
                  <div className="flex items-center gap-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                      appt.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      appt.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {appt.status === 'Approved' ? <Check size={28} /> : 
                       appt.status === 'Rejected' ? <X size={28} /> : 
                       <Clock size={28} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-100">Patient: <span className="text-rose-400">{appt.patientId}</span></h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-slate-500 font-medium">Doctor: <span className="text-slate-300">{appt.doctorId}</span></span>
                        <span className="text-xs text-slate-500 font-medium">Date: <span className="text-slate-300">{appt.date}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="mb-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         appt.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30' :
                         appt.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/30' :
                         'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30'
                       }`}>
                         {appt.status || 'Pending'}
                       </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateAppointmentStatus(appt._id || appt.id, 'Approved')}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                         onClick={() => handleUpdateAppointmentStatus(appt._id || appt.id, 'Rejected')}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold border border-rose-500/20 transition-all"
                      >
                        Reject
                      </button>
                      <button 
                         onClick={() => handleUpdateAppointmentStatus(appt._id || appt.id, 'Pending')}
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/20 transition-all"
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
               adminBills.length === 0 ? (
                <div className="p-20 text-center text-slate-600 border border-white/5 rounded-3xl border-dashed tracking-widest font-bold text-xs uppercase">No billing records found</div>
              ) : adminBills.map((bill) => (
                <div key={bill._id || bill.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-rose-500/20 transition-all border border-white/5">
                  <div className="flex items-center gap-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                      bill.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                      bill.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {bill.status === 'Paid' ? <Check size={28} /> : 
                       bill.status === 'Overdue' ? <X size={28} /> : 
                       <Clock size={28} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-100">Patient: <span className="text-emerald-400">{bill.patientId}</span></h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-slate-500 font-medium">Amount: <span className="text-slate-300 font-mono">${bill.amount}</span></span>
                        <span className="text-xs text-slate-500 font-medium">Date: <span className="text-slate-300">{bill.date}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="mb-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         bill.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30' :
                         bill.status === 'Overdue' ? 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/30' :
                         'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30'
                       }`}>
                         {bill.status || 'Pending'}
                       </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateBillStatus(bill._id || bill.id, 'Paid')}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20 transition-all"
                      >
                        Set Paid
                      </button>
                      <button 
                         onClick={() => handleUpdateBillStatus(bill._id || bill.id, 'Overdue')}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold border border-rose-500/20 transition-all"
                      >
                        Set Overdue
                      </button>
                      <button 
                         onClick={() => handleUpdateBillStatus(bill._id || bill.id, 'Pending')}
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/20 transition-all"
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
