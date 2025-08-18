// components/CookieConsent.tsx
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
      buttonText="Chấp nhận tất cả"
      declineButtonText="Từ chối"
      cookieName="template-market-cookie-consent"
      style={{
        width: "100vw",
        maxWidth: "100%",
        background:
          "linear-gradient(90deg, #7066e0 0%, #a885f7 50%, #55b3fa 100%)",
        color: "#fff",
        fontSize: "15px",
        lineHeight: "1.7",
        padding: "30px 6vw",
        zIndex: 9999,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderTop: "2px solid rgba(255,255,255,0.10)",
        boxShadow: "0 -12px 32px rgba(80,28,210,0.19)",
        backdropFilter: "blur(12px)",
        position: "fixed",
        left: 0,
        bottom: 0,
      }}
      buttonStyle={{
        background: "linear-gradient(120deg, #fff 0%, #e3e6fe 100%)",
        color: "#7066e0",
        fontWeight: 700,
        fontSize: "15px",
        padding: "13px 32px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(80,28,210,.10)",
        marginRight: 10,
        textTransform: "none",
        transition: "all 0.2s",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#fff",
        border: "2px solid #fff",
        fontWeight: 400,
        fontSize: "15px",
        padding: "13px 32px",
        borderRadius: 10,
        cursor: "pointer",
        marginRight: 0,
        boxShadow: "0 2px 6px rgba(80,28,210,.07)",
        textTransform: "none",
        transition: "all 0.2s",
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
          alignItems: "flex-start",
          gap: "32px",
          maxWidth: "1100px",
          margin: "0 auto",
          flexWrap: "wrap",
        }}
      >
        {/* --- Cookie Icon --- */}
        <div
          style={{
            background: "rgba(255,255,255,0.18)",
            borderRadius: 16,
            padding: 16,
            backdropFilter: "blur(8px)",
            marginRight: 12,
            boxShadow: "0 4px 10px -2px rgba(80,28,210,.04)",
            alignSelf: "center",
          }}
        >
          <Cookie size={36} strokeWidth={2.5} color="#fff" />
        </div>
        {/* --- Content --- */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "18px",
                color: "#fff",
                letterSpacing: "0.02em",
              }}
            >
              Chúng tôi sử dụng cookies
            </span>
            <Shield size={19} strokeWidth={2.2} color="#e3e6fe" />
          </div>
          <div
            style={{
              marginBottom: 20,
              fontSize: "15px",
              color: "#f5f5ff",
              opacity: 0.89,
            }}
          >
            Website sử dụng cookies để cải thiện trải nghiệm, phân tích lưu
            lượng và cá nhân hóa nội dung. Bạn có thể tùy chỉnh cài đặt cookie
            bất cứ lúc nào.
          </div>
          <div
            style={{
              display: "flex",
              gap: 18,
              marginBottom: 0,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/privacy-policy"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 14,
                color: "#fff",
                textDecoration: "underline",
                opacity: 0.79,
                padding: "3px 0",
                fontWeight: 400,
                borderRadius: 6,
              }}
            >
              <Shield size={13} strokeWidth={2} /> Chính sách bảo mật
            </a>
            <a
              href="/cookie-settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 14,
                color: "#fff",
                textDecoration: "underline",
                opacity: 0.79,
                padding: "3px 0",
                fontWeight: 400,
                borderRadius: 6,
              }}
            >
              <Settings size={13} strokeWidth={2} /> Cài đặt cookies
            </a>
          </div>
        </div>
      </div>
    </CookieConsent>
  );
};

export default CustomCookieConsent;
