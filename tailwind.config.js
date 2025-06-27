/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./*.html",
      "./js/**/*.js"
    ],
    theme: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      extend: {
        // These are your custom colors and fonts from the original website
        colors: {
          'brand-blue': '#004AAD',
          'brand-yellow': '#FFD700',
          'brand-dark': '#111827',
          'brand-light': '#FFFFFF',
          'brand-green': '#10B981',
          'brand-purple': '#8B5CF6',
          'brand-pink': '#EC4899',
          'brand-red': '#EF4444',
        },
        fontFamily: {
          'manrope': ['Manrope', 'sans-serif'],
        },
        spacing: {
          'mobile-header': '80px', // For navbar height on mobile
        }
      }
    },
    plugins: [],
  }