import { neon } from "@neondatabase/serverless";

// For SQLite in development, we'll use a simple wrapper
// In production, you can swap this with actual Neon/Postgres
const sql = neon(process.env.DATABASE_URL || "");

export { sql };

// Types for our database models
export interface Item {
  id: string;
  name: string;
  created_at: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface ItemLabel {
  item_id: string;
  label_id: number;
}

export interface PriceHistory {
  id: number;
  item_id: string;
  timestamp: string;
  buy_price: number | null;
  sell_price: number | null;
  buy_orders: number | null;
  sell_orders: number | null;
  buy_volume: number | null;
  sell_volume: number | null;
}

// Helper types for API responses
export interface ItemWithLabels extends Item {
  labels: Label[];
}

export interface PriceData {
  timestamp: string;
  buy_price: number;
  sell_price: number;
  spread: number;
}
