/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          850: '#0f2342',
          900: '#0a192f',
          950: '#060f1e',
        },
        teal: {
          450: '#14b8a6',
          550: '#0d9488',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px -4px rgba(10, 25, 47, 0.08), 0 2px 8px -2px rgba(10, 25, 47, 0.04)',
        'glass-dark': '0 12px 36px -4px rgba(0, 0, 0, 0.45), 0 2px 10px -2px rgba(0, 0, 0, 0.3)',
        'teal-glow': '0 0 40px -8px rgba(13, 148, 136, 0.45)',
      },
    },
  },
  plugins: [],
};
