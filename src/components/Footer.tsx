// import logoIcon from "@/assets/logo.jpg";
// import logoText from "@/assets/logotext.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { categoryApi } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCategoryId = (categoryName: string) => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.id;
  };
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-foreground">Athena</span>
            </div>
            <p className="text-xs text-primary-foreground/70 leading-relaxed">
              Premium men's fashion for the modern gentleman.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-3 text-sm text-accent tracking-wide">Shop</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link 
                  to={`/products${getCategoryId("shirts") ? `?category=${getCategoryId("shirts")}` : ""}`}
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Shirts
                </Link>
              </li>
              <li>
                <Link 
                  to={`/products${getCategoryId("t-shirts") ? `?category=${getCategoryId("t-shirts")}` : ""}`}
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link 
                  to={`/products${getCategoryId("bandis") ? `?category=${getCategoryId("bandis")}` : ""}`}
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Bandis
                </Link>
              </li>
              <li>
                <Link 
                  to={`/products${getCategoryId("blazers") ? `?category=${getCategoryId("blazers")}` : ""}`}
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Blazers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-3 text-sm text-accent tracking-wide">Help</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-primary-foreground/70 hover:text-accent transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-primary-foreground/70 hover:text-accent transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="text-primary-foreground/70 hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-sm text-accent tracking-wide">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="text-primary-foreground/70 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/size-guide" className="text-primary-foreground/70 hover:text-accent transition-colors">Size Guide</Link></li>
              <li><Link to="/terms" className="text-primary-foreground/70 hover:text-accent transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-primary-foreground/70 hover:text-accent transition-colors">Privacy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold mb-3 text-sm text-accent tracking-wide">Stay Updated</h4>
            <p className="text-xs text-primary-foreground/70 mb-3 leading-relaxed">
              Subscribe for exclusive offers.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-3 py-2 text-xs bg-primary-foreground/10 border border-primary-foreground/20 focus:outline-none focus:border-accent transition-colors"
              />
              <button className="px-3 py-2 bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50">
          <p>&copy; 2025 Athena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
