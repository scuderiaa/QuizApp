/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        lblack: ["LufgaBlack", "sans-serif"],
        Row_Bold:["Rowdies-Bold", "sans-serif"],
        Row_Regular:["Rowdies-Regular", "sans-serif"],
        Parkinsans:["Parkinsans-VariableFont_wght", "sans-serif"],
      },
    },
    plugins: [],
  }
}