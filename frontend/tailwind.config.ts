import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      // padding: {
      //   DEFAULT: "1rem", // Mobile: 16px
      //   sm: "1.5rem", // Small: 24px
      //   md: "2rem", // Medium: 32px
      //   lg: "3rem", // Large: 48px
      //   xl: "4rem", // XL: 64px
      //   "2xl": "5rem", // 2XL: 80px
      // },
      // screens: {
      //   sm: "640px",
      //   md: "768px",
      //   lg: "1024px",
      //   xl: "1280px",
      //   "2xl": "1536px",
      // },
      padding: {
        DEFAULT: "1rem", // Mobile: 16px - thoải mái cho điện thoại
        sm: "2rem", // Small: 32px - tablet nhỏ cần không gian hơn
        md: "3rem", // Medium: 48px - tablet lớn và desktop nhỏ
        lg: "4rem", // Large: 64px - desktop tiêu chuẩn
        xl: "5rem", // XL: 80px - desktop lớn
        "2xl": "6rem", // 2XL: 96px - màn hình siêu rộng
      },
      screens: {
        sm: "640px", // Tablet nhỏ (landscape phone)
        md: "768px", // Tablet (iPad portrait)
        lg: "1024px", // Desktop nhỏ (iPad landscape)
        xl: "1280px", // Desktop tiêu chuẩn
        "2xl": "1400px", // Desktop lớn (thay vì 1536px)
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "144": "36rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        hard: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 8px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindScrollbar,
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        ".text-responsive": {
          "@screen sm": {
            fontSize: theme("fontSize.sm"),
          },
          "@screen md": {
            fontSize: theme("fontSize.base"),
          },
          "@screen lg": {
            fontSize: theme("fontSize.lg"),
          },
          "@screen xl": {
            fontSize: theme("fontSize.xl"),
          },
          "@screen 2xl": {
            fontSize: theme("fontSize.2xl"),
          },
        },
        ".container-responsive": {
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: theme("spacing.4"),
          paddingRight: theme("spacing.4"),
          "@screen sm": {
            maxWidth: theme("screens.sm"),
            paddingLeft: theme("spacing.6"),
            paddingRight: theme("spacing.6"),
          },
          "@screen md": {
            maxWidth: theme("screens.md"),
            paddingLeft: theme("spacing.8"),
            paddingRight: theme("spacing.8"),
          },
          "@screen lg": {
            maxWidth: theme("screens.lg"),
            paddingLeft: theme("spacing.12"),
            paddingRight: theme("spacing.12"),
          },
          "@screen xl": {
            maxWidth: theme("screens.xl"),
            paddingLeft: theme("spacing.16"),
            paddingRight: theme("spacing.16"),
          },
          "@screen 2xl": {
            maxWidth: "1600px",
            paddingLeft: theme("spacing.20"),
            paddingRight: theme("spacing.20"),
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
