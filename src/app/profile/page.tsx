"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Package, Heart, LogOut, Loader2, Plus, Trash2, Calendar, ShoppingCart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: string;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  weightPerUnit: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "RAZORPAY" | "UPI";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    purity: string;
    weight: number;
    description: string;
    metalType: string;
  };
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  addresses: Address[];
  orders: Order[];
  wishlist: WishlistItem[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders" | "wishlist">("orders");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressName, setAddressName] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressPostal, setAddressPostal] = useState("");
  const [addressDefault, setAddressDefault] = useState(false);

  const router = useRouter();

  const [fetchError, setFetchError] = useState("");

  const fetchProfile = async () => {
    try {
      setFetchError("");
      const res = await fetch("/api/auth/profile");
      if (res.status === 401) {
        // Not logged in at all — redirect to login
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
          setProfileName(data.user.name);
          setProfilePhone(data.user.phone || "");
        } else {
          setFetchError(data.message || "Could not load profile.");
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setFetchError(data.message || "Could not load your profile. Please log out and sign in again.");
      }
    } catch (err) {
      console.error(err);
      setFetchError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMessage("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      });
      if (res.ok) {
        setProfileMessage("Profile updated successfully!");
        fetchProfile();
      }
    } catch (err) {
      setProfileMessage("Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const action = editingAddress ? "update" : "create";
      const payload = {
        addressAction: action,
        addressData: {
          id: editingAddress?.id || undefined,
          name: addressName,
          phone: addressPhone,
          street: addressStreet,
          city: addressCity,
          state: addressState,
          postalCode: addressPostal,
          country: "India",
          isDefault: addressDefault,
          type: "SHIPPING",
        },
      };

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddressForm(false);
        setEditingAddress(null);
        fetchProfile();
        // Clear fields
        setAddressName("");
        setAddressPhone("");
        setAddressStreet("");
        setAddressCity("");
        setAddressState("");
        setAddressPostal("");
        setAddressDefault(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressName(addr.name);
    setAddressPhone(addr.phone);
    setAddressStreet(addr.street);
    setAddressCity(addr.city);
    setAddressState(addr.state);
    setAddressPostal(addr.postalCode);
    setAddressDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressAction: "delete",
          addressData: { id: addrId },
        }),
      });
      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWishlist = async (wishId: string) => {
    try {
      const res = await fetch(`/api/wishlist?id=${wishId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToCart = async (productId: string, wishId: string) => {
    try {
      // 1. Add to cart
      const resCart = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      
      if (resCart.ok) {
        // 2. Remove from wishlist
        await handleDeleteWishlist(wishId);
        alert("Item moved to cart successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getOrderStatusStep = (status: Order["status"]) => {
    const steps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-gold animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-full max-w-md bg-[#121212] border border-rose-500/25 rounded-sm p-8 text-center space-y-4">
          <p className="font-playfair text-xl text-rose-400">Session Error</p>
          <p className="font-poppins text-sm text-ivory-white/60">{fetchError}</p>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
            }}
            className="mt-4 px-6 py-3 bg-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm hover:bg-champagne-gold transition-colors"
          >
            Log Out &amp; Sign In Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white pt-24 pb-16">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-royal-burgundy/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Bar (3 cols) */}
          <div className="lg:col-span-3 bg-[#121212] border border-white/5 p-6 rounded-sm space-y-6">
            
            <div className="flex flex-col items-center text-center pb-6 border-b border-white/5">
              <div className="w-20 h-20 bg-royal-burgundy rounded-full flex items-center justify-center mb-4 border border-primary-gold">
                <User size={36} className="text-primary-gold" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-ivory-white">{userData.name}</h3>
              <p className="font-poppins text-xs text-ivory-white/45">{userData.email}</p>
              
              {userData.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="mt-3 px-4 py-1.5 bg-primary-gold/10 border border-primary-gold/30 hover:border-primary-gold text-primary-gold rounded-full font-montserrat text-[10px] uppercase font-bold tracking-widest transition-all"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            <div className="flex flex-col gap-1 font-montserrat text-xs uppercase font-bold tracking-wider">
              <button
                onClick={() => { setActiveTab("orders"); setShowAddressForm(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all ${
                  activeTab === "orders" ? "bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold" : "text-ivory-white/70 hover:bg-white/5"
                }`}
              >
                <Package size={15} />
                <span>My Orders</span>
              </button>
              <button
                onClick={() => { setActiveTab("wishlist"); setShowAddressForm(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all ${
                  activeTab === "wishlist" ? "bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold" : "text-ivory-white/70 hover:bg-white/5"
                }`}
              >
                <Heart size={15} />
                <span>My Wishlist</span>
              </button>
              <button
                onClick={() => { setActiveTab("addresses"); setShowAddressForm(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all ${
                  activeTab === "addresses" ? "bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold" : "text-ivory-white/70 hover:bg-white/5"
                }`}
              >
                <MapPin size={15} />
                <span>Saved Addresses</span>
              </button>
              <button
                onClick={() => { setActiveTab("profile"); setShowAddressForm(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all ${
                  activeTab === "profile" ? "bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold" : "text-ivory-white/70 hover:bg-white/5"
                }`}
              >
                <User size={15} />
                <span>Account Profile</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-sm text-left text-rose-400 hover:bg-rose-500/5 mt-6 border-t border-white/5 transition-all cursor-pointer"
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>

          </div>

          {/* Right Dashboard Area (9 cols) */}
          <div className="lg:col-span-9 bg-[#121212] border border-white/5 p-6 sm:p-8 rounded-sm min-h-[480px]">
            
            {/* Tab: Orders (Default) */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="font-playfair text-xl font-bold border-b border-white/5 pb-4">Order History</h3>
                
                {userData.orders.length === 0 ? (
                  <div className="text-center py-16 text-ivory-white/50 space-y-4">
                    <Package size={48} className="mx-auto text-white/10" />
                    <p className="font-poppins text-sm">You have not placed any orders yet.</p>
                    <Link href="/#collections" className="inline-block px-6 py-3 bg-primary-gold hover:bg-champagne-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-colors">
                      Browse Jewellery
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {userData.orders.map((order) => {
                      const currentStep = getOrderStatusStep(order.status);
                      const isCancelled = order.status === "CANCELLED";

                      return (
                        <div key={order.id} className="border border-white/5 rounded-sm bg-luxury-black/45 p-6 space-y-6">
                          
                          {/* Order Card Header */}
                          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3 text-xs text-ivory-white/60 font-poppins">
                              <div className="flex items-center gap-1">
                                <Calendar size={13} className="text-primary-gold" />
                                <span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                              </div>
                              <span>•</span>
                              <span>ID: #{order.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-montserrat text-[9px] uppercase tracking-wider text-ivory-white/40 block">Total Price</span>
                              <span className="font-playfair text-lg font-bold text-champagne-gold">{formatCurrency(order.total)}</span>
                            </div>
                          </div>

                          {/* Order Items List */}
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-xs font-poppins">
                                <div>
                                  <span className="font-semibold text-ivory-white">{item.product.name}</span>
                                  <span className="text-ivory-white/40 ml-2">x{item.quantity}</span>
                                </div>
                                <span className="text-ivory-white/70 font-semibold">{formatCurrency(item.pricePerUnit * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Order Tracking Timeline */}
                          {!isCancelled ? (
                            <div className="pt-6 border-t border-white/5">
                              <span className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-primary-gold mb-6">
                                Order Delivery Timeline
                              </span>
                              
                              <div className="relative flex items-center justify-between">
                                {/* Timeline Progress Line */}
                                <div className="absolute left-0 right-0 top-3 h-[2px] bg-white/10 z-0" />
                                <div 
                                  className="absolute left-0 top-3 h-[2px] bg-primary-gold z-0 transition-all duration-500" 
                                  style={{ width: `${(currentStep / 4) * 100}%` }}
                                />

                                {/* Step nodes */}
                                {["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map((lbl, idx) => (
                                  <div key={lbl} className="relative z-10 flex flex-col items-center">
                                    <div 
                                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border text-[9px] font-bold ${
                                        currentStep >= idx
                                          ? "bg-royal-burgundy border-primary-gold text-primary-gold"
                                          : "bg-[#141414] border-white/10 text-ivory-white/30"
                                      }`}
                                    >
                                      {idx + 1}
                                    </div>
                                    <span 
                                      className={`text-[9px] font-montserrat uppercase tracking-wider mt-2 whitespace-nowrap ${
                                        currentStep >= idx ? "text-primary-gold font-bold" : "text-ivory-white/30"
                                      }`}
                                    >
                                      {lbl}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-sm text-center text-rose-400 font-montserrat text-[10px] uppercase font-bold tracking-widest">
                              This order has been cancelled
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Wishlist */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <h3 className="font-playfair text-xl font-bold border-b border-white/5 pb-4">My Wishlist</h3>
                
                {userData.wishlist.length === 0 ? (
                  <div className="text-center py-16 text-ivory-white/50 space-y-4">
                    <Heart size={48} className="mx-auto text-white/10" />
                    <p className="font-poppins text-sm">Your wishlist is currently empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userData.wishlist.map((item) => (
                      <div key={item.id} className="border border-white/5 bg-luxury-black/45 p-5 rounded-sm flex flex-col justify-between hover:border-primary-gold/30 transition-all group">
                        
                        <div>
                          <span className="font-cormorant text-xs italic tracking-widest text-primary-gold uppercase font-bold">
                            {item.product.metalType} • {item.product.purity}
                          </span>
                          
                          <h4 className="font-playfair text-base font-semibold text-ivory-white mt-1 mb-2">
                            {item.product.name}
                          </h4>
                          
                          <p className="font-poppins text-[11px] text-ivory-white/50 line-clamp-2">
                            {item.product.description}
                          </p>
                          
                          <span className="block font-poppins text-[11px] text-ivory-white/40 mt-3">
                            Weight: {item.product.weight}g
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                          <button
                            onClick={() => handleMoveToCart(item.product.id, item.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-gold text-luxury-black font-montserrat text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-champagne-gold transition-colors cursor-pointer"
                          >
                            <ShoppingCart size={12} />
                            <span>Add To Cart</span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteWishlist(item.id)}
                            className="p-3 bg-white/5 hover:bg-rose-500/10 text-ivory-white/60 hover:text-rose-400 border border-white/5 rounded-sm transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="font-playfair text-xl font-bold">Saved Addresses</h3>
                  
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressForm(true);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-royal-burgundy border border-primary-gold/30 hover:border-primary-gold text-primary-gold font-montserrat text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>New Address</span>
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  /* Address Input Form */
                  <form onSubmit={handleAddressSubmit} className="bg-luxury-black/45 border border-primary-gold/25 p-6 rounded-sm space-y-4 max-w-xl">
                    <h4 className="font-playfair text-base font-semibold text-primary-gold mb-4">
                      {editingAddress ? "Edit Saved Address" : "Add New Shipping Address"}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={addressName}
                          onChange={(e) => setAddressName(e.target.value)}
                          placeholder="Name"
                          className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2 rounded-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={addressPhone}
                          onChange={(e) => setAddressPhone(e.target.value)}
                          placeholder="Contact phone"
                          className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2 rounded-sm outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Street Address</label>
                      <input
                        type="text"
                        required
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                        placeholder="House, building, street, area..."
                        className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2 rounded-sm outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">City</label>
                        <input
                          type="text"
                          required
                          value={addressCity}
                          onChange={(e) => setAddressCity(e.target.value)}
                          placeholder="City"
                          className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2 rounded-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">State</label>
                        <input
                          type="text"
                          required
                          value={addressState}
                          onChange={(e) => setAddressState(e.target.value)}
                          placeholder="State"
                          className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2 rounded-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Postal Pincode</label>
                        <input
                          type="text"
                          required
                          value={addressPostal}
                          onChange={(e) => setAddressPostal(e.target.value)}
                          placeholder="533315"
                          className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2 rounded-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        id="addr-def"
                        type="checkbox"
                        checked={addressDefault}
                        onChange={(e) => setAddressDefault(e.target.checked)}
                        className="rounded border-white/10 text-primary-gold accent-primary-gold focus:ring-0"
                      />
                      <label htmlFor="addr-def" className="font-poppins text-xs text-ivory-white/70 cursor-pointer select-none">
                        Set as default shipping address
                      </label>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-white/5">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-primary-gold text-luxury-black font-montserrat text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-champagne-gold transition-colors cursor-pointer"
                      >
                        {editingAddress ? "Save Changes" : "Save Address"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-ivory-white/70 font-montserrat text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                  </form>
                ) : (
                  /* Address Cards Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userData.addresses.map((addr) => (
                      <div key={addr.id} className="border border-white/5 bg-luxury-black/45 p-5 rounded-sm flex flex-col justify-between hover:border-primary-gold/15 transition-all">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-montserrat text-[10px] uppercase font-bold tracking-wider text-ivory-white">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="bg-primary-gold/10 border border-primary-gold/25 text-primary-gold font-montserrat text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm">Default</span>
                            )}
                          </div>
                          
                          <p className="font-poppins text-xs text-ivory-white/75 leading-relaxed">
                            {addr.street},<br />
                            {addr.city}, {addr.state} - {addr.postalCode}<br />
                            {addr.country}
                          </p>
                          <span className="block font-poppins text-xs text-ivory-white/45 mt-3">Phone: {addr.phone}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                          <button
                            onClick={() => handleEditAddress(addr)}
                            className="flex-1 py-2 text-center border border-white/10 hover:border-primary-gold font-montserrat text-[9px] uppercase font-semibold tracking-wider text-ivory-white hover:text-primary-gold transition-colors rounded-sm cursor-pointer"
                          >
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-2 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 border border-rose-500/10 rounded-sm transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* Tab: Profile Info */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="font-playfair text-xl font-bold border-b border-white/5 pb-4">Account Profile</h3>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  
                  {profileMessage && (
                    <div className="p-3 bg-primary-gold/10 border border-primary-gold/20 rounded-sm text-xs text-primary-gold font-poppins flex items-center gap-2">
                      <ShieldCheck size={14} />
                      <span>{profileMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">Email Address (Read Only)</label>
                    <input
                      type="text"
                      disabled
                      value={userData.email}
                      className="w-full bg-luxury-black/40 border border-white/5 text-ivory-white/50 text-xs sm:text-sm px-4 py-3 rounded-sm outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">Display Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Display Name"
                      className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm px-4 py-3 rounded-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-2">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="Enter mobile phone number"
                      className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs sm:text-sm px-4 py-3 rounded-sm outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-8 py-3.5 bg-gradient-to-r from-primary-gold via-champagne-gold to-primary-gold hover:from-champagne-gold hover:to-primary-gold text-luxury-black font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                  >
                    {updatingProfile ? "Saving changes..." : "Save Changes"}
                  </button>

                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
