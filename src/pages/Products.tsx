import { useState, useEffect } from "react";
import { Loader2, Filter, SlidersHorizontal, Lock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productApi, categoryApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  categoryId: string;
  description?: string;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [authError, setAuthError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
      setAuthError(true);
    }
  }, [isAuthenticated]);

  // Set category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Refetch when user logs in
    if (isAuthenticated && authError) {
      setAuthError(false);
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setAuthError(false);
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(token || undefined),
        categoryApi.getAll()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      
      // Check if it's an authentication error
      if (error.message?.includes("401") || error.message?.includes("Failed to fetch")) {
        setAuthError(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const filteredAndSortedProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // newest - keep original order
        break;
    }

    return filtered;
  };

  const displayedProducts = filteredAndSortedProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Filters and Products Section */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-6 border-b">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    // Update URL parameter
                    if (value === "all") {
                      searchParams.delete("category");
                    } else {
                      searchParams.set("category", value);
                    }
                    setSearchParams(searchParams);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {authError ? (
              <div className="text-center py-20">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <Lock className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Login Required</h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                  Please log in to view our complete product collection
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setShowLoginModal(true)} size="lg">
                    Log In
                  </Button>
                  <Button
                    onClick={() => setShowRegisterModal(true)}
                    variant="outline"
                    size="lg"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">
                  No products found
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSortBy("newest");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {displayedProducts.map((product) => {
                    const category = categories.find(c => c.id === product.categoryId);
                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.imageUrls?.[0] || "/placeholder.svg"}
                        category={category?.name || "Uncategorized"}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default Products;
