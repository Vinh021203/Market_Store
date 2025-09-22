import React, {
  useRef,
  useState,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

interface OTPInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
  success = false,
  autoFocus = true,
  placeholder = "●",
}) => {
  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [OTP, setOTP] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Auto focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRef.current[0] && !disabled) {
      inputRef.current[0].focus();
      setFocusedIndex(0);
    }
  }, [autoFocus, disabled]);

  const handleTextChange = (input: string, index: number) => {
    // Only allow numeric input
    const digit = input.replace(/[^0-9]/g, "").slice(-1);

    const newPin = [...OTP];
    newPin[index] = digit;
    setOTP(newPin);

    // Auto focus next input
    if (digit && index < length - 1) {
      inputRef.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }

    // Call onComplete when all fields are filled
    if (newPin.every((digit) => digit !== "")) {
      onComplete(newPin.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!OTP[index] && index > 0) {
        // Move to previous input if current is empty
        inputRef.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      } else {
        // Clear current input
        const newPin = [...OTP];
        newPin[index] = "";
        setOTP(newPin);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRef.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, length);
    const newOTP = [...OTP];

    for (let i = 0; i < length; i++) {
      newOTP[i] = pastedData[i] || "";
    }

    setOTP(newOTP);

    // Focus next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    if (inputRef.current[nextIndex]) {
      inputRef.current[nextIndex].focus();
      setFocusedIndex(nextIndex);
    }

    if (newOTP.every((digit) => digit !== "")) {
      onComplete(newOTP.join(""));
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <div className="space-y-3">
      {/* Compact sizing - Mobile nhỏ, Desktop cũng compact */}
      <div className="flex justify-center gap-2 sm:gap-2.5">
        {Array.from({ length }, (_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileFocus={{ scale: disabled ? 1 : 1.05 }}
          >
            <Input
              ref={(el) => (inputRef.current[index] = el!)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={OTP[index]}
              placeholder={!OTP[index] ? placeholder : ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleTextChange(e.target.value, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              disabled={disabled}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              className={cn(
                // Compact sizes: Mobile 48px, Desktop max 52px
                "w-12 h-12 sm:w-13 sm:h-13 text-center font-bold transition-all duration-300",
                // Compact text sizes: mobile 18px, desktop max 20px
                "text-lg sm:text-lg",
                "border-2 rounded-xl focus:outline-none focus:ring-0 shadow-sm",
                // Default state
                !error &&
                  !success &&
                  !OTP[index] &&
                  focusedIndex !== index &&
                  "border-slate-300 bg-white/80 text-slate-600 hover:border-slate-400 hover:bg-white hover:shadow-md",
                // Focused state
                !error &&
                  !success &&
                  focusedIndex === index &&
                  "border-pink-400 bg-white shadow-lg text-slate-800",
                // Filled state (not focused)
                !error &&
                  !success &&
                  OTP[index] &&
                  focusedIndex !== index &&
                  "border-slate-400 bg-white shadow-md text-slate-800",
                // Error state
                error &&
                  "border-red-400 bg-red-50 text-red-700 focus:border-red-500",
                // Success state
                success &&
                  "border-emerald-400 bg-emerald-50 text-emerald-700 focus:border-emerald-500",
                // Disabled state
                disabled && "opacity-50 cursor-not-allowed bg-slate-100",
              )}
              style={{
                // Focus gradient effect
                background:
                  focusedIndex === index && !error && !success
                    ? `linear-gradient(135deg, 
                      rgba(255,255,255,1) 0%, 
                      rgba(252, 231, 243, 0.9) 100%)`
                    : undefined,
                boxShadow:
                  focusedIndex === index && !error && !success
                    ? "0 0 0 3px rgba(244, 114, 182, 0.15), 0 6px 20px rgba(244, 114, 182, 0.25)"
                    : OTP[index] && !error && !success && focusedIndex !== index
                      ? "0 3px 10px rgba(0, 0, 0, 0.1)"
                      : error
                        ? "0 0 0 3px rgba(248, 113, 113, 0.15)"
                        : success
                          ? "0 0 0 3px rgba(52, 211, 153, 0.15)"
                          : undefined,
                transform:
                  focusedIndex === index && !disabled
                    ? "scale(1.05)"
                    : "scale(1)",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Status indicators */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center space-x-2 text-emerald-600"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Mã OTP hợp lệ!</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center space-x-2 text-red-600"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Mã OTP không chính xác</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OTPInput;
