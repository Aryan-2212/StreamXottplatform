import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Crown,
  MonitorSmartphone,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'INR 199',
    priceYearly: 'INR 1,990',
    yearlyDiscount: '17%',
    features: ['Access to included content', 'Watch on 1 device', '720p HD quality', 'Ad-supported experience', 'Cancel anytime'],
    current: false,
    icon: MonitorSmartphone,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'INR 499',
    priceYearly: 'INR 4,990',
    yearlyDiscount: '17%',
    features: ['All included and premium content', 'Watch on 4 devices', '4K Ultra HD quality', 'Ad-free experience', 'Offline downloads', 'Early access releases', 'Cancel anytime'],
    current: true,
    popular: true,
    icon: Crown,
  },
  {
    id: 'family',
    name: 'Family',
    price: 'INR 799',
    priceYearly: 'INR 7,990',
    yearlyDiscount: '17%',
    features: ['Everything in Premium', 'Up to 6 user profiles', 'Parental controls', 'Shared viewing', 'Priority support', 'Family content library', 'Cancel anytime'],
    current: false,
    icon: Users,
  },
];

export default function ManageSubscription() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-linear-to-b from-[#02060c] to-[#09111d] text-white">
      <div className="sticky top-0 z-50 border-b border-white/8 bg-[#02060c]/94 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => navigate('/profile')} className="rounded-full border border-white/10 bg-white/6 p-2 transition-colors hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
            Manage Subscription
          </h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 pb-12 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="relative overflow-hidden rounded-[28px] border border-amber-400/25 bg-gradient-to-br from-amber-400/14 via-amber-500/8 to-transparent p-6 md:p-8"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-400/8 blur-3xl" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-amber-400/18 p-3">
                  <Crown className="h-6 w-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-300 md:text-2xl">Premium Plan</h2>
                  <p className="text-sm text-gray-300">You are currently enjoying premium benefits.</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={Calendar} label="Active Until" value="Dec 31, 2026" color="text-cyan-300" />
                <StatCard icon={TrendingUp} label="Next Billing" value="Jan 1, 2027" color="text-green-400" />
                <StatCard icon={CreditCard} label="Amount" value="INR 499/mo" color="text-purple-300" />
              </div>
            </div>
          </motion.div>

          <div>
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">Choose Your Plan</h2>
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <motion.button onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')} className="relative h-8 w-16 cursor-pointer rounded-full bg-gray-700 p-1">
                <motion.div
                  animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-lg"
                />
              </motion.button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
              {billingCycle === 'yearly' && (
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full border border-green-400/30 bg-green-400/12 px-3 py-1 text-xs font-bold text-green-300">
                  Save 17%
                </motion.span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`relative rounded-[28px] border p-6 transition-all ${
                    plan.current
                      ? 'border-amber-400/35 bg-gradient-to-br from-amber-400/14 to-[#0f172a]'
                      : 'border-white/10 bg-[#0f172a]/86 hover:border-cyan-400/30 hover:shadow-[0_18px_40px_rgba(8,145,178,0.18)]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1.5 shadow-lg">
                        <Sparkles className="h-3 w-3 text-black" />
                        <span className="text-xs font-bold text-black">Most Popular</span>
                      </div>
                    </div>
                  )}

                  {plan.current && (
                    <div className="absolute right-4 top-4">
                      <div className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black">
                        <Check className="h-3 w-3" />
                        Current
                      </div>
                    </div>
                  )}

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                    <Icon className={`h-7 w-7 ${plan.current ? 'text-amber-300' : 'text-cyan-300'}`} />
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-3 text-2xl font-bold">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{billingCycle === 'monthly' ? plan.price : plan.priceYearly}</span>
                      <span className="text-gray-400">{billingCycle === 'monthly' ? '/month' : '/year'}</span>
                    </div>
                    {billingCycle === 'yearly' && <p className="mt-2 text-sm font-semibold text-green-300">Save {plan.yearlyDiscount} annually</p>}
                  </div>

                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature, itemIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + index * 0.1 + itemIndex * 0.05 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/12">
                          <Check className="h-3 w-3 text-cyan-300" strokeWidth={3} />
                        </div>
                        <span className="leading-relaxed text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    className={`h-12 w-full text-base font-bold transition-all ${
                      plan.current
                        ? 'cursor-not-allowed bg-white/8 text-gray-400'
                        : 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black shadow-lg hover:scale-[1.02] hover:from-cyan-300 hover:to-cyan-500'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Current Plan
                      </>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-[24px] border border-white/8 bg-[#0f172a]/86 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-cyan-400/12 p-2">
                <CreditCard className="h-5 w-5 text-cyan-300" />
              </div>
              <h3 className="text-xl font-bold">Payment Method</h3>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
                  VISA
                </div>
                <div>
                  <p className="font-semibold">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-400">Expires 12/2028</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-white/12 bg-white/6 hover:border-cyan-400/40 hover:bg-white/10">
                Update Card
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-3 rounded-xl border border-green-400/25 bg-green-400/8 p-4">
            <Shield className="h-5 w-5 shrink-0 text-green-300" />
            <p className="text-sm text-gray-300">
              Your payment information is secured with bank-level encryption. Cancel anytime with no questions asked.
            </p>
          </motion.div>

          <div className="pt-4 text-center">
            <button className="text-sm font-medium text-red-400 underline underline-offset-4 transition-colors hover:text-red-300">
              Cancel Subscription
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
      <Icon className={`mb-2 h-5 w-5 ${color}`} />
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
