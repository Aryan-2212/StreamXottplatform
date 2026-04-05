import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function ProblemSolution() {
  const comparisons = [
    {
      problem: 'Content Clutter',
      platform: 'Prime Video',
      issue: 'Mixing free and paid content without clear separation',
      solution: 'Separated Included/Premium',
      description: 'Clear badges and dedicated rows for included vs premium content',
      icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
    },
    {
      problem: 'Poor Visual Hierarchy',
      platform: 'SonyLIV',
      issue: 'Inconsistent layout with cluttered interface',
      solution: 'Structured Content Rows',
      description: 'Hero banner → Continue Watching → Categorized rows with consistent spacing',
      icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
    },
    {
      problem: 'Ad Overload',
      platform: 'MX Player',
      issue: 'Intrusive ads during browsing and mid-content',
      solution: 'Controlled Ad Placement',
      description: 'Pre-roll ads only with skip option, no browsing interruptions',
      icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
    },
    {
      problem: 'Navigation Issues',
      platform: 'ZEE5',
      issue: 'Non-persistent language filters, difficult navigation',
      solution: 'Language-First Onboarding',
      description: 'Persistent language preferences saved across sessions',
      icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
    },
    {
      problem: 'Poor Content Discovery',
      platform: 'Netflix',
      issue: 'Generic recommendations, overwhelming choices',
      solution: 'Smart Discovery System',
      description: 'AI-based recommendations with advanced filters and clear categories',
      icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            StreamX UX Solutions
          </h1>
          <p className="text-xl text-gray-400">
            Solving real problems identified in existing OTT platforms
          </p>
        </motion.div>

        {/* Comparisons */}
        <div className="space-y-8">
          {comparisons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-400/50 transition-all"
            >
              <div className="grid md:grid-cols-3 gap-6 p-6">
                {/* Problem */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-400">Problem</h3>
                  </div>
                  <h4 className="text-xl font-bold">{item.problem}</h4>
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-gray-800 rounded text-gray-400">
                      {item.platform}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{item.issue}</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-cyan-400" />
                </div>

                {/* Solution */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h3 className="font-semibold text-cyan-400">StreamX Solution</h3>
                  </div>
                  <h4 className="text-xl font-bold">{item.solution}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/30"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Key UX Principles Applied</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Design Thinking Process',
              'Nielsen Heuristics',
              'Clear Affordances & Signifiers',
              'Consistent Visual Feedback',
              'Accessibility First',
              'Minimal Cognitive Load',
            ].map((principle, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span className="text-sm">{principle}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'UX Problems Solved', value: '5' },
            { label: 'Screens Designed', value: '6' },
            { label: 'User Flows', value: '12+' },
            { label: 'Platforms Analyzed', value: '5' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
