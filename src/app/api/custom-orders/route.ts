import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, checkDbConnection } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET: Admin fetches all custom requests
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

    const isDbConnected = await checkDbConnection();
    let customOrders = [];

    if (isDbConnected) {
      customOrders = await db.customOrder.findMany({
        orderBy: { createdAt: "desc" }
      });
    } else {
      customOrders = [
        {
          id: "mock-custom-1",
          userId: "mock-customer-id",
          name: "Dev Customer (Mock)",
          phone: "9948625356",
          email: "customer@srichakrajewellers.com",
          description: "Custom bridal waist belt (Vaddanam) with peacock designs and ruby drop stones.",
          metalType: "GOLD",
          designImage: "/assets/silhouette-necklace.jpg",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    return NextResponse.json({ success: true, customOrders });
  } catch (error) {
    console.error("CustomOrders GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching custom orders" }, { status: 500 });
  }
}

// POST: Customers submit a custom order brief
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    const { name, phone, email, description, metalType, designImage } = await request.json();

    if (!name || !phone || !description || !metalType) {
      return NextResponse.json({ success: false, message: "Missing required specifications" }, { status: 400 });
    }

    const isDbConnected = await checkDbConnection();
    let customOrder;

    if (isDbConnected) {
      customOrder = await db.customOrder.create({
        data: {
          userId: user?.id || null,
          name,
          phone,
          email,
          description,
          metalType,
          designImage,
          status: "PENDING"
        }
      });
    } else {
      console.warn("Custom order POST bypassed database because it is offline. Mock order returned.");
      customOrder = {
        id: "mock-custom-" + Math.random().toString(36).substring(2, 9),
        userId: user?.id || null,
        name,
        phone,
        email,
        description,
        metalType,
        designImage,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({
      success: true,
      message: "Custom design request submitted successfully",
      customOrder
    });

  } catch (error) {
    console.error("CustomOrders POST error:", error);
    return NextResponse.json({ success: false, message: "Server error submitting custom order" }, { status: 500 });
  }
}

// PUT: Admin updates status of custom request
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

    const isDbConnected = await checkDbConnection();
    let updated;

    if (isDbConnected) {
      updated = await db.customOrder.update({
        where: { id: orderId },
        data: { status }
      });
    } else {
      updated = {
        id: orderId,
        status,
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({ success: true, message: "Request status updated successfully", customOrder: updated });
  } catch (error) {
    console.error("CustomOrders PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating custom order status" }, { status: 500 });
  }
}
