/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        'base-background': '#F9FAFB',
        'base-text': '#111827',
        dark: {
          'base-background': '#111827',
          'base-text': '#F9FAFB',
          primary: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
