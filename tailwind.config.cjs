/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red-team': {
          primary: '#ff0000',
          secondary: '#8b0000',
          accent: '#ff4444',
        },
        'blue-team': {
          primary: '#007bff',
          secondary: '#004080',
          accent: '#44a4ff',
        },
      },
      animation: {
        'terminal-cursor': 'blink 1s step-end infinite',
        'glitch': 'glitch 1s linear infinite',
        'scanline': 'scanline 6s linear infinite',
        'text-flicker': 'textFlicker 0.3s linear infinite',
        'matrix-text': 'matrixText 20s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'type-text': 'typeText 3s steps(40, end)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 2px)' },
          '66%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        textFlicker: {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.8' },
          '66%': { opacity: '0.9' },
        },
        matrixText: {
          '0%': { color: '#0F0' },
          '50%': { color: '#0A0' },
          '100%': { color: '#0F0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        typeText: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'text-red-500',
    'text-blue-500',
    'text-red-400',
    'text-blue-400',
    'border-red-500',
    'border-blue-500',
    'hover:text-red-400',
    'hover:text-blue-400',
    'hover:bg-red-500',
    'hover:bg-blue-500',
  ],
}