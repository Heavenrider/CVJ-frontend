"use client";

import { RefreshCw, TrendingUp, TrendingDown, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface RateDetail {
  rate: number;
  rateKg?: number;
  change: "up" | "down";
  changeValue: number;
}

interface RatesData {
  gold24k: RateDetail;
  gold22k: RateDetail;
  silver: RateDetail;
  timestamp: string;
}

interface LiveRatesProps {
  rates: RatesData | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function LiveRates({ rates, loading, onRefresh }: LiveRatesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return "Just Now";
    }
  };

  return (
    <section id="rates" className="py-20 bg-luxury-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(109,0,26,0.15)_0%,rgba(10,10,10,0)_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-cormorant text-lg italic tracking-widest text-primary-gold font-medium">
            Market Intelligence
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-wide text-ivory-white mt-1 mb-4">
            Live Metal Rates
          </h2>
          <div className="w-24 h-[1px] bg-primary-gold mx-auto mb-4" />
          <p className="font-poppins text-xs sm:text-sm text-ivory-white/60 tracking-wider">
            Our pricing is completely transparent and calculated in real-time based on current Indian bullion market standards.
          </p>
        </div>

        {/* Live Card Container */}
        <div className="bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-primary-gold/25 rounded-md p-6 sm:p-8 shadow-[0_0_40px_rgba(212,175,55,0.05)] hover:border-primary-gold/40 transition-all duration-300">
          
          {/* Card Top Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <span className="font-montserrat text-xs uppercase font-bold tracking-widest text-emerald-400">
                Live Feed Active
              </span>
              <span className="text-ivory-white/30">|</span>
              <div className="flex items-center gap-1.5 text-xs text-ivory-white/50 font-poppins">
                <Clock size={13} className="text-champagne-gold" />
                <span>Last Updated: {rates ? formatTime(rates.timestamp) : "Loading..."}</span>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 font-montserrat text-[10px] uppercase font-bold tracking-widest text-primary-gold hover:text-champagne-gold bg-royal-burgundy/30 hover:bg-royal-burgundy/50 px-4 py-2 rounded-sm border border-primary-gold/20 hover:border-primary-gold/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={`${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh Rates"}</span>
            </button>
          </div>

          {/* Rates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 24K Gold Rate */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-luxury-black/60 border border-white/5 hover:border-primary-gold/30 p-6 rounded-sm transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/70">
                  Gold 24K (Pure Gold)
                </span>
                <h3 className="font-playfair text-4xl font-semibold text-ivory-white mt-2 mb-1">
                  {rates ? formatCurrency(rates.gold24k.rate) : "₹7,450.00"}
                </h3>
                <p className="font-poppins text-[10px] text-ivory-white/40 uppercase tracking-widest">
                  Per Gram (99.9% Purity)
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                {rates && rates.gold24k.change === "up" ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-1 rounded-sm">
                    <TrendingUp size={14} />
                    <span>+{formatCurrency(rates.gold24k.changeValue)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-400 text-xs font-semibold bg-rose-500/10 px-2 py-1 rounded-sm">
                    <TrendingDown size={14} />
                    <span>-{rates ? formatCurrency(rates.gold24k.changeValue) : "0"}</span>
                  </div>
                )}
                <span className="text-[10px] text-ivory-white/30 font-poppins">vs previous check</span>
              </div>
            </motion.div>

            {/* 22K Gold Rate */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-luxury-black/60 border border-white/5 hover:border-primary-gold/30 p-6 rounded-sm transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/70">
                  Gold 22K (Standard Gold)
                </span>
                <h3 className="font-playfair text-4xl font-semibold text-ivory-white mt-2 mb-1">
                  {rates ? formatCurrency(rates.gold22k.rate) : "₹6,830.00"}
                </h3>
                <p className="font-poppins text-[10px] text-ivory-white/40 uppercase tracking-widest">
                  Per Gram (91.6% Purity - BIS Hallmark)
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                {rates && rates.gold22k.change === "up" ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-1 rounded-sm">
                    <TrendingUp size={14} />
                    <span>+{formatCurrency(rates.gold22k.changeValue)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-400 text-xs font-semibold bg-rose-500/10 px-2 py-1 rounded-sm">
                    <TrendingDown size={14} />
                    <span>-{rates ? formatCurrency(rates.gold22k.changeValue) : "0"}</span>
                  </div>
                )}
                <span className="text-[10px] text-ivory-white/30 font-poppins">vs previous check</span>
              </div>
            </motion.div>

            {/* Silver Rate */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-luxury-black/60 border border-white/5 hover:border-primary-gold/30 p-6 rounded-sm transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/70">
                  Silver (99.9% Pure)
                </span>
                <h3 className="font-playfair text-4xl font-semibold text-ivory-white mt-2 mb-1">
                  {rates ? formatCurrency(rates.silver.rate) : "₹92.50"}
                </h3>
                <p className="font-poppins text-[10px] text-ivory-white/40 uppercase tracking-widest">
                  Per Gram / {rates ? formatCurrency(rates.silver.rateKg || 92500) : "₹92,500"} per KG
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                {rates && rates.silver.change === "up" ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-1 rounded-sm">
                    <TrendingUp size={14} />
                    <span>+{formatCurrency(rates.silver.changeValue)}/g</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-400 text-xs font-semibold bg-rose-500/10 px-2 py-1 rounded-sm">
                    <TrendingDown size={14} />
                    <span>-{rates ? formatCurrency(rates.silver.changeValue) : "0"}/g</span>
                  </div>
                )}
                <span className="text-[10px] text-ivory-white/30 font-poppins">vs previous check</span>
              </div>
            </motion.div>

          </div>

          {/* Verification Badge */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-ivory-white/60 text-xs font-poppins">
              <ShieldCheck size={16} className="text-primary-gold" />
              <span>We charge according to standard government rules. Hallmark BIS 916 jewellery certified.</span>
            </div>
            <div className="text-[10px] font-montserrat uppercase tracking-wider text-champagne-gold/70">
              *Prices exclude making charges & GST (3%)
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
