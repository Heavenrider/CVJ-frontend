import { NextResponse } from "next/server";
import { db, checkDbConnection } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, email, password" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const isDbConnected = await checkDbConnection();

    // ── Database-connected: real signup ──────────────────────────────
    if (isDbConnected) {
      const existingUser = await db.user.findUnique({ where: { email: cleanEmail } });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "This email is already registered. Please sign in." },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(cleanPassword, 10);

      const newUser = await db.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          passwordHash,
          phone: phone?.trim() || null,
          role: "CUSTOMER",
        },
      });

      const token = signToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      const response = NextResponse.json({
        success: true,
        message: "Account created successfully! Welcome to Sri Chakra Veeralakshmi Jewellery.",
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
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

    // ── Database-offline: mock signup fallback ────────────────────────
    const mockUser = {
      id: "mock-user-" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: cleanEmail,
      role: "CUSTOMER" as const,
    };

    const token = signToken({ id: mockUser.id, email: mockUser.email, role: mockUser.role, name: mockUser.name });

    const response = NextResponse.json({
      success: true,
      message: "Account created (Offline Mode — data not persisted)",
      user: mockUser,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during registration" },
      { status: 500 }
    );
  }
}
