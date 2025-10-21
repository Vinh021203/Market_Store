import React, { useState, useEffect } from "react";
import { User, Mail, Gift, XCircle, CheckCircle } from "lucide-react";

const LS_KEY = "template-market-leadform-success";

const LeadForm: React.FC = () => {
  const [show, setShow] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!localStorage.getItem(LS_KEY) && !show) {
      timer = setTimeout(() => setShow(true), 180000);
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

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    ...(isMobile
      ? {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "340px",
        }
      : {
          bottom: 32,
          right: 32,
          width: "380px",
          maxWidth: "90vw",
        }),
  };

  return (
    <>
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 99998,
            backdropFilter: "blur(4px)",
          }}
          onClick={handleClose}
        />
      )}

      <div style={containerStyle}>
        <div
          style={{
            // ✅ NỀN PASTEL
            background: `linear-gradient(135deg, #fce7f3 0%, #fed7aa 50%, #fef3c7 100%)`,
            borderRadius: isMobile ? 16 : 20,
            boxShadow: isMobile
              ? "0 20px 40px rgba(236, 72, 153, 0.25)"
              : "0 16px 48px rgba(249, 115, 22, 0.2), 0 4px 16px rgba(234, 179, 8, 0.15)",
            padding: isMobile ? "24px 20px 20px" : "32px 28px 24px",
            position: "relative",
            border: "2px solid rgba(249, 115, 22, 0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 60,
              height: 60,
              background: "rgba(236, 72, 153, 0.1)",
              borderRadius: "50%",
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              width: 50,
              height: 50,
              background: "rgba(249, 115, 22, 0.1)",
              borderRadius: "50%",
              filter: "blur(15px)",
              pointerEvents: "none",
            }}
          />

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
                  background:
                    "linear-gradient(135deg, #fbcfe8 0%, #fed7aa 100%)",
                  borderRadius: 12,
                  padding: isMobile ? 10 : 12,
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(249, 168, 212, 0.25)",
                }}
              >
                <Gift
                  size={isMobile ? 22 : 26}
                  color="#ec4899"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: isMobile ? 16 : 18,
                    background:
                      "linear-gradient(120deg, #ec4899 0%, #f97316 50%, #eab308 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  Nhận ưu đãi & tài liệu mới
                </h3>
                {!isMobile && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#64748b",
                      margin: "2px 0 0 0",
                      fontWeight: 500,
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
                background: "rgba(236, 72, 153, 0.1)",
                border: "none",
                borderRadius: 8,
                color: "#ec4899",
                padding: isMobile ? 8 : 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(236, 72, 153, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(236, 72, 153, 0.1)";
              }}
            >
              <XCircle size={isMobile ? 18 : 20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: isMobile ? 14 : 15,
              color: "#475569",
              marginBottom: success ? 12 : isMobile ? 18 : 20,
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            Đăng ký để nhận{" "}
            <span
              style={{
                background: "linear-gradient(120deg, #ec4899 0%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              templates độc quyền, ưu đãi hot
            </span>{" "}
            và tips thiết kế mỗi tuần!
          </div>

          {success ? (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                borderRadius: 12,
                padding: isMobile ? "16px 14px" : "18px 16px",
                border: "2px solid rgba(16, 185, 129, 0.3)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <CheckCircle size={24} color="#10b981" strokeWidth={3} />
                <div>
                  <p
                    style={{
                      fontSize: isMobile ? 15 : 16,
                      fontWeight: 700,
                      margin: 0,
                      color: "#10b981",
                    }}
                  >
                    🎉 Đăng ký thành công!
                  </p>
                  <p
                    style={{
                      fontSize: isMobile ? 13 : 14,
                      margin: "4px 0 0 0",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    Kiểm tra email để nhận quà nhé!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginBottom: 8 }}>
              {/* Name Field */}
              <div style={{ marginBottom: isMobile ? 14 : 16 }}>
                <label
                  htmlFor="name"
                  style={{
                    fontSize: isMobile ? 13 : 14,
                    color: "#334155",
                    fontWeight: 600,
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Họ tên *
                </label>
                <div style={{ position: "relative" }}>
                  {/* ✅ ICON NỀN TRONG INPUT */}
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background:
                        "linear-gradient(135deg, #fbcfe8 0%, #fed7aa 100%)",
                      borderRadius: 8,
                      padding: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(249, 168, 212, 0.2)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  >
                    <User size={16} color="#ec4899" strokeWidth={2.5} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    placeholder="VD: Nguyễn Văn A"
                    value={fields.name}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: isMobile
                        ? "14px 16px 14px 54px" // ✅ Tăng left padding
                        : "13px 16px 13px 52px",
                      borderRadius: 10,
                      border: "2px solid rgba(249, 115, 22, 0.2)",
                      fontSize: isMobile ? 15 : 16,
                      background: "#fff",
                      color: "#2d3748",
                      outline: "none",
                      boxShadow: "0 2px 8px rgba(249, 115, 22, 0.08)",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box",
                      fontWeight: 500,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#f97316";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(249, 115, 22, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(249, 115, 22, 0.2)";
                      e.target.style.boxShadow =
                        "0 2px 8px rgba(249, 115, 22, 0.08)";
                    }}
                    autoFocus={!isMobile}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: isMobile ? 16 : 18 }}>
                <label
                  htmlFor="email"
                  style={{
                    fontSize: isMobile ? 13 : 14,
                    color: "#334155",
                    fontWeight: 600,
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Email *
                </label>
                <div style={{ position: "relative" }}>
                  {/* ✅ ICON NỀN TRONG INPUT */}
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background:
                        "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
                      borderRadius: 8,
                      padding: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(251, 191, 36, 0.2)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  >
                    <Mail size={16} color="#f97316" strokeWidth={2.5} />
                  </div>
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
                        ? "14px 16px 14px 54px"
                        : "13px 16px 13px 52px",
                      borderRadius: 10,
                      border: "2px solid rgba(249, 115, 22, 0.2)",
                      fontSize: isMobile ? 15 : 16,
                      background: "#fff",
                      color: "#2d3748",
                      outline: "none",
                      boxShadow: "0 2px 8px rgba(249, 115, 22, 0.08)",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxSizing: "border-box",
                      fontWeight: 500,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#f97316";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(249, 115, 22, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(249, 115, 22, 0.2)";
                      e.target.style.boxShadow =
                        "0 2px 8px rgba(249, 115, 22, 0.08)";
                    }}
                  />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    color: "#ef4444",
                    background: "rgba(239, 68, 68, 0.1)",
                    fontSize: isMobile ? 13 : 14,
                    marginBottom: 14,
                    fontWeight: 600,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "2px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* ✅ BUTTON MÀU HỢP LÝ VỚI NỀN PASTEL */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: isMobile ? "15px 20px" : "14px 20px",
                  borderRadius: 10,
                  // ✅ Pink-Orange gradient hợp với pastel background
                  background:
                    "linear-gradient(120deg, #ec4899 0%, #f97316 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: isMobile ? 16 : 17,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(236, 72, 153, 0.3)",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(236, 72, 153, 0.4)";
                  e.currentTarget.style.background =
                    "linear-gradient(120deg, #db2777 0%, #ea580c 100%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(236, 72, 153, 0.3)";
                  e.currentTarget.style.background =
                    "linear-gradient(120deg, #ec4899 0%, #f97316 100%)";
                }}
              >
                🎁 Đăng ký nhận quà ngay
              </button>
            </form>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: isMobile ? 12 : 16,
              fontSize: isMobile ? 11 : 12,
              color: "#64748b",
              textAlign: "center",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            🔒 Bảo mật 100% • Không spam • Hủy đăng ký dễ dàng
          </div>
        </div>
      </div>

      <style>
        {`
          input::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
            font-size: ${isMobile ? "14px" : "15px"};
          }
          
          @media (max-width: 767px) {
            input {
              font-size: 16px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default LeadForm;
