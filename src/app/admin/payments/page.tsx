"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, PlusCircle, FileText, HeartHandshake, LogOut, Loader2, RefreshCw, Download, Search, Calendar, CreditCard, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import Link from "next/link";

interface PaymentLog {
  id: string;
  transactionId: string;
  status: string;
  createdAt: string;
}

interface PaymentRecord {
  id: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  razorpayOrderId: string | null;
  total: number;
  createdAt: string;
  user: { name: string; email: string; phone: string | null };
  payments: PaymentLog[];
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", "COMPLETED", "FAILED", "PENDING"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const router = useRouter();

  const loadPayments = async () => {
    setRefreshing(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (statusFilter) queryParams.append("status", statusFilter);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const res = await fetch(`/api/admin/payments?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPayments(data.payments);
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
    loadPayments();
  }, [statusFilter, startDate, endDate]); // Reload on filters except search (search uses form submit or keypress)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPayments();
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    // We need to reload since state updates are asynchronous
    setTimeout(() => {
      loadPayments();
    }, 50);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        loadPayments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // KPI Calculations
  const successfulPayments = payments.filter((p) => p.paymentStatus === "COMPLETED");
  const failedPayments = payments.filter((p) => p.paymentStatus === "FAILED");
  const pendingPayments = payments.filter((p) => p.paymentStatus === "PENDING");

  const totalCollected = successfulPayments.reduce((acc, curr) => acc + curr.total, 0);
  const totalPending = pendingPayments.reduce((acc, curr) => acc + curr.total, 0);
  const totalFailed = failedPayments.reduce((acc, curr) => acc + curr.total, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Export to CSV Report
  const downloadCSVReport = () => {
    if (payments.length === 0) return;
    
    // Header
    const headers = ["Order ID", "Date", "Customer Name", "Customer Email", "Payment Method", "Payment Status", "Razorpay Order ID", "Razorpay Payment ID", "Amount Paid"];
    
    // Rows
    const rows = payments.map(p => [
      p.id,
      new Date(p.createdAt).toLocaleDateString("en-IN"),
      p.user.name,
      p.user.email,
      p.paymentMethod,
      p.paymentStatus,
      p.razorpayOrderId || "N/A",
      p.payments && p.payments.length > 0 ? p.payments[0].transactionId : "N/A",
      p.total
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SCVLJ_Payments_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && payments.length === 0) {
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
              className="flex items-center gap-3 px-4 py-3 text-ivory-white/70 hover:bg-white/5 rounded-sm transition-all"
            >
              <FileText size={15} />
              <span>Customer Orders</span>
            </Link>
            <Link
              href="/admin/payments"
              className="flex items-center gap-3 px-4 py-3 bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold rounded-sm transition-all"
            >
              <CreditCard size={15} />
              <span>Payment Panel</span>
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
            <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">Payment Management</h2>
            <p className="font-poppins text-xs text-ivory-white/45">Audit online transactions, verify Cash on Delivery bills, and export financial summaries</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={downloadCSVReport}
              disabled={payments.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-royal-burgundy border border-primary-gold/25 hover:border-primary-gold text-primary-gold text-xs font-montserrat uppercase font-bold tracking-wider rounded-sm transition-all cursor-pointer disabled:opacity-40"
            >
              <Download size={12} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={loadPayments}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-white/5 hover:border-primary-gold/40 text-xs font-montserrat uppercase font-bold tracking-wider rounded-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? "Refreshing..." : "Reload Ledger"}</span>
            </button>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Revenue Collected */}
          <div className="bg-[#121212] border border-emerald-500/10 p-6 rounded-sm flex items-center justify-between hover:border-emerald-500/20 transition-all">
            <div className="space-y-1">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-emerald-400 block leading-none">Payments Settled</span>
              <span className="font-playfair text-xl sm:text-2xl font-bold text-white mt-3 block">{formatCurrency(totalCollected)}</span>
              <span className="font-poppins text-[10px] text-ivory-white/40 block mt-1">{successfulPayments.length} Transactions</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>

          {/* Pending / COD Bills */}
          <div className="bg-[#121212] border border-amber-500/10 p-6 rounded-sm flex items-center justify-between hover:border-amber-500/20 transition-all">
            <div className="space-y-1">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-amber-400 block leading-none">COD Outstandings</span>
              <span className="font-playfair text-xl sm:text-2xl font-bold text-white mt-3 block">{formatCurrency(totalPending)}</span>
              <span className="font-poppins text-[10px] text-ivory-white/40 block mt-1">{pendingPayments.length} Pending Collections</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <HelpCircle size={20} />
            </div>
          </div>

          {/* Failed Audit */}
          <div className="bg-[#121212] border border-rose-500/10 p-6 rounded-sm flex items-center justify-between hover:border-rose-500/20 transition-all">
            <div className="space-y-1">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-rose-400 block leading-none">Failed Gateways</span>
              <span className="font-playfair text-xl sm:text-2xl font-bold text-white mt-3 block">{formatCurrency(totalFailed)}</span>
              <span className="font-poppins text-[10px] text-ivory-white/40 block mt-1">{failedPayments.length} Aborted checkouts</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle size={20} />
            </div>
          </div>

        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#141414]/60 border border-white/5 p-6 rounded-md">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Search Input */}
            <div className="md:col-span-4 space-y-1.5 text-left">
              <label className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75">Search Transaction</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivory-white/40">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Order ID / Customer name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs pl-9 pr-4 py-2.5 rounded-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="md:col-span-3 space-y-1.5 text-left">
              <label className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75">Settlement Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs px-3 py-2.5 rounded-sm outline-none transition-all cursor-pointer"
              >
                <option value="">All Transactions</option>
                <option value="COMPLETED">Settled (COMPLETED)</option>
                <option value="PENDING">COD Outstanding (PENDING)</option>
                <option value="FAILED">Declined (FAILED)</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs px-3 py-2 rounded-sm outline-none transition-all cursor-pointer"
              />
            </div>

            {/* End Date */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-luxury-black border border-white/10 focus:border-primary-gold text-ivory-white text-xs px-3 py-2 rounded-sm outline-none transition-all cursor-pointer"
              />
            </div>

            {/* Submit / Clear */}
            <div className="md:col-span-1 flex gap-2 w-full">
              <button
                type="submit"
                className="w-full py-2.5 bg-primary-gold hover:bg-champagne-gold text-luxury-black text-[10px] font-montserrat uppercase font-bold tracking-widest rounded-sm transition-colors cursor-pointer text-center"
              >
                Go
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-ivory-white/70 text-[10px] font-montserrat uppercase font-bold tracking-widest rounded-sm transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

          </form>
        </div>

        {/* Payments Table */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-sm">
          
          {payments.length === 0 ? (
            <div className="text-center py-10 text-ivory-white/35 text-xs font-poppins">No transaction records found matching your filters.</div>
          ) : (
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left text-xs font-poppins border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-ivory-white/45 font-montserrat uppercase text-[9px] tracking-wider">
                    <th className="py-3 px-4">Order & Date</th>
                    <th className="py-3 px-4">Client Details</th>
                    <th className="py-3 px-4">Gateway Reference</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Settlement Status</th>
                    <th className="py-3 px-4 text-right">Order Tracking Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-ivory-white/85">
                  {payments.map((p) => {
                    const paymentId = p.payments && p.payments.length > 0 ? p.payments[0].transactionId : null;
                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        
                        {/* Order ID & Date */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-montserrat font-bold text-ivory-white">#{p.id.slice(0, 8).toUpperCase()}</span>
                            <span className="text-[10px] text-ivory-white/40 mt-1">{new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold">{p.user.name}</span>
                            <span className="text-[10px] text-ivory-white/40">{p.user.email}</span>
                          </div>
                        </td>

                        {/* Gateway Reference */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col font-mono text-[10px] text-ivory-white/60">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] uppercase tracking-wider text-ivory-white/30 font-montserrat">Method:</span>
                              <span className="font-bold text-champagne-gold">{p.paymentMethod}</span>
                            </div>
                            {p.razorpayOrderId && (
                              <div className="mt-1">
                                <span className="text-ivory-white/35">R-Order:</span> {p.razorpayOrderId.slice(0, 15)}...
                              </div>
                            )}
                            {paymentId && (
                              <div className="mt-0.5">
                                <span className="text-ivory-white/35">R-Pay:</span> {paymentId}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-4 font-semibold text-champagne-gold text-sm">
                          {formatCurrency(p.total)}
                        </td>

                        {/* Payment Status */}
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[8px] font-montserrat font-bold tracking-widest uppercase ${
                            p.paymentStatus === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : p.paymentStatus === "FAILED"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {p.paymentStatus === "COMPLETED" ? "Settled" : p.paymentStatus === "FAILED" ? "Declined" : "COD Pending"}
                          </span>
                        </td>

                        {/* Update Status Dropdown */}
                        <td className="py-4 px-4 text-right">
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdateOrderStatus(p.id, e.target.value)}
                            className="bg-luxury-black border border-white/10 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-sm outline-none text-primary-gold cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
