import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Plane, KeyRound, ArrowLeft, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import InnerVideoBackground from '../components/layout/InnerVideoBackground';

const Login = () => {
  const { user, login, sendOtp, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState('email'); // 'email' | 'code'
  const [countdown, setCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Failed to authenticate');
    }
  };

  const handleSendLoginOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    const result = await sendOtp(email.trim(), 'login');
    setLoading(false);

    if (result.success) {
      setOtpStep('code');
      setCountdown(45);
      setSuccessMsg(`A 6-digit sign-in code was sent to ${email.trim()}`);
      if (result.data?.fallbackOtp) {
        setDevOtp(result.data.fallbackOtp);
      }
    } else {
      setErrorMsg(result.error || 'Failed to send login code');
    }
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const result = await verifyLoginOtp(email.trim(), otp.trim());
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Invalid or expired sign-in code');
    }
  };

  const handleDemoFill = () => {
    setAuthMode('password');
    setEmail('demo@travelmate.com');
    setPassword('Demo123!');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <InnerVideoBackground />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center shadow-md">
              <Plane className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Travel<span className="text-neutral-400">Mate</span>
            </span>
          </Link>
          <p className="text-neutral-400 text-sm">Welcome back to your travel workspace</p>
        </div>

        {/* Auth form card */}
        <div className="rounded-2xl bg-[#0E1118]/85 backdrop-blur-2xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-4">Sign In</h2>

          {/* Toggle between Password and Gmail OTP login */}
          <div className="grid grid-cols-2 p-1 bg-white/[0.04] border border-white/10 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'password'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'otp'
                  ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Email OTP</span>
            </button>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-medium"
            >
              {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {devOtp && (
            <div className="mb-5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              <span className="font-bold">Dev Sign-In Code:</span> <code className="bg-black/40 px-2 py-0.5 rounded text-amber-400 font-mono font-bold tracking-widest text-sm">{devOtp}</code>
            </div>
          )}

          {authMode === 'password' ? (
            /* Traditional Password Sign In */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="alex@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  loading={loading}
                  fullWidth
                >
                  Sign In
                </Button>
              </div>
            </form>
          ) : (
            /* Gmail OTP Sign In */
            <AnimatePresence mode="wait">
              {otpStep === 'email' ? (
                <motion.form
                  key="login-otp-email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSendLoginOtp}
                  className="space-y-4"
                >
                  <Input
                    label="Email Address (Any provider)"
                    type="email"
                    placeholder="alex@example.com (any account)"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      loading={loading}
                      fullWidth
                    >
                      Send One-Time Sign-In Code
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="login-otp-code"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleVerifyLoginOtp}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                      6-Digit Sign-In Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-2xl tracking-[10px] font-mono font-bold py-3.5 bg-white/[0.04] border border-white/20 rounded-xl text-amber-400 placeholder-white/20 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        required
                      />
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    loading={loading}
                    fullWidth
                  >
                    Verify & Sign In
                  </Button>

                  <div className="flex items-center justify-between text-xs text-white/50 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('email');
                        setErrorMsg('');
                      }}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Change email</span>
                    </button>

                    <button
                      type="button"
                      disabled={countdown > 0 || loading}
                      onClick={() => handleSendLoginOtp(null)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        countdown > 0 ? 'text-white/30 cursor-not-allowed' : 'text-amber-400 hover:text-amber-300 font-semibold'
                      }`}
                    >
                      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                      <span>{countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          )}

          {/* Quick Demo credentials filler */}
          <div className="mt-5 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white/80">Demo Traveler Credentials</p>
              <p className="text-white/40">demo@travelmate.com / Demo123!</p>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-electric-cyan rounded-lg font-medium transition-colors"
            >
              Autofill
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/50">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-electric-cyan font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
