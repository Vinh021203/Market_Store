// components/GlobalLoading.tsx - Enhanced version
import React from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

const GlobalLoading: React.FC = () => {
  const { isLoading, loadingText } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center space-y-6"
          >
            {/* Logo Animation */}
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="flex items-center justify-center w-20 h-20 shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <span className="text-2xl font-bold text-white">TM</span>
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Loading Spinner */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="space-y-2 text-center"
            >
              <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Template Market
              </h3>
              <motion.p
                key={loadingText} // Re-animate when text changes
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground"
              >
                {loadingText}
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 192 }} // w-48 = 192px
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-1 overflow-hidden rounded-full bg-muted"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                animate={{
                  x: [-192, 192],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoading;
