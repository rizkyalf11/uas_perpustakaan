import type { Config } from "tailwindcss";

const config: Config = {
  daisyui: {
    themes: [],
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        putih2: "#E8F1F5",
        putih1: "#FAFAFA",
        biru2: "#004A7C",
        biru1: "#005691",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
