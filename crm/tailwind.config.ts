import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1e3a5f", dark: "#0f1f35" },
        accent: "#2563eb",
        sidebar: "#0f172a",
      },
    },
  },
  plugins: [],
};

export default config;
