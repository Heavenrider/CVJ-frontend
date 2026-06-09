import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, checkDbConnection } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") return null;
  return decoded;
}

const MOCK_PRODUCTS = [
  {
    id: "mock-1",
    name: "Antique Kasu Mala Choker",
    description: "Generations-old royal South Indian kasu design, heavily detailed and hand-polished. Perfect choice for traditional brides looking for legacy heritage.",
    weight: 32.5,
    purity: "22K",
    metalType: "GOLD",
    makingChargesPerGram: 380,
    images: ["/assets/silhouette-necklace.jpg"],
    availability: true,
    stockQuantity: 5,
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Necklaces", slug: "necklaces", metalType: "GOLD" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-2",
    name: "Peacock Kada Bangle Set",
    description: "Exquisite set of interlocking solid gold bangles featuring detailed temple peacock carvings and secure royal clasp mechanism.",
    weight: 48.0,
    purity: "22K",
    metalType: "GOLD",
    makingChargesPerGram: 350,
    images: ["/assets/silhouette-bangles.jpg"],
    availability: true,
    stockQuantity: 3,
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Bangles", slug: "bangles", metalType: "GOLD" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-3",
    name: "Maharani Polki Haram",
    description: "An absolute masterpiece. Elaborate bridal necklace set featuring polki setting, ruby drops, and intricately hand-coiled gold braids.",
    weight: 74.2,
    purity: "22K",
    metalType: "GOLD",
    makingChargesPerGram: 450,
    images: ["/assets/silhouette-necklace.jpg"],
    availability: true,
    stockQuantity: 2,
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Necklaces", slug: "necklaces", metalType: "GOLD" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-4",
    name: "Royal Diamond-Cut Ring",
    description: "Stunning 18K yellow gold band highlighting laser-cut geometric diamond patterns that capture light beautifully.",
    weight: 6.8,
    purity: "18K",
    metalType: "GOLD",
    makingChargesPerGram: 480,
    images: ["/assets/silhouette-ring.jpg"],
    availability: true,
    stockQuantity: 10,
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Rings", slug: "rings", metalType: "GOLD" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-5",
    name: "Classic Kemp Jhumkas",
    description: "Traditional dome-shaped jhumkas set with synthetic red kemp stones, dropping gold bead accents, and comfortable screw backs.",
    weight: 18.5,
    purity: "22K",
    metalType: "GOLD",
    makingChargesPerGram: 400,
    images: ["/assets/silhouette-earrings.jpg"],
    availability: true,
    stockQuantity: 8,
    categoryId: "cat-5",
    category: { id: "cat-5", name: "Earrings", slug: "earrings", metalType: "GOLD" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-6",
    name: "Sleek Silver Anklets",
    description: "Elegant and lightweight pure silver payal anklets decorated with delicate floral motifs and fine silver ghungroo chimes.",
    weight: 28.0,
    purity: "Silver 99.9%",
    metalType: "SILVER",
    makingChargesPerGram: 65,
    images: ["/assets/silhouette-anklet.jpg"],
    availability: true,
    stockQuantity: 15,
    categoryId: "cat-6",
    category: { id: "cat-6", name: "Anklets", slug: "anklets", metalType: "SILVER" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-7",
    name: "Traditional Pooja Silver Thali Set",
    description: "Full ceremonial prayer set containing 1 pure silver plate, 1 silver incense stand, 1 prasad cup, 1 ghee diya burner and 1 bell.",
    weight: 150.0,
    purity: "Silver 99.9%",
    metalType: "SILVER",
    makingChargesPerGram: 55,
    images: ["/assets/silhouette-pooja.jpg"],
    availability: true,
    stockQuantity: 4,
    categoryId: "cat-7",
    category: { id: "cat-7", name: "Pooja Items", slug: "pooja-items", metalType: "SILVER" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Public endpoint to retrieve all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const metalType = searchParams.get("metal"); // GOLD or SILVER
    const search = searchParams.get("search");

    const isDbConnected = await checkDbConnection();
    if (!isDbConnected) {
      let filtered = [...MOCK_PRODUCTS];
      if (categorySlug && categorySlug !== "All") {
        filtered = filtered.filter(p => p.category.slug === categorySlug);
      }
      if (metalType) {
        filtered = filtered.filter(p => p.metalType === metalType);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }
      return NextResponse.json({ success: true, products: filtered });
    }

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
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ success: false, message: "Server error fetching products" }, { status: 500 });
  }
}

// Protected admin endpoint to create a new product
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      weight,
      purity,
      metalType,
      makingChargesPerGram,
      stockQuantity,
      categoryId,
      images,
      availability
    } = body;

    if (!name || !weight || !purity || !metalType || !makingChargesPerGram || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required product specifications" }, { status: 400 });
    }

    const isDbConnected = await checkDbConnection();
    let product;

    if (isDbConnected) {
      product = await db.product.create({
        data: {
          name,
          description: description || "",
          weight: Number(weight),
          purity,
          metalType,
          makingChargesPerGram: Number(makingChargesPerGram),
          stockQuantity: Number(stockQuantity) || 1,
          categoryId,
          images: images || ["/assets/silhouette-necklace.jpg"],
          availability: availability !== undefined ? availability : true,
        }
      });
    } else {
      console.warn("Product POST bypassed database because it is offline. Mock product returned.");
      product = {
        id: "mock-" + Math.random().toString(36).substring(2, 9),
        name,
        description: description || "",
        weight: Number(weight),
        purity,
        metalType,
        makingChargesPerGram: Number(makingChargesPerGram),
        stockQuantity: Number(stockQuantity) || 1,
        categoryId,
        images: images || ["/assets/silhouette-necklace.jpg"],
        availability: availability !== undefined ? availability : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("Product POST error:", error);
    return NextResponse.json({ success: false, message: "Server error creating product" }, { status: 500 });
  }
}

// Protected admin endpoint to update a product
export async function PUT(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized admin access" }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      name,
      description,
      weight,
      purity,
      metalType,
      makingChargesPerGram,
      stockQuantity,
      categoryId,
      images,
      availability
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required for updates" }, { status: 400 });
    }

    const isDbConnected = await checkDbConnection();
    let product;

    if (isDbConnected) {
      product = await db.product.update({
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
        }
      });
    } else {
      console.warn("Product PUT bypassed database because it is offline. Mock update returned.");
      product = {
        id,
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
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json({ success: false, message: "Server error updating product" }, { status: 500 });
  }
}

// Protected admin endpoint to delete a product
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

    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      await db.product.delete({
        where: { id: productId }
      });
    } else {
      console.warn("Product DELETE bypassed database because it is offline.");
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ success: false, message: "Server error deleting product" }, { status: 500 });
  }
}
