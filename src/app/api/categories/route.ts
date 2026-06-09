import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching categories" }, { status: 500 });
  }
}
