import { useState, useCallback } from 'react';
import { Tag, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateCoupon } from '@/lib/couponValidator';
import { calculateDiscount } from '@/lib/discountCalculator';
import { cn } from '@/lib/utils';

/**
 * Applied coupon information
 */
export interface AppliedCoupon {
  /** The coupon code */
  code: string;
  /** Discount percentage (0-100) */
  discountPercentage: number;
  /** Calculated discount amount */
  discountAmount: number;
}

/**
 * Props for the CouponInput component
 */
export interface CouponInputProps {
  /** Callback when a valid coupon is applied */
  onApply: (coupon: AppliedCoupon) => void;
  /** Callback when the applied coupon is removed */
  onRemove: () => void;
  /** Currently applied coupon, if any */
  appliedCoupon: AppliedCoupon | null;
  /** Current subtotal for discount calculation */
  subtotal: number;
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  /** Optional className for styling */
  className?: string;
}

/**
 * CouponInput Component
 * 
 * Provides an input field for coupon code entry with apply/remove functionality.
 * Validates coupon codes and calculates discounts.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6
 * - Input field for coupon code entry
 * - Apply button that validates and applies coupon
 * - Remove button to clear applied coupon
 * - Display applied coupon info and discount amount
 * - Show error messages for invalid/expired coupons
 */
export const CouponInput = ({
  onApply,
  onRemove,
  appliedCoupon,
  subtotal,
  isLoading = false,
  className
}: CouponInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  /**
   * Handles applying the coupon code
   */
  const handleApply = useCallback(async () => {
    const code = inputValue.trim();
    
    if (!code) {
      setError('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    setError(null);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const validationResult = validateCoupon(code);

    if (!validationResult.valid) {
      setError(validationResult.message);
      setIsApplying(false);
      return;
    }

    // Calculate the discount
    const discountResult = calculateDiscount(subtotal, validationResult.coupon.discountPercentage);

    const appliedCouponData: AppliedCoupon = {
      code: validationResult.coupon.code,
      discountPercentage: validationResult.coupon.discountPercentage,
      discountAmount: discountResult.discountAmount
    };

    onApply(appliedCouponData);
    setInputValue('');
    setIsApplying(false);
  }, [inputValue, subtotal, onApply]);

  /**
   * Handles removing the applied coupon
   */
  const handleRemove = useCallback(() => {
    onRemove();
    setError(null);
  }, [onRemove]);

  /**
   * Handles input change and clears error
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) {
      setError(null);
    }
  }, [error]);

  /**
   * Handles Enter key press to apply coupon
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isApplying && !isLoading && inputValue.trim()) {
      e.preventDefault();
      handleApply();
    }
  }, [handleApply, isApplying, isLoading, inputValue]);

  // If a coupon is already applied, show the applied state
  if (appliedCoupon) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between p-3 rounded-lg border border-green-500/30 bg-green-500/10">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                {appliedCoupon.discountPercentage}% off - You save ₹{appliedCoupon.discountAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isLoading}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            aria-label="Remove coupon"
          >
            <X className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Remove</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isApplying}
            className={cn(
              'pl-9 uppercase',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
            aria-label="Coupon code"
            aria-invalid={!!error}
            aria-describedby={error ? 'coupon-error' : undefined}
          />
        </div>
        <Button
          onClick={handleApply}
          disabled={isLoading || isApplying || !inputValue.trim()}
          variant="secondary"
          className="min-w-[80px]"
        >
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>
      
      {error && (
        <div 
          id="coupon-error"
          className="flex items-center gap-1.5 text-sm text-red-500"
          role="alert"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
