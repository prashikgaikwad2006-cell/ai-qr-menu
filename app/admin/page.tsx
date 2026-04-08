'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  QrCode,
  Utensils,
  Loader2,
  CreditCard
} from 'lucide-react'
import { supabase, Dish, DEMO_DISHES, isSupabaseConfigured, getUserSubscription, canAccessAI, isTrialExpired, UserSubscription } from '@/lib/supabase'
import { generateDishDescription } from '@/lib/gemini'
import QRCode from 'qrcode'
import TrialOverlay from '@/components/TrialOverlay'

// Demo cafe ID - in production, this would come from auth
const DEMO_CAFE_ID = 'demo-cafe'

const CATEGORIES = ['Starters', 'Main Course', 'Drinks', 'Desserts']

export default function AdminPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    ai_description: '',
    image_url: ''
  })

  const [demoMode, setDemoMode] = useState(false)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [showTrialOverlay, setShowTrialOverlay] = useState(false)

  useEffect(() => {
    const configured = isSupabaseConfigured()
    setDemoMode(!configured)

    // Check subscription status
    const sub = getUserSubscription()
    setSubscription(sub)

    // Show overlay if trial expired
    if (sub && isTrialExpired(sub)) {
      setShowTrialOverlay(true)
    }

    if (configured) {
      fetchDishes()
    } else {
      // Use demo data
      setDishes(DEMO_DISHES)
      setLoading(false)
    }
  }, [])

  async function fetchDishes() {
    setLoading(true)
    const { data } = await supabase
      .from('dishes')
      .select('*')
      .eq('cafe_id', DEMO_CAFE_ID)
      .order('created_at', { ascending: false })

    if (data) setDishes(data)
    setLoading(false)
  }

  async function handleGenerateDescription() {
    if (!formData.name) return

    // Check if user can access AI features
    if (!canAccessAI(subscription)) {
      setShowTrialOverlay(true)
      return
    }

    setGeneratingDesc(true)
    try {
      const description = await generateDishDescription(formData.name)
      setFormData(prev => ({ ...prev, ai_description: description }))
    } catch (error) {
      console.error('Failed to generate description:', error)
    }
    setGeneratingDesc(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const dishData: Dish = {
      id: editingDish?.id || crypto.randomUUID(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      ai_description: formData.ai_description || null,
      image_url: formData.image_url || null,
      cafe_id: DEMO_CAFE_ID,
      created_at: editingDish?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (editingDish) {
      setDishes(prev => prev.map(d => d.id === editingDish.id ? dishData : d))
    } else {
      setDishes(prev => [dishData, ...prev])
    }

    if (demoMode) {
      // Save to localStorage for demo mode
      if (editingDish) {
        const updated = dishes.map(d => d.id === editingDish.id ? dishData : d)
        localStorage.setItem('demo_dishes', JSON.stringify(updated))
      } else {
        localStorage.setItem('demo_dishes', JSON.stringify([dishData, ...dishes]))
      }
    }

    resetForm()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this dish?')) return
    setDishes(prev => prev.filter(d => d.id !== id))

    if (demoMode) {
      const updated = dishes.filter(d => d.id !== id)
      localStorage.setItem('demo_dishes', JSON.stringify(updated))
    }
  }

  function handleEdit(dish: Dish) {
    setEditingDish(dish)
    setFormData({
      name: dish.name,
      price: dish.price.toString(),
      category: dish.category,
      ai_description: dish.ai_description || '',
      image_url: dish.image_url || ''
    })
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingDish(null)
    setFormData({
      name: '',
      price: '',
      category: 'Main Course',
      ai_description: '',
      image_url: ''
    })
  }

  // Get the base URL - use env var, or fallback to current window origin
  function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL
    }
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin
    }
    return 'http://localhost:3000'
  }

  async function generateQRCode() {
    const menuUrl = `${getBaseUrl()}/menu/${DEMO_CAFE_ID}`
    const qrDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#d4a853',
        light: '#1a1a1a'
      }
    })
    setQrCodeUrl(qrDataUrl)
    setShowQR(true)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      {/* Trial Overlay - Shows when trial expired */}
      <AnimatePresence>
        {showTrialOverlay && (
          <TrialOverlay onUpgrade={() => setShowTrialOverlay(false)} />
        )}
      </AnimatePresence>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gold-gradient-text flex items-center gap-3">
              <Utensils className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              {demoMode ? 'Demo Mode - Data stored locally' : 'Manage your cafe menu'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generateQRCode}
              className="flex items-center gap-2 px-4 py-2 bg-charcoal-light rounded-lg border border-glass-border hover:border-gold transition-colors"
            >
              <QrCode className="w-5 h-5" />
              <span className="hidden sm:inline">Generate QR</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Dish
            </button>
          </div>
        </motion.div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="glass-card p-8 max-w-md w-full text-center"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold gold-gradient-text mb-4">Your Menu QR Code</h2>
                <p className="text-gray-400 mb-6">Scan to view your digital menu</p>
                {qrCodeUrl && (
                  <div className="flex justify-center mb-6">
                    <img src={qrCodeUrl} alt="QR Code" className="rounded-lg" />
                  </div>
                )}
                <p className="text-sm text-gray-500 break-all font-mono">
                  {getBaseUrl()}/menu/{DEMO_CAFE_ID}
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-6 px-6 py-2 bg-charcoal-light rounded-lg border border-glass-border hover:border-gold transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={resetForm}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold gold-gradient-text mb-6">
                  {editingDish ? 'Edit Dish' : 'Add New Dish'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Dish Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-charcoal border border-glass-border rounded-lg focus:border-gold focus:outline-none"
                      placeholder="e.g., Paneer Tikka"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-3 bg-charcoal border border-glass-border rounded-lg focus:border-gold focus:outline-none"
                        placeholder="299"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-charcoal border border-glass-border rounded-lg focus:border-gold focus:outline-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm text-gray-400">AI Description</label>
                      <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={generatingDesc || !formData.name}
                        className="flex items-center gap-1 text-sm text-teal hover:text-teal-light transition-colors disabled:opacity-50"
                      >
                        {generatingDesc ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        Generate AI
                      </button>
                    </div>
                    <textarea
                      value={formData.ai_description}
                      onChange={e => setFormData(prev => ({ ...prev, ai_description: e.target.value }))}
                      className="w-full px-4 py-3 bg-charcoal border border-glass-border rounded-lg focus:border-gold focus:outline-none resize-none"
                      rows={3}
                      placeholder="Mouth-watering description will appear here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full px-4 py-3 bg-charcoal border border-glass-border rounded-lg focus:border-gold focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-3 bg-charcoal-light border border-glass-border rounded-lg hover:border-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors"
                    >
                      {editingDish ? 'Update' : 'Add'} Dish
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dishes Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
          </div>
        ) : dishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Utensils className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No dishes yet. Add your first dish!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 hover:border-gold/50 transition-colors group"
              >
                {dish.image_url && (
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{dish.name}</h3>
                  <span className="text-gold font-bold">₹{dish.price}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{dish.category}</p>
                {dish.ai_description && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{dish.ai_description}</p>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(dish)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-charcoal rounded-lg hover:bg-charcoal-light transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}