"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Coins, ShieldCheck, CheckCircle2, Loader2, ArrowRight, CreditCard, ChevronRight, Plus, ArrowLeft, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    purity: string;
    weight: number;
    makingChargesPerGram: number;
  };
}

interface RatesData {
  gold24k: { rate: number };
  gold22k: { rate: number };
  silver: { rate: number };
}

export default function CheckoutPage() {
  const [step, setStep] = useState<"address" | "review" | "success" | "failure">("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [rates, setRates] = useState<RatesData | null>(null);
  
  // New Address Form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressPostal, setAddressPostal] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("RAZORPAY");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Dynamically load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const initCheckoutData = async () => {
      try {
        const [resProfile, resCart, resRates] = await Promise.all([
          fetch("/api/auth/profile"),
          fetch("/api/cart"),
          fetch("/api/rates")
        ]);

        if (resProfile.ok && resCart.ok && resRates.ok) {
          const profileData = await resProfile.json();
          const cartData = await resCart.json();
          const ratesData = await resRates.json();

          if (profileData.success) {
            setAddresses(profileData.user.addresses);
            const defAddr = profileData.user.addresses.find((a: Address) => a.isDefault);
            if (defAddr) setSelectedAddressId(defAddr.id);
            else if (profileData.user.addresses.length > 0) setSelectedAddressId(profileData.user.addresses[0].id);
          }
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initCheckoutData();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressAction: "create",
          addressData: {
            name: addressName,
            phone: addressPhone,
            street: addressStreet,
            city: addressCity,
            state: addressState,
            postalCode: addressPostal,
            country: "India",
            isDefault: addresses.length === 0, // set default if first
            type: "SHIPPING"
          }
        })
      });

      if (res.ok) {
        setShowAddressForm(false);
        // Reload profile address list
        const resProf = await fetch("/api/auth/profile");
        const dataProf = await resProf.json();
        if (dataProf.success) {
          setAddresses(dataProf.user.addresses);
          // Auto select newly created address
          const created = dataProf.user.addresses[dataProf.user.addresses.length - 1];
          if (created) setSelectedAddressId(created.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const calculateInvoice = () => {
    let metal = 0;
    let making = 0;
    cartItems.forEach(item => {
      const rate = getMetalRate(item.product.purity);
      metal += rate * item.product.weight * item.quantity;
      making += item.product.makingChargesPerGram * item.product.weight * item.quantity;
    });

    const subtotal = metal + making;
    const gst = subtotal * 0.03;
    const shipping = subtotal > 25000 ? 0 : 350;
    const total = subtotal + gst + shipping;

    return { subtotal, gst, shipping, total };
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a shipping address first");
      return;
    }

    setPlacingOrder(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddressId, paymentMethod })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to place order.");
        setPlacingOrder(false);
        return;
      }

      // 1. If Razorpay checkout required
      if (data.paymentRequired && data.razorpayOrderId) {
        // If it is a mock payment key or order, bypass the real Razorpay modal
        if (data.keyId === "rzp_test_mock_id_12345" || data.razorpayOrderId.startsWith("rzp_mock_order_")) {
          setTimeout(async () => {
            try {
              const verifyRes = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpayOrderId: data.razorpayOrderId,
                  razorpayPaymentId: "rzp_mock_pay_" + Math.random().toString(36).substring(2, 9),
                  razorpaySignature: "mock_signature_abc123",
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setPlacedOrderId(data.orderId);
                window.dispatchEvent(new Event("cart-updated"));
                setStep("success");
              } else {
                setError(verifyData.message || "Payment signature verification failed. Please contact support.");
                setStep("failure");
              }
            } catch (err) {
              setError("Payment verification timed out. Please contact us.");
              setStep("failure");
            } finally {
              setPlacingOrder(false);
            }
          }, 1500);
          return;
        }

        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Sri Chakra Veeralakshmi Jewellery",
          description: "Order Checkout Payment",
          image: "/assets/logo.jpg",
          order_id: data.razorpayOrderId,
          handler: async function (response: any) {
            // Callback triggers after successful payment authorization
            try {
              const verifyRes = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setPlacedOrderId(data.orderId);
                window.dispatchEvent(new Event("cart-updated"));
                setStep("success");
              } else {
                setError(verifyData.message || "Payment signature verification failed. Please contact support.");
                setStep("failure");
              }
            } catch (err) {
              setError("Payment verification timed out. Please contact us.");
              setStep("failure");
            } finally {
              setPlacingOrder(false);
            }
          },
          prefill: {
            name: data.user.name,
            email: data.user.email,
          },
          theme: {
            color: "#6D001A", // Royal Burgundy
          },
          modal: {
            ondismiss: function () {
              setPlacingOrder(false);
              setError("Payment checkout window was closed.");
              setStep("failure");
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // 2. COD placed successfully
        setPlacedOrderId(data.orderId);
        window.dispatchEvent(new Event("cart-updated"));
        setStep("success");
        setPlacingOrder(false);
      }

    } catch (err) {
      setError("Network error. Please try again.");
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-gold animate-spin" />
      </div>
    );
  }

  const bill = calculateInvoice();
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white pt-24 pb-16">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-royal-burgundy/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Step Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <h2 className="font-playfair text-2xl font-bold tracking-wide">Checkout Flow</h2>
          </div>

          {step !== "success" && (
            <div className="flex items-center gap-2 font-montserrat text-[9px] uppercase font-bold tracking-widest text-ivory-white/40">
              <span className={step === "address" ? "text-primary-gold" : ""}>Shipping</span>
              <ChevronRight size={10} />
              <span className={step === "review" ? "text-primary-gold" : ""}>Review & Pay</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/25 rounded-sm text-xs text-rose-400 font-poppins">
            {error}
          </div>
        )}

        {/* STEP 1: Address Selection */}
        {step === "address" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Address List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="font-playfair text-lg font-bold">Select Shipping Address</h3>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-royal-burgundy border border-primary-gold/30 hover:border-primary-gold text-primary-gold font-montserrat text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {showAddressForm ? (
                /* Address Add Form */
                <form onSubmit={handleAddNewAddress} className="bg-[#121212] border border-primary-gold/20 p-5 rounded-sm space-y-4 max-w-xl">
                  <h4 className="font-playfair text-sm text-primary-gold font-bold">New Shipping Address</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={addressName}
                      onChange={(e) => setAddressName(e.target.value)}
                      placeholder="Recipient Name"
                      className="bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                    />
                    <input
                      type="tel"
                      required
                      value={addressPhone}
                      onChange={(e) => setAddressPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="Street Address, House No, Area..."
                    className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="City"
                      className="bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                    />
                    <input
                      type="text"
                      required
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      placeholder="State"
                      className="bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                    />
                    <input
                      type="text"
                      required
                      value={addressPostal}
                      onChange={(e) => setAddressPostal(e.target.value)}
                      placeholder="Pincode"
                      className="bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary-gold text-luxury-black font-montserrat text-[9px] uppercase font-bold tracking-widest rounded-sm hover:bg-champagne-gold transition-colors cursor-pointer"
                    >
                      Save & Select
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-5 py-2 bg-white/5 text-ivory-white/70 font-montserrat text-[9px] uppercase font-bold tracking-widest rounded-sm hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Saved Address Cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`border p-5 rounded-sm cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "bg-royal-burgundy/10 border-primary-gold shadow-md"
                          : "bg-[#121212] border-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider">{addr.name}</span>
                        <input
                          type="radio"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="text-primary-gold focus:ring-0 cursor-pointer accent-primary-gold"
                        />
                      </div>
                      <p className="font-poppins text-xs text-ivory-white/70 leading-relaxed">
                        {addr.street},<br />
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <span className="block font-poppins text-[11px] text-ivory-white/40 mt-3">Phone: {addr.phone}</span>
                    </div>
                  ))}

                  {addresses.length === 0 && (
                    <div className="col-span-2 text-center py-10 border border-dashed border-white/10 text-ivory-white/50 text-xs font-poppins">
                      No saved addresses. Please click "Add Address" to input shipping details.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Sidebar Summary (4 cols) */}
            <div className="lg:col-span-4 bg-[#121212] border border-white/5 p-6 rounded-sm space-y-6">
              <h4 className="font-montserrat text-xs uppercase font-bold tracking-widest text-primary-gold border-b border-white/5 pb-3">Review Invoice</h4>
              
              <div className="space-y-2.5 font-poppins text-xs text-ivory-white/70">
                <div className="flex justify-between">
                  <span>Jewellery Price</span>
                  <span>{formatCurrency(bill.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3%)</span>
                  <span>{formatCurrency(bill.gst)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span>Insured Shipping</span>
                  <span>{bill.shipping === 0 ? "FREE" : formatCurrency(bill.shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-champagne-gold pt-2">
                  <span className="font-playfair uppercase text-xs font-bold text-ivory-white">Total</span>
                  <span className="font-playfair text-lg">{formatCurrency(bill.total)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep("review")}
                disabled={!selectedAddressId}
                className="w-full py-4 bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Review & Payment Options */}
        {step === "review" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Review Section (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <button
                onClick={() => setStep("address")}
                className="flex items-center gap-1.5 font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/60 hover:text-primary-gold transition-colors cursor-pointer"
              >
                <ArrowLeft size={12} />
                <span>Back to Shipping</span>
              </button>

              {/* Selected Address Display */}
              <div className="bg-[#121212] border border-white/5 p-5 rounded-sm text-left">
                <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-primary-gold mb-3 flex items-center gap-1.5">
                  <MapPin size={13} />
                  <span>Deliver To:</span>
                </h4>
                {selectedAddress && (
                  <p className="font-poppins text-xs text-ivory-white/85 leading-relaxed">
                    <strong className="block text-ivory-white mb-1">{selectedAddress.name} ({selectedAddress.phone})</strong>
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-[#121212] border border-white/5 p-5 rounded-sm text-left space-y-4">
                <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-primary-gold mb-3 flex items-center gap-1.5">
                  <CreditCard size={13} />
                  <span>Select Payment Method:</span>
                </h4>

                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                      paymentMethod === "RAZORPAY"
                        ? "bg-royal-burgundy/10 border-primary-gold"
                        : "bg-luxury-black/35 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "RAZORPAY"}
                        onChange={() => setPaymentMethod("RAZORPAY")}
                        className="text-primary-gold focus:ring-0 cursor-pointer accent-primary-gold"
                      />
                      <div>
                        <span className="font-montserrat text-xs font-bold block text-ivory-white">Secure Online Checkout</span>
                        <span className="font-poppins text-[10px] text-ivory-white/40 block mt-0.5">Pay securely using Cards, UPI (GPay, PhonePe, Paytm), or Net Banking</span>
                      </div>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "bg-royal-burgundy/10 border-primary-gold"
                        : "bg-luxury-black/35 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="text-primary-gold focus:ring-0 cursor-pointer accent-primary-gold"
                      />
                      <div>
                        <span className="font-montserrat text-xs font-bold block text-ivory-white">Cash on Delivery (COD)</span>
                        <span className="font-poppins text-[10px] text-ivory-white/40 block mt-0.5">Pay by cash or UPI during package delivery at your address</span>
                      </div>
                    </div>
                  </label>
                </div>

              </div>

            </div>

            {/* Invoice Review Box (4 cols) */}
            <div className="lg:col-span-4 bg-[#121212] border border-primary-gold/25 p-6 rounded-sm shadow-md space-y-6">
              <h4 className="font-montserrat text-xs uppercase font-bold tracking-widest text-primary-gold border-b border-white/5 pb-3">Final Invoice</h4>
              
              <div className="space-y-2.5 font-poppins text-xs text-ivory-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(bill.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3%)</span>
                  <span>{formatCurrency(bill.gst)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span>Insured Shipping</span>
                  <span>{bill.shipping === 0 ? "FREE" : formatCurrency(bill.shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-champagne-gold pt-2">
                  <span className="font-playfair uppercase text-xs font-bold text-ivory-white">Total Amount</span>
                  <span className="font-playfair text-xl text-primary-gold">{formatCurrency(bill.total)}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-3 rounded-sm flex items-start gap-2 text-[10px] font-poppins text-ivory-white/45 leading-normal">
                <ShieldCheck size={14} className="text-primary-gold shrink-0 mt-0.5" />
                <span>Insured shipping guarantees the safety of precious jewellery from our showroom directly to your doorstep.</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full py-4 bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold hover:from-champagne-gold hover:to-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {placingOrder ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Order Success Confirmation */}
        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-[#121212] border border-primary-gold/25 p-8 sm:p-12 rounded-sm text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={32} />
            </div>

            <span className="font-cormorant text-base italic tracking-widest text-primary-gold font-bold uppercase block">
              Transaction Confirmed
            </span>

            <h3 className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide text-ivory-white">
              Thank You For Your Purchase
            </h3>

            <p className="font-poppins text-xs sm:text-sm text-ivory-white/70 leading-relaxed max-w-sm mx-auto">
              Your order has been recorded successfully. An automated invoice receipt and tracking link will be sent to your registered email address.
            </p>

            <div className="bg-luxury-black border border-white/5 py-3 px-5 rounded-sm inline-block font-montserrat text-xs tracking-wider text-champagne-gold">
              Order ID: #{placedOrderId.slice(0, 8).toUpperCase()}
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/profile"
                className="px-6 py-3 border border-primary-gold/40 hover:border-primary-gold text-primary-gold font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all text-center"
              >
                Track Order Timeline
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm hover:bg-champagne-gold transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>

          </motion.div>
        )}

        {/* STEP 4: Order Payment Failure */}
        {step === "failure" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-[#121212] border border-rose-500/25 p-8 sm:p-12 rounded-sm text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/25 rounded-full flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle size={32} />
            </div>

            <span className="font-cormorant text-base italic tracking-widest text-rose-400 font-bold uppercase block">
              Payment Declined
            </span>

            <h3 className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide text-ivory-white">
              Transaction Unsuccessful
            </h3>

            <p className="font-poppins text-xs sm:text-sm text-ivory-white/70 leading-relaxed max-w-sm mx-auto">
              {error || "We could not authorize your payment. Please verify your details or select another payment option."}
            </p>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setStep("review");
                  setError("");
                }}
                className="px-6 py-3 border border-primary-gold/40 hover:border-primary-gold text-primary-gold font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all text-center cursor-pointer"
              >
                Retry Payment
              </button>
              <Link
                href="/cart"
                className="px-6 py-3 bg-white/5 text-ivory-white/70 font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm hover:bg-white/10 transition-colors text-center"
              >
                Return to Bag
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
