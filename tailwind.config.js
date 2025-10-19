/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./views/**/*.ejs", // Ruta a tus archivos EJS
    "./public/**/*.js",
    "./node_modules/flowbite/**/*.js" // <- Agregado para Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // <- Agregado para Flowbite
  ],
};
