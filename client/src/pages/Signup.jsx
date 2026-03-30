import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const GATEWAY_URL = 'http://localhost:8080';

export default function Signup() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${GATEWAY_URL}/auth/signup`, formData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-sky-500/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      <div className="fixed top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/10 blur-[100px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 bg-sky-500/10 rounded-2xl items-center justify-center text-sky-400 border border-sky-500/20 mb-4">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Join Health Force</h1>
          <p className="text-slate-400 mt-2">Start managing your microservices today</p>
        </div>

        <div className="glass-card p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex h-16 w-16 bg-emerald-500/10 rounded-full items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-xl font-bold text-white">Registration Successful!</h2>
              <p className="text-slate-400 mt-2">Redirecting you to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="John Doe"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="name@company.com"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={20} />
                </button>
              </form>
            </>
          )}

          <p className="text-center mt-8 text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-sky-500 font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
