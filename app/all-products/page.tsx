"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabaseSchema";
import { ProductCard } from "@/components/ProductCard";
import { ChatDrawer } from "@/components/ChatDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [bankSearch, setBankSearch] = useState("");
  const [aprRange, setAprRange] = useState<[number, number]>([0, 20]);
  const [minIncome, setMinIncome] = useState(0);
  const [minCreditScore, setMinCreditScore] = useState(850);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("rate_apr", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Bank search filter
      if (
        bankSearch &&
        !product.bank.toLowerCase().includes(bankSearch.toLowerCase())
      ) {
        return false;
      }

      // APR range filter
      const apr = Number(product.rate_apr);
      if (apr < aprRange[0] || apr > aprRange[1]) {
        return false;
      }

      // Minimum income filter - show products where user income meets requirement
      if (minIncome > 0 && product.min_income > minIncome) {
        return false;
      }

      // Minimum credit score filter - show products user qualifies for
      if (minCreditScore < 850 && product.min_credit_score > minCreditScore) {
        return false;
      }

      return true;
    });
  }, [products, bankSearch, aprRange, minIncome, minCreditScore]);

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

  const resetFilters = () => {
    setBankSearch("");
    setAprRange([0, 20]);
    setMinIncome(0);
    setMinCreditScore(850);
  };

  const hasActiveFilters =
    Boolean(bankSearch) ||
    aprRange[0] > 0 ||
    aprRange[1] < 20 ||
    minIncome > 0 ||
    minCreditScore < 850;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={"/"}>
                <Button variant="ghost" className="border-2 border-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-foreground text-background p-2">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold hidden sm:block">
                  ALL PRODUCTS
                </h1>
              </div>
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              className="border-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-background text-foreground px-2 py-0.5 text-xs">
                  Active
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Panel */}
          {showFilters && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="border-2 border-foreground bg-card p-4 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Bank Search */}
                  <div className="space-y-2">
                    <Label className="font-mono text-xs">BANK NAME</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        placeholder="Search bank..."
                        className="pl-10 border-2"
                      />
                    </div>
                  </div>

                  {/* APR Range */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-xs">APR RANGE</Label>
                      <span className="text-sm font-mono">
                        {aprRange[0]}% - {aprRange[1]}%
                      </span>
                    </div>
                    <Slider
                      value={aprRange}
                      onValueChange={(value) =>
                        setAprRange(value as [number, number])
                      }
                      min={0}
                      max={20}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  {/* Minimum Income */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-xs">YOUR INCOME</Label>
                      <span className="text-sm font-mono">
                        ${minIncome.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={[minIncome]}
                      onValueChange={(value) => setMinIncome(value[0])}
                      min={0}
                      max={150000}
                      step={5000}
                    />
                    <p className="text-xs text-muted-foreground">
                      Shows loans requiring up to this income
                    </p>
                  </div>

                  {/* Credit Score */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-xs">
                        YOUR CREDIT SCORE
                      </Label>
                      <span className="text-sm font-mono">
                        {minCreditScore}
                      </span>
                    </div>
                    <Slider
                      value={[minCreditScore]}
                      onValueChange={(value) => setMinCreditScore(value[0])}
                      min={500}
                      max={850}
                      step={10}
                    />
                    <p className="text-xs text-muted-foreground">
                      Shows loans you qualify for
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground font-mono text-sm">
                {loading
                  ? "Loading..."
                  : `${filteredProducts.length} products found`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-72 border-2 border-foreground"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="border-2 border-foreground p-8 text-center bg-card">
                <p className="text-lg font-bold mb-2">No products found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more options.
                </p>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="border-2"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAskAI={handleAskAI}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Chat Drawer */}
      <ChatDrawer
        product={selectedProduct}
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />
    </div>
  );
}
