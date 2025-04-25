module.exports = {
  extends: [
    'next/core-web-vitals', // Next.js best practices
    'plugin:@typescript-eslint/recommended', // TypeScript rules
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Customize or disable rules as needed here
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
