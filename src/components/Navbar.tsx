import { Search, Heart, ShoppingBag, Menu, User, LogOut, Package, UserCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import logoIcon from "@/assets/logo.jpg";
// import logoText from "@/assets/logotext.png";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { categoryApi, productApi, API_BASE_URL } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls?: string[];
}

const Navbar = () => {
  const { getCartCount, wishlist } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await productApi.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleProductClick = (productId: string) => {
    setShowSearchDialog(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/products/${productId}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold" style={{ color: '#363636' }}>Athena</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link 
              to={`/products${getCategoryId("shirts") ? `?category=${getCategoryId("shirts")}` : ""}`}
              className="text-xs font-medium tracking-wider hover:text-accent transition-colors duration-200"
            >
              SHIRTS
            </Link>
            <Link 
              to={`/products${getCategoryId("t-shirts") ? `?category=${getCategoryId("t-shirts")}` : ""}`}
              className="text-xs font-medium tracking-wider hover:text-accent transition-colors duration-200"
            >
              T-SHIRTS
            </Link>
            <Link 
              to={`/products${getCategoryId("bandis") ? `?category=${getCategoryId("bandis")}` : ""}`}
              className="text-xs font-medium tracking-wider hover:text-accent transition-colors duration-200"
            >
              BANDIS
            </Link>
            <Link 
              to={`/products${getCategoryId("blazers") ? `?category=${getCategoryId("blazers")}` : ""}`}
              className="text-xs font-medium tracking-wider hover:text-accent transition-colors duration-200"
            >
              BLAZERS
            </Link>
            {user?.role === "ADMIN" && (
              <Link to="/admin" className="text-xs font-medium tracking-wider hover:text-accent transition-colors duration-200 text-purple-600">
                ADMIN
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex h-9 w-9 hover:bg-transparent hover:text-accent"
              aria-label="Search"
              onClick={() => setShowSearchDialog(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              className="relative h-9 w-9 hover:bg-transparent hover:text-accent"
              aria-label="Wishlist"
              asChild
            >
              <Link to="/wishlist">
                <Heart className="h-4 w-4" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 hover:bg-transparent hover:text-accent"
              aria-label="Shopping cart"
              asChild
            >
              <Link to="/cart">
                <ShoppingBag className="h-4 w-4" />
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hidden sm:flex h-9 w-9 hover:bg-transparent hover:text-accent"
                    aria-label="Account"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer text-purple-600">
                          <UserCircle className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                className="hidden sm:flex h-9 w-9 hover:bg-transparent hover:text-accent"
                aria-label="Account"
                onClick={() => setShowLoginModal(true)}
              >
                <User className="h-4 w-4" />
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden h-9 w-9 hover:bg-transparent hover:text-accent"
              aria-label="Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background">
            <div className="px-4 py-4 space-y-3">
              {/* Search on Mobile */}
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => {
                  setShowSearchDialog(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Search className="h-4 w-4" />
                Search Products
              </Button>

              {/* Category Links */}
              <Link 
                to={`/products${getCategoryId("shirts") ? `?category=${getCategoryId("shirts")}` : ""}`}
                className="block py-2 text-sm font-medium tracking-wider hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SHIRTS
              </Link>
              <Link 
                to={`/products${getCategoryId("t-shirts") ? `?category=${getCategoryId("t-shirts")}` : ""}`}
                className="block py-2 text-sm font-medium tracking-wider hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                T-SHIRTS
              </Link>
              <Link 
                to={`/products${getCategoryId("bandis") ? `?category=${getCategoryId("bandis")}` : ""}`}
                className="block py-2 text-sm font-medium tracking-wider hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BANDIS
              </Link>
              <Link 
                to={`/products${getCategoryId("blazers") ? `?category=${getCategoryId("blazers")}` : ""}`}
                className="block py-2 text-sm font-medium tracking-wider hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BLAZERS
              </Link>

              {/* User Actions on Mobile */}
              <div className="pt-3 border-t border-border/50 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile"
                      className="flex items-center gap-2 py-2 text-sm font-medium hover:text-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link 
                      to="/orders"
                      className="flex items-center gap-2 py-2 text-sm font-medium hover:text-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link 
                        to="/admin"
                        className="flex items-center gap-2 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4" />
                    Login / Register
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal 
        open={showRegisterModal} 
        onOpenChange={setShowRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Search Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="pl-10 pr-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto mt-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found for "{searchQuery}"
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                      <p className="text-sm font-semibold mt-1">₹{product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Start typing to search for products
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
