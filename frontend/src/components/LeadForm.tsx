// components/LeadForm.tsx
import React, { useState, useEffect } from "react";
import { User, Mail, Gift, XCircle } from "lucide-react";
const LS_KEY = "template-market-leadform-success";

// Helper styles
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 15px 12px 40px",
  marginBottom: 14,
  borderRadius: 9,
  border: "none",
  fontSize: 16,
  background: "#fff", // <-- white background!
  color: "#222", // <-- dark text for strong contrast
  outline: "none",
  boxShadow: "0 1px 4px rgba(80,28,210,0.09)",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#fff",
  fontWeight: 500,
  marginBottom: 4,
  display: "block",
  letterSpacing: "0.03em",
};

const placeholderStyle: React.CSSProperties = {
  color: "#666", // medium gray, visible
  opacity: 1,
};

const LeadForm: React.FC = () => {
  const [show, setShow] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      setTimeout(() => setShow(true), 1800);
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
      setError("Vui lòng nhập đầy đủ họ tên & email.");
      return;
    }
    localStorage.setItem(LS_KEY, "success");
    setSuccess(true);
    setTimeout(() => setShow(false), 1600);
  };

  const handleClose = () => setShow(false);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 48,
        right: 36,
        zIndex: 99999,
        minWidth: 325,
        maxWidth: 410,
        background:
          "linear-gradient(135deg,#6b47e5 0%,#b67bfa 56%,#4adee4 100%)",
        borderRadius: 22,
        boxShadow: "0 16px 64px -10px #8576fa77, 0 2px 18px -4px #3bafe644",
        padding: "38px 32px 26px",
        fontFamily: "inherit",
        transition: "all .2s",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <Gift
            size={29}
            color="#fff"
            style={{ filter: "drop-shadow(0 2px 7px #0002)" }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: 20,
              color: "#fff",
              letterSpacing: "0.02em",
              textShadow: "0 2px 3px #42388ad1",
            }}
          >
            Nhận ưu đãi & tài liệu mới
          </span>
        </div>
        <button
          aria-label="Đóng"
          onClick={handleClose}
          style={{
            background: "rgba(255,255,255,0.17)",
            border: "none",
            borderRadius: 9,
            color: "#fff",
            padding: 6,
            fontSize: 19,
            cursor: "pointer",
          }}
        >
          <XCircle size={24} strokeWidth={2} />
        </button>
      </div>
      {/* Description */}
      <div
        style={{
          fontSize: 15,
          color: "#eafcff",
          opacity: 0.88,
          marginBottom: success ? 8 : 16,
          fontWeight: 400,
        }}
      >
        Đăng ký để nhận{" "}
        <span style={{ color: "#fff", fontWeight: 600 }}>
          tài liệu VIP, ưu đãi mới, tips & news hot
        </span>{" "}
        qua email mỗi tuần!
      </div>
      {/* Form */}
      {!success ? (
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{ marginBottom: 2 }}
        >
          <label htmlFor="name" style={labelStyle}>
            Họ tên
          </label>
          <div style={{ position: "relative" }}>
            <User
              size={17}
              style={{
                position: "absolute",
                left: 12,
                top: 13,
                color: "#b67bfa",
                opacity: 0.7,
              }}
            />
            <input
              id="name"
              name="name"
              placeholder="VD: Nguyễn Văn A"
              value={fields.name}
              onChange={handleChange}
              style={{ ...inputStyle }}
              autoFocus
            />
          </div>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <div style={{ position: "relative" }}>
            <Mail
              size={17}
              style={{
                position: "absolute",
                left: 12,
                top: 13,
                color: "#b67bfa",
                opacity: 0.7,
              }}
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="VD: nhan@gmail.com"
              value={fields.email}
              onChange={handleChange}
              style={{ ...inputStyle }}
            />
          </div>
          <style>
            {`
              input::placeholder {
                color: #666 !important;
                opacity: 1 !important;
                font-size: 15px;
              }
            `}
          </style>
          {error && (
            <div
              style={{
                color: "#f39ca0",
                fontSize: 14,
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 10,
              background: "linear-gradient(120deg,#fff 0%,#c2f9ff 100%)",
              color: "#6b47e5",
              fontWeight: 700,
              fontSize: 17,
              border: "none",
              margin: "6px 0",
              cursor: "pointer",
              boxShadow: "0 6px 16px #8576fa2e",
            }}
          >
            Đăng ký nhận quà
          </button>
        </form>
      ) : (
        <div
          style={{
            color: "#bef7d2",
            background: "rgba(0,0,0,0.12)",
            borderRadius: 7,
            padding: "12px 7px",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          🎉 Bạn đã đăng ký thành công! Hãy kiểm tra email để nhận tài liệu & ưu
          đãi nhé.
        </div>
      )}
      {/* Footer note */}
      <div
        style={{
          marginTop: 14,
          fontSize: 12.5,
          color: "#ebf0ff",
          opacity: 0.71,
          textAlign: "center",
        }}
      >
        * Bảo mật thông tin 100%. Có thể hủy đăng ký bất cứ lúc nào.
      </div>
    </div>
  );
};

export default LeadForm;
