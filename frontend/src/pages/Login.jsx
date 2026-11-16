import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Plane, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Failed to authenticate');
    }
  };

  const handleDemoFill = () => {
    setEmail('demo@travelmate.com');
    setPassword('Demo123!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0D13] via-[#0E1118] to-[#0B0D13] text-white flex items-center justify-center p-4 relative overflow-hidden">
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

        {/* Auth form card (Clean, solid dark panel - No glass blur) */}
        <div className="rounded-2xl bg-[#13161F] p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-6">Sign In</h2>

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
