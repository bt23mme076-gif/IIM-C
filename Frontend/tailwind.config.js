/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        offwhite: '#fdfcfb',
        charcoal: '#1a1a1a',
        academic: {
          bg: '#F7F4EE',
          surface: '#FFFFFF',
          text: '#1F2937',
          muted: '#5B6472',
          border: '#D9D6CF',
          gold: '#B9975B',
          navy: '#1E2A38',
        },
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        'academic': '0 2px 12px rgba(30, 42, 56, 0.06)',
        'academic-hover': '0 8px 24px rgba(30, 42, 56, 0.12)',
      },
    },
  },
  plugins: [],
}
