/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#1c1917", sand: "#f4f1ec", clay: "#9a7b62" },
    },
  },
  plugins: [],
};
