import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, Shield, RefreshCcw, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewModal from "@/components/ReviewModal";
import { productApi, categoryApi, reviewApi } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [canReview, setCanReview] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      
      // Fetch product details
      const productData = await productApi.getById(id!, token);
      setProduct(productData);

      // Fetch category
      const categories = await categoryApi.getAll();
      const productCategory = categories.find((c: Category) => c.id === productData.categoryId);
      setCategory(productCategory || null);

      // Fetch reviews (no authentication required for viewing)
      try {
        const reviewsData = await reviewApi.getByProduct(id!);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }

      // Check if user can review this product (only if authenticated)
      if (isAuthenticated && user && token && user.id && id) {
        try {
          const canReviewResponse = await reviewApi.canUserReview(user.id, id, token);
          setCanReview(canReviewResponse);
        } catch (error) {
          console.error("Error checking review eligibility:", error);
          setCanReview(false);
        }
      } else {
        setCanReview(false);
      }

      // Fetch related products (same category)
      const allProducts = await productApi.getAll(token);
      const related = allProducts
        .filter((p: Product) => p.categoryId === productData.categoryId && p.id !== id)
        .slice(0, 3);
      setRelatedProducts(related);

    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrls?.[0] || "/placeholder.svg",
        category: category?.name || "Uncategorized",
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    const inWishlist = isInWishlist(product.id);
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrls?.[0] || "/placeholder.svg",
        category: category?.name || "Uncategorized",
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const handleReviewSubmitted = () => {
    // Refresh reviews and check eligibility after review submission
    fetchProductData();
    setReviewModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate("/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ["/placeholder.svg"];

  const averageRating = calculateAverageRating();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/products")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === idx ? "border-accent" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {category?.name || "Uncategorized"}
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
                
                {reviews.length > 0 && (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.round(averageRating) 
                              ? "fill-accent text-accent" 
                              : "text-muted-foreground"
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}

                <div className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </div>

                {product.stock !== undefined && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </p>
                )}
              </div>

              <Separator />

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-3 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock !== undefined && quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 font-medium"
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 gap-3 pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span>Premium quality fabrics & craftsmanship</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <span>Handpicked designs for modern gentlemen</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span>100% authentic products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">
                  Description
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6 text-muted-foreground leading-relaxed">
                {product.description ? (
                  <p className="whitespace-pre-wrap">{product.description}</p>
                ) : (
                  <p>No description available for this product.</p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  {canReview && (
                    <Button 
                      onClick={() => setReviewModal(true)}
                      className="bg-accent hover:bg-accent/90"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Write a Review
                    </Button>
                  )}
                </div>
                
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? "fill-accent text-accent" 
                                      : "text-muted-foreground"
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {review.comment}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {review.userName} - {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No reviews yet for this product.</p>
                    {canReview && (
                      <Button 
                        onClick={() => setReviewModal(true)}
                        className="bg-accent hover:bg-accent/90"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Be the first to review
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedCategory = category;
                  return (
                    <ProductCard 
                      key={relatedProduct.id} 
                      id={relatedProduct.id}
                      name={relatedProduct.name}
                      price={relatedProduct.price}
                      image={relatedProduct.imageUrls?.[0] || "/placeholder.svg"}
                      category={relatedCategory?.name || "Uncategorized"}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {product && (
        <ReviewModal
          isOpen={reviewModal}
          onClose={() => setReviewModal(false)}
          productId={product.id}
          productName={product.name}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default ProductDetail;
