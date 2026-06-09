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

export async function GET() {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        orders: {
          include: {
            items: {
              include: {
                product: { select: { name: true, images: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        wishlist: {
          include: { product: true },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: userProfile });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ success: false, message: "Server error retrieving profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAuthUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { name, phone, addressAction, addressData } = data;

    // Update basic profile info
    if (name || phone) {
      await db.user.update({
        where: { id: session.id },
        data: {
          name: name || undefined,
          phone: phone || undefined,
        },
      });
    }

    // Manage addresses
    if (addressAction && addressData) {
      if (addressAction === "create") {
        if (addressData.isDefault) {
          await db.address.updateMany({
            where: { userId: session.id },
            data: { isDefault: false },
          });
        }
        await db.address.create({
          data: {
            userId: session.id,
            name: addressData.name,
            phone: addressData.phone,
            street: addressData.street,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode,
            country: addressData.country || "India",
            isDefault: addressData.isDefault || false,
            type: addressData.type || "SHIPPING",
          },
        });
      } else if (addressAction === "update" && addressData.id) {
        if (addressData.isDefault) {
          await db.address.updateMany({
            where: { userId: session.id },
            data: { isDefault: false },
          });
        }
        await db.address.update({
          where: { id: addressData.id, userId: session.id },
          data: {
            name: addressData.name,
            phone: addressData.phone,
            street: addressData.street,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode,
            country: addressData.country,
            isDefault: addressData.isDefault,
            type: addressData.type,
          },
        });
      } else if (addressAction === "delete" && addressData.id) {
        await db.address.delete({
          where: { id: addressData.id, userId: session.id },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating profile" }, { status: 500 });
  }
}
