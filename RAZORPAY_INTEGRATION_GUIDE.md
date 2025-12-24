# Razorpay Integration Guide

## Changes Made

### Frontend Updates

1. **Updated `src/lib/api.ts`**
   - Fixed `createRazorpayOrder()` to match backend endpoint `/api/payments/razorpay/create`
   - Now sends `orderId` and `amount` (backend converts to paise)
   - Added `refundPayment()` method
   - Improved error handling

2. **Updated `src/pages/Checkout.tsx`**
   - Fixed payment flow: Create order → Create Razorpay order → Open checkout → Verify payment
   - Removed duplicate order creation after payment
   - Fixed Razorpay options to use `keyId` from response
   - Simplified payment verification

## Backend Configuration Required

### 1. Application Properties

Add these to your `application.properties` or `application.yml`:

```properties
# Razorpay Configuration
razorpay.key.id=rzp_live_RGlWaLwG1mjIub
razorpay.key.secret=fFqjFUIHDrgAqF6en4BdN4DF
razorpay.currency=INR
```

### 2. Backend DTOs Required

Make sure you have these DTOs:

**RazorpayOrderRequestDTO.java**
```java
public record RazorpayOrderRequestDTO(
    String orderId,
    double amount
) {}
```

**RazorpayOrderResponseDTO.java**
```java
public record RazorpayOrderResponseDTO(
    String razorpayOrderId,
    String orderId,
    double amount,
    String currency,
    String keyId
) {}
```

**RazorpayPaymentVerificationDTO.java**
```java
public record RazorpayPaymentVerificationDTO(
    String razorpayOrderId,
    String razorpayPaymentId,
    String razorpaySignature
) {}
```

## Payment Flow

1. **User clicks "Proceed to Payment"**
   - Frontend creates order via `/api/orders` (gets orderId)
   - Frontend calls `/api/payments/razorpay/create` with orderId and amount
   - Backend creates Razorpay order and returns razorpayOrderId + keyId

2. **Razorpay Checkout Opens**
   - User completes payment on Razorpay
   - Razorpay returns payment details (razorpay_order_id, razorpay_payment_id, razorpay_signature)

3. **Payment Verification**
   - Frontend calls `/api/payments/razorpay/verify` with payment details
   - Backend verifies signature using HMAC SHA256
   - Updates payment status to "completed"

4. **Success**
   - Cart is cleared
   - User redirected to order success page

## Testing

### Test Mode
- Use test keys: `rzp_test_...`
- Test cards: https://razorpay.com/docs/payments/payments/test-card-details/

### Live Mode
- Use live keys: `rzp_live_...` (already configured in .env)
- Real payments will be processed

## Common Issues & Solutions

### Issue: "Failed to create Razorpay order"

**Possible causes:**
1. Missing/incorrect Razorpay keys in backend config
2. Amount is 0 or negative
3. Currency not configured
4. Network/API issues

**Solution:**
- Check backend logs for detailed error
- Verify keys in application.properties
- Ensure amount > 0
- Test with Razorpay dashboard

### Issue: "Invalid payment signature"

**Possible causes:**
1. Wrong secret key used for verification
2. Payload format incorrect

**Solution:**
- Verify `razorpay.key.secret` matches Razorpay dashboard
- Check signature generation logic in `RazorpayServiceImpl`

### Issue: Payment successful but order not created

**Possible causes:**
1. Order creation happens before payment (already fixed)
2. Network timeout

**Solution:**
- Order is now created BEFORE payment
- If payment succeeds but verification fails, check backend logs

## Security Notes

1. **Never expose secret key in frontend** - Only `keyId` is used in frontend
2. **Always verify signature on backend** - Don't trust frontend data
3. **Use HTTPS in production** - Required for Razorpay
4. **Store keys securely** - Use environment variables, not hardcoded

## Next Steps

1. Deploy backend with correct Razorpay configuration
2. Test with Razorpay test mode first
3. Verify webhook integration (if needed)
4. Switch to live mode when ready
