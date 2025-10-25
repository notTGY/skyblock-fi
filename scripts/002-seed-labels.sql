-- Seed default labels for item categorization

INSERT OR IGNORE INTO labels (name, color) VALUES 
  ('Commodities', '#10b981'),
  ('Goods', '#3b82f6'),
  ('Materials', '#f59e0b'),
  ('Consumables', '#ef4444'),
  ('Rare', '#8b5cf6'),
  ('Volatile', '#ec4899');
