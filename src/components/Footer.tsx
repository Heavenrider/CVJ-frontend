"use client";

import { MessageSquare, Phone, MapPin, ShieldCheck, Mail, Award } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-ivory-white border-t border-primary-gold/20 pt-16 pb-8 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-royal-burgundy/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Logo & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#home" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary-gold/30 bg-luxury-black p-0.5">
                <Image
                  src="/assets/logo.jpg"
                  alt="Sri Chakra Veeralakshmi Jewellery logo"
                  fill
                  sizes="48px"
                  className="object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-sm font-bold tracking-wider text-primary-gold leading-none">
                  SRI CHAKRA
                </span>
                <span className="font-cormorant text-[10px] tracking-widest text-champagne-gold font-semibold leading-none mt-1">
                  VEERALAKSHMI JEWELLERY
                </span>
              </div>
            </a>

            <p className="font-poppins text-xs leading-relaxed text-ivory-white/60">
              Honoring generations of trust, craftsmanship, and transparency in East Godavari. Every design in our collections is 100% BIS 916 Hallmarked gold.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/5 hover:border-primary-gold hover:text-primary-gold flex items-center justify-center transition-all cursor-pointer text-ivory-white/80 hover:scale-105"
                aria-label="Facebook Profile"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/5 hover:border-primary-gold hover:text-primary-gold flex items-center justify-center transition-all cursor-pointer text-ivory-white/80 hover:scale-105"
                aria-label="Instagram Profile"
              >
                <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-montserrat text-xs uppercase font-bold tracking-widest text-primary-gold">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5 font-poppins text-xs text-ivory-white/70">
              <a href="#home" className="hover:text-primary-gold transition-colors">Home</a>
              <a href="#collections" className="hover:text-primary-gold transition-colors">Collections</a>
              <a href="#rates" className="hover:text-primary-gold transition-colors">Live Rates</a>
              <a href="#founder" className="hover:text-primary-gold transition-colors">Meet Founder</a>
              <a href="#custom-orders" className="hover:text-primary-gold transition-colors">Bespoke Orders</a>
              <a href="#gallery" className="hover:text-primary-gold transition-colors">Atelier Gallery</a>
            </div>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-montserrat text-xs uppercase font-bold tracking-widest text-primary-gold">
              Atelier Address
            </h4>
            <div className="space-y-3 font-poppins text-xs text-ivory-white/70">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-primary-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Beside Ramu Medicals, Main Road,<br />
                  Alamuru, Andhra Pradesh 533315
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-primary-gold shrink-0" />
                <a href="tel:+919948625356" className="hover:text-primary-gold transition-colors">+91 9948625356</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-primary-gold shrink-0" />
                <a href="mailto:info@srichakrajewellers.com" className="hover:text-primary-gold transition-colors">info@srichakrajewellers.com</a>
              </div>
            </div>
          </div>

          {/* Business Hours & Trust (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-montserrat text-xs uppercase font-bold tracking-widest text-primary-gold">
              Hours & Certification
            </h4>
            <div className="space-y-3.5 font-poppins text-xs text-ivory-white/70">
              <div>
                <span className="block text-ivory-white/40 text-[10px] uppercase tracking-wider mb-0.5">Showroom Timing</span>
                <span className="font-medium text-ivory-white">Mon – Sun: 9:00 AM – 9:00 PM</span>
              </div>

              <div className="bg-white/5 border border-white/5 p-3 rounded-sm flex items-start gap-2">
                <ShieldCheck size={16} className="text-primary-gold shrink-0 mt-0.5" />
                <p className="text-[10px] leading-normal text-ivory-white/50">
                  Government certified BIS Hallmark 916 jewellery with lifetime buyback guarantee.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/5 mb-8" />

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-poppins text-[10px] text-ivory-white/40 tracking-wider">
          <div>
            &copy; {new Date().getFullYear()} Sri Chakra Veeralakshmi Jewellery Works. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Award size={10} className="text-primary-gold" />
            <span>Designed for Timeless Legacy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
