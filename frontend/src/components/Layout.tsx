import React from "react";
import { useNavigationLoading } from "@/hooks/useNavigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // This will trigger loading on route changes
  useNavigationLoading();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-1 relative overflow-hidden animate-in fade-in duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
