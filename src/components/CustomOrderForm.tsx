"use client";

import React, { useState, useRef } from "react";
import { MessageSquare, Upload, X, ShieldAlert, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomOrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct message
    const whatsappMsg = `Hello Sri Chakra Veeralakshmi Jewellery Works, I would like to place a custom jewellery order:
    
- *Name*: ${name}
- *Phone*: ${phone}
- *Design File Name*: ${fileName || "None provided"}
- *Description*: ${description}

(Note: I will send the design drawing/photo in this chat next.)`;

    // WhatsApp URL
    const url = `https://wa.me/919948625356?text=${encodeURIComponent(whatsappMsg)}`;
    
    // Redirect
    window.open(url, "_blank");
    
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="custom-orders" className="py-24 bg-luxury-black relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,0,26,0.1)_0%,rgba(10,10,10,0)_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-gold/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="font-cormorant text-lg italic tracking-widest text-primary-gold font-semibold">
            Bespoke Orchestration
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide text-ivory-white mt-1 mb-4">
            Bespoke Custom Orders
          </h2>
          <div className="w-20 h-[1px] bg-primary-gold mx-auto mb-4" />
          <p className="font-poppins text-xs sm:text-sm text-ivory-white/60 tracking-wider max-w-xl mx-auto">
            Design your legacy. Fill in your specifications below, attach a sketch or reference image, and submit it to connect directly with our owner.
          </p>
        </div>

        {/* Custom Order Box */}
        <div className="bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-primary-gold/25 rounded-md p-6 sm:p-10 shadow-[0_15px_40px_rgba(212,175,55,0.04)]">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Inputs (6 cols) */}
            <div className="md:col-span-6 space-y-6">
              
              <div>
                <label htmlFor="custom-name" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">
                  Full Name
                </label>
                <input
                  id="custom-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold focus:shadow-[0_0_10px_rgba(212,175,55,0.15)] text-ivory-white text-xs sm:text-sm px-4 py-3 rounded-sm outline-none transition-all placeholder:text-ivory-white/20"
                />
              </div>

              <div>
                <label htmlFor="custom-phone" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">
                  Phone Number
                </label>
                <input
                  id="custom-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold focus:shadow-[0_0_10px_rgba(212,175,55,0.15)] text-ivory-white text-xs sm:text-sm px-4 py-3 rounded-sm outline-none transition-all placeholder:text-ivory-white/20"
                />
              </div>

              <div>
                <label htmlFor="custom-desc" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">
                  Detailed Specifications
                </label>
                <textarea
                  id="custom-desc"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your design (metal type, gold purity, weight, sizes, or custom inscriptions...)"
                  className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold focus:shadow-[0_0_10px_rgba(212,175,55,0.15)] text-ivory-white text-xs sm:text-sm p-4 rounded-sm outline-none resize-none transition-all placeholder:text-ivory-white/20"
                />
              </div>

            </div>

            {/* Right Uploader (6 cols) */}
            <div className="md:col-span-6 flex flex-col justify-between">
              
              <div className="flex-1 flex flex-col">
                <span className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">
                  Upload Drawing / Reference Design
                </span>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 min-h-[160px] border border-dashed rounded-sm flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                    imagePreview 
                      ? "border-primary-gold bg-primary-gold/5" 
                      : "border-white/15 hover:border-primary-gold/50 bg-luxury-black/40 hover:bg-luxury-black/60"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="relative w-28 h-20 bg-luxury-black/40 rounded-sm overflow-hidden border border-primary-gold/25">
                        <img
                          src={imagePreview}
                          alt="Custom design preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-ivory-white/70 max-w-[150px] truncate font-poppins">{fileName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="p-1 rounded-full bg-royal-burgundy/80 text-primary-gold border border-primary-gold/20 hover:bg-royal-burgundy transition-all"
                          aria-label="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-primary-gold">
                        <Upload size={20} />
                      </div>
                      <span className="font-poppins text-xs font-semibold text-ivory-white">
                        Click to upload design image
                      </span>
                      <span className="font-poppins text-[10px] text-ivory-white/40">
                        Supports PNG, JPG, JPEG up to 10MB
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Alert Info */}
              <div className="mt-6 bg-white/5 border border-white/5 p-3 rounded-sm flex items-start gap-2.5">
                <ShieldAlert size={14} className="text-primary-gold shrink-0 mt-0.5" />
                <p className="font-poppins text-[10px] text-ivory-white/50 leading-normal">
                  Note: Since WhatsApp does not support uploading local documents directly via link redirection, please attach this image manually in the chat prompt after submission.
                </p>
              </div>

            </div>

            {/* Submit Bar */}
            <div className="md:col-span-12 border-t border-white/5 pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {isSubmitted ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle size={15} />
                  <span>Enquiry generated! Redirecting to WhatsApp...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] font-poppins text-ivory-white/40">
                  <FileText size={12} className="text-primary-gold/70" />
                  <span>Submitting launches WhatsApp with a pre-formatted message.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-luxury-black bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold hover:from-champagne-gold hover:to-primary-gold py-4 px-8 rounded-sm hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer"
              >
                <MessageSquare size={14} className="fill-luxury-black text-luxury-black" />
                <span>Submit to WhatsApp</span>
              </button>

            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
