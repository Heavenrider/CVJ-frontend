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

// GET — public: list all products with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const metalType = searchParams.get("metal");
    const search = searchParams.get("search");

    const filters: any = {};

    if (categorySlug && categorySlug !== "All") {
      filters.category = { slug: categorySlug };
    }
    if (metalType) {
      filters.metalType = metalType;
    }
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await db.product.findMany({
      where: filters,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching products" }, { status: 500 });
  }
}

// POST — admin: create product
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, weight, purity, metalType, makingChargesPerGram, stockQuantity, categoryId, images, availability } = body;

    if (!name || !weight || !purity || !metalType || !makingChargesPerGram || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required product fields" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || "",
        weight: Number(weight),
        purity,
        metalType,
        makingChargesPerGram: Number(makingChargesPerGram),
        stockQuantity: Number(stockQuantity) || 1,
        categoryId,
        images: images || [],
        availability: availability !== undefined ? availability : true,
      },
    });

    return NextResponse.json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ success: false, message: "Server error creating product" }, { status: 500 });
  }
}

// PUT — admin: update product
export async function PUT(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, description, weight, purity, metalType, makingChargesPerGram, stockQuantity, categoryId, images, availability } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required for updates" }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        weight: weight ? Number(weight) : undefined,
        purity,
        metalType,
        makingChargesPerGram: makingChargesPerGram ? Number(makingChargesPerGram) : undefined,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : undefined,
        categoryId,
        images,
        availability,
      },
    });

    return NextResponse.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("Products PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating product" }, { status: 500 });
  }
}

// DELETE — admin: delete product
export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID required for deletion" }, { status: 400 });
    }

    await db.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json({ success: false, message: "Server error deleting product" }, { status: 500 });
  }
}
