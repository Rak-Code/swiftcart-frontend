/**
 * Discount Calculator Utility
 * Implements percentage-based discount calculations for the coupon system.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

/**
 * Result of a discount calculation
 */
export interface DiscountResult {
  /** Original subtotal amount before discount */
  originalAmount: number;
  /** Discount percentage applied (0-100) */
  discountPercentage: number;
  /** Calculated discount amount */
  discountAmount: number;
  /** Final amount after discount */
  finalAmount: number;
}

/**
 * Rounds a number to 2 decimal places
 * @param value - The number to round
 * @returns The rounded number
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculates the discount for a given subtotal and percentage.
 * 
 * - Implements percentage-based discount: subtotal × percentage / 100
 * - Rounds results to 2 decimal places
 * - Ensures discount does not exceed subtotal
 * 
 * @param subtotal - The original amount before discount (must be >= 0)
 * @param discountPercentage - The discount percentage to apply (0-100)
 * @returns DiscountResult object with calculation details
 * 
 * @example
 * ```ts
 * const result = calculateDiscount(100, 20);
 * // result: { originalAmount: 100, discountPercentage: 20, discountAmount: 20, finalAmount: 80 }
 * ```
 */
export function calculateDiscount(
  subtotal: number,
  discountPercentage: number
): DiscountResult {
  // Ensure subtotal is non-negative
  const validSubtotal = Math.max(0, subtotal);
  
  // Clamp discount percentage between 0 and 100
  const validPercentage = Math.min(100, Math.max(0, discountPercentage));
  
  // Calculate discount: subtotal × percentage / 100
  const rawDiscount = validSubtotal * validPercentage / 100;
  
  // Ensure discount does not exceed subtotal and round to 2 decimal places
  const discountAmount = roundToTwoDecimals(Math.min(rawDiscount, validSubtotal));
  
  // Calculate final amount
  const finalAmount = roundToTwoDecimals(validSubtotal - discountAmount);
  
  return {
    originalAmount: roundToTwoDecimals(validSubtotal),
    discountPercentage: validPercentage,
    discountAmount,
    finalAmount,
  };
}
