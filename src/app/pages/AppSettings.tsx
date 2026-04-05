import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, BellOff, Check, Edit3, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';

const avatarGradients = [
  'from-cyan-400 to-cyan-600',
  'from-fuchsia-500 to-orange-500',
  'from-emerald-500 to-sky-600',
  'from-amber-500 to-red-500',
];

export default function AppSettings() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useApp();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [notifications, setNotifications] = useState({
    newReleases: true,
    recommendations: true,
    watchlist: false,
  });

  const handleSaveName = () => {
    const nextName = tempName.trim() || profile.name;
    updateProfile({ name: nextName });
    setTempName(nextName);
    setIsEditingName(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#02060c] text-white">
      <div className="sticky top-0 z-50 border-b border-white/8 bg-[#02060c]/94 backdrop-blur-xl">
        <div className="grid grid-cols-[40px_1fr_40px] items-center px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate('/profile')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-center text-xl font-semibold">App Settings</h1>
          <div />
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Profile</h2>

            <div className="mb-6">
              <label className="mb-3 block text-sm text-gray-400">Choose Avatar</label>
              <div className="flex flex-wrap gap-3">
                {avatarGradients.map((gradient, index) => (
                  <button
                    key={gradient}
                    onClick={() => updateProfile({ avatarIndex: index })}
                    className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${gradient} transition-all ${
                      profile.avatarIndex === index ? 'scale-110 ring-4 ring-white' : 'opacity-65 hover:opacity-100'
                    }`}
                  >
                    <User className="h-8 w-8 text-white" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#111827] p-4">
              <label className="mb-2 block text-sm text-gray-400">Display Name</label>
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(event) => setTempName(event.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    autoFocus
                  />
                  <Button onClick={handleSaveName} className="bg-cyan-400 text-black hover:bg-cyan-300" size="sm">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold">{profile.name}</span>
                  <button
                    onClick={() => {
                      setTempName(profile.name);
                      setIsEditingName(true);
                    }}
                    className="rounded-lg p-2 transition-colors hover:bg-white/8"
                  >
                    <Edit3 className="h-4 w-4 text-cyan-300" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
            <div className="space-y-2">
              <NotificationToggle
                label="New Releases"
                description="Get notified about new movies and shows"
                enabled={notifications.newReleases}
                onToggle={() => toggleNotification('newReleases')}
              />
              <NotificationToggle
                label="Recommendations"
                description="Personalized content suggestions"
                enabled={notifications.recommendations}
                onToggle={() => toggleNotification('recommendations')}
              />
              <NotificationToggle
                label="Watchlist Updates"
                description="Updates on your saved content"
                enabled={notifications.watchlist}
                onToggle={() => toggleNotification('watchlist')}
              />
            </div>
          </div>

          <div className="border-t border-white/8 pt-6">
            <div className="space-y-1 text-center text-sm text-gray-500">
              <p>StreamX v1.0.0</p>
              <p>© 2026 StreamX. All rights reserved.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ label, description, enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-start gap-4 rounded-2xl bg-[#111827] p-4 transition-all hover:bg-[#162033]"
    >
      <div className={`rounded-full p-3 ${enabled ? 'bg-cyan-400/12' : 'bg-white/6'}`}>
        {enabled ? <Bell className="h-5 w-5 text-cyan-300" /> : <BellOff className="h-5 w-5 text-gray-500" />}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-semibold">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className={`relative h-6 w-12 rounded-full transition-colors ${enabled ? 'bg-cyan-400' : 'bg-gray-700'}`}>
        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
      </div>
    </button>
  );
};
