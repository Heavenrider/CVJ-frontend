"use client";

import { Phone, MapPin, MessageSquare, Compass, Clock, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-luxury-black text-ivory-white relative overflow-hidden">
      
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-royal-burgundy/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-cormorant text-lg italic tracking-widest text-primary-gold font-semibold">
            Visit Us
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide mt-1 mb-4">
            Connect With Our Showroom
          </h2>
          <div className="w-20 h-[1px] bg-primary-gold mx-auto mb-4" />
          <p className="font-poppins text-xs sm:text-sm text-ivory-white/60 tracking-wider">
            We welcome you to visit our store in Alamuru, Andhra Pradesh. Get in touch with us for immediate inquiries or custom orders.
          </p>
        </div>

        {/* Contact layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Card Info Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#141414] border border-primary-gold/25 p-6 sm:p-8 rounded-sm shadow-md flex-1 flex flex-col justify-between"
            >
              <div>
                <span className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-primary-gold">
                  Official Atelier
                </span>
                
                <h3 className="font-playfair text-2xl font-bold text-ivory-white mt-2 mb-6">
                  Sri Chakra Veeralakshmi
                  <span className="block text-sm font-cormorant tracking-widest text-champagne-gold uppercase mt-1">
                    Jewellery Works
                  </span>
                </h3>

                <div className="space-y-6 font-poppins text-xs sm:text-sm text-ivory-white/80">
                  
                  {/* Founder */}
                  <div className="flex items-start gap-4">
                    <UserCheck size={18} className="text-primary-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-ivory-white/40 block leading-none mb-1">Proprietor</span>
                      <span className="font-semibold text-ivory-white">Vasabattula Srinivasu</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <Phone size={18} className="text-primary-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-ivory-white/40 block leading-none mb-1">Direct Call</span>
                      <a href="tel:+919948625356" className="font-semibold text-ivory-white hover:text-primary-gold transition-colors">
                        +91 9948625356
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <MapPin size={18} className="text-primary-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-ivory-white/40 block leading-none mb-1">Address</span>
                      <p className="leading-relaxed">
                        Beside Ramu Medicals, Main Road,<br />
                        Alamuru, Andhra Pradesh 533315, India
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <Clock size={18} className="text-primary-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-ivory-white/40 block leading-none mb-1">Business Hours</span>
                      <p className="leading-relaxed">
                        Monday – Sunday: 9:00 AM – 9:00 PM
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                <a
                  href="tel:+919948625356"
                  className="flex items-center justify-center gap-2 font-montserrat text-[10px] uppercase font-bold tracking-widest text-ivory-white border border-primary-gold/30 hover:border-primary-gold py-4 px-4 rounded-sm bg-luxury-black transition-all"
                >
                  <Phone size={12} className="text-primary-gold" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/919948625356?text=Hello%20Sri%20Chakra%20Veeralakshmi%20Jewellery%20Works%2C%20I%20am%20enquiring%20about%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 font-montserrat text-[10px] uppercase font-bold tracking-widest text-luxury-black bg-primary-gold py-4 px-4 rounded-sm hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                >
                  <MessageSquare size={12} className="fill-luxury-black text-luxury-black" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </motion.div>
          </div>

          {/* Map Column (7 cols) */}
          <div className="lg:col-span-7 h-[350px] lg:h-auto min-h-[350px] relative">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full h-full border border-primary-gold/25 rounded-sm overflow-hidden shadow-lg relative bg-[#121212]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15277.62539958348!2d81.9056637!3d16.7812234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3782b7cf537b8b%3A0xe54efb5ef601ea3!2sAlamuru%2C%20Andhra%20Pradesh%20533315!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri Chakra Veeralakshmi Jewellery location on Google Maps"
              ></iframe>

              {/* Get Directions Floating Overlay */}
              <div className="absolute bottom-4 right-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sri+Chakra+Veeralakshmi+Jewellery+Works+Beside+Ramu+Medicals+Main+Road+Alamuru+Andhra+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-montserrat text-[10px] uppercase font-bold tracking-widest text-luxury-black bg-gradient-to-r from-primary-gold to-champagne-gold hover:from-champagne-gold hover:to-primary-gold py-3 px-6 rounded-sm shadow-md transition-all font-medium hover:scale-[1.03]"
                >
                  <Compass size={12} />
                  <span>Get Directions</span>
                </a>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
