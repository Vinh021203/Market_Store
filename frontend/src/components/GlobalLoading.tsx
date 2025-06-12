import React from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { Loader2, Sparkles } from "lucide-react";

const GlobalLoading: React.FC = () => {
  const { isLoading, loadingText } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo Animation */}
        <div className="relative animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-2xl">TM</span>
            <div className="absolute -top-2 -right-2 animate-spin">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="relative animate-in zoom-in duration-300 delay-200">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2 animate-in slide-in-from-bottom duration-300 delay-300">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Template Market
          </h3>
          <p className="text-muted-foreground">{loadingText}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden animate-in slide-in-from-left duration-800 delay-400">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;
