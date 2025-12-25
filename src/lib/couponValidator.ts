/**
 * Coupon Validator Utility
 * Validates coupon codes and checks expiration status.
 * 
 * Requirements: 4.5
 */

/**
 * Configuration for a coupon
 */
export interface CouponConfig {
  /** The coupon code string */
  code: string;
  /** Discount percentage (0-100) */
  discountPercentage: number;
  /** Expiration date/time of the coupon */
  expirationTime: Date;
  /** Promotional message to display */
  promoMessage: string;
  /** Whether the coupon is currently active */
  isActive: boolean;
}

/**
 * Result of coupon validation - success case
 */
export interface CouponValidationSuccess {
  valid: true;
  coupon: CouponConfig;
}

/**
 * Result of coupon validation - error case
 */
export interface CouponValidationError {
  valid: false;
  error: 'invalid' | 'expired' | 'inactive';
  message: string;
}

/**
 * Union type for validation results
 */
export type CouponValidationResult = CouponValidationSuccess | CouponValidationError;

/**
 * Default coupon configuration
 * Can be extended to fetch from backend in the future
 */
export const DEFAULT_COUPON: CouponConfig = {
  code: "SAVE20",
  discountPercentage: 20,
  expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  promoMessage: "Limited Time Offer! Get 20% OFF on all orders",
  isActive: true
};

/**
 * List of valid coupons
 * In a real application, this would come from a backend API
 */
const VALID_COUPONS: CouponConfig[] = [
  DEFAULT_COUPON,
  {
    code: "WELCOME10",
    discountPercentage: 10,
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    promoMessage: "Welcome! Get 10% OFF on your first order",
    isActive: true
  }
];

/**
 * Validates a coupon code against known valid coupons.
 * 
 * Checks:
 * 1. Code exists in valid coupons list (case-insensitive)
 * 2. Coupon is active
 * 3. Coupon has not expired
 * 
 * @param code - The coupon code to validate
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns CouponValidationResult with success/error status
 * 
 * @example
 * ```ts
 * const result = validateCoupon("SAVE20");
 * if (result.valid) {
 *   console.log(`Discount: ${result.coupon.discountPercentage}%`);
 * } else {
 *   console.log(`Error: ${result.message}`);
 * }
 * ```
 */
export function validateCoupon(
  code: string,
  currentTime: Date = new Date()
): CouponValidationResult {
  // Normalize the code for comparison (case-insensitive)
  const normalizedCode = code.trim().toUpperCase();
  
  // Find matching coupon
  const coupon = VALID_COUPONS.find(
    c => c.code.toUpperCase() === normalizedCode
  );
  
  // Check if coupon exists
  if (!coupon) {
    return {
      valid: false,
      error: 'invalid',
      message: 'Invalid coupon code'
    };
  }
  
  // Check if coupon is active
  if (!coupon.isActive) {
    return {
      valid: false,
      error: 'inactive',
      message: 'This coupon is no longer active'
    };
  }
  
  // Check if coupon has expired
  if (currentTime >= coupon.expirationTime) {
    return {
      valid: false,
      error: 'expired',
      message: 'This coupon has expired'
    };
  }
  
  // Coupon is valid
  return {
    valid: true,
    coupon
  };
}

/**
 * Gets the default coupon configuration
 * @returns The default coupon config
 */
export function getDefaultCoupon(): CouponConfig {
  return { ...DEFAULT_COUPON };
}

/**
 * Checks if a coupon code is expired
 * @param code - The coupon code to check
 * @param currentTime - Optional current time for testing
 * @returns true if expired, false otherwise
 */
export function isCouponExpired(
  code: string,
  currentTime: Date = new Date()
): boolean {
  const result = validateCoupon(code, currentTime);
  return !result.valid && result.error === 'expired';
}
