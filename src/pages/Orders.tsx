import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, Eye, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewModal from '@/components/ReviewModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { checkoutApi, reviewApi, productApi } from '@/lib/api';

interface Order {
  id: string;
  userId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalAmount: number;
  status: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

const Orders = () => {
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewableProducts, setReviewableProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<Record<string, any>>({});
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: '',
    productName: ''
  });

  useEffect(() => {
    // Only redirect if definitely not authenticated
    if (isAuthenticated === false && !user && !token) {
      navigate('/');
      return;
    }

    if (isAuthenticated && user && token) {
      fetchOrders();
    }
  }, [isAuthenticated, user, token]);

  const fetchOrders = async () => {
    if (!user || !token) return;

    try {
      const userOrders = await checkoutApi.getUserOrders(user.id, token);
      setOrders(userOrders);
      
      // Fetch reviewable products
      const reviewableProductIds = await checkoutApi.getReviewableProducts(user.id, token);
      setReviewableProducts(reviewableProductIds);
      
      // Fetch product details for all products in orders
      const allProductIds = userOrders.flatMap((order: Order) => 
        order.items.map(item => item.productId)
      );
      const uniqueProductIds = [...new Set(allProductIds)];
      
      const productDetails: Record<string, any> = {};
      await Promise.all(
        uniqueProductIds.map(async (productId) => {
          try {
            const product = await productApi.getById(productId);
            productDetails[productId] = product;
          } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
          }
        })
      );
      setProducts(productDetails);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return statusColors[status.toLowerCase()] || statusColors.pending;
  };

  const handleWriteReview = (productId: string) => {
    const product = products[productId];
    setReviewModal({
      isOpen: true,
      productId,
      productName: product?.name || 'Product'
    });
  };

  const handleReviewSubmitted = () => {
    // Refresh reviewable products after review submission
    if (user && token) {
      checkoutApi.getReviewableProducts(user.id, token)
        .then(setReviewableProducts)
        .catch(console.error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No orders yet. Start shopping to see your orders here!
              </p>
              <Button onClick={() => navigate('/')}>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Items</p>
                        <p className="font-medium">{order.items.length} item(s)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-accent">
                          ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Address</p>
                        <p className="font-medium text-sm">
                          {order.address.city}, {order.address.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-medium text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/order-success?orderId=${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <div className="flex gap-2 flex-wrap">
                        {order.items
                          .filter(item => reviewableProducts.includes(item.productId))
                          .map(item => (
                            <Button
                              key={item.productId}
                              variant="default"
                              size="sm"
                              onClick={() => handleWriteReview(item.productId)}
                              className="bg-accent hover:bg-accent/90"
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Review {products[item.productId]?.name || 'Product'}
                            </Button>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
      
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, productId: '', productName: '' })}
        productId={reviewModal.productId}
        productName={reviewModal.productName}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default Orders;
