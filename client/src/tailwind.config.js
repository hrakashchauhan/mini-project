/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Deep Focus" Palette
        background: {
          DEFAULT: '#020617', // Slate-950 (Main Canvas)
          paper: '#0f172a',   // Slate-900 (Cards/Panels)
          surface: '#1e293b', // Slate-800 (Hover/Active)
        },
        primary: {
          DEFAULT: '#7c3aed', // Violet-600
          hover: '#6d28d9',   // Violet-700
          glow: 'rgba(124, 58, 237, 0.5)', 
        },
        status: {
          focus: '#10b981',      // Emerald-500 (Student Focused)
          warning: '#f59e0b',    // Amber-500 (Timer Running)
          distracted: '#f43f5e', // Rose-500 (Distracted)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px -5px var(--tw-shadow-color)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}