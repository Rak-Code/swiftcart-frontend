import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, CreditCard, Calendar, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { paymentApi } from "@/lib/api";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}

const PaymentsManagement = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchPayments();
  }, [user, navigate, token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = payments.filter(
        (p) =>
          p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments);
    }
  }, [searchTerm, payments]);

  const fetchPayments = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await paymentApi.getAll(token);
      // Handle both array and paginated responses
      const paymentsList = Array.isArray(data) ? data : (data.content || []);
      setPayments(paymentsList);
      setFilteredPayments(paymentsList);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; icon: any }> = {
      SUCCESS: { variant: "default", icon: CheckCircle },
      FAILED: { variant: "destructive", icon: XCircle },
      PENDING: { variant: "secondary", icon: DollarSign },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const totalAmount = filteredPayments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

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
            <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
            <p className="text-gray-600 mt-2">Monitor payment transactions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredPayments.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Successful Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredPayments.filter((p) => p.status === "SUCCESS").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by order ID, transaction ID, or payment method..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchPayments} variant="outline">
                  Refresh
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="text-center py-12">Loading payments...</div>
          ) : filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No payments found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-sm text-gray-600">Payment ID</p>
                        <p className="font-medium truncate">{payment.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-medium truncate">{payment.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-bold text-lg">₹{payment.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{payment.paymentMethod}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(payment.createdAt)}</span>
                      </div>
                      {payment.transactionId && (
                        <div>
                          <span className="text-gray-500">Transaction ID: </span>
                          <span className="font-mono">{payment.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentsManagement;
