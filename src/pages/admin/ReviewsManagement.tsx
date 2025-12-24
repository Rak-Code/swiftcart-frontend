import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Trash2, Search, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reviewApi } from "@/lib/api";

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewsManagement = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchReviews();
  }, [user, navigate, token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = reviews.filter(
        (r) =>
          r.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews);
    }
  }, [searchTerm, reviews]);

  const fetchReviews = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await reviewApi.getAll(token);
      // Handle both array and paginated responses
      const reviewsList = Array.isArray(data) ? data : (data.content || []);
      setReviews(reviewsList);
      setFilteredReviews(reviewsList);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
      setFilteredReviews([]);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    if (!token) return;

    try {
      await reviewApi.delete(id, token);
      toast({ title: "Success", description: "Review deleted successfully" });
      fetchReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const averageRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : "0.0";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage product reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredReviews.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{averageRating}</div>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  5-Star Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredReviews.filter((r) => r.rating === 5).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by product ID, user ID, or comment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchReviews} variant="outline">
                  Refresh
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="text-center py-12">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No reviews found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          Product ID: {review.productId} | User ID: {review.userId}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewsManagement;
