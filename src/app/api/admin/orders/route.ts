import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, checkDbConnection } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

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

    const isDbConnected = await checkDbConnection();
    let orders: any[] = [];

    if (isDbConnected) {
      orders = await db.order.findMany({
        include: {
          user: { select: { name: true, email: true, phone: true } },
          address: true,
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    } else {
      orders = [
        {
          id: "mock-ord-1",
          userId: "mock-customer-id",
          addressId: "mock-addr-1",
          status: "DELIVERED",
          paymentMethod: "COD",
          paymentStatus: "COMPLETED",
          subtotal: 238000,
          makingCharges: 7000,
          gst: 7350,
          shipping: 0,
          total: 252350,
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          user: { name: "Koppisetti Lakshmi", email: "lakshmi@gmail.com", phone: "9948625356" },
          address: { street: "Beside Ramu Medicals", city: "Alamuru", state: "Andhra Pradesh", postalCode: "533233" },
          items: [
            { id: "item-1", quantity: 1, pricePerUnit: 252350, weightPerUnit: 32.5, metalRateUsed: 6830, product: { name: "Antique Kasu Mala Choker" } }
          ]
        },
        {
          id: "mock-ord-2",
          userId: "mock-customer-id",
          addressId: "mock-addr-1",
          status: "PENDING",
          paymentMethod: "RAZORPAY",
          paymentStatus: "PENDING",
          subtotal: 18000,
          makingCharges: 500,
          gst: 550,
          shipping: 350,
          total: 19400,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: { name: "Satyanarayana Murthy V.", email: "satya.v@gmail.com", phone: "9876543210" },
          address: { street: "Main Bazaar", city: "Mandapeta", state: "Andhra Pradesh", postalCode: "533308" },
          items: [
            { id: "item-2", quantity: 1, pricePerUnit: 19400, weightPerUnit: 6.8, metalRateUsed: 6830, product: { name: "Royal Diamond-Cut Ring" } }
          ]
        }
      ];
    }

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

    const isDbConnected = await checkDbConnection();
    let updatedOrder;

    if (isDbConnected) {
      updatedOrder = await db.order.update({
        where: { id: orderId },
        data: {
          status,
          ...extraUpdates
        }
      });
    } else {
      updatedOrder = {
        id: orderId,
        status,
        ...extraUpdates,
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({ success: true, message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Admin orders PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating order status" }, { status: 500 });
  }
}
