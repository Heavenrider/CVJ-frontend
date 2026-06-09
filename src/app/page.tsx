"use client";

import { useEffect, useState, useCallback } from "react";
import Loader from "@/components/Loader";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveRates from "@/components/LiveRates";
import Founder from "@/components/Founder";
import ProductCatalog, { Product } from "@/components/ProductCatalog";
import ProductDetailModal from "@/components/ProductDetailModal";
import CustomOrderForm from "@/components/CustomOrderForm";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingCTAs from "@/components/FloatingCTAs";

interface RateDetail {
  rate: number;
  rateKg?: number;
  change: "up" | "down";
  changeValue: number;
}

interface RatesData {
  gold24k: RateDetail;
  gold22k: RateDetail;
  silver: RateDetail;
  timestamp: string;
}

export default function Home() {
  const [rates, setRates] = useState<RatesData | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductPrice, setSelectedProductPrice] = useState<number>(0);

  // Dynamic rates fetching function
  const fetchRates = useCallback(async () => {
    setLoadingRates(true);
    try {
      const response = await fetch("/api/rates");
      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          setRates(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch live rates:", error);
    } finally {
      setLoadingRates(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchRates();

    // Auto refresh every 15 minutes (15 * 60 * 1000)
    const intervalId = setInterval(() => {
      fetchRates();
    }, 900000);

    return () => clearInterval(intervalId);
  }, [fetchRates]);

  const handleSelectProduct = (product: Product, computedPrice: number) => {
    setSelectedProduct(product);
    setSelectedProductPrice(computedPrice);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setSelectedProductPrice(0);
  };

  return (
    <div className="relative min-h-screen bg-ivory-white text-luxury-black font-poppins selection:bg-primary-gold selection:text-luxury-black">
      
      {/* Luxury Fullscreen Intro Loader */}
      <Loader />

      {/* Global Scroll Progress bar */}
      <ScrollProgress />

      {/* Persistent Floating Contact Channels & Back To Top */}
      <FloatingCTAs />

      {/* Sticky Navigation Header */}
      <Navbar />

      <main className="w-full flex flex-col">
        {/* Fullscreen Hero Cover */}
        <Hero />

        {/* Live Rates Card Ticker */}
        <LiveRates
          rates={rates}
          loading={loadingRates}
          onRefresh={fetchRates}
        />

        {/* Brand Founder Biography */}
        <Founder />

        {/* Product Catalog Grid */}
        <ProductCatalog
          rates={rates}
          onSelectProduct={handleSelectProduct}
        />

        {/* Bespoke Customs Form */}
        <CustomOrderForm />

        {/* Visual Masonry Showcase & Process */}
        <Gallery />

        {/* Star Testimonials Reviews */}
        <Testimonials />

        {/* Value Pillars List */}
        <WhyChooseUs />

        {/* Showroom Interactive Map & Address */}
        <Contact />
      </main>

      {/* Shared Footer and Copyright links */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          computedPrice={selectedProductPrice}
          rates={rates}
          onClose={handleCloseProductModal}
        />
      )}

    </div>
  );
}
