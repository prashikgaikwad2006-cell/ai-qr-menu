'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Loader2, Plus, Minus, ShoppingCart, X, Send } from 'lucide-react'
import { Dish, DEMO_DISHES, isSupabaseConfigured, supabase, OrderItem } from '@/lib/supabase'

interface MenuPageProps {
  params: Promise<{ cafeId: string }>
}

interface CartItem extends OrderItem {
  quantity: number
}

export default function MenuPage({ params }: MenuPageProps) {
  const [cafeId, setCafeId] = useState('')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [demoMode, setDemoMode] = useState(false)

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCartBar, setShowCartBar] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [tableNumber, setTableNumber] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    params.then(p => {
      setCafeId(p.cafeId)
      const configured = isSupabaseConfigured()
      setDemoMode(!configured)
      if (configured) {
        fetchDishes(p.cafeId)
      } else {
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

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [cart])

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  // Cart functions
  function addToCart(dish: Dish) {
    setCart(prev => {
      const existing = prev.find(item => item.dish_id === dish.id)
      if (existing) {
        return prev.map(item =>
          item.dish_id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        dish_id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1
      }]
    })
    setShowCartBar(true)
  }

  function removeFromCart(dishId: string) {
    setCart(prev => {
      const existing = prev.find(item => item.dish_id === dishId)
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.dish_id === dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prev.filter(item => item.dish_id !== dishId)
    })
  }

  function getCartQuantity(dishId: string): number {
    const item = cart.find(item => item.dish_id === dishId)
    return item?.quantity || 0
  }

  async function placeOrder() {
    if (!tableNumber.trim()) return

    setOrdering(true)

    const orderData = {
      table_no: tableNumber.trim(),
      items: cart.map(item => ({
        dish_id: item.dish_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total_price: cartTotal,
      status: 'pending'
    }

    try {
      await supabase.from('orders').insert(orderData)
      setOrderSuccess(true)
      setCart([])
      setTableNumber('')
      setTimeout(() => {
        setShowOrderModal(false)
        setOrderSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to place order:', error)
    }

    setOrdering(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
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
            <p className="text-gray-400 text-lg">Scan & Order</p>
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
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="glass-card p-4 md:p-5 hover:border-gold/30 transition-all"
                >
                  <div className="flex gap-4">
                    {dish.image_url && (
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-lg md:text-xl font-semibold truncate">
                          {dish.name}
                        </h3>
                        <span className="text-xl font-bold text-teal flex-shrink-0">
                          ₹{dish.price}
                        </span>
                      </div>
                      <span className="inline-block text-xs px-2 py-1 bg-charcoal rounded-full text-gold mb-2">
                        {dish.category}
                      </span>
                      {dish.ai_description && (
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 mb-3">
                          {dish.ai_description}
                        </p>
                      )}
                      {/* Cart Controls */}
                      <div className="flex items-center gap-3">
                        {getCartQuantity(dish.id) > 0 ? (
                          <div className="flex items-center gap-2 bg-charcoal rounded-full">
                            <button
                              onClick={() => removeFromCart(dish.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-charcoal-light hover:bg-gray-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {getCartQuantity(dish.id)}
                            </span>
                            <button
                              onClick={() => addToCart(dish)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gold text-charcoal hover:bg-gold-light transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(dish)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-teal/20 text-teal rounded-full text-sm font-medium hover:bg-teal/30 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating Cart Bar */}
      <AnimatePresence>
        {showCartBar && cartCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 glass border-t border-gold/30 z-50 p-4"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{cartCount} Items in Cart</p>
                  <p className="text-lg font-bold text-gold">₹{cartTotal}</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors"
              >
                <Send className="w-5 h-5" />
                Place Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => !ordering && setShowOrderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              {orderSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-teal" />
                  </div>
                  <h2 className="text-2xl font-bold text-teal mb-2">Order Placed!</h2>
                  <p className="text-gray-400">Your order has been sent to the kitchen.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold gold-gradient-text">Place Order</h2>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-charcoal-light hover:bg-charcoal transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-charcoal rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-2">Order Summary</p>
                    <p className="text-2xl font-bold text-gold">₹{cartTotal}</p>
                    <p className="text-sm text-gray-400">{cartCount} items</p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">
                      Table Number
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value)}
                      placeholder="e.g., Table 5"
                      className="w-full px-4 py-3 bg-charcoal border border-glass-border rounded-lg focus:border-gold focus:outline-none text-lg"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={ordering || !tableNumber.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ordering ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Confirm Order - ₹{cartTotal}
                      </>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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