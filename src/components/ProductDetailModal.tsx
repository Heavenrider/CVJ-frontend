"use client";

import { useEffect, useState, useRef } from "react";
import { X, MessageSquare, Phone, Scale, Award, Coins, Percent, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "./ProductCatalog";

interface ProductDetailModalProps {
  product: Product | null;
  computedPrice: number;
  rates: {
    gold24k: { rate: number };
    gold22k: { rate: number };
    silver: { rate: number };
  } | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, computedPrice, rates, onClose }: ProductDetailModalProps) {
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center", transform: "scale(1)" });
  const containerRef = useRef<HTMLDivElement>(null);

  // Default rates for fallback calculations
  const rates24K = rates?.gold24k?.rate || 7450;
  const rates22K = rates?.gold22k?.rate || 6830;
  const rates18K = rates22K * 18 / 22;
  const ratesSilver = rates?.silver?.rate || 92.5;

  useEffect(() => {
    // Prevent scrolling behind modal
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  const getMetalRate = () => {
    switch (product.purity) {
      case "24K": return rates24K;
      case "22K": return rates22K;
      case "18K": return rates18K;
      case "Silver 99.9%": return ratesSilver;
      default: return rates22K;
    }
  };

  const metalRate = getMetalRate();
  const metalCost = metalRate * product.weight;
  const makingCharges = product.makingChargesPerGram * product.weight;
  const subtotal = metalCost + makingCharges;
  const gst = subtotal * 0.03;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Magnifying Glass Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: "center", transform: "scale(1)" });
  };

  const getWhatsAppEnquiryMsg = () => {
    const message = `Hello Sri Chakra Veeralakshmi Jewellery Works, I want to purchase or get more details about:
    
- *Product*: ${product.name}
- *Category*: ${product.category.name}
- *Weight*: ${product.weight}g
- *Purity*: ${product.purity}
- *Final Value*: ${formatCurrency(computedPrice)}

Please contact me back. Thank you!`;
    return `https://wa.me/919948625356?text=${encodeURIComponent(message)}`;
  };

  // SVGs for silhouettes inside the modal
  const renderSVGImage = () => {
    const color = product.metalType === "GOLD" ? "#D4AF37" : "#C0C0C0";
    const nameLower = product.name.toLowerCase();
    return (
      <div 
        className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-b from-[#1b1b1b] to-[#121212] overflow-hidden cursor-zoom-in relative group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={zoomStyle}
          transition={{ type: "tween", duration: 0.1 }}
          className="w-full h-full flex items-center justify-center"
        >
          {/* Detailed visual outline inside zoomed element */}
          {nameLower.includes("necklace") && (
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none" stroke={color}>
              <path d="M15,25 C15,75 85,75 85,25" strokeWidth="2" strokeDasharray="3,2" />
              <path d="M20,30 C20,70 80,70 80,30" strokeWidth="2.5" />
              <path d="M25,35 C25,65 75,65 75,35" strokeWidth="1.5" />
              <circle cx="50" cy="62" r="6" fill="#6D001A" strokeWidth="1" />
              <polygon points="50,68 47,73 53,73" fill={color} />
              <circle cx="41" cy="59" r="3" fill={color} />
              <circle cx="59" cy="59" r="3" fill={color} />
            </svg>
          )}
          {nameLower.includes("ring") && (
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none" stroke={color}>
              <circle cx="50" cy="58" r="24" strokeWidth="3.5" />
              <path d="M50,34 L40,24 L50,14 L60,24 Z" fill={color} strokeWidth="1" />
              <circle cx="50" cy="24" r="5" fill="#FAF9F6" />
              <circle cx="50" cy="24" r="2" fill="#6D001A" />
            </svg>
          )}
          {nameLower.includes("earrings") && (
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none" stroke={color}>
              <circle cx="30" cy="25" r="4" fill={color} />
              <path d="M30,29 L30,45" strokeWidth="2" />
              <path d="M20,45 L40,45 L30,65 Z" strokeWidth="2" />
              <circle cx="30" cy="54" r="3" fill="#6D001A" />
              
              <circle cx="70" cy="25" r="4" fill={color} />
              <path d="M70,29 L70,45" strokeWidth="2" />
              <path d="M60,45 L80,45 L70,65 Z" strokeWidth="2" />
              <circle cx="70" cy="54" r="3" fill="#6D001A" />
            </svg>
          )}
          {(!nameLower.includes("necklace") && !nameLower.includes("ring") && !nameLower.includes("earrings")) && (
            <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none" stroke={color}>
              <ellipse cx="50" cy="45" rx="35" ry="12" strokeWidth="3" />
              <ellipse cx="50" cy="55" rx="35" ry="12" strokeWidth="3.5" />
              <path d="M15,45 C15,75 85,75 85,45" strokeWidth="2" strokeDasharray="3,2" />
            </svg>
          )}
        </motion.div>
        
        {/* Helper overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-luxury-black/70 py-1 px-3 rounded-md text-[10px] text-ivory-white/60 text-center pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
          Hover over image to zoom
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-luxury-black"
        />

        {/* Modal Content Window */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-luxury-black border border-primary-gold/30 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 flex flex-col md:grid md:grid-cols-12 shadow-[0_20px_50px_rgba(212,175,55,0.15)] scrollbar-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-ivory-white/60 hover:text-primary-gold p-2 bg-luxury-black/40 border border-white/5 hover:border-primary-gold/40 rounded-full z-20 cursor-pointer transition-all"
            aria-label="Close details"
          >
            <X size={20} />
          </button>

          {/* Left Column - Product Image (5 cols) */}
          <div className="col-span-5 h-[300px] md:h-full min-h-[300px] border-b md:border-b-0 md:border-r border-white/5 relative">
            {renderSVGImage()}
          </div>

          {/* Right Column - Spec details (7 cols) */}
          <div className="col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-cormorant text-sm italic tracking-widest text-primary-gold font-bold uppercase">
                  {product.category.name}
                </span>
                <span className="text-ivory-white/30">•</span>
                <span className="font-montserrat text-[10px] text-ivory-white/60 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle size={10} className="text-emerald-400" />
                  In Stock
                </span>
              </div>
              
              <h3 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide text-ivory-white mb-4">
                {product.name}
              </h3>
              
              <p className="font-poppins text-xs leading-relaxed text-ivory-white/70 mb-6">
                {product.description}
              </p>

              {/* Specifications Block */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                
                <div className="bg-[#121212] p-3 border border-white/5 rounded-sm flex items-center gap-3">
                  <Scale size={16} className="text-primary-gold" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-ivory-white/40 block leading-none">Net Weight</span>
                    <span className="font-montserrat text-xs font-semibold text-ivory-white mt-1 block">{product.weight} grams</span>
                  </div>
                </div>

                <div className="bg-[#121212] p-3 border border-white/5 rounded-sm flex items-center gap-3">
                  <Award size={16} className="text-primary-gold" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-ivory-white/40 block leading-none">Purity Standard</span>
                    <span className="font-montserrat text-xs font-semibold text-ivory-white mt-1 block">
                      {product.purity} {product.metalType === "GOLD" ? "(BIS Hallmark)" : ""}
                    </span>
                  </div>
                </div>

              </div>

              {/* Pricing Breakdown Sheet */}
              <div className="border border-primary-gold/25 rounded-sm bg-[#101010] p-4 sm:p-5 mb-8">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3.5">
                  <Coins size={14} className="text-primary-gold" />
                  <h4 className="font-montserrat text-xs uppercase font-bold tracking-widest text-primary-gold">
                    Transparent Invoice Estimate
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs font-poppins">
                  
                  <div className="flex justify-between text-ivory-white/70">
                    <span>Metal Cost ({product.weight}g @ {formatCurrency(metalRate)}/g)</span>
                    <span className="font-semibold">{formatCurrency(metalCost)}</span>
                  </div>

                  <div className="flex justify-between text-ivory-white/70">
                    <span>Making Charges ({product.weight}g @ {formatCurrency(product.makingChargesPerGram)}/g)</span>
                    <span className="font-semibold">{formatCurrency(makingCharges)}</span>
                  </div>

                  <div className="flex justify-between text-ivory-white/50 border-t border-white/5 pt-2">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-ivory-white/70 flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span>GST (3%)</span>
                      <span className="text-[10px] text-ivory-white/30 flex items-center gap-0.5">
                        <FileText size={10} />
                        Government Standard
                      </span>
                    </span>
                    <span className="font-semibold">{formatCurrency(gst)}</span>
                  </div>

                  <div className="flex justify-between text-base font-semibold text-champagne-gold border-t border-primary-gold/30 pt-3 mt-1">
                    <span className="font-playfair tracking-wide uppercase text-xs font-bold text-ivory-white">Estimated Price</span>
                    <span className="font-playfair text-xl">{formatCurrency(computedPrice)}</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Quick Actions (WhatsApp & Call) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:+919948625356`}
                className="flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-ivory-white border border-primary-gold/30 hover:border-primary-gold py-4 px-6 rounded-sm bg-luxury-black transition-all"
              >
                <Phone size={14} className="text-primary-gold" />
                <span>Call Owner</span>
              </a>

              <a
                href={getWhatsAppEnquiryMsg()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-luxury-black bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold py-4 px-6 rounded-sm hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
              >
                <MessageSquare size={14} className="fill-luxury-black text-luxury-black" />
                <span>WhatsApp Order</span>
              </a>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
