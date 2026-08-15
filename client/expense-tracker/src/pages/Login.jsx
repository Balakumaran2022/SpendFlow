import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-8">
      
      {/* Clean White Simple Container */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* App Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl shadow-xs mb-2">
            <img src="/favicon.svg" alt="Logo" className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            BalaSpend
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">Sign in to manage your expense tracker</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-700 font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Simple Clean White Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[3]" style={{ color: '#ffffff' }} />
                <span>SIGN IN</span>
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 inline-flex items-center gap-1">
              Create New Account <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
