import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Heart,
  Play,
  Languages,
  Settings,
  LogOut,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';

export default function Profile() {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useApp();

  const handleLogout = () => {
    localStorage.removeItem('streamx-preferences');
    updatePreferences({
      languages: ['english'],
      genres: [],
      contentTypes: ['movie', 'show', 'sports', 'kids'],
      onboardingCompleted: false,
    });
    navigate('/onboarding');
  };

  const menuItems = [
    {
      icon: Heart,
      label: 'My Watchlist',
      subtitle: 'Your saved content',
      action: () => navigate('/watchlist'),
      color: 'text-pink-400',
    },
    {
      icon: Play,
      label: 'Continue Watching',
      subtitle: 'Resume your shows',
      action: () => navigate('/continue-watching'),
      color: 'text-cyan-400',
    },
    {
      icon: Languages,
      label: 'Language Preferences',
      subtitle: preferences.languages.join(', '),
      action: () => navigate('/settings/languages'),
      color: 'text-purple-400',
    },
    {
      icon: Settings,
      label: 'App Settings',
      subtitle: 'Manage your preferences',
      action: () => navigate('/settings'),
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black to-transparent">
        <div className="px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 sm:px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>

          {/* User Name */}
          <h1 className="text-2xl font-bold mb-2">John Doe</h1>

          {/* Subscription Status */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/50 rounded-full">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Premium Member</span>
          </div>

          {/* Subscription Info */}
          <p className="text-sm text-gray-400 mt-3">Active until Dec 31, 2026</p>

          {/* Upgrade Button */}
          <Button
            className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
            onClick={() => navigate('/subscription')}
          >
            <Crown className="w-4 h-4 mr-2" />
            Manage Subscription
          </Button>
        </motion.div>
      </div>

      {/* Menu Items */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="space-y-2">
          {menuItems.map((item, idx) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={item.action}
              className="w-full p-4 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all group flex items-center gap-4"
            >
              <div className={`p-3 bg-gray-800 rounded-full ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-gray-400 capitalize">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="w-full mt-6 p-4 bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 rounded-lg transition-all flex items-center justify-center gap-3 text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </motion.button>
      </div>

      {/* App Info */}
      <div className="px-4 sm:px-6 py-8 text-center text-gray-500 text-sm">
        <p>StreamX v1.0.0</p>
        <p className="mt-2">© 2026 StreamX. All rights reserved.</p>
      </div>
    </div>
  );
}