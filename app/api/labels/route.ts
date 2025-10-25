import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const labels = await sql`
      SELECT id, name, color FROM labels ORDER BY name
    `;
    return NextResponse.json(labels);
  } catch (error) {
    console.error("[v0] Error fetching labels:", error);
    return NextResponse.json(
      { error: "Failed to fetch labels" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { itemId, labelId } = await request.json();

    await sql`
      INSERT OR IGNORE INTO item_labels (item_id, label_id)
      VALUES (${itemId}, ${labelId})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error adding label:", error);
    return NextResponse.json({ error: "Failed to add label" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const labelId = searchParams.get("labelId");

    await sql`
      DELETE FROM item_labels 
      WHERE item_id = ${itemId} AND label_id = ${labelId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error removing label:", error);
    return NextResponse.json(
      { error: "Failed to remove label" },
      { status: 500 },
    );
  }
}
