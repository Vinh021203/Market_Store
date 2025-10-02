import React, { useEffect, useState } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { Cookie, Shield } from "lucide-react"; // ✅ Xóa Settings import

const CustomCookieConsent: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const cookieValue = getCookieConsentValue("template-market-cookie-consent");
    console.log("🍪 Current cookie consent value:", cookieValue);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <CookieConsent
      location="bottom"
      buttonText="Chấp nhận"
      declineButtonText="Từ chối"
      cookieName="template-market-cookie-consent"
      style={{
        // ✅ RESPONSIVE: Mobile vs Desktop styling
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        minHeight: isMobile ? "auto" : "80px",
        maxHeight: isMobile ? "none" : "120px",

        // ✅ FIXED: SoftPinkTheme gradient
        background:
          "linear-gradient(135deg, #ec4899 0%, #f97316 50%, #eab308 100%)",
        color: "#fff",
        fontSize: isMobile ? "13px" : "14px",
        lineHeight: "1.4",
        padding: isMobile ? "16px 16px 20px" : "16px 20px", // Extra bottom padding on mobile
        zIndex: 9999,
        borderRadius: 0,
        border: "none",
        boxShadow: "0 -4px 20px rgba(249, 115, 22, 0.3)",
        backdropFilter: "blur(12px)",

        // Bottom positioning - Full width
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
      }}
      buttonStyle={{
        background: "rgba(255, 255, 255, 0.95)",
        color: "#f97316",
        fontWeight: 600,
        fontSize: isMobile ? "12px" : "13px",
        padding: isMobile ? "10px 16px" : "8px 16px", // Bigger touch target on mobile
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        margin: isMobile ? "8px 0 0 0" : "0 0 0 8px", // Stack on mobile
        textTransform: "none",
        transition: "all 0.15s ease",
        minWidth: isMobile ? "auto" : "80px",
        flex: isMobile ? "1" : "none", // Equal width buttons on mobile
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.8)",
        fontWeight: 500,
        fontSize: isMobile ? "12px" : "13px",
        padding: isMobile ? "10px 16px" : "8px 16px", // Bigger touch target on mobile
        borderRadius: 8,
        cursor: "pointer",
        margin: isMobile ? "8px 8px 0 0" : "0 8px 0 0", // Stack on mobile
        textTransform: "none",
        transition: "all 0.15s ease",
        minWidth: isMobile ? "auto" : "80px",
        flex: isMobile ? "1" : "none", // Equal width buttons on mobile
      }}
      expires={365}
      enableDeclineButton
      flipButtons={!isMobile} // Don't flip on mobile for better UX
      onAccept={(acceptedByScrolling) => {
        console.log("🍪 Cookies accepted", { acceptedByScrolling });
      }}
      onDecline={() => {
        console.log("❌ Cookies declined");
      }}
      // ✅ MOBILE: Custom content container styling
      contentStyle={{
        flex: isMobile ? "none" : "1",
        margin: 0,
        padding: 0,
      }}
      // ✅ MOBILE: Custom button container styling
      buttonWrapperClasses={
        isMobile ? "mobile-button-wrapper" : "desktop-button-wrapper"
      }
    >
      {/* ✅ RESPONSIVE: Mobile-first layout */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? "12px" : "16px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* ✅ MOBILE: Top row with icon and main content */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: isMobile ? "12px" : "16px",
            flex: 1,
          }}
        >
          {/* ✅ FIXED: Cookie Icon - Perfect alignment */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(254, 215, 170, 0.2) 100%)",
              borderRadius: 10,
              padding: isMobile ? "8px" : "10px",
              backdropFilter: "blur(8px)",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.15)",
              alignSelf: "flex-start", // ✅ FIXED: Top alignment
            }}
          >
            <Cookie size={isMobile ? 18 : 22} strokeWidth={2.2} color="#fff" />
          </div>

          {/* ✅ FIXED: Content with perfect vertical alignment */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center", // ✅ FIXED: Center alignment
                gap: 8,
                marginBottom: 4,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: isMobile ? "15px" : "16px",
                  color: "#fff",
                  letterSpacing: "0.01em",
                }}
              >
                Cookies
              </span>
              {/* ✅ FIXED: Shield icon with perfect alignment */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #fed7aa 100%)",
                  borderRadius: 4,
                  padding: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(251, 191, 36, 0.3)",
                }}
              >
                <Shield size={11} strokeWidth={2} color="#f97316" />
              </div>
            </div>

            <div
              style={{
                fontSize: isMobile ? "13px" : "14px",
                color: "#fef3c7",
                opacity: 0.95,
                lineHeight: "1.3",
                marginBottom: isMobile ? "0" : "0", // No margin on mobile
              }}
            >
              Website sử dụng cookies để cải thiện trải nghiệm.{" "}
              {!isMobile && ( // Hide link on mobile to save space
                <a
                  href="/privacy-policy"
                  style={{
                    color: "#fff",
                    textDecoration: "underline",
                    opacity: 0.9,
                    fontSize: "14px",
                  }}
                >
                  Tìm hiểu thêm
                </a>
              )}
            </div>
          </div>

          {/* ✅ XÓA HOÀN TOÀN: Desktop links section - Bảo mật & Cài đặt */}
        </div>

        {/* ✅ MOBILE ONLY: Bottom row with buttons */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              gap: 8,
              width: "100%",
              marginTop: "4px",
            }}
          >
            {/* Buttons will be automatically inserted here by react-cookie-consent */}
          </div>
        )}
      </div>

      {/* ✅ MOBILE: Custom CSS for button positioning */}
      <style>
        {`
          .mobile-button-wrapper {
            display: flex !important;
            gap: 8px !important;
            width: 100% !important;
            margin-top: 8px !important;
            justify-content: space-between !important;
          }
          .desktop-button-wrapper {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            margin-left: auto !important;
            flex-shrink: 0 !important;
          }
          
          /* ✅ MOBILE: Fix button container positioning */
          @media (max-width: 767px) {
            div[data-js-cookie-consent] > div {
              flex-direction: column !important;
            }
            div[data-js-cookie-consent] > div > div:last-child {
              width: 100% !important;
              display: flex !important;
              gap: 8px !important;
              margin-top: 8px !important;
            }
            div[data-js-cookie-consent] button {
              flex: 1 !important;
              margin: 0 !important;
            }
          }
        `}
      </style>
    </CookieConsent>
  );
};

export default CustomCookieConsent;
