import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10151F",
        obsidian: "#080C14",
        graphite: "#2A303B",
        mist: "#F5F7FA",
        line: "#E4E8EE",
        gold: "#B8944F",
        coral: "#E8755A",
        teal: "#0F8B8D",
        cyan: "#00E5FF",
        violet: "#855CFF",
        rose: "#FF6B8A"
      },
      boxShadow: {
        premium: "0 24px 70px rgba(16, 21, 31, 0.14)",
        soft: "0 14px 35px rgba(16, 21, 31, 0.08)",
        glow: "0 24px 70px rgba(0, 229, 255, 0.16)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
