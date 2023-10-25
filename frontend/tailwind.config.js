/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        // sans: ['var(--font-inter)'],
        // mono: ['var(--font-robo)'],
        // josefin: ['var(--font-josefin)']
      },
      fontSize: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      

        
      },
      spacing: {
        '12px': '12px',
      },
      boxShadow: {
        'cont': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'
      },
      colors: {
        'dgray': '#444753',
        'lgray': '#444753f0',
        'ltgray' : '#444753de'
      },
      flex: {
        '2': '2 2 0%'
      }
      
      
    },
  },
  plugins: [],
}
