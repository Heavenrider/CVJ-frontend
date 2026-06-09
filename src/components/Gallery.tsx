"use client";

import { useState } from "react";
import { X, ZoomIn, Eye, Sparkles, Hammer, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: string;
  title: string;
  category: "Gold Jewellery" | "Silver Jewellery" | "Shop Images" | "Craftsmanship";
  aspect: "aspect-square" | "aspect-[3/4]" | "aspect-[4/3]";
  description: string;
  imageType: "necklace" | "rings" | "process" | "shop" | "pooja" | "melt";
}

// 8 Gallery Items with different aspects for true masonry look
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g_item1",
    title: "Handcrafting Gold Wire",
    category: "Craftsmanship",
    aspect: "aspect-[3/4]",
    description: "Our senior artisans drawing fine 22K gold wire for filigree work.",
    imageType: "process",
  },
  {
    id: "g_item2",
    title: "Premium Gold Wedding Haram",
    category: "Gold Jewellery",
    aspect: "aspect-square",
    description: "Detailed heavy haram highlighting intricate South Indian nakshi work.",
    imageType: "necklace",
  },
  {
    id: "g_item3",
    title: "Store Showcase Vitrines",
    category: "Shop Images",
    aspect: "aspect-[4/3]",
    description: "Sri Chakra Veeralakshmi showroom layout in Alamuru featuring high-security luxury display cases.",
    imageType: "shop",
  },
  {
    id: "g_item4",
    title: "Pure Silver Pooja Set",
    category: "Silver Jewellery",
    aspect: "aspect-square",
    description: "Collection of pure silver diyas, incense stands, and traditional offering cups.",
    imageType: "pooja",
  },
  {
    id: "g_item5",
    title: "Goldsmith Melting Crucible",
    category: "Craftsmanship",
    aspect: "aspect-[3/4]",
    description: "High-temperature melting process of raw gold before pouring into customized ingot moulds.",
    imageType: "melt",
  },
  {
    id: "g_item6",
    title: "Stunning Diamond-Cut Bangles",
    category: "Gold Jewellery",
    aspect: "aspect-[4/3]",
    description: "Dynamic diamond-cut finish on solid 22K bangles, capturing light as they turn.",
    imageType: "rings",
  },
  {
    id: "g_item7",
    title: "Consultation Lounge",
    category: "Shop Images",
    aspect: "aspect-square",
    description: "Our premium guest seating area where designs are customized with customers.",
    imageType: "shop",
  },
  {
    id: "g_item8",
    title: "Custom Pendant Assembly",
    category: "Craftsmanship",
    aspect: "aspect-[4/3]",
    description: "Fine assembly work of gemstone studs onto a personalized deity pendant.",
    imageType: "process",
  },
];

// Helper visual icons for gallery vectors
function GalleryVector({ type }: { type: string }) {
  const goldGrad = "url(#gal-gold)";
  const silverGrad = "url(#gal-silver)";
  
  if (type === "necklace") {
    return (
      <svg className="w-28 h-28 stroke-primary-gold" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="gal-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#6D001A" />
          </linearGradient>
        </defs>
        <path d="M15,20 C15,75 85,75 85,20" stroke={goldGrad} strokeWidth="3" />
        <path d="M25,30 C25,65 75,65 75,30" stroke={goldGrad} strokeWidth="1.5" />
        <circle cx="50" cy="58" r="5" fill="#6D001A" stroke={goldGrad} />
        <circle cx="41" cy="54" r="3.5" fill={goldGrad} />
        <circle cx="59" cy="54" r="3.5" fill={goldGrad} />
      </svg>
    );
  }

  if (type === "pooja") {
    return (
      <svg className="w-28 h-28 stroke-ivory-white" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="gal-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E0E0" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="65" rx="35" ry="12" stroke={silverGrad} strokeWidth="2.5" />
        <path d="M50,45 C42,45 42,55 50,55 C58,55 58,45 50,45 Z" stroke={silverGrad} strokeWidth="2" />
        <path d="M50,45 C48,40 50,30 50,30 C50,30 52,40 50,45 Z" fill="#E8C76A" />
      </svg>
    );
  }

  if (type === "process") {
    return (
      <svg className="w-28 h-28 stroke-primary-gold" viewBox="0 0 100 100" fill="none">
        {/* Goldsmith Hammer and anvil */}
        <path d="M25,70 L75,70 L70,55 L30,55 Z" stroke="currentColor" strokeWidth="2.5" />
        <path d="M55,30 L65,20 L75,30 L65,40 Z" fill="#6D001A" stroke="currentColor" strokeWidth="1.5" />
        <path d="M65,40 L45,60" stroke="currentColor" strokeWidth="3" />
        <path d="M45,55 L48,52" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }

  if (type === "melt") {
    return (
      <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
        {/* Crucible pouring molten gold */}
        <path d="M35,30 C35,30 30,55 50,55 C70,55 65,30 65,30 Z" stroke="#FAF9F6" strokeWidth="2" />
        {/* Pouring stream */}
        <path d="M50,55 L50,85" stroke="#E8C76A" strokeWidth="4.5" strokeLinecap="round" className="animate-pulse" />
        <circle cx="50" cy="85" r="5" fill="#D4AF37" className="animate-ping" />
      </svg>
    );
  }

  if (type === "shop") {
    return (
      <svg className="w-28 h-28 stroke-primary-gold" viewBox="0 0 100 100" fill="none">
        {/* Shop Showcase Layout */}
        <rect x="25" y="35" width="50" height="40" rx="2" stroke="currentColor" strokeWidth="2.5" />
        <line x1="25" y1="52" x2="75" y2="52" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="43" r="3" fill="#D4AF37" />
        <circle cx="38" cy="43" r="2.5" fill="#C0C0C0" />
        <circle cx="62" cy="43" r="2.5" fill="#C0C0C0" />
      </svg>
    );
  }

  return (
    <svg className="w-28 h-28 stroke-primary-gold" viewBox="0 0 100 100" fill="none">
      {/* Bangles / Rings */}
      <circle cx="40" cy="50" r="20" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="60" cy="50" r="20" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ["All", "Gold Jewellery", "Silver Jewellery", "Craftsmanship", "Shop Images"];

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => filter === "All" || item.category === filter
  );

  return (
    <section id="gallery" className="py-24 bg-ivory-white text-luxury-black relative">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-royal-burgundy/15 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-cormorant text-lg italic tracking-widest text-royal-burgundy font-semibold">
            Visual Legacy
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide mt-1 mb-4">
            Our Gallery & Atelier
          </h2>
          <div className="w-20 h-[1.5px] bg-royal-burgundy mx-auto mb-4" />
          <p className="font-poppins text-xs sm:text-sm text-luxury-black/60 tracking-wider">
            Explore the beauty of our finished ornaments, take a look at our showroom in Alamuru, and discover the raw craftsmanship process that makes us unique.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-montserrat text-[10px] uppercase font-bold tracking-wider py-2.5 px-6 border transition-all cursor-pointer ${
                filter === cat
                  ? "bg-royal-burgundy border-royal-burgundy text-primary-gold"
                  : "bg-white border-luxury-black/10 text-luxury-black/75 hover:border-luxury-black/30 hover:text-luxury-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Columns Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [&>*]:break-inside-avoid">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="relative rounded-sm overflow-hidden bg-luxury-black text-ivory-white border border-white/5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              {/* Image box */}
              <div className={`relative w-full ${item.aspect} flex items-center justify-center p-8 bg-gradient-to-b from-[#181818] to-[#0d0d0d] overflow-hidden`}>
                <GalleryVector type={item.imageType} />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-luxury-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  
                  <div className="flex justify-between items-center">
                    <span className="font-montserrat text-[9px] uppercase tracking-widest text-primary-gold font-bold bg-royal-burgundy/40 border border-primary-gold/20 px-2.5 py-1 rounded-sm">
                      {item.category}
                    </span>
                    <ZoomIn size={16} className="text-primary-gold" />
                  </div>

                  <div className="flex items-center gap-2 text-xs font-montserrat uppercase font-semibold tracking-wider text-ivory-white border-b border-primary-gold/20 pb-2">
                    {item.category === "Craftsmanship" ? <Hammer size={13} className="text-primary-gold" /> : <Store size={13} className="text-primary-gold" />}
                    <span>{item.category} Atelier</span>
                  </div>

                </div>
              </div>

              {/* Text Card details under */}
              <div className="p-5 border-t border-white/5 bg-[#141414]">
                <h4 className="font-playfair text-base font-semibold tracking-wide text-ivory-white mb-1.5 flex items-center justify-between">
                  <span>{item.title}</span>
                  <Eye size={12} className="text-primary-gold/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="font-poppins text-[11px] text-ivory-white/60 line-clamp-1 leading-normal">
                  {item.description}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="absolute inset-0 bg-luxury-black"
            />

            {/* Content box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-luxury-black border border-primary-gold/30 rounded-sm overflow-hidden z-10 flex flex-col md:grid md:grid-cols-12 shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 text-ivory-white/60 hover:text-primary-gold p-2 bg-luxury-black/60 border border-white/5 rounded-full z-20 cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X size={18} />
              </button>

              {/* Vector Graphic (Col 7) */}
              <div className="col-span-7 h-[280px] md:h-[400px] flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-b md:border-b-0 md:border-r border-white/5 relative">
                <GalleryVector type={activeItem.imageType} />
                <div className="absolute top-4 left-4 bg-royal-burgundy border border-primary-gold/30 text-champagne-gold font-montserrat text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm">
                  {activeItem.category}
                </div>
              </div>

              {/* Text Card info (Col 5) */}
              <div className="col-span-5 p-6 sm:p-8 flex flex-col justify-between text-left">
                <div>
                  <span className="font-cormorant text-xs italic tracking-widest text-primary-gold font-bold uppercase block mb-1">
                    Atelier Spotlight
                  </span>
                  <h3 className="font-playfair text-xl md:text-2xl font-bold tracking-wide text-ivory-white mb-4">
                    {activeItem.title}
                  </h3>
                  <div className="w-12 h-[1px] bg-primary-gold mb-4" />
                  <p className="font-poppins text-xs leading-relaxed text-ivory-white/70">
                    {activeItem.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/5 pt-4 text-xs font-poppins text-ivory-white/40 flex items-center gap-2">
                  <Sparkles size={13} className="text-primary-gold/70" />
                  <span>Sri Chakra Veeralakshmi Legacy Studio</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
