import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.hypixel.net/v2/skyblock/bazaar");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Error fetching bazaar data:", error);
    return NextResponse.json(
      { error: "Failed to fetch bazaar data" },
      { status: 500 },
    );
  }
}
