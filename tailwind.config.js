/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--main-color)",
        white: "var(--white-color)",
        gray: "var(--gray-color)",
        deepgray: "var(--deep-gray-color)",
        pearl: "var(--pearl-color)"
      }
    },
    fontFamily: {
      montserrat: ["Montserrat"],
      highlight: ["Trail", "sans-serif"]
    }
  },
  plugins: []
}

