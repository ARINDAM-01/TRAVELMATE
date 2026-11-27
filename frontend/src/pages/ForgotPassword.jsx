import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import InnerVideoBackground from '../components/layout/InnerVideoBackground';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email: email.trim() });
      setMessage(data.message);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <InnerVideoBackground />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center">
              <Plane className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight">TravelMate</span>
          </Link>
        </div>
        <div className="rounded-2xl bg-[#0E1118]/85 backdrop-blur-2xl p-8 border border-white/10 shadow-2xl">
          <h1 className="text-2xl font-black mb-2">Forgot your password?</h1>
          <p className="text-sm text-white/50 mb-6">
            Enter your email and, if an account exists, we’ll send a password reset link.
            Google-only accounts can use this link to set a password.
          </p>
          {message && (
            <div role="status" className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-300">
              {message}
            </div>
          )}
          {error && (
            <div role="alert" className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              icon={Mail}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Button type="submit" variant="gradient" size="lg" loading={loading} fullWidth>
              Send Reset Link
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-white/50">
            Remembered your password?{' '}
            <Link to="/login" className="text-electric-cyan font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
