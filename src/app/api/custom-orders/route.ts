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

// GET: Admin fetches all custom design requests
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const admin = verifyToken(token);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const customOrders = await db.customOrder.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, customOrders });
  } catch (error) {
    console.error("CustomOrders GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching custom orders" }, { status: 500 });
  }
}

// POST: Customer submits a custom design brief
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    const { name, phone, email, description, metalType, designImage } = await request.json();

    if (!name || !phone || !description || !metalType) {
      return NextResponse.json({ success: false, message: "Missing required fields: name, phone, description, metalType" }, { status: 400 });
    }

    const customOrder = await db.customOrder.create({
      data: {
        userId: user?.id || null,
        name,
        phone,
        email,
        description,
        metalType,
        designImage,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Custom design request submitted successfully",
      customOrder,
    });
  } catch (error) {
    console.error("CustomOrders POST error:", error);
    return NextResponse.json({ success: false, message: "Server error submitting custom order" }, { status: 500 });
  }
}

// PUT: Admin updates status of a custom request
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const admin = verifyToken(token);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: "Order ID and status required" }, { status: 400 });
    }

    const updated = await db.customOrder.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true, message: "Request status updated successfully", customOrder: updated });
  } catch (error) {
    console.error("CustomOrders PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating custom order status" }, { status: 500 });
  }
}
