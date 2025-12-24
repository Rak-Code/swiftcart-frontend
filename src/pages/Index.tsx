import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { categoryApi, productApi } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId: string;
  isNew?: boolean;
  createdAt?: string;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoryApi.getAll(),
        productApi.getAll()
      ]);
      
      setCategories(categoriesData);
      
      // Select 4 products from different categories, prioritizing latest
      const selectedProducts = selectFeaturedProducts(productsData, categoriesData);
      setFeaturedProducts(selectedProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectFeaturedProducts = (products: any[], categories: Category[]): Product[] => {
    if (!products || products.length === 0) return [];
    
    // Sort products by createdAt (latest first)
    const sortedProducts = [...products].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Group products by category
    const productsByCategory = new Map<string, any[]>();
    sortedProducts.forEach(product => {
      const categoryId = product.categoryId || product.category;
      if (!productsByCategory.has(categoryId)) {
        productsByCategory.set(categoryId, []);
      }
      productsByCategory.get(categoryId)!.push(product);
    });

    const selected: Product[] = [];
    const usedCategories = new Set<string>();

    // First pass: Get one product from each category (up to 4 different categories)
    for (const [categoryId, categoryProducts] of productsByCategory) {
      if (selected.length >= 4) break;
      
      const product = categoryProducts[0]; // Latest product in this category
      const category = categories.find(c => c.id === categoryId);
      
      selected.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrls?.[0] || "/placeholder.svg",
        category: category?.name || product.category || 'Products',
        categoryId: categoryId,
        isNew: isProductNew(product.createdAt),
        createdAt: product.createdAt
      });
      
      usedCategories.add(categoryId);
    }

    // Second pass: If we have less than 4 products, fill with remaining latest products
    if (selected.length < 4) {
      for (const product of sortedProducts) {
        if (selected.length >= 4) break;
        
        const categoryId = product.categoryId || product.category;
        const category = categories.find(c => c.id === categoryId);
        
        // Skip if already added
        if (selected.some(p => p.id === product.id)) continue;
        
        selected.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrls?.[0] || "/placeholder.svg",
          category: category?.name || product.category || 'Products',
          categoryId: categoryId,
          isNew: isProductNew(product.createdAt),
          createdAt: product.createdAt
        });
      }
    }

    return selected;
  };

  const isProductNew = (createdAt?: string): boolean => {
    if (!createdAt) return false;
    const productDate = new Date(createdAt);
    const daysSinceCreation = (Date.now() - productDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 30; // Consider products new if added within last 30 days
  };

  // Category images mapping
  const categoryImages: Record<string, string> = {
    shirts: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop",
    "t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
    bandis: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop",
    blazers: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
  };

  const getCategoryImage = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    return categoryImages[key] || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop";
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <section id="categories" className="py-12 sm:py-16 lg:py-20 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
                Collections
              </h2>
              {/* <p className="text-muted-foreground text-sm sm:text-base">
                Curated selections for the modern gentleman
              </p> */}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id}
                  title={category.name}
                  imageUrl={getCategoryImage(category.name)}
                  href={`/products?category=${category.id}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1.5 tracking-tight">
                  Featured Styles
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  This season's finest selections
                </p>
              </div>
              <a 
                href="/products" 
                className="hidden sm:inline-flex text-xs font-medium text-accent hover:text-accent/80 transition-colors tracking-wide"
              >
                View All →
              </a>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              ) : (
                <div className="col-span-2 lg:col-span-4 text-center py-8 text-muted-foreground">
                  No featured products available
                </div>
              )}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <a 
                href="/products" 
                className="inline-flex text-xs font-medium text-accent hover:text-accent/80 transition-colors tracking-wide"
              >
                View All Products →
              </a>
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-5 tracking-tight">
              Crafted for Excellence
            </h2>
            <p className="text-sm sm:text-base text-primary-foreground/75 leading-relaxed">
              At PARIBITO, we believe that every man deserves to look and feel his best. 
              Our collection combines premium fabrics, impeccable tailoring, and contemporary 
              design to create pieces that stand the test of time.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
