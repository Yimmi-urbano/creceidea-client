/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./views/**/*.ejs", // Ruta a tus archivos EJS
    "./public/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
