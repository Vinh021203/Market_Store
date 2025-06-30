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
  placeholder = "○",
}) => {
  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [OTP, setOTP] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Auto focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleTextChange = (input: string, index: number) => {
    // Only allow numeric input
    if (input && !/^\d$/.test(input)) return;

    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);

    // Auto focus next input
    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
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
      } else {
        // Clear current input
        const newPin = [...OTP];
        newPin[index] = "";
        setOTP(newPin);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRef.current[index + 1]?.focus();
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

    // Focus last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
    if (inputRef.current[lastFilledIndex]) {
      inputRef.current[lastFilledIndex].focus();
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
    <div className="space-y-4">
      <div className="flex justify-center space-x-3">
        {Array.from({ length }, (_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
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
              className={cn(
                "w-14 h-14 text-center text-xl font-bold transition-all duration-200",
                "border-2 rounded-xl",
                // Default state
                "border-gray-300 dark:border-gray-600",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                // Error state
                error &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10",
                // Success state
                success &&
                  "border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50 dark:bg-green-900/10",
                // Disabled state
                disabled && "opacity-50 cursor-not-allowed",
                // Focused state
                focusedIndex === index && "scale-105 shadow-lg",
                // Filled state
                OTP[index] && "bg-blue-50 dark:bg-blue-900/10 border-blue-400",
              )}
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
            className="flex items-center justify-center space-x-2 text-green-600"
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

      {/* Helper text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Nhập {length} chữ số được gửi về email của bạn
        </p>
      </div>
    </div>
  );
};

export default OTPInput;
