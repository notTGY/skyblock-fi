-- Create tables for Hypixel Skyblock finance tracking

-- Items table to store bazaar items
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Labels table for categorizing items
CREATE TABLE IF NOT EXISTS labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3b82f6'
);

-- Item labels junction table (many-to-many)
CREATE TABLE IF NOT EXISTS item_labels (
  item_id TEXT NOT NULL,
  label_id INTEGER NOT NULL,
  PRIMARY KEY (item_id, label_id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  buy_price REAL,
  sell_price REAL,
  buy_orders INTEGER,
  sell_orders INTEGER,
  buy_volume INTEGER,
  sell_volume INTEGER,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_price_history_item_timestamp 
  ON price_history(item_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_item_labels_item 
  ON item_labels(item_id);
CREATE INDEX IF NOT EXISTS idx_item_labels_label 
  ON item_labels(label_id);
