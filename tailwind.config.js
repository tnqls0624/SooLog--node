// tailwind.config.js
module.exports = {
  purge: {
    enabled: true,
    content: ['./src/html/**/*.pug'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      lineClamp: {
        3: '3',
        8: '8',
        9: '9',
        10: '10',
      },
    },
    variants: {},
    plugins: [require('@tailwindcss/line-clamp')],
  },
};
