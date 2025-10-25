import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    if (!itemId) {
      return NextResponse.json({ error: "itemId required" }, { status: 400 })
    }

    const prices = await sql`
      SELECT 
        timestamp,
        buy_price,
        sell_price,
        buy_orders,
        sell_orders,
        buy_volume,
        sell_volume
      FROM price_history
      WHERE item_id = ${itemId}
        AND timestamp >= datetime('now', '-${hours} hours')
      ORDER BY timestamp DESC
      LIMIT 1000
    `

    return NextResponse.json(prices)
  } catch (error) {
    console.error("[v0] Error fetching prices:", error)
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    await sql`
      INSERT INTO price_history (
        item_id, buy_price, sell_price, 
        buy_orders, sell_orders, buy_volume, sell_volume
      )
      VALUES (
        ${data.itemId}, ${data.buyPrice}, ${data.sellPrice},
        ${data.buyOrders}, ${data.sellOrders}, ${data.buyVolume}, ${data.sellVolume}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving price:", error)
    return NextResponse.json({ error: "Failed to save price" }, { status: 500 })
  }
}
