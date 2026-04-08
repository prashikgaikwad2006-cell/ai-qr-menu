'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Loader2 } from 'lucide-react'
import { Dish, DEMO_DISHES, isSupabaseConfigured } from '@/lib/supabase'

interface MenuPageProps {
  params: Promise<{ cafeId: string }>
}

export default function MenuPage({ params }: MenuPageProps) {
  const [cafeId, setCafeId] = useState('')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    params.then(p => {
      setCafeId(p.cafeId)
      const configured = isSupabaseConfigured()
      setDemoMode(!configured)
      if (configured) {
        fetchDishes(p.cafeId)
      } else {
        // Use demo data
        setDishes(DEMO_DISHES)
        setLoading(false)
      }
    })
  }, [params])

  async function fetchDishes(cafeId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('dishes')
      .select('*')
      .eq('cafe_id', cafeId)
      .order('created_at', { ascending: false })

    if (data) setDishes(data)
    setLoading(false)
  }

  const categories = useMemo(() => {
    const cats = new Set(dishes.map(d => d.category))
    return ['All', ...Array.from(cats)]
  }, [dishes])

  const filteredDishes = useMemo(() => {
    if (selectedCategory === 'All') return dishes
    return dishes.filter(d => d.category === selectedCategory)
  }, [dishes, selectedCategory])

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-light/50 to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a853' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold gold-gradient-text mb-2">
              Digital Menu
            </h1>
            <p className="text-gray-400 text-lg">Scan & Explore</p>
          </motion.div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-0 z-40 glass border-b border-glass-border">
        <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold text-charcoal'
                    : 'bg-charcoal-light text-gray-300 hover:bg-charcoal hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
          </div>
        ) : filteredDishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-charcoal-light mx-auto mb-4 flex items-center justify-center">
              <Star className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">
              {selectedCategory === 'All'
                ? 'No dishes available'
                : `No ${selectedCategory} dishes yet`}
            </p>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="glass-card p-4 md:p-5 hover:border-gold/30 transition-all group"
                >
                  <div className="flex gap-4">
                    {dish.image_url && (
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-lg md:text-xl font-semibold truncate pr-2">
                          {dish.name}
                        </h3>
                        <span className="text-xl md:text-2xl font-bold text-teal flex-shrink-0">
                          ₹{dish.price}
                        </span>
                      </div>
                      <span className="inline-block text-xs px-2 py-1 bg-charcoal rounded-full text-gold mb-2">
                        {dish.category}
                      </span>
                      {dish.ai_description && (
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 md:line-clamp-3">
                          {dish.ai_description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-glass-border py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            Powered by AI Digital Menu
          </p>
        </div>
      </footer>
    </div>
  )
}

// Import supabase for fetching (but won't use it in demo mode)
import { supabase } from '@/lib/supabase'