import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Trash2, Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { addressApi, checkoutApi, paymentApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Address {
  id?: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, token, isAuthenticated } = useAuth();
  const { cart, clearCart, getCartTotal } = useCart();

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [newAddress, setNewAddress] = useState<Address>({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  const subtotal = getCartTotal();
  const shipping = 0; // Set to 0 for testing. Update this value later when needed (e.g., 99)
  const total = subtotal + shipping;

  useEffect(() => {
    // Check authentication and cart
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to proceed with checkout',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Cart is Empty',
        description: 'Add items to cart before checkout',
      });
      navigate('/cart');
      return;
    }

    if (token) {
      fetchAddresses();
    }
    setInitializing(false);
  }, [isAuthenticated, cart.length, token]);

  const fetchAddresses = async () => {
    if (!token) {
      console.warn('No token available for fetching addresses');
      return;
    }

    try {
      const userAddresses = await addressApi.getAll(token);
      setAddresses(userAddresses);

      // Select default address or first address
      const defaultAddr = userAddresses.find((a: Address) => a.isDefault);
      setSelectedAddress(defaultAddr || userAddresses[0] || null);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load addresses. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in again to add an address',
        variant: 'destructive',
      });
      return;
    }

    console.log('Adding address with token:', token ? 'Token exists' : 'No token');
    console.log('User:', user);

    setLoading(true);
    try {
      await addressApi.create(newAddress, token);
      
      toast({
        title: 'Success',
        description: 'Address added successfully',
      });

      await fetchAddresses();
      setShowAddressForm(false);
      setNewAddress({
        addressLine: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false,
      });
    } catch (error: any) {
      console.error('Add address error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add address',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return;

    try {
      await addressApi.delete(addressId, token);
      toast({
        title: 'Success',
        description: 'Address deleted successfully',
      });
      await fetchAddresses();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete address',
        variant: 'destructive',
      });
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: 'Address Required',
        description: 'Please select a delivery address',
        variant: 'destructive',
      });
      return;
    }

    if (!user || !token) return;

    setProcessingPayment(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Step 1: Create order first to get orderId
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // Transform address to match backend format
      const orderAddress = {
        street: selectedAddress.addressLine,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.postalCode,
        country: selectedAddress.country,
      };

      const order = await checkoutApi.createOrder(
        {
          userId: user.id,
          address: orderAddress,
          totalAmount: total,
          items: orderItems,
        },
        token
      );

      // Step 2: Create Razorpay Order with the orderId
      const razorpayOrder = await paymentApi.createRazorpayOrder(
        order.id,
        total,
        token
      );

      // Step 3: Open Razorpay Checkout
      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount * 100, // Convert to paise
        currency: razorpayOrder.currency,
        name: 'Paribito Gold',
        description: 'Order Payment',
        order_id: razorpayOrder.razorpayOrderId,
        handler: async function (response: any) {
          await verifyPaymentAndCreateOrder(response, order);
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#D4AF37',
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment',
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
      setProcessingPayment(false);
    }
  };

  const verifyPaymentAndCreateOrder = async (razorpayResponse: any, order: any) => {
    if (!user || !token) return;

    try {
      // Verify payment
      await paymentApi.verifyPayment(
        {
          razorpayOrderId: razorpayResponse.razorpay_order_id,
          razorpayPaymentId: razorpayResponse.razorpay_payment_id,
          razorpaySignature: razorpayResponse.razorpay_signature,
        },
        token
      );

      // Clear cart
      clearCart();

      toast({
        title: 'Order Placed Successfully!',
        description: 'Your order has been confirmed',
      });

      // Redirect to success page
      navigate(`/order-success?orderId=${order.id}`);
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Payment Verification Failed',
        description: error.message || 'Failed to verify payment. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-4 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Left Column - Address & Cart */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    Delivery Address
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Add New
                  </Button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="mb-4 sm:mb-6 p-3 sm:p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="addressLine" className="text-sm">Street Address *</Label>
                        <Input
                          id="addressLine"
                          value={newAddress.addressLine}
                          onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                          placeholder="123 Main Street, Apt 4B"
                          required
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-sm">City *</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm">State *</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          required
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode" className="text-sm">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          required
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-sm">Country *</Label>
                        <Input
                          id="country"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center space-x-2">
                        <Checkbox
                          id="isDefault"
                          checked={newAddress.isDefault}
                          onCheckedChange={(checked) =>
                            setNewAddress({ ...newAddress, isDefault: checked as boolean })
                          }
                        />
                        <Label htmlFor="isDefault" className="cursor-pointer text-xs sm:text-sm">
                          Set as default address
                        </Label>
                      </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                        className="w-full sm:w-auto"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="w-full sm:w-auto" size="sm">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Address'
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Address List */}
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAddress?.id === address.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{address.addressLine}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.country}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {address.isDefault && (
                              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (address.id) handleDeleteAddress(address.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No saved addresses. Add one to continue.
                  </p>
                )}
              </div>

              {/* Cart Items Section */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Order Items ({cart.length})
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-base sm:text-lg font-semibold text-accent">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <Separator className="my-3 sm:my-4" />

                <div className="flex justify-between text-base sm:text-lg font-bold mb-4 sm:mb-6">
                  <span>Total</span>
                  <span className="text-accent">₹{total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || processingPayment}
                  className="w-full h-10 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-sm sm:text-base"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3 sm:mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
