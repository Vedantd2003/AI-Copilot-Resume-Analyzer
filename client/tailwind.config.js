/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f0ff',
          100: '#e4e3ff',
          200: '#cccaff',
          300: '#aaa6ff',
          400: '#857afd',
          500: '#6366f1',
          600: '#5145e8',
          700: '#4338d4',
          800: '#3730ab',
          900: '#312e87',
        },
        accent: {
          violet: '#8b5cf6',
          cyan:   '#06b6d4',
          emerald:'#10b981',
          amber:  '#f59e0b',
          rose:   '#f43f5e',
        },
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          800: '#0f0f1a',
          850: '#0d0d15',
          900: '#09090f',
          950: '#050508',
        },
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'slide-up':     'slideUp 0.5s ease forwards',
        'glow':         'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glow:    { from: { boxShadow: '0 0 10px #6366f1' }, to: { boxShadow: '0 0 30px #8b5cf6, 0 0 60px #6366f1' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, #6366f115 0px, transparent 50%), radial-gradient(at 80% 0%, #8b5cf615 0px, transparent 50%), radial-gradient(at 0% 50%, #06b6d415 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};
