"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MessageSquare, Eye, Sparkles, Scale, Info, ShoppingCart, Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Product {
  id: string;
  name: string;
  metalType: "GOLD" | "SILVER";
  category: { name: string; slug: string };
  purity: string; // "22K", "24K", etc.
  weight: number; // in grams
  makingChargesPerGram: number; // in INR
  images: string[];
  description: string;
  availability: boolean;
  stockQuantity: number;
}

// Custom SVGs representing luxury jewellery silhouettes
function JewelleryIcon({ type }: { type: string }) {
  const goldGradient = "url(#cat-gold-grad)";
  const silverGradient = "url(#cat-silver-grad)";
  const color = type.includes("silver") || type.includes("pooja") || type.includes("idol") || type.includes("utensils") || type.includes("anklet")
    ? silverGradient
    : goldGradient;
  
  return (
    <svg className="w-24 h-24 stroke-primary-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cat-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#E8C76A" />
          <stop offset="100%" stopColor="#B89020" />
        </linearGradient>
        <linearGradient id="cat-silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C0C0C0" />
          <stop offset="50%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
      </defs>
      {type.includes("necklace") && (
        <>
          <path d="M20,30 C20,70 80,70 80,30" stroke={color} strokeWidth="2" strokeDasharray="3,3" />
          <path d="M25,35 C25,65 75,65 75,35" stroke={color} strokeWidth="1.5" />
          <path d="M30,40 C30,60 70,60 70,40" stroke={color} strokeWidth="3" />
          <circle cx="50" cy="60" r="5" fill="#6D001A" stroke={color} strokeWidth="1" />
          <path d="M50,65 L50,73 L47,70" stroke={color} strokeWidth="1.5" />
        </>
      )}
      {type.includes("ring") && (
        <>
          <circle cx="50" cy="60" r="22" stroke={color} strokeWidth="3" />
          <path d="M50,38 L42,30 L50,22 L58,30 Z" fill={color} stroke={color} strokeWidth="1" />
          <circle cx="50" cy="30" r="4" fill="#FAF9F6" />
        </>
      )}
      {type.includes("earrings") && (
        <>
          <circle cx="35" cy="30" r="3" fill={color} />
          <path d="M35,33 L35,45" stroke={color} strokeWidth="1.5" />
          <path d="M25,45 L45,45 L35,62 Z" stroke={color} strokeWidth="2" />
        </>
      )}
      {(!type.includes("necklace") && !type.includes("ring") && !type.includes("earrings")) && (
        <>
          <ellipse cx="50" cy="45" rx="35" ry="12" stroke={color} strokeWidth="3" />
          <ellipse cx="50" cy="55" rx="35" ry="12" stroke={color} strokeWidth="2.5" />
        </>
      )}
    </svg>
  );
}

interface LiveRatesData {
  gold24k: { rate: number };
  gold22k: { rate: number };
  silver: { rate: number };
  timestamp: string;
}

interface ProductCatalogProps {
  rates: LiveRatesData | null;
  onSelectProduct: (product: any, computedPrice: number) => void;
}

const MOCK_PRODUCTS: Product[] = [
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
    category: { name: "Necklaces", slug: "gold-necklaces" }
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
    category: { name: "Bangles", slug: "gold-bangles" }
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
    category: { name: "Bridal Sets", slug: "gold-bridal-sets" }
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
    category: { name: "Rings", slug: "gold-rings" }
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
    stockQuantity: 7,
    category: { name: "Earrings", slug: "gold-earrings" }
  },
  {
    id: "mock-6",
    name: "Nakshi Pooja Diya",
    description: "Elegant pure silver deepam featuring detailed nakshi work around the base and central stand, perfect for daily pooja rituals.",
    weight: 120.0,
    purity: "Silver 99.9%",
    metalType: "SILVER",
    makingChargesPerGram: 18,
    images: ["/assets/silhouette-pooja.jpg"],
    availability: true,
    stockQuantity: 15,
    category: { name: "Pooja Items", slug: "silver-pooja-items" }
  },
  {
    id: "mock-7",
    name: "Floral Ghungroo Anklet",
    description: "Flexible double-strand silver anklet detailed with floral locks and small musical bells (ghungroos) that chime gently.",
    weight: 45.0,
    purity: "Silver 99.9%",
    metalType: "SILVER",
    makingChargesPerGram: 25,
    images: ["/assets/silhouette-anklet.jpg"],
    availability: true,
    stockQuantity: 8,
    category: { name: "Anklets", slug: "silver-anklets" }
  },
  {
    id: "mock-8",
    name: "Lakshmi Ganesha Idols",
    description: "Pair of pure silver idols representing Lord Ganesha and Goddess Lakshmi in seated blessing postures.",
    weight: 180.0,
    purity: "Silver 99.9%",
    metalType: "SILVER",
    makingChargesPerGram: 30,
    images: ["/assets/silhouette-idol.jpg"],
    availability: true,
    stockQuantity: 4,
    category: { name: "Idols", slug: "silver-idols" }
  }
];

function ProductImage({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = product.images && product.images[0];
  const isPlaceholder = !imageUrl || imageUrl.includes("silhouette");

  if (isPlaceholder || imageError) {
    return <JewelleryIcon type={product.name.toLowerCase()} />;
  }

  return (
    <img
      src={imageUrl}
      alt={product.name}
      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
      onError={() => setImageError(true)}
    />
  );
}

export default function ProductCatalog({ rates, onSelectProduct }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetal, setActiveMetal] = useState<"gold" | "silver">("gold");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const metalParam = activeMetal === "gold" ? "GOLD" : "SILVER";
      const res = await fetch(`/api/products?metal=${metalParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
          return;
        }
      }
      // Fallback if API is unreachable or returned empty database
      const fallback = MOCK_PRODUCTS.filter(p => p.metalType === (activeMetal === "gold" ? "GOLD" : "SILVER"));
      setProducts(fallback);
    } catch (err) {
      console.error("Failed to load products, using local fallback:", err);
      const fallback = MOCK_PRODUCTS.filter(p => p.metalType === (activeMetal === "gold" ? "GOLD" : "SILVER"));
      setProducts(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeMetal]);

  // Default fallback rates
  const rates24K = rates?.gold24k?.rate || 7450;
  const rates22K = rates?.gold22k?.rate || 6830;
  const rates18K = rates22K * 18 / 22;
  const ratesSilver = rates?.silver?.rate || 92.5;

  const getMetalRate = (purity: string) => {
    switch (purity) {
      case "24K": return rates24K;
      case "22K": return rates22K;
      case "18K": return rates18K;
      case "Silver 99.9%": return ratesSilver;
      default: return rates22K;
    }
  };

  // Pricing Engine Formula: Price = (Metal Rate * Weight) + Making Charges + GST (3%)
  const calculateProductPrice = (product: Product) => {
    const metalRate = getMetalRate(product.purity);
    const metalCost = metalRate * product.weight;
    const makingCost = product.makingChargesPerGram * product.weight;
    const subtotal = metalCost + makingCost;
    const gst = subtotal * 0.03;
    return Math.round(subtotal + gst);
  };

  const handleAddToCart = async (productId: string) => {
    setAddingToCartId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Dispatch custom events to trigger header Navbar updates
        window.dispatchEvent(new Event("cart-updated"));
        alert("Product added to shopping bag successfully!");
      } else {
        alert(data.message || "Please log in to add products to your cart.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.dispatchEvent(new Event("wishlist-updated"));
        alert("Product added to wishlist!");
      } else {
        alert(data.message || "Please log in to manage your wishlist.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter dynamic categories based on loaded product array
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category.name)))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="collections" className="py-24 bg-luxury-black text-ivory-white relative">
      
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-royal-burgundy/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-cormorant text-lg italic tracking-widest text-primary-gold font-semibold">
            Signature Creations
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide mt-1 mb-4">
            Our Masterpiece Collections
          </h2>
          <div className="w-20 h-[1px] bg-primary-gold mx-auto mb-4" />
          <p className="font-poppins text-xs sm:text-sm text-ivory-white/60 tracking-wider">
            Explore our curated selection of fine gold ornaments and pure silver articles, each hallmarked and calculated with dynamic pricing.
          </p>
        </div>

        {/* Metal Selection Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#141414] p-1 border border-primary-gold/20 rounded-md flex gap-2">
            <button
              onClick={() => { setActiveMetal("gold"); setSelectedCategory("All"); }}
              className={`font-montserrat text-xs uppercase font-bold tracking-widest py-3 px-8 rounded-sm transition-all cursor-pointer ${
                activeMetal === "gold" ? "bg-primary-gold text-luxury-black shadow-md" : "text-ivory-white/70 hover:bg-white/5"
              }`}
            >
              Gold Jewellery
            </button>
            <button
              onClick={() => { setActiveMetal("silver"); setSelectedCategory("All"); }}
              className={`font-montserrat text-xs uppercase font-bold tracking-widest py-3 px-8 rounded-sm transition-all cursor-pointer ${
                activeMetal === "silver" ? "bg-primary-gold text-luxury-black shadow-md" : "text-ivory-white/70 hover:bg-white/5"
              }`}
            >
              Silver Jewellery
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-[#141414]/60 border border-white/5 p-6 rounded-md mb-10 flex flex-col lg:flex-row justify-between gap-6 items-center">
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/40">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder={`Search ${activeMetal} collections...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-montserrat text-[10px] uppercase font-semibold tracking-wider px-4 py-2 rounded-sm border shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat ? "bg-royal-burgundy border-primary-gold text-primary-gold" : "bg-luxury-black/60 border-white/10 text-ivory-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary-gold animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const computedPrice = calculateProductPrice(product);
                const isGold = product.metalType === "GOLD";
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={product.id}
                    className="bg-[#141414] border border-white/5 rounded-sm overflow-hidden flex flex-col justify-between hover:border-primary-gold/30 transition-all duration-500 group relative"
                  >
                    
                    {/* Silhouette Box */}
                    <div className="relative w-full aspect-square bg-gradient-to-b from-[#1c1c1c] to-[#141414] flex items-center justify-center p-8 border-b border-white/5 overflow-hidden">
                      <div className="absolute top-4 right-4 bg-luxury-black/85 border border-primary-gold/30 text-champagne-gold font-montserrat text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm">
                        {product.purity}
                      </div>

                      <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                        <ProductImage product={product} />
                      </div>

                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-ivory-white/40 text-[10px] font-poppins">
                        <Scale size={11} className="text-primary-gold/70" />
                        <span>{product.weight}g</span>
                      </div>

                      {/* Wishlist Shortcut overlay */}
                      <button
                        onClick={() => handleAddToWishlist(product.id)}
                        className="absolute top-4 left-4 p-2 bg-luxury-black/60 hover:bg-royal-burgundy/80 text-ivory-white hover:text-primary-gold rounded-full border border-white/5 hover:border-primary-gold/30 transition-all cursor-pointer"
                        title="Add to Wishlist"
                      >
                        <Heart size={12} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-cormorant text-xs italic tracking-widest text-primary-gold uppercase font-semibold">
                          {product.category.name}
                        </span>
                        <h3 className="font-playfair text-base sm:text-lg font-semibold text-ivory-white tracking-wide mt-1 mb-2">
                          {product.name}
                        </h3>
                        <p className="font-poppins text-xs text-ivory-white/60 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing Display */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-baseline justify-between">
                        <div className="flex flex-col">
                          <span className="font-montserrat text-[9px] uppercase tracking-wider text-ivory-white/30">Estimated Price</span>
                          <span className="font-playfair text-xl font-bold text-champagne-gold mt-1">
                            {formatCurrency(computedPrice)}
                          </span>
                        </div>
                        <button
                          onClick={() => onSelectProduct(product, computedPrice)}
                          className="flex items-center gap-1 text-[9px] font-poppins text-ivory-white/45 hover:text-primary-gold transition-colors"
                        >
                          <Info size={11} className="text-primary-gold" />
                          <span className="underline decoration-dotted">Breakdown</span>
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 border-t border-white/5 bg-[#0e0e0e]">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCartId === product.id}
                        className="py-4 text-center font-montserrat text-[9px] uppercase font-bold tracking-widest text-ivory-white hover:text-primary-gold hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 border-r border-white/5 cursor-pointer disabled:opacity-50"
                      >
                        <ShoppingCart size={11} />
                        <span>Add to Bag</span>
                      </button>
                      
                      <a
                        href={`https://wa.me/919948625356?text=${encodeURIComponent(`Hello Sri Chakra Veeralakshmi Jewellery, I am interested in inquiring about: ${product.name} (${product.weight}g, ${product.purity}). Estimated: ${formatCurrency(computedPrice)}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-4 text-center font-montserrat text-[9px] uppercase font-bold tracking-widest text-primary-gold hover:text-luxury-black hover:bg-primary-gold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare size={11} className="fill-current" />
                        <span>Enquiry</span>
                      </a>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
}
