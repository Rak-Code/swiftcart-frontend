import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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

interface Category {
  id: string;
  name: string;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product: Product | null;
}

const ProductFormModal = ({ open, onClose, onSuccess, product }: ProductFormModalProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    color: "",
    size: "",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stockQuantity: product.stockQuantity.toString(),
          categoryId: product.categoryId,
          color: product.color || "",
          size: product.size || "",
        });
        setImagePreviews(product.imageUrls || []);
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          stockQuantity: "",
          categoryId: "",
          color: "",
          size: "",
        });
        setImagePreviews([]);
      }
      setImages(null);
    }
  }, [product, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImages(files);
    
    if (files && files.length > 0) {
      const previews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setImagePreviews([]);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await apiClient.get("/api/categories", token);
      if (response.ok) {
        const data = await response.json();
        console.log("Categories fetched:", data);
        setCategories(data);
        if (data.length === 0) {
          toast({
            title: "No Categories",
            description: "Please create categories first before adding products.",
            variant: "destructive",
          });
        }
      } else {
        console.error("Failed to fetch categories, status:", response.status);
        toast({
          title: "Warning",
          description: `Failed to load categories (${response.status}). ${response.status === 401 ? 'Authentication required.' : 'Make sure backend is running.'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Could not connect to server. Is the backend running on port 8080?",
        variant: "destructive",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stockQuantity", formData.stockQuantity);
      formDataToSend.append("categoryId", formData.categoryId);
      if (formData.color) formDataToSend.append("color", formData.color);
      if (formData.size) formDataToSend.append("size", formData.size);

      if (images) {
        Array.from(images).forEach((file) => {
          formDataToSend.append("images", file);
        });
      }

      const endpoint = product ? `/api/products/${product.id}` : "/api/products";
      const response = product 
        ? await apiClient.put(endpoint, formDataToSend, token)
        : await apiClient.post(endpoint, formDataToSend, token);

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${product ? "updated" : "created"} successfully`,
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${product ? "update" : "create"} product`);
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="text-sm min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
                className="text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category" className="text-sm">Category *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              required
              disabled={categoriesLoading}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <div className="p-2 text-sm text-gray-500">Loading...</div>
                ) : categories.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No categories available. Create one first.</div>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color" className="text-sm">Color (Optional)</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="size" className="text-sm">Size (Optional)</Label>
              <Select
                value={formData.size || "none"}
                onValueChange={(value) => setFormData({ ...formData, size: value === "none" ? "" : value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                  <SelectItem value="XXXL">XXXL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="images" className="text-sm">Product Images (Multiple)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="text-sm"
            />
            {images && images.length > 0 && (
              <p className="text-xs sm:text-sm text-green-600 font-medium mt-2">
                ✓ {images.length} image{images.length > 1 ? 's' : ''} selected
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple images at once
            </p>
            
            {imagePreviews.length > 0 && (
              <div className="mt-3">
                <p className="text-xs sm:text-sm font-medium mb-2">Preview:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded border overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
