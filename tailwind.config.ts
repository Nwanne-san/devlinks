import type { Config } from 'tailwindcss';

const config: Config = {
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
      boxShadow: {
        'custom-shadow':
          '0 4px 15px rgba(190, 173, 255, 0.6), 0 1px 10px rgba(190, 173, 255, 0.6)',
      },
      backgroundColor: {
        primary: '#FAFAFA',
        secondary: '#633CFF',
        tertiary: '#BEADFF',
      },
      textColor: {
        primary: '#333333',
        secondary: '#633CFF',
      },
      colors: {
        primary: '#FAFAFA',
        secondary: '#633CFF',
        tertiary: '#BEADFF',
        black: '#333333',
        red: '#FF3939',
        gray: '#737373',
        purple: '#EFEBFF',
        dark: '#EEEEEE',
      },
    },
  },
  plugins: [],
};
export default config;
