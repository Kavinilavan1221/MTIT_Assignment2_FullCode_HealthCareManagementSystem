import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const GATEWAY_URL = 'http://localhost:8080';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${GATEWAY_URL}/auth/login`, { email, password });
      
      if (res.data.role !== 'admin') {
        setError('Access Denied. Administrator privileges required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify({ 
        fullName: res.data.fullName, 
        email: res.data.email,
        role: res.data.role 
      }));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-500/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-600/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      <div className="fixed top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-amber-500/10 blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 bg-rose-500/10 rounded-2xl items-center justify-center text-rose-500 border border-rose-500/20 mb-4 shadow-lg shadow-rose-500/20">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-2">Sign in to manage Health Force operations</p>
        </div>

        <div className="glass-card p-8 border-rose-500/20 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@healthforce.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2 px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-white"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Authenticating...' : 'Secure Login'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <Link to="/login" className="text-xs text-slate-500 hover:text-white transition-colors uppercase font-bold tracking-widest">
              &larr; Back to User Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
