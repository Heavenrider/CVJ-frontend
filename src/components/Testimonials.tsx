"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  designPurchased: string;
}

const REVIEWS: Testimonial[] = [
  {
    id: "t1",
    name: "Koppisetti Lakshmi",
    location: "Alamuru",
    rating: 5,
    review: "We purchased our daughter's complete bridal set from Sri Chakra Veeralakshmi Jewellery. Srinivasu garu gave us the best price in the market. The transparency in weight and making charges is what makes them different from big showrooms. Best quality gold!",
    designPurchased: "Traditional Bridal Haram & Vanki",
  },
  {
    id: "t2",
    name: "Satyanarayana Murthy V.",
    location: "Mandapeta",
    rating: 5,
    review: "I have been buying gold coins and custom silver articles for family occasions here for the last 15 years. Srinivasu's handcrafting is outstanding. Extremely honest person, highly recommended for pure BIS 916 gold.",
    designPurchased: "Custom Silver Pooja Plate & Idols",
  },
  {
    id: "t3",
    name: "Palla Sireesha",
    location: "Kakinada",
    rating: 5,
    review: "We ordered a custom peacock design black beads chain. We showed them a photo from Pinterest, and they made it look exactly the same, even more beautiful! The finishing is extremely premium.",
    designPurchased: "Bespoke Peacock Mangalsutra Chain",
  },
  {
    id: "t4",
    name: "Raju Vasabattula",
    location: "Rajahmundry",
    rating: 5,
    review: "Excellent craftsmanship and excellent customer support. They calculate the metal rate exactly as per market rate, making charges are very reasonable compared to corporate jewellers. Very trusted store.",
    designPurchased: "22K Solid Men's Curb Chain",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right

  useEffect(() => {
    // Auto slide every 8 seconds
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [index]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" as const },
    }),
  };

  return (
    <section className="py-24 bg-luxury-black text-ivory-white relative overflow-hidden">
      
      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-royal-burgundy/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto mb-16">
          <span className="font-cormorant text-lg italic tracking-widest text-primary-gold font-semibold">
            Testimonials
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide mt-1 mb-4">
            Voices of Trust & Satisfaction
          </h2>
          <div className="w-20 h-[1px] bg-primary-gold mx-auto mb-4" />
          <p className="font-poppins text-xs sm:text-sm text-ivory-white/60 tracking-wider">
            Discover why our clients in East Godavari district choose us as their family jeweller for generations.
          </p>
        </div>

        {/* Carousel Frame */}
        <div className="relative min-h-[340px] flex items-center justify-center max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={REVIEWS[index].id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-[#141414] border border-primary-gold/25 rounded-md p-8 sm:p-12 shadow-[0_10px_35px_rgba(212,175,55,0.03)] flex flex-col justify-between items-center text-center w-full"
            >
              <Quote className="text-primary-gold/15 w-16 h-16 mb-6 shrink-0" />
              
              <p className="font-cormorant text-xl sm:text-2xl md:text-3xl italic leading-relaxed text-ivory-white mb-8 max-w-3xl font-light">
                "{REVIEWS[index].review}"
              </p>

              <div className="flex flex-col items-center">
                {/* Rating stars */}
                <div className="flex items-center gap-1.5 mb-3">
                  {Array.from({ length: REVIEWS[index].rating }).map((_, i) => (
                    <Star key={i} size={15} className="fill-primary-gold text-primary-gold" />
                  ))}
                </div>

                <h4 className="font-playfair text-base sm:text-lg font-bold text-primary-gold tracking-wide uppercase">
                  {REVIEWS[index].name}
                </h4>

                <div className="flex items-center gap-2 text-[10px] font-montserrat uppercase tracking-wider text-ivory-white/40 mt-1">
                  <span>{REVIEWS[index].location}, AP</span>
                  <span className="text-white/10">•</span>
                  <span className="text-champagne-gold/70">{REVIEWS[index].designPurchased}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute left-0 right-0 -bottom-16 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 flex sm:justify-between px-4 gap-4 justify-center">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-primary-gold/20 hover:border-primary-gold text-ivory-white hover:text-primary-gold bg-[#141414] hover:bg-royal-burgundy/30 flex items-center justify-center shadow-lg transition-all cursor-pointer"
              aria-label="Previous Review"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-primary-gold/20 hover:border-primary-gold text-ivory-white hover:text-primary-gold bg-[#141414] hover:bg-royal-burgundy/30 flex items-center justify-center shadow-lg transition-all cursor-pointer"
              aria-label="Next Review"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
