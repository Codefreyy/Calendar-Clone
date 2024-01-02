/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#4c9fe0",
        eventBlue: "hsl(200, 80%, 50%)",
        eventGreen: "hsl(150, 80%, 30%)",
        eventRed: "#cb4538",
      },
      borderColor: {
        normal: "#dadce0",
      },
      borderWidth: "1px",
      padding: {
        dayPadding: "1px",
      },
      normal: "1px",
    },
  },
  plugins: [],
}
