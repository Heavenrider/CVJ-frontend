import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import * as bcrypt from "bcryptjs";

// Force this route to always be dynamic (never statically cached on Vercel)
export const dynamic = "force-dynamic";

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

    // ── Check if DATABASE_URL is configured at all ───────────────────
    const hasDb = !!process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("localhost") &&
      !process.env.DATABASE_URL.includes("postgres:postgres@localhost");

    // ── Try real database authentication ────────────────────────────
    if (hasDb) {
      try {
        const user = await Promise.race([
          db.user.findUnique({ where: { email: cleanEmail } }),
          new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error("DB_TIMEOUT")), 8000)
          ),
        ]) as any;

        if (!user) {
          return NextResponse.json(
            { success: false, message: "No account found with this email. Please sign up first." },
            { status: 401 }
          );
        }

        const isPasswordValid = await bcrypt.compare(cleanPassword, user.passwordHash);
        if (!isPasswordValid) {
          return NextResponse.json(
            { success: false, message: "Incorrect password. Please try again." },
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
      } catch (dbErr: any) {
        // DB timed out or errored — fall through to static bypass below
        console.error("DB login error:", dbErr?.message);
        if (dbErr?.message !== "DB_TIMEOUT") {
          // A real DB error (not just timeout) — report it
          return NextResponse.json(
            { success: false, message: "Login failed. Please try again in a moment." },
            { status: 503 }
          );
        }
        // If DB_TIMEOUT, fall through to static bypass
      }
    }

    // ── Static bypass credentials (when DB is offline / unconfigured) ─
    if (cleanEmail === "admin@srichakrajewellers.com" && cleanPassword === "AdminPassword123") {
      const token = signToken({ id: "mock-admin-id", email: cleanEmail, role: "ADMIN", name: "Vasabattula Srinivasu" });
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: { id: "mock-admin-id", name: "Vasabattula Srinivasu", email: cleanEmail, role: "ADMIN" },
      });
      response.cookies.set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });
      return response;
    }

    if (cleanEmail === "customer@srichakrajewellers.com" && cleanPassword === "CustomerPassword123") {
      const token = signToken({ id: "mock-customer-id", email: cleanEmail, role: "CUSTOMER", name: "Demo Customer" });
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: { id: "mock-customer-id", name: "Demo Customer", email: cleanEmail, role: "CUSTOMER" },
      });
      response.cookies.set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });
      return response;
    }

    // DB not configured and no bypass match
    return NextResponse.json(
      { success: false, message: hasDb ? "Login timed out. Please try again." : "Invalid credentials. Please check your email and password." },
      { status: 401 }
    );

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during login" },
      { status: 500 }
    );
  }
}
