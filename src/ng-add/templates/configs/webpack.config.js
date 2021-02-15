module.exports = {
  module: {
    rules: [
      {
        test: /\.<%= cssFormat %>$/,
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            syntax: 'postcss<%if (cssFormat === 'scss') { %>-scss<% } %>',
            plugins: [
              require('postcss-import'),
              require('tailwindcss'),
              require('autoprefixer'),
            ],
          },
        },
      },
    ],
  },
};
