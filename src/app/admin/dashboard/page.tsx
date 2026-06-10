"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Package, Users, ShoppingCart, RefreshCw, LogOut, LayoutDashboard, PlusCircle, FileText, Settings, HeartHandshake, Eye, Loader2, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
}

interface RatePoint {
  rate: number;
  time: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  date: string;
}

// Custom Premium SVG Line Chart component (Zero-dependency, React 19 safe)
function LineChart({ data, color = "#D4AF37", title = "Rate Trend" }: { data: RatePoint[]; color?: string; title: string }) {
  if (data.length === 0) return <div className="h-48 flex items-center justify-center text-xs text-white/40">No historical data yet.</div>;
  
  const width = 500;
  const height = 180;
  const padding = 35;
  
  const rates = data.map((d) => d.rate);
  const minRate = Math.min(...rates) * 0.999;
  const maxRate = Math.max(...rates) * 1.001;
  const rateRange = maxRate - minRate;
  
  const getX = (index: number) => padding + (index * (width - padding * 2)) / (data.length - 1);
  const getY = (rate: number) => height - padding - ((rate - minRate) * (height - padding * 2)) / rateRange;
  
  const points = data.map((d, i) => `${getX(i)},${getY(d.rate)}`).join(" ");
  
  return (
    <div className="bg-[#141414] border border-white/5 p-5 rounded-sm relative overflow-hidden flex-1">
      <h4 className="font-montserrat text-[10px] uppercase font-bold tracking-widest text-champagne-gold mb-4">{title}</h4>
      <svg className="w-full h-auto max-h-[180px]" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <line x1={padding} y1={getY(minRate)} x2={width - padding} y2={getY(minRate)} stroke="#222" strokeWidth="0.5" />
        <line x1={padding} y1={getY((minRate + maxRate) / 2)} x2={width - padding} y2={getY((minRate + maxRate) / 2)} stroke="#222" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1={padding} y1={getY(maxRate)} x2={width - padding} y2={getY(maxRate)} stroke="#222" strokeWidth="0.5" />

        {/* Shaded Area Under Line */}
        <polygon
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
          fill="url(#chart-fill)"
        />
        
        {/* Trend Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Node Circles */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.rate)}
            r="4.5"
            fill="#0A0A0A"
            stroke={color}
            strokeWidth="2"
            className="hover:r-6 transition-all duration-300 cursor-pointer"
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => (
          <text
            key={`x-${i}`}
            x={getX(i)}
            y={height - 10}
            fill="#555"
            fontSize="8"
            textAnchor="middle"
            className="font-montserrat"
          >
            {d.time}
          </text>
        ))}

        {/* Ticks on Y-axis */}
        <text x={padding - 5} y={getY(maxRate) + 4} fill="#D4AF37" fontSize="8" textAnchor="end" className="font-montserrat">
          ₹{Math.round(maxRate)}
        </text>
        <text x={padding - 5} y={getY(minRate) + 4} fill="#555" fontSize="8" textAnchor="end" className="font-montserrat">
          ₹{Math.round(minRate)}
        </text>
      </svg>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ratesData, setRatesData] = useState<{ gold: RatePoint[]; silver: RatePoint[] }>({ gold: [], silver: [] });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();

  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRatesData(data.rates);
          setRecentOrders(data.recentOrders);
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
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
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

  return (
    <div className="min-h-screen bg-luxury-black text-ivory-white flex flex-col md:flex-row">
      
      {/* Sidebar Panel Layout */}
      <aside className="w-full md:w-64 bg-[#121212] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Admin badge */}
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

          {/* Nav Links */}
          <div className="flex flex-col gap-1.5 font-montserrat text-xs uppercase font-bold tracking-wider">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold rounded-sm transition-all"
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
              className="flex items-center gap-3 px-4 py-3 text-ivory-white/70 hover:bg-white/5 rounded-sm transition-all"
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

        {/* Logout */}
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
            <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">Dashboard Overview</h2>
            <p className="font-poppins text-xs text-ivory-white/45">Review sales performance and spot rates</p>
          </div>
          
          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-white/5 hover:border-primary-gold/40 text-xs font-montserrat uppercase font-bold tracking-wider rounded-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Reload Data"}</span>
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Revenue */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-sm flex flex-col justify-between hover:border-primary-gold/15 transition-all">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-ivory-white/40 block leading-none">Total Revenue</span>
              <span className="font-playfair text-xl sm:text-2xl font-bold text-champagne-gold mt-3 block">{formatCurrency(stats.totalRevenue)}</span>
            </div>

            {/* Total Orders */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-sm flex flex-col justify-between hover:border-primary-gold/15 transition-all">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-ivory-white/40 block leading-none">Total Sales</span>
              <span className="font-playfair text-xl sm:text-2xl font-bold text-ivory-white mt-3 block">{stats.totalOrders} Orders</span>
            </div>

            {/* Total Customers */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-sm flex flex-col justify-between hover:border-primary-gold/15 transition-all">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-ivory-white/40 block leading-none">Registered Clients</span>
              <span className="font-playfair text-xl sm:text-2xl font-bold text-ivory-white mt-3 block">{stats.totalCustomers} Accounts</span>
            </div>

            {/* Pending Orders */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-sm flex flex-col justify-between hover:border-primary-gold/15 transition-all">
              <span className="font-montserrat text-[9px] uppercase font-bold tracking-widest text-ivory-white/40 block leading-none">Pending Actions</span>
              <span className="font-playfair text-xl sm:text-2xl font-bold text-primary-gold mt-3 block">{stats.pendingOrders} Pending</span>
            </div>

          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart data={ratesData.gold} title="Gold 22K spot rate history (INR/g)" color="#D4AF37" />
          <LineChart data={ratesData.silver} title="Silver spot rate history (INR/g)" color="#C0C0C0" />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#121212] border border-white/5 p-6 rounded-sm">
          <h3 className="font-playfair text-lg font-bold border-b border-white/5 pb-4 mb-4">Recent Transactions</h3>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-ivory-white/35 text-xs font-poppins">No orders placed recently.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-poppins border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-ivory-white/45 font-montserrat uppercase text-[9px] tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-ivory-white/80">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-montserrat font-bold">#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span>{order.customerName}</span>
                          <span className="text-[10px] text-ivory-white/40">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-champagne-gold">{formatCurrency(order.total)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-montserrat font-bold uppercase tracking-wider ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : order.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400"
                            : order.status === "CANCELLED"
                            ? "bg-rose-500/10 text-rose-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-ivory-white/50">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
