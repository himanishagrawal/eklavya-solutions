/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0E16',      // deep charcoal navy background
          soft: '#0D131D',
        },
        surface: {
          DEFAULT: '#121926',      // card surface
          elevated: '#182131',     // raised card / modal surface
          border: '#22304A',
        },
        accent: {
          DEFAULT: '#3AA9FF',      // electric blue - primary accent
          dim: '#2B7FC2',
          soft: 'rgba(58,169,255,0.12)',
        },
        indigo: {
          DEFAULT: '#7C6CF0',      // secondary accent
          soft: 'rgba(124,108,240,0.12)',
        },
        ink: {
          DEFAULT: '#E9EEF5',      // primary text
          muted: '#8CA0BE',        // secondary text
          faint: '#5B6B85',        // tertiary / placeholder text
        },
        status: {
          success: '#34D399',
          warning: '#FBBF24',
          danger: '#F87171',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.55)',
        glow: '0 0 0 1px rgba(58,169,255,0.25), 0 8px 30px -10px rgba(58,169,255,0.25)',
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 50% 0%, rgba(58,169,255,0.08), transparent 60%)',
        'target-radial': 'radial-gradient(circle, rgba(58,169,255,0.16) 0%, transparent 70%)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
