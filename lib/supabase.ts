import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client only if env vars are available
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Check if Supabase is configured
export const isSupabaseConfigured = () => !!(supabaseUrl && supabaseAnonKey)

// Database types
export interface Dish {
  id: string
  name: string
  price: number
  category: string
  ai_description: string | null
  image_url: string | null
  cafe_id: string
  created_at: string
  updated_at: string
}

export interface Cafe {
  id: string
  name: string
  created_at: string
}

// Order types
export interface OrderItem {
  dish_id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  table_no: string
  items: OrderItem[]
  total_price: number
  status: 'pending' | 'preparing' | 'served'
  created_at: string
}

// Trial & Billing types
export interface UserSubscription {
  id: string
  cafe_id: string
  created_at: string
  is_paid: boolean
  trial_end_date: string
  payment_verified: boolean
  utr_number: string | null
}

// TRIAL CONFIGURATION
export const TRIAL_DAYS = 14

// Get or create user subscription from localStorage (demo mode)
export function getUserSubscription(): UserSubscription | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem('user_subscription')
  if (stored) {
    return JSON.parse(stored)
  }

  // Create new subscription
  const newSub: UserSubscription = {
    id: crypto.randomUUID(),
    cafe_id: 'demo-cafe',
    created_at: new Date().toISOString(),
    is_paid: false,
    trial_end_date: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    payment_verified: false,
    utr_number: null
  }

  localStorage.setItem('user_subscription', JSON.stringify(newSub))
  return newSub
}

// Save user subscription
export function saveUserSubscription(sub: UserSubscription): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('user_subscription', JSON.stringify(sub))
}

// Check if trial is expired
export function isTrialExpired(subscription: UserSubscription | null): boolean {
  if (!subscription) return true
  if (subscription.is_paid) return false

  const now = new Date()
  const trialEnd = new Date(subscription.trial_end_date)
  return now > trialEnd
}

// Check if user can access AI features
export function canAccessAI(subscription: UserSubscription | null): boolean {
  if (!subscription) return false
  if (subscription.is_paid || subscription.payment_verified) return true
  return !isTrialExpired(subscription)
}

// Demo data for when Supabase isn't configured
export const DEMO_DISHES: Dish[] = [
  {
    id: '1',
    name: 'Paneer Tikka',
    price: 299,
    category: 'Starters',
    ai_description: 'Cubes of fresh paneer marinated in aromatic spices, grilled to perfection with a smoky charcoal flavor and served with mint chutney.',
    image_url: null,
    cafe_id: 'demo-cafe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Butter Chicken',
    price: 349,
    category: 'Main Course',
    ai_description: 'Tender chicken pieces simmered in a rich, creamy tomato gravy with aromatic spices, delivering a perfect balance of mild sweetness and savory depth.',
    image_url: null,
    cafe_id: 'demo-cafe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Masala Chai',
    price: 40,
    category: 'Drinks',
    ai_description: 'Aromatic black tea brewed with traditional spices including cardamom, ginger, and cinnamon, finished with creamy milk.',
    image_url: null,
    cafe_id: 'demo-cafe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    price: 120,
    category: 'Desserts',
    ai_description: 'Soft, spongy milk dumplings soaked in rose-scented sugar syrup, melting in your mouth with every heavenly bite.',
    image_url: null,
    cafe_id: 'demo-cafe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Vegetable Biryani',
    price: 279,
    category: 'Main Course',
    ai_description: 'Fragrant basmati rice layered with spiced vegetables, saffron-infused milk, and crispy fried onions.',
    image_url: null,
    cafe_id: 'demo-cafe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]