import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RotateCcw, Package, CheckCircle, Clock } from "lucide-react";

const Returns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-bold">Returns & Refunds</h1>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Overview */}
            <section className="bg-accent/10 p-4 sm:p-6 rounded-lg border border-accent/20">
              <p className="text-sm sm:text-base leading-relaxed">
                We want you to be completely satisfied with your purchase. If you're not happy with 
                your order, we offer a hassle-free 30-day return policy. Items must be unworn, unwashed, 
                and in their original condition with all tags attached.
              </p>
            </section>

            {/* Return Process */}
            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">How to Return an Item</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Initiate Return Request</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Log into your account, go to "My Orders," and select the item you wish to return. 
                      Click "Request Return" and choose your reason.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Pack Your Item</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Place the item in its original packaging with all tags attached. Include the 
                      return slip provided with your order.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Ship It Back</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use the prepaid return label we email you. Drop off the package at any authorized 
                      shipping location. You'll receive a tracking number.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Receive Your Refund</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Once we receive and inspect your return, we'll process your refund within 5-7 
                      business days to your original payment method.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Return Eligibility */}
            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Return Eligibility</h2>
              <div className="space-y-4 text-sm sm:text-base">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    Eligible for Return
                  </h3>
                  <ul className="space-y-2 ml-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Items returned within 30 days of delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Unworn and unwashed items with original tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Items in original packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Defective or damaged items (any time)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-destructive">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                    Not Eligible for Return
                  </h3>
                  <ul className="space-y-2 ml-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Items without original tags or packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Worn, washed, or altered items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Sale or clearance items (unless defective)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Gift cards and accessories</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Refund Information */}
            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Refund Information</h2>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Processing Time:</strong> Refunds are processed 
                  within 5-7 business days after we receive and inspect your return.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Refund Method:</strong> Refunds are issued to 
                  your original payment method. Credit card refunds may take an additional 3-5 business 
                  days to appear on your statement.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Shipping Costs:</strong> Original shipping costs 
                  are non-refundable unless the return is due to our error or a defective product.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Partial Refunds:</strong> In some cases, we may 
                  issue a partial refund for items that show signs of use or are missing components.
                </p>
              </div>
            </section>

            {/* Exchange Policy */}
            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Exchanges</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                We currently don't offer direct exchanges. If you need a different size or color:
              </p>
              <ol className="space-y-2 ml-2 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">1.</span>
                  <span>Return your original item following our return process</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">2.</span>
                  <span>Place a new order for the item you want</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">3.</span>
                  <span>Your refund will be processed once we receive your return</span>
                </li>
              </ol>
            </section>

            {/* Damaged or Defective Items */}
            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                If you receive a damaged or defective item, please contact us immediately at 
                support@paribito.com with:
              </p>
              <ul className="space-y-2 ml-2 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Your order number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Photos of the damaged or defective item</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Description of the issue</span>
                </li>
              </ul>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                We'll arrange for a replacement or full refund, including shipping costs.
              </p>
            </section>

            {/* Timeline */}
            <section className="bg-accent/10 p-4 sm:p-6 rounded-lg border border-accent/20">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                Return Timeline
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-background p-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">30</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Days to Return</div>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">5-7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Days to Process</div>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">3-5</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Days to Receive</div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Need Help?</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Our customer service team is here to assist you with any questions about returns or 
                refunds.
              </p>
              <div className="space-y-2 text-sm sm:text-base">
                <p><strong>Email:</strong> support@paribito.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;
