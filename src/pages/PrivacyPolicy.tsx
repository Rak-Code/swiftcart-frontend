import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-bold">Privacy Policy</h1>
          </div>

          <div className="prose prose-sm sm:prose max-w-none space-y-6 sm:space-y-8">
            <section>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Last updated: December 7, 2025
              </p>
              <p className="text-sm sm:text-base leading-relaxed mt-4">
                At PARIBITO, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website and make purchases.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Information We Collect</h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div>
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-2">
                    <li>Name and contact information (email, phone number, address)</li>
                    <li>Payment information (processed securely through Razorpay)</li>
                    <li>Account credentials (username and password)</li>
                    <li>Order history and preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Automatically Collected Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    When you visit our website, we automatically collect:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-2">
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                    <li>Browsing behavior and preferences</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">How We Use Your Information</h2>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Process and fulfill your orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Communicate with you about your orders and account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Send promotional emails and marketing communications (with your consent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Improve our website and customer service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Prevent fraud and enhance security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Information Sharing</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span><strong>Service Providers:</strong> Payment processors, shipping companies, and email service providers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span><strong>Legal Requirements:</strong> When required by law or to protect our rights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</span>
                </li>
              </ul>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Data Security</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information. However, no method of transmission over the Internet is 100% secure. We use 
                industry-standard encryption for payment processing through Razorpay.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Your Rights</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Access and receive a copy of your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Correct inaccurate or incomplete information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Request deletion of your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Opt-out of marketing communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Withdraw consent at any time</span>
                </li>
              </ul>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Cookies</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, 
                analyze site traffic, and personalize content. You can control cookies through your 
                browser settings, but disabling them may affect website functionality.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Children's Privacy</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Our website is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13.
              </p>
            </section>

            <section className="bg-card p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Changes to This Policy</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="bg-accent/10 p-4 sm:p-6 rounded-lg border border-accent/20">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact Us</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your rights, 
                please contact us at:
              </p>
              <div className="mt-3 space-y-1 text-sm sm:text-base">
                <p><strong>Email:</strong> privacy@paribito.com</p>
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

export default PrivacyPolicy;
