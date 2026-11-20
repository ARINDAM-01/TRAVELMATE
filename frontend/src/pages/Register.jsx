import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Plane, KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import InnerVideoBackground from '../components/layout/InnerVideoBackground';

const Register = () => {
  const { user, sendOtp, verifyRegisterOtp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'otp'
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

  const validateDetails = () => {
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.');
      return false;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMsg('Password must contain at least one uppercase letter (A-Z).');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setErrorMsg('Password must contain at least one lowercase letter (a-z).');
      return false;
    }

    if (!/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one number (0-9).');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateDetails()) return;

    setLoading(true);
    const result = await sendOtp(email.trim(), 'register');
    setLoading(false);

    if (result.success) {
      setStep('otp');
      setCountdown(45);
      setSuccessMsg(`A 6-digit verification code was sent to ${email.trim()}`);
      if (result.data?.fallbackOtp) {
        setDevOtp(result.data.fallbackOtp);
      }
    } else {
      setErrorMsg(result.error || 'Failed to send verification code');
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const result = await verifyRegisterOtp(name.trim(), email.trim(), password, otp.trim());
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Invalid or expired verification code');
    }
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
          <p className="text-neutral-400 text-sm">Join the expedition planning platform</p>
        </div>

        {/* Register card */}
        <div className="rounded-2xl bg-[#0E1118]/85 backdrop-blur-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-white">Create Account</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20">
              {step === 'form' ? 'Step 1 of 2' : 'Step 2 of 2'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mb-6">
            {step === 'form'
              ? 'Enter your details to receive an email verification code (any email provider supported)'
              : `Enter the 6-digit code sent to ${email}`}
          </p>

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
              <span className="font-bold">Dev Verification Code:</span> <code className="bg-black/40 px-2 py-0.5 rounded text-amber-400 font-mono font-bold tracking-widest text-sm">{devOtp}</code>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.form
                key="step-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Alex Rivera"
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alex@example.com (any provider)"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password (min 8 chars, 1 uppercase, 1 number)"
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

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Send Email Verification Code
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="step-otp"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                onSubmit={handleVerifyAndRegister}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    6-Digit Verification Code
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
                  Verify & Create Account
                </Button>

                <div className="flex items-center justify-between text-xs text-white/50 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('form');
                      setErrorMsg('');
                    }}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Change details</span>
                  </button>

                  <button
                    type="button"
                    disabled={countdown > 0 || loading}
                    onClick={() => handleSendOtp(null)}
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

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-electric-cyan font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
