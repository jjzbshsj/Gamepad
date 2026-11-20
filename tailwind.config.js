import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#0A0F1C',
          900: '#111A2E',
          800: '#1A2742',
          700: '#223354',
        },
        neon: '#00E5FF',
        electric: '#3B82F6',
        nebula: '#8B5CF6',
        signal: {
          ok: '#22C55E',
          warn: '#F59E0B',
          bad: '#EF4444',
          info: '#38BDF8',
        },
        ink: {
          50: '#F1F5F9',
          400: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(0,229,255,0.22)',
        'glow-lg': '0 0 48px rgba(0,229,255,0.28)',
        panel: '0 18px 48px rgba(4,10,24,0.55)',
      },
      keyframes: {
        'pulse-glow': {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'scan-line': 'scan-line 3.2s linear infinite',
        'slide-up': 'slide-up 0.45s ease-out both',
      },
    },
  },
  plugins: [animate],
}
