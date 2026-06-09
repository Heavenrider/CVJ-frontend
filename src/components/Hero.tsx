"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Phone, Award } from "lucide-react";
import Image from "next/image";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  driftX: number;
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [startAnimate, setStartAnimate] = useState(false);

  useEffect(() => {
    // Generate floating particles
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 4,
      driftX: Math.random() * 40 - 20,
    }));
    setParticles(generated);

    // Sync intro animations with loader unmount
    let sessionLoaded = false;
    try {
      sessionLoaded = !!sessionStorage.getItem("srichakra_intro_loaded");
    } catch (e) {}

    if (sessionLoaded) {
      setStartAnimate(true);
    } else {
      const timer = setTimeout(() => {
        setStartAnimate(true);
      }, 1800); // Matches loader timeout
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-luxury-black text-ivory-white overflow-hidden pt-20"
    >
      {/* Luxury Background Gradients */}
      <div className="absolute inset-0 z-0">
        {/* Radial Gold Flare */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Dark Burgundy Wash */}
        <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black via-luxury-black to-royal-burgundy/20" />
        {/* Shimmer line grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(212,175,55,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.07)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      </div>

      {/* Floating Gold Particle Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-b from-champagne-gold to-primary-gold/60"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, p.driftX, 0],
              opacity: [0.1, 0.9, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 flex flex-col items-center pt-8">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={startAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal-burgundy/40 border border-primary-gold/30 text-champagne-gold text-xs font-montserrat uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(109,0,26,0.2)] hover:border-primary-gold/60 transition-colors"
        >
          <Award size={13} className="text-primary-gold" />
          <span>ESTD. Legacy of Craftsmanship & Trust</span>
        </motion.div>

        {/* Logo (Fades & Scales) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={startAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-36 h-36 md:w-44 md:h-44 mb-8 bg-luxury-black rounded-full p-2.5 border-2 border-primary-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] group hover:border-primary-gold/70 transition-all duration-500"
        >
          <Image
            src="/assets/logo.jpg"
            alt="Sri Chakra Veeralakshmi Jewellery works Logo"
            fill
            sizes="(max-width: 768px) 144px, 176px"
            priority
            className="object-contain rounded-full p-1.5 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-full border border-champagne-gold/20 animate-pulse-slow pointer-events-none" />
        </motion.div>

        {/* Business Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={startAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide text-ivory-white mb-4 leading-tight"
        >
          Sri Chakra Veeralakshmi
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold mt-1 drop-shadow-sm">
            Jewellery Works
          </span>
        </motion.h1>

        {/* Subtitle / Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={startAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-cormorant text-xl sm:text-2xl md:text-3xl italic tracking-wider text-champagne-gold mb-10 max-w-2xl font-light"
        >
          "Where Tradition Meets Timeless Elegance"
        </motion.p>

        {/* CTA Button Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={startAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg mb-16"
        >
          <a
            href="#collections"
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-luxury-black bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold hover:from-champagne-gold hover:to-primary-gold py-4 px-8 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-[1.03] transition-all"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} />
          </a>

          <a
            href="#rates"
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-ivory-white border border-primary-gold/40 hover:border-primary-gold hover:bg-royal-burgundy/30 py-4 px-8 rounded-sm transition-all"
          >
            <Sparkles size={14} className="text-primary-gold" />
            <span>Live Rates</span>
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-ivory-white border border-white/10 hover:border-primary-gold hover:bg-white/5 py-4 px-8 rounded-sm transition-all"
          >
            <Phone size={14} className="text-primary-gold/80" />
            <span>Contact Us</span>
          </a>
        </motion.div>

        {/* Scroll Mouse Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            document.getElementById("rates")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div className="w-6 h-10 rounded-full border border-primary-gold/50 flex justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-primary-gold"
            />
          </div>
          <span className="font-montserrat text-[9px] uppercase tracking-widest text-champagne-gold/70">
            Scroll to rates
          </span>
        </motion.div>

      </div>
    </section>
  );
}
