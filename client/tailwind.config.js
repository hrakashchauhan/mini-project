/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Sora"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        background: '#0a0a0a',
        'background-paper': '#1a1a1a',
        'background-surface': '#2a2a2a',
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        'status-distracted': '#ef4444',
        accent: '#22c55e',
        glow: '#8b5cf6',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-accent': '0 0 24px rgba(34, 197, 94, 0.35)',
        'soft-lg': '0 24px 64px -32px rgba(15, 23, 42, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
