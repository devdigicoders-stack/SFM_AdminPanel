import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import SfmLogo from '../components/SfmLogo';
import Toast from '../components/Toast';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FiLock, FiMail, FiArrowRight, FiShield } from 'react-icons/fi';

export default function AdminLogin() {
  // Empty fields on load as requested by user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please enter both your admin email and password.',
        duration: 3500
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);

      if (res.success) {
        setToast({
          type: 'success',
          title: 'Login Successful!',
          message: 'Welcome back, Administrator. Initializing Executive Session...',
          duration: 2500
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setToast({
          type: 'error',
          title: 'Authentication Failed!',
          message: res.message || 'Invalid official admin email or master password. Please verify.',
          duration: 4000
        });
      }
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not communicate with authentication server. Please try again.',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Animated Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-100/50 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-200/80 mb-4">
            <SfmLogo size="md" showTagline={false} lightMode={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1d3a] text-white text-[11px] font-black tracking-widest uppercase mb-1">
            <FiShield className="text-[#c1121f]" /> Executive Operations Portal
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Authorized Personnel & Management Login Only
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200 p-8 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 font-heading">
              Admin Portal Access
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your corporate credentials to manage enquiries & content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Admin Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email (e.g. admin@spartansfacility.com)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#c1121f] focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Master Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#c1121f] focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#0b1d3a] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all cursor-pointer mt-6 group"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Portal'}</span>
              <FiArrowRight className="text-[#c1121f] group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="http://localhost:5173"
            className="text-xs font-bold text-slate-500 hover:text-[#c1121f] transition-colors"
          >
            ← Back to Public Website
          </a>
        </div>

      </div>
    </div>
  );
}
