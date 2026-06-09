"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Global module state to prevent showing loader on component remounts during client-side navigation
let introLoaded = false;

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage or global flag to skip loader on repeat visits or navigations
    let sessionLoaded = false;
    try {
      sessionLoaded = !!sessionStorage.getItem("srichakra_intro_loaded");
    } catch (e) {
      // Ignore sessionStorage exceptions in private/incognito modes
    }

    if (introLoaded || sessionLoaded) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      introLoaded = true;
      try {
        sessionStorage.setItem("srichakra_intro_loaded", "true");
      } catch (e) {
        // Ignore sessionStorage exceptions in private/incognito modes
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-luxury-black text-ivory-white"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(109,0,26,0.1)_0%,rgba(10,10,10,0)_50%,rgba(212,175,55,0.05)_100%)] pointer-events-none" />

          <div className="relative flex flex-col items-center max-w-xs text-center px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-40 h-40 mb-6 bg-luxury-black rounded-full flex items-center justify-center p-2 border border-primary-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            >
              <Image
                src="/assets/logo.jpg"
                alt="Sri Chakra Veeralakshmi Jewellery logo"
                fill
                priority
                className="object-contain rounded-full p-2"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-playfair text-xl tracking-wider text-primary-gold font-bold mb-2 uppercase"
            >
              Sri Chakra Veeralakshmi
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="font-cormorant text-sm italic tracking-widest text-champagne-gold mb-6"
            >
              JEWELLERY WORKS
            </motion.p>

            {/* Premium Gold Spinner */}
            <div className="relative w-12 h-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-full rounded-full border-t-2 border-r-2 border-primary-gold border-b border-l border-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
