module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    optionalChaining: true,
    ecmaFeatures: {
      jsx: true,
      spread: true
    }
  },
  env: {
    browser: true,
    jest: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: [
    'babel',
    'react',
    'import',
    'simple-import-sort',
    'es',
    'import-newlines',
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['node_modules', 'build'],
  rules: {
    'arrow-spacing': ['error'],
    'keyword-spacing': ['warn'],
    'key-spacing': ['warn'],
    'no-multi-spaces': 'error',
    'max-len': ['error', 120, {
      ignoreComments: true,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }],
    'jsx-a11y/no-autofocus': ['warn', { ignoreNonDOM: true }],
    'object-curly-spacing': ['error', 'always'],
    'arrow-parens': 'off',
    'space-in-parens': 'warn',
    'no-trailing-spaces': 'warn',
    'no-case-declarations': ['warn'],
    'no-mixed-operators': 'off',
    'operator-linebreak': ['error', 'before'],
    eqeqeq: 'off',
    'no-debugger': 'warn',
    'no-empty': 'warn',
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': [
      'error',
      {
        ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
        ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
        li: ['menuitem', 'option', 'row', 'tab', 'treeitem', 'listitem', 'button'],
        table: ['grid'],
        td: ['gridcell'],
        p: ['textbox']
      }
    ],
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-double'],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    'no-extra-semi': ['error'],
    'no-undef': ['error'],
    'no-unused-vars': ['warn'],
    'no-const-assign': ['error'],
    'no-cond-assign': ['error', 'except-parens'],
    'no-console': ['warn', {
      allow: [
        // 'log',
        // 'dir',
        // 'info',
        'warn',
        'error',
        // 'debug',
        // 'group',
        // 'groupEnd'
      ]
    }],
    'comma-spacing': ['error'],
    'comma-dangle': ['error', 'only-multiline'],
    'callback-return': 'error',
    'react/button-has-type': 'error',

    // https://astexplorer.net/
    'no-restricted-syntax': [
      'error',
      ...[
        ['OBJECT', 'ObjectExpression'],
        ['NEW OBJECT', 'NewExpression'],
        ['ARRAY', 'ArrayExpression']
      ].map(([t, v]) => ({
        selector: `VariableDeclarator[id.type="ObjectPattern"][init.name="props"] Property[value.right.type="${v}"]`,
        message: `Destructuring assignment with ${t} default value is not allowed for React component props.`,
      }))
    ],

    'react/prop-types': ['error'],
    'react/jsx-pascal-case': 'off',
    'react/jsx-curly-spacing': 'error',
    // "react/sort-prop-types": ["error", { callbacksLast: true }],
    // "react/jsx-sort-default-props": ["error"],
    'react/jsx-tag-spacing': ['error'],
    'react/jsx-wrap-multilines': ['error', {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'ignore',
      logical: 'parens-new-line',
      prop: 'ignore'
    }],
    'react/no-unused-prop-types': ['warn'],
    'react/no-unknown-property': ['error'],
    'react/default-props-match-prop-types': ['error'],
    'react/no-array-index-key': ['error'],
    'react/no-danger-with-children': ['error'],
    'react/sort-comp': ['warn', {
      order: [
        'initialData',
        'setters',
        'static-methods',
        'lifecycle',
        '/^public_.+$/',
        'everything-else',
        '/^on.+$/',
        '/^render.+$/',
        'render'
      ],
      groups: {
        initialData: [
          'selfId',
          'state',
          'DOM'
        ]
      }
    }],
    'simple-import-sort/imports': ['error', {
      groups: [
        // imports with side-effects starts with \u0000 (simple-import-sort feature)
        ['^react$', '^prop-types$', '^classnames$'],
        ['^\\u0000'],
        ['^@?\\w'],
        ['^[^.]'],
        ['^\\.\\./'],
        ['^\\./'],
        ['^.*\\.locales?(\\.js)?$', '^\\u0000?\\./.*\\.(css|sass|scss)$']
      ],
    }],
    'import/newline-after-import': ['error', {
      count: 2,
    }],
    'import/order': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'import/no-anonymous-default-export': 'off',
    'no-useless-backreference': 'warn',
    'es/no-regexp-lookbehind-assertions': 'warn',
    'template-curly-spacing': 'error',
    'computed-property-spacing': 'error',
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'multiline-arguments'],
    'newline-per-chained-call': 'error',
    'import-newlines/enforce': ['error', { items: 1 }],
  },
  globals: {
    __: true,
    __dirname: true,
    App: true,
    fetch: true,
    module: true,
    require: true,
    process: true,
    promise: true,
    Promise: true
  }
};
