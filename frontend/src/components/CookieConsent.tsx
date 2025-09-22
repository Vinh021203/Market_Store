import React, { useEffect } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { Cookie, Shield, Settings } from "lucide-react";

const CustomCookieConsent: React.FC = () => {
  useEffect(() => {
    const cookieValue = getCookieConsentValue("template-market-cookie-consent");
    console.log("🍪 Current cookie consent value:", cookieValue);
  }, []);

  return (
    <CookieConsent
      location="bottom"
      buttonText="Chấp nhận"
      declineButtonText="Từ chối"
      cookieName="template-market-cookie-consent"
      style={{
        // Full width bottom banner
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        minHeight: "80px",
        maxHeight: "120px",

        // ✅ UPDATED: Lighter pink gradient
        background:
          "linear-gradient(135deg, #f9a8d4 0%, #fb7185 50%, #f87171 100%)", // Much lighter pink/rose/red
        color: "#fff",
        fontSize: "14px",
        lineHeight: "1.4",
        padding: "16px 20px",
        zIndex: 9999,
        borderRadius: 0,
        border: "none",
        boxShadow: "0 -4px 20px rgba(249, 168, 212, 0.3)", // Lighter pink shadow
        backdropFilter: "blur(12px)",

        // Bottom positioning - Full width
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
      }}
      buttonStyle={{
        background: "rgba(255, 255, 255, 0.95)",
        color: "#f87171", // Lighter red text
        fontWeight: 600,
        fontSize: "13px",
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginLeft: 8,
        marginRight: 0,
        textTransform: "none",
        transition: "all 0.15s ease",
        minWidth: "auto",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.8)",
        fontWeight: 500,
        fontSize: "13px",
        padding: "8px 16px",
        borderRadius: 8,
        cursor: "pointer",
        marginRight: 0,
        textTransform: "none",
        transition: "all 0.15s ease",
        minWidth: "auto",
      }}
      expires={365}
      enableDeclineButton
      flipButtons
      onAccept={(acceptedByScrolling) => {
        console.log("🍪 Cookies accepted", { acceptedByScrolling });
      }}
      onDecline={() => {
        console.log("❌ Cookies declined");
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* ✅ Cookie Icon - No emoji, just the Cookie icon */}
        <div
          style={{
            background: "rgba(255,255,255,0.25)", // Lighter background
            borderRadius: 12,
            padding: 10,
            backdropFilter: "blur(8px)",
            flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.4)", // Lighter border
          }}
        >
          <Cookie size={22} strokeWidth={2.2} color="#fff" />
        </div>

        {/* ✅ Content - NO emojis, only icons */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#fff",
                letterSpacing: "0.01em",
              }}
            >
              Cookies {/* ✅ NO emoji, just text */}
            </span>
            <Shield size={16} strokeWidth={2} color="#fed7d7" />{" "}
            {/* ✅ Lighter pink icon */}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#fed7d7", // ✅ Much lighter pink text
              opacity: 0.95,
              lineHeight: "1.3",
            }}
          >
            Website sử dụng cookies để cải thiện trải nghiệm.{" "}
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
          </div>
        </div>

        {/* ✅ Links - Only icons, no emojis */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <a
            href="/privacy-policy"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: "#fed7d7", // ✅ Lighter pink
              textDecoration: "none",
              opacity: 0.8,
              fontWeight: 400,
              borderBottom: "1px solid transparent",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
          >
            <Shield size={11} strokeWidth={2} />
            Bảo mật
          </a>

          <a
            href="/cookie-settings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: "#fed7d7", // ✅ Lighter pink
              textDecoration: "none",
              opacity: 0.8,
              fontWeight: 400,
              borderBottom: "1px solid transparent",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
          >
            <Settings size={11} strokeWidth={2} />
            Cài đặt
          </a>
        </div>
      </div>
    </CookieConsent>
  );
};

export default CustomCookieConsent;
