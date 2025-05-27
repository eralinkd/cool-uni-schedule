import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false
    }
  }
}).append({
  languageOptions: {
    globals: {
      // Nuxt auto-imports
      useRuntimeConfig: 'readonly',
      navigateTo: 'readonly',
      defineNuxtConfig: 'readonly',
      defineNuxtPlugin: 'readonly',
      defineNuxtRouteMiddleware: 'readonly',
      definePageMeta: 'readonly',
      createError: 'readonly',
      useRouter: 'readonly',
      useRoute: 'readonly',
      useState: 'readonly',
      useCookie: 'readonly',
      useHead: 'readonly',
      useSeoMeta: 'readonly',
      useNuxtApp: 'readonly',
      useRequestHeaders: 'readonly',
      useRequestURL: 'readonly',
      useLazyFetch: 'readonly',
      useFetch: 'readonly',
      $fetch: 'readonly',
      // Pinia
      defineStore: 'readonly',
      // Vue auto-imports
      ref: 'readonly',
      reactive: 'readonly',
      computed: 'readonly',
      watch: 'readonly',
      watchEffect: 'readonly',
      onMounted: 'readonly',
      onUnmounted: 'readonly',
      nextTick: 'readonly'
    }
  },
  rules: {
    'vue/multi-word-component-names': 'off',

    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],

    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',

    'no-multiple-empty-lines': 'off',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'no-trailing-spaces': 'error',
    'eol-last': 'off',
    '@stylistic/eol-last': ['error', 'always'],
    'indent': 'off',
    '@stylistic/indent': ['error', 2, {
      SwitchCase: 1,
      ignoredNodes: ['ConditionalExpression']
    }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'comma-dangle': 'off',
    '@stylistic/comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': 'off',
    '@stylistic/space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-infix-ops': 'error',
    'max-len': ['error', {
      code: 120,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignorePattern: '(class|className)="[^"]*"|<\\w+[^>]*class="[^"]*"[^>]*>'
    }],

    // Vue template formatting
    'vue/html-indent': ['error', 2],
    'vue/html-quotes': ['error', 'double'],
    'vue/max-attributes-per-line': ['error', {
      singleline: 2,
      multiline: 1
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'below'
    }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always'
    }],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'always',
        component: 'always'
      }
    }],
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'p', 'button']
    }],
    'vue/multiline-html-element-content-newline': ['error', {
      ignoreWhenEmpty: true,
      allowEmptyLines: true
    }],
    'vue/max-len': ['error', {
      code: 120,
      template: 120,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreHTMLAttributeValues: false,
      ignoreHTMLTextContents: true
    }]
  }
})
