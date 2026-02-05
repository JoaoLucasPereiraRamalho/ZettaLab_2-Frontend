module.exports = {
  plugins: {
    tailwindcss: {}, // <--- Certo (v3)
    autoprefixer: {},
    //  '@tailwindcss/postcss': {}, <--- ERRADO (v4) - Se tiver isso, troque!
  },
};
