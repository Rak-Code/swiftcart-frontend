import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Truck, Clock } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shipping Information</h1>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <div className="flex items-start gap-3 sm:gap-4">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">Shipping Methods</h2>
                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <p className="leading-relaxed"><strong>Standard Shipping:</strong> 5-7 business days - Free on orders over $50</p>
                    <p className="leading-relaxed"><strong>Express Shipping:</strong> 2-3 business days - $15</p>
                    <p className="leading-relaxed"><strong>Next Day Delivery:</strong> 1 business day - $25</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <div className="flex items-start gap-3 sm:gap-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">Processing Time</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Orders are processed within 1-2 business days. Orders placed on weekends 
                    or holidays will be processed the next business day.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <div className="flex items-start gap-3 sm:gap-4">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3">Tracking Your Order</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Once your order ships, you'll receive a tracking number via email. 
                    You can also track your order status from your account dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">International Shipping</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 leading-relaxed">
                We currently ship to select international destinations. Shipping times 
                and costs vary by location.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                <strong>Note:</strong> International orders may be subject to customs 
                duties and taxes, which are the responsibility of the customer.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;
