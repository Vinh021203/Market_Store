import React, { useState } from "react";
import { useNavigationLoading } from "@/hooks/useNavigation";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import ContactWidget from "./ContactWidget";
import CustomCookieConsent from "./CookieConsent";
import LeadForm from "./LeadForm";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useNavigationLoading();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20 z-0">
      <Header />
      <main className="relative flex-1 overflow-hidden duration-300 animate-in fade-in">
        {children}
      </main>
      <Footer />
      {/* ✅ Chatbot Widget */}
      <Chatbot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
      {/* ✅ Contact Widget (Zalo & Phone) */}
      <ContactWidget />
      {/* ✅ Cookie Consent Banner */}
      <CustomCookieConsent />
      {/* ✅ Lead Capture Form */}
      <LeadForm />{" "}
      {/* <-- Import vào đây, nằm ngoài main/footer nhưng vẫn trong layout */}
    </div>
  );
};

export default Layout;
