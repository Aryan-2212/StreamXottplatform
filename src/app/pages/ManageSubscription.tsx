import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Crown, Check, Sparkles, CreditCard, Calendar, Shield, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹199',
    priceYearly: '₹1,990',
    yearlyDiscount: '17%',
    period: '/month',
    features: [
      'Access to Included Content',
      'Watch on 1 device',
      '720p HD Quality',
      'Ad-supported experience',
      'Cancel anytime',
    ],
    color: 'from-gray-600 to-gray-700',
    gradient: 'from-gray-500/20 to-gray-600/20',
    current: false,
    icon: '📱',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹499',
    priceYearly: '₹4,990',
    yearlyDiscount: '17%',
    period: '/month',
    features: [
      'All Included + Premium Content',
      'Watch on 4 devices simultaneously',
      '4K Ultra HD Quality',
      'Ad-free experience',
      'Download for offline viewing',
      'Early access to new releases',
      'Cancel anytime',
    ],
    color: 'from-amber-500 to-amber-600',
    gradient: 'from-amber-500/20 to-amber-600/20',
    current: true,
    popular: true,
    icon: '⭐',
  },
  {
    id: 'family',
    name: 'Family',
    price: '₹799',
    priceYearly: '₹7,990',
    yearlyDiscount: '17%',
    period: '/month',
    features: [
      'Everything in Premium',
      'Up to 6 user profiles',
      'Parental controls & Kids mode',
      'SharePlay with friends',
      'Priority customer support 24/7',
      'Exclusive family content',
      'Cancel anytime',
    ],
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/20 to-pink-500/20',
    current: false,
    icon: '👨‍👩‍👧‍👦',
  },
];

export default function ManageSubscription() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            Manage Subscription
          </h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 pb-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Current Plan Highlight */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-6 md:p-8 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border-2 border-amber-500/50 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-amber-400">Premium Plan</h2>
                  <p className="text-sm text-gray-300">You're currently enjoying premium benefits</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl">
                  <Calendar className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-sm text-gray-400">Active Until</p>
                  <p className="font-bold">Dec 31, 2026</p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl">
                  <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-sm text-gray-400">Next Billing</p>
                  <p className="font-bold">Jan 1, 2027</p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl">
                  <CreditCard className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="font-bold">₹499/mo</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billing Cycle Toggle */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Choose Your Plan</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <motion.button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-16 h-8 bg-gray-700 rounded-full p-1 cursor-pointer"
              >
                <motion.div
                  animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full shadow-lg"
                />
              </motion.button>
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full text-xs font-bold"
                >
                  💰 Save 17%
                </motion.span>
              )}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  plan.current
                    ? `bg-gradient-to-br ${plan.gradient} border-amber-500 shadow-xl shadow-amber-500/20`
                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-500 hover:shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1, type: 'spring' }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                  >
                    <div className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs font-bold text-black">MOST POPULAR</span>
                    </div>
                  </motion.div>
                )}

                {/* Current Badge */}
                {plan.current && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      CURRENT
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div className="text-4xl mb-4">{plan.icon}</div>

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {billingCycle === 'monthly' ? plan.price : plan.priceYearly}
                    </span>
                    <span className="text-gray-400">
                      {billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-400 mt-2 font-semibold">
                      Save {plan.yearlyDiscount} annually
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 + i * 0.05 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-cyan-400" strokeWidth={3} />
                      </div>
                      <span className="text-gray-300 leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full h-12 text-base font-bold transition-all ${
                    plan.current
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold">Payment Method</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-semibold">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-400">Expires 12/2028</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 hover:border-cyan-500">
                Update Card
              </Button>
            </div>
          </motion.div>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
          >
            <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              Your payment information is secured with bank-level encryption. Cancel anytime with no questions asked.
            </p>
          </motion.div>

          {/* Cancel Subscription */}
          <div className="text-center pt-4">
            <button className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium underline underline-offset-4">
              Cancel Subscription
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}