/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F47C20',
          'orange-light': '#FFF1E6',
          'orange-soft': '#FFE0C2',
          purple: '#6C4DF6',
          'purple-light': '#F3F0FF',
          bg: '#FFFFFF',
          card: '#FFFFFF',
          text: '#333333',
          muted: '#777777'
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Fredoka', 'sans-serif'],
        display: ['Fredoka', 'Nunito', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem'
      }
    },
  },
  plugins: [],
}
