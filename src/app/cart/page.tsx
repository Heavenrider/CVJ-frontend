"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, Heart, ArrowRight, Loader2, Coins, Percent, ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  purity: string;
  weight: number;
  metalType: "GOLD" | "SILVER";
  makingChargesPerGram: number;
  description: string;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface RatesData {
  gold24k: { rate: number };
  gold22k: { rate: number };
  silver: { rate: number };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [rates, setRates] = useState<RatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const router = useRouter();

  const fetchCartAndRates = async () => {
    try {
      const [resCart, resRates] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/rates"),
      ]);

      if (resCart.ok && resRates.ok) {
        const cartData = await resCart.json();
        const ratesData = await resRates.json();
        
        if (cartData.success) {
          setCartItems(cartData.cart);
        }
        if (ratesData.success) {
          setRates(ratesData);
        }
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Cart init failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndRates();
  }, []);

  const handleUpdateQuantity = async (cartItemId: string, currentQty: number, newQty: number) => {
    setUpdatingItemId(cartItemId);
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: newQty }),
      });
      if (res.ok) {
        fetchCartAndRates();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteItem = async (cartItemId: string) => {
    setUpdatingItemId(cartItemId);
    try {
      const res = await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCartAndRates();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleSaveForLater = async (productId: string, cartItemId: string) => {
    setUpdatingItemId(cartItemId);
    try {
      // 1. Add to wishlist
      const resWish = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (resWish.ok) {
        // 2. Remove from cart
        await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
        fetchCartAndRates();
        alert("Item saved to wishlist!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Pricing engine definitions
  const getMetalRate = (purity: string) => {
    const gold24k = rates?.gold24k?.rate || 7450;
    const gold22k = rates?.gold22k?.rate || 6830;
    const gold18k = gold22k * 18 / 22;
    const silver = rates?.silver?.rate || 92.5;

    switch (purity) {
      case "24K": return gold24k;
      case "22K": return gold22k;
      case "18K": return gold18k;
      case "Silver 99.9%": return silver;
      default: return gold22k;
    }
  };

  // Calculations
  const calculateCartBilling = () => {
    let metalTotal = 0;
    let makingTotal = 0;

    cartItems.forEach((item) => {
      const rate = getMetalRate(item.product.purity);
      metalTotal += rate * item.product.weight * item.quantity;
      makingTotal += item.product.makingChargesPerGram * item.product.weight * item.quantity;
    });

    const subtotal = metalTotal + makingTotal;
    const gst = subtotal * 0.03;
    // Insured shipping: Free above ₹25,000, else flat ₹350
    const shipping = subtotal > 25000 ? 0 : 350;
    const grandTotal = subtotal + gst + shipping;

    return {
      metalCost: metalTotal,
      makingCost: makingTotal,
      subtotal,
      gst,
      shipping,
      grandTotal,
    };
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-gold animate-spin" />
      </div>
    );
  }

  const bill = calculateCartBilling();

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white pt-24 pb-16">
      
      {/* Background visual highlight */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-royal-burgundy/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-8">
          <Link href="/" className="text-primary-gold hover:text-champagne-gold transition-colors mr-2">
            <ArrowLeft size={20} />
          </Link>
          <ShoppingBag className="text-primary-gold" />
          <h2 className="font-playfair text-2xl font-bold tracking-wide">Shopping Bag ({cartItems.length})</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 text-ivory-white/50 space-y-4">
            <ShoppingBag size={64} className="mx-auto text-white/5" />
            <p className="font-poppins text-base">Your shopping bag is empty.</p>
            <Link href="/#collections" className="inline-block px-8 py-3.5 bg-primary-gold hover:bg-champagne-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item) => {
                const itemRate = getMetalRate(item.product.purity);
                const itemTotal = (itemRate * item.product.weight + item.product.makingChargesPerGram * item.product.weight) * 1.03 * item.quantity;

                return (
                  <div key={item.id} className="bg-[#121212] border border-white/5 p-5 sm:p-6 rounded-sm flex flex-col sm:flex-row justify-between gap-6 relative">
                    
                    {updatingItemId === item.id && (
                      <div className="absolute inset-0 bg-luxury-black/60 flex items-center justify-center z-10 rounded-sm">
                        <Loader2 className="w-6 h-6 text-primary-gold animate-spin" />
                      </div>
                    )}

                    {/* Left: Silhouette Image placeholder */}
                    <div className="w-24 h-24 bg-luxury-black rounded-sm border border-white/5 flex items-center justify-center shrink-0">
                      <ShoppingBag className="text-primary-gold/40 w-8 h-8" />
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 space-y-2 text-left">
                      <span className="font-cormorant text-xs italic tracking-widest text-primary-gold uppercase font-bold">
                        {item.product.metalType} • {item.product.purity}
                      </span>
                      <h4 className="font-playfair text-base sm:text-lg font-bold text-ivory-white">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-4 text-xs font-poppins text-ivory-white/50">
                        <span>Weight: {item.product.weight}g</span>
                        <span>Rate: {formatCurrency(itemRate)}/g</span>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-3 pt-3">
                        <span className="font-montserrat text-[9px] uppercase tracking-wider text-ivory-white/40">Qty:</span>
                        <div className="flex items-center bg-luxury-black border border-white/10 rounded-sm">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity - 1)}
                            className="px-2.5 py-1 text-ivory-white/70 hover:text-primary-gold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-montserrat text-xs text-ivory-white">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity + 1)}
                            className="px-2.5 py-1 text-ivory-white/70 hover:text-primary-gold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing Breakdown & Delete */}
                    <div className="sm:text-right flex flex-col justify-between items-start sm:items-end gap-4 shrink-0">
                      <div>
                        <span className="font-montserrat text-[8px] uppercase tracking-wider text-ivory-white/40 block leading-none">Subtotal (with GST)</span>
                        <span className="font-playfair text-lg sm:text-xl font-bold text-champagne-gold mt-1 block">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveForLater(item.product.id, item.id)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:border-primary-gold/45 text-ivory-white/70 hover:text-primary-gold font-montserrat text-[9px] uppercase font-bold tracking-wider rounded-sm transition-all cursor-pointer"
                        >
                          <Heart size={10} />
                          <span>Save for Later</span>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 border border-rose-500/10 rounded-sm transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Cart Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-[#121212] border border-primary-gold/25 p-6 rounded-sm shadow-md space-y-6">
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Coins size={15} className="text-primary-gold" />
                  <h4 className="font-montserrat text-xs uppercase font-bold tracking-widest text-primary-gold">
                    Invoice Summary
                  </h4>
                </div>

                <div className="space-y-3 font-poppins text-xs text-ivory-white/75">
                  <div className="flex justify-between">
                    <span>Base Metal Value</span>
                    <span>{formatCurrency(bill.metalCost)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Making Charges</span>
                    <span>{formatCurrency(bill.makingCost)}</span>
                  </div>

                  <div className="flex justify-between border-t border-white/5 pt-2 text-ivory-white/40">
                    <span>Subtotal</span>
                    <span>{formatCurrency(bill.subtotal)}</span>
                  </div>

                  <div className="flex justify-between flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span>GST (3%)</span>
                      <span className="text-[9px] text-ivory-white/30 flex items-center gap-0.5">
                        <Percent size={9} />
                        Govt Standard
                      </span>
                    </span>
                    <span>{formatCurrency(bill.gst)}</span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span>Insured Luxury Shipping</span>
                    <span>{bill.shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : formatCurrency(bill.shipping)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-champagne-gold pt-2">
                    <span className="font-playfair tracking-wide uppercase text-xs font-bold text-ivory-white">Grand Total</span>
                    <span className="font-playfair text-xl">{formatCurrency(bill.grandTotal)}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-3 rounded-sm flex items-start gap-2.5 text-[10px] font-poppins text-ivory-white/45 leading-normal">
                  <ShieldAlert size={14} className="text-primary-gold shrink-0 mt-0.5" />
                  <span>Insured shipping guarantees the safety of precious jewellery from our showroom directly to your doorstep.</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold hover:from-champagne-gold hover:to-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </Link>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
