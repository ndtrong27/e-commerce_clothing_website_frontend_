"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { fetchProducts } from "@/services/api";
import { ArrowRight, ShoppingBag, Star, Zap, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('admin');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.slice(0, 4)); // Featured 4 products
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (isAdmin) {
    return <DashboardPage />;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section - Exaggerated Minimalism */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="max-w-6xl mx-auto z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-brand/10 text-primary-brand font-semibold text-sm mb-8 animate-fade-in uppercase tracking-widest">
            Aura Fashion 2026
          </span>
          <h1 className="massive-heading mb-12 animate-slide-up text-foreground">
            SELECT<br />ESSENTIALS
          </h1>
          <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
            Crafting the future of sustainable style. Minimal design, maximal comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center bg-cta-brand text-white px-10 py-5 rounded-full font-bold text-lg transition-standard hover:scale-105 hover:shadow-2xl shadow-orange-500/20 active:scale-95"
            >
              Shop Collection
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[140%] h-[140%] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-radial-gradient from-secondary-brand/40 to-transparent blur-3xl rounded-full scale-75"></div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-20 border-y border-foreground/5 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-primary-brand/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-standard">
              <Zap className="w-6 h-6 text-primary-brand" />
            </div>
            <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
            <p className="text-sm text-foreground/50">Free shipping over $150</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-cta-brand/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-standard">
              <Star className="w-6 h-6 text-cta-brand" />
            </div>
            <h4 className="font-bold text-lg mb-2">Premium Quality</h4>
            <p className="text-sm text-foreground/50">Sustainable materials</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-secondary-brand/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-standard">
              <ShieldCheck className="w-6 h-6 text-secondary-brand" />
            </div>
            <h4 className="font-bold text-lg mb-2">Secure Payment</h4>
            <p className="text-sm text-foreground/50">100% encrypted checkout</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-standard">
              <ShoppingBag className="w-6 h-6 text-foreground/70" />
            </div>
            <h4 className="font-bold text-lg mb-2">Easy Returns</h4>
            <p className="text-sm text-foreground/50">30-day money-back</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">TRENDING NOW</h2>
              <div className="h-2 w-24 bg-cta-brand rounded-full"></div>
            </div>
            <Link href="/shop" className="group inline-flex items-center font-bold text-lg hover:text-cta-brand transition-standard">
              Browse All
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-foreground/5 aspect-[4/5] rounded-3xl mb-6"></div>
                  <div className="h-6 bg-foreground/5 rounded-full w-3/4 mb-3"></div>
                  <div className="h-6 bg-foreground/5 rounded-full w-1/4 uppercase"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white glass-card mb-6 relative cursor-pointer group-hover:shadow-2xl transition-standard group-hover:-translate-y-2">
                    <img
                      src={product.image_url || "https://placehold.co/800x1000?text=No+Image"}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        NEW SEASON
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary-brand transition-standard mb-1">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-black text-foreground">
                    {formatCurrency(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter - Minimalist */}
      <section className="py-32 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">STAY IN THE LOOP</h2>
          <p className="text-xl text-background/60 mb-12 font-light max-w-2xl mx-auto">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-8 py-5 rounded-full bg-background/10 border border-background/20 focus:outline-none focus:border-cta-brand transition-standard"
            />
            <button className="bg-background text-foreground px-10 py-5 rounded-full font-bold transition-standard hover:bg-cta-brand hover:text-white cursor-pointer active:scale-95">
              Join
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
