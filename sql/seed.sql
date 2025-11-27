INSERT INTO listings (id, title, description, category, tags, city, price, rating, is_active)
VALUES
  ('listing_1', 'Handmade terracotta earrings', 'Lightweight, handcrafted earrings.', 'Accessories', ARRAY['handmade','earrings','terracotta'], 'Chennai', 450, 4.7, TRUE),
  ('listing_2', 'Men''s running shoes', 'Breathable and lightweight running shoes.', 'Footwear', ARRAY['sports','shoes','running'], 'Bangalore', 2499, 4.3, TRUE),
  ('listing_3', 'Premium cotton saree', 'Soft cotton saree suitable for daily wear.', 'Clothing', ARRAY['saree','cotton','ethnic'], 'Hyderabad', 1899, 4.5, TRUE),
  ('listing_4', 'Freelance web developer', 'Full-stack developer for web apps.', 'Services', ARRAY['developer','web','fullstack'], 'Remote', 1500, 4.9, TRUE),
  ('listing_5', 'Home baking - custom cakes', 'Custom cakes and cupcakes.', 'Food', ARRAY['baking','cakes','dessert'], 'Chennai', 1200, 4.8, TRUE)
ON CONFLICT (id) DO NOTHING;
