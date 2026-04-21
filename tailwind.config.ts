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
          50:  "#e0fafb",
          100: "#b3f1f5",
          200: "#80e7ef",
          300: "#4ddde9",
          400: "#26d4e3",
          500: "#00cbdc",
          600: "#00a5b5",
          700: "#00838f",
          800: "#006169",
          900: "#004549",
          950: "#002c30",
        },
        sun: {
          300: "#ffe680",
          400: "#ffd93d",
          500: "#ffc800",
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
