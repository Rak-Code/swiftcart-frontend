import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, Calendar, User, ArrowLeft } from "lucide-react";
import { userApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: string;
  addresses?: any[];
}

const UsersManagement = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [user, navigate, token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await userApi.getAll(token);
      // Handle both array and paginated responses
      const usersList = Array.isArray(data) ? data : (data.content || []);
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">View and manage registered users</p>
          </div>

          <Card className="mb-4 sm:mb-6">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                <Button onClick={fetchUsers} variant="outline" size="sm" className="w-full sm:w-auto">
                  Refresh
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="text-center py-12">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No users found
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredUsers.map((u) => (
                <Card key={u.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg truncate">{u.fullName}</CardTitle>
                          <Badge
                            variant={u.role === "ADMIN" ? "default" : "secondary"}
                            className="mt-1 text-xs"
                          >
                            {u.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{u.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Joined {formatDate(u.createdAt)}</span>
                    </div>
                    {u.addresses && u.addresses.length > 0 && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>{u.addresses.length} address(es)</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UsersManagement;
