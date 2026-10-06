import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316", // Core orange
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          gradientStart: "#FF6A00",
          gradientEnd: "#EE0979",
          warmStart: "#FF7A00",
          warmEnd: "#FF4500",
        },
        surface: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          800: "#1A1E26",
          850: "#15181F",
          900: "#12151C",
          950: "#0B0D11",
        },
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #FF7A00 0%, #FF4500 100%)",
        "gradient-warm-subtle": "linear-gradient(135deg, rgba(255, 122, 0, 0.15) 0%, rgba(255, 69, 0, 0.05) 100%)",
        "gradient-cinematic": "linear-gradient(180deg, rgba(11, 13, 17, 0) 0%, rgba(11, 13, 17, 0.85) 60%, #0B0D11 100%)",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
