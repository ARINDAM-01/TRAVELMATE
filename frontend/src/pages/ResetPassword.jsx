import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import InnerVideoBackground from '../components/layout/InnerVideoBackground';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!token) {
      setError('This reset link is invalid or has expired. Request a new one to continue.');
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Use at least 8 characters, including uppercase and lowercase letters and a number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
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
          <h1 className="text-2xl font-black mb-2">Set a new password</h1>
          <p className="text-sm text-white/50 mb-6">Use at least 8 characters, with uppercase and lowercase letters and a number.</p>
          {message ? (
            <div role="status" className="space-y-5">
              <p className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-300">
                {message}
              </p>
              <Link to="/login" className="block text-center text-electric-cyan font-bold hover:underline">
                Continue to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div role="alert" className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="New password"
                  icon={Lock}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                />
                <Button type="submit" variant="gradient" size="lg" loading={loading} fullWidth>
                  Reset Password
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-white/50">
                Need another link?{' '}
                <Link to="/forgot-password" className="text-electric-cyan font-bold hover:underline">
                  Request a reset
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
