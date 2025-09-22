import React, { useState, useEffect } from "react";
import { User, Mail, Gift, XCircle, CheckCircle } from "lucide-react";

const LS_KEY = "template-market-leadform-success";

// ✅ UPDATED: Pink/Rose/Red color scheme đồng bộ với Home page
const pastelSchemes = {
  main: "from-pink-50 via-rose-50 to-red-50", // ✅ Pink theme
  secondary: "from-rose-50 via-pink-50 to-white", // ✅ Rose theme
  accent: "from-red-50 via-white to-pink-50", // ✅ Red theme
  button: "from-pink-400 via-rose-400 to-red-400", // ✅ Pink gradient buttons
  buttonHover: "from-pink-500 via-rose-500 to-red-500", // ✅ Pink hover
  card: "from-white via-pink-50 to-rose-50", // ✅ Pink card
  textMain: "from-pink-600 via-rose-600 to-red-600", // ✅ Pink text
  textAccent: "from-rose-500 via-pink-500 to-red-500", // ✅ Rose accent
  iconPink: "from-pink-100 to-rose-200", // ✅ Pink icons
  iconBlue: "from-rose-100 to-pink-200", // ✅ Rose instead of blue
  iconYellow: "from-red-100 to-pink-200", // ✅ Red instead of yellow
};

const LeadForm: React.FC = () => {
  const [show, setShow] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      setTimeout(() => setShow(true), 2000); // Tăng thời gian hiển thị lên 2s
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!localStorage.getItem(LS_KEY) && !show) {
      timer = setTimeout(() => setShow(true), 180000); // 3 phút
    }
    return () => timer && clearTimeout(timer);
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name.trim() || !fields.email.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      setError("Email không hợp lệ.");
      return;
    }

    localStorage.setItem(LS_KEY, "success");
    setSuccess(true);
    setTimeout(() => setShow(false), 2000);
  };

  const handleClose = () => setShow(false);

  if (!show) return null;

  // Responsive positioning
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    ...(isMobile
      ? {
          // Mobile: center horizontally and vertically
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "340px",
        }
      : {
          // Desktop: bottom right corner
          bottom: 32,
          right: 32,
          width: "380px",
          maxWidth: "90vw",
        }),
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 99998,
            backdropFilter: "blur(4px)",
          }}
          onClick={handleClose}
        />
      )}

      <div style={containerStyle}>
        <div
          style={{
            // ✅ UPDATED: Pink/Rose/Red gradient background
            background: `linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #dc2626 100%)`,
            borderRadius: isMobile ? 16 : 20,
            boxShadow: isMobile
              ? "0 20px 40px rgba(236, 72, 153, 0.3)" // ✅ Pink shadow
              : "0 16px 48px rgba(244, 63, 94, 0.25), 0 4px 16px rgba(220, 38, 38, 0.15)", // ✅ Pink/Red shadows
            padding: isMobile ? "24px 20px 20px" : "32px 28px 24px",
            position: "relative",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: isMobile ? 16 : 18,
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 8 : 12,
                flex: 1,
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 12,
                  padding: isMobile ? 10 : 12,
                  backdropFilter: "blur(6px)",
                  flexShrink: 0,
                }}
              >
                <Gift
                  size={isMobile ? 22 : 26}
                  color="#fff"
                  strokeWidth={2.2}
                />
              </div>
              <div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: isMobile ? 16 : 18,
                    color: "#fff",
                    margin: 0,
                    lineHeight: 1.3,
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Nhận ưu đãi & tài liệu mới
                </h3>
                {!isMobile && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      margin: "2px 0 0 0",
                      fontWeight: 400,
                    }}
                  >
                    Miễn phí 100% • Hủy bất cứ lúc nào
                  </p>
                )}
              </div>
            </div>

            <button
              aria-label="Đóng"
              onClick={handleClose}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                padding: isMobile ? 8 : 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
            >
              <XCircle size={isMobile ? 18 : 20} strokeWidth={2} />
            </button>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: isMobile ? 14 : 15,
              color: "#fed7d7", // ✅ UPDATED: Light pink text
              opacity: 0.9,
              marginBottom: success ? 12 : isMobile ? 18 : 20,
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Đăng ký để nhận{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>
              templates độc quyền, ưu đãi hot
            </span>{" "}
            và tips thiết kế mỗi tuần!
          </div>

          {/* Success State */}
          {success ? (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                borderRadius: 12,
                padding: isMobile ? "16px 14px" : "18px 16px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#10b981",
                }}
              >
                <CheckCircle size={24} strokeWidth={2.5} />
                <div>
                  <p
                    style={{
                      fontSize: isMobile ? 15 : 16,
                      fontWeight: 600,
                      margin: 0,
                      color: "#fff",
                    }}
                  >
                    🎉 Đăng ký thành công!
                  </p>
                  <p
                    style={{
                      fontSize: isMobile ? 13 : 14,
                      margin: "4px 0 0 0",
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 400,
                    }}
                  >
                    Kiểm tra email để nhận quà nhé!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} style={{ marginBottom: 8 }}>
              {/* Name Field */}
              <div style={{ marginBottom: isMobile ? 14 : 16 }}>
                <label
                  htmlFor="name"
                  style={{
                    fontSize: isMobile ? 13 : 14,
                    color: "#fff",
                    fontWeight: 500,
                    marginBottom: 6,
                    display: "block",
                    letterSpacing: "0.01em",
                  }}
                >
                  Họ tên *
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#f9a8d4", // ✅ UPDATED: Pink icon color
                      opacity: 0.7,
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    id="name"
                    name="name"
                    placeholder="VD: Nguyễn Văn A"
                    value={fields.name}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: isMobile
                        ? "14px 16px 14px 44px"
                        : "13px 16px 13px 42px",
                      borderRadius: 10,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      fontSize: isMobile ? 15 : 16,
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "#2d3748",
                      outline: "none",
                      boxShadow: "0 2px 8px rgba(236, 72, 153, 0.08)", // ✅ Pink shadow
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.background = "#fff";
                      e.target.style.borderColor = "rgba(249, 168, 212, 0.5)"; // ✅ Pink border
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(249, 168, 212, 0.1)"; // ✅ Pink focus shadow
                    }}
                    onBlur={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.95)";
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                      e.target.style.boxShadow =
                        "0 2px 8px rgba(236, 72, 153, 0.08)"; // ✅ Pink shadow
                    }}
                    autoFocus={!isMobile} // Không auto focus trên mobile
                  />
                </div>
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: isMobile ? 16 : 18 }}>
                <label
                  htmlFor="email"
                  style={{
                    fontSize: isMobile ? 13 : 14,
                    color: "#fff",
                    fontWeight: 500,
                    marginBottom: 6,
                    display: "block",
                    letterSpacing: "0.01em",
                  }}
                >
                  Email *
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#f9a8d4", // ✅ UPDATED: Pink icon color
                      opacity: 0.7,
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="VD: ten@gmail.com"
                    value={fields.email}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: isMobile
                        ? "14px 16px 14px 44px"
                        : "13px 16px 13px 42px",
                      borderRadius: 10,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      fontSize: isMobile ? 15 : 16,
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "#2d3748",
                      outline: "none",
                      boxShadow: "0 2px 8px rgba(236, 72, 153, 0.08)", // ✅ Pink shadow
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.background = "#fff";
                      e.target.style.borderColor = "rgba(249, 168, 212, 0.5)"; // ✅ Pink border
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(249, 168, 212, 0.1)"; // ✅ Pink focus shadow
                    }}
                    onBlur={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.95)";
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                      e.target.style.boxShadow =
                        "0 2px 8px rgba(236, 72, 153, 0.08)"; // ✅ Pink shadow
                    }}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    color: "#fca5a5",
                    background: "rgba(239, 68, 68, 0.1)",
                    fontSize: isMobile ? 13 : 14,
                    marginBottom: 14,
                    fontWeight: 500,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: isMobile ? "15px 20px" : "14px 20px",
                  borderRadius: 10,
                  background: "linear-gradient(120deg, #fff 0%, #fdf2f8 100%)", // ✅ UPDATED: Pink-tinted white
                  color: "#ec4899", // ✅ UPDATED: Pink text
                  fontWeight: 700,
                  fontSize: isMobile ? 16 : 17,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(255, 255, 255, 0.3)",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(255, 255, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(255, 255, 255, 0.3)";
                }}
              >
                🎁 Đăng ký nhận quà ngay
              </button>
            </form>
          )}

          {/* Footer Security Note */}
          <div
            style={{
              marginTop: isMobile ? 12 : 16,
              fontSize: isMobile ? 11 : 12,
              color: "#fed7d7", // ✅ UPDATED: Light pink text
              opacity: 0.75,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            🔒 Bảo mật 100% • Không spam • Hủy đăng ký dễ dàng
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>
        {`
          input::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
            font-size: ${isMobile ? "14px" : "15px"};
          }
          
          @media (max-width: 767px) {
            input {
              font-size: 16px !important; /* Prevent zoom on iOS */
            }
          }
        `}
      </style>
    </>
  );
};

export default LeadForm;
