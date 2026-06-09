"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      } else {
        setError(data.message || "Failed to register. Email may be already taken.");
      }
    } catch (err) {
      setError("Server connection failure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decorations */}
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
          <Link href="/" className="relative w-14 h-14 mb-4 rounded-full overflow-hidden border border-primary-gold/30 bg-luxury-black p-0.5">
            <Image
              src="/assets/logo.jpg"
              alt="Sri Chakra Veeralakshmi logo"
              fill
              sizes="56px"
              className="object-contain rounded-full"
            />
          </Link>
          <h2 className="font-playfair text-2xl font-bold tracking-wide text-primary-gold leading-none uppercase">
            Sri Chakra Veeralakshmi
          </h2>
          <p className="font-cormorant text-xs tracking-widest text-champagne-gold font-medium mt-1">
            CREATE ACCOUNT ATELIER
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/25 rounded-sm text-xs text-rose-400 font-poppins flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-center flex flex-col items-center gap-4 mb-4"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="font-playfair text-lg font-bold text-emerald-400">Registration Successful!</h4>
            <p className="font-poppins text-xs text-ivory-white/70">
              Welcome to the family. Redirecting you to the Client Login Atelier...
            </p>
          </motion.div>
        ) : (
          /* Form */
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                  <User size={15} />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                  <Mail size={15} />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-phone" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                  <Phone size={15} />
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="99486 25356"
                  className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-pass" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                    <Lock size={15} />
                  </span>
                  <input
                    id="reg-pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs pl-9 pr-3 py-2.5 rounded-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-confirm" className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/30">
                    <Lock size={15} />
                  </span>
                  <input
                    id="reg-confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs pl-9 pr-3 py-2.5 rounded-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold hover:from-champagne-gold hover:to-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer links */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="font-poppins text-xs text-ivory-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-gold hover:text-champagne-gold transition-colors font-medium">
              Client Sign In
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
