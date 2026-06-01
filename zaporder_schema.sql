-- ZapOrder Database Schema
-- PostgreSQL DDL for ERD Import

-- Accounts table - Restaurant owner accounts
CREATE TABLE accounts (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT false,
  account_active BOOLEAN DEFAULT true,
  subscription_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ai_api_key VARCHAR(255),
  ai_model VARCHAR(255),
  ai_provider VARCHAR(255) DEFAULT 'groq',
  ai_name VARCHAR(255) DEFAULT 'ZapOder'
);

-- Profiles table - Restaurant public profiles (One-to-One with accounts)
CREATE TABLE profiles (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  restaurant_id VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  avatar VARCHAR(500),
  cover VARCHAR(500),
  photos TEXT[],
  gst_inclusive BOOLEAN DEFAULT false,
  categories TEXT[],
  theme_h FLOAT,
  theme_s FLOAT,
  theme_l FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES accounts(username) ON DELETE CASCADE
);

-- Kitchens table - Kitchen dashboard access (Many-to-One with accounts)
CREATE TABLE kitchens (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  restaurant_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES accounts(username) ON DELETE CASCADE
);

-- Tables table - QR code table management (Many-to-One with accounts)
CREATE TABLE tables (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  restaurant_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(username, restaurant_id),
  FOREIGN KEY (restaurant_id) REFERENCES accounts(username) ON DELETE CASCADE
);

-- Menus table - Food items with pricing (Many-to-One with accounts)
CREATE TABLE menus (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  restaurant_id VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  price FLOAT NOT NULL,
  tax_percent FLOAT DEFAULT 0,
  food_type VARCHAR(100),
  veg VARCHAR(50) NOT NULL,
  image VARCHAR(500),
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES accounts(username) ON DELETE CASCADE
);

-- Customers table - Customer information
CREATE TABLE customers (
  id VARCHAR(255) PRIMARY KEY,
  fname VARCHAR(255) NOT NULL,
  lname VARCHAR(255) NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  gender VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table - Customer orders (Many-to-One with accounts and customers)
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  restaurant_id VARCHAR(255) NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  state VARCHAR(50) DEFAULT 'active',
  order_total FLOAT DEFAULT 0,
  tax_total FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES accounts(username) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Order Products table - Individual items in orders (Many-to-One with orders and menus)
CREATE TABLE order_products (
  id VARCHAR(255) PRIMARY KEY,
  quantity INT DEFAULT 1,
  price FLOAT NOT NULL,
  tax FLOAT NOT NULL,
  admin_approved BOOLEAN DEFAULT false,
  fulfilled BOOLEAN DEFAULT false,
  order_id VARCHAR(255) NOT NULL,
  menu_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- AI Configs table - AI provider configuration (Many-to-One with accounts)
CREATE TABLE ai_configs (
  id VARCHAR(255) PRIMARY KEY,
  restaurant_id VARCHAR(255) NOT NULL,
  exhausted_providers TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES accounts(username) ON DELETE CASCADE
);

-- Reviews table - Customer reviews (Many-to-One with accounts)
CREATE TABLE reviews (
  id VARCHAR(255) PRIMARY KEY,
  restaurant_id VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES accounts(username) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_profiles_restaurant ON profiles(restaurant_id);
CREATE INDEX idx_kitchens_restaurant ON kitchens(restaurant_id);
CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_menus_restaurant ON menus(restaurant_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_products_order ON order_products(order_id);
CREATE INDEX idx_order_products_menu ON order_products(menu_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_ai_configs_restaurant ON ai_configs(restaurant_id);

-- Comments on tables
COMMENT ON TABLE accounts IS 'Restaurant owner accounts';
COMMENT ON TABLE profiles IS 'Restaurant public profiles (One-to-One with accounts)';
COMMENT ON TABLE kitchens IS 'Kitchen dashboard access (Many-to-One with accounts)';
COMMENT ON TABLE tables IS 'QR code table management (Many-to-One with accounts)';
COMMENT ON TABLE menus IS 'Food items with pricing and categories (Many-to-One with accounts)';
COMMENT ON TABLE customers IS 'Customer information';
COMMENT ON TABLE orders IS 'Customer orders (Many-to-One with accounts and customers)';
COMMENT ON TABLE order_products IS 'Individual items in orders (Many-to-One with orders and menus)';
COMMENT ON TABLE ai_configs IS 'AI provider configuration (Many-to-One with accounts)';
COMMENT ON TABLE reviews IS 'Customer reviews (Many-to-One with accounts)';
