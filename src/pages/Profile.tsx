import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { addressApi, userApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Plus, Trash2, Edit, Star, User } from "lucide-react";

interface Address {
  addressId: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  default: boolean;
}

const Profile = () => {
  const { user, isAuthenticated, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [profileForm, setProfileForm] = useState({
    phone: "",
  });

  useEffect(() => {
    if (isAuthenticated && token) {
      loadAddresses();
    }
  }, [isAuthenticated, token]);

  const loadAddresses = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await addressApi.getAll(token);
      setAddresses(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    setIsAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.default,
    });
    setIsAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!token) return;

    if (!addressForm.addressLine || !addressForm.city || !addressForm.state || !addressForm.postalCode || !addressForm.country) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      if (editingAddress) {
        await addressApi.update(editingAddress.addressId, addressForm, token);
        toast.success("Address updated successfully");
      } else {
        await addressApi.create(addressForm, token);
        toast.success("Address added successfully");
      }
      setIsAddressDialogOpen(false);
      loadAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return;
    
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      setLoading(true);
      await addressApi.delete(addressId, token);
      toast.success("Address deleted successfully");
      loadAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      await addressApi.setDefault(addressId, token);
      toast.success("Default address updated");
      loadAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to set default address");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setProfileForm({
      phone: user?.phone || "",
    });
    setIsProfileDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!token || !user?.id) return;

    if (!profileForm.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await userApi.update(user.id, { phone: profileForm.phone }, token);
      
      // Update the user in auth context
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      toast.success("Profile updated successfully");
      setIsProfileDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Account Information</CardTitle>
                <Button onClick={handleEditProfile} size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user?.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Saved Addresses</CardTitle>
                <Button onClick={handleAddAddress} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent>
                {loading && addresses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                    <Button onClick={handleAddAddress} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <Card key={address.addressId} className={address.default ? "border-primary" : ""}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {address.default && (
                                <span className="flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAddress(address.addressId)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">{address.addressLine}</p>
                            <p className="text-muted-foreground">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-muted-foreground">{address.country}</p>
                          </div>
                          {!address.default && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4 w-full"
                              onClick={() => handleSetDefault(address.addressId)}
                            >
                              Set as Default
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update your address details" : "Add a new delivery address"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="addressLine">Address Line</Label>
              <Input
                id="addressLine"
                placeholder="Street address, apartment, suite, etc."
                value={addressForm.addressLine}
                onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Postal code"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={addressForm.isDefault}
                onCheckedChange={(checked) => 
                  setAddressForm({ ...addressForm, isDefault: checked as boolean })
                }
              />
              <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} disabled={loading}>
              {loading ? "Saving..." : editingAddress ? "Update" : "Add"} Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={user?.fullName || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Name cannot be changed</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Profile;
