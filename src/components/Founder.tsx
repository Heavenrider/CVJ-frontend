"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ShieldCheck, HeartHandshake, Award } from "lucide-react";
import Image from "next/image";

function Counter({ target, duration = 2, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const totalFrames = duration * 60;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic
      const currentCount = Math.round(end * (1 - Math.pow(1 - progress, 3)));
      
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(end);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="font-playfair text-3xl sm:text-4xl font-bold text-primary-gold">
      {count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

export default function Founder() {
  return (
    <section id="founder" className="py-24 bg-ivory-white text-luxury-black relative overflow-hidden">
      
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-royal-burgundy/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Owner Image Container (L: 5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[360px] aspect-square md:aspect-[4/5] rounded-sm p-3 bg-white border border-primary-gold/30 shadow-[0_15px_40px_rgba(212,175,55,0.08)] group"
            >
              {/* Outer Golden Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary-gold" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary-gold" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary-gold" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary-gold" />

              <div className="relative w-full h-full overflow-hidden bg-luxury-black/5 rounded-sm">
                <Image
                  src="/assets/founder.jpg"
                  alt="Vasabattula Srinivasu - Founder of Sri Chakra Veeralakshmi Jewellery Works"
                  fill
                  sizes="(max-width: 1024px) 360px, 450px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Founder Tag Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-luxury-black border border-primary-gold/40 px-6 py-2 shadow-lg text-center rounded-sm min-w-[200px]">
                <h4 className="font-playfair text-sm text-primary-gold font-bold tracking-wider uppercase leading-none">
                  Vasabattula Srinivasu
                </h4>
                <span className="font-cormorant text-[10px] tracking-widest text-ivory-white uppercase block mt-1">
                  Master Craftsman & Founder
                </span>
              </div>
            </motion.div>
          </div>

          {/* Biography and Stats (R: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-cormorant text-lg italic tracking-widest text-royal-burgundy font-semibold">
                Behind The Craftsmanship
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide mt-1 mb-6">
                Meet Our Founder
              </h2>
              <div className="w-20 h-[1.5px] bg-royal-burgundy mb-6" />

              <p className="font-poppins text-sm leading-relaxed text-luxury-black/75 mb-6">
                For over two decades, **Vasabattula Srinivasu** has been the guiding force behind **Sri Chakra Veeralakshmi Jewellery Works**. Founded on the principles of absolute purity, transparent pricing, and traditional Indian artistry, our shop has grown to become Alamuru's most trusted sanctuary for high-end gold and silver designs.
              </p>

              <p className="font-poppins text-sm leading-relaxed text-luxury-black/75 mb-8">
                Every necklace, chain, ring, and custom bridal set is crafted with meticulous attention to detail. Under his leadership, we combine ancient handcrafting techniques with modern quality assurances, ensuring that every jewellery piece represents not just an ornament, but a generational asset that carries memories.
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-royal-burgundy/5 flex items-center justify-center shrink-0 border border-royal-burgundy/10">
                    <ShieldCheck size={18} className="text-royal-burgundy" />
                  </div>
                  <div>
                    <h5 className="font-montserrat text-xs uppercase font-bold tracking-wider">
                      BIS 916 Hallmarked
                    </h5>
                    <p className="font-poppins text-[11px] text-luxury-black/60 mt-0.5">
                      100% verified pure gold certification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-royal-burgundy/5 flex items-center justify-center shrink-0 border border-royal-burgundy/10">
                    <HeartHandshake size={18} className="text-royal-burgundy" />
                  </div>
                  <div>
                    <h5 className="font-montserrat text-xs uppercase font-bold tracking-wider">
                      Generational Trust
                    </h5>
                    <p className="font-poppins text-[11px] text-luxury-black/60 mt-0.5">
                      Honest valuations and direct owner service.
                    </p>
                  </div>
                </div>
              </div>

              {/* Animated Stats Block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-luxury-black/5 text-center sm:text-left">
                <div className="flex flex-col">
                  <Counter target={25} suffix="+" />
                  <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-luxury-black/60 mt-1 leading-none">
                    Years Legacy
                  </span>
                </div>

                <div className="flex flex-col">
                  <Counter target={10000} suffix="+" />
                  <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-luxury-black/60 mt-1 leading-none">
                    Happy Families
                  </span>
                </div>

                <div className="flex flex-col">
                  <Counter target={5000} suffix="+" />
                  <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-luxury-black/60 mt-1 leading-none">
                    Unique Designs
                  </span>
                </div>

                <div className="flex flex-col">
                  <Counter target={100} suffix="%" />
                  <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-luxury-black/60 mt-1 leading-none">
                    Hallmarked Pure
                  </span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
