module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Disable the problematic rules for production build
    'jsx-a11y/anchor-is-valid': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn'
  }
};