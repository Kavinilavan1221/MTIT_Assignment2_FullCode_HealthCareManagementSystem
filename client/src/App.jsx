import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  CreditCard, 
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  LayoutDashboard,
  Server,
  Terminal,
  Settings,
  TrendingUp,
  AlertCircle,
  LogOut,
  Shield,
  Box,
  Database,
  User as UserIcon,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Forgot from './pages/Forgot';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const GATEWAY_URL = 'http://localhost:8080';

const services = [
  { id: 'patient', name: 'Patient Service', icon: Users, port: 5001, member: 'Member 1', path: '/patient', color: '#0ea5e9' },
  { id: 'doctor', name: 'Doctor Service', icon: UserPlus, port: 5002, member: 'Member 2', path: '/doctor', color: '#6366f1' },
  { id: 'prescription', name: 'Prescription Service', icon: FileText, port: 5004, member: 'Member 4', path: '/prescription', color: '#f59e0b' },
  { id: 'billing', name: 'Billing Service', icon: CreditCard, port: 5005, member: 'Member 5', path: '/billing', color: '#ec4899' },
  { id: 'lab-report', name: 'Lab Report Service', icon: Activity, port: 5006, member: 'Member 6', path: '/lab-report', color: '#ef4444' },
];

const mockChartData = [
  { name: 'Mon', appointments: 400, prescriptions: 240, patients: 124 },
  { name: 'Tue', appointments: 300, prescriptions: 139, patients: 98 },
  { name: 'Wed', appointments: 200, prescriptions: 980, patients: 200 },
  { name: 'Thu', appointments: 278, prescriptions: 390, patients: 156 },
  { name: 'Fri', appointments: 189, prescriptions: 480, patients: 210 },
  { name: 'Sat', appointments: 239, prescriptions: 380, patients: 110 },
  { name: 'Sun', appointments: 349, prescriptions: 430, patients: 145 },
];

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

// Admin Protected Route Wrapper
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
  if (!token || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

function Dashboard() {
  const [activeNav, setActiveNav] = useState(() => localStorage.getItem('app_activeNav') || 'dashboard');
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('app_activeTab');
    return services.find(s => s.id === saved) ? saved : services[0].id;
  });
  const [serviceStatus, setServiceStatus] = useState({});
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), msg: 'System initialized. Node connectivity: OPTIMAL.', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), msg: 'Network link established with Primary Data Cluster.', type: 'success' },
    { id: 3, time: new Date().toLocaleTimeString(), msg: 'API Gateway listening on Port 8080.', type: 'info' }
  ]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [settings, setSettings] = useState({ realTimeAnalytics: true, emailNotifications: false });
  // Appointment booking state
  const [apptForm, setApptForm] = useState({ patientId: '', doctorId: '', date: '' });
  const [apptList, setApptList] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptSubmitting, setApptSubmitting] = useState(false);
  const [apptSuccess, setApptSuccess] = useState('');
  const navigate = useNavigate();
  const activeService = services.find(s => s.id === activeTab) || services[0];
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    checkAllHealth();
    const interval = setInterval(checkAllHealth, 10000);
    
    // Mock log generator
    const logInterval = setInterval(() => {
      // Use a functional update to get the latest settings if needed, 
      // but for simplicity in this mock, we'll check it here.
      setSettings(current => {
        if (current.realTimeAnalytics) {
          const randomService = services[Math.floor(Math.random() * services.length)];
          const events = ['Health check pulse received', 'Data synchronization complete', 'Cache validated', 'Active session heartbeat'];
          const newLog = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            msg: `[${randomService.name}] ${events[Math.floor(Math.random() * events.length)]}`,
            type: 'info'
          };
          setSystemLogs(prev => [newLog, ...prev].slice(0, 50));
        }
        return current;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(() => {
    if (activeNav === 'services') fetchServiceData();
    if (activeNav === 'appointments') fetchAppointments();
    setNewItem({});
    setEditingId(null);
  }, [activeTab, activeNav]);

  const fetchAppointments = async () => {
    setApptLoading(true);
    try {
      const res = await axios.get(`${GATEWAY_URL}/appointment`);
      setApptList(res.data.data || []);
    } catch { setApptList([]); } finally { setApptLoading(false); }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!apptForm.patientId || !apptForm.doctorId || !apptForm.date) return;
    setApptSubmitting(true);
    setApptSuccess('');
    try {
      await axios.post(`${GATEWAY_URL}/appointment`, apptForm);
      setApptForm({ patientId: '', doctorId: '', date: '' });
      setApptSuccess('Appointment booked! Status: Pending — awaiting admin approval.');
      fetchAppointments();
    } catch { alert('Error booking appointment. Please try again.'); }
    finally { setApptSubmitting(false); }
  };

  useEffect(() => {
    localStorage.setItem('app_activeNav', activeNav);
  }, [activeNav]);

  useEffect(() => {
    localStorage.setItem('app_activeTab', activeTab);
  }, [activeTab]);

  const checkAllHealth = async () => {
    const status = {};
    for (const s of services) {
      try {
        const res = await axios.get(`${GATEWAY_URL}${s.path}/health`);
        status[s.id] = res.data.status === 'UP';
      } catch (e) {
        status[s.id] = false;
      }
    }
    setServiceStatus(status);
  };

  const fetchServiceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${GATEWAY_URL}${activeService.path}`);
      setData(res.data.data || []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name && !newItem.patientId) return;
    try {
      if (editingId) {
        await axios.put(`${GATEWAY_URL}${activeService.path}/${editingId}`, newItem);
        setEditingId(null);
      } else {
        await axios.post(`${GATEWAY_URL}${activeService.path}`, newItem);
      }
      setNewItem({});
      fetchServiceData();
    } catch (e) {
      alert(`Error ${editingId ? 'updating' : 'adding'} item`);
    }
  };

  const handleEditItem = (item) => {
    setNewItem({ ...item });
    setEditingId(item._id || item.id);
  };

  const renderFormFields = () => {
    switch(activeTab) {
      case 'patient':
        return (
          <>
            <input type="text" placeholder="Patient Name" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <textarea placeholder="Patient Details..." value={newItem.detail || ''} onChange={e => setNewItem({...newItem, detail: e.target.value})} rows="4" className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700" />
          </>
        );
      case 'doctor':
         return (
          <>
            <input type="text" placeholder="Doctor Name" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} required className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="text" placeholder="Specialty" value={newItem.specialty || ''} onChange={e => setNewItem({...newItem, specialty: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <label className="flex items-center gap-3 text-slate-400 font-bold text-sm bg-slate-950 p-4 rounded-xl border border-white/10 cursor-pointer">
              <input type="checkbox" checked={newItem.available || false} onChange={e => setNewItem({...newItem, available: e.target.checked})} className="w-5 h-5 accent-sky-500 rounded border-white/20" />
              Available for Appointments
            </label>
          </>
        );
      case 'prescription':
        return (
          <>
            <input type="text" placeholder="Patient ID" value={newItem.patientId || ''} onChange={e => setNewItem({...newItem, patientId: e.target.value})} required className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="text" placeholder="Medication Name" value={newItem.medication || ''} onChange={e => setNewItem({...newItem, medication: e.target.value})} required className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="text" placeholder="Dosage (e.g., 500mg twice a day)" value={newItem.dosage || ''} onChange={e => setNewItem({...newItem, dosage: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="date" value={newItem.date || ''} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-400" />
          </>
        );
      case 'billing':
        return (
           <>
            <input type="text" placeholder="Patient ID" value={newItem.patientId || ''} onChange={e => setNewItem({...newItem, patientId: e.target.value})} required className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="number" placeholder="Amount ($)" value={newItem.amount || ''} onChange={e => setNewItem({...newItem, amount: e.target.value})} required className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="date" value={newItem.date || ''} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-400" />
          </>
        );
      case 'lab-report':
         return (
           <>
            <input type="text" placeholder="Patient ID" value={newItem.patientId || ''} onChange={e => setNewItem({...newItem, patientId: e.target.value})} required className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="text" placeholder="Test Name" value={newItem.testName || ''} onChange={e => setNewItem({...newItem, testName: e.target.value})} required className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <textarea placeholder="Test Results/Summary..." value={newItem.result || ''} onChange={e => setNewItem({...newItem, result: e.target.value})} rows="3" className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700 mb-4" />
            <input type="date" value={newItem.date || ''} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-400" />
          </>
        );
      default: return null;
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`${GATEWAY_URL}${activeService.path}/${id}`);
      fetchServiceData();
    } catch (e) {
      alert('Error deleting item');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Health Force
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-950/50 p-1 rounded-xl border border-white/5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'services', label: 'Microservices', icon: Server },
              { id: 'logs', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveNav(nav.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeNav === nav.id 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <nav.icon size={14} />
                {nav.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5">
              <UserIcon size={16} className="text-sky-400" />
              {user.fullName}
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

      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {activeNav === 'dashboard' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Dashboard Hero */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2 tracking-tight">System Node Control</h2>
                  <p className="text-slate-400 max-w-lg leading-relaxed">
                    Eco-system status is healthy. All microservice nodes are actively synchronizing with the secure, persistent data cluster.
                  </p>
                </div>
                <div className="mt-8 flex gap-4">
                  <button onClick={() => setActiveNav('services')} className="btn-primary rounded-xl px-6">Manage Services</button>
                  <button onClick={() => setActiveNav('logs')} className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-xl border border-white/10 transition-all">View Logs</button>
                </div>
              </div>
              <div className="glass-card p-8 bg-sky-500/5 relative overflow-hidden group">
                <TrendingUp className="absolute -right-4 -bottom-4 text-sky-500/10 group-hover:scale-110 transition-transform duration-500" size={160} />
                <h3 className="text-lg font-semibold mb-4 text-sky-400 uppercase tracking-wider">Storage Status</h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-4xl font-bold text-emerald-400 uppercase tracking-tighter">ONLINE</p>
                    <p className="text-sm text-slate-400 mt-1">Primary Data Cluster</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main stats graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Activity Overview</h3>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                      <defs>
                        <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}/>
                      <Area type="monotone" dataKey="appointments" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 glass-card p-6">
                  <h3 className="text-lg font-bold mb-4">Node Health</h3>
                  <div className="space-y-4">
                    {services.map(s => (
                      <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                            {s.name[0]}
                          </div>
                          <span className="text-sm font-medium">{s.name}</span>
                        </div>
                        {serviceStatus[s.id] ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">UP</span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">DOWN</span>
                        )}
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        ) : activeNav === 'appointments' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black flex items-center gap-3"><Calendar className="text-sky-400" size={30} /> Book an Appointment</h2>
              <p className="text-slate-400 mt-2">Submit a request — it will be reviewed and approved by the admin team.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-5 glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Plus size={18} className="text-sky-400" /> New Request</h3>
                {apptSuccess && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
                    <CheckCircle2 size={18} /> {apptSuccess}
                  </div>
                )}
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Your Name / Patient ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe or P123"
                      value={apptForm.patientId}
                      onChange={e => setApptForm({ ...apptForm, patientId: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Doctor Name / Doctor ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Smith or D456"
                      value={apptForm.doctorId}
                      onChange={e => setApptForm({ ...apptForm, doctorId: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={apptForm.date}
                      onChange={e => setApptForm({ ...apptForm, date: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all text-slate-400"
                    />
                  </div>

                  {/* Live status preview — visible as user fills the form */}
                  {(apptForm.patientId || apptForm.doctorId || apptForm.date) && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Request Preview</p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                            <Clock size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 text-sm">{apptForm.patientId || '—'}</p>
                            <p className="text-xs text-slate-500">Dr: <span className="text-slate-300">{apptForm.doctorId || '—'}</span> · {apptForm.date || 'No date'}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30 flex-shrink-0">
                          Pending
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={apptSubmitting}
                    className="w-full btn-primary py-4 mt-2 rounded-xl font-black tracking-widest uppercase text-xs shadow-xl shadow-sky-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {apptSubmitting ? 'Submitting...' : <><Calendar size={16} /> Book Appointment</>}
                  </button>
                </form>
              </div>

              {/* Appointment Status List */}
              <div className="lg:col-span-7 glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex justify-between items-center">
                  My Appointments
                  <button onClick={fetchAppointments} className="text-xs text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1 rounded-lg border border-sky-500/20 font-bold transition-all">↻ Refresh</button>
                </h3>
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                  {apptLoading ? (
                    <div className="p-12 text-center text-slate-600 animate-pulse font-bold tracking-widest">LOADING...</div>
                  ) : apptList.length === 0 ? (
                    <div className="p-12 text-center text-slate-600 border border-white/5 rounded-2xl border-dashed uppercase text-xs font-bold tracking-widest">No appointments found. Book your first one!</div>
                  ) : apptList.map(appt => (
                    <div key={appt._id || appt.id} className="p-5 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between gap-4 hover:border-sky-500/20 transition-all">
                      <div className={`h-12 w-12 flex-shrink-0 rounded-xl flex items-center justify-center ${
                        appt.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        appt.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {appt.status === 'Approved' ? <Check size={22}/> : appt.status === 'Rejected' ? <X size={22}/> : <Clock size={22}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-100 truncate">{appt.patientId}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Doctor: <span className="text-slate-300">{appt.doctorId}</span> &nbsp;·&nbsp; Date: <span className="text-slate-300">{appt.date}</span></p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${
                        appt.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' :
                        appt.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30' :
                        'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30'
                      }`}>{appt.status || 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeNav === 'logs' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black">System Performance Analytics</h2>
                <p className="text-slate-400">Deep telemetry data from all microservice clusters</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 px-3 py-1 bg-sky-500/10 text-sky-400 rounded-lg text-[10px] font-black uppercase tracking-tighter">Real-time Data</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Service Request Load</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                      <Bar dataKey="patients" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="prescriptions" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-8 bg-sky-500/[0.02]">
                <h3 className="text-xl font-bold mb-6">System Latency (ms)</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                      <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}/>
                      <Area type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-8 flex items-center justify-between border-dashed border-sky-500/20 bg-sky-500/5">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-sky-500/20 rounded-full text-sky-400">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Automated Scaling Engaged</h4>
                  <p className="text-sm text-slate-400">System is automatically balancing loads based on current traffic patterns.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-black mb-1">Status</p>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold ring-1 ring-emerald-500/30">Optimization Active</span>
              </div>
            </div>
          </div>
        ) : activeNav === 'settings' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black">Account & System Settings</h2>
                <p className="text-slate-400">Manage your profile and dashboard preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <UserIcon size={20} className="text-sky-400" />
                    Profile Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Display Name</label>
                      <div className="p-4 bg-slate-950 border border-white/5 rounded-xl text-slate-300 font-medium">
                        {user.fullName || 'Health Force User'}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Email Address</label>
                      <div className="p-4 bg-slate-950 border border-white/5 rounded-xl text-slate-300 font-medium">
                        {user.email || 'user@healthforce.com'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-emerald-400" />
                    System Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                      <div>
                        <p className="font-bold text-sm">Real-time Analytics</p>
                        <p className="text-xs text-slate-500">Enable live data streams in the analytics view.</p>
                      </div>
                      <div 
                        onClick={() => setSettings({...settings, realTimeAnalytics: !settings.realTimeAnalytics})}
                        className={`h-6 w-11 rounded-full relative cursor-pointer transition-all duration-300 ${settings.realTimeAnalytics ? 'bg-sky-500' : 'bg-slate-800'}`}
                      >
                        <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${settings.realTimeAnalytics ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                      <div>
                        <p className="font-bold text-sm">Email Notifications</p>
                        <p className="text-xs text-slate-500">Receive alerts when a node goes offline.</p>
                      </div>
                      <div 
                        onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                        className={`h-6 w-11 rounded-full relative cursor-pointer transition-all duration-300 ${settings.emailNotifications ? 'bg-sky-500' : 'bg-slate-800'}`}
                      >
                        <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${settings.emailNotifications ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="glass-card p-6 border-rose-500/20 bg-rose-500/5">
                  <h4 className="font-black text-xs text-rose-400 uppercase tracking-widest mb-4">Danger Zone</h4>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">Logging out will securely end your session. You will need to re-authenticate to access the Health Force portal.</p>
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout Session
                  </button>
                </div>
                
                <div className="glass-card p-6">
                  <h4 className="font-black text-xs text-slate-500 uppercase tracking-widest mb-4">System Info</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Version</span>
                      <span className="font-mono">4.2.0-stable</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Environment</span>
                      <span className="text-sky-400 font-bold">DEVELOPMENT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-black flex items-center justify-center gap-3">
                  <Server className="text-sky-400" size={30} /> 
                  Microservice Infrastructure
                </h2>
                <p className="text-slate-400 mt-2">Manage and monitor your distributed system components</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/5 pb-6">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 border font-bold text-[10px] uppercase tracking-widest ${
                    activeTab === s.id 
                    ? 'bg-sky-500 text-white border-sky-400 shadow-xl shadow-sky-500/20' 
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <s.icon size={14} />
                  {s.name}
                  <div className={`h-1.5 w-1.5 rounded-full ${serviceStatus[s.id] ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-8">
              <div className="glass-card p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: `${activeService.color}10`, color: activeService.color, borderColor: `${activeService.color}20` }}>
                      <activeService.icon size={36} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black">{activeService.name}</h2>
                      <p className="text-slate-400 text-sm">Lead: <span className="font-bold" style={{ color: activeService.color }}>{activeService.member}</span></p>
                    </div>
                  </div>
                  {/* Documentation links removed as per user request */}
                  <div></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="md:col-span-5 border-r border-white/5 pr-10">
                    <h3 className="text-lg font-bold mb-6">Create Payload</h3>
                    <form onSubmit={handleAddItem} className="space-y-6">
                      {renderFormFields()}
                      <button type="submit" className="w-full btn-primary py-4 mt-6 rounded-xl font-black tracking-widest uppercase text-xs shadow-xl shadow-sky-500/20">
                        {editingId ? 'Update Record' : 'Ingest Data'}
                      </button>
                      {editingId && (
                        <button 
                          type="button" 
                          onClick={() => { setEditingId(null); setNewItem({}); }}
                          className="w-full mt-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </form>
                  </div>

                  <div className="md:col-span-7">
                    <h3 className="text-lg font-bold mb-6 flex justify-between items-center">Live Database <span className="text-[10px] text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded uppercase tracking-widest font-black">Persistent</span></h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {loading ? (
                        <div className="p-8 text-center text-slate-600 animate-pulse font-bold tracking-widest">STREAMING RECORDS...</div>
                      ) : (
                        data.length === 0 ? (
                          <div className="p-8 text-center text-slate-600 border border-white/5 rounded-2xl border-dashed uppercase text-xs font-bold tracking-widest">No Ingested Records Found</div>
                        ) : data.map((item) => {
                          let title = item.name || item.fullName || '';
                          if (!title) {
                             if (item.testName) title = `Test: ${item.testName} (Pt: ${item.patientId})`;
                             else if (item.patientId) title = `Patient: ${item.patientId}`;
                             else title = 'Record';
                          }
                          
                          let detail = 'Record persistent info';
                          if (item.medication) {
                            detail = `Medication: ${item.medication}${item.dosage ? ` - Dosage: ${item.dosage}` : ''}`;
                          } else if (item.doctorId) {
                            detail = `Doctor ID: ${item.doctorId}`;
                          } else if (item.testName) {
                            detail = item.result ? `Result: ${item.result}` : 'No result summary recorded';
                          } else {
                            detail = item.detail || item.specialty || (item.amount ? `Amount: $${item.amount}` : null) || item.result || 'Record persistent info';
                          }
                          
                          const subLabel = item.date || (item.available !== undefined ? (item.available ? 'Ready' : 'Away') : '');
                          const status = item.status || (item.patientId ? 'Pending' : null);

                          return (
                            <div key={item._id || item.id} className="p-5 bg-slate-900 border border-white/5 rounded-2xl group hover:border-sky-500/30 transition-all flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-slate-100 group-hover:text-sky-400 transition-colors uppercase tracking-tight">{title}</h4>
                                  <div className="flex items-center gap-2">
                                    {status && (
                                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                                        (status === 'Paid' || status === 'Approved') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        (status === 'Overdue' || status === 'Rejected') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      }`}>
                                        {status}
                                      </span>
                                    )}
                                    {subLabel && <span className="text-[9px] font-black text-slate-600 bg-white/5 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">{subLabel}</span>}
                                  </div>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{detail}</p>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <button 
                                  onClick={() => handleEditItem(item)}
                                  className="p-2 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all border border-transparent hover:border-sky-500/20"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(item._id || item.id)}
                                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all border border-transparent hover:border-rose-500/20"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
