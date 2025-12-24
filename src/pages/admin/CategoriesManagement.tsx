import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CategoryFormModal from "@/components/admin/CategoryFormModal";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

const CategoriesManagement = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories?t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      
      const data = await response.json();
      console.log("Raw categories data from API:", data);
      
      // Handle malformed response from backend (wrapped in ArrayList type)
      let categoriesData = data;
      if (Array.isArray(data) && data.length === 2 && data[0] === "java.util.ArrayList") {
        categoriesData = data[1];
        console.log("Unwrapped ArrayList response");
      }
      
      console.log("Number of categories:", categoriesData?.length);
      if (Array.isArray(categoriesData)) {
        categoriesData.forEach((cat: any, idx: number) => {
          console.log(`Category ${idx}:`, { id: cat.id, name: cat.name });
        });
      }
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({ title: "Success", description: "Category deleted successfully" });
        fetchCategories();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
    fetchCategories();
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
            <h1 className="text-2xl sm:text-3xl font-bold">Categories Management</h1>
            <Button onClick={handleAdd} className="w-full sm:w-auto" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No categories found. Click "Add Category" to create one.
                </div>
              ) : (
                categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4">
                        {category.name || "(No name)"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4 truncate">
                        ID: {category.id}
                      </p>
                      {category.createdAt && (
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                          Created: {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <CategoryFormModal
        open={showModal}
        onClose={handleModalClose}
        category={editingCategory}
      />
    </div>
  );
};

export default CategoriesManagement;
