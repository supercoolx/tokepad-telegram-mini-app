import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
        margarine: ['Margarine', ...defaultTheme.fontFamily.sans],
        marcellus: ['Marcellus', ...defaultTheme.fontFamily.sans],
        lily: ['Lily Script One', ...defaultTheme.fontFamily.sans],
        lemon: ['Lemon', ...defaultTheme.fontFamily.sans],
        lilita: ['Lilita One', ...defaultTheme.fontFamily.sans],
        madimi: ['Madimi One', ...defaultTheme.fontFamily.sans],
        sawarabi: ['Sawarabi Gothic', ...defaultTheme.fontFamily.sans],
        press: ["'Press Start 2P'", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'fadeup': {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-100px)' },
        },
        'fadeshow': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      animation: {
        fadeup: 'fadeup 1s ease forwards',
        fadeshow: 'fadeshow 1s ease forwards',
      }
    },
  },
  plugins: [],
}

