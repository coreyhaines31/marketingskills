import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        band: {
          critical: "#dc2626",
          weak: "#f59e0b",
          moderate: "#eab308",
          good: "#10b981",
          strong: "#059669",
        },
      },
    },
  },
  plugins: [],
};

export default config;
