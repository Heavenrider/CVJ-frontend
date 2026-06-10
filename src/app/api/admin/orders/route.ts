import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") return null;
  return decoded;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const orders = await db.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        address: true,
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching admin orders" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: "Order ID and status required" }, { status: 400 });
    }

    const extraUpdates: any = {};
    if (status === "DELIVERED") {
      extraUpdates.paymentStatus = "COMPLETED";
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status, ...extraUpdates },
    });

    // Create a Payment log for COD orders when marked DELIVERED
    if (status === "DELIVERED" && updatedOrder.paymentMethod === "COD") {
      try {
        const existingPayment = await db.payment.findFirst({
          where: { orderId: orderId }
        });
        if (!existingPayment) {
          await db.payment.create({
            data: {
              orderId,
              method: "COD",
              status: "COMPLETED",
              amount: updatedOrder.total,
              transactionId: `cod_${orderId.slice(0, 8)}_${Date.now()}`
            }
          });
        }
      } catch (payLogErr) {
        console.warn("Failed to create Payment log for delivered COD order:", payLogErr);
      }
    }

    return NextResponse.json({ success: true, message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Admin orders PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating order status" }, { status: 500 });
  }
}
