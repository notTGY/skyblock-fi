import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Get all items with their labels
    const items = await sql`
      SELECT 
        i.id,
        i.name,
        i.created_at,
        COALESCE(
          json_group_array(
            json_object('id', l.id, 'name', l.name, 'color', l.color)
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'
        ) as labels
      FROM items i
      LEFT JOIN item_labels il ON i.id = il.item_id
      LEFT JOIN labels l ON il.label_id = l.id
      GROUP BY i.id
      ORDER BY i.name
    `;

    return NextResponse.json(items);
  } catch (error) {
    console.error("[v0] Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { id, name } = await request.json();

    await sql`
      INSERT OR REPLACE INTO items (id, name)
      VALUES (${id}, ${name})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
