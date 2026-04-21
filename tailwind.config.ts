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
        brand: {
          50:  "#EAF8FF",
          100: "#CEF1FD",
          200: "#A3E5FB",
          300: "#60D2F7",
          400: "#36C5F0",
          500: "#14AED8",
          600: "#108DB5",
          700: "#116E91",
          800: "#155977",
          900: "#174A62",
          950: "#0F2F40",
        },
        sun: {
          300: "#FFE680",
          400: "#FFD93D",
          500: "#FFC800",
        },
        accent: {
          purple: "#A78BFA",
          "purple-light": "#EDE9FE",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-comfortaa)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
