"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageSquare, ShoppingCart, Heart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Collections", href: "/#collections" },
  { label: "Gold Rates", href: "/#rates" },
  { label: "About Founder", href: "/#founder" },
  { label: "Custom Orders", href: "/#custom-orders" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Why Us", href: "/#why-choose-us" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  const fetchSessionData = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          // Calculate counts
          setCartCount(data.user.orders ? 0 : 0); // we can query cart/wish list count
          
          // Let's fetch the actual cart/wishlist lists in parallel
          const [resCart, resWish] = await Promise.all([
            fetch("/api/cart"),
            fetch("/api/wishlist")
          ]);
          if (resCart.ok) {
            const cData = await resCart.json();
            if (cData.success) setCartCount(cData.cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
          }
          if (resWish.ok) {
            const wData = await resWish.json();
            if (wData.success) setWishCount(wData.wishlist.length);
          }
        }
      }
    } catch (err) {
      console.error("Session fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSessionData();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Listen to custom updates for real-time syncing
    window.addEventListener("cart-updated", fetchSessionData);
    window.addEventListener("wishlist-updated", fetchSessionData);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cart-updated", fetchSessionData);
      window.removeEventListener("wishlist-updated", fetchSessionData);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-luxury-black/90 backdrop-blur-md border-b border-primary-gold/20 py-2 shadow-lg"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary-gold/40 bg-luxury-black p-0.5 group-hover:border-primary-gold transition-all">
                <Image
                  src="/assets/logo.jpg"
                  alt="Sri Chakra Veeralakshmi Jewellery works logo"
                  fill
                  sizes="48px"
                  className="object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-sm sm:text-base font-bold tracking-wider text-primary-gold leading-none">
                  SRI CHAKRA
                </span>
                <span className="font-cormorant text-[10px] sm:text-xs tracking-widest text-champagne-gold font-semibold leading-none mt-1">
                  VEERALAKSHMI JEWELLERY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex space-x-1 xl:space-x-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-montserrat text-[11px] xl:text-xs uppercase font-medium tracking-wider text-ivory-white/80 hover:text-primary-gold px-3 py-2 transition-all relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[1px] after:bg-primary-gold after:transition-all hover:after:w-2/3 hover:after:left-1/6"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Icons Actions & Login (Cart/Wishlist) */}
            <div className="hidden sm:flex items-center gap-4">
              
              {/* Wishlist */}
              <Link
                href="/profile"
                className="relative p-2 text-ivory-white/80 hover:text-primary-gold transition-colors"
                title="Wishlist"
              >
                <Heart size={18} />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-royal-burgundy border border-primary-gold text-primary-gold font-montserrat text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-md">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-ivory-white/80 hover:text-primary-gold transition-colors"
                title="Shopping Bag"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-gold text-luxury-black font-montserrat text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>

              <span className="text-white/10 w-[1px] h-5" />

              {/* Auth Account Profile */}
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 font-montserrat text-xs uppercase font-semibold text-ivory-white/80 hover:text-primary-gold transition-colors"
                >
                  <User size={16} className="text-primary-gold" />
                  <span className="max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 font-montserrat text-xs uppercase font-semibold text-ivory-white/80 hover:text-primary-gold border border-white/10 hover:border-primary-gold px-4 py-2 rounded-sm bg-luxury-black/20 transition-all"
                >
                  <span>Sign In</span>
                </Link>
              )}

            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile Cart shortcut */}
              <Link href="/cart" className="relative p-2 text-ivory-white/80 hover:text-primary-gold">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-gold text-luxury-black font-montserrat text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleMenu}
                className="text-ivory-white hover:text-primary-gold p-2 transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-luxury-black/95 border-b border-primary-gold/20 overflow-hidden backdrop-blur-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block font-montserrat text-sm uppercase font-semibold tracking-widest text-ivory-white hover:text-primary-gold py-3 w-full text-center border-b border-white/5 transition-all"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Mobile CTAs */}
                <div className="pt-4 flex flex-col gap-3 w-full max-w-xs">
                  {user ? (
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-ivory-white border border-white/10 py-3.5 rounded-sm"
                    >
                      <User size={14} className="text-primary-gold" />
                      <span>My Profile Panel</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 font-montserrat text-xs uppercase font-bold tracking-widest text-luxury-black bg-primary-gold py-3.5 rounded-sm"
                    >
                      <span>Client Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
