/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display:  ['"Cormorant Garamond"', 'serif'],
        game:     ['"Fredoka One"', 'cursive'],
        ui:       ['"Nunito"', 'sans-serif'],
        body:     ['"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        roco: {
          bg:      '#0d0a1a',
          panel:   '#141128',
          border:  '#2a2050',
          star:    '#e8d5ff',
        },
      },
      animation: {
        'float':      'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'fade-up':    'fadeUp 0.5s ease forwards',
        'flash':      'flash 0.4s ease forwards',
        'spin-slow':  'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.7', filter: 'brightness(1)' },
          '50%':      { opacity: '1',   filter: 'brightness(1.3)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flash: {
          '0%':   { opacity: '0' },
          '30%':  { opacity: '0.85' },
          '100%': { opacity: '0' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
