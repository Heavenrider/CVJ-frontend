"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Package, LogOut, LayoutDashboard, PlusCircle, FileText, Settings, HeartHandshake, Eye, Loader2, RefreshCw, Printer, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  weightPerUnit: number;
  metalRateUsed: number;
  product: { name: string };
}

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "RAZORPAY" | "UPI";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  razorpayOrderId: string | null;
  subtotal: number;
  makingCharges: number;
  gst: number;
  shipping: number;
  total: number;
  createdAt: string;
  user: { name: string; email: string; phone: string };
  address: Address;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const router = useRouter();

  const loadOrders = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
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
    loadOrders();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        loadOrders();
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

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-print-area");
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    // Restore
    document.body.innerHTML = originalContent;
    window.location.reload(); // Refresh state after reprint
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
      
      {/* Sidebar navigation */}
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
              className="flex items-center gap-3 px-4 py-3 bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold rounded-sm transition-all"
            >
              <FileText size={15} />
              <span>Customer Orders</span>
            </Link>
            <Link
              href="/admin/custom-orders"
              className="flex items-center gap-3 px-4 py-3 text-ivory-white/70 hover:bg-white/5 rounded-sm transition-all"
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
            <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">Customer Orders</h2>
            <p className="font-poppins text-xs text-ivory-white/45">Review order progress, edit statuses, and download invoice receipts</p>
          </div>
          
          <button
            onClick={loadOrders}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-white/5 hover:border-primary-gold/40 text-xs font-montserrat uppercase font-bold tracking-wider rounded-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Reload Orders"}</span>
          </button>
        </div>

        {/* Orders Table registry */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-sm">
          <h3 className="font-playfair text-lg font-bold border-b border-white/5 pb-4 mb-4">Orders Ledger</h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-10 text-ivory-white/35 text-xs font-poppins">No customer orders recorded in database.</div>
          ) : (
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left text-xs font-poppins border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-ivory-white/45 font-montserrat uppercase text-[9px] tracking-wider">
                    <th className="py-3 px-4">Order Details</th>
                    <th className="py-3 px-4">Customer info</th>
                    <th className="py-3 px-4">Invoice</th>
                    <th className="py-3 px-4">Tracking Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-ivory-white/85">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      
                      {/* Order info */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-montserrat font-bold text-ivory-white">#{order.id.slice(0, 8).toUpperCase()}</span>
                          <span className="text-[10px] text-ivory-white/40 mt-1">Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                        </div>
                      </td>

                      {/* Customer info */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">{order.user.name}</span>
                          <span className="text-[10px] text-ivory-white/40">{order.user.email}</span>
                          <span className="text-[10px] text-ivory-white/40">Ph: {order.user.phone || order.address.phone}</span>
                        </div>
                      </td>

                      {/* Invoice billing details */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-champagne-gold">{formatCurrency(order.total)}</span>
                          <span className="text-[10px] text-ivory-white/40 mt-0.5">Method: {order.paymentMethod}</span>
                          <span className={`text-[8px] font-montserrat uppercase tracking-widest mt-1 block font-bold ${
                            order.paymentStatus === "COMPLETED" ? "text-emerald-400" : "text-amber-400"
                          }`}>{order.paymentStatus}</span>
                        </div>
                      </td>

                      {/* Status selectors */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-luxury-black border border-white/10 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-sm outline-none text-primary-gold cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* View Invoice Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 border border-white/10 hover:border-primary-gold hover:text-primary-gold font-montserrat text-[9px] uppercase font-bold tracking-widest rounded-sm transition-all cursor-pointer"
                        >
                          <Printer size={12} />
                          <span>Invoice</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* Invoice modal / Print canvas */}
      <AnimatePresence>
        {selectedInvoiceOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute inset-0 bg-luxury-black"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white text-luxury-black p-8 rounded-sm z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="absolute top-4 right-4 text-luxury-black/50 hover:text-rose-600 p-2 transition-colors cursor-pointer"
                aria-label="Close invoice popup"
              >
                <X size={20} />
              </button>

              {/* Printable Invoice Sheet Area */}
              <div id="invoice-print-area" className="space-y-8 p-4 bg-white text-black font-poppins">
                
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-6">
                  <div>
                    <h1 className="font-playfair text-2xl font-black tracking-wide uppercase leading-none">
                      Sri Chakra Veeralakshmi
                    </h1>
                    <span className="font-cormorant text-xs font-bold tracking-widest text-black/75 block mt-1 uppercase">
                      Jewellery Works
                    </span>
                    <p className="text-[10px] text-black/60 mt-4 leading-relaxed font-poppins">
                      Beside Ramu Medicals, Main Road,<br />
                      Alamuru, East Godavari, AP, 533315<br />
                      Contact: +91 9948625356
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="font-montserrat text-lg font-bold uppercase tracking-wider text-black">Retail Bill Invoice</h2>
                    <span className="text-xs font-mono block mt-1">No: #{selectedInvoiceOrder.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-[10px] text-black/60 block mt-2">Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                {/* Billing Addresses Grid */}
                <div className="grid grid-cols-2 gap-8 text-left text-xs font-poppins">
                  <div>
                    <strong className="block font-montserrat text-[10px] uppercase tracking-wider text-black/60 mb-2">Billed To:</strong>
                    <p className="leading-relaxed font-semibold">{selectedInvoiceOrder.user.name}</p>
                    <p className="text-black/75 mt-0.5">{selectedInvoiceOrder.user.email}</p>
                    <p className="text-black/75">Phone: {selectedInvoiceOrder.user.phone || selectedInvoiceOrder.address.phone}</p>
                  </div>
                  <div>
                    <strong className="block font-montserrat text-[10px] uppercase tracking-wider text-black/60 mb-2">Shipped Address:</strong>
                    <p className="leading-relaxed font-semibold">{selectedInvoiceOrder.address.name}</p>
                    <p className="text-black/75 mt-0.5">
                      {selectedInvoiceOrder.address.street},<br />
                      {selectedInvoiceOrder.address.city}, {selectedInvoiceOrder.address.state} - {selectedInvoiceOrder.address.postalCode}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-xs font-poppins border-collapse mt-8">
                  <thead>
                    <tr className="border-b-2 border-black text-black/60 font-montserrat uppercase text-[9px] tracking-wider font-bold">
                      <th className="py-2.5">Jewellery Description</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Weight</th>
                      <th className="py-2.5 text-right">Spot Rate Used</th>
                      <th className="py-2.5 text-right">Amount (Inc. Making & GST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 text-black/90">
                    {selectedInvoiceOrder.items.map(item => (
                      <tr key={item.id} className="py-2">
                        <td className="py-3.5 font-semibold">{item.product.name}</td>
                        <td className="py-3.5 text-center">{item.quantity}</td>
                        <td className="py-3.5 text-right">{item.weightPerUnit}g</td>
                        <td className="py-3.5 text-right">{formatCurrency(item.metalRateUsed)}/g</td>
                        <td className="py-3.5 text-right font-semibold">{formatCurrency(item.pricePerUnit * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pricing Summary Block */}
                <div className="flex justify-end pt-4 border-t border-black/20">
                  <div className="w-64 space-y-2.5 text-xs font-poppins">
                    <div className="flex justify-between text-black/70">
                      <span>Metal Subtotal</span>
                      <span>{formatCurrency(selectedInvoiceOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-black/70">
                      <span>Making charges</span>
                      <span>{formatCurrency(selectedInvoiceOrder.makingCharges)}</span>
                    </div>
                    <div className="flex justify-between text-black/70">
                      <span>GST (3%)</span>
                      <span>{formatCurrency(selectedInvoiceOrder.gst)}</span>
                    </div>
                    <div className="flex justify-between text-black/70">
                      <span>Insured Shipping</span>
                      <span>{selectedInvoiceOrder.shipping === 0 ? "FREE" : formatCurrency(selectedInvoiceOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-black border-t-2 border-black pt-3">
                      <span className="font-montserrat uppercase tracking-wider text-[11px]">Grand Total</span>
                      <span>{formatCurrency(selectedInvoiceOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Footer note */}
                <div className="text-center text-[10px] text-black/40 pt-16 border-t border-black/10">
                  Thank you for your trust and business. Under Vasabattula Srinivasu guidance, we guarantee purity. Hallmark certified.
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-8 border-t border-black/5 pt-5">
                <button
                  onClick={printInvoice}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-royal-burgundy text-primary-gold font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Download / Print PDF</span>
                </button>
                
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="px-6 py-2.5 bg-black/5 text-luxury-black/70 font-montserrat text-xs uppercase font-bold tracking-widest rounded-sm hover:bg-black/10 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
