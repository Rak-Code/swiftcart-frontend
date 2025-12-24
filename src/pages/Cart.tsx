import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <a href="/">Continue Shopping</a>
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
      
      <main className="flex-1 py-4 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-20 h-24 sm:w-24 sm:h-32 md:w-32 md:h-40 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 line-clamp-2">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-foreground flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-base sm:text-lg font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Order Summary</h2>
                
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-accent">You saved ₹99 on shipping!</p>
                  )}
                </div>

                <Separator className="my-3 sm:my-4" />

                <div className="flex justify-between text-base sm:text-lg font-bold mb-4 sm:mb-6">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button 
                  className="w-full h-10 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium mb-2 sm:mb-3 text-sm sm:text-base"
                  asChild
                >
                  <a href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </Button>

                <Button variant="outline" className="w-full text-sm sm:text-base" asChild>
                  <a href="/">Continue Shopping</a>
                </Button>

                {subtotal < 999 && (
                  <p className="text-xs text-muted-foreground text-center mt-3 sm:mt-4">
                    Add ₹{(999 - subtotal).toLocaleString()} more to get free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
