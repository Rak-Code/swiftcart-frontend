import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Star, Users, DollarSign, TrendingUp, FileText } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  totalReviews: number;
  totalInvoices: number;
}

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalReviews: 0,
    totalInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }

    if (token) {
      // Verify token is valid before fetching
      verifyTokenAndFetch();
    } else {
      setError("No authentication token found. Please log in.");
      setLoading(false);
    }
  }, [user, navigate, token]);

  const verifyTokenAndFetch = async () => {
    // First try a simple authenticated endpoint to verify token
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const testResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "HEAD", // Just check if we can access
        headers: { Authorization: `Bearer ${token}` },
      });

      if (testResponse.status === 401) {
        console.error("Token verification failed - 401 Unauthorized");
        setError("Your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      // Token is valid, proceed with fetching
      fetchDashboardStats();
    } catch (error) {
      console.error("Token verification error:", error);
      fetchDashboardStats(); // Try anyway
    }
  };

  const fetchDashboardStats = async () => {
    if (!token) {
      console.error("No token available for API requests");
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

      console.log("=== Dashboard API Request Debug ===");
      console.log("API URL:", API_BASE_URL);
      console.log("Token present:", !!token);
      console.log("Token length:", token?.length);
      console.log("Token preview:", token?.substring(0, 30) + "...");
      console.log("User:", user?.email, "Role:", user?.role);
      console.log("Authorization header:", `Bearer ${token?.substring(0, 20)}...`);

      // Fetch all data in parallel
      const [productsRes, ordersRes, usersRes, reviewsRes, invoicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => {
          console.error("Users fetch error:", err);
          return null;
        }),
        fetch(`${API_BASE_URL}/api/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => {
          console.error("Reviews fetch error:", err);
          return null;
        }),
        fetch(`${API_BASE_URL}/api/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => {
          console.error("Invoices fetch error:", err);
          return null;
        }),
      ]);

      console.log("Products response:", productsRes?.status);
      console.log("Orders response:", ordersRes?.status);
      console.log("Users response:", usersRes?.status);
      console.log("Reviews response:", reviewsRes?.status);
      console.log("Invoices response:", invoicesRes?.status);

      if (!productsRes.ok || !ordersRes.ok) {
        const productsError = !productsRes.ok ? await productsRes.text() : "";
        const ordersError = !ordersRes.ok ? await ordersRes.text() : "";
        console.error("Products error:", productsError);
        console.error("Orders error:", ordersError);
        
        if (ordersRes.status === 401 || productsRes.status === 401) {
          throw new Error("Authentication failed (401). Your session may have expired.");
        }
        throw new Error("Failed to fetch dashboard data");
      }

      const products = await productsRes.json();
      const ordersData = await ordersRes.json();
      const usersData = usersRes && usersRes.ok ? await usersRes.json() : { content: [] };
      const reviewsData = reviewsRes && reviewsRes.ok ? await reviewsRes.json() : { content: [] };
      const invoicesData = invoicesRes && invoicesRes.ok ? await invoicesRes.json() : { content: [] };

      // Handle both array and paginated responses
      const productsList = Array.isArray(products) ? products : (products.content || []);
      const ordersList = Array.isArray(ordersData) ? ordersData : (ordersData.content || []);
      const usersList = Array.isArray(usersData) ? usersData : (usersData.content || []);
      const reviewsList = Array.isArray(reviewsData) ? reviewsData : (reviewsData.content || []);
      const invoicesList = Array.isArray(invoicesData) ? invoicesData : (invoicesData.content || []);

      const totalRevenue = ordersList.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = ordersList.filter((order: any) => order.status === "PENDING" || order.status === "pending").length;

      setStats({
        totalProducts: productsList.length,
        totalOrders: ordersList.length,
        totalUsers: usersList.length,
        totalRevenue,
        pendingOrders,
        totalReviews: reviewsList.length,
        totalInvoices: invoicesList.length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
      // Set default values on error
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalReviews: 0,
        totalInvoices: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Invoices",
      value: stats.totalInvoices,
      icon: FileText,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome back, {user?.fullName}</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading dashboard...</div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4 text-lg font-semibold">{error}</div>
              <div className="text-gray-600 mb-6">
                {error.includes("Authentication") || error.includes("401") 
                  ? "Your session may have expired. Please try logging out and logging in again."
                  : "There was a problem loading the dashboard data."}
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={fetchDashboardStats} variant="outline">Retry</Button>
                <Button onClick={() => { logout(); navigate("/login"); }}>Log Out & Re-login</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {statCards.map((stat, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/admin/products")}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-center">
                      <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-blue-600" />
                      <h3 className="font-semibold text-base sm:text-lg">Manage Products</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Add, edit, or remove products</p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/admin/categories")}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-center">
                      <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-green-600" />
                      <h3 className="font-semibold text-base sm:text-lg">Manage Categories</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Organize product categories</p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/admin/orders")}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-center">
                      <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-purple-600" />
                      <h3 className="font-semibold text-base sm:text-lg">Manage Orders</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">View and update order status</p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/admin/reviews")}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-center">
                      <Star className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-yellow-600" />
                      <h3 className="font-semibold text-base sm:text-lg">Manage Reviews</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitor product reviews</p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/admin/users")}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-center">
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-indigo-600" />
                      <h3 className="font-semibold text-base sm:text-lg">Manage Users</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">View and manage users</p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/admin/payments")}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-center">
                      <DollarSign className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-emerald-600" />
                      <h3 className="font-semibold text-base sm:text-lg">View Payments</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitor payment transactions</p>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/admin/invoices")}
                >
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="text-center">
                      <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-teal-600" />
                      <h3 className="font-semibold text-base sm:text-lg">Manage Invoices</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">View and download invoices</p>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
