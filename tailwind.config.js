/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'link-purple': '#8E4FDB',
        'para-gray': '#21212E'
      }
    },
  },
  plugins: [],
}
