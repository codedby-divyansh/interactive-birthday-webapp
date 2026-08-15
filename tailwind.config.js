/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        blush: '#FFE4EC',
        lavender: '#E8D5F2',
        softpurple: '#D4BBFF',
        petal: '#FFB7C5',
        night: '#1a1033',
        moonlight: '#F5E6FF',
      },
      fontFamily: {
        display: ['"Fredoka"', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 32px rgba(212, 187, 255, 0.25)',
        glow: '0 0 20px rgba(255, 183, 197, 0.5)',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        petal: 'petal 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        petal: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
