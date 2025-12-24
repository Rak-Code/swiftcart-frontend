import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Award, Users, Sparkles } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">About PARIBITO</h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Redefining men's fashion with timeless elegance and contemporary style
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-8 sm:space-y-12">
            <section className="bg-card p-6 sm:p-8 rounded-lg border">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Story</h2>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, PARIBITO emerged from a simple vision: to create premium men's 
                  fashion that seamlessly blends traditional craftsmanship with modern aesthetics. 
                  Our name, inspired by the concept of transformation, reflects our commitment to 
                  helping every man discover his unique style.
                </p>
                <p>
                  What started as a small boutique in New York has grown into a beloved brand known 
                  for its attention to detail, quality fabrics, and impeccable fit. Every piece in 
                  our collection is thoughtfully designed to empower the modern gentleman.
                </p>
                <p>
                  Today, PARIBITO serves thousands of customers worldwide, but our core values remain 
                  unchanged: quality, authenticity, and exceptional customer service.
                </p>
              </div>
            </section>

            {/* Values Grid */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Our Values</h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-card p-5 sm:p-6 rounded-lg border hover:border-accent transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Quality First</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We source the finest fabrics and employ skilled artisans to ensure every 
                        garment meets our exacting standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-5 sm:p-6 rounded-lg border hover:border-accent transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Customer Centric</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Your satisfaction is our priority. We're committed to providing exceptional 
                        service at every touchpoint.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-5 sm:p-6 rounded-lg border hover:border-accent transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We constantly evolve our designs and processes to stay ahead of fashion 
                        trends while honoring timeless style.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-5 sm:p-6 rounded-lg border hover:border-accent transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Community</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We believe in building lasting relationships with our customers and giving 
                        back to the communities we serve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Mission Section */}
            <section className="bg-accent/10 p-6 sm:p-8 rounded-lg border border-accent/20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Our Mission</h2>
              <p className="text-sm sm:text-base text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                To empower men to express their individuality through premium, thoughtfully designed 
                clothing that combines comfort, style, and confidence. We strive to make luxury 
                accessible while maintaining the highest standards of quality and sustainability.
              </p>
            </section>

            {/* Craftsmanship Section */}
            <section className="bg-card p-6 sm:p-8 rounded-lg border">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Craftsmanship & Quality</h2>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  Every PARIBITO garment is a testament to exceptional craftsmanship. We work with 
                  experienced tailors and use premium fabrics sourced from renowned mills around the 
                  world.
                </p>
                <p>
                  Our quality control process is rigorous. Each piece undergoes multiple inspections 
                  to ensure it meets our standards for fit, finish, and durability. We believe that 
                  true luxury lies in the details.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">100%</div>
                    <div className="text-xs sm:text-sm">Premium Fabrics</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">5+</div>
                    <div className="text-xs sm:text-sm">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">10K+</div>
                    <div className="text-xs sm:text-sm">Happy Customers</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sustainability Section */}
            <section className="bg-card p-6 sm:p-8 rounded-lg border">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Sustainability Commitment</h2>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  We recognize our responsibility to the planet and future generations. That's why 
                  we're committed to sustainable practices throughout our supply chain.
                </p>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Eco-friendly packaging materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Ethical manufacturing partnerships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Sustainable fabric sourcing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Waste reduction initiatives</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="text-center bg-primary text-primary-foreground p-8 sm:p-10 rounded-lg">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Join Our Journey</h2>
              <p className="text-sm sm:text-base text-primary-foreground/80 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
                Experience the PARIBITO difference. Discover clothing that's crafted with care, 
                designed with purpose, and made to last.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a 
                  href="/products" 
                  className="inline-block px-6 sm:px-8 py-3 bg-accent text-accent-foreground font-medium rounded hover:bg-accent/90 transition-colors"
                >
                  Shop Collection
                </a>
                <a 
                  href="/contact" 
                  className="inline-block px-6 sm:px-8 py-3 bg-primary-foreground text-primary font-medium rounded hover:bg-primary-foreground/90 transition-colors"
                >
                  Get in Touch
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
