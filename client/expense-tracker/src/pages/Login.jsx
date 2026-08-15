import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = () => {
    setEmail('balaavcce@gmail.com');
    setPassword('12345678');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* App Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-2">
            <img src="/favicon.svg" alt="Logo" className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            BalaSpend
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">Sign in to manage your expense tracker</p>
        </div>

        {/* DEFAULT ADMIN CREDENTIALS NOTICE */}
        <div className="bg-blue-950/60 border border-blue-500/30 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Default Admin Account
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              1-Click Fill
            </button>
          </div>
          <div className="font-mono text-slate-300 space-y-0.5 pt-1">
            <p>Email: <strong className="text-white">balaavcce@gmail.com</strong></p>
            <p>Password: <strong className="text-white">12345678</strong></p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 rounded-2xl p-3.5 text-xs text-red-300 font-semibold flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="balaavcce@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* NO FORGOT PASSWORD OPTION AS INSTRUCTED BY USER */}

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[3]" />
                <span>SIGN IN</span>
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="pt-2 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4 inline-flex items-center gap-1">
              Create New Account <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
