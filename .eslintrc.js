module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    //'eslint:recommended',
    'plugin:vue/recommended', // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    // override/add rules settings here, such as:
    //'vue/no-unused-vars': 'error'
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": "off",
    "vue/attribute-hyphenation": 'off',
    "vue/no-mutating-props": 'off',
    "vue/html-indent": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  }
}