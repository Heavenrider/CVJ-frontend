import { NextResponse } from "next/server";
import { db, checkDbConnection } from "@/lib/db";

export async function GET() {
  try {
    const isDbConnected = await checkDbConnection();
    let categories = [];

    if (isDbConnected) {
      categories = await db.category.findMany({
        orderBy: { name: "asc" }
      });
    } else {
      categories = [
        { id: "cat-1", name: "Bangles", slug: "bangles", metalType: "GOLD" },
        { id: "cat-2", name: "Necklaces", slug: "necklaces", metalType: "GOLD" },
        { id: "cat-3", name: "Rings", slug: "rings", metalType: "GOLD" },
        { id: "cat-4", name: "Earrings", slug: "earrings", metalType: "GOLD" },
        { id: "cat-5", name: "Anklets", slug: "anklets", metalType: "SILVER" },
        { id: "cat-6", name: "Pooja Items", slug: "pooja-items", metalType: "SILVER" }
      ];
    }

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching categories" }, { status: 500 });
  }
}
