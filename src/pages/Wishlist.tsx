import { Heart, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: typeof wishlist[0]) => {
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you love for later</p>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <a href="/">Start Shopping</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <span className="text-muted-foreground">{wishlist.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {item.category}
                  </div>
                  <h3 className="font-medium mb-2 line-clamp-2">{item.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold">₹{item.price.toLocaleString()}</span>
                  </div>

                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <a href="/">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
