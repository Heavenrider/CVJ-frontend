import { NextResponse } from "next/server";
import { db, checkDbConnection } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const isDbConnected = await checkDbConnection();

    // ── Database-connected: real authentication ──────────────────────
    if (isDbConnected) {
      const user = await db.user.findUnique({ where: { email: cleanEmail } });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(cleanPassword, user.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // ── Database-offline: static bypass credentials only ─────────────
    // Static admin bypass
    if (cleanEmail === "admin@srichakrajewellers.com" && cleanPassword === "AdminPassword123") {
      const token = signToken({ id: "mock-admin-id", email: cleanEmail, role: "ADMIN", name: "Vasabattula Srinivasu" });
      const response = NextResponse.json({
        success: true,
        message: "Login successful (Offline Mode)",
        user: { id: "mock-admin-id", name: "Vasabattula Srinivasu", email: cleanEmail, role: "ADMIN" },
      });
      response.cookies.set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });
      return response;
    }

    // Static customer bypass
    if (cleanEmail === "customer@srichakrajewellers.com" && cleanPassword === "CustomerPassword123") {
      const token = signToken({ id: "mock-customer-id", email: cleanEmail, role: "CUSTOMER", name: "Demo Customer" });
      const response = NextResponse.json({
        success: true,
        message: "Login successful (Offline Mode)",
        user: { id: "mock-customer-id", name: "Demo Customer", email: cleanEmail, role: "CUSTOMER" },
      });
      response.cookies.set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });
      return response;
    }

    // If DB is offline and no bypass credentials, reject
    return NextResponse.json(
      { success: false, message: "Database is currently unavailable. Please try again later." },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during login" },
      { status: 500 }
    );
  }
}
