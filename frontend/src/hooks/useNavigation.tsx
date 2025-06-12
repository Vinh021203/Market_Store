import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "@/contexts/LoadingContext";

export const useNavigationLoading = () => {
  const { setIsLoading, setLoadingText } = useLoading();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setLoadingText("Đang tải trang...");

    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading, setLoadingText]);

  const navigateWithLoading = (path: string, text = "Đang chuyển hướng...") => {
    setIsLoading(true);
    setLoadingText(text);

    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return { navigateWithLoading };
};
