import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLoading } from "@/contexts/LoadingContext";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // Đảm bảo loading được clear khi component mount xong
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [setIsLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
