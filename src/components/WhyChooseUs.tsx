"use client";

import { Award, Hammer, HeartHandshake, ShieldCheck, Coins, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function WhyChooseUs() {
  const features: FeatureItem[] = [
    {
      id: "f1",
      title: "100% BIS Hallmarked",
      description: "Every item of gold jewellery is certified with a BIS Hallmark 916 stamp, ensuring standard government certified purity.",
      icon: <ShieldCheck className="w-6 h-6 text-primary-gold" />,
    },
    {
      id: "f2",
      title: "Trusted Craftsmanship",
      description: "Over 25 years of master handcrafting experience under Vasabattula Srinivasu. We make gold structures that stand generations.",
      icon: <Hammer className="w-6 h-6 text-primary-gold" />,
    },
    {
      id: "f3",
      title: "100% Custom Designs",
      description: "We don't force you to choose standard template designs. Bring your custom sketches or ideas and we will manifest them perfectly.",
      icon: <Award className="w-6 h-6 text-primary-gold" />,
    },
    {
      id: "f4",
      title: "Absolute Transparency",
      description: "Clear bills showing actual metal rate, net weight, and reasonable making charges. No hidden percentages or corporate premiums.",
      icon: <Coins className="w-6 h-6 text-primary-gold" />,
    },
    {
      id: "f5",
      title: "Genuine Gold & Silver",
      description: "Ethically sourced gold bullions and pure silver bars. We perform direct purity checks in front of you.",
      icon: <HeartHandshake className="w-6 h-6 text-primary-gold" />,
    },
    {
      id: "f6",
      title: "Generational Service",
      description: "Direct owner service with a dedication to long-term trust. We offer lifetime polishing and refurbishment services.",
      icon: <RefreshCw className="w-6 h-6 text-primary-gold" />,
    },
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-ivory-white text-luxury-black relative overflow-hidden">
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-cormorant text-lg italic tracking-widest text-royal-burgundy font-semibold">
            Our Pillars of Faith
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide mt-1 mb-4">
            Why Sri Chakra Veeralakshmi?
          </h2>
          <div className="w-20 h-[1.5px] bg-royal-burgundy mx-auto mb-4" />
          <p className="font-poppins text-xs sm:text-sm text-luxury-black/60 tracking-wider">
            Discover why our clients have trusted us as their legacy family jeweller for over two decades.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              key={feature.id}
              className="bg-white border border-primary-gold/15 hover:border-primary-gold/45 p-8 rounded-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.06)] hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-full bg-royal-burgundy/5 flex items-center justify-center mb-6 group-hover:bg-royal-burgundy group-hover:text-primary-gold transition-colors duration-300">
                <span className="group-hover:scale-110 transition-transform duration-300 text-royal-burgundy group-hover:text-primary-gold">
                  {feature.icon}
                </span>
              </div>

              <h4 className="font-playfair text-lg font-bold tracking-wide text-luxury-black mb-3">
                {feature.title}
              </h4>
              
              <p className="font-poppins text-xs leading-relaxed text-luxury-black/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
