# Invoice Integration Guide

## Overview
The invoice generation feature has been successfully integrated into the admin panel. This allows administrators to view, download, and manage invoices that are automatically generated when orders are marked as "delivered".

## Features Integrated

### 1. Invoice API Endpoints
Added to `src/lib/api.ts`:
- `invoiceApi.getAll()` - Get all invoices (admin only)
- `invoiceApi.getById()` - Get invoice by ID
- `invoiceApi.getByOrderId()` - Get invoice by order ID
- `invoiceApi.download()` - Download individual invoice PDF
- `invoiceApi.downloadAll()` - Download all invoices as ZIP (admin only)

### 2. Invoices Management Page
**Location:** `/admin/invoices`

**Features:**
- View all generated invoices
- Search by invoice number, order ID, customer name, or email
- Download individual invoices as PDF
- Download all invoices as ZIP file
- View invoice details:
  - Invoice number
  - Customer information
  - Order ID and date
  - Amount breakdown (subtotal, tax, total)
  - Email delivery status (customer & admin)

### 3. Enhanced Orders Management
**Location:** `/admin/orders`

**New Features:**
- Displays invoice information for delivered orders
- Shows invoice number next to delivered orders
- Quick download button for invoices directly from order list
- Automatic invoice fetching when orders are loaded

### 4. Admin Dashboard Updates
**Location:** `/admin`

**New Features:**
- Added "Total Invoices" stat card
- Added "Manage Invoices" navigation card
- Fetches invoice count on dashboard load

## How It Works

### Automatic Invoice Generation
1. Admin updates order status to "delivered" in Orders Management
2. Backend automatically generates invoice PDF using JasperReports
3. Invoice is uploaded to Cloudflare R2 storage
4. Invoice metadata is saved to MongoDB
5. Email with invoice PDF is sent to:
   - Customer's email address
   - Admin's email address

### Viewing Invoices
1. Navigate to Admin Dashboard → Manage Invoices
2. View list of all generated invoices
3. Use search to filter by invoice number, order ID, or customer details
4. Click "Download" to get individual invoice PDF
5. Click "Download All" to get ZIP file with all invoices

### Invoice Information
Each invoice displays:
- **Invoice Number:** Unique identifier (format: INV-YYYYMMDDHHMMSS-XXXX)
- **Customer Details:** Name and email
- **Order Information:** Order ID and invoice date
- **Amount Details:**
  - Subtotal
  - Tax (18% GST)
  - Total amount
- **Email Status:** Whether invoice was sent to customer and admin

## User Interface

### Invoices Management Page
```
┌─────────────────────────────────────────────────────┐
│ Invoices Management                                  │
│ View and download customer invoices                  │
├─────────────────────────────────────────────────────┤
│ [Search...] [Refresh] [Download All]                │
├─────────────────────────────────────────────────────┤
│ Invoice: INV-20231213120000-1234                    │
│ Generated: Dec 13, 2023, 12:00 PM                   │
│                                                      │
│ Customer Details    Order Information    Amount     │
│ John Doe           Order ID: ORD123      Subtotal   │
│ john@email.com     Date: Dec 13, 2023    Tax        │
│                                          Total       │
│                                                      │
│ Email Status: ✓ Customer Sent  ✓ Admin Sent        │
│                                      [Download]      │
└─────────────────────────────────────────────────────┘
```

### Orders Management (Enhanced)
```
┌─────────────────────────────────────────────────────┐
│ Order #ORD123                          [DELIVERED]   │
│ Dec 13, 2023, 12:00 PM                              │
├─────────────────────────────────────────────────────┤
│ Shipping Address          Order Details             │
│ 123 Main St              Items: 3                   │
│ City, State 12345        Total: ₹1,500.00          │
│                                                      │
│ Update Status: [Delivered ▼]                        │
│ Invoice: INV-20231213120000-1234 [Download]        │
└─────────────────────────────────────────────────────┘
```

### Admin Dashboard (Enhanced)
```
┌─────────────────────────────────────────────────────┐
│ Admin Dashboard                                      │
│ Welcome back, Admin                                  │
├─────────────────────────────────────────────────────┤
│ [Total Products] [Total Orders] [Pending Orders]    │
│ [Total Revenue]  [Total Reviews] [Total Users]      │
│ [Total Invoices] ← NEW                              │
├─────────────────────────────────────────────────────┤
│ [Manage Products]  [Manage Categories]              │
│ [Manage Orders]    [Manage Reviews]                 │
│ [Manage Users]     [View Payments]                  │
│ [Manage Invoices] ← NEW                             │
└─────────────────────────────────────────────────────┘
```

## Technical Implementation

### File Changes

1. **src/lib/api.ts**
   - Added `invoiceApi` object with all invoice-related API calls
   - Supports pagination for invoice listing
   - Handles blob responses for PDF downloads

2. **src/pages/admin/InvoicesManagement.tsx** (NEW)
   - Complete invoice management interface
   - Search and filter functionality
   - Individual and bulk download capabilities
   - Email status indicators

3. **src/pages/admin/OrdersManagement.tsx**
   - Added invoice state management
   - Fetches invoices for delivered orders
   - Displays invoice info and download button
   - Added download functionality

4. **src/pages/admin/AdminDashboard.tsx**
   - Added `totalInvoices` to dashboard stats
   - Fetches invoice count from API
   - Added invoice stat card
   - Added navigation card to invoices page

5. **src/App.tsx**
   - Added route for `/admin/invoices`
   - Imported InvoicesManagement component

### API Integration

All API calls use the existing authentication system:
```typescript
// Example: Fetch all invoices
const invoices = await invoiceApi.getAll(token);

// Example: Download invoice
const blob = await invoiceApi.download(invoiceId, token);
```

### Error Handling

- Failed API calls show toast notifications
- Loading states prevent duplicate requests
- Graceful fallbacks for missing data
- Try-catch blocks for all async operations

## Backend Requirements

Ensure your backend has these endpoints implemented:

```
GET    /api/invoices                    - Get all invoices (admin)
GET    /api/invoices/{id}               - Get invoice by ID
GET    /api/invoices/order/{orderId}    - Get invoice by order ID
GET    /api/invoices/{id}/download      - Download invoice PDF
GET    /api/invoices/download-all       - Download all invoices as ZIP
```

All endpoints require Bearer token authentication.

## Environment Variables

Make sure these are configured in your backend:

```properties
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_EMAIL=aditaenterpriseindia@gmail.com
ADMIN_EMAIL=admin@example.com

# R2 Storage
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Tax Configuration
invoice.tax.rate=0.18  # 18% GST
```

## Testing the Integration

### 1. Test Invoice Viewing
1. Login as admin
2. Navigate to `/admin/invoices`
3. Verify invoices are displayed
4. Test search functionality

### 2. Test Invoice Download
1. Click "Download" on any invoice
2. Verify PDF downloads correctly
3. Test "Download All" button
4. Verify ZIP file contains all invoices

### 3. Test Order Integration
1. Navigate to `/admin/orders`
2. Find a delivered order
3. Verify invoice number is displayed
4. Test download button

### 4. Test Dashboard
1. Navigate to `/admin`
2. Verify "Total Invoices" stat is displayed
3. Click "Manage Invoices" card
4. Verify navigation works

## Troubleshooting

### Invoices Not Showing
- Check if backend is running
- Verify authentication token is valid
- Check browser console for API errors
- Ensure orders have been marked as "delivered"

### Download Not Working
- Check CORS settings on backend
- Verify R2 storage is configured correctly
- Check browser console for errors
- Ensure invoice PDF exists in storage

### Email Status Not Updating
- Check email configuration in backend
- Verify SMTP settings are correct
- Check backend logs for email errors

## Future Enhancements

Potential improvements:
1. Invoice preview modal before download
2. Resend invoice email functionality
3. Invoice filtering by date range
4. Export invoice list to CSV
5. Invoice analytics and reports
6. Custom invoice templates
7. Multi-currency support
8. Bulk invoice operations

## Support

For issues or questions:
1. Check backend logs for errors
2. Verify all environment variables are set
3. Test API endpoints directly using Postman
4. Check browser console for frontend errors

## Summary

The invoice integration is complete and ready to use. Admins can now:
- View all generated invoices
- Download individual or all invoices
- See invoice information directly in order management
- Track email delivery status
- Search and filter invoices efficiently

All features are fully integrated with the existing authentication and admin panel structure.
