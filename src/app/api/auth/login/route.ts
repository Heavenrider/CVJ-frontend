import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import * as bcrypt from "bcryptjs";

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

    let user;
    try {
      user = await db.user.findUnique({ where: { email: cleanEmail } });
    } catch (dbErr: any) {
      console.error("Login DB error:", dbErr.message);
      return NextResponse.json(
        { success: false, message: "Unable to connect to the database. Please try again." },
        { status: 503 }
      );
    }

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
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during login" },
      { status: 500 }
    );
  }
}
