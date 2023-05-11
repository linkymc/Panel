import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: ["dracula"]
  },
  plugins: [require("daisyui")],
} satisfies Config;
