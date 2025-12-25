import { useState, useEffect, useCallback } from 'react';
import { X, Tag, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CouponCode } from '@/components/CouponCode';
import { getDefaultCoupon, CouponConfig } from '@/lib/couponValidator';
import { cn } from '@/lib/utils';

/**
 * Session storage key for banner dismissed state
 */
const BANNER_DISMISSED_KEY = 'promo_banner_dismissed';

/**
 * Props for the PromoBanner component
 */
export interface PromoBannerProps {
  /** The coupon code to display */
  couponCode?: string;
  /** Discount percentage to display */
  discountPercentage?: number;
  /** Expiration time for the offer */
  expirationTime?: Date;
  /** Promotional message to display */
  promoMessage?: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * PromoBanner Component
 * 
 * A floating promotional banner displayed at the bottom of the viewport.
 * Shows a countdown timer, coupon code, and promotional message.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.3, 2.4
 * - Displays as floating element at bottom of viewport
 * - Remains visible while scrolling
 * - Shows discount percentage and promo message
 * - Close button hides banner for current session
 * - Responsive design for mobile and desktop
 * - Shows "Offer Expired" when timer expires
 * - Coupon not copyable when expired
 */
export const PromoBanner = ({
  couponCode,
  discountPercentage,
  expirationTime,
  promoMessage,
  className
}: PromoBannerProps) => {
  // Get default coupon config if props not provided
  const defaultCoupon: CouponConfig = getDefaultCoupon();
  
  const code = couponCode ?? defaultCoupon.code;
  const discount = discountPercentage ?? defaultCoupon.discountPercentage;
  const expiration = expirationTime ?? defaultCoupon.expirationTime;
  const message = promoMessage ?? defaultCoupon.promoMessage;

  // State for banner visibility and expiration
  const [isVisible, setIsVisible] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Check sessionStorage on mount to determine initial visibility
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
      if (dismissed !== 'true') {
        // Check if already expired
        if (new Date() >= expiration) {
          setIsExpired(true);
        }
        setIsVisible(true);
      }
    } catch {
      // sessionStorage unavailable, show banner anyway
      setIsVisible(true);
    }
  }, [expiration]);

  // Handle close button click
  const handleClose = useCallback(() => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    } catch {
      // sessionStorage unavailable, banner will reappear on refresh
    }
  }, []);

  // Handle timer expiration
  const handleExpire = useCallback(() => {
    setIsExpired(true);
  }, []);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        // Fixed positioning at bottom
        'fixed bottom-0 left-0 right-0 z-40',
        // Base styling
        'bg-gradient-to-r from-primary via-primary/95 to-primary',
        'border-t border-primary-foreground/10',
        'shadow-lg shadow-primary/20',
        // Animation
        'animate-in slide-in-from-bottom duration-500',
        className
      )}
      role="banner"
      aria-label="Promotional offer"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left section: Promo message and discount */}
          <div className="flex items-center gap-3 text-primary-foreground">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-primary-foreground/10 items-center justify-center">
              {isExpired ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </div>
            <div className="text-center sm:text-left">
              {isExpired ? (
                <p className="font-semibold text-sm sm:text-base">
                  Offer Expired
                </p>
              ) : (
                <>
                  <p className="font-semibold text-sm sm:text-base">
                    {message}
                  </p>
                  <p className="text-xs sm:text-sm text-primary-foreground/80">
                    Use code below for {discount}% OFF
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Center section: Timer and Coupon */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Countdown Timer */}
            {!isExpired && (
              <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-1.5">
                <Clock className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-xs text-primary-foreground/80 hidden sm:inline">
                  Ends in:
                </span>
                <CountdownTimer
                  expirationTime={expiration}
                  onExpire={handleExpire}
                  className="text-primary-foreground text-sm"
                />
              </div>
            )}

            {/* Coupon Code */}
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary-foreground/80 hidden sm:block" />
              <CouponCode
                code={code}
                disabled={isExpired}
                className={cn(
                  'bg-primary-foreground/10 border-primary-foreground/20',
                  '[&_code]:bg-primary-foreground/20 [&_code]:text-primary-foreground',
                  isExpired && 'opacity-60'
                )}
              />
            </div>
          </div>

          {/* Right section: Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className={cn(
              'absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto',
              'text-primary-foreground/80 hover:text-primary-foreground',
              'hover:bg-primary-foreground/10 rounded-full',
              'h-8 w-8'
            )}
            aria-label="Close promotional banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
