/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surf': {
          bg: '#0a0f1a',
          surface: '#111827',
          'surface-elevated': '#1f2937',
          border: '#374151',
          muted: '#6b7280',
          accent: '#22d3ee',
          'accent-dim': 'rgba(34, 211, 238, 0.15)',
          emerald: '#34d399',
          'emerald-dim': 'rgba(52, 211, 153, 0.15)',
          amber: '#fbbf24',
          'amber-dim': 'rgba(251, 191, 36, 0.15)',
        },
        // Keep legacy for gradual migration
        'deep-sea': {
          bg: '#0a0f1a',
          accent: '#22d3ee',
          'accent-green': '#34d399',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 4px 24px -4px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 24px -4px rgba(34, 211, 238, 0.2)',
        'glow-emerald': '0 0 24px -4px rgba(52, 211, 153, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
