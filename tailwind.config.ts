import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal + teal — masculine and clinical
        bg: {
          DEFAULT: "#0b0b0c",
          1: "#0b0b0c",
          2: "#131314",
          3: "#1b1b1d",
        },
        bone: {
          DEFAULT: "#f1eee6",
          50: "#fbf9f3",
          100: "#f1eee6",
          200: "#dcd6c8",
          300: "#a8a29a",
          400: "#7a7670",
          500: "#52504c",
        },
        // Legacy alias — every existing class still works, just teal now.
        ox: {
          DEFAULT: "#00a88c",
          400: "#3fcfaf",
          500: "#00a88c",
          600: "#008a73",
          700: "#003d33",
        },
        accent: {
          100: "#e0fcf6",
          200: "#b8f9ee",
          300: "#7ce5d0",
          400: "#3fcfaf",
          500: "#14b890",
          600: "#00a88c",
          700: "#008a73",
          800: "#005f4f",
          900: "#003d33",
        },
        ash: {
          DEFAULT: "#26262a",
          200: "#1f1f22",
          400: "#2c2c30",
          600: "#3a3a40",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
    },
  },
  plugins: [],
};

export default config;
