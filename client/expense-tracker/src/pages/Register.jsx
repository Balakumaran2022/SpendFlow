import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, Database, UserPlus, AlertCircle, ArrowLeft, DatabaseZap } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mongoUri, setMongoUri] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // MongoDB Atlas Connection URL Regex
  const MONGO_ATLAS_REGEX = /^mongodb(\+srv)?:\/\/[^\s:]+:[^\s@]+@[^\s\/]+(\/[^\s?]*)?(\?.*)?$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Ensure required basic fields
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Name, Email, Password, and Confirm Password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your passwords.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // IF CUSTOM MONGODB ATLAS URL IS PROVIDED, VALIDATE REGEX
    if (mongoUri.trim() && !MONGO_ATLAS_REGEX.test(mongoUri.trim())) {
      setError('Invalid MongoDB Atlas URL format! Must be a valid connection string (e.g. mongodb+srv://username:password@cluster.mongodb.net/dbname)');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, mongoUri.trim());
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your credentials or MongoDB Atlas URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-8">
      
      {/* Clean White Simple Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div 
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-md shadow-blue-500/30 mb-2 mx-auto"
          >
            <UserPlus className="w-7 h-7 stroke-[2.5]" style={{ color: '#ffffff' }} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">Register your personal expense workspace</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-700 font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Clean White Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Email Address <span className="text-red-500">*</span>
            </label>
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

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* CUSTOM MONGO ATLAS URL FIELD (NO HTML5 BROWSER TOOLTIP POPUP) */}
          <div className="space-y-1 pt-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DatabaseZap className="w-3.5 h-3.5 text-indigo-600" />
                MongoDB Atlas URL <span className="text-red-500">*</span>
              </span>
            </label>
            <div className="relative">
              <Database className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mongoUri}
                onChange={(e) => setMongoUri(e.target.value)}
                placeholder="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 pl-1 leading-snug">
              If provided, account and expenses are stored 100% separately inside your private MongoDB database.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 mt-3"
          >
            {loading ? (
              <span>Verifying Connection & Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 stroke-[3]" style={{ color: '#ffffff' }} />
                <span>REGISTER ACCOUNT</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login link */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
