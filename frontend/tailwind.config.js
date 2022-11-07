const REM_SIZE = 16
const pxToRem = (px) => `${px / REM_SIZE}rem`

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        128: '32rem',
      },

      colors: {
        text: {
          DEFAULT: '#1B212D',
          light: '#78778B',
          ultralight: '#929EAE',
          white: '#FFFFFF',
        },
        black: {
          DEFAULT: '#202736',
        },
        error: {
          DEFAULT: '#EB5757',
          dark: '#BB1128',
          light: '#FFD8D0',
          ultralight: '#FFEFEF',
        },
        gray: {
          DEFAULT: '#909590',
          dark: '#292D32',
          medium: '#F5F5F5',
          light: '#D4D5D4',
          border: '#E5E5E5',
          ultralight: '#F8F8F8',
        },
        blue: {
          DEFAULT: '#175676',
          dark: '#113E55',
          light: '#1E7099',
        },
        green: {
          DEFAULT: '#27AE60',
          dark: '#1A3131',
          medium: '#29A073',
          light: '#c8ee44',
          ultralight: '#D9FFE9',
          minimal: '#EEFEF2',
          hover: '#84CC16',
          hover2: '#169873',
        },
        orange: {
          DEFAULT: '#D34E24',
          dark: '#FF6A3D',
          light: '#F2994A',
          ultralight: '#FFF1E5',
        },
      },
      fontSize: {
        h1: [pxToRem(32), pxToRem(42)],
        h2: [pxToRem(28), pxToRem(40)],
        h3: [pxToRem(24), pxToRem(32)],
        h4: [pxToRem(20), pxToRem(30)],
        'Ag-18': [pxToRem(18), pxToRem(27)],
        'Ag-16': [pxToRem(16), pxToRem(20)],
        'Ag-15': [pxToRem(15), pxToRem(22)],
        'Ag-14': [pxToRem(14), pxToRem(21)],
        'Ag-13': [pxToRem(13), pxToRem(21)],
        'Ag-10': [pxToRem(10), pxToRem(18)],
        'Ag-12': [pxToRem(12), pxToRem(18)],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
}
