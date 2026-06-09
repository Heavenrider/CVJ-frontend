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

    const [
      totalOrders,
      revenueResult,
      totalCustomers,
      totalProducts,
      pendingOrders,
      completedOrders,
      ratesHistory,
      dbRecentOrders,
    ] = await Promise.all([
      db.order.count(),
      db.order.aggregate({
        where: { status: { not: "CANCELLED" }, paymentStatus: "COMPLETED" },
        _sum: { total: true },
      }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.product.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "DELIVERED" } }),
      db.metalRate.findMany({ orderBy: { timestamp: "desc" }, take: 15 }),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    const totalRevenue = revenueResult._sum.total || 0;

    const goldRates = ratesHistory
      .filter((r) => r.metalType === "GOLD" && r.purity === "22K")
      .slice(0, 7)
      .reverse();

    const silverRates = ratesHistory
      .filter((r) => r.metalType === "SILVER")
      .slice(0, 7)
      .reverse();

    return NextResponse.json({
      success: true,
      stats: { totalOrders, totalRevenue, totalCustomers, totalProducts, pendingOrders, completedOrders },
      rates: {
        gold: goldRates.map((r) => ({
          rate: r.ratePerGram,
          time: r.timestamp.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        })),
        silver: silverRates.map((r) => ({
          rate: r.ratePerGram,
          time: r.timestamp.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        })),
      },
      recentOrders: dbRecentOrders.map((o) => ({
        id: o.id,
        customerName: o.user.name,
        customerEmail: o.user.email,
        total: o.total,
        status: o.status,
        date: o.createdAt.toLocaleDateString("en-IN"),
      })),
    });
  } catch (error: any) {
    console.error("Admin dashboard GET error:", error);
    return NextResponse.json({ success: false, message: "Server error aggregating admin statistics" }, { status: 500 });
  }
}
