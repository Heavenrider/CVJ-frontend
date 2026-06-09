"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.user.role !== "ADMIN") {
          // Force logout if they are not admin
          await fetch("/api/auth/logout", { method: "POST" });
          setError("Unauthorized: Client accounts cannot access the administrator panel.");
          setLoading(false);
          return;
        }
        
        // Redirect to admin dashboard
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server failure. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-royal-burgundy/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-primary-gold/30 p-8 rounded-sm shadow-2xl relative z-10"
      >
        {/* Header logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="relative w-16 h-16 mb-4 rounded-full overflow-hidden border border-primary-gold/35 bg-luxury-black p-0.5">
            <Image
              src="/assets/logo.jpg"
              alt="Sri Chakra Veeralakshmi logo"
              fill
              sizes="64px"
              className="object-contain rounded-full"
            />
          </Link>
          
          <div className="flex items-center gap-1.5 justify-center mb-1">
            <ShieldCheck size={16} className="text-primary-gold" />
            <h2 className="font-playfair text-xl font-bold tracking-wide text-ivory-white uppercase leading-none">
              SRI CHAKRA
            </h2>
          </div>
          
          <p className="font-montserrat text-[9px] uppercase tracking-widest text-primary-gold font-bold">
            Administrator Gateway Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/25 rounded-sm text-xs text-rose-400 font-poppins">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label htmlFor="adm-email" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">
              Admin Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                <Mail size={16} />
              </span>
              <input
                id="adm-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@srichakrajewellers.com"
                className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adm-pass" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">
              Secret Passkey
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                <Lock size={16} />
              </span>
              <input
                id="adm-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-royal-burgundy border border-primary-gold text-primary-gold font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all hover:bg-royal-burgundy/80 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <span>Enter Dashboard</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs font-poppins text-ivory-white/30">
          <Link href="/login" className="hover:text-primary-gold transition-colors">
            Go back to standard Client Sign In
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
