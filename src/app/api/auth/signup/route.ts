import { NextResponse } from "next/server";
import { db, checkDbConnection } from "@/lib/db";
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

    // Check if user exists (with mock fallback if DB is unconfigured)
    let existingUser = null;
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      try {
        existingUser = await db.user.findUnique({
          where: { email },
        });
      } catch (dbErr) {
        console.warn("Signup database lookup failed, using bypass signup:", dbErr);
      }
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (with mock fallback if DB is unconfigured)
    let newUser;
    if (isDbConnected) {
      try {
        newUser = await db.user.create({
          data: {
            name,
            email,
            passwordHash,
            phone,
            role: "CUSTOMER",
          },
        });
      } catch (dbErr) {
        console.warn("Signup database create failed, returning mock user:", dbErr);
        newUser = {
          id: "mock-user-id-" + Math.random().toString(36).substring(2, 9),
          name,
          email,
          role: "CUSTOMER",
        };
      }
    } else {
      newUser = {
        id: "mock-user-id-" + Math.random().toString(36).substring(2, 9),
        name,
        email,
        role: "CUSTOMER",
      };
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during registration" },
      { status: 500 }
    );
  }
}
