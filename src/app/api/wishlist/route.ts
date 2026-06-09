import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET() {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await db.wishlistItem.findMany({
      where: { userId: session.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, wishlist });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching wishlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    const wishlistItem = await db.wishlistItem.upsert({
      where: { userId_productId: { userId: session.id, productId } },
      update: {},
      create: { userId: session.id, productId },
    });

    return NextResponse.json({ success: true, message: "Added to wishlist", wishlistItem });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ success: false, message: "Server error adding to wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const wishlistItemId = searchParams.get("id");

    if (!wishlistItemId) {
      return NextResponse.json({ success: false, message: "Wishlist item ID required" }, { status: 400 });
    }

    await db.wishlistItem.delete({ where: { id: wishlistItemId, userId: session.id } });
    return NextResponse.json({ success: true, message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json({ success: false, message: "Server error removing wishlist item" }, { status: 500 });
  }
}
