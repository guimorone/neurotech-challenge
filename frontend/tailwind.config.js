/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        teal: colors.teal,
        rose: colors.rose,
        green: { ...colors.green, 10: '#F0FDF4', 450: '#22C55E' },
      },
      width: { 110: '30rem', 200: '40rem' },
      minHeight: { default: '48px' },
      maxHeight: { 110: '30rem', 200: '40rem', 300: '50rem', 400: '60rem' },
      transitionProperty: { opacity: 'opacity' },
      transitionDuration: { 300: '300ms' },
    },
  },
  plugins: [forms, typography],
  corePlugins: { transitionProperty: false },
};
