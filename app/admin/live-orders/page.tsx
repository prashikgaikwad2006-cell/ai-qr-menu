'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, Clock, Utensils, RefreshCw, Volume2, VolumeX } from 'lucide-react'
import { supabase, Order } from '@/lib/supabase'

const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Play notification sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [orders, soundEnabled])

  useEffect(() => {
    // Fetch initial orders
    fetchOrders()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: "status=eq.pending"
        },
        (payload) => {
          // New order arrived
          setOrders(prev => [payload.new as Order, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: false })

    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateOrderStatus(orderId: string, newStatus: 'preparing' | 'served') {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ).filter(order => order.status !== 'served')
      )
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-orange/20 text-orange'
      case 'preparing':
        return 'bg-teal/20 text-teal'
      case 'served':
        return 'bg-green-500/20 text-green-500'
      default:
        return 'bg-gray-500/20 text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6">
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} src={NOTIFICATION_SOUND} preload="auto" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gold-gradient-text flex items-center gap-3">
              <Utensils className="w-8 h-8" />
              Kitchen Display
            </h1>
            <p className="text-gray-400 mt-2">Live orders in real-time</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-lg border transition-colors ${
                soundEnabled
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-charcoal-light border-glass-border text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-charcoal-light border border-glass-border rounded-lg hover:border-gold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-10 h-10 animate-spin text-gold" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-charcoal-light mx-auto mb-4 flex items-center justify-center">
              <Bell className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">No pending orders</p>
            <p className="text-gray-600 text-sm">New orders will appear here automatically</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card p-4 border-2 border-orange/30 hover:border-orange/60 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gold">{order.table_no}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                        <Clock className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {(order.items as any[]).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-charcoal/50 rounded-lg px-3 py-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gold font-semibold">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Actions */}
                  <div className="border-t border-glass-border pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Total</span>
                      <span className="text-xl font-bold text-teal">₹{order.total_price}</span>
                    </div>

                    {order.status === 'pending' ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal text-charcoal rounded-lg font-semibold hover:bg-teal-light transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        Start Preparing
                      </button>
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Served
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}