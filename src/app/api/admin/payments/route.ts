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

export async function GET(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const where: any = {};

    // Search by Order ID or Customer Name
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Filter by Payment Status (COMPLETED, FAILED, PENDING)
    if (status) {
      where.paymentStatus = status;
    }

    // Filter by Date Range
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const orders = await db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, payments: orders });
  } catch (error) {
    console.error("Admin payments GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching admin payments" }, { status: 500 });
  }
}
