import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Wallet, Bell, Shield, Save, Check } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { CURRENCY_LIST, TRAVEL_STYLES } from '../utils/constants';

const Settings = () => {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    preferredCurrency: user?.preferredCurrency || 'INR',
    travelPreferences: user?.travelPreferences || ['cultural', 'food'],
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      updateUser(data.data.user);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      alert(extractError(err));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(extractError(err));
    } finally {
      setPasswordSaving(false);
    }
  };

  const toggleStylePreference = (styleVal) => {
    setProfileForm((prev) => {
      const current = prev.travelPreferences || [];
      if (current.includes(styleVal)) {
        return { ...prev, travelPreferences: current.filter((s) => s !== styleVal) };
      } else {
        return { ...prev, travelPreferences: [...current, styleVal] };
      }
    });
  };

  return (
    <DashboardLayout activeTitle="User Settings">
      <div className="max-w-4xl space-y-8">
        {/* Profile Details Form */}
        <div className="glass-card p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User size={18} className="text-electric-cyan" />
              Profile & Account Info
            </h3>
            {profileSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Saved Successfully
              </span>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase text-white/70">
                  Email (read-only)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">
                Default Currency Preference
              </label>
              <select
                value={profileForm.preferredCurrency}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, preferredCurrency: e.target.value })
                }
                className="w-full sm:w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
              >
                {CURRENCY_LIST.map((c) => (
                  <option key={c.code} value={c.code} className="bg-navy-secondary text-white">
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Style Badges */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs font-semibold uppercase text-white/70">
                Favorite Travel Styles
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_STYLES.map((style) => {
                  const isSelected = profileForm.travelPreferences?.includes(style.value);
                  return (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => toggleStylePreference(style.value)}
                      className={`
                        px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5
                        ${
                          isSelected
                            ? 'bg-electric-blue text-white shadow-md shadow-blue-500/25 border border-electric-blue'
                            : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                        }
                      `}
                    >
                      <span>{style.icon}</span>
                      <span>{style.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button type="submit" variant="gradient" size="md" loading={profileSaving} icon={Save}>
                Save Profile
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="glass-card p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-violet" />
              Security & Password
            </h3>
            {passwordSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Password Updated
              </span>
            )}
          </div>

          {passwordError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              required
            />

            <Input
              label="New Password (min 8 characters)"
              type="password"
              placeholder="••••••••"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={passwordSaving}
                icon={Shield}
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
