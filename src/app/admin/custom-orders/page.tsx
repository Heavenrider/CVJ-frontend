"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Package, LogOut, LayoutDashboard, PlusCircle, FileText, Settings, HeartHandshake, Eye, Loader2, RefreshCw, X, Check, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CustomOrder {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  description: string;
  metalType: "GOLD" | "SILVER";
  designImage: string | null;
  status: string;
  createdAt: string;
}

export default function AdminCustomOrdersPage() {
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const router = useRouter();

  const loadCustomOrders = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/custom-orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCustomOrders(data.customOrders);
        } else {
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomOrders();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // In custom orders, we can update status via custom-orders PUT or a profile route
      // Let's implement custom order status updates directly in api/custom-orders
      // Wait, we need to make sure we support a PUT API on /api/custom-orders for status updates
      const res = await fetch("/api/custom-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        loadCustomOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white flex flex-col md:flex-row">
      
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-[#121212] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary-gold/30 bg-luxury-black p-0.5">
              <img
                src="/assets/logo.jpg"
                alt="Sri Chakra Veeralakshmi logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="font-playfair text-xs font-bold block text-ivory-white">Veeralakshmi Admin</span>
              <span className="font-montserrat text-[8px] uppercase tracking-wider text-primary-gold font-bold">Showroom Manager</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 font-montserrat text-xs uppercase font-bold tracking-wider">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-ivory-white/70 hover:bg-white/5 rounded-sm transition-all"
            >
              <LayoutDashboard size={15} />
              <span>Overview Panel</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-ivory-white/70 hover:bg-white/5 rounded-sm transition-all"
            >
              <PlusCircle size={15} />
              <span>Jewellery Stock</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-ivory-white/70 hover:bg-white/5 rounded-sm transition-all"
            >
              <FileText size={15} />
              <span>Customer Orders</span>
            </Link>
            <Link
              href="/admin/custom-orders"
              className="flex items-center gap-3 px-4 py-3 bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold rounded-sm transition-all"
            >
              <HeartHandshake size={15} />
              <span>Bespoke Atelier</span>
            </Link>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/5 mt-8 border-t border-white/5 transition-all text-xs font-montserrat uppercase font-bold tracking-wider cursor-pointer"
        >
          <LogOut size={15} />
          <span>Exit Dashboard</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-5">
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">Bespoke Custom Orders</h2>
            <p className="font-poppins text-xs text-ivory-white/45">Review uploaded design drawings and custom requirements</p>
          </div>
          
          <button
            onClick={loadCustomOrders}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-white/5 hover:border-primary-gold/40 text-xs font-montserrat uppercase font-bold tracking-wider rounded-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Reload Requests"}</span>
          </button>
        </div>

        {/* Custom Orders Ledger */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-sm">
          <h3 className="font-playfair text-lg font-bold border-b border-white/5 pb-4 mb-4">Atelier Submissions</h3>
          
          {customOrders.length === 0 ? (
            <div className="text-center py-10 text-ivory-white/35 text-xs font-poppins">No custom design requests submitted yet.</div>
          ) : (
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left text-xs font-poppins border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-ivory-white/45 font-montserrat uppercase text-[9px] tracking-wider">
                    <th className="py-3 px-4">Customer info</th>
                    <th className="py-3 px-4">Design Sketch</th>
                    <th className="py-3 px-4">Requirements Description</th>
                    <th className="py-3 px-4">State Status</th>
                    <th className="py-3 px-4">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-ivory-white/85">
                  {customOrders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      
                      {/* Customer Details */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">{order.name}</span>
                          <span className="text-primary-gold">{order.phone}</span>
                          {order.email && <span className="text-[10px] text-ivory-white/40">{order.email}</span>}
                        </div>
                      </td>

                      {/* Design Image Sketch */}
                      <td className="py-4 px-4">
                        {order.designImage ? (
                          <button
                            onClick={() => setSelectedImage(order.designImage)}
                            className="w-12 h-12 rounded-sm border border-white/10 overflow-hidden flex items-center justify-center bg-luxury-black cursor-pointer hover:border-primary-gold transition-all"
                            title="Click to zoom sketch"
                          >
                            <img
                              src={order.designImage}
                              alt="Customer sketch blueprint"
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ) : (
                          <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center text-white/20 border border-white/5">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </td>

                      {/* Requirements Description */}
                      <td className="py-4 px-4 max-w-xs md:max-w-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-montserrat text-[8px] uppercase tracking-widest text-primary-gold font-bold">{order.metalType} Jewellery</span>
                          <p className="line-clamp-2 leading-relaxed text-ivory-white/70">{order.description}</p>
                        </div>
                      </td>

                      {/* Status select dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-luxury-black border border-white/10 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-sm outline-none text-champagne-gold cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-ivory-white/55">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* Sketch zoom Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-luxury-black cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-xl max-h-[80vh] bg-[#121212] border border-primary-gold/25 p-3 rounded-sm z-10"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-ivory-white/60 hover:text-rose-400 p-2 bg-luxury-black/60 border border-white/5 rounded-full z-20 cursor-pointer"
              >
                <X size={16} />
              </button>
              <img
                src={selectedImage}
                alt="Zoomed customer drawing sketch"
                className="w-full h-auto max-h-[70vh] object-contain rounded-sm"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
