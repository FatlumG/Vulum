/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5F6FA",
        secondary: "#4880ff",
        darkBlue: "#1979ff",
        lightBlue: "#5aa2ff5f",
        lightGray: "#8D8D8D",
        grayText: "#565656"
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        NunitoSans: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
