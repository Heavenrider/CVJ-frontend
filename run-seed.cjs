/**
 * run-seed.cjs
 * Plain Node.js CommonJS script that seeds the Supabase database
 * without needing ts-node. Directly uses @prisma/client + bcryptjs.
 */

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Supabase database...\n");

  // ─── 1. Admin User ────────────────────────────────────────────────
  const adminEmail = "admin@srichakrajewellers.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("AdminPassword123", 10);
    await prisma.user.create({
      data: {
        name: "Vasabattula Srinivasu",
        email: adminEmail,
        passwordHash,
        phone: "9948625356",
        role: "ADMIN",
      },
    });
    console.log("✅ Created admin user:", adminEmail);
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  // ─── 2. Categories ────────────────────────────────────────────────
  const goldCategories = [
    { name: "Rings",       slug: "gold-rings"       },
    { name: "Chains",      slug: "gold-chains"      },
    { name: "Necklaces",   slug: "gold-necklaces"   },
    { name: "Earrings",    slug: "gold-earrings"    },
    { name: "Bangles",     slug: "gold-bangles"     },
    { name: "Bridal Sets", slug: "gold-bridal-sets" },
  ];
  const silverCategories = [
    { name: "Anklets",     slug: "silver-anklets"      },
    { name: "Chains",      slug: "silver-chains"       },
    { name: "Rings",       slug: "silver-rings"        },
    { name: "Pooja Items", slug: "silver-pooja-items"  },
    { name: "Idols",       slug: "silver-idols"        },
    { name: "Utensils",    slug: "silver-utensils"     },
  ];

  console.log("📁 Upserting categories...");
  const categoryMap = {};

  for (const cat of goldCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, metalType: "GOLD" },
    });
    categoryMap[cat.slug] = created.id;
  }

  for (const cat of silverCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, metalType: "SILVER" },
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✅ ${goldCategories.length + silverCategories.length} categories ready`);

  // ─── 3. Products ──────────────────────────────────────────────────
  const products = [
    {
      name: "Antique Kasu Mala Choker",
      description: "Generations-old royal South Indian kasu design, heavily detailed and hand-polished. Perfect choice for traditional brides looking for legacy heritage.",
      weight: 32.5, purity: "22K", metalType: "GOLD", makingChargesPerGram: 380, stockQuantity: 5,
      categorySlug: "gold-necklaces", imageType: "necklace",
    },
    {
      name: "Peacock Kada Bangle Set",
      description: "Exquisite set of interlocking solid gold bangles featuring detailed temple peacock carvings and secure royal clasp mechanism.",
      weight: 48.0, purity: "22K", metalType: "GOLD", makingChargesPerGram: 350, stockQuantity: 3,
      categorySlug: "gold-bangles", imageType: "bangles",
    },
    {
      name: "Maharani Polki Haram",
      description: "An absolute masterpiece. Elaborate bridal necklace set featuring polki setting, ruby drops, and intricately hand-coiled gold braids.",
      weight: 74.2, purity: "22K", metalType: "GOLD", makingChargesPerGram: 450, stockQuantity: 2,
      categorySlug: "gold-bridal-sets", imageType: "necklace",
    },
    {
      name: "Royal Diamond-Cut Ladies Ring",
      description: "Stunning 18K yellow gold band highlighting laser-cut geometric diamond patterns that capture light beautifully.",
      weight: 6.8, purity: "18K", metalType: "GOLD", makingChargesPerGram: 480, stockQuantity: 10,
      categorySlug: "gold-rings", imageType: "ring",
    },
    {
      name: "Classic Kemp Jhumka Earrings",
      description: "Traditional dome-shaped jhumkas set with synthetic red kemp stones, dropping gold bead accents, and comfortable screw backs.",
      weight: 18.5, purity: "22K", metalType: "GOLD", makingChargesPerGram: 400, stockQuantity: 7,
      categorySlug: "gold-earrings", imageType: "earrings",
    },
    {
      name: "Traditional Nakshi Pooja Diya",
      description: "Elegant pure silver deepam featuring detailed nakshi work around the base and central stand, perfect for daily pooja rituals.",
      weight: 120.0, purity: "Silver 99.9%", metalType: "SILVER", makingChargesPerGram: 18, stockQuantity: 15,
      categorySlug: "silver-pooja-items", imageType: "pooja",
    },
    {
      name: "Designer Floral Ghungroo Anklet",
      description: "Flexible double-strand silver anklet detailed with floral locks and small musical bells (ghungroos) that chime gently.",
      weight: 45.0, purity: "Silver 99.9%", metalType: "SILVER", makingChargesPerGram: 25, stockQuantity: 8,
      categorySlug: "silver-anklets", imageType: "anklet",
    },
    {
      name: "Blessing Lakshmi Ganesha Idols",
      description: "Pair of pure silver idols representing Lord Ganesha and Goddess Lakshmi in seated blessing postures.",
      weight: 180.0, purity: "Silver 99.9%", metalType: "SILVER", makingChargesPerGram: 30, stockQuantity: 4,
      categorySlug: "silver-idols", imageType: "idol",
    },
  ];

  console.log("💎 Upserting products...");
  for (const prod of products) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) { console.warn(`  ⚠️  Category ${prod.categorySlug} not found, skipping`); continue; }
    const seedId = `seed-${prod.name.toLowerCase().replace(/\s+/g, "-")}`;
    await prisma.product.upsert({
      where:  { id: seedId },
      update: { categoryId, weight: prod.weight, purity: prod.purity, makingChargesPerGram: prod.makingChargesPerGram, stockQuantity: prod.stockQuantity },
      create: {
        id: seedId, name: prod.name, description: prod.description,
        weight: prod.weight, purity: prod.purity, metalType: prod.metalType,
        makingChargesPerGram: prod.makingChargesPerGram, stockQuantity: prod.stockQuantity,
        images: [`/assets/silhouette-${prod.imageType}.jpg`],
        categoryId, availability: true,
      },
    });
  }
  console.log(`✅ ${products.length} products ready`);

  // ─── 4. Testimonials ──────────────────────────────────────────────
  const testimonials = [
    {
      name: "Koppisetti Lakshmi", location: "Alamuru", rating: 5,
      review: "We purchased our daughter's complete bridal set from Sri Chakra Veeralakshmi Jewellery. Srinivasu garu gave us the best price in the market. The transparency in weight and making charges is what makes them different from big showrooms. Best quality gold!",
      designPurchased: "Traditional Bridal Haram & Vanki",
    },
    {
      name: "Satyanarayana Murthy V.", location: "Mandapeta", rating: 5,
      review: "I have been buying gold coins and custom silver articles for family occasions here for the last 15 years. Srinivasu's handcrafting is outstanding. Extremely honest person, highly recommended for pure BIS 916 gold.",
      designPurchased: "Custom Silver Pooja Plate & Idols",
    },
    {
      name: "Priya Reddy", location: "Kakinada", rating: 5,
      review: "Bought a beautiful set of gold bangles for my wedding. The craftsmanship is exquisite and the price was very reasonable. Will definitely come back for more!",
      designPurchased: "Peacock Kada Bangle Set",
    },
    {
      name: "Ramesh Babu", location: "Rajahmundry", rating: 5,
      review: "Excellent quality and very transparent pricing. The making charges are clearly explained. My family has been their loyal customer for over 20 years.",
      designPurchased: "Gold Chain & Pendant",
    },
  ];

  console.log("⭐ Upserting testimonials...");
  // Upsert by name+location to avoid duplicates on re-seed
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, location: t.location } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log(`✅ Testimonials ready`);

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
