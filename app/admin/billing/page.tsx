'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, Loader2, ArrowLeft, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { getUserSubscription, saveUserSubscription, UserSubscription } from '@/lib/supabase'

const PRICE = '₹10,000'

export default function BillingPage() {
  const [utrNumber, setUtrNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)

  useEffect(() => {
    const sub = getUserSubscription()
    setSubscription(sub)
    if (sub?.utr_number) {
      setUtrNumber(sub.utr_number)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!utrNumber.trim()) return

    setSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Save UTR
    if (subscription) {
      const updated: UserSubscription = {
        ...subscription,
        utr_number: utrNumber.trim()
      }
      saveUserSubscription(updated)
      setSubscription(updated)
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold gold-gradient-text mb-2">
              Upgrade to Lifetime Access
            </h1>
            <p className="text-gray-400">
              Complete payment to unlock all features forever
            </p>
          </div>

          {/* Price Display */}
          <div className="bg-charcoal rounded-xl p-6 text-center mb-8">
            <p className="text-gray-400 mb-1">One-time payment</p>
            <p className="text-4xl font-bold gold-gradient-text">{PRICE}</p>
            <p className="text-sm text-gray-500 mt-2">No monthly fees. Ever.</p>
          </div>

          {/* Payment QR */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-teal" />
              Scan to Pay
            </h2>
            <div className="flex justify-center">
              <div className="glass-card p-4 rounded-xl border border-gold/30">
                <img
                  src="/payment-qr.jpg"
                  alt="Payment QR Code"
                  className="w-48 h-48 object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* UTR Input */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal" />
              </div>
              <h3 className="text-xl font-semibold text-teal mb-2">
                Payment Submitted!
              </h3>
              <p className="text-gray-400">
                Your UTR <span className="text-gold font-mono">{utrNumber}</span> has been submitted for verification.
              </p>
              <p className="text-gray-500 text-sm mt-4">
                We typically verify payments within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Enter UTR / Transaction ID
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  placeholder="e.g., 123456789012"
                  className="w-full px-4 py-3 bg-charcoal border border-glass-border rounded-lg focus:border-gold focus:outline-none font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Find UTR in your UPI app transaction history
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || !utrNumber.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit for Verification
                  </>
                )}
              </button>
            </form>
          )}

          {/* Features Included */}
          <div className="mt-8 pt-6 border-t border-glass-border">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              What's Included:
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {[
                'Unlimited Dishes',
                'AI Descriptions',
                'QR Generation',
                'Priority Support',
                'Lifetime Updates',
                'Custom Branding'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}