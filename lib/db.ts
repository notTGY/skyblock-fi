import { Database } from "bun:sqlite";

const db = new Database("skyblock.db");

function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  let query = "";
  for (let i = 0; i < strings.length; i++) {
    query += strings[i];
    if (i < values.length) {
      query += "?";
    }
  }
  const stmt = db.query(query);
  if (query.trim().toUpperCase().startsWith("SELECT")) {
    return Promise.resolve(stmt.all(values));
  } else {
    stmt.run(values);
    return Promise.resolve([]);
  }
}

sql.unsafe = (query: string) => Promise.resolve(db.exec(query));

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
