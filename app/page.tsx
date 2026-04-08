'use client'

import { motion } from 'framer-motion'
import { Sparkles, QrCode, Smartphone, ArrowRight, Check, Utensils } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Navigation */}
      <nav className="glass border-b border-glass-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-gold" />
            <span className="text-xl font-bold gold-gradient-text">AI QR Menu</span>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-light/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a853' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
              #1 AI-Powered Menu Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold gold-gradient-text mb-6 leading-tight">
              The AI-Powered Digital Menu for Modern Cafes
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Transform your cafe menu with AI-generated mouth-watering descriptions.
              Generate instant QR codes and attract more customers with a stunning mobile-first digital menu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-glass-border rounded-lg font-semibold text-lg hover:border-gold transition-colors"
              >
                See Features
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-charcoal/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gold-gradient-text mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to create stunning digital menus
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Gemini AI Descriptions",
                description: "Generate mouth-watering, irresistible dish descriptions with a single click using Google's Gemini AI."
              },
              {
                icon: QrCode,
                title: "Instant QR Generation",
                description: "Generate beautiful QR codes instantly. Customers scan and view your stunning digital menu in seconds."
              },
              {
                icon: Smartphone,
                title: "100% Mobile Optimized",
                description: "Every menu is fully responsive with premium glassmorphism design that looks amazing on any device."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:border-gold/50 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gold-gradient-text mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Get started in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Add Your Dishes", description: "Enter dish names and prices in the admin panel" },
              { step: "02", title: "Generate AI Descriptions", description: "Click to generate mouth-watering descriptions" },
              { step: "03", title: "Share QR Code", description: "Print and display the QR code at your cafe" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <span className="text-5xl font-bold text-gold/30">{item.step}</span>
                <h3 className="text-xl font-semibold mt-2 mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-charcoal/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold gold-gradient-text mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              No monthly fees. Pay once, use forever.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 max-w-lg mx-auto border-2 border-gold/50"
          >
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-teal/20 text-teal rounded-full text-sm font-medium mb-4">
                Limited Time Offer
              </span>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl text-gray-400 line-through">₹25,000</span>
                <span className="text-5xl font-bold gold-gradient-text">₹10,000</span>
              </div>
              <p className="text-gray-400">Lifetime Access</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "14 Days Free Trial",
                "Unlimited Dishes",
                "AI-Powered Descriptions",
                "QR Code Generation",
                "Mobile-Optimized Menu",
                "Premium Support",
                "Lifetime Updates"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/admin"
              className="block w-full py-4 bg-gold text-charcoal rounded-lg font-semibold text-lg text-center hover:bg-gold-light transition-colors"
            >
              Start Free Trial
            </Link>
            <p className="text-center text-gray-500 text-sm mt-4">
              No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold gold-gradient-text mb-4">
              Ready to Transform Your Cafe Menu?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join hundreds of cafes already using AI QR Menu
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-charcoal rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-gold" />
            <span className="text-lg font-bold">AI QR Menu</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 AI Digital QR Menu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}