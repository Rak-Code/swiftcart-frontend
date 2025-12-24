import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { orderApi, invoiceApi } from "@/lib/api";
import { Search, ArrowLeft, FileText, Download } from "lucide-react";

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

const OrdersManagement = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Record<string, any>>({});
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [user, navigate, token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await orderApi.getAll(token);
      // Handle both array and paginated responses
      const ordersList = Array.isArray(data) ? data : (data.content || []);
      setOrders(ordersList);
      setFilteredOrders(ordersList);
      
      // Fetch invoices for delivered orders
      const invoiceMap: Record<string, any> = {};
      for (const order of ordersList) {
        if (order.status === "delivered") {
          try {
            const invoice = await invoiceApi.getByOrderId(order.id, token);
            invoiceMap[order.id] = invoice;
          } catch (error) {
            // Invoice might not exist yet
            console.log(`No invoice found for order ${order.id}`);
          }
        }
      }
      setInvoices(invoiceMap);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
      setFilteredOrders([]);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!token) return;
    
    try {
      await orderApi.updateStatus(orderId, status, token);
      toast({ title: "Success", description: "Order status updated" });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const downloadInvoice = async (orderId: string, invoiceNumber: string) => {
    if (!token || !invoices[orderId]) return;
    
    try {
      setDownloadingInvoice(orderId);
      const blob = await invoiceApi.download(invoices[orderId].id, token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Success", description: "Invoice downloaded successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      });
    } finally {
      setDownloadingInvoice(null);
    }
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
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">View and manage customer orders</p>
          </div>

          <Card className="mb-4 sm:mb-6">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                <Button onClick={fetchOrders} variant="outline" size="sm" className="w-full sm:w-auto">
                  Refresh
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No orders found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">Order #{order.id}</CardTitle>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-xs whitespace-nowrap`}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Shipping Address</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {order.address.addressLine}
                          <br />
                          {order.address.city}, {order.address.state}{" "}
                          {order.address.postalCode}
                          <br />
                          {order.address.country}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Order Details</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Items: {order.items.length}
                          <br />
                          Total: ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Update Status:</span>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {invoices[order.id] && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 flex-1">
                            <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-green-600 font-medium truncate">
                              Invoice: {invoices[order.id].invoiceNumber}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadInvoice(order.id, invoices[order.id].invoiceNumber)}
                            disabled={downloadingInvoice === order.id}
                            className="w-full sm:w-auto text-xs"
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {downloadingInvoice === order.id ? "Downloading..." : "Download"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersManagement;
