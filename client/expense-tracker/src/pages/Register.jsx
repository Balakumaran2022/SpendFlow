import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, Database, UserPlus, AlertCircle, ArrowLeft, DatabaseZap, Eye, EyeOff, ShieldAlert, LogIn } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mongoUri, setMongoUri] = useState('');
  
  // Eye View Password States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Security Notice Modal State
  const [showNoticeModal, setShowNoticeModal] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Strict MongoDB Atlas Connection URL Regex
  const MONGO_ATLAS_REGEX = /^mongodb(\+srv)?:\/\/[^\s:]+:[^\s@]+@[^\s\/]+(\/[^\s?]*)?(\?.*)?$/;

  const triggerError = (msg) => {
    setError(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Ensure required basic fields
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      triggerError('All fields (Full Name, Email, Password, and Confirm Password) are required.');
      return;
    }

    if (password !== confirmPassword) {
      triggerError('Passwords do not match. Please re-enter your passwords.');
      return;
    }

    if (password.length < 6) {
      triggerError('Password must be at least 6 characters long.');
      return;
    }

    // MANDATORY MONGODB ATLAS URL VALIDATION
    if (!mongoUri.trim()) {
      triggerError('MongoDB Atlas URL is strictly required to create an account.');
      return;
    }

    if (!MONGO_ATLAS_REGEX.test(mongoUri.trim())) {
      triggerError('Invalid MongoDB Atlas URL format! Must be a complete connection string (e.g. mongodb+srv://username:password@cluster.mongodb.net/dbname).');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, mongoUri.trim());
      navigate('/');
    } catch (err) {
      triggerError(err.message || 'Registration failed. Please check your credentials or MongoDB Atlas URL.');
    } finally {
      setLoading(false);
    }
  };

  const isUserExistsError = error.toLowerCase().includes('already exists');

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-6 overflow-y-auto">
      
      {/* 1. SECURITY NOTICE MODAL DIALOG */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 max-w-[92vw] sm:max-w-md w-full rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 text-slate-900 my-auto overflow-hidden">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  Important Security Notice
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">Please read carefully before proceeding</p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 text-xs text-amber-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-amber-800 text-xs sm:text-sm">
                ⚠️ No Password Reset Option
              </p>
              <p className="leading-relaxed text-slate-700 text-[11px] sm:text-xs">
                There is <strong>NO forgotten password or password recovery option</strong> in this application.
              </p>
              <p className="leading-relaxed text-slate-700 text-[11px] sm:text-xs">
                Please make sure to <strong>write down and note down your password safely</strong> before creating an account.
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 py-2.5 sm:py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border-0 cursor-pointer active:scale-95 text-center"
              >
                Cancel & Go Back
              </button>
              
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                className="flex-1 py-2.5 sm:py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:bg-blue-700 transition-all border-0 cursor-pointer active:scale-95 text-center"
              >
                OK, I Understand
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Responsive Registration Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl space-y-4 sm:space-y-5 my-auto overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div 
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md shadow-blue-500/30 mb-1 mx-auto"
          >
            <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" style={{ color: '#ffffff' }} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">Register your personal expense workspace</p>
        </div>

        {/* Top Prominent Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 sm:p-4 text-xs text-red-700 font-semibold space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-bold text-red-800 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Registration Couldn't Complete</span>
            </div>
            
            <p className="text-[11px] sm:text-xs leading-relaxed text-red-700 font-medium break-words">{error}</p>

            {/* Smart Resolution Button if user exists */}
            {isUserExistsError && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 mt-1"
              >
                <LogIn className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                <span>Go to Sign In Page Instead</span>
              </button>
            )}
          </div>
        )}

        {/* Responsive Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4 shrink-0" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 shrink-0" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Password with Eye View Toggle */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 shrink-0" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
                className="absolute right-3.5 inset-y-0 flex items-center text-slate-400 hover:text-slate-600 p-1 border-0 bg-transparent cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-slate-600 shrink-0" /> : <Eye className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Confirm Password with Eye View Toggle */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 shrink-0" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide Password" : "Show Password"}
                className="absolute right-3.5 inset-y-0 flex items-center text-slate-400 hover:text-slate-600 p-1 border-0 bg-transparent cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 text-slate-600 shrink-0" /> : <Eye className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* STRICTLY REQUIRED MONGODB ATLAS URL FIELD */}
          <div className="space-y-1 pt-0.5">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block">
              <span className="flex items-center gap-1.5">
                <DatabaseZap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                MongoDB Atlas URL <span className="text-red-500">*</span>
              </span>
            </label>
            
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
                <Database className="w-4 h-4 shrink-0" />
              </div>
              <input
                type="text"
                required
                value={mongoUri}
                onChange={(e) => setMongoUri(e.target.value)}
                placeholder="mongodb+srv://username:password@cluster.mongodb.net/dbname"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs text-slate-900 placeholder-slate-400 outline-none transition-all font-mono"
              />
            </div>
            
            <p className="text-[10px] sm:text-[11px] text-slate-500 pl-0.5 leading-snug break-words">
              Required: Enter your valid MongoDB Atlas URL (<code className="text-indigo-600 font-mono text-[10px] break-all">mongodb+srv://username:password@cluster.mongodb.net/dbname</code>). Account and expenses are stored 100% inside your database.
            </p>
          </div>

          {/* Bottom Error Notification */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700 font-semibold space-y-1 mt-2">
              <div className="flex items-center gap-1.5 font-bold text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Fix Required:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-600 break-words">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="w-full py-3 sm:py-3.5 px-4 h-11 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
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
        <div className="pt-2.5 border-t border-slate-100 text-center">
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
