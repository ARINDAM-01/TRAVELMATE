import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import InnerVideoBackground from '../components/layout/InnerVideoBackground';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const Register = () => {
  const { user, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMsg('Password must contain at least one uppercase letter (A-Z).');
      return;
    }

    if (!/[a-z]/.test(password)) {
      setErrorMsg('Password must contain at least one lowercase letter (a-z).');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one number (0-9).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setErrorMsg('');
    const result = await googleLogin(credential);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Google sign-in failed. Please try again.');
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
          <h2 className="text-2xl font-black text-white mb-2">Create Account</h2>
          <p className="text-xs text-neutral-400 mb-6">Start planning your dream itineraries today</p>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-medium"
            >
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="alex@example.com"
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
                Create Account
              </Button>
            </div>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-white/40">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={setErrorMsg}
          />

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
