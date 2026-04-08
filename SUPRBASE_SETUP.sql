-- Supabase Database Setup for AI Digital QR Menu
-- Run this SQL in your Supabase project's SQL Editor

-- Create dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'Main Course',
  ai_description TEXT,
  image_url TEXT,
  cafe_id TEXT NOT NULL DEFAULT 'demo-cafe',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- Create policy for demo cafe (in production, use auth.uid())
CREATE POLICY "Allow public read access for demo cafe" ON dishes
  FOR SELECT USING (cafe_id = 'demo-cafe');

CREATE POLICY "Allow authenticated users to insert for demo cafe" ON dishes
  FOR INSERT WITH CHECK (cafe_id = 'demo-cafe');

CREATE POLICY "Allow authenticated users to update for demo cafe" ON dishes
  FOR UPDATE USING (cafe_id = 'demo-cafe');

CREATE POLICY "Allow authenticated users to delete for demo cafe" ON dishes
  FOR DELETE USING (cafe_id = 'demo-cafe');

-- Create index for faster queries
CREATE INDEX idx_dishes_cafe_id ON dishes(cafe_id);
CREATE INDEX idx_dishes_category ON dishes(category);

-- Insert sample data
INSERT INTO dishes (name, price, category, ai_description) VALUES
  ('Paneer Tikka', 299, 'Starters', 'Cubes of fresh paneer marinated in aromatic spices, grilled to perfection with a smokycharcoal flavor and served with mint chutney.'),
  ('Butter Chicken', 349, 'Main Course', 'Tender chicken pieces simmered in a rich, creamy tomato gravy with aromatic spices, delivering a perfect balance of mild sweetness and savory depth.'),
  ('Masala Chai', 40, 'Drinks', 'Aromatic black tea brewed with traditional spices including cardamom, ginger, and cinnamon, finished with creamy milk.'),
  ('Gulab Jamun', 120, 'Desserts', 'Soft, spongy milk dumplings soaked in rose-scented sugar syrup, melting in your mouth with every heavenly bite.'),
  ('Vegetable Biryani', 279, 'Main Course', 'Fragrant basmati rice layered with spiced vegetables, saffron-infused milk, and crispy fried onions.'),
  ('Cold Coffee', 149, 'Drinks', 'Smooth and creamy cold coffee blended with ice and a hint of chocolate, topped with frothy milk.'),
  ('Chicken Seekh Kebab', 320, 'Starters', 'Minced chicken skewered with aromatic spices, grilled to juicy perfection with a smoky char.'),
  ('Mango Lassi', 129, 'Drinks', 'Creamy yogurt blended with sweet Alphonso mango, creating a refreshing and indulgent beverage.'),
  ('Tiramisu', 180, 'Desserts', 'Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream, dusted with cocoa.');

-- Note: You'll need to configure RLS policies properly for production use
-- For now, you can disable RLS for testing: ALTER TABLE dishes DISABLE ROW LEVEL SECURITY;