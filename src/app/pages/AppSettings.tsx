import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, User, Bell, BellOff, Edit3, Check } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AppSettings() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('John Doe');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [notifications, setNotifications] = useState({
    newReleases: true,
    recommendations: true,
    watchlist: false,
  });

  const handleSaveName = () => {
    setUserName(tempName);
    setIsEditingName(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const avatarColors = [
    'from-cyan-500 to-purple-500',
    'from-pink-500 to-orange-500',
    'from-green-500 to-blue-500',
    'from-yellow-500 to-red-500',
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black to-transparent">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">App Settings</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Profile</h2>

            {/* Avatar Selection */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">Choose Avatar</label>
              <div className="flex gap-3">
                {avatarColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAvatar(idx)}
                    className={`w-16 h-16 bg-gradient-to-br ${color} rounded-full flex items-center justify-center transition-all ${
                      selectedAvatar === idx ? 'ring-4 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <User className="w-8 h-8 text-white" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Edit */}
            <div className="bg-gray-900 rounded-lg p-4">
              <label className="text-sm text-gray-400 mb-2 block">Display Name</label>
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    autoFocus
                  />
                  <Button
                    onClick={handleSaveName}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black"
                    size="sm"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{userName}</span>
                  <button
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    className="p-2 hover:bg-gray-800 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
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

          {/* App Info */}
          <div className="pt-6 border-t border-gray-800">
            <div className="text-center text-gray-500 text-sm space-y-1">
              <p>StreamX v1.0.0</p>
              <p>© 2026 StreamX. All rights reserved.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Notification Toggle Component
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
      className="w-full p-4 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all flex items-start gap-4"
    >
      <div className={`p-3 rounded-full ${enabled ? 'bg-cyan-500/20' : 'bg-gray-800'}`}>
        {enabled ? (
          <Bell className="w-5 h-5 text-cyan-400" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-500" />
        )}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-semibold">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-cyan-500' : 'bg-gray-700'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </div>
    </button>
  );
};
