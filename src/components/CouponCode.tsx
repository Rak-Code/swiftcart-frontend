import { useState, useCallback } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Props for the CouponCode component
 */
export interface CouponCodeProps {
  /** The coupon code to display */
  code: string;
  /** Whether the coupon is disabled (e.g., expired) */
  disabled?: boolean;
  /** Optional callback when code is successfully copied */
  onCopy?: () => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * CouponCode Component
 * 
 * Displays a coupon code in a styled container with copy functionality.
 * Uses the Clipboard API to copy the code, with fallback for unsupported browsers.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 * - Displays coupon code in clearly visible format
 * - Copies code to clipboard on button click
 * - Shows visual confirmation on successful copy
 * - Handles clipboard API failure with fallback
 */
export const CouponCode = ({
  code,
  disabled = false,
  onCopy,
  className
}: CouponCodeProps) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopy = useCallback(async () => {
    if (disabled) return;

    try {
      // Try using the Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        setCopyState('copied');
        onCopy?.();
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setCopyState('idle');
        }, 2000);
      } else {
        // Fallback: Create a temporary textarea and use execCommand
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopyState('copied');
          onCopy?.();
          setTimeout(() => {
            setCopyState('idle');
          }, 2000);
        } else {
          setCopyState('error');
          setTimeout(() => {
            setCopyState('idle');
          }, 3000);
        }
      }
    } catch {
      // Clipboard API failed, show error state
      setCopyState('error');
      setTimeout(() => {
        setCopyState('idle');
      }, 3000);
    }
  }, [code, disabled, onCopy]);

  const getButtonContent = () => {
    switch (copyState) {
      case 'copied':
        return (
          <>
            <Check className="h-4 w-4" />
            <span>Copied!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-4 w-4" />
            <span>Select & Copy</span>
          </>
        );
      default:
        return (
          <>
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </>
        );
    }
  };

  const getButtonVariant = () => {
    if (copyState === 'copied') return 'default';
    if (copyState === 'error') return 'destructive';
    return 'secondary';
  };

  return (
    <div 
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-muted/50 p-2',
        disabled && 'opacity-50',
        className
      )}
    >
      <code 
        className={cn(
          'flex-1 rounded bg-background px-3 py-1.5 font-mono text-sm font-semibold tracking-wider',
          'select-all', // Allow manual selection as fallback
          disabled && 'text-muted-foreground'
        )}
        aria-label={`Coupon code: ${code}`}
      >
        {code}
      </code>
      
      <Button
        variant={getButtonVariant()}
        size="sm"
        onClick={handleCopy}
        disabled={disabled}
        aria-label={
          copyState === 'copied' 
            ? 'Code copied to clipboard' 
            : copyState === 'error'
            ? 'Copy failed, please select and copy manually'
            : 'Copy coupon code to clipboard'
        }
        className={cn(
          'min-w-[100px] transition-all',
          copyState === 'copied' && 'bg-green-600 hover:bg-green-700'
        )}
      >
        {getButtonContent()}
      </Button>
    </div>
  );
};

export default CouponCode;
