import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Bookmark, ChevronRight, Crown, Languages, LogOut, PlayCircle, Settings, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';

const avatarGradients = [
  'from-cyan-400 to-cyan-600',
  'from-fuchsia-500 to-orange-500',
  'from-emerald-500 to-sky-600',
  'from-amber-500 to-red-500',
];

export default function Profile() {
  const navigate = useNavigate();
  const { preferences, profile, updatePreferences } = useApp();

  const handleLogout = () => {
    localStorage.removeItem('streamx-preferences');
    localStorage.removeItem('streamx-profile');
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
      icon: Bookmark,
      label: 'My Watchlist',
      subtitle: 'Your saved content',
      action: () => navigate('/watchlist'),
      color: 'text-cyan-300',
    },
    {
      icon: PlayCircle,
      label: 'Continue Watching',
      subtitle: 'Resume your shows',
      action: () => navigate('/continue-watching'),
      color: 'text-cyan-300',
    },
    {
      icon: Languages,
      label: 'Language Preferences',
      subtitle: preferences.languages.join(', '),
      action: () => navigate('/settings/languages'),
      color: 'text-purple-300',
    },
    {
      icon: Settings,
      label: 'App Settings',
      subtitle: 'Manage your preferences',
      action: () => navigate('/settings'),
      color: 'text-gray-300',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#02060c] to-[#09111d] text-white">
      <div className="sticky top-0 z-50 bg-gradient-to-b from-[#02060c] to-transparent">
        <div className="px-4 py-4 sm:px-6">
          <button onClick={() => navigate('/home')} className="rounded-full border border-white/10 bg-white/6 p-2 transition-colors hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradients[profile.avatarIndex] ?? avatarGradients[0]}`}>
            <User className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-2 text-2xl font-bold">{profile.name}</h1>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/12 px-4 py-2">
            <Crown className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-semibold text-amber-300">Premium Member</span>
          </div>

          <p className="mt-3 text-sm text-gray-400">Active until Dec 31, 2026</p>

          <Button
            className="mt-6 border-0 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:from-cyan-300 hover:to-cyan-500"
            onClick={() => navigate('/subscription')}
          >
            <Crown className="mr-2 h-4 w-4" />
            Manage Subscription
          </Button>
        </motion.div>
      </div>

      <div className="px-4 pb-6 sm:px-6">
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={item.action}
              className="group flex w-full items-center gap-4 rounded-2xl border border-white/8 bg-[#0f172a]/86 p-4 transition-all hover:border-cyan-400/30 hover:bg-[#131f31]"
            >
              <div className={`rounded-full bg-white/6 p-3 ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm capitalize text-gray-400">{item.subtitle}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600 transition-colors group-hover:text-gray-300" />
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-red-400/20 bg-red-950/20 p-4 text-red-300 transition-all hover:bg-red-950/35"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">Logout</span>
        </motion.button>
      </div>

      <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-6">
        <p>StreamX v1.0.0</p>
        <p className="mt-2">© 2026 StreamX. All rights reserved.</p>
      </div>
    </div>
  );
}
