module.exports = {
  "presets": [
    "@babel/preset-env",
  ],
  "plugins": [
    "@babel/plugin-transform-typescript",
    "@babel/plugin-proposal-class-properties",
      ["@babel/plugin-transform-runtime",
        {
          "regenerator": true
        }
      ]
  ],
  "ignore": [
    "__tests__"
  ]
};
