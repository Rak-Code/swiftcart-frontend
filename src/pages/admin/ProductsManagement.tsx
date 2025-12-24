import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Search, Package, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { apiClient } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  color?: string;
  size?: string;
  imageUrls: string[];
}

const ProductsManagement = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/products", token);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch products. Make sure the backend is running on port 8080.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await apiClient.delete(`/api/products/${id}`, token);

      if (response.ok) {
        toast({ title: "Success", description: "Product deleted successfully" });
        fetchProducts();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-4 text-sm"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Products Management</h1>
            <Button onClick={handleAdd} className="w-full sm:w-auto" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? "No products match your search query." 
                    : "Get started by adding your first product."}
                </p>
                {!searchQuery && (
                  <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={product.imageUrls[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <span className="text-base sm:text-lg font-bold">₹{product.price}</span>
                      <span className="text-xs sm:text-sm text-gray-600">
                        Stock: {product.stockQuantity}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <ProductFormModal
        open={showModal}
        onClose={handleModalClose}
        onSuccess={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductsManagement;
