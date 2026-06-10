import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin User
  const adminEmail = "admin@srichakrajewellers.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

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
    console.log("Created admin user:", adminEmail);
  } else {
    console.log("Admin user already exists");
  }

  // 2. Define Gold & Silver Categories
  const goldCategories = [
    { name: "Rings", slug: "gold-rings" },
    { name: "Chains", slug: "gold-chains" },
    { name: "Necklaces", slug: "gold-necklaces" },
    { name: "Earrings", slug: "gold-earrings" },
    { name: "Bangles", slug: "gold-bangles" },
    { name: "Bridal Sets", slug: "gold-bridal-sets" },
  ];

  const silverCategories = [
    { name: "Anklets", slug: "silver-anklets" },
    { name: "Chains", slug: "silver-chains" },
    { name: "Rings", slug: "silver-rings" },
    { name: "Pooja Items", slug: "silver-pooja-items" },
    { name: "Idols", slug: "silver-idols" },
    { name: "Utensils", slug: "silver-utensils" },
  ];

  console.log("Creating categories...");
  const categoryMap: { [slug: string]: string } = {};

  for (const cat of goldCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        metalType: "GOLD",
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  for (const cat of silverCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        metalType: "SILVER",
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  // 3. Create Default Products
  console.log("Creating default products...");
  const products = [
    {
      name: "Antique Kasu Mala Choker",
      description: "Generations-old royal South Indian kasu design, heavily detailed and hand-polished. Perfect choice for traditional brides looking for legacy heritage.",
      weight: 32.5,
      purity: "22K",
      metalType: "GOLD" as const,
      makingChargesPerGram: 380,
      stockQuantity: 5,
      categorySlug: "gold-necklaces",
      imageUrl: "/assets/kasu-choker.png",
    },
    {
      name: "Peacock Kada Bangle Set",
      description: "Exquisite set of interlocking solid gold bangles featuring detailed temple peacock carvings and secure royal clasp mechanism.",
      weight: 48.0,
      purity: "22K",
      metalType: "GOLD" as const,
      makingChargesPerGram: 350,
      stockQuantity: 3,
      categorySlug: "gold-bangles",
      imageUrl: "/assets/peacock-kada.png",
    },
    {
      name: "Maharani Polki Haram",
      description: "An absolute masterpiece. Elaborate bridal necklace set featuring polki setting, ruby drops, and intricately hand-coiled gold braids.",
      weight: 74.2,
      purity: "22K",
      metalType: "GOLD" as const,
      makingChargesPerGram: 450,
      stockQuantity: 2,
      categorySlug: "gold-bridal-sets",
      imageUrl: "/assets/polki-haram.png",
    },
    {
      name: "Royal Diamond-Cut Ladies Ring",
      description: "Stunning 18K yellow gold band highlighting laser-cut geometric diamond patterns that capture light beautifully.",
      weight: 6.8,
      purity: "18K",
      metalType: "GOLD" as const,
      makingChargesPerGram: 480,
      stockQuantity: 10,
      categorySlug: "gold-rings",
      imageUrl: "/assets/gold-ring.png",
    },
    {
      name: "Classic Kemp Jhumka Earrings",
      description: "Traditional dome-shaped jhumkas set with synthetic red kemp stones, dropping gold bead accents, and comfortable screw backs.",
      weight: 18.5,
      purity: "22K",
      metalType: "GOLD" as const,
      makingChargesPerGram: 400,
      stockQuantity: 7,
      categorySlug: "gold-earrings",
      imageUrl: "/assets/kemp-jhumka.png",
    },
    {
      name: "Traditional Nakshi Pooja Diya",
      description: "Elegant pure silver deepam featuring detailed nakshi work around the base and central stand, perfect for daily pooja rituals.",
      weight: 120.0,
      purity: "Silver 99.9%",
      metalType: "SILVER" as const,
      makingChargesPerGram: 18,
      stockQuantity: 15,
      categorySlug: "silver-pooja-items",
      imageUrl: "/assets/pooja-diya.png",
    },
    {
      name: "Designer Floral Ghungroo Anklet",
      description: "Flexible double-strand silver anklet detailed with floral locks and small musical bells (ghungroos) that chime gently.",
      weight: 45.0,
      purity: "Silver 99.9%",
      metalType: "SILVER" as const,
      makingChargesPerGram: 25,
      stockQuantity: 8,
      categorySlug: "silver-anklets",
      imageUrl: "/assets/silver-anklet.png",
    },
    {
      name: "Blessing Lakshmi Ganesha Idols",
      description: "Pair of pure silver idols representing Lord Ganesha and Goddess Lakshmi in seated blessing postures.",
      weight: 180.0,
      purity: "Silver 99.9%",
      metalType: "SILVER" as const,
      makingChargesPerGram: 30,
      stockQuantity: 4,
      categorySlug: "silver-idols",
      imageUrl: "/assets/lakshmi-ganesha.png",
    },
  ];

  for (const prod of products) {
    const categoryId = categoryMap[prod.categorySlug];
    if (categoryId) {
      await prisma.product.upsert({
        where: { id: `seed-${prod.name.toLowerCase().replace(/\s+/g, "-")}` }, // deterministic id to prevent dupes on re-seed
        update: {
          categoryId,
          weight: prod.weight,
          purity: prod.purity,
          makingChargesPerGram: prod.makingChargesPerGram,
          stockQuantity: prod.stockQuantity,
          images: [prod.imageUrl], // Ensure images get updated
        },
        create: {
          id: `seed-${prod.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: prod.name,
          description: prod.description,
          weight: prod.weight,
          purity: prod.purity,
          metalType: prod.metalType,
          makingChargesPerGram: prod.makingChargesPerGram,
          stockQuantity: prod.stockQuantity,
          images: [prod.imageUrl],
          categoryId,
          availability: true,
        },
      });
    }
  }

  // 4. Create Seed Testimonials
  console.log("Creating default testimonials...");
  const testimonials = [
    {
      name: "Koppisetti Lakshmi",
      location: "Alamuru",
      rating: 5,
      review: "We purchased our daughter's complete bridal set from Sri Chakra Veeralakshmi Jewellery. Srinivasu garu gave us the best price in the market. The transparency in weight and making charges is what makes them different from big showrooms. Best quality gold!",
      designPurchased: "Traditional Bridal Haram & Vanki",
    },
    {
      name: "Satyanarayana Murthy V.",
      location: "Mandapeta",
      rating: 5,
      review: "I have been buying gold coins and custom silver articles for family occasions here for the last 15 years. Srinivasu's handcrafting is outstanding. Extremely honest person, highly recommended for pure BIS 916 gold.",
      designPurchased: "Custom Silver Pooja Plate & Idols",
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        location: t.location,
        rating: t.rating,
        review: t.review,
        designPurchased: t.designPurchased,
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
