import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-bold">Terms & Conditions</h1>
          </div>

          <div className="prose prose-sm sm:prose max-w-none space-y-6 sm:space-y-8">
            <section>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Last updated: December 7, 2025
              </p>
              <p className="text-sm sm:text-base leading-relaxed mt-4">
                Welcome to PARIBITO. By accessing and using our website, you agree to be bound by these 
                Terms and Conditions. Please read them carefully before making any purchase.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                By using this website, you confirm that you are at least 18 years old or have parental 
                consent. You agree to comply with all applicable laws and regulations. If you do not 
                agree with these terms, please do not use our website.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">2. Account Registration</h2>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p className="leading-relaxed">
                  To make purchases, you must create an account. You agree to:
                </p>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Provide accurate and complete information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Maintain the security of your password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Accept responsibility for all activities under your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Notify us immediately of any unauthorized use</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">3. Product Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We strive to display product colors and images as accurately as possible. However, we 
                cannot guarantee that your device's display will accurately reflect the actual product 
                colors. All product descriptions, prices, and availability are subject to change without 
                notice.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">4. Pricing and Payment</h2>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p className="leading-relaxed">
                  All prices are listed in Indian Rupees (INR) and include applicable taxes unless 
                  otherwise stated. We reserve the right to:
                </p>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Modify prices at any time without prior notice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Correct pricing errors on our website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Cancel orders placed at incorrect prices</span>
                  </li>
                </ul>
                <p className="leading-relaxed mt-3">
                  Payment is processed securely through Razorpay. We accept credit cards, debit cards, 
                  and UPI payments.
                </p>
              </div>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">5. Order Processing</h2>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p className="leading-relaxed">
                  When you place an order:
                </p>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>You will receive an order confirmation email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Orders are processed within 1-2 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>We reserve the right to refuse or cancel any order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Orders can be cancelled within 2 hours of placement</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">6. Shipping and Delivery</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Shipping times and costs vary based on your location and selected shipping method. 
                We are not responsible for delays caused by shipping carriers or customs. Risk of loss 
                transfers to you upon delivery to the carrier.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">7. Returns and Refunds</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We offer a 30-day return policy for unworn items with original tags. Please refer to 
                our Returns & Refunds page for detailed information. Refunds are processed to the 
                original payment method within 5-7 business days after we receive your return.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">8. Intellectual Property</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, 
                is the property of PARIBITO and protected by copyright and trademark laws. You may not 
                reproduce, distribute, or create derivative works without our written permission.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">9. Prohibited Activities</h2>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                <p className="leading-relaxed">
                  You agree not to:
                </p>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Use the website for any illegal purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Attempt to gain unauthorized access to our systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Interfere with the proper functioning of the website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Use automated systems to access the website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Impersonate any person or entity</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">10. Limitation of Liability</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                PARIBITO shall not be liable for any indirect, incidental, special, or consequential 
                damages arising from your use of the website or products. Our total liability shall not 
                exceed the amount you paid for the product in question.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">11. Governing Law</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by the laws of India. Any disputes shall be 
                resolved in the courts of New York, NY.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">12. Changes to Terms</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be 
                effective immediately upon posting. Your continued use of the website constitutes 
                acceptance of the modified terms.
              </p>
            </section>

            <section className="bg-accent/10 p-4 sm:p-6 rounded-lg border border-accent/20">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                For questions about these Terms and Conditions, please contact us:
              </p>
              <div className="mt-3 space-y-1 text-sm sm:text-base">
                <p><strong>Email:</strong> legal@paribito.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Fashion Street, New York, NY 10001</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
