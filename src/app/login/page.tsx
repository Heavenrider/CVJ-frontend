"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
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
        // Redirect to profile or previous page
        router.push("/profile");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-royal-burgundy/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-primary-gold/25 p-8 rounded-sm shadow-2xl relative z-10"
      >
        {/* Brand header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="relative w-16 h-16 mb-4 rounded-full overflow-hidden border border-primary-gold/30 bg-luxury-black p-0.5">
            <Image
              src="/assets/logo.jpg"
              alt="Sri Chakra Veeralakshmi logo"
              fill
              sizes="64px"
              className="object-contain rounded-full"
            />
          </Link>
          <h2 className="font-playfair text-2xl font-bold tracking-wide text-primary-gold leading-none uppercase">
            Sri Chakra Veeralakshmi
          </h2>
          <p className="font-cormorant text-xs tracking-widest text-champagne-gold font-medium mt-1">
            CLIENT LOGIN ATELIER
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/25 rounded-sm text-xs text-rose-400 font-poppins flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="login-email" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                <Mail size={16} />
              </span>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
          <div className="flex justify-between items-center mb-2">
              <label htmlFor="login-pass" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                <Lock size={16} />
              </span>
              <input
                id="login-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold hover:from-champagne-gold hover:to-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col gap-2">
          <p className="font-poppins text-xs text-ivory-white/50">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary-gold hover:text-champagne-gold transition-colors font-medium">
              Create an Account
            </Link>
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-1.5 font-montserrat text-[9px] uppercase tracking-wider text-champagne-gold/40 hover:text-primary-gold transition-all mt-2"
          >
            <KeyRound size={11} />
            <span>Admin Dashboard Login</span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
