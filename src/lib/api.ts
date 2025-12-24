export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      return response;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  },

  async get(endpoint: string, token?: string) {
    return this.fetch(endpoint, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  async post(endpoint: string, data: any, token?: string) {
    const isFormData = data instanceof FormData;
    
    console.log(`POST ${endpoint}`, {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      data: isFormData ? 'FormData' : data
    });
    
    return this.fetch(endpoint, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      },
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  async put(endpoint: string, data: any, token?: string) {
    const isFormData = data instanceof FormData;
    
    return this.fetch(endpoint, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      },
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  async delete(endpoint: string, token?: string) {
    return this.fetch(endpoint, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

// Types for pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// Helper functions for common API calls
export const categoryApi = {
  async getAll(params?: PaginationParams) {
    let endpoint = "/api/categories";
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  },
  
  async getById(id: string) {
    const response = await apiClient.get(`/api/categories/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    return response.json();
  },
  
  async create(data: { name: string }, token: string) {
    const response = await apiClient.post("/api/categories", data, token);
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    return response.json();
  },
  
  async update(id: string, data: { name: string }, token: string) {
    const response = await apiClient.put(`/api/categories/${id}`, data, token);
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    return response.json();
  },
  
  async delete(id: string, token: string) {
    const response = await apiClient.delete(`/api/categories/${id}`, token);
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    return response.ok;
  },
};

export const productApi = {
  async getAll(token?: string) {
    const response = await apiClient.get("/api/products", token);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },
  
  async getById(id: string, token?: string) {
    const response = await apiClient.get(`/api/products/${id}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  },
  
  async search(query: string, token?: string) {
    const response = await apiClient.get(`/api/products?q=${encodeURIComponent(query)}`, token);
    if (!response.ok) {
      throw new Error("Failed to search products");
    }
    return response.json();
  },
  
  async create(data: FormData, token: string) {
    const response = await apiClient.post("/api/products", data, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create product");
    }
    return response.json();
  },
  
  async update(id: string, data: FormData, token: string) {
    const response = await apiClient.put(`/api/products/${id}`, data, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update product");
    }
    return response.json();
  },
  
  async delete(id: string, token: string) {
    const response = await apiClient.delete(`/api/products/${id}`, token);
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    return response.ok;
  },
};

export const orderApi = {
  async getAll(token: string, params?: PaginationParams) {
    let endpoint = "/api/orders";
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint, token);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  },
  
  async getById(orderId: string, token: string) {
    const response = await apiClient.get(`/api/orders/${orderId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return response.json();
  },
  
  async updateStatus(orderId: string, status: string, token: string) {
    const response = await apiClient.put(`/api/orders/${orderId}/status`, { status }, token);
    if (!response.ok) {
      throw new Error("Failed to update order status");
    }
    return response.json();
  },
};

export const reviewApi = {
  async getAll(token: string, params?: PaginationParams) {
    let endpoint = "/api/reviews";
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint, token);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return response.json();
  },
  
  async getByProduct(productId: string, params?: PaginationParams) {
    let endpoint = `/api/reviews/product/${productId}`;
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch product reviews");
    }
    return response.json();
  },
  
  async getByUser(userId: string, token: string) {
    const response = await apiClient.get(`/api/reviews/user/${userId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch user reviews");
    }
    return response.json();
  },
  
  async canUserReview(userId: string, productId: string, token: string) {
    const response = await apiClient.get(`/api/reviews/can-review/${userId}/${productId}`, token);
    if (!response.ok) {
      throw new Error("Failed to check review eligibility");
    }
    return response.json();
  },
  
  async create(data: { productId: string; userId: string; rating: number; comment: string }, token: string) {
    const response = await apiClient.post("/api/reviews", data, token);
    if (!response.ok) {
      throw new Error("Failed to create review");
    }
    return response.json();
  },
  
  async update(reviewId: string, data: { rating: number; comment: string }, token: string) {
    const response = await apiClient.put(`/api/reviews/${reviewId}`, data, token);
    if (!response.ok) {
      throw new Error("Failed to update review");
    }
    return response.json();
  },
  
  async delete(reviewId: string, token: string) {
    const response = await apiClient.delete(`/api/reviews/${reviewId}`, token);
    if (!response.ok) {
      throw new Error("Failed to delete review");
    }
    return response.ok;
  },
};

export const userApi = {
  async getAll(token: string, params?: PaginationParams) {
    let endpoint = "/api/users";
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint, token);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },
  
  async getById(userId: string, token: string) {
    const response = await apiClient.get(`/api/users/${userId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  },
  
  async update(userId: string, data: { phone?: string }, token: string) {
    const response = await apiClient.put(`/api/users/${userId}`, data, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update user");
    }
    return response.json();
  },
};

export const paymentApi = {
  async getAll(token: string, params?: PaginationParams) {
    let endpoint = "/api/payments";
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint, token);
    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }
    return response.json();
  },
  
  async getByOrder(orderId: string, token: string) {
    const response = await apiClient.get(`/api/payments/order/${orderId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch payment");
    }
    return response.json();
  },
  
  async createRazorpayOrder(orderId: string, amount: number, token: string) {
    const response = await apiClient.post("/api/payments/razorpay/create", {
      orderId,
      amount
    }, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create Razorpay order");
    }
    return response.json();
  },
  
  async verifyPayment(data: any, token: string) {
    const response = await apiClient.post("/api/payments/razorpay/verify", data, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to verify payment");
    }
    return response.json();
  },
  
  async refundPayment(paymentId: string, amount: number, token: string) {
    const response = await apiClient.post("/api/payments/razorpay/refund", {
      paymentId,
      amount
    }, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to process refund");
    }
    return response.json();
  },
};

export const cartApi = {
  async add(data: { userId: string; productId: string; quantity: number }, token: string) {
    const response = await apiClient.post("/api/cart", data, token);
    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }
    return response.json();
  },
  
  async update(data: { userId: string; productId: string; quantity: number }, token: string) {
    const response = await apiClient.put("/api/cart", data, token);
    if (!response.ok) {
      throw new Error("Failed to update cart");
    }
    return response.json();
  },
  
  async getUserCart(userId: string, token: string) {
    const response = await apiClient.get(`/api/cart/${userId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    return response.json();
  },
  
  async remove(cartItemId: string, token: string) {
    const response = await apiClient.delete(`/api/cart/${cartItemId}`, token);
    if (!response.ok) {
      throw new Error("Failed to remove from cart");
    }
    return response.ok;
  },
  
  async clear(userId: string, token: string) {
    const response = await apiClient.delete(`/api/cart/${userId}/clear`, token);
    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }
    return response.ok;
  },
};

export const wishlistApi = {
  async add(data: { userId: string; productId: string }, token: string) {
    const response = await apiClient.post("/api/wishlist", data, token);
    if (!response.ok) {
      throw new Error("Failed to add to wishlist");
    }
    return response.json();
  },
  
  async getUserWishlist(userId: string, token: string) {
    const response = await apiClient.get(`/api/wishlist/${userId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch wishlist");
    }
    return response.json();
  },
  
  async remove(wishlistItemId: string, token: string) {
    const response = await apiClient.delete(`/api/wishlist/${wishlistItemId}`, token);
    if (!response.ok) {
      throw new Error("Failed to remove from wishlist");
    }
    return response.ok;
  },
};

export const addressApi = {
  async getAll(token: string) {
    const response = await apiClient.get("/api/addresses", token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch addresses");
    }
    return response.json();
  },
  
  async getById(addressId: string, token: string) {
    const response = await apiClient.get(`/api/addresses/${addressId}`, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to fetch address");
    }
    return response.json();
  },
  
  async create(data: { addressLine: string; city: string; state: string; postalCode: string; country: string; isDefault?: boolean }, token: string) {
    console.log('Creating address with data:', data);
    console.log('Token present:', !!token);
    const response = await apiClient.post("/api/addresses", data, token);
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      let errorMessage = "Failed to add address";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },
  
  async update(addressId: string, data: { addressLine: string; city: string; state: string; postalCode: string; country: string; isDefault?: boolean }, token: string) {
    const response = await apiClient.put(`/api/addresses/${addressId}`, data, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update address");
    }
    return response.json();
  },
  
  async delete(addressId: string, token: string) {
    const response = await apiClient.delete(`/api/addresses/${addressId}`, token);
    if (!response.ok) {
      throw new Error("Failed to delete address");
    }
    return response.ok;
  },
  
  async setDefault(addressId: string, token: string) {
    const response = await apiClient.fetch(`/api/addresses/${addressId}/set-default`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to set default address");
    }
    return response.json();
  },
};

export const invoiceApi = {
  async getAll(token: string, params?: PaginationParams) {
    let endpoint = "/api/invoices";
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint, token);
    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }
    return response.json();
  },
  
  async getById(invoiceId: string, token: string) {
    const response = await apiClient.get(`/api/invoices/${invoiceId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch invoice");
    }
    return response.json();
  },
  
  async getByOrderId(orderId: string, token: string) {
    const response = await apiClient.get(`/api/invoices/order/${orderId}`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch invoice for order");
    }
    return response.json();
  },
  
  async download(invoiceId: string, token: string) {
    const response = await apiClient.get(`/api/invoices/${invoiceId}/download`, token);
    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }
    return response.blob();
  },
  
  async downloadAll(token: string) {
    const response = await apiClient.get("/api/invoices/download-all", token);
    if (!response.ok) {
      throw new Error("Failed to download all invoices");
    }
    return response.blob();
  },
};

export const checkoutApi = {
  async createOrder(orderData: any, token: string) {
    const response = await apiClient.post("/api/orders", orderData, token);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create order");
    }
    return response.json();
  },
  
  async getUserOrders(userId: string, token: string, params?: PaginationParams) {
    let endpoint = `/api/orders/user/${userId}`;
    if (params && params.page !== undefined && params.size !== undefined) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      });
      endpoint += `?${queryParams.toString()}`;
    }
    const response = await apiClient.get(endpoint, token);
    if (!response.ok) {
      throw new Error("Failed to fetch user orders");
    }
    return response.json();
  },
  
  async getReviewableProducts(userId: string, token: string) {
    const response = await apiClient.get(`/api/orders/user/${userId}/reviewable-products`, token);
    if (!response.ok) {
      throw new Error("Failed to fetch reviewable products");
    }
    return response.json();
  },
};
