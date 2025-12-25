import { useState, useEffect, useCallback } from 'react';
import { getTimeRemaining, formatTimeRemaining } from '@/lib/timerUtils';
import { cn } from '@/lib/utils';

/**
 * Props for the CountdownTimer component
 */
export interface CountdownTimerProps {
  /** The target expiration date/time */
  expirationTime: Date;
  /** Callback function called when the countdown reaches zero */
  onExpire: () => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * CountdownTimer Component
 * 
 * Displays a countdown timer that updates every second until expiration.
 * When the countdown reaches zero, it calls the onExpire callback.
 * 
 * Requirements: 2.1, 2.2, 2.3
 * - Displays remaining time in HH:MM:SS format
 * - Updates every second
 * - Calls onExpire when countdown reaches zero
 */
export const CountdownTimer = ({
  expirationTime,
  onExpire,
  className
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(() => 
    getTimeRemaining(expirationTime)
  );

  // Memoize the onExpire callback to prevent unnecessary re-renders
  const handleExpire = useCallback(() => {
    onExpire();
  }, [onExpire]);

  useEffect(() => {
    // Check if already expired on mount
    const initialTime = getTimeRemaining(expirationTime);
    setTimeRemaining(initialTime);
    
    if (initialTime.isExpired) {
      handleExpire();
      return;
    }

    // Set up interval to update every second
    const intervalId = setInterval(() => {
      const remaining = getTimeRemaining(expirationTime);
      setTimeRemaining(remaining);

      if (remaining.isExpired) {
        handleExpire();
        clearInterval(intervalId);
      }
    }, 1000);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [expirationTime, handleExpire]);

  const formattedTime = formatTimeRemaining(timeRemaining.totalMilliseconds);

  return (
    <div 
      className={cn(
        'font-mono text-lg font-semibold tracking-wider',
        timeRemaining.isExpired && 'text-muted-foreground',
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={timeRemaining.isExpired ? 'Timer expired' : `Time remaining: ${formattedTime}`}
    >
      {formattedTime}
    </div>
  );
};

export default CountdownTimer;
