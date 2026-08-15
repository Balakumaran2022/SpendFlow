import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, UserPlus, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      
      {/* Background blur effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* App Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl shadow-lg shadow-purple-500/30 mb-2">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">Register to start tracking your expenses</p>
        </div>

        {/* MUST NOTE PASSWORD WARNING AS INSTRUCTED BY USER */}
        <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-3.5 text-xs text-amber-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            IMPORTANT SECURITY NOTICE:
          </p>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            There is <strong>no password reset / forgot password option</strong>. Please write down and note down your password safely when creating an account.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 rounded-2xl p-3.5 text-xs text-red-300 font-semibold flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 mt-3"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 stroke-[3]" />
                <span>REGISTER ACCOUNT</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login link */}
        <div className="pt-2 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
