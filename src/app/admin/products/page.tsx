"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Package, LogOut, LayoutDashboard, PlusCircle, FileText, Settings, HeartHandshake, Eye, Plus, Edit, Trash2, Loader2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  metalType: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  weight: number;
  purity: string;
  metalType: "GOLD" | "SILVER";
  makingChargesPerGram: number;
  gstPercent: number;
  stockQuantity: number;
  availability: boolean;
  images: string[];
  categoryId: string;
  category: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [purity, setPurity] = useState("22K");
  const [metalType, setMetalType] = useState<"GOLD" | "SILVER">("GOLD");
  const [makingCharges, setMakingCharges] = useState("");
  const [stock, setStock] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [availability, setAvailability] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const router = useRouter();

  const loadData = async () => {
    try {
      const [resProducts, resCategories] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);

      if (resProducts.ok && resCategories.ok) {
        const prodData = await resProducts.json();
        const catData = await resCategories.json();
        if (prodData.success) setProducts(prodData.products);
        if (catData.success) {
          setCategories(catData.categories);
          if (catData.categories.length > 0) setCategoryId(catData.categories[0].id);
        }
      } else {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setWeight(prod.weight.toString());
    setPurity(prod.purity);
    setMetalType(prod.metalType);
    setMakingCharges(prod.makingChargesPerGram.toString());
    setStock(prod.stockQuantity.toString());
    setCategoryId(prod.categoryId);
    setAvailability(prod.availability);
    setImageUrl(prod.images[0] || "");
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      id: editingProduct?.id || undefined,
      name,
      description,
      weight: Number(weight),
      purity,
      metalType,
      makingChargesPerGram: Number(makingCharges),
      stockQuantity: Number(stock),
      categoryId,
      availability,
      images: imageUrl ? [imageUrl] : ["/assets/silhouette-necklace.jpg"]
    };

    try {
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowForm(false);
        setEditingProduct(null);
        loadData();
        // Clear fields
        setName("");
        setDescription("");
        setWeight("");
        setMakingCharges("");
        setStock("1");
        setImageUrl("");
        setAvailability(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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
      
      {/* Sidebar Navigation */}
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
              className="flex items-center gap-3 px-4 py-3 bg-royal-burgundy text-primary-gold border-l-2 border-primary-gold rounded-sm transition-all"
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
            <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">Jewellery Stock CRUD</h2>
            <p className="font-poppins text-xs text-ivory-white/45">Manage items, stock counts, and making charges</p>
          </div>
          
          {!showForm && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setName("");
                setDescription("");
                setWeight("");
                setPurity("22K");
                setMetalType("GOLD");
                setMakingCharges("");
                setStock("1");
                setImageUrl("");
                setAvailability(true);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-gold hover:bg-champagne-gold text-luxury-black text-xs font-montserrat uppercase font-bold tracking-wider rounded-sm transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {showForm ? (
          /* Create / Edit Form */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] border border-primary-gold/25 p-6 rounded-sm max-w-3xl"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <h3 className="font-playfair text-lg font-bold text-primary-gold">
                {editingProduct ? `Edit: ${editingProduct.name}` : "Add New Precious Jewel"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="text-ivory-white/50 hover:text-rose-400 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-6 text-left">
              
              <div className="sm:col-span-8">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Antique Kasu Mala Haram"
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Category Bind</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.metalType})</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-12">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Handcrafting, stone settings details..."
                  className="w-full bg-luxury-black border border-white/10 text-xs p-3 rounded-sm outline-none text-ivory-white resize-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Metal Type</label>
                <select
                  value={metalType}
                  onChange={(e) => setMetalType(e.target.value as any)}
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                >
                  <option value="GOLD">GOLD</option>
                  <option value="SILVER">SILVER</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Purity Standard</label>
                <select
                  value={purity}
                  onChange={(e) => setPurity(e.target.value)}
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                >
                  <option value="24K">24K Gold</option>
                  <option value="22K">22K Gold</option>
                  <option value="18K">18K Gold</option>
                  <option value="Silver 99.9%">Silver 99.9%</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Weight (Grams)</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Making/g (INR)</label>
                <input
                  type="number"
                  required
                  value={makingCharges}
                  onChange={(e) => setMakingCharges(e.target.value)}
                  placeholder="₹350"
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Stock Count</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block font-montserrat text-[9px] uppercase font-bold tracking-widest text-champagne-gold/75 mb-1.5">Image URL path</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/assets/silhouette-necklace.jpg"
                  className="w-full bg-luxury-black border border-white/10 text-xs px-3 py-2.5 rounded-sm outline-none text-ivory-white"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-2 pt-6">
                <input
                  id="prod-avail"
                  type="checkbox"
                  checked={availability}
                  onChange={(e) => setAvailability(e.target.checked)}
                  className="rounded border-white/10 text-primary-gold accent-primary-gold cursor-pointer"
                />
                <label htmlFor="prod-avail" className="font-poppins text-xs text-ivory-white/70 select-none cursor-pointer">
                  In Stock Catalog
                </label>
              </div>

              <div className="sm:col-span-12 border-t border-white/5 pt-4 flex gap-2 justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary-gold text-luxury-black font-montserrat text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-champagne-gold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save size={13} />
                  <span>{submitting ? "Saving..." : "Save Product"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2.5 bg-white/5 text-ivory-white/70 font-montserrat text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          /* Products Table View */
          <div className="bg-[#121212] border border-white/5 p-6 rounded-sm">
            <h3 className="font-playfair text-lg font-bold border-b border-white/5 pb-4 mb-4">Stock Registry</h3>

            {products.length === 0 ? (
              <div className="text-center py-10 text-ivory-white/35 text-xs font-poppins">No products registered in the database.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-poppins border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-ivory-white/45 font-montserrat uppercase text-[9px] tracking-wider">
                      <th className="py-3 px-4">Jewellery Name</th>
                      <th className="py-3 px-4">Specs</th>
                      <th className="py-3 px-4">Making Charges</th>
                      <th className="py-3 px-4">Inventory</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-ivory-white/85">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-ivory-white">{prod.name}</span>
                            <span className="text-[10px] text-primary-gold uppercase font-bold">{prod.category?.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span>Purity: {prod.purity}</span>
                            <span className="text-ivory-white/45">Weight: {prod.weight}g</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-champagne-gold">{formatCurrency(prod.makingChargesPerGram)}/g</td>
                        <td className="py-3 px-4">{prod.stockQuantity} Items</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[8px] font-montserrat font-bold tracking-widest uppercase ${
                            prod.availability ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          }`}>
                            {prod.availability ? "In stock" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(prod)}
                              className="p-2 bg-white/5 hover:bg-primary-gold/15 text-ivory-white/70 hover:text-primary-gold rounded-sm border border-white/5 transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="p-2 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 border border-rose-500/10 rounded-sm transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
