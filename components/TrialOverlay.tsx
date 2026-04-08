'use client'

import { motion } from 'framer-motion'
import { Lock, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface TrialOverlayProps {
  onUpgrade?: () => void
}

export default function TrialOverlay({ onUpgrade }: TrialOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full text-center border-2 border-red-500/50"
      >
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Trial Expired
        </h2>

        <p className="text-gray-300 mb-6">
          Your 14-day free trial has ended. Upgrade now to continue using AI-powered features and keep your menu live.
        </p>

        <div className="bg-charcoal p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-400 mb-2">Lifetime Access</p>
          <p className="text-3xl font-bold gold-gradient-text">₹10,000</p>
        </div>

        <Link
          href="/admin/billing"
          onClick={onUpgrade}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors mb-3"
        >
          <CreditCard className="w-5 h-5" />
          Upgrade Now
        </Link>

        <p className="text-xs text-gray-500">
          Secure payment via UPI. Instant access after verification.
        </p>
      </motion.div>
    </motion.div>
  )
}