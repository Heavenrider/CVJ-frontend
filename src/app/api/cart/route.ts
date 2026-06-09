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

    const cartItems = await db.cartItem.findMany({
      where: { userId: session.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, cart: cartItems });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    const parsedQty = Number(quantity) || 1;

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const cartItem = await db.cartItem.upsert({
      where: { userId_productId: { userId: session.id, productId } },
      update: { quantity: { increment: parsedQty } },
      create: { userId: session.id, productId, quantity: parsedQty },
    });

    return NextResponse.json({ success: true, message: "Added to cart", cartItem });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ success: false, message: "Server error adding to cart" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId, quantity } = await request.json();
    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ success: false, message: "Cart item ID and quantity required" }, { status: 400 });
    }

    const parsedQty = Number(quantity);

    if (parsedQty <= 0) {
      await db.cartItem.delete({ where: { id: cartItemId, userId: session.id } });
      return NextResponse.json({ success: true, message: "Item removed from cart" });
    }

    const updated = await db.cartItem.update({
      where: { id: cartItemId, userId: session.id },
      data: { quantity: parsedQty },
    });

    return NextResponse.json({ success: true, message: "Cart updated", cartItem: updated });
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("id");

    if (!cartItemId) {
      return NextResponse.json({ success: false, message: "Cart item ID required" }, { status: 400 });
    }

    await db.cartItem.delete({ where: { id: cartItemId, userId: session.id } });
    return NextResponse.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ success: false, message: "Server error removing cart item" }, { status: 500 });
  }
}
