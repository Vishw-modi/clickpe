"use client";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabaseSchema";
import { ProductCard } from "@/components/ProductCard";
import { ChatDrawer } from "@/components/ChatDrawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles, LayoutGrid } from "lucide-react";
import Link from "next/link";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 5));

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(5);

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleAskAI = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsChatOpen(true);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const bestMatch = products[0];
  const otherProducts = products.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-foreground text-background p-2">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold">Clickpe Assignment</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/all-products">
                <Button variant="outline" className="border-2">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  All Products
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="border-2 border-foreground p-6 bg-secondary shadow-md">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Your Top Loan Picks
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Personalized recommendations based on your profile. Click
              &quot;Ask AI&quot; on any product to learn more.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full border-2 border-foreground" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-72 border-2 border-foreground" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Best Match Section */}
            {bestMatch && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-foreground text-background px-3 py-1 text-sm font-mono font-bold">
                    #1 RECOMMENDED
                  </div>
                </div>
                <div className="max-w-xl">
                  <ProductCard
                    product={bestMatch}
                    onAskAI={handleAskAI}
                    isBestMatch
                  />
                </div>
              </section>
            )}

            {/* Other Products Grid */}
            {otherProducts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">More Options</h3>
                  <Link href="/all-products">
                    <Button variant="ghost" className="group">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {otherProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAskAI={handleAskAI}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Chat Drawer */}
      <ChatDrawer
        product={selectedProduct}
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />
    </div>
  );
}
