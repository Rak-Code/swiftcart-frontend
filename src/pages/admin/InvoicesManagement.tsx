import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { invoiceApi } from "@/lib/api";
import { Search, ArrowLeft, Download, FileText, Mail, CheckCircle, XCircle } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  taxAmount: number;
  subtotal: number;
  invoiceDate: string;
  generatedAt: string;
  pdfPath: string;
  emailedToCustomer: boolean;
  emailedToAdmin: boolean;
}

const InvoicesManagement = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchInvoices();
  }, [user, navigate, token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [searchTerm, invoices]);

  const fetchInvoices = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await invoiceApi.getAll(token);
      // Handle both array and paginated responses
      const invoicesList = Array.isArray(data) ? data : (data.content || []);
      setInvoices(invoicesList);
      setFilteredInvoices(invoicesList);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      setInvoices([]);
      setFilteredInvoices([]);
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    if (!token) return;
    
    try {
      setDownloading(invoiceId);
      const blob = await invoiceApi.download(invoiceId, token);
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
      setDownloading(null);
    }
  };

  const downloadAllInvoices = async () => {
    if (!token) return;
    
    try {
      setDownloading("all");
      const blob = await invoiceApi.downloadAll(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `all-invoices-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Success", description: "All invoices downloaded successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download all invoices",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Invoices Management</h1>
            <p className="text-gray-600 mt-2">View and download customer invoices</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by invoice number, order ID, customer name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchInvoices} variant="outline">
                  Refresh
                </Button>
                <Button 
                  onClick={downloadAllInvoices} 
                  disabled={downloading === "all" || invoices.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloading === "all" ? "Downloading..." : "Download All"}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="text-center py-12">Loading invoices...</div>
          ) : filteredInvoices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No invoices found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {invoice.invoiceNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Generated: {new Date(invoice.generatedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber)}
                        disabled={downloading === invoice.id}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloading === invoice.id ? "Downloading..." : "Download"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Customer Details</h4>
                        <p className="text-sm text-gray-600">
                          {invoice.customerName}
                          <br />
                          {invoice.customerEmail}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Order Information</h4>
                        <p className="text-sm text-gray-600">
                          Order ID: {invoice.orderId}
                          <br />
                          Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Amount Details</h4>
                        <p className="text-sm text-gray-600">
                          Subtotal: ₹{invoice.subtotal.toFixed(2)}
                          <br />
                          Tax (18%): ₹{invoice.taxAmount.toFixed(2)}
                          <br />
                          <span className="font-semibold">Total: ₹{invoice.totalAmount.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Customer:</span>
                        {invoice.emailedToCustomer ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Sent
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Admin:</span>
                        {invoice.emailedToAdmin ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Sent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvoicesManagement;
