/**
 * Timer Utilities
 * Provides time formatting and calculation functions for countdown timers.
 * 
 * Requirements: 2.1, 2.3
 */

/**
 * Represents the remaining time broken down into components
 */
export interface TimeRemaining {
  /** Hours remaining */
  hours: number;
  /** Minutes remaining (0-59) */
  minutes: number;
  /** Seconds remaining (0-59) */
  seconds: number;
  /** Total milliseconds remaining */
  totalMilliseconds: number;
  /** Whether the time has expired */
  isExpired: boolean;
}

/**
 * Formats milliseconds into HH:MM:SS string format.
 * 
 * - Converts milliseconds to hours, minutes, and seconds
 * - Pads each component with leading zeros
 * - Handles negative time by returning "00:00:00"
 * - Handles zero time by returning "00:00:00"
 * 
 * @param milliseconds - The time in milliseconds to format
 * @returns Formatted string in "HH:MM:SS" format
 * 
 * @example
 * ```ts
 * formatTimeRemaining(3661000); // "01:01:01"
 * formatTimeRemaining(0);       // "00:00:00"
 * formatTimeRemaining(-1000);   // "00:00:00"
 * ```
 */
export function formatTimeRemaining(milliseconds: number): string {
  // Handle negative or zero time
  if (milliseconds <= 0) {
    return "00:00:00";
  }

  // Convert to total seconds
  const totalSeconds = Math.floor(milliseconds / 1000);
  
  // Calculate hours, minutes, seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad with leading zeros
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Calculates the time remaining until an expiration date.
 * 
 * - Returns time breakdown with hours, minutes, seconds
 * - Handles expired times (returns isExpired: true with zero values)
 * - Handles edge cases like past dates
 * 
 * @param expirationTime - The target expiration date/time
 * @param currentTime - Optional current time for testing (defaults to now)
 * @returns TimeRemaining object with breakdown and expiration status
 * 
 * @example
 * ```ts
 * const future = new Date(Date.now() + 3661000);
 * const result = getTimeRemaining(future);
 * // result: { hours: 1, minutes: 1, seconds: 1, totalMilliseconds: 3661000, isExpired: false }
 * 
 * const past = new Date(Date.now() - 1000);
 * const expired = getTimeRemaining(past);
 * // expired: { hours: 0, minutes: 0, seconds: 0, totalMilliseconds: 0, isExpired: true }
 * ```
 */
export function getTimeRemaining(
  expirationTime: Date,
  currentTime: Date = new Date()
): TimeRemaining {
  const totalMilliseconds = expirationTime.getTime() - currentTime.getTime();

  // Handle expired or zero time
  if (totalMilliseconds <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMilliseconds: 0,
      isExpired: true
    };
  }

  // Convert to total seconds
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  
  // Calculate components
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    totalMilliseconds,
    isExpired: false
  };
}
