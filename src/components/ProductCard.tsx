import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({ id, name, price, image, category, isNew }: ProductCardProps) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { toast } = useToast();
  const inWishlist = isInWishlist(id);

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(id);
      toast({
        title: "Removed from wishlist",
        description: `${name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({ id, name, price, image, category, isNew });
      toast({
        title: "Added to wishlist",
        description: `${name} has been added to your wishlist.`,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, name, price, image, category, isNew });
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };
  return (
    <a 
      href={`/product/${id}`} 
      className="group block bg-card overflow-hidden border border-border hover:border-foreground/20 transition-all duration-200"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        
        {/* New Badge */}
        {isNew && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-primary-foreground px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold tracking-wider">
            NEW
          </div>
        )}

        {/* Wishlist Button - Always visible on mobile, hover on desktop */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <Button 
            size="icon"
            variant="secondary"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shadow-lg sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Quick Actions Overlay - Desktop only */}
        <div className="hidden sm:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-3 left-3 right-3">
            <Button 
              size="sm" 
              className="w-full h-9 bg-accent hover:bg-accent/90 text-xs font-medium"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Mobile Add to Cart Button - Always visible */}
        <div className="sm:hidden absolute bottom-2 left-2 right-2">
          <Button 
            size="sm" 
            className="w-full h-8 bg-accent hover:bg-accent/90 text-xs font-medium"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2.5 sm:p-3.5">
        <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1 sm:mb-1.5 font-medium">
          {category}
        </div>
        <h3 className="font-medium text-xs sm:text-sm text-foreground mb-1.5 sm:mb-2 line-clamp-2 leading-snug">
          {name}
        </h3>
        <div className="text-sm sm:text-base font-semibold text-foreground">
          ₹{price.toLocaleString()}
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
