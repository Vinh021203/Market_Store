import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showFirstLast = true,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col mt-8 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
    >
      {/* Results info */}
      <div className="text-sm text-center text-muted-foreground sm:text-left">
        Hiển thị <span className="font-medium">{startItem}</span> đến{" "}
        <span className="font-medium">{endItem}</span> của{" "}
        <span className="font-medium">{totalItems}</span> sản phẩm
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* First page */}
        {showFirstLast && currentPage > 3 && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="hidden sm:flex"
            >
              Đầu
            </Button>
          </motion.div>
        )}

        {/* Previous */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Trước</span>
          </Button>
        </motion.div>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={`min-w-[40px] ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : ""
                    }`}
                  >
                    {page}
                  </Button>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="group"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Last page */}
        {showFirstLast && currentPage < totalPages - 2 && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="hidden sm:flex"
            >
              Cuối
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Pagination;
