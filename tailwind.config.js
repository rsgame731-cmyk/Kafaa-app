/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#101114',       // Near-black charcoal (Primary Background)
          surface: '#181A1D',    // Dark graphite (Secondary Surface)
          elevated: '#202226',   // Slightly lighter charcoal (Elevated Surface)
          border: '#282A2E',     // Subtle dark border
          bronze: {
            DEFAULT: '#A96832',  // Warm bronze / copper primary accent
            hover: '#BD7A3E',    // Light warm bronze
            light: '#C9854B',
            muted: '#A9683230',
            glow: '#A9683250'
          },
          cream: '#E8DED0',      // Warm ivory / cream primary text
          muted: '#A7A19A',      // Muted warm gray secondary text
          darkgray: '#15171A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'Cairo', 'sans-serif'],
        arabic: ['Tajawal', 'Cairo', 'sans-serif']
      },
      borderRadius: {
        'card': '18px',
        'button': '24px',
        'input': '16px',
        'modal': '24px',
        'nav': '28px'
      },
      boxShadow: {
        'bronze-glow': '0 4px 20px -2px rgba(169, 104, 50, 0.3)',
        'dark-soft': '0 10px 30px -5px rgba(0, 0, 0, 0.7)',
        'elevated': '0 12px 32px -4px rgba(0, 0, 0, 0.85)'
      }
    },
  },
  plugins: [],
}
