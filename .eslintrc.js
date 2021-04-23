module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "generator-star-spacing": "off",
    "prefer-promise-reject-errors": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: ["error", "always"],
    "space-before-function-paren": 0,
    "comma-dangle": 0,
    "no-unused-vars": 2,
    "vue/no-unused-components": 1,
    "vue/no-v-model-argument": "off",
    "space-before-blocks": "off",
    "prefer-const": 1
  }
};
