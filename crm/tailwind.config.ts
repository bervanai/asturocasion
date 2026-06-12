import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#051424",
        "surface-dim": "#051424",
        "surface-bright": "#2c3a4c",
        "surface-container-lowest": "#010f1f",
        "surface-container-low": "#0d1c2d",
        "surface-container": "#122131",
        "surface-container-high": "#1c2b3c",
        "surface-container-highest": "#273647",
        "surface-variant": "#273647",
        "on-surface": "#d4e4fa",
        "on-surface-variant": "#c6c6cd",
        "outline-variant": "#45464d",
        outline: "#909097",
        primary: "#bec6e0",
        "on-primary": "#283044",
        "primary-container": "#0f172a",
        secondary: "#b9c7e0",
        "secondary-container": "#3c4a5e",
        "on-secondary-container": "#abb9d2",
        tertiary: "#ffb690",
        "on-tertiary": "#552100",
        "tertiary-container": "#2d0e00",
        "on-tertiary-container": "#d45d00",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "success-green": "#22C55E",
        "warning-yellow": "#FACC15",
        "sunset-orange": "#FF5733",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
