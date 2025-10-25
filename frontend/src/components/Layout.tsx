import React, { useState } from "react";
import { useNavigationLoading } from "@/hooks/useNavigation";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import ContactWidget from "./ContactWidget";
import CustomCookieConsent from "./CookieConsent";
import LeadForm from "./LeadForm";
import RealtimeNotificationBanner from "./RealtimeNotificationBanner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useNavigationLoading();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="z-0 flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <RealtimeNotificationBanner />

      <main className="relative flex-1 overflow-hidden duration-300 animate-in fade-in">
        {children}
      </main>

      <Footer />

      <Chatbot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      <ContactWidget />

      <CustomCookieConsent />

      <LeadForm />
    </div>
  );
};

export default Layout;
